import { type NextRequest, NextResponse } from "next/server"
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase"
import { demoTrainers } from "@/lib/demo-data"

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ data: demoTrainers, error: null })
    }

    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ data: demoTrainers, error: null })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("trainers")
      .select("*")
      .eq("gym_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ data: demoTrainers, error: null })
    }

    return NextResponse.json({ data: data || [], error: null })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ data: demoTrainers, error: null })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!isSupabaseConfigured()) {
      const newTrainer = {
        id: Date.now().toString(),
        ...body,
        created_at: new Date().toISOString(),
        status: "Active",
        rating: 0,
      }
      return NextResponse.json({ data: newTrainer, error: null })
    }

    const supabase = createServerClient()
    if (!supabase) {
      const newTrainer = {
        id: Date.now().toString(),
        ...body,
        created_at: new Date().toISOString(),
        status: "Active",
        rating: 0,
      }
      return NextResponse.json({ data: newTrainer, error: null })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("trainers")
      .insert([{ ...body, gym_id: user.id }])
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      const newTrainer = {
        id: Date.now().toString(),
        ...body,
        created_at: new Date().toISOString(),
        status: "Active",
        rating: 0,
      }
      return NextResponse.json({ data: newTrainer, error: null })
    }

    return NextResponse.json({ data, error: null })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
