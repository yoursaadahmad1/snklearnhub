"use client"

import AuthForm from "../../components/auth-form"
import { GraduationCap } from "lucide-react"

export default function InstructorSignInPage() {
  return (
    <AuthForm
      role="instructor"
      title="Instructor Sign In"
      description="Welcome back, instructor!"
      icon={<GraduationCap className="h-8 w-8 text-primary" />}
    />
  )
}