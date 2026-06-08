"use client";
import { useState, useCallback } from "react";

const FLOORS = [
  { label: "Standard · £41,700", value: 41700 },
  { label: "New entrant · £33,400", value: 33400 },
];

function fmt(n: number) {
  return n.toLocaleString("en-GB");
}

export default function SalaryCalc() {
  const [raw, setRaw] = useState("38,000");
  const [floor, setFloor] = useState(41700);

  const numeric = Number(raw.replace(/[^0-9]/g, "")) || 0;
  const pass = numeric >= floor;
  const pct = Math.max(4, Math.min(100, (numeric / floor) * 100));
  const diff = Math.abs(numeric - floor);

  const handleInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const v = e.target.value.replace(/[^0-9]/g, "");
    setRaw(v ? fmt(Number(v)) : "");
  }, []);

  return (
    <div>
      <div className="mb-[22px]">
        <label className="block font-semibold text-[14px] text-v-muted mb-[9px]">Annual salary offered (£)</label>
        <input
          type="text"
          inputMode="numeric"
          value={raw}
          onChange={handleInput}
          className="w-full bg-v-bg border-[1.5px] border-v-line rounded-[13px] px-[18px] py-4 font-jakarta font-extrabold text-[1.7rem] text-v-ink outline-none focus:border-violet transition-colors"
        />
      </div>

      <div className="mb-[22px]">
        <label className="block font-semibold text-[14px] text-v-muted mb-[9px]">Route</label>
        <div className="flex gap-2.5">
          {FLOORS.map((f) => (
            <button
              key={f.value}
              onClick={() => setFloor(f.value)}
              className={`flex-1 border-[1.5px] rounded-xl px-3 py-3 font-jakarta font-semibold text-[13.5px] cursor-pointer transition-colors ${
                floor === f.value
                  ? "border-violet text-violet bg-violet-tint"
                  : "border-v-line text-v-muted bg-v-bg"
              }`}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>

      <div className="border-t border-dashed border-v-line pt-[22px]">
        <div className="flex items-baseline justify-between gap-3">
          <span className={`font-jakarta font-extrabold text-[1.4rem] ${pass ? "text-v-green" : "text-v-amber"}`}>
            {pass ? "Clears the floor ✓" : "Below the floor"}
          </span>
          <small className="text-v-muted font-semibold text-[13px]">
            {pass
              ? `£${fmt(diff)} above £${fmt(floor)}`
              : `£${fmt(diff)} short of £${fmt(floor)}`}
          </small>
        </div>
        <div className="h-3 rounded-full bg-v-line overflow-hidden my-3.5">
          <div
            className="h-full rounded-full transition-all duration-1000"
            style={{
              width: `${pct}%`,
              background: pass ? "#10B981" : "#F59E0B",
            }}
          />
        </div>
        <p className="text-v-muted text-[13px] leading-relaxed mt-3">
          Illustrative — the binding figure is the higher of the general threshold and your occupation's going rate (SOC code). Always confirm against current Home Office rules.
        </p>
      </div>
    </div>
  );
}
