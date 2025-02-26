'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Plus, Trash } from 'lucide-react';

interface Lesson {
  title: string;
  video: File | null;
}

interface Section {
  title: string;
  lessons: Lesson[];
}

export default function CourseUploadPage() {
  const [courseTitle, setCourseTitle] = useState('');
  const [courseDescription, setCourseDescription] = useState('');
  const [courseImage, setCourseImage] = useState<File | null>(null);
  const [sections, setSections] = useState<Section[]>([
    { title: '', lessons: [{ title: '', video: null }] }
  ]);

  const handleFileChange = (
    event: React.ChangeEvent<HTMLInputElement>,
    sectionIndex?: number,
    lessonIndex?: number
  ) => {
    if (!event.target.files) return;
    const file = event.target.files[0];

    if (sectionIndex !== undefined && lessonIndex !== undefined) {
      setSections((prev) => {
        const updatedSections = [...prev];
        updatedSections[sectionIndex].lessons[lessonIndex].video = file;
        return updatedSections;
      });
    } else {
      setCourseImage(file);
    }
  };

  const handleAddSection = () => {
    setSections([...sections, { title: '', lessons: [{ title: '', video: null }] }]);
  };

  const handleRemoveSection = (index: number) => {
    setSections(sections.filter((_, i) => i !== index));
  };

  const handleAddLesson = (sectionIndex: number) => {
    setSections((prev) => {
      const updatedSections = [...prev];
      updatedSections[sectionIndex].lessons.push({ title: '', video: null });
      return updatedSections;
    });
  };

  const handleRemoveLesson = (sectionIndex: number, lessonIndex: number) => {
    setSections((prev) => {
      const updatedSections = [...prev];
      updatedSections[sectionIndex].lessons = updatedSections[sectionIndex].lessons.filter((_, i) => i !== lessonIndex);
      return updatedSections;
    });
  };

  const handleSubmit = () => {
    const formData = new FormData();
    formData.append('title', courseTitle);
    formData.append('description', courseDescription);
    if (courseImage) formData.append('image', courseImage);

    sections.forEach((section, secIndex) => {
      formData.append(`sections[${secIndex}][title]`, section.title);
      section.lessons.forEach((lesson, lesIndex) => {
        formData.append(`sections[${secIndex}][lessons][${lesIndex}][title]`, lesson.title);
        if (lesson.video) formData.append(`sections[${secIndex}][lessons][${lesIndex}][video]`, lesson.video);
      });
    });

    // Placeholder for API call
    console.log('Submitting form:', Object.fromEntries(formData));
  };

  return (
    <div className='p-4 max-w-2xl mx-auto space-y-4'>
      <h1 className='text-xl font-bold'>Upload Course</h1>
      <Input placeholder='Course Title' value={courseTitle} onChange={(e) => setCourseTitle(e.target.value)} />
      <Textarea placeholder='Course Description' value={courseDescription} onChange={(e) => setCourseDescription(e.target.value)} />
      <Input type='file' onChange={(e) => handleFileChange(e)} />

      {sections.map((section, secIndex) => (
        <div key={secIndex} className='border p-3 rounded-lg'>
          <div className='flex justify-between'>
            <Input
              placeholder='Section Title'
              value={section.title}
              onChange={(e) => {
                const newSections = [...sections];
                newSections[secIndex].title = e.target.value;
                setSections(newSections);
              }}
            />
            <Button variant='ghost' onClick={() => handleRemoveSection(secIndex)}>
              <Trash />
            </Button>
          </div>

          {section.lessons.map((lesson, lesIndex) => (
            <div key={lesIndex} className='ml-4 p-2 border rounded-md'>
              <div className='flex justify-between'>
                <Input
                  placeholder='Lesson Title'
                  value={lesson.title}
                  onChange={(e) => {
                    const newSections = [...sections];
                    newSections[secIndex].lessons[lesIndex].title = e.target.value;
                    setSections(newSections);
                  }}
                />
                <Button variant='ghost' onClick={() => handleRemoveLesson(secIndex, lesIndex)}>
                  <Trash />
                </Button>
              </div>
              <Input type='file' onChange={(e) => handleFileChange(e, secIndex, lesIndex)} />
            </div>
          ))}
          <Button onClick={() => handleAddLesson(secIndex)}>
            <Plus /> Add Lesson
          </Button>
        </div>
      ))}

      <Button onClick={handleAddSection}>
        <Plus /> Add Section
      </Button>
      <Button onClick={handleSubmit} className='w-full'>
        Submit Course
      </Button>
    </div>
  );
}
