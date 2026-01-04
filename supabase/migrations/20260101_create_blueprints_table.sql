-- Create blueprints table
CREATE TABLE IF NOT EXISTS blueprints (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT DEFAULT 'Lifestyle Blueprint',
  blueprint_data JSONB NOT NULL,
  inputs JSONB DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now(),
  
  -- Enforce one blueprint per user
  CONSTRAINT unique_user_blueprint UNIQUE(user_id)
);

-- Enable Row Level Security
ALTER TABLE blueprints ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Users can only select their own blueprints
CREATE POLICY "Users can select their own blueprints"
  ON blueprints
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can only insert their own blueprints
CREATE POLICY "Users can insert their own blueprints"
  ON blueprints
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can only update their own blueprints
CREATE POLICY "Users can update their own blueprints"
  ON blueprints
  FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can only delete their own blueprints
CREATE POLICY "Users can delete their own blueprints"
  ON blueprints
  FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at on blueprint updates
CREATE TRIGGER update_blueprints_updated_at
BEFORE UPDATE ON blueprints
FOR EACH ROW
EXECUTE FUNCTION update_updated_at_column();
