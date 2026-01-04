-- Add Pro columns to profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS is_pro boolean DEFAULT false,
ADD COLUMN IF NOT EXISTS pro_unlocked_at timestamptz,
ADD COLUMN IF NOT EXISTS pro_source text,
ADD COLUMN IF NOT EXISTS pro_payer_email text;

-- Create paypal_claims table to prevent event reuse
CREATE TABLE IF NOT EXISTS public.paypal_claims (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  created_at timestamptz DEFAULT now(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  payer_email text NOT NULL,
  matched_event_id text NOT NULL UNIQUE
);

-- Create indexes for efficient querying
CREATE INDEX IF NOT EXISTS idx_paypal_claims_user_id ON public.paypal_claims(user_id);
CREATE INDEX IF NOT EXISTS idx_paypal_claims_payer_email ON public.paypal_claims(payer_email);
CREATE INDEX IF NOT EXISTS idx_paypal_claims_event_id ON public.paypal_claims(matched_event_id);

-- Enable RLS on paypal_claims
ALTER TABLE public.paypal_claims ENABLE ROW LEVEL SECURITY;

-- RLS policy: users can only see their own claims
CREATE POLICY "Users can view their own paypal claims"
  ON public.paypal_claims
  FOR SELECT
  USING (auth.uid() = user_id);

-- RLS policy: service role can insert claims
CREATE POLICY "Service role can insert paypal claims"
  ON public.paypal_claims
  FOR INSERT
  WITH CHECK (true);
