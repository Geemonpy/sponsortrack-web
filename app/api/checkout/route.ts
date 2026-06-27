import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PLANS, PlanSlug } from "@/lib/stripe/plans";
import { supabase } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-05-27.dahlia" as any });

export async function POST(req: NextRequest) {
  // Verify auth token from Authorization header
  const authHeader = req.headers.get("authorization");
  const token = authHeader?.replace("Bearer ", "").trim();
  if (!token) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: { user }, error: authError } = await supabase.auth.getUser(token);
  if (authError || !user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  let plan: string;
  try {
    const body = await req.json();
    plan = String(body.plan || "").trim();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const planConfig = PLANS[plan as PlanSlug];
  if (!planConfig) {
    return NextResponse.json({ error: "Invalid plan" }, { status: 400 });
  }

  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  try {
    const session = await stripe.checkout.sessions.create({
      mode: "subscription",
      allow_promotion_codes: true,
      line_items: [{ price: planConfig.priceId, quantity: 1 }],
      client_reference_id: user.id,
      customer_email: user.email,
      subscription_data: {
        metadata: { tier: planConfig.tier, userId: user.id },
      },
      success_url: `${siteUrl}/payment-success`,
      cancel_url: `${siteUrl}/payment-cancelled`,
    });

    return NextResponse.json({ url: session.url });
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Stripe error";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
