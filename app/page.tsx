import Link from "next/link";
import { Button } from "@/components/ui/button";
import { ArrowRight, CheckCircle2, Shield, Zap, Receipt, LineChart, Globe } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen bg-background selection:bg-primary/30 flex flex-col font-sans overflow-x-hidden">
      {/* Decorative Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1000px] h-[500px] opacity-20 bg-gradient-to-b from-primary/50 to-transparent blur-[120px] rounded-full" />
      </div>

      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/60 backdrop-blur-xl supports-[backdrop-filter]:bg-background/60">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground font-bold shadow-lg shadow-primary/20">
              N
            </div>
            <span className="text-xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-foreground to-foreground/70">
              NovaInvoice
            </span>
          </div>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden sm:inline-flex">
              <Button variant="ghost" className="hover:bg-primary/10 hover:text-primary transition-colors font-medium">Log In</Button>
            </Link>
            <Link href="/signup">
              <Button className="shadow-md shadow-primary/20 transition-all hover:shadow-lg hover:shadow-primary/30 active:scale-95 group">
                Get Started
                <ArrowRight className="w-4 h-4 ml-1.5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="flex-1 z-10">
        <section className="relative pt-24 pb-32 sm:pt-32 sm:pb-40 lg:pt-40 lg:pb-48">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <div className="inline-flex items-center rounded-full border border-primary/20 bg-primary/10 px-3 py-1 text-sm font-medium text-primary mb-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              <Zap className="h-4 w-4 mr-1.5" />
              <span>The future of invoicing is here</span>
            </div>
            
            <h1 className="mx-auto max-w-4xl font-extrabold tracking-tight text-4xl sm:text-5xl md:text-6xl lg:text-7xl animate-in fade-in slide-in-from-bottom-6 duration-700 delay-100">
              Invoicing that feels like <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary via-blue-500 to-purple-600">magic</span>.
            </h1>
            
            <p className="mx-auto mt-6 max-w-2xl text-lg sm:text-xl text-muted-foreground animate-in fade-in slide-in-from-bottom-8 duration-700 delay-200">
              NovaInvoice is the modern, self-hostable platform designed for small businesses and freelancers. Create beautiful invoices, track payments, and manage customers effortlessly.
            </p>
            
            <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-in fade-in slide-in-from-bottom-10 duration-700 delay-300">
              <Link href="/signup" className="w-full sm:w-auto">
                <Button size="lg" className="w-full sm:w-auto h-12 px-8 text-base shadow-xl shadow-primary/20 transition-all hover:shadow-2xl hover:shadow-primary/30 active:scale-95 group">
                  Start for free
                  <ArrowRight className="w-5 h-5 ml-2 transition-transform group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/login" className="w-full sm:w-auto">
                <Button variant="outline" size="lg" className="w-full sm:w-auto h-12 px-8 text-base bg-background/50 backdrop-blur-sm border-border/50 hover:bg-muted/50 transition-colors">
                  Sign into dashboard
                </Button>
              </Link>
            </div>
            
            <p className="mt-6 text-sm text-muted-foreground animate-in fade-in duration-700 delay-500">
              No credit card required. Setup takes less than a minute.
            </p>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20 sm:py-32 relative bg-muted/30 border-t border-border/40">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8">
            <div className="mb-16 text-center">
              <h2 className="text-3xl sm:text-4xl font-bold tracking-tight">Everything you need to get paid faster</h2>
              <p className="mt-4 text-lg text-muted-foreground max-w-2xl mx-auto">
                Stop wrestling with spreadsheets and clunky legacy software. NovaInvoice gives you professional tools with a consumer-grade experience.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: Receipt, title: "Beautiful Invoices", desc: "Generate stunning PDF invoices that impress your clients and represent your brand." },
                { icon: Shield, title: "Self-Hostable", desc: "Own your data. NovaInvoice can be easily self-hosted on your own infrastructure." },
                { icon: Zap, title: "Lightning Fast", desc: "Built on modern tech for instant interactions. No more waiting for page reloads." },
                { icon: Globe, title: "Multi-Currency", desc: "Bill clients globally with native support for multiple currencies and tax rates." },
                { icon: CheckCircle2, title: "Automated Tracking", desc: "Know exactly when your invoices are viewed, paid, or overdue." },
                { icon: LineChart, title: "Financial Insights", desc: "Get clear visibility into your business health with beautiful dashboard analytics." },
              ].map((feature, i) => (
                <div key={i} className="group relative p-6 sm:p-8 rounded-3xl bg-card border border-border/50 shadow-sm transition-all hover:shadow-xl hover:shadow-primary/5 hover:-translate-y-1 overflow-hidden">
                  <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="relative z-10">
                    <div className="mb-5 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10 text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                      <feature.icon className="h-6 w-6" />
                    </div>
                    <h3 className="mb-2 text-xl font-semibold">{feature.title}</h3>
                    <p className="text-muted-foreground leading-relaxed">{feature.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-border/40 bg-background py-12 z-10 relative">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary text-primary-foreground font-bold text-xs">N</div>
            <span className="font-semibold tracking-tight">NovaInvoice</span>
          </div>
          <p className="text-sm text-muted-foreground text-center md:text-left">
            &copy; {new Date().getFullYear()} NovaInvoice. Open source billing platform.
          </p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Twitter</Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">GitHub</Link>
            <Link href="#" className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">Documentation</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
