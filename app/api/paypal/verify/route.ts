import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const PAYPAL_MIN_AMOUNT = 2.99;
const PAYPAL_CURRENCY = 'USD';
const EVENT_VALIDITY_HOURS = 24;
const RATE_LIMIT_COOLDOWN_SECONDS = 5;

interface VerifyRequest {
  payerEmail: string;
}

interface VerifyResponse {
  success: boolean;
  message: string;
  isPro?: boolean;
}

/**
 * POST /api/paypal/verify
 * Verifies PayPal payment and unlocks Pro for authenticated user
 */
export async function POST(req: NextRequest): Promise<NextResponse<VerifyResponse>> {
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

    // Get authorization header
    const authHeader = req.headers.get('authorization');
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const token = authHeader.substring(7);

    // Verify token with Supabase
    const supabaseAuth = createClient(supabaseUrl, supabaseAnonKey);
    const { data: { user }, error: authError } = await supabaseAuth.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json(
        { success: false, message: 'Unauthorized. Please log in.' },
        { status: 401 }
      );
    }

    const userId = user.id;

    // Parse request body
    const body = (await req.json()) as VerifyRequest;
    const { payerEmail } = body;

    if (!payerEmail || typeof payerEmail !== 'string') {
      return NextResponse.json(
        { success: false, message: 'PayPal email is required.' },
        { status: 400 }
      );
    }

    // Normalize email
    const normalizedEmail = payerEmail.trim().toLowerCase();

    // Initialize Supabase client with service role (server-side only)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Check if user is already Pro
    const { data: profileData, error: profileError } = await supabase
      .from('profiles')
      .select('is_pro')
      .eq('id', userId)
      .single();

    if (profileError) {
      console.error('Error fetching profile:', profileError);
      return NextResponse.json(
        { success: false, message: 'Error checking Pro status.' },
        { status: 500 }
      );
    }

    if (profileData?.is_pro) {
      return NextResponse.json(
        { success: true, message: 'Already unlocked! You are already a Pro member.', isPro: true },
        { status: 200 }
      );
    }

    // Check rate limit (simple: last verification attempt within cooldown)
    const { data: lastClaim } = await supabase
      .from('paypal_claims')
      .select('created_at')
      .eq('user_id', userId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single();

    if (lastClaim) {
      const lastClaimTime = new Date(lastClaim.created_at).getTime();
      const now = Date.now();
      const secondsElapsed = (now - lastClaimTime) / 1000;

      if (secondsElapsed < RATE_LIMIT_COOLDOWN_SECONDS) {
        return NextResponse.json(
          { success: false, message: `Please wait ${Math.ceil(RATE_LIMIT_COOLDOWN_SECONDS - secondsElapsed)} seconds before trying again.` },
          { status: 429 }
        );
      }
    }

    // Query paypal_events for matching payment
    const cutoffTime = new Date(Date.now() - EVENT_VALIDITY_HOURS * 60 * 60 * 1000).toISOString();

    const { data: events, error: eventsError } = await supabase
      .from('paypal_events')
      .select('*')
      .eq('payer_email', normalizedEmail)
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
        { success: false, message: 'No recent payment found for this email. Please check the email and try again. Payments may take 1-2 minutes to appear.' },
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
      const { data: existingClaim } = await supabase
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
      return NextResponse.json(
        { success: false, message: 'Payment amount is insufficient or already used. Please check and try again.' },
        { status: 400 }
      );
    }

    // Update user profile to Pro
    const { error: updateError } = await supabase
      .from('profiles')
      .update({
        is_pro: true,
        pro_unlocked_at: new Date().toISOString(),
        pro_source: 'paypal',
        pro_payer_email: normalizedEmail,
      })
      .eq('id', userId);

    if (updateError) {
      console.error('Error updating profile:', updateError);
      return NextResponse.json(
        { success: false, message: 'Error unlocking Pro. Please try again.' },
        { status: 500 }
      );
    }

    // Record the claim
    const { error: claimError } = await supabase
      .from('paypal_claims')
      .insert({
        user_id: userId,
        payer_email: normalizedEmail,
        matched_event_id: validEvent.event_id,
      });

    if (claimError) {
      console.error('Error recording claim:', claimError);
      // Note: Profile was already updated, so user is Pro even if claim recording fails
      // This is acceptable for idempotency
    }

    console.log(`User ${userId} unlocked Pro with event ${validEvent.event_id}`);

    return NextResponse.json(
      { success: true, message: 'Success! Pro unlocked. Redirecting to dashboard...', isPro: true },
      { status: 200 }
    );
  } catch (error) {
    console.error('Verification error:', error);
    return NextResponse.json(
      { success: false, message: 'An unexpected error occurred. Please try again.' },
      { status: 500 }
    );
  }
}
