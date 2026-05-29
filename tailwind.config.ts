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
          forest: "#1B3A1B",
          "forest-light": "#E6EDE6",
          "forest-border": "#B8D0B8",
          gold: "#B07D10",
          "gold-light": "#C8992A",
          "gold-pale": "#E0C05A",
          silver: "#94A3B8",
          green: "#10B981",
          red: "#EF4444",
        },
        surface: "#FFFFFF",
        "surface-2": "#FAF7F2",
        beige: "#F2EDE3",
      },
      fontFamily: {
        display: ["Playfair Display", "Georgia", "serif"],
      },
      backgroundImage: {
        "gradient-forest": "linear-gradient(135deg, #0E2A0E, #1B3A1B, #2A5C2A)",
        "gradient-gold": "linear-gradient(135deg, #7A5B08, #B07D10, #C8992A)",
      },
      boxShadow: {
        card: "0 2px 16px rgba(27, 58, 27, 0.07)",
        "card-hover": "0 6px 30px rgba(27, 58, 27, 0.13)",
        "neon-sm": "0 0 20px rgba(27, 58, 27, 0.30)",
        "neon-md": "0 0 40px rgba(27, 58, 27, 0.40)",
        "gold-sm": "0 0 20px rgba(176, 125, 16, 0.30)",
        "btn": "0 4px 20px rgba(176, 125, 16, 0.35)",
        "btn-hover": "0 8px 30px rgba(176, 125, 16, 0.50)",
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
