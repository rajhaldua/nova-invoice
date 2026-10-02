import { updateCustomer, deleteCustomer } from '../actions'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ChevronLeft, Trash2 } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function EditCustomerPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: customer } = await supabase
    .from('customers')
    .select('*')
    .eq('id', id)
    .single()

  if (!customer) {
    redirect('/customers')
  }

  const updateCustomerWithId = updateCustomer.bind(null, id)
  const deleteCustomerWithId = deleteCustomer.bind(null, id)

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/customers">
            <Button variant="ghost" size="icon"><ChevronLeft className="w-5 h-5" /></Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Edit Customer</h1>
        </div>
        <form action={deleteCustomerWithId}>
          <Button variant="destructive" size="sm" type="submit">
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <form action={updateCustomerWithId}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Contact Name *</Label>
                <Input id="name" name="name" required defaultValue={customer.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input id="company_name" name="company_name" defaultValue={customer.company_name || ''} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" defaultValue={customer.email || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" defaultValue={customer.phone || ''} />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tax_id">Tax / VAT ID</Label>
                <Input id="tax_id" name="tax_id" defaultValue={customer.tax_id || ''} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" name="currency" defaultValue={customer.currency || 'USD'} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing_address">Billing Address</Label>
              <Input id="billing_address" name="billing_address" defaultValue={customer.billing_address || ''} />
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Link href="/customers">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="submit">Save Changes</Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
