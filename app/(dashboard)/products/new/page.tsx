import { createProduct } from '../actions'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ChevronLeft } from 'lucide-react'

export default async function NewProductPage({ searchParams }: { searchParams: Promise<{ error?: string }> }) {
  const params = await searchParams

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center gap-4">
        <Link href="/products">
          <Button variant="ghost" size="icon"><ChevronLeft className="w-5 h-5" /></Button>
        </Link>
        <h1 className="text-3xl font-bold tracking-tight">Add New Product</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <form action={createProduct}>
          <CardContent className="space-y-4">
            {params.error && (
              <div className="p-3 text-sm text-red-800 border border-red-200 bg-red-50 rounded-md">
                {params.error}
              </div>
            )}
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" name="name" required placeholder="Web Design Retainer" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" name="sku" placeholder="WD-01" />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" placeholder="Monthly design maintenance and support" />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit_price">Unit Price *</Label>
                <Input id="unit_price" name="unit_price" type="number" step="0.01" required placeholder="150.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                <Input id="tax_rate" name="tax_rate" type="number" step="0.01" defaultValue="0.00" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit Type</Label>
                <Input id="unit" name="unit" placeholder="Hours, Item, etc." defaultValue="Item" />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="active" name="active" defaultChecked className="w-4 h-4 rounded border-zinc-300" />
              <Label htmlFor="active">Active Product</Label>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Link href="/products">
                <Button variant="outline" type="button">Cancel</Button>
              </Link>
              <Button type="submit">Save Product</Button>
            </div>
          </CardContent>
        </form>
      </Card>
    </div>
  )
}
