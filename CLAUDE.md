# SponsorTrack — CLAUDE.md

## Source separation: main feed vs. test results

The `jobs` table has a `source` column. Sources are split into two tiers:

**Main feed sources** (defined as `MAIN_SOURCES` in `lib/data.ts`):
- `"Adzuna"`
- `"Fantastic Jobs"`

A `null` source is also treated as main feed (it displays as "Adzuna" in the UI).

**Test sources**: any other value in the `source` column.

### Rules

1. **Homepage (`/`) and `/api/jobs` show only main-feed sources.** Both calls pass `sourceType: "main"` to `getJobs()`. Test sources must never appear on the homepage or in any public-facing feed.

2. **`/scraped` is the unlisted test-only page.** It fetches jobs with `sourceType: "test"` and displays them using the standard `JobCard` layout. It carries a banner warning that results are unverified and internal.

3. **`/scraped` is unlisted:**
   - Not linked from any nav or homepage element
   - Not present in `sitemap.ts`
   - Added to `Disallow` in `robots.ts`
   - Reachable only by typing the URL directly

### Adding a new source

- If a new job source should appear in the public main feed, add its exact `source` string to the `MAIN_SOURCES` array in `lib/data.ts`.
- Otherwise it will automatically route to `/scraped` with no code changes needed.
