import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-zinc-50 p-4">
      <div className="max-w-3xl text-center space-y-6">
        <h1 className="text-5xl font-extrabold tracking-tight text-zinc-900">
          NovaInvoice
        </h1>
        <p className="text-xl text-zinc-600">
          The modern, self-hostable invoicing and small-business finance platform.
        </p>
        <div className="flex items-center justify-center gap-4 pt-4">
          <Link href="/login">
            <Button size="lg">Log In</Button>
          </Link>
          <Link href="/signup">
            <Button variant="outline" size="lg">Sign Up</Button>
          </Link>
        </div>
      </div>
    </div>
  );
}
