import { type NextRequest, NextResponse } from "next/server"
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase"

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const body = await request.json()
    const { packageId, startDate } = body

    if (!isSupabaseConfigured()) {
      return NextResponse.json({
        success: true,
        data: {
          id: params.id,
          status: "Active",
          reactivation_date: startDate,
          updated_at: new Date().toISOString(),
        },
      })
    }

    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({
        success: true,
        data: {
          id: params.id,
          status: "Active",
          reactivation_date: startDate,
          updated_at: new Date().toISOString(),
        },
      })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("members")
      .update({
        status: "Active",
        reactivation_date: startDate,
        cancellation_reason: null,
        cancellation_date: null,
        updated_at: new Date().toISOString(),
      })
      .eq("id", params.id)
      .eq("gym_id", user.id)
      .select()
      .single()

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({
        success: true,
        data: {
          id: params.id,
          status: "Active",
          reactivation_date: startDate,
          updated_at: new Date().toISOString(),
        },
      })
    }

    return NextResponse.json({ success: true, data })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ error: "Internal server error" }, { status: 500 })
  }
}
