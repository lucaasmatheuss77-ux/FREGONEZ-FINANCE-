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
          gold: "#D97706",
          "gold-light": "#F59E0B",
          "gold-pale": "#FCD34D",
          blue: "#2563EB",
          cyan: "#06B6D4",
          silver: "#94A3B8",
          green: "#10B981",
          red: "#EF4444",
          pink: "#EC4899",
        },
        surface: "#FFFFFF",
        "surface-2": "#FFFDF5",
        light: "#FFFBF0",
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #92400E, #D97706, #F59E0B, #FCD34D)",
        "gradient-gold": "linear-gradient(135deg, #F59E0B, #D97706, #FDE68A)",
      },
      boxShadow: {
        card: "0 4px 24px rgba(217, 119, 6, 0.08)",
        "card-hover": "0 8px 40px rgba(217, 119, 6, 0.16)",
        "neon-sm": "0 0 20px rgba(217, 119, 6, 0.35)",
        "neon-md": "0 0 40px rgba(217, 119, 6, 0.45)",
        "gold-sm": "0 0 20px rgba(245, 158, 11, 0.35)",
        "btn": "0 4px 20px rgba(217, 119, 6, 0.40)",
        "btn-hover": "0 8px 30px rgba(217, 119, 6, 0.55)",
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
