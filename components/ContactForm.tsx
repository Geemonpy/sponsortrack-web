"use client";

import { useState } from "react";

export default function ContactForm() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !message.trim()) {
      setError("Please fill in all fields.");
      return;
    }
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setBusy(true);
    // Simulate a network delay, then show success
    setTimeout(() => {
      setBusy(false);
      setSent(true);
    }, 800);
  }

  const inputCls =
    "w-full bg-v-bg border border-v-line rounded-[10px] px-4 py-3 text-[15px] text-v-ink placeholder:text-v-muted/60 focus:outline-none focus:border-violet transition-colors";

  if (sent) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="w-14 h-14 rounded-full bg-v-green-soft flex items-center justify-center text-v-green text-2xl mb-4">✓</div>
        <h3 className="font-jakarta font-extrabold text-[1.3rem] text-v-ink mb-2">Message sent!</h3>
        <p className="text-v-muted text-[15px] max-w-xs">
          Thanks for reaching out — we&apos;ll get back to you within 2 business days.
        </p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-4">
      <div>
        <label className="block text-[13.5px] font-semibold text-v-ink mb-1.5">Name</label>
        <input
          type="text"
          placeholder="Your name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-[13.5px] font-semibold text-v-ink mb-1.5">Email</label>
        <input
          type="email"
          placeholder="you@email.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className={inputCls}
        />
      </div>
      <div>
        <label className="block text-[13.5px] font-semibold text-v-ink mb-1.5">Message</label>
        <textarea
          placeholder="How can we help?"
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          rows={5}
          className={`${inputCls} resize-none`}
        />
      </div>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-[10px] px-4 py-2.5 text-[13.5px] text-red-600">
          {error}
        </div>
      )}

      <button
        type="submit"
        disabled={busy}
        className="w-full font-jakarta font-bold text-[15px] py-3 rounded-[10px] bg-violet text-white shadow-[0_10px_24px_rgba(91,67,232,0.28)] hover:bg-[#4a34d4] hover:-translate-y-0.5 disabled:opacity-60 disabled:cursor-not-allowed transition-all duration-200"
      >
        {busy ? "Sending…" : "Send message"}
      </button>
    </form>
  );
}
