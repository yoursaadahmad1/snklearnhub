"use client"

import { useEffect, useState } from "react"
import { useParams, useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Clock, Users, Star, BookOpen, Award, CheckCircle } from "lucide-react"
import { getCourse, type Course } from "@/lib/course"
import { supabase } from "@/lib/supabase"

export default function CourseDetailPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.id as string
  const [course, setCourse] = useState<Course | null>(null)
  const [loading, setLoading] = useState(true)
  const [user, setUser] = useState<any>(null)

  useEffect(() => {
    async function loadCourse() {
      try {
        const data = await getCourse(courseId)
        setCourse(data)
      } catch (error) {
        console.error("Error loading course:", error)
      } finally {
        setLoading(false)
      }
    }

    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession()
      setUser(session?.user || null)
    }

    loadCourse()
    checkAuth()
  }, [courseId])

  const handleEnroll = async () => {
    if (!user) {
      router.push(`/auth/student/sign-in?redirect=/courses/${courseId}`)
      return
    }
    router.push(`/payment/${courseId}`)
  }

  if (loading) {
    return (
      <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading course details...</p>
        </div>
      </div>
    )
  }

  if (!course) {
    return <div>Course not found</div>
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      {/* Hero Section */}
      <div className="relative h-[400px] overflow-hidden">
        <img
          src={course.image_url}
          alt={course.title}
          className="w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/60 to-transparent" />
        <div className="absolute inset-0 flex items-center">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
            <div className="max-w-3xl">
              <h1 className="text-4xl font-bold text-white mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-white/90 mb-6">
                {course.description}
              </p>
              <div className="flex items-center gap-6 text-white/80 mb-8">
                <div className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  {course.duration}
                </div>
                <div className="flex items-center">
                  <Star className="h-5 w-5 mr-2 text-yellow-400" />
                  {course.level}
                </div>
              </div>
              <div className="flex items-center gap-4">
                <Button size="lg" className="animate-pulse" onClick={handleEnroll}>
                  Enroll Now for ${course.price}
                </Button>
                <Button variant="outline" size="lg">
                  Preview Course
                </Button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Course Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-16">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            <Card className="p-6 mb-8">
              <h2 className="text-2xl font-semibold mb-4 flex items-center">
                <BookOpen className="h-6 w-6 mr-2" />
                Course Curriculum
              </h2>
              <div className="space-y-4">
                {course.sections?.map((section: any, index: number) => (
                  <div key={index}>
                    <h3 className="text-lg font-semibold mb-2">{section.title}</h3>
                    <div className="space-y-2">
                      {section.lessons.map((lesson: any, lessonIndex: number) => (
                        <div
                          key={lessonIndex}
                          className="flex items-center p-4 rounded-lg bg-muted/50 hover:bg-muted transition-colors"
                        >
                          <span className="w-8 h-8 rounded-full bg-primary/10 text-primary flex items-center justify-center mr-4">
                            {lessonIndex + 1}
                          </span>
                          <span>{lesson.title}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <Card className="p-6 sticky top-24">
              <div className="text-center mb-6">
                <div className="text-3xl font-bold mb-2">${course.price}</div>
                <Button className="w-full mb-4" onClick={handleEnroll}>
                  Enroll Now
                </Button>
                <p className="text-sm text-muted-foreground">
                  30-day money-back guarantee
                </p>
              </div>
              <div className="space-y-4">
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Duration</span>
                  <span className="font-medium">{course.duration}</span>
                </div>
                <div className="flex items-center justify-between py-2 border-b">
                  <span className="text-muted-foreground">Instructor</span>
                  <span className="font-medium">{course.instructor?.full_name}</span>
                </div>
                <div className="flex items-center justify-between py-2">
                  <span className="text-muted-foreground">Level</span>
                  <span className="font-medium">{course.level}</span>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}