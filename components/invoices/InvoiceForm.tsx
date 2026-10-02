'use client'

import { useState, useMemo } from 'react'
import { createInvoice } from '@/app/(dashboard)/invoices/actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Plus, Trash2 } from 'lucide-react'

export function InvoiceForm({ customers, products }: { customers: any[], products: any[] }) {
  const [customerId, setCustomerId] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [dueDate, setDueDate] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  
  const [items, setItems] = useState([
    { product_id: '', description: '', quantity: 1, unit_price: 0, tax_rate: 0, line_total: 0 }
  ])

  const handleItemChange = (index: number, field: string, value: any) => {
    const newItems = [...items]
    const item = { ...newItems[index], [field]: value }
    
    // Auto-fill from product
    if (field === 'product_id') {
      const product = products.find(p => p.id === value)
      if (product) {
        item.description = product.name
        item.unit_price = product.unit_price
        item.tax_rate = product.tax_rate
      }
    }

    // Calc line total
    const sub = Number(item.quantity) * Number(item.unit_price)
    item.line_total = sub + (sub * (Number(item.tax_rate) / 100))
    
    newItems[index] = item
    setItems(newItems)
  }

  const addItem = () => {
    setItems([...items, { product_id: '', description: '', quantity: 1, unit_price: 0, tax_rate: 0, line_total: 0 }])
  }

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index))
  }

  const totals = useMemo(() => {
    let subtotal = 0
    let tax_total = 0
    let total = 0

    items.forEach(item => {
      const sub = Number(item.quantity) * Number(item.unit_price)
      const tax = sub * (Number(item.tax_rate) / 100)
      subtotal += sub
      tax_total += tax
      total += (sub + tax)
    })

    return { subtotal, tax_total, total, amount_due: total }
  }, [items])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!customerId) return alert('Select a customer')
    setIsSubmitting(true)

    const res = await createInvoice({
      customer_id: customerId,
      issue_date: issueDate,
      due_date: dueDate,
      items,
      ...totals
    })

    if (res?.error) {
      alert(`Error creating invoice: ${res.error}`)
      setIsSubmitting(false)
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Customer & Dates</CardTitle>
        </CardHeader>
        <CardContent className="grid grid-cols-3 gap-6">
          <div className="space-y-2">
            <Label>Customer</Label>
            <Select onValueChange={(val) => setCustomerId(String(val))} required>
              <SelectTrigger><SelectValue placeholder="Select customer" /></SelectTrigger>
              <SelectContent>
                {customers.map(c => (
                  <SelectItem key={c.id} value={c.id}>{c.name} {c.company_name ? `(${c.company_name})` : ''}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2">
            <Label>Issue Date</Label>
            <Input type="date" required value={issueDate} onChange={e => setIssueDate(e.target.value)} />
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input type="date" required value={dueDate} onChange={e => setDueDate(e.target.value)} />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Line Items</CardTitle>
          <Button type="button" onClick={addItem} variant="outline" size="sm">
            <Plus className="w-4 h-4 mr-2" /> Add Item
          </Button>
        </CardHeader>
        <CardContent className="space-y-4">
          {items.map((item, idx) => (
            <div key={idx} className="flex gap-4 items-end border-b pb-4 border-zinc-100">
              <div className="space-y-2 flex-1">
                <Label>Product</Label>
                <Select onValueChange={(val) => handleItemChange(idx, 'product_id', val)}>
                  <SelectTrigger><SelectValue placeholder="Select product" /></SelectTrigger>
                  <SelectContent>
                    {products.map(p => (
                      <SelectItem key={p.id} value={p.id}>{p.name}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2 flex-1">
                <Label>Description</Label>
                <Input value={item.description} onChange={e => handleItemChange(idx, 'description', e.target.value)} />
              </div>
              <div className="space-y-2 w-24">
                <Label>Qty</Label>
                <Input type="number" min="1" step="0.01" value={item.quantity} onChange={e => handleItemChange(idx, 'quantity', e.target.value)} />
              </div>
              <div className="space-y-2 w-32">
                <Label>Price</Label>
                <Input type="number" step="0.01" value={item.unit_price} onChange={e => handleItemChange(idx, 'unit_price', e.target.value)} />
              </div>
              <div className="space-y-2 w-24">
                <Label>Tax %</Label>
                <Input type="number" step="0.01" value={item.tax_rate} onChange={e => handleItemChange(idx, 'tax_rate', e.target.value)} />
              </div>
              <div className="space-y-2 w-32">
                <Label>Line Total</Label>
                <div className="h-10 flex items-center px-3 bg-zinc-50 border rounded-md font-medium text-zinc-900">
                  ${item.line_total.toFixed(2)}
                </div>
              </div>
              <Button type="button" variant="ghost" size="icon" className="text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => removeItem(idx)}>
                <Trash2 className="w-5 h-5" />
              </Button>
            </div>
          ))}

          <div className="flex justify-end pt-4">
            <div className="w-64 space-y-3 bg-zinc-50 p-4 rounded-lg border">
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Subtotal</span>
                <span className="font-medium">${totals.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-zinc-500">Tax</span>
                <span className="font-medium">${totals.tax_total.toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-lg pt-3 border-t">
                <span>Total</span>
                <span>${totals.total.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button type="submit" size="lg" disabled={isSubmitting}>
          {isSubmitting ? 'Creating...' : 'Create Invoice'}
        </Button>
      </div>
    </form>
  )
}
