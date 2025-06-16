import Image from "next/image"
import Link from "next/link"
import { ArrowRight } from "lucide-react"

import { Button } from "@/components/ui/button"

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      {/* Navbar */}
      <nav className="w-full py-6">
        <div className="container mx-auto flex items-center justify-between px-4">
          <Link href="/" className="flex items-center" aria-label="Fraya home">
            <span className="text-2xl font-bold lowercase">fraya</span>
            <span className="ml-2 w-4 h-4 rounded-full bg-gradient-to-r from-indigo-400 to-blue-500" />
          </Link>

          <Button asChild size="lg" className="px-4 py-2 rounded-xl bg-black text-white hover:opacity-90">
            <Link href="/dashboard" className="flex items-center" aria-label="Go to dashboard">
              Go to Dashboard
              <ArrowRight className="ml-2 size-4" />
            </Link>
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <main className="flex flex-col items-center justify-center flex-grow pt-16 pb-24 px-4">
        <div className="flex flex-col items-center space-y-8 w-full">
          <div className="flex items-center">
            <h2 className="text-2xl font-bold lowercase">fraya</h2>
            <span className="ml-2 w-4 h-4 rounded-full bg-gradient-to-r from-indigo-400 to-blue-500" />
          </div>

          <h1 className="text-center text-5xl md:text-6xl font-extrabold tracking-tight">
            Work. Life.{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 to-blue-500">
              Handled.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-center text-muted-foreground max-w-2xl">
            <span className="font-bold">Meet Fraya</span> — the executive assistant that manages your calendar, email, and all the details of your work-life so you never have to sweat the small stuff again.
          </p>

          <Button size="lg" className="px-6 py-3 rounded-xl bg-black text-white hover:opacity-90" aria-label="Login with Google">
            <Image src="/google.svg" alt="Google logo" width={20} height={20} className="mr-2 rounded-full" />
            Login with Google
          </Button>

          <div className="w-full max-w-3xl mt-8">
            <Image src="/hero-laptop.jpg" alt="Laptop with hands typing" width={1200} height={675} className="rounded-2xl shadow-lg w-full h-auto" priority />
          </div>
        </div>
      </main>
    </div>
  );
}
