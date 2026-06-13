import { NextRequest } from "next/server";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const MODEL = process.env.ASSISTANT_MODEL || "claude-haiku-4-5-20251001";

interface ChatMessage {
  role: "user" | "assistant";
  content: string;
}

interface JobContext {
  title?: string;
  company?: string;
  location?: string;
  description?: string;
  badge?: string;
}

function systemPrompt(job?: JobContext): string {
  let base = `You are the Sponsor UK assistant, helping people who need UK visa sponsorship to find and apply for jobs.

You can help with:
- Explaining UK work visa routes in plain English (Skilled Worker visa, Health and Care Worker visa, and what a Certificate of Sponsorship is).
- Giving a general sense of whether a role is likely to qualify for sponsorship (based on the type of job and salary), while being clear this is not a guarantee.
- Tailoring a CV or cover letter to a specific job: rewriting bullet points, highlighting relevant skills, improving clarity.
- Interview preparation and application tips for sponsored roles.

Style: warm, concrete, and brief. Use short paragraphs. Give specific, actionable advice rather than generic encouragement.

Important boundaries:
- You are NOT an immigration lawyer and do not give legal advice. For anything that affects someone's visa status or application, tell them to confirm with the employer and an OISC-registered immigration adviser or the official GOV.UK guidance.
- Never promise that a specific employer will sponsor someone. A company being a licensed sponsor means it CAN sponsor, not that it will for a given role.
- If you are unsure, say so plainly.`;

  if (job?.title) {
    base += `

The user is currently looking at this job:
Title: ${job.title}
Company: ${job.company ?? "Unknown"}
Location: ${job.location ?? "Unknown"}
Sponsorship signal on SponsorTrack: ${job.badge ?? "unknown"}
Description (may be truncated): ${(job.description ?? "").slice(0, 1500)}

When relevant, ground your answers in this specific role.`;
  }
  return base;
}

export async function POST(req: NextRequest) {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return new Response(
      JSON.stringify({ error: "AI assistant is not configured." }),
      { status: 503, headers: { "content-type": "application/json" } }
    );
  }

  let messages: ChatMessage[] = [];
  let job: JobContext | undefined;
  try {
    const body = await req.json();
    messages = Array.isArray(body.messages) ? body.messages : [];
    job = body.job;
  } catch {
    return new Response(JSON.stringify({ error: "Invalid body" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
  }

  // Keep only valid roles and the last ~10 turns to control cost.
  const trimmed = messages
    .filter((m) => m.role === "user" || m.role === "assistant")
    .slice(-10)
    .map((m) => ({ role: m.role, content: String(m.content).slice(0, 4000) }));

  if (trimmed.length === 0) {
    return new Response(JSON.stringify({ error: "No message provided" }), {
      status: 400,
      headers: { "content-type": "application/json" },
    });
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
      max_tokens: 1024,
      system: systemPrompt(job),
      messages: trimmed,
      stream: true,
    }),
  });

  if (!upstream.ok || !upstream.body) {
    const detail = await upstream.text().catch(() => "");
    return new Response(
      JSON.stringify({ error: "Upstream error", detail: detail.slice(0, 300) }),
      { status: 502, headers: { "content-type": "application/json" } }
    );
  }

  // Parse Anthropic SSE and re-emit just the text deltas as a plain text stream.
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();

  const stream = new ReadableStream<Uint8Array>({
    async start(controller) {
      const reader = upstream.body!.getReader();
      let buffer = "";
      try {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() ?? "";
          for (const line of lines) {
            const trimmedLine = line.trim();
            if (!trimmedLine.startsWith("data:")) continue;
            const payload = trimmedLine.slice(5).trim();
            if (!payload || payload === "[DONE]") continue;
            try {
              const evt = JSON.parse(payload);
              if (
                evt.type === "content_block_delta" &&
                evt.delta?.type === "text_delta" &&
                evt.delta.text
              ) {
                controller.enqueue(encoder.encode(evt.delta.text));
              }
            } catch {
              // ignore non-JSON keepalive lines
            }
          }
        }
      } catch (err) {
        controller.enqueue(encoder.encode("\n\n[connection interrupted]"));
      } finally {
        controller.close();
      }
    },
  });

  return new Response(stream, {
    headers: {
      "content-type": "text/plain; charset=utf-8",
      "cache-control": "no-cache",
    },
  });
}
