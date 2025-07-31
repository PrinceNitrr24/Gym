"use client"

import { Button } from "@/components/ui/button"
import { Home } from "lucide-react"
import Link from "next/link"
import { motion } from "framer-motion"

export function Header() {
  return (
    <header className="border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.5 }}>
          <Link href="/" className="flex items-center gap-2">
            <motion.div
              className="h-8 w-8 rounded bg-emerald-600 flex items-center justify-center"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
            >
              <Home className="h-4 w-4 text-white" />
            </motion.div>
            <span className="font-bold text-xl">FitnessPro</span>
          </Link>
        </motion.div>

        <motion.nav
          className="hidden md:flex items-center gap-6"
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <Link href="#features" className="text-sm font-medium hover:text-emerald-600 transition-colors">
            Features
          </Link>
          <Link href="#pricing" className="text-sm font-medium hover:text-emerald-600 transition-colors">
            Pricing
          </Link>
          <Link href="/about" className="text-sm font-medium hover:text-emerald-600 transition-colors">
            About
          </Link>
        </motion.nav>

        <motion.div
          className="flex items-center gap-2"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button variant="ghost" asChild>
              <Link href="/login">Sign In</Link>
            </Button>
          </motion.div>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Button className="bg-emerald-600 hover:bg-emerald-700" asChild>
              <Link href="/signup">Get Started</Link>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </header>
  )
}
