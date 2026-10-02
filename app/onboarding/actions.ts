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

  // 2. Generate UUID and Create the organization
  const orgId = crypto.randomUUID()
  const { error: orgError } = await supabase
    .from('organizations')
    .insert({ id: orgId, name, currency })

  if (orgError) {
    redirect(`/onboarding?error=${encodeURIComponent(orgError.message)}`)
  }

  // 3. Add user as owner to organization_members
  const { error: memberError } = await supabase
    .from('organization_members')
    .insert({
      organization_id: orgId,
      user_id: user.id,
      role: 'owner'
    })

  if (memberError) {
    redirect(`/onboarding?error=${encodeURIComponent(memberError.message)}`)
  }

  revalidatePath('/', 'layout')
  redirect('/dashboard')
}
