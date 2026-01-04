import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

// Types for PayPal webhook event
interface PayPalWebhookEvent {
  id: string;
  event_type: string;
  summary?: string;
  resource_type?: string;
  resource?: {
    id?: string;
    amount?: {
      value?: string;
      currency_code?: string;
    };
    payer?: {
      email_address?: string;
    };
    purchase_units?: Array<{
      payments?: {
        captures?: Array<{
          amount?: {
            value?: string;
            currency_code?: string;
          };
        }>;
      };
    }>;
    supplementary_data?: {
      related_ids?: {
        order_id?: string;
      };
    };
  };
  create_time?: string;
}

interface PayPalVerifyRequest {
  auth_algo: string;
  cert_url: string;
  transmission_id: string;
  transmission_sig: string;
  transmission_time: string;
  webhook_id: string;
  webhook_event: PayPalWebhookEvent;
}

interface PayPalVerifyResponse {
  verification_status: "SUCCESS" | "FAILURE";
}

interface PayPalTokenResponse {
  access_token: string;
  token_type: string;
  expires_in: number;
}

// Get PayPal access token using client credentials flow
async function getPayPalAccessToken(
  clientId: string,
  clientSecret: string,
  env: "live" | "sandbox"
): Promise<string> {
  const baseUrl =
    env === "live"
      ? "https://api.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  const auth = btoa(`${clientId}:${clientSecret}`);

  const response = await fetch(`${baseUrl}/v1/oauth2/token`, {
    method: "POST",
    headers: {
      Authorization: `Basic ${auth}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: "grant_type=client_credentials",
  });

  if (!response.ok) {
    throw new Error(`Failed to get PayPal access token: ${response.statusText}`);
  }

  const data = (await response.json()) as PayPalTokenResponse;
  return data.access_token;
}

// Verify PayPal webhook signature
async function verifyPayPalSignature(
  event: PayPalWebhookEvent,
  headers: Record<string, string>,
  webhookId: string,
  accessToken: string,
  env: "live" | "sandbox"
): Promise<boolean> {
  const baseUrl =
    env === "live"
      ? "https://api.paypal.com"
      : "https://api-m.sandbox.paypal.com";

  const verifyRequest: PayPalVerifyRequest = {
    auth_algo: headers["paypal-auth-algo"] || "",
    cert_url: headers["paypal-cert-url"] || "",
    transmission_id: headers["paypal-transmission-id"] || "",
    transmission_sig: headers["paypal-transmission-sig"] || "",
    transmission_time: headers["paypal-transmission-time"] || "",
    webhook_id: webhookId,
    webhook_event: event,
  };

  const response = await fetch(
    `${baseUrl}/v1/notifications/verify-webhook-signature`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${accessToken}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(verifyRequest),
    }
  );

  if (!response.ok) {
    console.error(
      `PayPal verification failed: ${response.status} ${response.statusText}`
    );
    return false;
  }

  const data = (await response.json()) as PayPalVerifyResponse;
  return data.verification_status === "SUCCESS";
}

// Extract payment details from PayPal event
function extractPaymentDetails(event: PayPalWebhookEvent) {
  let resourceId = event.resource?.id;
  let amountValue: string | undefined;
  let amountCurrency: string | undefined;
  let payerEmail: string | undefined;

  // Try to get resource ID from supplementary data (for orders)
  if (!resourceId && event.resource?.supplementary_data?.related_ids?.order_id) {
    resourceId = event.resource.supplementary_data.related_ids.order_id;
  }

  // Try to get amount from resource.amount
  if (event.resource?.amount) {
    amountValue = event.resource.amount.value;
    amountCurrency = event.resource.amount.currency_code;
  }

  // Try to get amount from purchase_units (for orders)
  if (
    !amountValue &&
    event.resource?.purchase_units?.[0]?.payments?.captures?.[0]?.amount
  ) {
    amountValue =
      event.resource.purchase_units[0].payments.captures[0].amount.value;
    amountCurrency =
      event.resource.purchase_units[0].payments.captures[0].amount
        .currency_code;
  }

  // Get payer email
  if (event.resource?.payer?.email_address) {
    payerEmail = event.resource.payer.email_address;
  }

  return {
    resourceId,
    amountValue,
    amountCurrency,
    payerEmail,
  };
}

// Main webhook handler
Deno.serve(async (req) => {
  // Only accept POST requests
  if (req.method !== "POST") {
    return new Response(JSON.stringify({ error: "Method not allowed" }), {
      status: 405,
      headers: { "Content-Type": "application/json" },
    });
  }

  try {
    // Get environment variables
    const paypalClientId = Deno.env.get("PAYPAL_CLIENT_ID");
    const paypalClientSecret = Deno.env.get("PAYPAL_CLIENT_SECRET");
    const paypalWebhookId = Deno.env.get("PAYPAL_WEBHOOK_ID");
    const paypalEnv = (Deno.env.get("PAYPAL_ENV") || "sandbox") as
      | "live"
      | "sandbox";
    const supabaseUrl = Deno.env.get("SUPABASE_URL");
    const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    // Validate required environment variables
    if (
      !paypalClientId ||
      !paypalClientSecret ||
      !paypalWebhookId ||
      !supabaseUrl ||
      !supabaseServiceKey
    ) {
      console.error("Missing required environment variables");
      return new Response(
        JSON.stringify({ error: "Configuration error" }),
        {
          status: 500,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Read and parse request body
    const body = await req.text();
    const event = JSON.parse(body) as PayPalWebhookEvent;

    // Validate event has required fields
    if (!event.id || !event.event_type) {
      console.error("Invalid PayPal event: missing id or event_type");
      return new Response(
        JSON.stringify({ error: "Invalid event format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Get headers (normalize to lowercase for case-insensitive lookup)
    const headers: Record<string, string> = {};
    req.headers.forEach((value, key) => {
      headers[key.toLowerCase()] = value;
    });

    // Check for required PayPal headers
    const requiredHeaders = [
      "paypal-transmission-id",
      "paypal-transmission-time",
      "paypal-transmission-sig",
      "paypal-cert-url",
      "paypal-auth-algo",
    ];

    const missingHeaders = requiredHeaders.filter((h) => !headers[h]);
    const hasAllHeaders = missingHeaders.length === 0;

    if (!hasAllHeaders) {
      console.warn(`[SANDBOX] Missing headers: ${missingHeaders.join(", ")}`);
    }

    // Initialize Supabase client with service role
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // SANDBOX MODE: Allow events even without proper signature verification
    if (paypalEnv === "sandbox") {
      console.log(`[SANDBOX MODE] Processing webhook for event ${event.id}`);
      console.log(`[SANDBOX] Headers present: ${hasAllHeaders ? "YES" : "NO"} ${!hasAllHeaders ? `(missing: ${missingHeaders.join(", ")})` : ""}`);

      let isValid = false;
      let verificationStatus = "SKIPPED";

      // Try to verify if headers are present
      if (hasAllHeaders) {
        try {
          const accessToken = await getPayPalAccessToken(
            paypalClientId,
            paypalClientSecret,
            paypalEnv
          );

          isValid = await verifyPayPalSignature(
            event,
            headers,
            paypalWebhookId,
            accessToken,
            paypalEnv
          );

          verificationStatus = isValid ? "SUCCESS" : "FAILURE";
          console.log(`[SANDBOX] Verification status: ${verificationStatus}`);
        } catch (verifyError) {
          console.warn(
            `[SANDBOX] Verification error: ${verifyError instanceof Error ? verifyError.message : String(verifyError)}`
          );
          verificationStatus = "ERROR";
        }
      } else {
        console.log(`[SANDBOX] Headers missing, skipping verification`);
      }

      // Extract payment details
      const { resourceId, amountValue, amountCurrency, payerEmail } =
        extractPaymentDetails(event);

      // Store event in database for sandbox testing
      const sandboxEventType = hasAllHeaders && isValid 
        ? event.event_type 
        : `SANDBOX.TEST.${event.event_type}`;

      console.log(
        `[SANDBOX] Inserting event: id=${event.id}, type=${sandboxEventType}, verification=${verificationStatus}, payer=${payerEmail || "unknown"}`
      );

      const { error: insertError } = await supabase
        .from("paypal_events")
        .insert({
          event_id: event.id,
          event_type: sandboxEventType,
          summary: event.summary || null,
          resource_type: event.resource_type || null,
          resource_id: resourceId || null,
          amount_value: amountValue ? parseFloat(amountValue) : null,
          amount_currency: amountCurrency || null,
          payer_email: payerEmail || null,
          raw: event,
        });

      if (insertError) {
        if (insertError.code === "23505") {
          console.log(`[SANDBOX] ✓ Event ${event.id} already exists (duplicate), returning 200`);
        } else {
          console.error(`[SANDBOX] ✗ Insert failed - Error: ${insertError.message} (Code: ${insertError.code})`);
          // Still return 200 in sandbox to not fail the webhook
          console.log(`[SANDBOX] Returning 200 despite insert error (sandbox mode)`);
        }
      } else {
        console.log(`[SANDBOX] ✓ Event inserted successfully: ${event.id}`);
      }

      return new Response(JSON.stringify({ ok: true, sandbox: true, inserted: !insertError }), {
        status: 200,
        headers: { "Content-Type": "application/json" },
      });
    }

    // PRODUCTION MODE: Strict signature verification required
    console.log(`[PRODUCTION] Processing webhook for event ${event.id}`);

    // Verify required PayPal headers
    for (const header of requiredHeaders) {
      if (!headers[header]) {
        console.error(`[PRODUCTION] Missing required header: ${header}`);
        return new Response(
          JSON.stringify({ error: `Missing header: ${header}` }),
          {
            status: 400,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    }

    // Get PayPal access token
    const accessToken = await getPayPalAccessToken(
      paypalClientId,
      paypalClientSecret,
      paypalEnv
    );

    // Verify webhook signature with PayPal
    const isValid = await verifyPayPalSignature(
      event,
      headers,
      paypalWebhookId,
      accessToken,
      paypalEnv
    );

    console.log(`[PRODUCTION] Signature verification: ${isValid ? "SUCCESS" : "FAILURE"}`);

    if (!isValid) {
      console.error(`[PRODUCTION] Webhook signature verification failed for event ${event.id}`);
      return new Response(
        JSON.stringify({ error: "Signature verification failed" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json" },
        }
      );
    }

    // Extract payment details
    const { resourceId, amountValue, amountCurrency, payerEmail } =
      extractPaymentDetails(event);

    // Insert event into database (idempotent - will fail silently if event_id already exists)
    console.log(`[PRODUCTION] Inserting event: ${event.id}, type: ${event.event_type}`);

    const { error: insertError } = await supabase
      .from("paypal_events")
      .insert({
        event_id: event.id,
        event_type: event.event_type,
        summary: event.summary || null,
        resource_type: event.resource_type || null,
        resource_id: resourceId || null,
        amount_value: amountValue ? parseFloat(amountValue) : null,
        amount_currency: amountCurrency || null,
        payer_email: payerEmail || null,
        raw: event,
      });

    // Check for duplicate event (idempotent behavior)
    if (insertError) {
      if (insertError.code === "23505") {
        // Unique constraint violation - event already processed
        console.log(`[PRODUCTION] Event ${event.id} already processed, ignoring duplicate`);
      } else {
        console.error(`[PRODUCTION] Database insert error: ${insertError.message}`);
        return new Response(
          JSON.stringify({ error: "Database error" }),
          {
            status: 500,
            headers: { "Content-Type": "application/json" },
          }
        );
      }
    } else {
      console.log(`[PRODUCTION] ✓ Event inserted successfully: ${event.id}`);
    }

    console.log(`[PRODUCTION] Successfully processed PayPal event: ${event.id} (${event.event_type})`);

    // Return 200 OK immediately to acknowledge receipt
    return new Response(JSON.stringify({ ok: true }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error(`Webhook handler error: ${error instanceof Error ? error.message : String(error)}`);
    return new Response(
      JSON.stringify({ error: "Internal server error" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
});
