"use client";
import { useEffect, useRef } from "react";
import { motion } from "framer-motion";

const cards = [
  {
    id: "jc1",
    initial: "left-[-2%] top-[6%]",
    delay: 0,
    duration: 6.5,
    avatarBg: "linear-gradient(135deg,#10B981,#34D399)",
    letter: "N",
    title: "Registered Nurse",
    loc: "Manchester · NHS Trust",
    par: 3,
  },
  {
    id: "jc2",
    initial: "right-[-3%] top-[30%]",
    delay: -1.4,
    duration: 7.4,
    avatarBg: "linear-gradient(135deg,#5B43E8,#7A63FF)",
    letter: "D",
    title: "Junior Developer",
    loc: "London · Remote",
    par: 4,
  },
  {
    id: "jc3",
    initial: "left-[8%] bottom-[4%]",
    delay: -2.2,
    duration: 6.9,
    avatarBg: "linear-gradient(135deg,#F59E0B,#FBBF24)",
    letter: "C",
    title: "Care Assistant",
    loc: "Birmingham · Full-time",
    par: 2.4,
  },
];

export default function HeroStage() {
  const stageRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (window.matchMedia("(max-width: 940px)").matches) return;
    const onMove = (e: MouseEvent) => {
      if (!stageRef.current) return;
      const cx = e.clientX / window.innerWidth - 0.5;
      const cy = e.clientY / window.innerHeight - 0.5;
      stageRef.current.querySelectorAll<HTMLElement>("[data-par]").forEach((el) => {
        const p = Number(el.dataset.par);
        el.style.translate = `${cx * p * -5}px ${cy * p * -5}px`;
      });
    };
    window.addEventListener("mousemove", onMove);
    return () => window.removeEventListener("mousemove", onMove);
  }, []);

  return (
    <div ref={stageRef} className="relative h-[480px] max-md:h-[420px] max-md:mt-2.5">
      {/* Glow */}
      <div
        data-par="1"
        className="absolute right-[-8%] top-1/2 -translate-y-1/2 w-[460px] h-[460px] rounded-full opacity-40"
        style={{
          background: "conic-gradient(from 0deg,#7A63FF,#B49Cff,#5B43E8,#9B86FF,#7A63FF)",
          filter: "blur(46px)",
          animation: "spinGlow 16s linear infinite",
        }}
      />
      {/* Ring */}
      <div
        data-par="1.5"
        className="absolute right-[2%] top-1/2 -translate-y-1/2 w-[340px] h-[340px] rounded-full border-[1.5px] border-dashed border-violet-soft"
        style={{ animation: "spinRing 40s linear infinite" }}
      >
        <div className="absolute w-[300px] h-[300px] rounded-full border-[1.5px] border-violet-soft top-[18px] left-[18px]" />
      </div>

      {/* Job cards */}
      {cards.map((c, i) => (
        <motion.div
          key={c.id}
          data-par={c.par}
          className={`absolute bg-white border border-v-line rounded-2xl p-4 shadow-[0_26px_70px_rgba(28,20,64,.13)] w-[230px] ${c.initial} ${i === 1 ? "max-[520px]:hidden" : ""}`}
          animate={{ y: [0, -18, 0] }}
          transition={{
            duration: c.duration,
            delay: c.delay,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          style={{ cursor: "default" }}
        >
          <div className="flex items-center justify-between mb-3.5">
            <div
              className="w-[38px] h-[38px] rounded-[10px] flex items-center justify-center text-white font-jakarta font-extrabold text-[15px]"
              style={{ background: c.avatarBg }}
            >
              {c.letter}
            </div>
            <span className="font-jakarta font-bold text-[11px] px-[11px] py-[5px] rounded-full bg-v-green-soft text-v-green flex items-center gap-[5px]">
              <span className="w-1.5 h-1.5 rounded-full bg-v-green" />
              Sponsor verified
            </span>
          </div>
          <h4 className="font-jakarta font-bold text-[1.08rem] mb-1">{c.title}</h4>
          <div className="text-v-muted text-[13.5px] flex items-center gap-1.5">
            📍 {c.loc}
          </div>
        </motion.div>
      ))}

      {/* Floating chips */}
      <motion.div
        data-par="3.4"
        className="absolute right-[20%] top-[2%] bg-white border border-v-line shadow-[0_14px_44px_rgba(28,20,64,.07)] rounded-full px-3.5 py-2 font-semibold text-[13px] flex items-center gap-2 max-[520px]:hidden"
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 8, delay: -3, repeat: Infinity, ease: "easeInOut" }}
      >
        🤝 Social Care
      </motion.div>
      <motion.div
        data-par="2.8"
        className="absolute left-0 top-[46%] bg-white border border-v-line shadow-[0_14px_44px_rgba(28,20,64,.07)] rounded-full px-3.5 py-2 font-semibold text-[13px] flex items-center gap-2 max-[520px]:hidden"
        animate={{ y: [0, -18, 0] }}
        transition={{ duration: 8, delay: -1, repeat: Infinity, ease: "easeInOut" }}
      >
        📈 Business
      </motion.div>
    </div>
  );
}
