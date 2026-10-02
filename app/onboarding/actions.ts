'use server'

import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'

export async function createOrganization(formData: FormData) {
  const supabase = await createClient()

  const name = formData.get('name') as string
  const currency = formData.get('currency') as string

  // 1. Get the current user
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) {
    redirect(`/onboarding?error=${encodeURIComponent('Not authenticated')}`)
  }

  // 2. Create the organization and add user as owner atomically via RPC
  const { error: orgError } = await supabase.rpc('create_organization', {
    org_name: name,
    org_currency: currency
  })

  if (orgError) {
    redirect(`/onboarding?error=${encodeURIComponent(orgError.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
