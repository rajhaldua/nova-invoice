import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, FileText } from 'lucide-react'

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
      case 'paid': return <Badge variant="outline" className="bg-emerald-500/10 text-emerald-600 border-emerald-500/20 font-medium">Paid</Badge>
      case 'draft': return <Badge variant="outline" className="bg-muted/50 text-muted-foreground border-border/50 font-medium">Draft</Badge>
      case 'sent': return <Badge variant="outline" className="bg-blue-500/10 text-blue-600 border-blue-500/20 font-medium">Sent</Badge>
      case 'overdue': return <Badge variant="outline" className="bg-red-500/10 text-red-600 border-red-500/20 font-medium">Overdue</Badge>
      default: return <Badge variant="outline" className="font-medium bg-muted/50 border-border/50">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Invoices</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage and track all your invoices in one place.</p>
        </div>
        <Link href="/invoices/new">
          <Button className="h-9 bg-primary text-primary-foreground shadow-md transition-all hover:shadow-lg active:scale-95">
            <Plus className="w-4 h-4 mr-2" /> Create Invoice
          </Button>
        </Link>
      </div>

      <Card className="glass border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm">
        <CardHeader className="border-b border-border/30 bg-muted/20">
          <CardTitle>All Invoices</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Invoice No.</TableHead>
                <TableHead className="font-semibold">Customer</TableHead>
                <TableHead className="font-semibold">Issue Date</TableHead>
                <TableHead className="font-semibold">Due Date</TableHead>
                <TableHead className="font-semibold">Total</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {invoices?.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={7} className="h-[300px]">
                    <div className="flex h-full flex-col items-center justify-center space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <FileText className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-lg font-medium text-foreground">No invoices found</p>
                      <p className="text-sm text-muted-foreground">Create your first invoice to get paid.</p>
                      <Link href="/invoices/new" className="mt-2">
                        <Button variant="outline" className="shadow-sm">Create Invoice</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                invoices?.map((invoice) => (
                  <TableRow key={invoice.id} className="transition-colors hover:bg-muted/40">
                    <TableCell className="font-medium">{invoice.invoice_number}</TableCell>
                    <TableCell className="text-muted-foreground">{(invoice.customers as { name: string } | null)?.name}</TableCell>
                    <TableCell className="text-muted-foreground">{invoice.issue_date}</TableCell>
                    <TableCell className="text-muted-foreground">{invoice.due_date}</TableCell>
                    <TableCell className="font-medium">${invoice.total.toFixed(2)}</TableCell>
                    <TableCell>{getStatusBadge(invoice.status)}</TableCell>
                    <TableCell className="text-right">
                      <Link href={`/invoices/${invoice.id}`}>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors">View</Button>
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
