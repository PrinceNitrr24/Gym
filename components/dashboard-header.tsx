"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { SidebarTrigger } from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { LogOut, Settings, User } from "lucide-react"
import { useRouter } from "next/navigation"

// Dynamically import Supabase to handle missing env vars
const createClientComponentClient = () => {
  try {
    const { createClientComponentClient } = require("@supabase/auth-helpers-nextjs")
    return createClientComponentClient()
  } catch (error) {
    return null
  }
}

export function DashboardHeader() {
  const [user, setUser] = useState<any>(null)
  const [supabaseConfigured, setSupabaseConfigured] = useState(true)
  const router = useRouter()

  useEffect(() => {
    const getUser = async () => {
      // Check if Supabase is configured
      const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
      const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

      if (!supabaseUrl || !supabaseAnonKey) {
        setSupabaseConfigured(false)
        // Set demo user
        setUser({
          email: "demo@fitnesspro.com",
          user_metadata: {
            gym_name: "Demo Fitness Center",
          },
        })
        return
      }

      try {
        const supabase = createClientComponentClient()
        if (!supabase) {
          setSupabaseConfigured(false)
          setUser({
            email: "demo@fitnesspro.com",
            user_metadata: {
              gym_name: "Demo Fitness Center",
            },
          })
          return
        }

        const {
          data: { user },
        } = await supabase.auth.getUser()
        setUser(user)
      } catch (error) {
        console.error("Error getting user:", error)
        setSupabaseConfigured(false)
        setUser({
          email: "demo@fitnesspro.com",
          user_metadata: {
            gym_name: "Demo Fitness Center",
          },
        })
      }
    }
    getUser()
  }, [])

  const handleLogout = async () => {
    if (supabaseConfigured) {
      try {
        const supabase = createClientComponentClient()
        if (supabase) {
          await supabase.auth.signOut()
        }
      } catch (error) {
        console.error("Error signing out:", error)
      }
    }
    router.push("/")
    router.refresh()
  }

  return (
    <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
      <SidebarTrigger className="-ml-1" />
      <div className="flex items-center gap-2 flex-1">
        <div className="h-6 w-6 rounded bg-emerald-600" />
        <span className="font-semibold">FitnessPro CRM</span>
        {!supabaseConfigured && (
          <span className="text-xs bg-amber-100 text-amber-800 px-2 py-1 rounded">Demo Mode</span>
        )}
      </div>

      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative h-8 w-8 rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src="/placeholder.svg" alt="User" />
              <AvatarFallback>
                {user?.user_metadata?.gym_name?.charAt(0) || user?.email?.charAt(0) || "U"}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">{user?.user_metadata?.gym_name || "Gym Owner"}</p>
              <p className="text-xs leading-none text-muted-foreground">{user?.email}</p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </DropdownMenuItem>
          <DropdownMenuItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            <span>Log out</span>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </header>
  )
}
