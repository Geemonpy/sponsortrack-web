import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MODEL = process.env.ASSISTANT_MODEL || "claude-haiku-4-5-20251001";

// ─── RESUME ANALYSIS PROMPT ───────────────────────────────────────────────────
// This is the single function to edit when refining the AI behaviour.
// It produces a structured JSON response with:
//   score        — 0-100 match between the CV and this specific role
//   summary      — 2-3 sentence overall assessment
//   gaps         — 3-5 missing skills / experience areas
//   improvements — 3-5 specific, actionable rewrites / additions
//   tailored_cv  — the full CV rewritten to match this JD (facts preserved)
//
// TODO: consider upgrading MODEL to "claude-sonnet-4-6" for richer rewriting.
// ─────────────────────────────────────────────────────────────────────────────
function buildPrompt(cv: string, jd: string): string {
  return `You are an expert UK career coach and CV specialist helping candidates who need visa sponsorship land sponsored roles.

Analyse the CV against the job description. Respond ONLY with valid JSON — no markdown fences, no prose before or after.

Return exactly this structure (all fields required):
{
  "score": <integer 0-100 representing how well the CV matches this role>,
  "summary": "<2-3 sentence overall assessment explaining the score>",
  "gaps": ["<gap 1>", "<gap 2>", ...],
  "improvements": ["<specific actionable improvement 1>", ...],
  "tailored_cv": "<the CV rewritten to better match this role: reorder emphasis, strengthen language, incorporate keywords from the JD, quantify achievements where possible. Do NOT invent experience or qualifications.>"
}

Guidelines:
- Provide 3-5 gaps and 3-5 improvements.
- Gaps should name specific missing skills, qualifications, or experience areas the JD requires.
- Improvements should be concrete rewrites, not vague advice ("Change 'Responsible for X' to 'Delivered X, reducing Y by Z%'").
- In tailored_cv, preserve every real fact but restructure, reword, and reprioritise to match the role.

---CV---
${cv.slice(0, 6000)}

---JOB DESCRIPTION---
${jd.slice(0, 3000)}`;
}

export interface ResumeResult {
  score: number;
  summary: string;
  gaps: string[];
  improvements: string[];
  tailored_cv: string;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return Response.json({ error: "AI assistant is not configured (missing ANTHROPIC_API_KEY)." }, { status: 503 });
  }

  let cv = "";
  let jd = "";
  try {
    const body = await req.json();
    cv = String(body.cv ?? "").trim();
    jd = String(body.jd ?? "").trim();
  } catch {
    return Response.json({ error: "Invalid request body." }, { status: 400 });
  }

  if (!cv || !jd) {
    return Response.json({ error: "Both CV text and job description are required." }, { status: 400 });
  }

  const upstream = await fetch("https://api.anthropic.com/v1/messages", {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-api-key": apiKey,
      "anthropic-version": "2023-06-01",
    },
    body: JSON.stringify({
      model: MODEL,
      max_tokens: 4096,
      messages: [{ role: "user", content: buildPrompt(cv, jd) }],
    }),
  });

  if (!upstream.ok) {
    const detail = await upstream.text().catch(() => "");
    return Response.json({ error: "Upstream AI error.", detail: detail.slice(0, 400) }, { status: 502 });
  }

  const data = await upstream.json();
  const raw: string = data?.content?.[0]?.text ?? "";

  // Strip markdown code fences that Claude occasionally wraps JSON in
  const cleaned = raw.replace(/^```(?:json)?\s*/i, "").replace(/\s*```$/i, "").trim();

  try {
    const result = JSON.parse(cleaned) as ResumeResult;
    if (typeof result.score !== "number" || !result.summary || !Array.isArray(result.gaps)) {
      throw new Error("Unexpected response shape");
    }
    return Response.json(result);
  } catch {
    return Response.json(
      { error: "Could not parse the AI response. Please try again.", raw: cleaned.slice(0, 600) },
      { status: 500 }
    );
  }
}
