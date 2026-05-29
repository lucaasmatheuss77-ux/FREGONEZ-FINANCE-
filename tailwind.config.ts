import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        forest: {
          DEFAULT:  "#1A2E1A",
          light:    "#EEF2EE",
          border:   "#B8CFBA",
          deep:     "#0E1E0E",
        },
        gold: {
          DEFAULT:  "#B8882A",
          light:    "#D4A84B",
          pale:     "#F0DFA8",
          border:   "#D6C080",
        },
        warm: {
          bg:       "#F7F4EF",
          surface:  "#FFFFFF",
          border:   "#E8E4DE",
          "border-strong": "#D6D0C8",
          text:     "#1C1A17",
          "text-2": "#5C5449",
          muted:    "#9C968E",
        },
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
      },
      boxShadow: {
        card:        "0 1px 4px rgba(0,0,0,0.06)",
        "card-hover":"0 4px 20px rgba(0,0,0,0.10)",
        "neon-sm":   "0 0 20px rgba(26,46,26,0.28)",
        "gold-sm":   "0 0 20px rgba(184,136,42,0.35)",
        "btn":       "0 4px 16px rgba(184,136,42,0.40)",
        "btn-hover": "0 8px 28px rgba(184,136,42,0.55)",
      },
      animation: {
        glow:  "glow-pulse-gold 2s ease-in-out infinite",
        float: "float 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%":      { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
