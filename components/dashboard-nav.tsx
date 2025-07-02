"use client"

import type React from "react"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { BarChart3, FileText, Home, Settings, Upload } from "lucide-react"

interface NavItem {
  title: string
  href: string
  icon: React.ComponentType<{ className?: string }>
}

const items: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: Home,
  },
  {
    title: "Reports",
    href: "/dashboard/reports",
    icon: FileText,
  },
  {
    title: "Upload",
    href: "/dashboard/upload",
    icon: Upload,
  },
  {
    title: "Analytics",
    href: "/dashboard/analytics",
    icon: BarChart3,
  },
  {
    title: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
  },
]

export function DashboardNav() {
  const pathname = usePathname()

  return (
    <nav className="grid gap-1 px-2">
      {items.map((item) => (
        <Button
          key={item.href}
          variant={pathname === item.href ? "secondary" : "ghost"}
          className={cn(
            "flex h-10 w-full items-center justify-start gap-2 px-4 text-sm font-medium",
            pathname === item.href ? "bg-secondary text-secondary-foreground" : "text-muted-foreground",
          )}
          asChild
        >
          <Link href={item.href}>
            <item.icon className="h-4 w-4" />
            {item.title}
          </Link>
        </Button>
      ))}
    </nav>
  )
}
