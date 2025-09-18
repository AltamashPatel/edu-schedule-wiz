-- Drop existing policies that could cause recursion
DROP POLICY IF EXISTS "Admin and faculty can create timetables" ON public.timetables;
DROP POLICY IF EXISTS "Admin and faculty can update timetables" ON public.timetables;
DROP POLICY IF EXISTS "Admin can delete timetables" ON public.timetables;
DROP POLICY IF EXISTS "Admin can manage subjects" ON public.subjects;
DROP POLICY IF EXISTS "Admin can manage classrooms" ON public.classrooms;
DROP POLICY IF EXISTS "Admin can manage faculty" ON public.faculty;
DROP POLICY IF EXISTS "Admin can manage batches" ON public.batches;
DROP POLICY IF EXISTS "Admin and faculty can manage timetable slots" ON public.timetable_slots;

-- Create security definer function to get user role
CREATE OR REPLACE FUNCTION public.get_current_user_role()
RETURNS TEXT
LANGUAGE SQL
SECURITY DEFINER
STABLE
SET search_path = public
AS $$
  SELECT role FROM public.users WHERE id = auth.uid();
$$;

-- Recreate policies using the security definer function
CREATE POLICY "Admin and faculty can create timetables"
ON public.timetables
FOR INSERT
TO authenticated
WITH CHECK (public.get_current_user_role() IN ('admin', 'faculty'));

CREATE POLICY "Admin and faculty can update timetables"
ON public.timetables
FOR UPDATE
TO authenticated
USING (public.get_current_user_role() IN ('admin', 'faculty'));

CREATE POLICY "Admin can delete timetables"
ON public.timetables
FOR DELETE
TO authenticated
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admin can manage subjects"
ON public.subjects
FOR ALL
TO authenticated
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admin can manage classrooms"
ON public.classrooms
FOR ALL
TO authenticated
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admin can manage faculty"
ON public.faculty
FOR ALL
TO authenticated
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admin can manage batches"
ON public.batches
FOR ALL
TO authenticated
USING (public.get_current_user_role() = 'admin');

CREATE POLICY "Admin and faculty can manage timetable slots"
ON public.timetable_slots
FOR ALL
TO authenticated
USING (public.get_current_user_role() IN ('admin', 'faculty'));