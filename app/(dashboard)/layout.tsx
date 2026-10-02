import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { signout } from '@/app/(auth)/actions'

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
    <div className="min-h-screen flex flex-col bg-zinc-50">
      <header className="sticky top-0 z-10 bg-white border-b border-zinc-200 h-16 flex items-center justify-between px-6">
        <div className="flex items-center gap-6">
          <Link href="/dashboard" className="text-xl font-bold tracking-tight">
            NovaInvoice
          </Link>
          <span className="text-sm px-2 py-1 bg-zinc-100 rounded-md text-zinc-600 font-medium">
            {orgName}
          </span>
        </div>
        <nav className="flex items-center gap-4">
          <form action={signout}>
            <Button variant="ghost" size="sm" type="submit">Sign Out</Button>
          </form>
        </nav>
      </header>
      <div className="flex flex-1 pb-16 md:pb-0">
        <aside className="w-64 bg-white border-r border-zinc-200 p-4 hidden md:block">
          <nav className="space-y-1">
            <Link href="/dashboard" className="block px-3 py-2 rounded-md bg-zinc-100 font-medium text-zinc-900">Dashboard</Link>
            <Link href="/customers" className="block px-3 py-2 rounded-md text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium">Customers</Link>
            <Link href="/products" className="block px-3 py-2 rounded-md text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium">Products</Link>
            <Link href="/invoices" className="block px-3 py-2 rounded-md text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium">Invoices</Link>
            <Link href="/settings" className="block px-3 py-2 rounded-md text-zinc-600 hover:bg-zinc-50 hover:text-zinc-900 font-medium">Settings</Link>
          </nav>
        </aside>
        <main className="flex-1 p-6 md:p-8 overflow-y-auto">
          {children}
        </main>
      </div>
      
      {/* Mobile Bottom Navigation */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-zinc-200 flex justify-around p-2">
        <Link href="/dashboard" className="p-2 text-zinc-600 text-sm">Dashboard</Link>
        <Link href="/customers" className="p-2 text-zinc-600 text-sm">Customers</Link>
        <Link href="/products" className="p-2 text-zinc-600 text-sm">Products</Link>
        <Link href="/invoices" className="p-2 text-zinc-600 text-sm">Invoices</Link>
      </div>
    </div>
  )
}
