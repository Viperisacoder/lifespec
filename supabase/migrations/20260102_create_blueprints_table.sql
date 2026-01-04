-- Create blueprints table
CREATE TABLE IF NOT EXISTS blueprints (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  name text DEFAULT 'My Blueprint',
  blueprint_json jsonb NOT NULL,
  metrics_json jsonb NOT NULL,
  
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
CREATE OR REPLACE FUNCTION update_blueprints_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to update updated_at on update
CREATE TRIGGER update_blueprints_updated_at
BEFORE UPDATE ON blueprints
FOR EACH ROW
EXECUTE FUNCTION update_blueprints_updated_at();
