import { Hexagon, Loader2 } from 'lucide-react'

export default function Loading() {
  return (
    <div className="flex min-h-[60vh] w-full flex-col items-center justify-center bg-background/50 backdrop-blur-sm">
      <div className="relative flex flex-col items-center gap-6">
        {/* Glow effect behind loader */}
        <div className="absolute top-1/2 left-1/2 h-24 w-24 -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/20 blur-2xl filter" />
        
        {/* Animated Icon Group */}
        <div className="relative flex items-center justify-center">
          <div className="absolute inset-0 animate-ping rounded-full bg-primary/10" />
          <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-primary to-chart-4 shadow-xl">
            <Hexagon className="h-6 w-6 animate-pulse text-white fill-white/20" />
          </div>
          <Loader2 className="absolute -inset-4 h-22 w-22 animate-[spin_3s_linear_infinite] text-primary/40 stroke-[1.5]" />
        </div>

        <div className="flex flex-col items-center space-y-1">
          <p className="text-sm font-semibold tracking-wider text-foreground uppercase">Loading</p>
          <div className="flex space-x-1">
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.3s]" />
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60 [animation-delay:-0.15s]" />
            <div className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary/60" />
          </div>
        </div>
      </div>
    </div>
  )
}
