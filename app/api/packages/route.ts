import { type NextRequest, NextResponse } from "next/server"
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase"
import { demoPackages } from "@/lib/demo-data"

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ data: demoPackages, error: null })
    }

    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ data: demoPackages, error: null })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("packages")
      .select("*")
      .eq("gym_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ data: demoPackages, error: null })
    }

    return NextResponse.json({ data: data || [], error: null })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ data: demoPackages, error: null })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!isSupabaseConfigured()) {
      const newPackage = {
        id: Date.now().toString(),
        ...body,
        created_at: new Date().toISOString(),
        is_active: true,
      }
      return NextResponse.json({ data: newPackage, error: null })
    }

    const supabase = createServerClient()
    if (!supabase) {
      const newPackage = {
        id: Date.now().toString(),
        ...body,
        created_at: new Date().toISOString(),
        is_active: true,
      }
      return NextResponse.json({ data: newPackage, error: null })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("packages")
      .insert([{ ...body, gym_id: user.id }])
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      const newPackage = {
        id: Date.now().toString(),
        ...body,
        created_at: new Date().toISOString(),
        is_active: true,
      }
      return NextResponse.json({ data: newPackage, error: null })
    }

    return NextResponse.json({ data, error: null })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
