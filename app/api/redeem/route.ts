import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

interface RedeemRequest {
  paypalEmail: string;
  accountEmail: string;
  password: string;
}

interface RedeemResponse {
  success: boolean;
  message: string;
}

const PAYPAL_MIN_AMOUNT = 2.99;
const PAYPAL_CURRENCY = 'USD';
const EVENT_VALIDITY_HOURS = 48;

/**
 * POST /api/redeem
 * Creates a new user account after verifying PayPal payment
 */
export async function POST(req: NextRequest): Promise<NextResponse<RedeemResponse>> {
  try {
    // Get environment variables
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseAnonKey || !supabaseServiceKey) {
      console.error('Missing Supabase environment variables');
      return NextResponse.json(
        { success: false, message: 'Server configuration error.' },
        { status: 500 }
      );
    }

    // Parse request body
    const body = (await req.json()) as RedeemRequest;
    const { paypalEmail, accountEmail, password } = body;

    // Validate inputs
    if (!paypalEmail || !accountEmail || !password) {
      return NextResponse.json(
        { success: false, message: 'All fields are required.' },
        { status: 400 }
      );
    }

    if (password.length < 8) {
      return NextResponse.json(
        { success: false, message: 'Password must be at least 8 characters.' },
        { status: 400 }
      );
    }

    // Normalize emails
    const normalizedPaypalEmail = paypalEmail.trim().toLowerCase();
    const normalizedAccountEmail = accountEmail.trim().toLowerCase();

    // Initialize Supabase client with service role
    const supabaseService = createClient(supabaseUrl, supabaseServiceKey);

    // Query paypal_events for matching payment
    const cutoffTime = new Date(Date.now() - EVENT_VALIDITY_HOURS * 60 * 60 * 1000).toISOString();

    const { data: events, error: eventsError } = await supabaseService
      .from('paypal_events')
      .select('*')
      .eq('payer_email', normalizedPaypalEmail)
      .in('event_type', ['PAYMENT.CAPTURE.COMPLETED', 'CHECKOUT.ORDER.COMPLETED'])
      .gte('created_at', cutoffTime)
      .order('created_at', { ascending: false })
      .limit(10);

    if (eventsError) {
      console.error('Error querying PayPal events:', eventsError);
      return NextResponse.json(
        { success: false, message: 'Error verifying payment.' },
        { status: 500 }
      );
    }

    if (!events || events.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No recent payment found for this PayPal email. Please check the email and try again. Payments may take 30–90 seconds to appear.' },
        { status: 404 }
      );
    }

    // Find first valid event (with sufficient amount)
    let validEvent = null;

    for (const event of events) {
      // Check amount
      let amount = event.amount_value;

      // Fallback: parse from raw JSON if amount_value is null
      if (!amount && event.raw) {
        try {
          const raw = typeof event.raw === 'string' ? JSON.parse(event.raw) : event.raw;
          amount = raw.resource?.amount?.value || 
                   raw.resource?.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value;
          if (amount) {
            amount = parseFloat(amount);
          }
        } catch (e) {
          console.error('Error parsing raw event:', e);
        }
      }

      // Validate amount
      if (!amount || amount < PAYPAL_MIN_AMOUNT) {
        continue;
      }

      // Validate currency (if present)
      const currency = event.amount_currency || 
                      (event.raw && typeof event.raw === 'object' 
                        ? (event.raw as any).resource?.amount?.currency_code 
                        : null);
      
      if (currency && currency !== PAYPAL_CURRENCY) {
        console.warn(`Skipping event ${event.event_id}: currency ${currency} != ${PAYPAL_CURRENCY}`);
        continue;
      }

      // Check if event already claimed
      const { data: existingClaim } = await supabaseService
        .from('paypal_claims')
        .select('id')
        .eq('matched_event_id', event.event_id)
        .single();

      if (existingClaim) {
        console.warn(`Event ${event.event_id} already claimed`);
        continue;
      }

      validEvent = event;
      break;
    }

    if (!validEvent) {
      console.error(`No valid payment found for ${normalizedPaypalEmail}`);
      return NextResponse.json(
        { success: false, message: 'Payment amount is insufficient or already used. Please check and try again.' },
        { status: 400 }
      );
    }

    // CRITICAL: Verify payment one more time before account creation
    console.log(`✓ Payment verified: Event ${validEvent.event_id}, Amount: ${validEvent.amount_value} ${validEvent.amount_currency}, Payer: ${validEvent.payer_email}`);

    // Create Supabase auth user
    const { data: authData, error: authError } = await supabaseService.auth.admin.createUser({
      email: normalizedAccountEmail,
      password,
      email_confirm: true,
    });

    if (authError) {
      console.error('Error creating auth user:', authError);
      
      // Check if user already exists
      if (authError.message.includes('already exists')) {
        return NextResponse.json(
          { success: false, message: 'Account already exists with this email. Please sign in instead.' },
          { status: 409 }
        );
      }

      return NextResponse.json(
        { success: false, message: 'Error creating account. Please try again.' },
        { status: 500 }
      );
    }

    if (!authData.user) {
      return NextResponse.json(
        { success: false, message: 'Error creating account. Please try again.' },
        { status: 500 }
      );
    }

    const userId = authData.user.id;

    // Upsert profile with Pro status
    const { error: profileError } = await supabaseService
      .from('profiles')
      .upsert({
        id: userId,
        is_pro: true,
        pro_unlocked_at: new Date().toISOString(),
        pro_source: 'paypal',
        pro_payer_email: normalizedPaypalEmail,
      }, {
        onConflict: 'id',
      });

    if (profileError) {
      console.error('Error updating profile:', profileError);
      return NextResponse.json(
        { success: false, message: 'Error setting up account. Please contact support.' },
        { status: 500 }
      );
    }

    // Record the claim
    const { error: claimError } = await supabaseService
      .from('paypal_claims')
      .insert({
        user_id: userId,
        payer_email: normalizedPaypalEmail,
        matched_event_id: validEvent.event_id,
      });

    if (claimError) {
      console.error('Error recording claim:', claimError);
      // Note: Account was already created, so we continue despite this error
    }

    console.log(`New user ${userId} created with Pro access via PayPal event ${validEvent.event_id}`);

    return NextResponse.json(
      { success: true, message: 'Account created successfully! You can now sign in.' },
      { status: 200 }
    );
  } catch (error) {
    console.error('Redeem error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
