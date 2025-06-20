/*
  # Create scholarship applications table

  1. New Tables
    - `applications`
      - `id` (uuid, primary key)
      - `title` (text, required) - Scholarship title
      - `link` (text, required) - Application link
      - `deadline` (date, required) - Application deadline
      - `status` (text, required) - Application status (applied, pending, won, rejected)
      - `submitted_at` (timestamp) - When application was submitted
      - `notes` (text) - Additional notes
      - `created_at` (timestamp) - Record creation time
      - `updated_at` (timestamp) - Record update time
      - `user_id` (uuid) - Reference to authenticated user

  2. Security
    - Enable RLS on `applications` table
    - Add policies for authenticated users to manage their own applications
    - Add policy for service role to insert applications (for Runner H)

  3. Indexes
    - Index on user_id for faster queries
    - Index on status for filtering
    - Index on deadline for sorting
*/

CREATE TABLE IF NOT EXISTS applications (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  title text NOT NULL,
  link text NOT NULL,
  deadline date NOT NULL,
  status text NOT NULL CHECK (status IN ('applied', 'pending', 'won', 'rejected')),
  submitted_at timestamptz,
  notes text DEFAULT '',
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE
);

-- Enable RLS
ALTER TABLE applications ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users
CREATE POLICY "Users can view own applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own applications"
  ON applications
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own applications"
  ON applications
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete own applications"
  ON applications
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy for service role (Runner H) to insert applications
CREATE POLICY "Service role can insert applications"
  ON applications
  FOR INSERT
  TO service_role
  WITH CHECK (true);

-- Indexes for performance
CREATE INDEX IF NOT EXISTS idx_applications_user_id ON applications(user_id);
CREATE INDEX IF NOT EXISTS idx_applications_status ON applications(status);
CREATE INDEX IF NOT EXISTS idx_applications_deadline ON applications(deadline);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = now();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_applications_updated_at
    BEFORE UPDATE ON applications
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();