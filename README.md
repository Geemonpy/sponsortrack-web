# SponsorTrack — Web (Next.js)

UK visa-sponsor job board with SEO-friendly pages and an AI visa/CV assistant.
Reads jobs from Supabase, which is filled by the Python scraper (`sponsortrack/scraper.py`).

## Architecture

```
Python scraper (cron)  ──writes──►  Supabase (Postgres)  ◄──reads──  Next.js app (Vercel)
                                                                          │
                                                              AI assistant ──► Anthropic API
```

- The Next.js app **reads** jobs from Supabase server-side → real SEO (Google sees the content).
- `/jobs/[id]` are individual indexable pages with their own titles/descriptions + a sitemap.
- The AI assistant runs in `/api/assistant` (server-only) so the API key never reaches the browser.
- The old FastAPI `main.py` is **no longer needed** — Next.js handles the API now. The Python
  **scraper** is still used (it's what populates the database).

## Environment variables

Copy `.env.local.example` to `.env.local` and fill in:

| Variable | Where to get it |
|---|---|
| `SUPABASE_URL` | Supabase → project dashboard (the API URL) |
| `SUPABASE_SECRET_KEY` | Supabase → Settings → API Keys → **secret** key (`sb_secret_...`) |
| `ANTHROPIC_API_KEY` | https://console.anthropic.com → Settings → API Keys (paid) |
| `ASSISTANT_MODEL` | `claude-haiku-4-5` (cheap) or `claude-sonnet-4-6` (stronger) |
| `NEXT_PUBLIC_SITE_URL` | your public URL, e.g. `https://sponsortrack.vercel.app` |

## Run locally

```bash
npm install
cp .env.local.example .env.local   # then fill it in
npm run dev                          # http://localhost:3000
```

## Deploy to Vercel

1. Push this folder to a GitHub repo.
2. On vercel.com → **Add New → Project** → import the repo. Vercel auto-detects Next.js.
3. Before deploying, add the 5 environment variables above under **Environment Variables**.
4. Deploy. You'll get a URL like `https://sponsortrack.vercel.app`.
5. Copy that URL back into the `NEXT_PUBLIC_SITE_URL` variable and redeploy (so the sitemap and
   canonical links use the real domain).

## Keep the data fresh

The site only shows jobs that exist in Supabase, so keep the **Python scraper** running on a
schedule (e.g. a Railway Cron running `python scraper.py` daily, or a GitHub Action). See the
scraper folder. No scraper run = no new jobs.

## SEO after launch

- Submit `https://YOUR-DOMAIN/sitemap.xml` in Google Search Console.
- The more jobs in the database, the more indexable pages you have.

## Cost note (AI assistant)

Anthropic charges per use. `claude-haiku-4-5` is the cheapest and is the default. Costs are small
per message but real — set a spend limit in the Anthropic console. If `ANTHROPIC_API_KEY` is unset,
the rest of the site works fine and the assistant simply shows a "not configured" message.
