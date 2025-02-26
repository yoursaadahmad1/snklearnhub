"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Upload, Plus, Trash2 } from "lucide-react"
import { createCourse, Course } from "@/lib/course"
import { useUploadThing } from "@/lib/uploadthing"
import { useToast } from "@/components/ui/toaster"

export default function CourseUploadPage() {
  const router = useRouter()
  const { toast } = useToast()
  const { startUpload } = useUploadThing("courseImage")
  
  const [loading, setLoading] = useState(false)
  const [courseData, setCourseData] = useState({
    title: "",
    description: "",
    price: "",
    level: "",
    duration: "",
    image_url: ""
  })
  const [sections, setSections] = useState([{ title: "", lessons: [{ title: "", content: "" }] }])
  const [imageFile, setImageFile] = useState<File | null>(null)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files?.[0]) {
      setImageFile(e.target.files[0])
    }
  }

  const addSection = () => {
    setSections([...sections, { title: "", lessons: [{ title: "", content: "" }] }])
  }

  const addLesson = (sectionIndex: number) => {
    const newSections = [...sections]
    newSections[sectionIndex].lessons.push({ title: "", content: "" })
    setSections(newSections)
  }

  const removeSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index))
  }

  const removeLesson = (sectionIndex: number, lessonIndex: number) => {
    const newSections = [...sections]
    newSections[sectionIndex].lessons = newSections[sectionIndex].lessons.filter(
      (_, i) => i !== lessonIndex
    )
    setSections(newSections)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let imageUrl = ""
      if (imageFile) {
        const uploadResult = await startUpload([imageFile])
        if (uploadResult?.[0]) {
          imageUrl = uploadResult[0].url
        }
      }

      const course: Partial<Course> & { sections: any } = await createCourse({
        ...courseData,
        price: parseFloat(courseData.price),
        image_url: imageUrl
      })

      toast({
        title: "Success",
        description: "Course created successfully!",
      })

      router.push("/dashboard/instructor")
    } catch (error) {
      console.error("Error creating course:", error)
      toast({
        title: "Error",
        description: "Failed to create course. Please try again.",
        variant: "destructive"
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-16">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold mb-8">Create New Course</h1>

        <form onSubmit={handleSubmit} className="space-y-8">
          <Card className="p-6">
            <h2 className="text-xl font-semibold mb-4">Course Details</h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Course Title</label>
                <Input
                  value={courseData.title}
                  onChange={(e) => setCourseData({ ...courseData, title: e.target.value })}
                  placeholder="Enter course title"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium mb-2">Description</label>
                <Textarea
                  value={courseData.description}
                  onChange={(e) => setCourseData({ ...courseData, description: e.target.value })}
                  placeholder="Enter course description"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Price ($)</label>
                  <Input
                    type="number"
                    min="0"
                    step="0.01"
                    value={courseData.price}
                    onChange={(e) => setCourseData({ ...courseData, price: e.target.value })}
                    placeholder="99.99"
                    required
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium mb-2">Level</label>
                  <Select
                    value={courseData.level}
                    onValueChange={(value) => setCourseData({ ...courseData, level: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select level" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="beginner">Beginner</SelectItem>
                      <SelectItem value="intermediate">Intermediate</SelectItem>
                      <SelectItem value="advanced">Advanced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Duration</label>
                <Input
                  value={courseData.duration}
                  onChange={(e) => setCourseData({ ...courseData, duration: e.target.value })}
                  placeholder="e.g., 8 weeks"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Course Image</label>
                <div className="border-2 border-dashed rounded-lg p-8 text-center">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    id="course-image"
                  />
                  <label
                    htmlFor="course-image"
                    className="cursor-pointer block"
                  >
                    <Upload className="h-8 w-8 mx-auto mb-4 text-muted-foreground" />
                    <p className="text-sm text-muted-foreground">
                      {imageFile ? imageFile.name : "Click to upload course image"}
                    </p>
                  </label>
                </div>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">Course Content</h2>
              <Button type="button" onClick={addSection} variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>

            <div className="space-y-6">
              {sections.map((section, sectionIndex) => (
                <div key={sectionIndex} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-4">
                    <Input
                      placeholder="Section Title"
                      className="max-w-sm"
                      value={section.title}
                      onChange={(e) => {
                        const newSections = [...sections]
                        newSections[sectionIndex].title = e.target.value
                        setSections(newSections)
                      }}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon"
                      onClick={() => removeSection(sectionIndex)}
                    >
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>

                  <div className="space-y-4">
                    {section.lessons.map((lesson, lessonIndex) => (
                      <div key={lessonIndex} className="pl-4 border-l">
                        <div className="flex items-center gap-4 mb-2">
                          <Input
                            placeholder="Lesson Title"
                            value={lesson.title}
                            onChange={(e) => {
                              const newSections = [...sections]
                              newSections[sectionIndex].lessons[lessonIndex].title = e.target.value
                              setSections(newSections)
                            }}
                          />
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            onClick={() => removeLesson(sectionIndex, lessonIndex)}
                          >
                            <Trash2 className="h-4 w-4 text-destructive" />
                          </Button>
                        </div>
                        <Textarea
                          placeholder="Lesson Content"
                          value={lesson.content}
                          onChange={(e) => {
                            const newSections = [...sections]
                            newSections[sectionIndex].lessons[lessonIndex].content = e.target.value
                            setSections(newSections)
                          }}
                        />
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => addLesson(sectionIndex)}
                      className="ml-4"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Lesson
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </Card>

          <div className="flex justify-end gap-4">
            <Button type="button" variant="outline" onClick={() => router.back()}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Creating Course..." : "Create Course"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}