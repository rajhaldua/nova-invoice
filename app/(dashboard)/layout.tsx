import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { signout } from '@/app/(auth)/actions'
import { SidebarNav } from '@/components/dashboard/SidebarNav'
import { LayoutDashboard, Users, Package, FileText, LogOut, Hexagon } from 'lucide-react'

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect('/login')
  }

  // Ensure they have an organization
  const { data: members } = await supabase
    .from('organization_members')
    .select('organization_id, organizations(name)')
    .eq('user_id', user.id)
    .limit(1)

  if (!members || members.length === 0) {
    redirect('/onboarding')
  }

  const orgs = members[0].organizations as { name: string } | { name: string }[] | null
  const orgName = (Array.isArray(orgs) ? orgs[0]?.name : orgs?.name) || 'My Business'

  return (
    <div className="relative flex min-h-screen flex-col bg-background selection:bg-primary/30">
      {/* Subtle Abstract Background for Dashboard */}
      <div className="pointer-events-none fixed inset-0 z-0 flex items-center justify-center opacity-30 dark:opacity-20">
        <div className="absolute top-[-20%] right-[-10%] h-[800px] w-[800px] rounded-full bg-primary/10 mix-blend-multiply blur-[120px] filter" />
        <div className="absolute bottom-[-20%] left-[-10%] h-[600px] w-[600px] rounded-full bg-chart-4/10 mix-blend-multiply blur-[120px] filter" />
      </div>

      <header className="sticky top-0 z-20 flex h-16 shrink-0 items-center justify-between border-b border-border/40 bg-background/60 px-6 backdrop-blur-xl transition-all">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground transition-opacity hover:opacity-80">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-chart-4 shadow-sm">
              <Hexagon className="h-4 w-4 text-white fill-white/20" />
            </div>
            NovaInvoice
          </Link>
          <div className="hidden h-5 w-px bg-border md:block" />
          <span className="hidden rounded-full border border-primary/10 bg-primary/5 px-3 py-1 text-xs font-medium text-primary md:inline-flex">
            {orgName}
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <form action={signout}>
            <Button variant="ghost" size="sm" type="submit" className="text-muted-foreground hover:text-foreground">
              <LogOut className="mr-2 h-4 w-4" />
              Sign Out
            </Button>
          </form>
        </nav>
      </header>

      <div className="relative z-10 flex flex-1 pb-16 md:pb-0">
        <aside className="hidden w-64 shrink-0 flex-col border-r border-border/40 bg-background/30 backdrop-blur-md md:flex">
          <div className="flex-1 overflow-y-auto py-2">
            <SidebarNav />
          </div>
          <div className="p-4 border-t border-border/40">
            <div className="flex items-center gap-3 rounded-lg bg-card/50 p-3 border border-border/50 shadow-sm backdrop-blur-sm">
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary font-bold">
                {user.email?.charAt(0).toUpperCase()}
              </div>
              <div className="flex flex-col overflow-hidden">
                <span className="truncate text-sm font-medium text-foreground">{user.email}</span>
                <span className="truncate text-xs text-muted-foreground">Admin</span>
              </div>
            </div>
          </div>
        </aside>

        <main className="flex-1 overflow-y-auto p-4 md:p-8">
          <div className="mx-auto max-w-6xl">
            {children}
          </div>
        </main>
      </div>
      
      {/* Mobile Bottom Navigation (Glassmorphism) */}
      <div className="fixed bottom-0 left-0 right-0 z-30 flex justify-around border-t border-border/40 bg-background/80 p-2 backdrop-blur-xl md:hidden pb-safe">
        <Link href="/dashboard" className="flex flex-col items-center p-2 text-muted-foreground hover:text-foreground">
          <LayoutDashboard className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-medium">Dashboard</span>
        </Link>
        <Link href="/customers" className="flex flex-col items-center p-2 text-muted-foreground hover:text-foreground">
          <Users className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-medium">Customers</span>
        </Link>
        <Link href="/products" className="flex flex-col items-center p-2 text-muted-foreground hover:text-foreground">
          <Package className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-medium">Products</span>
        </Link>
        <Link href="/invoices" className="flex flex-col items-center p-2 text-muted-foreground hover:text-foreground">
          <FileText className="h-5 w-5 mb-1" />
          <span className="text-[10px] font-medium">Invoices</span>
        </Link>
      </div>
    </div>
  )
}
