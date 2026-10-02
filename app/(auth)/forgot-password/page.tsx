import { resetPassword } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'

export default async function ForgotPasswordPage({ searchParams }: { searchParams: Promise<{ error?: string, success?: string }> }) {
  const params = await searchParams

  return (
    <div className="flex h-screen w-screen items-center justify-center bg-zinc-50">
      <Card className="w-full max-w-sm">
        <CardHeader>
          <CardTitle className="text-2xl">Reset Password</CardTitle>
          <CardDescription>
            Enter your email and we will send you a reset link.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={resetPassword} className="space-y-4">
            {params.error && (
              <div className="p-3 text-sm text-red-800 border border-red-200 bg-red-50 rounded-md">
                {params.error}
              </div>
            )}
            {params.success && (
              <div className="p-3 text-sm text-green-800 border border-green-200 bg-green-50 rounded-md">
                {params.success}
              </div>
            )}
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input id="email" name="email" type="email" placeholder="m@example.com" required />
            </div>
            <Button type="submit" className="w-full">Send Reset Link</Button>
          </form>
          <div className="mt-4 text-center text-sm">
            <Link href="/login" className="underline text-zinc-500">Back to Login</Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
