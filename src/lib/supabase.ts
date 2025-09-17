import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables')
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Database types
export interface User {
  id: string
  email: string
  role: 'admin' | 'faculty' | 'student'
  full_name: string
  department?: string
  created_at: string
  updated_at: string
}

export interface Subject {
  id: string
  name: string
  code: string
  department: string
  credits: number
  type: 'core' | 'elective' | 'lab'
  created_at: string
}

export interface Classroom {
  id: string
  name: string
  building: string
  capacity: number
  type: 'lecture' | 'lab' | 'seminar'
  equipment: string[]
  created_at: string
}

export interface Faculty {
  id: string
  user_id: string
  employee_id: string
  department: string
  specialization: string[]
  max_hours_per_week: number
  availability: {
    [key: string]: { // day of week
      morning: boolean
      afternoon: boolean
      evening: boolean
    }
  }
  created_at: string
}

export interface Batch {
  id: string
  name: string
  year: number
  semester: number
  department: string
  section: string
  strength: number
  created_at: string
}

export interface Timetable {
  id: string
  name: string
  batch_id: string
  academic_year: string
  semester: number
  status: 'draft' | 'under_review' | 'approved' | 'published'
  created_by: string
  approved_by?: string
  created_at: string
  updated_at: string
  published_at?: string
}

export interface TimetableSlot {
  id: string
  timetable_id: string
  day_of_week: number // 0-6 (Monday-Sunday)
  start_time: string
  end_time: string
  subject_id: string
  faculty_id: string
  classroom_id: string
  type: 'lecture' | 'lab' | 'tutorial' | 'break'
  created_at: string
}