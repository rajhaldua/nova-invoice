import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Activity, CreditCard, DollarSign, Users, Sparkles, Clock, ArrowRight } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function DashboardPage() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500 ease-out">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Dashboard</h1>
          <p className="text-muted-foreground mt-1 text-sm">Here's an overview of your business right now.</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" className="h-9 glass hover:bg-muted/50 transition-all shadow-sm">
            Download Report
          </Button>
          <Button asChild className="h-9 bg-primary text-primary-foreground shadow-md transition-all hover:shadow-lg active:scale-95">
            <Link href="/invoices/new">
              <Sparkles className="mr-2 h-4 w-4" />
              New Invoice
            </Link>
          </Button>
        </div>
      </div>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Total Revenue */}
        <Card className="glass overflow-hidden border-border/50 bg-card/60 backdrop-blur-xl transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Total Revenue</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
              <DollarSign className="w-4 h-4 text-primary" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$0.00</div>
            <div className="mt-1 flex items-center text-xs">
              <span className="text-emerald-500 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded-sm">+0%</span>
              <span className="text-muted-foreground ml-2">from last month</span>
            </div>
          </CardContent>
        </Card>
        
        {/* Outstanding */}
        <Card className="glass overflow-hidden border-border/50 bg-card/60 backdrop-blur-xl transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Outstanding</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-4/10">
              <CreditCard className="w-4 h-4 text-chart-4" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">$0.00</div>
            <p className="mt-1 text-xs text-muted-foreground">0 unpaid invoices</p>
          </CardContent>
        </Card>
        
        {/* Overdue */}
        <Card className="glass overflow-hidden border-border/50 bg-card/60 backdrop-blur-xl transition-all hover:shadow-md relative">
          <div className="absolute inset-0 bg-gradient-to-br from-red-500/5 to-transparent pointer-events-none" />
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0 relative z-10">
            <CardTitle className="text-sm font-medium text-muted-foreground">Overdue</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-red-500/10">
              <Activity className="w-4 h-4 text-red-500" />
            </div>
          </CardHeader>
          <CardContent className="relative z-10">
            <div className="text-2xl font-bold text-red-500 dark:text-red-400">$0.00</div>
            <p className="mt-1 text-xs text-muted-foreground">0 overdue invoices</p>
          </CardContent>
        </Card>

        {/* Active Customers */}
        <Card className="glass overflow-hidden border-border/50 bg-card/60 backdrop-blur-xl transition-all hover:shadow-md">
          <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
            <CardTitle className="text-sm font-medium text-muted-foreground">Active Customers</CardTitle>
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-chart-2/10">
              <Users className="w-4 h-4 text-chart-2" />
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-foreground">0</div>
            <div className="mt-1 flex items-center text-xs">
              <span className="text-emerald-500 font-medium bg-emerald-500/10 px-1.5 py-0.5 rounded-sm">+0</span>
              <span className="text-muted-foreground ml-2">new this month</span>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-7">
        <Card className="col-span-4 glass border-border/50 bg-card/60 backdrop-blur-xl">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Recent Invoices</CardTitle>
            <Button variant="ghost" size="sm" asChild className="text-muted-foreground hover:text-foreground">
              <Link href="/invoices">View All <ArrowRight className="ml-1 h-3 w-3" /></Link>
            </Button>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-[280px] items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 mb-4">
                <CreditCard className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-medium text-foreground">No invoices yet</h3>
              <p className="text-sm text-muted-foreground mt-1 max-w-[250px] text-center">Create your first invoice to start getting paid faster.</p>
              <Button asChild className="mt-6 shadow-md" size="sm">
                <Link href="/invoices/new">Create Invoice</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card className="col-span-3 glass border-border/50 bg-card/60 backdrop-blur-xl">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col h-[280px] items-center justify-center rounded-xl border border-dashed border-border/50 bg-muted/30">
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted-foreground/10 mb-4">
                <Clock className="h-6 w-6 text-muted-foreground" />
              </div>
              <p className="text-sm text-muted-foreground">No recent activity.</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
