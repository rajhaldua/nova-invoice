import { createClient } from '@/lib/supabase/server'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import Link from 'next/link'
import { Plus, Package } from 'lucide-react'

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
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Products & Services</h1>
          <p className="text-muted-foreground mt-1 text-sm">Manage your catalog of billable items.</p>
        </div>
        <Link href="/products/new">
          <Button className="h-9 bg-primary text-primary-foreground shadow-md transition-all hover:shadow-lg active:scale-95">
            <Plus className="w-4 h-4 mr-2" /> Add Product
          </Button>
        </Link>
      </div>

      <Card className="glass border-border/50 bg-card/60 backdrop-blur-xl overflow-hidden shadow-sm">
        <CardHeader className="border-b border-border/30 bg-muted/20">
          <CardTitle>All Products</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader className="bg-muted/30">
              <TableRow className="hover:bg-transparent">
                <TableHead className="font-semibold">Name</TableHead>
                <TableHead className="font-semibold">SKU</TableHead>
                <TableHead className="font-semibold">Unit Price</TableHead>
                <TableHead className="font-semibold">Tax Rate</TableHead>
                <TableHead className="font-semibold">Status</TableHead>
                <TableHead className="text-right font-semibold">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products?.length === 0 ? (
                <TableRow className="hover:bg-transparent">
                  <TableCell colSpan={6} className="h-[300px]">
                    <div className="flex h-full flex-col items-center justify-center space-y-3">
                      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10">
                        <Package className="h-6 w-6 text-primary" />
                      </div>
                      <p className="text-lg font-medium text-foreground">No products found</p>
                      <p className="text-sm text-muted-foreground">Add your first product to get started.</p>
                      <Link href="/products/new" className="mt-2">
                        <Button variant="outline" className="shadow-sm">Create Product</Button>
                      </Link>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                products?.map((product) => (
                  <TableRow key={product.id} className="transition-colors hover:bg-muted/40">
                    <TableCell className="font-medium">{product.name}</TableCell>
                    <TableCell className="text-muted-foreground">{product.sku || '-'}</TableCell>
                    <TableCell className="text-muted-foreground">${product.unit_price.toFixed(2)}</TableCell>
                    <TableCell className="text-muted-foreground">{product.tax_rate}%</TableCell>
                    <TableCell>
                      {product.active ? (
                        <Badge variant="outline" className="text-emerald-600 bg-emerald-500/10 border-emerald-500/20">Active</Badge>
                      ) : (
                        <Badge variant="outline" className="text-muted-foreground bg-muted/50 border-border/50">Inactive</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right">
                      <Link href={`/products/${product.id}`}>
                        <Button variant="ghost" size="sm" className="hover:bg-primary/10 hover:text-primary transition-colors">Edit</Button>
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
