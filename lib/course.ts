import { supabase } from "./supabase"

export interface Course {
  id: string
  title: string
  description: string
  sections: any[]
  instructor_id: string
  price: number
  image_url: string
  duration: string
  level: string
  created_at: string
  updated_at: string
  instructor: {
    full_name: string
  }
}

export async function getCourses() {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:users(full_name)
    `)
    .order('created_at', { ascending: false })

  if (error) throw error
  return data as Course[]
}

export async function getCourse(id: string) {
  const { data, error } = await supabase
    .from('courses')
    .select(`
      *,
      instructor:users(full_name)
    `)
    .eq('id', id)
    .single()

  if (error) throw error
  return data as Course
}

export async function createCourse(courseData: Partial<Course>) {
  const { data, error } = await supabase
    .from('courses')
    .insert([courseData])
    .select()
    .single()

  if (error) throw error
  return data
}

export async function updateCourse(id: string, courseData: Partial<Course>) {
  const { data, error } = await supabase
    .from('courses')
    .update(courseData)
    .eq('id', id)
    .select()
    .single()

  if (error) throw error
  return data
}

export async function deleteCourse(id: string) {
  const { error } = await supabase
    .from('courses')
    .delete()
    .eq('id', id)

  if (error) throw error
}