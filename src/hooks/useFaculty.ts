import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useFaculty() {
  // Fetch all faculty
  const {
    data: faculty,
    isLoading,
    error
  } = useQuery({
    queryKey: ['faculty'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('faculty')
        .select(`
          *,
          users(full_name, email)
        `)
        .order('department', { ascending: true })

      if (error) throw error
      return data
    }
  })

  // Get faculty by department
  const getFacultyByDepartment = (department: string) => {
    return faculty?.filter(f => f.department === department) || []
  }

  return {
    faculty,
    isLoading,
    error,
    getFacultyByDepartment
  }
}