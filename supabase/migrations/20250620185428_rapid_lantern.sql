/*
  # Insert seed data for testing

  1. Seed Data
    - Sample scholarship applications with various statuses
    - Realistic deadlines and application data
    - Mix of applied, pending, won, and rejected statuses

  Note: This creates demo data that can be used for testing.
  The user_id will be set to NULL for demo purposes, which is allowed
  since we'll update the foreign key constraint to be nullable.
*/

-- First, make user_id nullable to allow demo data
ALTER TABLE applications ALTER COLUMN user_id DROP NOT NULL;

-- Update the foreign key constraint to allow NULL values
ALTER TABLE applications DROP CONSTRAINT IF EXISTS applications_user_id_fkey;
ALTER TABLE applications ADD CONSTRAINT applications_user_id_fkey 
  FOREIGN KEY (user_id) REFERENCES auth.users(id) ON DELETE CASCADE;

-- Insert seed applications with NULL user_id for demo purposes
INSERT INTO applications (title, link, deadline, status, submitted_at, notes, user_id) VALUES
  (
    'Gates Millennium Scholarship',
    'https://www.gatesfoundation.org/scholarships',
    '2024-12-15',
    'applied',
    '2024-11-01 10:30:00',
    'Strong essay submitted focusing on community service and leadership experience.',
    NULL
  ),
  (
    'National Merit Scholarship',
    'https://www.nationalmerit.org/',
    '2024-11-30',
    'pending',
    NULL,
    'Waiting for PSAT scores to be released. Need to submit additional documentation.',
    NULL
  ),
  (
    'Coca-Cola Scholars Program',
    'https://www.coca-colascholarsfoundation.org/',
    '2024-10-31',
    'won',
    '2024-09-15 14:20:00',
    'Received $20,000 scholarship! Interview went extremely well.',
    NULL
  ),
  (
    'Dell Scholars Program',
    'https://www.dellscholars.org/',
    '2024-12-01',
    'rejected',
    '2024-10-01 09:15:00',
    'Did not meet GPA requirements. Will reapply next year.',
    NULL
  ),
  (
    'Jack Kent Cooke Foundation Scholarship',
    'https://www.jkcf.org/our-scholarships/',
    '2024-11-25',
    'applied',
    '2024-10-20 16:45:00',
    'Comprehensive application with financial aid documentation submitted.',
    NULL
  ),
  (
    'QuestBridge National College Match',
    'https://www.questbridge.org/',
    '2024-12-10',
    'pending',
    NULL,
    'Application in progress. Need to complete college rankings.',
    NULL
  ),
  (
    'Hispanic Scholarship Fund',
    'https://www.hsf.net/',
    '2024-12-31',
    'applied',
    '2024-11-10 11:30:00',
    'Submitted application with community involvement emphasis.',
    NULL
  ),
  (
    'Elks National Foundation Most Valuable Student',
    'https://www.elks.org/scholars/',
    '2024-11-20',
    'pending',
    NULL,
    'Waiting for school counselor recommendation letter.',
    NULL
  );

-- Add a policy to allow viewing demo data (applications with NULL user_id)
CREATE POLICY "Anyone can view demo applications"
  ON applications
  FOR SELECT
  TO authenticated
  USING (user_id IS NULL);

-- Add a policy to allow service role to manage demo data
CREATE POLICY "Service role can manage demo applications"
  ON applications
  FOR ALL
  TO service_role
  USING (user_id IS NULL)
  WITH CHECK (user_id IS NULL);