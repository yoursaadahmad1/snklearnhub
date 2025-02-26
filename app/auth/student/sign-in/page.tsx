"use client"

import AuthForm from "../../components/auth-form"
import { Users } from "lucide-react"

export default function StudentSignInPage() {
  return (
    <AuthForm
      role="student"
      title="Student Sign In"
      description="Welcome back, learner!"
      icon={<Users className="h-8 w-8 text-primary" />}
    />
  )
}