import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus } from 'lucide-react'

export default async function ProductsPage() {
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

  // Fetch active products
  const { data: products } = await supabase
    .from('products')
    .select('*')
    .eq('organization_id', orgId || '')
    .is('deleted_at', null)
    .order('created_at', { ascending: false })

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight">Products & Services</h1>
        <Link href="/products/new">
          <Button><Plus className="w-4 h-4 mr-2" /> Add Product</Button>
        </Link>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Name</TableHead>
                <TableHead>SKU</TableHead>
                <TableHead>Unit Price</TableHead>
                <TableHead>Tax Rate</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8 text-zinc-500">
                    No products found. Create your first one.
                  </TableCell>
                </TableRow>
              ) : (
                products?.map((product) => (
                  <TableRow key={product.id}>
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell>{product.sku || '-'}</TableCell>
                    <TableCell>${product.unit_price.toFixed(2)}</TableCell>
                    <TableCell>{product.tax_rate}%</TableCell>
                    <TableCell>
                      {product.active ? (
                        <Badge variant="outline" className="text-green-600 bg-green-50 border-green-200">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-zinc-600 bg-zinc-50 border-zinc-200">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/products/${product.id}`}>
                        <Button variant="outline" size="sm">Edit</Button>
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
