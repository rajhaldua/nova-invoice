import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function InvoicesPage() {
  const supabase = await createClient()

  // Get current user's organization
  const { data: { user } } = await supabase.auth.getUser()
  const { data: members } = await supabase
    .from('organization_members')
    .select('organization_id')
    .eq('user_id', user?.id || '')
    .limit(1)
    .single()

  const orgId = members?.organization_id

  // Fetch invoices with customer data
  const { data: invoices } = await supabase
    .from('invoices')
    .select('*, customers(name)')
    .eq('organization_id', orgId || '')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid': return <Badge className="bg-green-100 text-green-800 hover:bg-green-200 border-green-200">Paid</Badge>
      case 'draft': return <Badge className="bg-zinc-100 text-zinc-800 hover:bg-zinc-200 border-zinc-200">Draft</Badge>
      case 'sent': return <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-blue-200">Sent</Badge>
      case 'overdue': return <Badge className="bg-red-100 text-red-800 hover:bg-red-200 border-red-200">Overdue</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Invoices</h1>
        <Link href="/invoices/new">
          <Button><Plus className="w-4 h-4 mr-2" /> Create Invoice</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Invoices</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Invoice No.</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Issue Date</TableHead>
                <TableHead>Due Date</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-8 text-zinc-500">
                    No invoices found. Create your first one.
                  </TableCell>
                </TableRow>
              ) : (
                invoices?.map((invoice) => (
                  <TableRow key={invoice.id}>
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell>{(invoice.customers as any)?.name}</TableCell>
                    <TableCell>{invoice.issue_date}</TableCell>
                    <TableCell>{invoice.due_date}</TableCell>
                    <TableCell>${invoice.total.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/invoices/${invoice.id}`}>
                        <Button variant="outline" size="sm">View</Button>
                      </Link>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}
