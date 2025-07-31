import { type NextRequest, NextResponse } from "next/server"
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase"
import { demoMembers } from "@/lib/demo-data"

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      // Return demo data
      return NextResponse.json({ data: demoMembers, error: null })
    }

    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ data: demoMembers, error: null })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("members")
      .select("*")
      .eq("gym_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ data: demoMembers, error: null })
    }

    return NextResponse.json({ data: data || [], error: null })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ data: demoMembers, error: null })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!isSupabaseConfigured()) {
      // Return success with demo data
      const newMember = {
        id: Date.now().toString(),
        ...body,
        created_at: new Date().toISOString(),
        status: "Active",
      }
      return NextResponse.json({ data: newMember, error: null })
    }

    const supabase = createServerClient()
    if (!supabase) {
      const newMember = {
        id: Date.now().toString(),
        ...body,
        created_at: new Date().toISOString(),
        status: "Active",
      }
      return NextResponse.json({ data: newMember, error: null })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("members")
      .insert([{ ...body, gym_id: user.id }])
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      const newMember = {
        id: Date.now().toString(),
        ...body,
        created_at: new Date().toISOString(),
        status: "Active",
      }
      return NextResponse.json({ data: newMember, error: null })
    }

    return NextResponse.json({ data, error: null })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
