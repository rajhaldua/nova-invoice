import { createCustomer } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function NewCustomerPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams
  
  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/customers">
          <Button variant="ghost" size="icon"><ChevronLeft className="w-5 h-5" /></Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add New Customer</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Customer Details</CardTitle>
        </CardHeader>
        <form action={createCustomer}>
          <CardContent className="space-y-4">
            {params.error && (
              <div className="p-3 text-sm text-red-800 border border-red-200 bg-red-50 rounded-md">
                {params.error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Contact Name *</Label>
                <Input id="name" name="name" required placeholder="Jane Doe" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="company_name">Company Name</Label>
                <Input id="company_name" name="company_name" placeholder="Acme Corp" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" name="email" type="email" placeholder="jane@example.com" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="phone">Phone</Label>
                <Input id="phone" name="phone" placeholder="+1 (555) 000-0000" />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="tax_id">Tax / VAT ID</Label>
                <Input id="tax_id" name="tax_id" placeholder="GB123456789" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="currency">Currency</Label>
                <Input id="currency" name="currency" placeholder="USD" defaultValue="USD" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="billing_address">Billing Address</Label>
              <Input id="billing_address" name="billing_address" placeholder="123 Business St, City, Country" />
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Link href="/customers">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="submit">Save Customer</Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
