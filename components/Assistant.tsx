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
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight, behavior: "smooth" });
  }, [messages, busy]);

  useEffect(() => {
    const handler = () => setOpen(true);
    window.addEventListener("open-assistant", handler);
    return () => window.removeEventListener("open-assistant", handler);
  }, []);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    setError(null);
    const next: Msg[] = [...messages, { role: "user", content }];
    setMessages(next);
    setInput("");
    setBusy(true);
    setMessages((m) => [...m, { role: "assistant", content: "" }]);

    try {
      const res = await fetch("/api/assistant", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ messages: next }),
      });
      if (!res.ok || !res.body) {
        const json = await res.json().catch(() => ({}));
        throw new Error(json?.error || `HTTP ${res.status}`);
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
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : "Unknown error";
      setError(msg);
      setMessages((m) => {
        const copy = [...m];
        copy[copy.length - 1] = {
          role: "assistant",
          content: `Sorry — I couldn't reach the assistant. ${msg}`,
        };
        return copy;
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <>
      {/* Launcher bubble */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? "Close assistant" : "Open AI assistant"}
        className="fixed bottom-5 right-5 z-50 w-14 h-14 rounded-full grid place-items-center text-xl text-white shadow-[0_10px_24px_rgba(91,67,232,0.38)] bg-gradient-to-br from-violet to-violet-2 hover:scale-105 hover:-translate-y-0.5 transition-all duration-200"
      >
        {open ? (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" width="20" height="20">
            <path d="M18 6 6 18M6 6l12 12" />
          </svg>
        ) : (
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="22" height="22">
            <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
          </svg>
        )}
      </button>

      {/* Chat window */}
      {open && (
        <div className="fixed bottom-24 right-5 z-50 w-[min(92vw,380px)] h-[min(70vh,560px)] bg-white border border-v-line rounded-[22px] shadow-[0_26px_70px_rgba(28,20,64,.18)] flex flex-col overflow-hidden font-sans">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet to-violet-2 px-5 py-4">
            <div className="font-jakarta font-bold text-[17px] text-white leading-tight">Visa &amp; CV assistant</div>
            <div className="text-[12px] text-white/75 mt-0.5">UK sponsorship help · not legal advice</div>
          </div>

          {/* Error banner */}
          {error && (
            <div className="bg-red-50 border-b border-red-200 px-4 py-2 text-[12px] text-red-600">
              {error}
            </div>
          )}

          {/* Messages */}
          <div ref={scrollRef} className="flex-1 overflow-y-auto thin-scroll px-4 py-4 space-y-3 bg-v-bg">
            {messages.length === 0 && (
              <div className="text-[14px] text-v-muted">
                <p className="mb-3">
                  Ask me about UK work visas, whether a role might sponsor you, or improving your CV.
                </p>
                <div className="flex flex-col gap-2">
                  {SUGGESTIONS.map((s) => (
                    <button
                      key={s}
                      onClick={() => send(s)}
                      className="text-left text-[13.5px] border border-v-line bg-white rounded-[10px] px-3 py-2 hover:border-violet hover:text-violet transition-colors"
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
                className={`text-[14px] leading-relaxed whitespace-pre-wrap ${
                  m.role === "user"
                    ? "bg-violet-soft text-v-ink rounded-[12px] px-3.5 py-2.5 ml-8"
                    : "text-v-ink/90 mr-4"
                }`}
              >
                {m.content || (busy && i === messages.length - 1 ? (
                  <span className="inline-flex gap-1 items-center text-v-muted">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet animate-bounce" style={{ animationDelay: "0ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-violet animate-bounce" style={{ animationDelay: "150ms" }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-violet animate-bounce" style={{ animationDelay: "300ms" }} />
                  </span>
                ) : "")}
              </div>
            ))}
          </div>

          {/* Input row */}
          <div className="border-t border-v-line p-3 flex gap-2 bg-white">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && send(input)}
              placeholder="Ask anything…"
              className="flex-1 bg-v-bg border border-v-line rounded-[10px] px-3 py-2 text-[14px] text-v-ink placeholder:text-v-muted focus:outline-none focus:border-violet transition-colors"
            />
            <button
              onClick={() => send(input)}
              disabled={busy}
              className="font-jakarta font-bold text-[14px] px-4 rounded-[10px] bg-violet text-white shadow-[0_4px_12px_rgba(91,67,232,0.3)] hover:bg-[#4a34d4] disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-150"
            >
              Send
            </button>
          </div>
        </div>
      )}
    </>
  );
}
