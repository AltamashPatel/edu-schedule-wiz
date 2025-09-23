-- Insert sample faculty data
INSERT INTO faculty (user_id, employee_id, department, specialization, max_hours_per_week, availability) VALUES
-- We need to create some user records first, then create faculty records for them
-- For now, let's create some dummy faculty with made-up user IDs

-- Computer Science Faculty
(gen_random_uuid(), 'FAC001', 'Computer Science', ARRAY['Data Structures', 'Algorithms', 'Programming'], 20, '{
  "monday": {"morning": true, "afternoon": true, "evening": false},
  "tuesday": {"morning": true, "afternoon": true, "evening": false},
  "wednesday": {"morning": true, "afternoon": true, "evening": false},
  "thursday": {"morning": true, "afternoon": true, "evening": false},
  "friday": {"morning": true, "afternoon": true, "evening": false},
  "saturday": {"morning": false, "afternoon": false, "evening": false},
  "sunday": {"morning": false, "afternoon": false, "evening": false}
}'::jsonb),

(gen_random_uuid(), 'FAC002', 'Computer Science', ARRAY['Database Systems', 'Web Development'], 20, '{
  "monday": {"morning": true, "afternoon": true, "evening": false},
  "tuesday": {"morning": true, "afternoon": true, "evening": false},
  "wednesday": {"morning": true, "afternoon": true, "evening": false},
  "thursday": {"morning": true, "afternoon": true, "evening": false},
  "friday": {"morning": true, "afternoon": true, "evening": false},
  "saturday": {"morning": false, "afternoon": false, "evening": false},
  "sunday": {"morning": false, "afternoon": false, "evening": false}
}'::jsonb),

(gen_random_uuid(), 'FAC003', 'Computer Science', ARRAY['Software Engineering', 'Machine Learning'], 20, '{
  "monday": {"morning": true, "afternoon": true, "evening": false},
  "tuesday": {"morning": true, "afternoon": true, "evening": false},
  "wednesday": {"morning": true, "afternoon": true, "evening": false},
  "thursday": {"morning": true, "afternoon": true, "evening": false},
  "friday": {"morning": true, "afternoon": true, "evening": false},
  "saturday": {"morning": false, "afternoon": false, "evening": false},
  "sunday": {"morning": false, "afternoon": false, "evening": false}
}'::jsonb),

-- Information Technology Faculty
(gen_random_uuid(), 'FAC004', 'Information Technology', ARRAY['Networks', 'System Administration'], 20, '{
  "monday": {"morning": true, "afternoon": true, "evening": false},
  "tuesday": {"morning": true, "afternoon": true, "evening": false},
  "wednesday": {"morning": true, "afternoon": true, "evening": false},
  "thursday": {"morning": true, "afternoon": true, "evening": false},
  "friday": {"morning": true, "afternoon": true, "evening": false},
  "saturday": {"morning": false, "afternoon": false, "evening": false},
  "sunday": {"morning": false, "afternoon": false, "evening": false}
}'::jsonb),

(gen_random_uuid(), 'FAC005', 'Information Technology', ARRAY['Cybersecurity', 'Cloud Computing'], 20, '{
  "monday": {"morning": true, "afternoon": true, "evening": false},
  "tuesday": {"morning": true, "afternoon": true, "evening": false},
  "wednesday": {"morning": true, "afternoon": true, "evening": false},
  "thursday": {"morning": true, "afternoon": true, "evening": false},
  "friday": {"morning": true, "afternoon": true, "evening": false},
  "saturday": {"morning": false, "afternoon": false, "evening": false},
  "sunday": {"morning": false, "afternoon": false, "evening": false}
}'::jsonb);

-- Insert some more subjects if needed
INSERT INTO subjects (name, code, department, credits, type) VALUES
('Object Oriented Programming', 'CS205', 'Computer Science', 4, 'core'),
('Computer Networks', 'CS301', 'Computer Science', 3, 'core'),
('Operating Systems', 'CS302', 'Computer Science', 4, 'core'),
('Compiler Design', 'CS401', 'Computer Science', 3, 'elective'),
('Artificial Intelligence', 'CS402', 'Computer Science', 3, 'elective'),
('Network Security', 'IT301', 'Information Technology', 3, 'core'),
('Mobile App Development', 'IT302', 'Information Technology', 3, 'elective'),
('Cloud Computing Lab', 'IT303', 'Information Technology', 2, 'lab')
ON CONFLICT (code) DO NOTHING;