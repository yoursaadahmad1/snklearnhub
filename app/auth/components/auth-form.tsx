"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Card } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert } from "@/components/ui/alert"
import { signInWithEmail, signUpWithEmail, signInWithGoogle } from "@/lib/supabase"
import Link from "next/link"

interface AuthFormProps {
  role: 'student' | 'instructor' | 'admin'
  title: string
  description: string
  icon: React.ReactNode
}

export default function AuthForm({ role, title, description, icon }: AuthFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState("")
  const [loading, setLoading] = useState(false)

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      // Try sign in first
      const { data: signInData, error: signInError } = await signInWithEmail(email, password, role)
      
      if (signInError) {
        // If sign in fails, try sign up
        const { data: signUpData, error: signUpError } = await signUpWithEmail(email, password, role)
        
        if (signUpError) throw signUpError
        if (signUpData.user) {
          redirectToDashboard()
        }
      } else if (signInData.user) {
        redirectToDashboard()
      }
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleAuth = async () => {
    try {
      const { error } = await signInWithGoogle(role)
      if (error) throw error
      redirectToDashboard()
    } catch (error: any) {
      setError(error.message)
    }
  }

  const redirectToDashboard = () => {
    switch (role) {
      case 'admin':
        router.push('/dashboard/admin')
        break
      case 'instructor':
        router.push('/dashboard/instructor')
        break
      default:
        router.push('/dashboard')
    }
  }

  return (
    <div className="min-h-screen pt-20 pb-16 flex items-center justify-center">
      <Card className="w-full max-w-md p-8">
        <div className="text-center mb-8">
          <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
            {icon}
          </div>
          <h1 className="text-2xl font-bold">{title}</h1>
          <p className="text-muted-foreground mt-2">{description}</p>
        </div>

        {error && (
          <Alert variant="destructive" className="mb-6">
            {error}
          </Alert>
        )}

        <form onSubmit={handleAuth} className="space-y-4">
          <div>
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
            />
          </div>

          <div>
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? "Please wait..." : "Continue"}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-background text-muted-foreground">
                Or continue with
              </span>
            </div>
          </div>

          <Button
            type="button"
            variant="outline"
            className="w-full"
            onClick={handleGoogleAuth}
          >
            Continue with Google
          </Button>
        </form>

        <div className="mt-6 text-center text-sm">
          <Link href="/auth" className="text-muted-foreground hover:text-primary">
            ← Back to selection
          </Link>
        </div>
      </Card>
    </div>
  )
}