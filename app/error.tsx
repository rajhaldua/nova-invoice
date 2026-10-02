'use client'

import { useEffect } from 'react'
import { Button } from '@/components/ui/button'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex h-screen w-full flex-col items-center justify-center gap-4 bg-zinc-50">
      <div className="text-center space-y-2">
        <h2 className="text-3xl font-bold tracking-tight">Something went wrong!</h2>
        <p className="text-zinc-500 max-w-md mx-auto">
          We apologize for the inconvenience. An unexpected error occurred.
        </p>
      </div>
      <Button onClick={() => reset()}>Try again</Button>
    </div>
  )
}
