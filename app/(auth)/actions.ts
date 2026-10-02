'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function login(formData: FormData) {
  const supabase = await createClient()

  const identifier = formData.get('identifier') as string
  const password = formData.get('password') as string
  const isEmail = identifier.includes('@')

  const { error } = await supabase.auth.signInWithPassword(
    isEmail ? { email: identifier, password } : { phone: identifier, password }
  )

  if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function signup(formData: FormData) {
  const supabase = await createClient()

  const identifier = formData.get('identifier') as string
  const password = formData.get('password') as string
  const fullName = formData.get('full_name') as string
  const isEmail = identifier.includes('@')

  const { error } = await supabase.auth.signUp({
    ...(isEmail ? { email: identifier } : { phone: identifier }),
    password,
    options: {
      data: { full_name: fullName }
    }
  })

  if (error) {
    redirect(`/signup?error=${encodeURIComponent(error.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}

export async function loginWithGoogle() {
  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SUPABASE_URL}/auth/v1/callback`, // This defaults to the project URL if not set
    },
  })

  // Next.js requires redirecting to the URL returned by Supabase
  // We use headers to get the host if we want local callback
  if (data?.url) {
    redirect(data.url)
  } else if (error) {
    redirect(`/login?error=${encodeURIComponent(error.message)}`)
  }
}

export async function signout() {
  const supabase = await createClient()
  await supabase.auth.signOut()
  
  revalidatePath('/', 'layout')
  redirect('/')
}
