import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import Link from 'next/link'
import { ChevronLeft, FileText, Send, Trash2, ExternalLink } from 'lucide-react'
import { redirect } from 'next/navigation'
import { deleteInvoice, markAsSent, markAsPaid } from '../actions'

export default async function InvoiceViewPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: invoice } = await supabase
    .from('invoices')
    .select('*, customers(*), invoice_items(*)')
    .eq('id', id)
    .single()

  if (!invoice) {
    redirect('/invoices')
  }

  const deleteInvoiceWithId = deleteInvoice.bind(null, id)
  const markAsSentWithId = markAsSent.bind(null, id)
  const markAsPaidWithId = markAsPaid.bind(null, id, invoice.total)

  const getStatusBadge = (status: string) => {
    switch(status) {
      case 'paid': return <Badge className="bg-green-100 text-green-800 border-green-200">Paid</Badge>
      case 'draft': return <Badge className="bg-zinc-100 text-zinc-800 border-zinc-200">Draft</Badge>
      case 'sent': return <Badge className="bg-blue-100 text-blue-800 border-blue-200">Sent</Badge>
      case 'overdue': return <Badge className="bg-red-100 text-red-800 border-red-200">Overdue</Badge>
      default: return <Badge variant="outline">{status}</Badge>
    }
  }

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/invoices">
            <Button variant="ghost" size="icon"><ChevronLeft className="w-5 h-5" /></Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Invoice {invoice.invoice_number}</h1>
          {getStatusBadge(invoice.status)}
        </div>
        <div className="flex gap-2">
          {invoice.status === 'draft' && (
            <form action={markAsSentWithId}>
              <Button type="submit" variant="outline"><Send className="w-4 h-4 mr-2" /> Mark Sent</Button>
            </form>
          )}
          {invoice.status !== 'paid' && (
            <form action={markAsPaidWithId}>
              <Button type="submit"><Badge className="mr-2 bg-green-500 text-white">$</Badge> Mark Paid</Button>
            </form>
          )}
          <form action={deleteInvoiceWithId}>
            <Button variant="destructive" size="icon" type="submit">
              <Trash2 className="w-4 h-4" />
            </Button>
          </form>
        </div>
      </div>

      <Card>
        <CardHeader className="flex flex-row justify-between">
          <div>
            <CardTitle>Customer Details</CardTitle>
            <div className="mt-2 text-sm text-zinc-600">
              <p className="font-medium text-zinc-900">{(invoice.customers as { name: string } | null)?.name}</p>
              <p>{(invoice.customers as { email: string } | null)?.email}</p>
              <p>{(invoice.customers as { billing_address: string } | null)?.billing_address}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm font-medium text-zinc-900">Issue Date</p>
            <p className="text-sm text-zinc-600">{invoice.issue_date}</p>
            <p className="text-sm font-medium text-zinc-900 mt-2">Due Date</p>
            <p className="text-sm text-zinc-600">{invoice.due_date}</p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Description</TableHead>
                <TableHead className="text-right">Qty</TableHead>
                <TableHead className="text-right">Price</TableHead>
                <TableHead className="text-right">Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {(invoice.invoice_items as { id: string, description: string, quantity: number, unit_price: number, line_total: number }[])?.map((item) => (
                <TableRow key={item.id}>
                  <TableCell>{item.description}</TableCell>
                  <TableCell className="text-right">{item.quantity}</TableCell>
                  <TableCell className="text-right">${item.unit_price.toFixed(2)}</TableCell>
                  <TableCell className="text-right">${item.line_total.toFixed(2)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          <div className="mt-6 flex justify-end">
            <div className="w-64 space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Subtotal</span>
                <span className="font-medium">${invoice.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-600">Tax</span>
                <span className="font-medium">${invoice.tax_total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg font-bold border-t pt-2 mt-2">
                <span>Total</span>
                <span>${invoice.total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm pt-2 text-zinc-500">
                <span>Amount Due</span>
                <span>${invoice.amount_due.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
        <CardFooter className="bg-zinc-50 flex justify-between border-t p-6">
          <Link href={`/public/invoice/${invoice.token}`} target="_blank">
            <Button variant="outline"><ExternalLink className="w-4 h-4 mr-2" /> Public Link</Button>
          </Link>
          <Link href={`/api/invoices/${invoice.token}/pdf`} target="_blank">
            <Button variant="secondary"><FileText className="w-4 h-4 mr-2" /> Download PDF</Button>
          </Link>
        </CardFooter>
      </Card>
    </div>
  )
}
