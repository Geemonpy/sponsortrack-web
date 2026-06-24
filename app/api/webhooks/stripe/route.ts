import { NextRequest, NextResponse } from "next/server";
import Stripe from "stripe";
import { PLANS } from "@/lib/stripe/plans";
import { supabase } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, { apiVersion: "2026-05-27.dahlia" as any });

function tierFromPriceId(priceId: string): string {
  const match = Object.values(PLANS).find((p) => p.priceId === priceId);
  return match?.tier ?? "job_access";
}

export async function POST(req: NextRequest) {
  const rawBody = await req.text();
  const sig = req.headers.get("stripe-signature");

  if (!sig) {
    return NextResponse.json({ error: "Missing stripe-signature" }, { status: 400 });
  }

  let event: Stripe.Event;
  try {
    event = stripe.webhooks.constructEvent(
      rawBody,
      sig,
      process.env.STRIPE_WEBHOOK_SECRET!
    );
  } catch {
    return NextResponse.json({ error: "Webhook signature verification failed" }, { status: 400 });
  }

  try {
    switch (event.type) {
      case "checkout.session.completed": {
        const session = event.data.object as Stripe.Checkout.Session;
        const userId = session.client_reference_id;
        if (!userId) break;

        const customerId = session.customer as string;
        const subId = session.subscription as string;

        const sub = await stripe.subscriptions.retrieve(subId);
        const item = sub.items.data[0];
        const priceId = item.price.id;
        const tier = (sub.metadata?.tier as string) || tierFromPriceId(priceId);
        const periodEnd = new Date(item.current_period_end * 1000).toISOString();

        await supabase.from("subscriptions").upsert(
          {
            user_id: userId,
            stripe_customer_id: customerId,
            stripe_subscription_id: subId,
            tier,
            status: "active",
            current_period_end: periodEnd,
            updated_at: new Date().toISOString(),
          },
          { onConflict: "user_id" }
        );
        break;
      }

      case "customer.subscription.updated": {
        const sub = event.data.object as Stripe.Subscription;
        const item = sub.items.data[0];
        const priceId = item.price.id;
        const tier = (sub.metadata?.tier as string) || tierFromPriceId(priceId);
        const periodEnd = new Date(item.current_period_end * 1000).toISOString();

        await supabase
          .from("subscriptions")
          .update({
            tier,
            status: sub.status,
            current_period_end: periodEnd,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      case "customer.subscription.deleted": {
        const sub = event.data.object as Stripe.Subscription;
        const periodEnd = new Date(sub.items.data[0].current_period_end * 1000).toISOString();

        await supabase
          .from("subscriptions")
          .update({
            status: "canceled",
            current_period_end: periodEnd,
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", sub.id);
        break;
      }

      case "invoice.payment_failed": {
        const invoice = event.data.object as Stripe.Invoice;
        const subRef = invoice.parent?.subscription_details?.subscription;
        if (!subRef) break;
        const subId = typeof subRef === "string" ? subRef : subRef.id;

        await supabase
          .from("subscriptions")
          .update({
            status: "past_due",
            updated_at: new Date().toISOString(),
          })
          .eq("stripe_subscription_id", subId);
        break;
      }
    }
  } catch (err) {
    const msg = err instanceof Error ? err.message : "Handler error";
    console.error("Stripe webhook error:", msg);
    return NextResponse.json({ error: msg }, { status: 500 });
  }

  return NextResponse.json({ received: true });
}
