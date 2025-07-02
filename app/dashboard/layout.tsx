import type React from "react"

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col">
      <main className="flex-1 overflow-auto p-4 md:p-6">{children}</main>
    </div>
  )
}
