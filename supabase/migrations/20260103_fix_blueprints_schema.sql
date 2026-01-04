-- Drop existing table and recreate with correct schema
-- This migration fixes the blueprints table to properly enforce 1 blueprint per user
-- and ensures proper error handling

DROP TABLE IF EXISTS blueprints CASCADE;

-- Create blueprints table with simplified, correct schema
CREATE TABLE public.blueprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  blueprint jsonb NOT NULL,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create index on user_id for faster lookups
CREATE INDEX idx_blueprints_user_id ON public.blueprints(user_id);

-- Enable Row Level Security
ALTER TABLE public.blueprints ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can select their own blueprints" ON public.blueprints;
DROP POLICY IF EXISTS "Users can insert their own blueprints" ON public.blueprints;
DROP POLICY IF EXISTS "Users can update their own blueprints" ON public.blueprints;
DROP POLICY IF EXISTS "Users can delete their own blueprints" ON public.blueprints;

-- Create RLS policies
-- Users can only select their own blueprints
CREATE POLICY "Users can select their own blueprints"
  ON public.blueprints
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own blueprints
CREATE POLICY "Users can insert their own blueprints"
  ON public.blueprints
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own blueprints
CREATE POLICY "Users can update their own blueprints"
  ON public.blueprints
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own blueprints
CREATE POLICY "Users can delete their own blueprints"
  ON public.blueprints
  FOR DELETE
  USING (auth.uid() = user_id);

-- Drop existing trigger/function if they exist
DROP TRIGGER IF EXISTS update_blueprints_updated_at ON public.blueprints;
DROP FUNCTION IF EXISTS update_blueprints_updated_at();

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.update_blueprints_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on any UPDATE
CREATE TRIGGER update_blueprints_updated_at
BEFORE UPDATE ON public.blueprints
FOR EACH ROW
EXECUTE FUNCTION public.update_blueprints_updated_at();
