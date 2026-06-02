"use client";

import { useState, useRef, useEffect } from "react";

interface Msg {
  role: "user" | "assistant";
  content: string;
}

const SUGGESTIONS = [
  "Which UK visa do I need to work in care?",
  "What is a Certificate of Sponsorship?",
  "Help me write a CV summary for a care assistant role",
];

export default function Assistant() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<Msg[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    // placeholder assistant message we stream into
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) {
        throw new Error((await res.json().catch(() => ({})))?.error || "request failed");
      }
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let acc = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += decoder.decode(value, { stream: true });
        setMessages((m) => {
          const copy = [...m];
          copy[copy.length - 1] = { role: "assistant", content: acc };
          return copy;
        });
      }
    } catch (e) {
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content:
            "Sorry — I couldn't reach the assistant. If this just launched, the ANTHROPIC_API_KEY may not be set yet.",
        };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* launcher */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label="Open assistant"
        className="fixed bottom-5 right-5 z-50 bg-accent text-parchment rounded-full shadow-lg w-14 h-14 grid place-items-center text-2xl hover:scale-105 transition"
      >
        {open ? "×" : "💬"}
      </button>

      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[min(92vw,380px)] h-[min(70vh,560px)] bg-card border border-ink/15 rounded-2xl shadow-2xl flex flex-col overflow-hidden">
          <div className="bg-accent text-parchment px-4 py-3">
            <div className="font-display font-bold text-lg leading-tight">Visa &amp; CV assistant</div>
            <div className="text-xs text-parchment/80">UK sponsorship help · not legal advice</div>
          </div>

          <div ref={scrollRef} className="flex-1 overflow-y-auto thin-scroll px-4 py-3 space-y-3">
            {messages.length === 0 && (
              <div className="text-sm text-ink/60">
                <p className="mb-3">
                  Ask me about UK work visas, whether a role might sponsor you, or improving your CV.
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-left text-sm border border-ink/15 rounded-lg px-3 py-2 hover:bg-ink/5 transition"
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            )}
            {messages.map((m, i) => (
              <div
                key={i}
                className={`text-sm leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-accent/10 text-ink rounded-xl px-3 py-2 ml-8"
                    : "text-ink/90 mr-4"
                }`}
              >
                {m.content || (busy && i === messages.length - 1 ? "…" : "")}
              </div>
            ))}
          </div>

          <div className="border-t border-ink/10 p-3 flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && send(input)}
              placeholder="Ask anything…"
              className="flex-1 bg-parchment border border-ink/15 rounded-lg px-3 py-2 text-sm"
            />
            <button
              onClick={() => send(input)}
              disabled={busy}
              className="bg-accent text-parchment font-semibold px-4 rounded-lg disabled:opacity-50"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
