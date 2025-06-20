/*
  # Insert seed data for testing

  1. Seed Data
    - Sample scholarship applications with various statuses
    - Realistic deadlines and application data
    - Mix of applied, pending, won, and rejected statuses

  Note: This will only work after a user is authenticated
*/

-- Insert seed applications (these will be associated with the authenticated user)
INSERT INTO applications (title, link, deadline, status, submitted_at, notes, user_id) VALUES
  (
    'Gates Millennium Scholarship',
    'https://www.gatesfoundation.org/scholarships',
    '2024-12-15',
    'applied',
    '2024-11-01 10:30:00',
    'Strong essay submitted focusing on community service and leadership experience.',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    'National Merit Scholarship',
    'https://www.nationalmerit.org/',
    '2024-11-30',
    'pending',
    NULL,
    'Waiting for PSAT scores to be released. Need to submit additional documentation.',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    'Coca-Cola Scholars Program',
    'https://www.coca-colascholarsfoundation.org/',
    '2024-10-31',
    'won',
    '2024-09-15 14:20:00',
    'Received $20,000 scholarship! Interview went extremely well.',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    'Dell Scholars Program',
    'https://www.dellscholars.org/',
    '2024-12-01',
    'rejected',
    '2024-10-01 09:15:00',
    'Did not meet GPA requirements. Will reapply next year.',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    'Jack Kent Cooke Foundation Scholarship',
    'https://www.jkcf.org/our-scholarships/',
    '2024-11-25',
    'applied',
    '2024-10-20 16:45:00',
    'Comprehensive application with financial aid documentation submitted.',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    'QuestBridge National College Match',
    'https://www.questbridge.org/',
    '2024-12-10',
    'pending',
    NULL,
    'Application in progress. Need to complete college rankings.',
    '00000000-0000-0000-0000-000000000000'
  ),
  (
    'Hispanic Scholarship Fund',
    'https://www.hsf.net/',
    '2024-12-31',
    'applied',
    '2024-11-10 11:30:00',
    'Submitted application with community involvement emphasis.',
    '00000000-0000-0000-0000-000000000000'  
  ),
  (
    'Elks National Foundation Most Valuable Student',
    'https://www.elks.org/scholars/',
    '2024-11-20',
    'pending',
    NULL,
    'Waiting for school counselor recommendation letter.',
    '00000000-0000-0000-0000-000000000000'
  );