import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function NotFound() {
  return (
    <div className="flex h-screen w-full flex-col items-center justify-center bg-zinc-50 space-y-6">
      <div className="space-y-2 text-center">
        <h1 className="text-6xl font-extrabold tracking-tighter text-zinc-900">404</h1>
        <p className="text-xl text-zinc-500 font-medium">Page not found</p>
      </div>
      <p className="text-zinc-600 max-w-md text-center">
        Sorry, we couldn&apos;t find the page you&apos;re looking for. It might have been moved or deleted.
      </p>
      <Link href="/">
        <Button size="lg">Return Home</Button>
      </Link>
    </div>
  )
}
