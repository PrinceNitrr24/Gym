import { type NextRequest, NextResponse } from "next/server"
import { createServerClient, isSupabaseConfigured } from "@/lib/supabase"
import { demoPayments } from "@/lib/demo-data"

export async function GET(request: NextRequest) {
  try {
    if (!isSupabaseConfigured()) {
      return NextResponse.json({ data: demoPayments, error: null })
    }

    const supabase = createServerClient()
    if (!supabase) {
      return NextResponse.json({ data: demoPayments, error: null })
    }

    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { data, error } = await supabase
      .from("payments")
      .select(`
        *,
        members!inner(full_name, email, gym_id),
        packages!inner(name)
      `)
      .eq("members.gym_id", user.id)
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Supabase error:", error)
      return NextResponse.json({ data: demoPayments, error: null })
    }

    // Transform data to match expected format
    const transformedData =
      data?.map((payment) => ({
        ...payment,
        member_name: payment.members?.full_name,
        member_email: payment.members?.email,
        package_name: payment.packages?.name,
      })) || []

    return NextResponse.json({ data: transformedData, error: null })
  } catch (error) {
    console.error("API error:", error)
    return NextResponse.json({ data: demoPayments, error: null })
  }
}
