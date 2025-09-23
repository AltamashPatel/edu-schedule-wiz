import { useQuery } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'

export function useClassrooms() {
  // Fetch all classrooms
  const {
    data: classrooms,
    isLoading,
    error
  } = useQuery({
    queryKey: ['classrooms'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('classrooms')
        .select('*')
        .order('building', { ascending: true })
        .order('name', { ascending: true })

      if (error) throw error
      return data
    }
  })

  // Get classrooms by type
  const getClassroomsByType = (type: string) => {
    return classrooms?.filter(classroom => classroom.type === type) || []
  }

  return {
    classrooms,
    isLoading,
    error,
    getClassroomsByType
  }
}