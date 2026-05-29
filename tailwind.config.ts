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
        brand: {
          purple: "#7C3AED",
          blue: "#2563EB",
          cyan: "#06B6D4",
          gold: "#F59E0B",
          silver: "#94A3B8",
          green: "#10B981",
          red: "#EF4444",
          pink: "#EC4899",
        },
        surface: "#FFFFFF",
        "surface-2": "#F8F9FF",
        light: "#EEF0FF",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #7C3AED, #2563EB, #06B6D4)",
        "gradient-gold": "linear-gradient(135deg, #F59E0B, #D97706, #FDE68A)",
      },
      boxShadow: {
        card: "0 4px 24px rgba(124, 58, 237, 0.07)",
        "card-hover": "0 8px 40px rgba(124, 58, 237, 0.14)",
        "neon-sm": "0 0 20px rgba(124, 58, 237, 0.25)",
        "neon-md": "0 0 40px rgba(124, 58, 237, 0.35)",
        "gold-sm": "0 0 20px rgba(245, 158, 11, 0.25)",
        "btn": "0 4px 20px rgba(124, 58, 237, 0.35)",
        "btn-hover": "0 8px 30px rgba(124, 58, 237, 0.5)",
      },
      animation: {
        "glow": "glow-pulse-light 2s ease-in-out infinite",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-6px)" },
        },
      },
    },
  },
  plugins: [],
};
export default config;
