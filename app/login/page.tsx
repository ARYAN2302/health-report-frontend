import type { Metadata } from "next"
import { LoginForm } from "@/components/auth/login-form"

export const metadata: Metadata = {
  title: "Login | Health Lab Reports",
  description: "Login to your Health Lab Reports account",
}

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center flex-col">
      <LoginForm />
      <p className="mt-4 text-center text-sm">
        Don't have an account? <a href="/signup" className="text-primary underline">Sign up</a>
      </p>
    </div>
  )
}
