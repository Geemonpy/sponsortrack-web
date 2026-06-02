import "server-only";
import { createClient } from "@supabase/supabase-js";

const url = process.env.SUPABASE_URL;
const key = process.env.SUPABASE_SECRET_KEY;

if (!url || !key) {
  throw new Error(
    "Missing SUPABASE_URL or SUPABASE_SECRET_KEY environment variables."
  );
}

// Secret key -> full read/write access, bypasses RLS. Never import this from a
// client component; "server-only" above will throw if you try.
export const supabase = createClient(url, key, {
  auth: { persistSession: false },
});
