import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { supabase, Timetable, TimetableSlot } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'

export function useTimetables() {
  const queryClient = useQueryClient()
  const { toast } = useToast()

  // Fetch all timetables
  const {
    data: timetables,
    isLoading,
    error
  } = useQuery({
    queryKey: ['timetables'],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('timetables')
        .select(`
          *,
          batch:batches(name, department, year, semester)
        `)
        .order('created_at', { ascending: false })

      if (error) throw error
      return data
    }
  })

  // Fetch timetable slots
  const fetchTimetableSlots = (timetableId: string) => {
    return useQuery({
      queryKey: ['timetable-slots', timetableId],
      queryFn: async () => {
        const { data, error } = await supabase
          .from('timetable_slots')
          .select(`
            *,
            subject:subjects(name, code, type),
            faculty:faculty(users(full_name)),
            classroom:classrooms(name, building)
          `)
          .eq('timetable_id', timetableId)
          .order('day_of_week')
          .order('start_time')

        if (error) throw error
        return data
      },
      enabled: !!timetableId
    })
  }

  // Create timetable
  const createTimetable = useMutation({
    mutationFn: async (timetableData: Omit<Timetable, 'id' | 'created_at' | 'updated_at'>) => {
      const { data, error } = await supabase
        .from('timetables')
        .insert([timetableData])
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables'] })
      toast({
        title: "Timetable created",
        description: "New timetable has been created successfully."
      })
    },
    onError: (error) => {
      toast({
        title: "Failed to create timetable",
        description: error.message,
        variant: "destructive"
      })
    }
  })

  // Update timetable
  const updateTimetable = useMutation({
    mutationFn: async (timetableData: Partial<Timetable> & { id: string }) => {
      const { id, ...updateData } = timetableData;
      const { data, error } = await supabase
        .from('timetables')
        .update({
          ...updateData,
          updated_at: new Date().toISOString()
        })
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables'] })
      toast({
        title: "Timetable updated",
        description: "Timetable has been updated successfully."
      })
    },
    onError: (error) => {
      toast({
        title: "Failed to update timetable",
        description: error.message,
        variant: "destructive"
      })
    }
  })

  // Update timetable status
  const updateTimetableStatus = useMutation({
    mutationFn: async ({ 
      id, 
      status, 
      approvedBy 
    }: { 
      id: string
      status: Timetable['status']
      approvedBy?: string 
    }) => {
      const updateData: any = { 
        status, 
        updated_at: new Date().toISOString() 
      }
      
      if (status === 'approved' && approvedBy) {
        updateData.approved_by = approvedBy
      }
      
      if (status === 'published') {
        updateData.published_at = new Date().toISOString()
      }

      const { data, error } = await supabase
        .from('timetables')
        .update(updateData)
        .eq('id', id)
        .select()
        .single()

      if (error) throw error
      return data
    },
    onSuccess: (data) => {
      queryClient.invalidateQueries({ queryKey: ['timetables'] })
      toast({
        title: "Timetable updated",
        description: `Timetable status changed to ${data.status}.`
      })
    },
    onError: (error) => {
      toast({
        title: "Failed to update timetable",
        description: error.message,
        variant: "destructive"
      })
    }
  })

  // Delete timetable
  const deleteTimetable = useMutation({
    mutationFn: async (id: string) => {
      const { error } = await supabase
        .from('timetables')
        .delete()
        .eq('id', id)

      if (error) throw error
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['timetables'] })
      toast({
        title: "Timetable deleted",
        description: "Timetable has been deleted successfully."
      })
    },
    onError: (error) => {
      toast({
        title: "Failed to delete timetable",
        description: error.message,
        variant: "destructive"
      })
    }
  })

  return {
    timetables,
    isLoading,
    error,
    fetchTimetableSlots,
    createTimetable,
    updateTimetable,
    updateTimetableStatus,
    deleteTimetable
  }
}