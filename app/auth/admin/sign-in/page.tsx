"use client"

import AuthForm from "../../components/auth-form"
import { UserCog } from "lucide-react"

export default function AdminSignInPage() {
  return (
    <AuthForm
      role="admin"
      title="Admin Sign In"
      description="Access admin dashboard"
      icon={<UserCog className="h-8 w-8 text-primary" />}
    />
  )
}