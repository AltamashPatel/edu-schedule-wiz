-- Enable RLS on all tables
ALTER TABLE public.users ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.timetable_slots ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.subjects ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.classrooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faculty ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.batches ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for users table
CREATE POLICY "Users can view their own profile" 
ON public.users 
FOR SELECT 
USING (auth.uid() = id);

CREATE POLICY "Users can update their own profile" 
ON public.users 
FOR UPDATE 
USING (auth.uid() = id);

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  INSERT INTO public.users (id, email, full_name, role)
  VALUES (
    NEW.id,
    NEW.email,
    NEW.raw_user_meta_data ->> 'full_name',
    NEW.raw_user_meta_data ->> 'role'
  );
  RETURN NEW;
END;
$$;

-- Create trigger to automatically create user profile on signup
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create RLS policies for other tables
CREATE POLICY "Users can view all timetables"
ON public.timetables
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin and faculty can create timetables"
ON public.timetables
FOR INSERT
TO authenticated
WITH CHECK (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'faculty')
  )
);

CREATE POLICY "Admin and faculty can update timetables"
ON public.timetables
FOR UPDATE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'faculty')
  )
);

CREATE POLICY "Admin can delete timetables"
ON public.timetables
FOR DELETE
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Create policies for subjects, classrooms, faculty, batches (admin only)
CREATE POLICY "Everyone can view subjects"
ON public.subjects
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin can manage subjects"
ON public.subjects
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Everyone can view classrooms"
ON public.classrooms
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin can manage classrooms"
ON public.classrooms
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Everyone can view faculty"
ON public.faculty
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin can manage faculty"
ON public.faculty
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

CREATE POLICY "Everyone can view batches"
ON public.batches
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin can manage batches"
ON public.batches
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role = 'admin'
  )
);

-- Create policies for timetable slots
CREATE POLICY "Users can view timetable slots"
ON public.timetable_slots
FOR SELECT
TO authenticated
USING (true);

CREATE POLICY "Admin and faculty can manage timetable slots"
ON public.timetable_slots
FOR ALL
TO authenticated
USING (
  EXISTS (
    SELECT 1 FROM public.users 
    WHERE id = auth.uid() 
    AND role IN ('admin', 'faculty')
  )
);