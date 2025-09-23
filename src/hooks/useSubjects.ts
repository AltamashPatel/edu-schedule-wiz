import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export function useSubjects() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Fetch all subjects
  const {
    data: subjects,
    isLoading,
    error
  } = useQuery({
    queryKey: ['subjects'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('subjects')
        .select('*')
        .order('department', { ascending: true })
        .order('name', { ascending: true })

      if (error) throw error
      return data
    }
  })

  // Get subjects by department
  const getSubjectsByDepartment = (department: string) => {
    return subjects?.filter(subject => subject.department === department) || []
  }

  return {
    subjects,
    isLoading,
    error,
    getSubjectsByDepartment
  }
}