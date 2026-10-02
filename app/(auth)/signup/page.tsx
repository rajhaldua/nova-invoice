import { signup, loginWithGoogle } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import Link from 'next/link'

export default async function SignupPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 selection:bg-primary/30">
      {/* Premium Ambient Background */}
      <div className="pointer-events-none absolute inset-0 flex items-center justify-center">
        <div className="absolute top-[-20%] left-[-10%] h-[500px] w-[500px] rounded-full bg-primary/20 opacity-50 mix-blend-multiply blur-[120px] filter dark:opacity-20" />
        <div className="absolute bottom-[-20%] right-[-10%] h-[600px] w-[600px] rounded-full bg-chart-4/20 opacity-50 mix-blend-multiply blur-[120px] filter dark:opacity-20" />
        <div className="absolute bottom-[20%] left-[20%] h-[400px] w-[400px] rounded-full bg-chart-2/20 opacity-50 mix-blend-multiply blur-[120px] filter dark:opacity-20" />
      </div>

      <div className="relative z-10 w-full max-w-md">
        <div className="mb-8 flex flex-col items-center justify-center space-y-2 text-center">
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-gradient-to-br from-primary to-chart-4 shadow-lg">
            <svg className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold tracking-tight">Create an account</h1>
          <p className="text-sm text-muted-foreground">Start managing your invoices in seconds</p>
        </div>

        <Card className="border-white/20 bg-card/60 shadow-2xl backdrop-blur-xl dark:border-white/10 dark:bg-black/40">
          <CardContent className="pt-8 space-y-6">
            <form action={loginWithGoogle}>
              <Button type="submit" variant="outline" className="w-full h-11 font-medium bg-background/50 backdrop-blur-sm transition-all hover:bg-background/80 hover:shadow-sm">
                <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Sign up with Google
              </Button>
            </form>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <span className="w-full border-t border-muted-foreground/20" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-transparent px-2 text-muted-foreground backdrop-blur-md">Or sign up with email</span>
              </div>
            </div>

            <form action={signup} className="space-y-4">
              {params.error && (
                <div className="rounded-lg border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
                  {params.error}
                </div>
              )}
              <div className="space-y-2">
                <Label htmlFor="full_name" className="text-xs uppercase tracking-wider text-muted-foreground">Full Name</Label>
                <Input id="full_name" name="full_name" placeholder="John Doe" required className="h-11 bg-background/50 transition-all focus:bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email" className="text-xs uppercase tracking-wider text-muted-foreground">Email</Label>
                <Input id="email" name="email" type="email" placeholder="m@example.com" required className="h-11 bg-background/50 transition-all focus:bg-background" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password" className="text-xs uppercase tracking-wider text-muted-foreground">Password</Label>
                <Input id="password" name="password" type="password" required className="h-11 bg-background/50 transition-all focus:bg-background" />
              </div>
              <Button type="submit" className="h-11 w-full text-base font-medium shadow-md transition-all hover:shadow-lg active:scale-[0.98]">
                Create Account
              </Button>
            </form>
          </CardContent>
          <CardFooter className="pb-8 pt-4 justify-center">
            <div className="text-sm text-muted-foreground">
              Already have an account?{' '}
              <Link href="/login" className="font-semibold text-primary transition-colors hover:text-primary/80">
                Log in
              </Link>
            </div>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}
