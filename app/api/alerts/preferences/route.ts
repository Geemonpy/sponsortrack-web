import { NextRequest, NextResponse } from "next/server";
import { getUserTier } from "@/lib/stripe/subscription";
import { supabase } from "@/lib/supabaseServer";

export const dynamic = "force-dynamic";

async function authenticate(req: NextRequest) {
  const token = req.headers.get("authorization")?.replace("Bearer ", "").trim();
  if (!token) return null;
  const { data: { user } } = await supabase.auth.getUser(token);
  return user ?? null;
}

export async function GET(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tier = await getUserTier(user.id);

  if (tier !== "alerts") {
    return NextResponse.json({ tier, preferences: null });
  }

  const { data } = await supabase
    .from("alert_preferences")
    .select("*")
    .eq("user_id", user.id)
    .maybeSingle();

  return NextResponse.json({ tier, preferences: data ?? null });
}

export async function POST(req: NextRequest) {
  const user = await authenticate(req);
  if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const tier = await getUserTier(user.id);
  if (tier !== "alerts") {
    return NextResponse.json({ error: "Alerts tier required" }, { status: 403 });
  }

  let body: { categories?: string[]; keyword?: string; location?: string; is_active?: boolean };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  const { error } = await supabase.from("alert_preferences").upsert(
    {
      user_id: user.id,
      email: user.email,
      categories: body.categories ?? [],
      keyword: body.keyword?.trim() || null,
      location: body.location?.trim() || null,
      is_active: body.is_active ?? true,
      updated_at: new Date().toISOString(),
    },
    { onConflict: "user_id" }
  );

  if (error) return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
