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
        background: "var(--background)",
        foreground: "var(--foreground)",
        brand: {
          purple: "#7C3AED",
          blue: "#2563EB",
          cyan: "#06B6D4",
          gold: "#F59E0B",
          silver: "#94A3B8",
          bronze: "#CD7F32",
          pink: "#EC4899",
          green: "#10B981",
        },
      },
      backgroundImage: {
        "gradient-brand": "linear-gradient(135deg, #7C3AED, #2563EB, #06B6D4)",
        "gradient-gold": "linear-gradient(135deg, #F59E0B, #CD7F32, #F59E0B)",
        "gradient-dark": "linear-gradient(135deg, #0F0F1A, #1A1A2E, #16213E)",
        "gradient-card": "linear-gradient(135deg, rgba(124,58,237,0.1), rgba(37,99,235,0.1))",
      },
      boxShadow: {
        neon: "0 0 20px rgba(124, 58, 237, 0.5)",
        "neon-blue": "0 0 20px rgba(37, 99, 235, 0.5)",
        "neon-cyan": "0 0 20px rgba(6, 182, 212, 0.5)",
        "neon-gold": "0 0 20px rgba(245, 158, 11, 0.5)",
        glass: "0 8px 32px rgba(0, 0, 0, 0.3)",
      },
      backdropBlur: {
        xs: "2px",
      },
      animation: {
        "pulse-slow": "pulse 3s ease-in-out infinite",
        "glow": "glow 2s ease-in-out infinite alternate",
        "float": "float 3s ease-in-out infinite",
      },
      keyframes: {
        glow: {
          "0%": { boxShadow: "0 0 10px rgba(124,58,237,0.3)" },
          "100%": { boxShadow: "0 0 30px rgba(124,58,237,0.8), 0 0 60px rgba(37,99,235,0.4)" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px)" },
          "50%": { transform: "translateY(-8px)" },
        },
      },
      fontFamily: {
        inter: ["Inter", "sans-serif"],
      },
    },
  },
  plugins: [],
};
export default config;
