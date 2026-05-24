import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist)", "system-ui", "sans-serif"],
        mono: ["var(--font-geist-mono)", "monospace"],
      },
      colors: {
        background: "#0A0A0A",
        card: "#111111",
        border: "#1F1F1F",
        accent: "#10B981", // emerald-500 for profit
        loss: "#EF4444",
        warning: "#F59E0B",
      },
    },
  },
  plugins: [],
};
export default config;
