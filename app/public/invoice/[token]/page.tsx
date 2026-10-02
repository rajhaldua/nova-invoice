import { createAdminClient } from '@/lib/supabase/admin'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { notFound } from 'next/navigation'
import { Download, CreditCard } from 'lucide-react'

export default async function PublicInvoicePage({ params }: { params: Promise<{ token: string }> }) {
  const { token } = await params
  const supabase = createAdminClient()

  const { data: invoice } = await supabase
    .from('invoices')
    .select(`
      *,
      organizations (name, logo_url, email, address, tax_id),
      customers (name, company_name, email, billing_address),
      invoice_items (*)
    `)
    .eq('public_token', token)
    .single()

  if (!invoice) {
    notFound()
  }

  const org = invoice.organizations as any
  const customer = invoice.customers as any
  const items = invoice.invoice_items as any[]

  return (
    <div className="min-h-screen bg-zinc-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-bold tracking-tight text-zinc-900">Invoice {invoice.invoice_number}</h1>
          <div className="flex gap-2">
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" /> Download PDF
            </Button>
            {invoice.status !== 'paid' && (
              <form action={`/api/invoices/${token}/pay`} method="POST">
                <Button type="submit">
                  <CreditCard className="w-4 h-4 mr-2" /> Pay Now
                </Button>
              </form>
            )}
          </div>
        </div>

        <Card className="p-8">
          <div className="flex justify-between items-start border-b border-zinc-100 pb-8 mb-8">
            <div className="space-y-1">
              <h2 className="text-2xl font-extrabold">{org?.name}</h2>
              <p className="text-sm text-zinc-500 whitespace-pre-wrap">{org?.address}</p>
              {org?.tax_id && <p className="text-sm text-zinc-500">Tax ID: {org.tax_id}</p>}
            </div>
            <div className="text-right space-y-1">
              <p className="text-4xl font-light text-zinc-400">INVOICE</p>
              <p className="text-sm font-medium text-zinc-900">#{invoice.invoice_number}</p>
              <p className="text-sm text-zinc-500">Date: {invoice.issue_date}</p>
              <p className="text-sm text-zinc-500">Due: {invoice.due_date}</p>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-12 mb-8">
            <div>
              <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Billed To</p>
              <p className="font-medium text-zinc-900">{customer?.name}</p>
              {customer?.company_name && <p className="text-zinc-600">{customer.company_name}</p>}
              <p className="text-zinc-500 text-sm whitespace-pre-wrap mt-1">{customer?.billing_address}</p>
            </div>
            <div className="text-right">
              <p className="text-sm font-semibold text-zinc-400 uppercase tracking-wider mb-2">Status</p>
              {invoice.status === 'paid' ? (
                <Badge className="bg-green-100 text-green-800 border-green-200 px-3 py-1 text-sm">PAID IN FULL</Badge>
              ) : (
                <div className="space-y-1">
                  <p className="text-3xl font-bold text-zinc-900">${invoice.amount_due.toFixed(2)}</p>
                  <p className="text-sm text-zinc-500">Amount Due</p>
                </div>
              )}
            </div>
          </div>

          <Table>
            <TableHeader>
              <TableRow className="bg-zinc-50 hover:bg-zinc-50">
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Tax</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {items?.sort((a, b) => a.sort_order - b.sort_order).map((item) => (
                <TableRow key={item.id}>
                  <TableCell className="font-medium">{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.unit_price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">{item.tax_rate}%</TableCell>
                  <TableCell className="text-right">${item.line_total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

          <div className="flex justify-end mt-8 border-t border-zinc-100 pt-8">
            <div className="w-64 space-y-3">
              <div className="flex justify-between text-sm text-zinc-600">
                <span>Subtotal</span>
                <span>${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm text-zinc-600">
                <span>Tax</span>
                <span>${invoice.tax_total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold text-zinc-900 pt-3 border-t">
                <span>Total</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
            </div>
          </div>

        </Card>
      </div>
    </div>
  )
}
