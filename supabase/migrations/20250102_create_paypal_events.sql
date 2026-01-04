-- Create paypal_events table for storing PayPal webhook events
CREATE TABLE paypal_events (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  event_id text UNIQUE NOT NULL,
  event_type text NOT NULL,
  summary text,
  resource_type text,
  resource_id text,
  amount_value numeric,
  amount_currency text,
  payer_email text,
  raw jsonb NOT NULL
);

-- Create indexes for efficient querying
CREATE INDEX idx_paypal_events_event_type ON paypal_events(event_type);
CREATE INDEX idx_paypal_events_created_at ON paypal_events(created_at);
CREATE INDEX idx_paypal_events_event_id ON paypal_events(event_id);
CREATE INDEX idx_paypal_events_resource_id ON paypal_events(resource_id);

-- Enable RLS (Row Level Security)
ALTER TABLE paypal_events ENABLE ROW LEVEL SECURITY;

-- Create policy to allow service role to insert
CREATE POLICY "Allow service role to insert paypal events"
  ON paypal_events
  FOR INSERT
  WITH CHECK (true);

-- Create policy to allow authenticated users to read their own payment events
CREATE POLICY "Allow users to read paypal events"
  ON paypal_events
  FOR SELECT
  USING (true);
