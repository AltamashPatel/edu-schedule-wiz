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

  // Generate timetable slots automatically
  const generateTimetableSlots = async (timetableId: string, batchId: string, department: string) => {
    try {
      // Get subjects for the department
      const { data: subjects } = await supabase
        .from('subjects')
        .select('*')
        .eq('department', department)
        .limit(6) // Limit to 6 subjects for a basic schedule

      if (!subjects || subjects.length === 0) {
        throw new Error('No subjects found for this department')
      }

      // Get faculty for the department
      const { data: faculty } = await supabase
        .from('faculty')
        .select('*')
        .eq('department', department)

      if (!faculty || faculty.length === 0) {
        throw new Error('No faculty found for this department')
      }

      // Get available classrooms
      const { data: classrooms } = await supabase
        .from('classrooms')
        .select('*')
        .in('type', ['lecture', 'lab'])

      if (!classrooms || classrooms.length === 0) {
        throw new Error('No classrooms available')
      }

      // Generate time slots for a week
      const timeSlots = [
        { start: '09:00', end: '10:00' },
        { start: '10:00', end: '11:00' },
        { start: '11:30', end: '12:30' }, // Break between 11-11:30
        { start: '12:30', end: '13:30' },
        { start: '14:30', end: '15:30' }, // Lunch break 13:30-14:30
        { start: '15:30', end: '16:30' },
      ]

      const slots = []
      
      // Generate slots for Monday to Friday (1-5)
      for (let day = 1; day <= 5; day++) {
        for (let timeIndex = 0; timeIndex < timeSlots.length; timeIndex++) {
          // Skip lunch and some break periods
          if ((day === 1 && timeIndex === 3) || (day === 3 && timeIndex === 4)) {
            continue // Create some free periods
          }

          const subject = subjects[timeIndex % subjects.length]
          const facultyMember = faculty[timeIndex % faculty.length]
          const classroom = classrooms[(timeIndex + day) % classrooms.length]
          const timeSlot = timeSlots[timeIndex]

          slots.push({
            timetable_id: timetableId,
            day_of_week: day,
            start_time: timeSlot.start,
            end_time: timeSlot.end,
            subject_id: subject.id,
            faculty_id: facultyMember.id,
            classroom_id: classroom.id,
            type: subject.type === 'lab' ? 'lab' : 'lecture'
          })
        }
      }

      // Insert all slots
      const { error } = await supabase
        .from('timetable_slots')
        .insert(slots)

      if (error) throw error

      return slots.length
    } catch (error) {
      console.error('Error generating timetable slots:', error)
      throw error
    }
  }

  return {
    timetables,
    isLoading,
    error,
    fetchTimetableSlots,
    createTimetable,
    updateTimetable,
    updateTimetableStatus,
    deleteTimetable,
    generateTimetableSlots
  }
}