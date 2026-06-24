import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").trim();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const { data: subscription, error } = await supabase
      .from("subscriptions")
      .select("tier, status, current_period_end, stripe_customer_id")
      .eq("user_id", user.id)
      .single();

    if (error || !subscription) {
      return NextResponse.json({ hasSubscription: false });
    }

    return NextResponse.json({
      hasSubscription: true,
      tier: subscription.tier,
      status: subscription.status,
      currentPeriodEnd: subscription.current_period_end,
    });
  } catch (err) {
    console.error("Subscription status error:", err);
    return NextResponse.json({ error: "Failed to fetch subscription status" }, { status: 500 });
  }
}
