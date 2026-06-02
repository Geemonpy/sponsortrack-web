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
      },
      colors: {
        ink: "#1a1c1e",
        parchment: "#f6f3ec",
        card: "#fffdf8",
        accent: "#2f5d50",
        confirmed: "#1f7a4d",
        licensed: "#b07407",
        mentioned: "#1d6fa0",
      },
    },
  },
  plugins: [],
};
export default config;
