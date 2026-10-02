'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { LayoutDashboard, Users, Package, FileText, Settings } from 'lucide-react'
import { cn } from '@/lib/utils'

const navItems = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Customers', href: '/customers', icon: Users },
  { name: 'Products', href: '/products', icon: Package },
  { name: 'Invoices', href: '/invoices', icon: FileText },
  { name: 'Settings', href: '/settings', icon: Settings },
]

export function SidebarNav() {
  const pathname = usePathname()

  return (
    <nav className="space-y-1.5 p-4">
      {navItems.map((item) => {
        const isActive = pathname === item.href || pathname.startsWith(`${item.href}/`)
        const Icon = item.icon

        return (
          <Link
            key={item.name}
            href={item.href}
            className={cn(
              "group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200",
              isActive 
                ? "bg-primary text-primary-foreground shadow-md" 
                : "text-muted-foreground hover:bg-muted hover:text-foreground"
            )}
          >
            <Icon className={cn("h-4 w-4", isActive ? "text-primary-foreground" : "text-muted-foreground group-hover:text-foreground transition-colors")} />
            {item.name}
          </Link>
        )
      })}
    </nav>
  )
}
