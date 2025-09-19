-- Insert sample data for testing

-- Insert sample subjects
INSERT INTO public.subjects (name, code, department, credits, type) VALUES
('Database Systems', 'CS301', 'Computer Science', 4, 'core'),
('Data Structures', 'CS201', 'Computer Science', 3, 'core'),
('Web Development', 'CS401', 'Computer Science', 3, 'elective'),
('Computer Networks', 'CS302', 'Computer Science', 4, 'core'),
('Operating Systems', 'CS303', 'Computer Science', 4, 'core'),
('Mathematics-I', 'MA101', 'Mathematics', 4, 'core'),
('Physics Lab', 'PH151', 'Physics', 2, 'lab');

-- Insert sample classrooms
INSERT INTO public.classrooms (name, building, capacity, type, equipment) VALUES
('CS-LH-1', 'Computer Science Building', 120, 'lecture', ARRAY['Projector', 'Whiteboard', 'Audio System']),
('CS-LH-2', 'Computer Science Building', 100, 'lecture', ARRAY['Projector', 'Whiteboard']),
('CS-Lab-1', 'Computer Science Building', 60, 'lab', ARRAY['Computers', 'Projector', 'AC']),
('CS-Lab-2', 'Computer Science Building', 60, 'lab', ARRAY['Computers', 'Projector', 'AC']),
('Main-Auditorium', 'Main Building', 300, 'lecture', ARRAY['Projector', 'Audio System', 'Stage']);

-- Insert sample batches
INSERT INTO public.batches (name, year, semester, department, section, strength) VALUES
('CS-3A', 3, 5, 'Computer Science', 'A', 45),
('CS-3B', 3, 5, 'Computer Science', 'B', 42),
('CS-2A', 2, 3, 'Computer Science', 'A', 48),
('CS-2B', 2, 3, 'Computer Science', 'B', 47);