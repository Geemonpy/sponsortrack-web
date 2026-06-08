import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        sans: ["var(--font-body)", "system-ui", "sans-serif"],
        jakarta: ["var(--font-jakarta)", "sans-serif"],
      },
      colors: {
        ink: "#1a1c1e",
        parchment: "#f6f3ec",
        card: "#fffdf8",
        accent: "#2f5d50",
        confirmed: "#1f7a4d",
        licensed: "#b07407",
        mentioned: "#1d6fa0",
        violet: "#5B43E8",
        "violet-2": "#7A63FF",
        "violet-soft": "#EEEBFE",
        "violet-tint": "#F6F4FF",
        "v-green": "#10B981",
        "v-green-soft": "#DCFCEF",
        "v-amber": "#F59E0B",
        "v-amber-soft": "#FEF3DA",
        "v-sky": "#2E90FA",
        "v-sky-soft": "#E4F1FF",
        "v-ink": "#15131F",
        "v-muted": "#6B6878",
        "v-line": "#ECEAF3",
        "v-bg": "#FBFAFE",
      },
    },
  },
  plugins: [],
};
export default config;
