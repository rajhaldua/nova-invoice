import { createOrganization } from './actions'
import { SubmitButton } from '@/components/ui/submit-button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function OnboardingPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) {
    redirect('/login')
  }

  // Check if they already have an organization
  const { data: members } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user.id)
    .limit(1)

  if (members && members.length > 0) {
    redirect('/dashboard')
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 selection:bg-primary/30">
      {/* Premium Ambient Background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 opacity-50 mix-blend-multiply blur-[120px] filter dark:opacity-20" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-chart-4/20 opacity-50 mix-blend-multiply blur-[120px] filter dark:opacity-20" />
        <div className="absolute bottom-[20%] left-[20%] h-[400px] w-[400px] rounded-full bg-chart-2/20 opacity-50 mix-blend-multiply blur-[120px] filter dark:opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-lg">
        <div className="mb-8 flex flex-col items-center justify-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-4 shadow-lg">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Set up your business</h1>
          <p className="text-sm text-muted-foreground">Complete your profile to start creating invoices</p>
        </div>

        <Card className="border-white/20 bg-card/60 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/40 overflow-hidden">
          <form action={createOrganization}>
            <CardContent className="pt-8 space-y-6">
              {params.error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
                  {params.error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="name" className="text-xs uppercase tracking-wider text-muted-foreground">Business Name</Label>
                <Input id="name" name="name" placeholder="Acme Inc." required className="h-11 bg-background/50 transition-all focus:bg-background text-lg" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency" className="text-xs uppercase tracking-wider text-muted-foreground">Default Currency</Label>
                <Select name="currency" defaultValue="USD">
                  <SelectTrigger className="h-11 bg-background/50 transition-all focus:bg-background">
                    <SelectValue placeholder="Select a currency" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD ($)</SelectItem>
                    <SelectItem value="EUR">EUR (€)</SelectItem>
                    <SelectItem value="GBP">GBP (£)</SelectItem>
                    <SelectItem value="INR">INR (₹)</SelectItem>
                    <SelectItem value="CAD">CAD ($)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
            <CardFooter className="bg-muted/50 p-6 flex justify-end">
              <SubmitButton className="h-11 px-8 text-base font-medium shadow-md transition-all hover:shadow-lg active:scale-[0.98]">
                Get Started
              </SubmitButton>
            </CardFooter>
          </form>
        </Card>
      </div>
    </div>
  )
}
