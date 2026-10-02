'use client'

import { useFormStatus } from 'react-dom'
import { Button } from './button'
import { Loader2 } from 'lucide-react'

type SubmitButtonProps = React.ComponentProps<typeof Button> & {
  pendingText?: string
}

export function SubmitButton({ children, pendingText = 'Submitting...', ...props }: SubmitButtonProps) {
  const { pending } = useFormStatus()

  return (
    <Button type="submit" disabled={pending || props.disabled} {...props}>
      {pending ? (
        <>
          <Loader2 className="mr-2 h-4 w-4 animate-spin text-current opacity-70" />
          {pendingText}
        </>
      ) : (
        children
      )}
    </Button>
  )
}
