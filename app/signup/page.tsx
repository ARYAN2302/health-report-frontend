import type { Metadata } from "next"
import { SignUpForm } from "@/components/auth/signup-form"

export const metadata: Metadata = {
  title: "Sign Up | Health Lab Reports",
  description: "Create a Health Lab Reports account",
}

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center flex-col">
      <SignUpForm />
      <p className="mt-4 text-center text-sm">
        Already have an account? <a href="/login" className="text-primary underline">Log in</a>
      </p>
    </div>
  )
}
