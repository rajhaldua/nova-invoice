import { updateProduct, deleteProduct } from '../actions'
import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import Link from 'next/link'
import { ChevronLeft, Trash2 } from 'lucide-react'
import { redirect } from 'next/navigation'

export default async function EditProductPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params
  const supabase = await createClient()

  const { data: product } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .single()

  if (!product) {
    redirect('/products')
  }

  const updateProductWithId = updateProduct.bind(null, id)
  const deleteProductWithId = deleteProduct.bind(null, id)

  return (
    <div className="space-y-6 max-w-2xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/products">
            <Button variant="ghost" size="icon"><ChevronLeft className="w-5 h-5" /></Button>
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Edit Product</h1>
        </div>
        <form action={deleteProductWithId}>
          <Button variant="destructive" size="sm" type="submit">
            <Trash2 className="w-4 h-4 mr-2" /> Delete
          </Button>
        </form>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Product Details</CardTitle>
        </CardHeader>
        <form action={updateProductWithId}>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="name">Product Name *</Label>
                <Input id="name" name="name" required defaultValue={product.name} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="sku">SKU</Label>
                <Input id="sku" name="sku" defaultValue={product.sku || ''} />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Input id="description" name="description" defaultValue={product.description || ''} />
            </div>

            <div className="grid grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="unit_price">Unit Price *</Label>
                <Input id="unit_price" name="unit_price" type="number" step="0.01" required defaultValue={product.unit_price} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="tax_rate">Tax Rate (%)</Label>
                <Input id="tax_rate" name="tax_rate" type="number" step="0.01" defaultValue={product.tax_rate} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="unit">Unit Type</Label>
                <Input id="unit" name="unit" defaultValue={product.unit || 'Item'} />
              </div>
            </div>

            <div className="flex items-center gap-2 pt-2">
              <input type="checkbox" id="active" name="active" defaultChecked={product.active} className="w-4 h-4 rounded border-zinc-300" />
              <Label htmlFor="active">Active Product</Label>
            </div>

            <div className="pt-4 flex justify-end gap-2">
              <Link href="/products">
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
