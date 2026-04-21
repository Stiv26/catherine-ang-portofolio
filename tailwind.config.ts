import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        bg: {
          primary: "var(--bg-primary)",
          secondary: "var(--bg-secondary)",
          tertiary: "var(--bg-tertiary)",
        },
        accent: {
          primary: "var(--accent-primary)",
          deep: "var(--accent-deep)",
          soft: "var(--accent-soft)",
          lavender: "var(--accent-lavender)",
          peach: "var(--accent-peach)",
          mint: "var(--accent-mint)",
        },
        text: {
          primary: "var(--text-primary)",
          secondary: "var(--text-secondary)",
          tertiary: "var(--text-tertiary)",
        },
        border: {
          soft: "var(--border-soft)",
        },
      },
      fontFamily: {
        display: ["var(--font-display)", "serif"],
        body: ["var(--font-body)", "sans-serif"],
        accent: ["var(--font-accent)", "cursive"],
        mono: ["var(--font-mono)", "monospace"],
      },
      boxShadow: {
        soft: "0 4px 20px var(--shadow-color)",
        deep: "0 8px 40px var(--shadow-deep)",
        card: "0 2px 12px var(--shadow-color)",
        glow: "0 0 20px var(--accent-primary)",
      },
      borderRadius: {
        blob: "60% 40% 30% 70% / 60% 30% 70% 40%",
      },
      keyframes: {
        "paint-reveal": {
          "0%": { clipPath: "inset(0 100% 0 0)" },
          "100%": { clipPath: "inset(0 0% 0 0)" },
        },
        "ink-wash": {
          "0%": { clipPath: "circle(0% at 50% 50%)", opacity: "0" },
          "100%": { clipPath: "circle(150% at 50% 50%)", opacity: "1" },
        },
        float: {
          "0%, 100%": { transform: "translateY(0px) rotate(0deg)" },
          "33%": { transform: "translateY(-8px) rotate(2deg)" },
          "66%": { transform: "translateY(-4px) rotate(-1deg)" },
        },
        "slide-up": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "slide-in-left": {
          from: { transform: "translateX(-30px)", opacity: "0" },
          to: { transform: "translateX(0)", opacity: "1" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        shimmer: {
          "0%": { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        "pulse-soft": {
          "0%, 100%": { opacity: "1", transform: "scale(1)" },
          "50%": { opacity: "0.7", transform: "scale(1.05)" },
        },
      },
      animation: {
        "paint-reveal": "paint-reveal 0.8s ease forwards",
        "ink-wash": "ink-wash 0.6s ease forwards",
        float: "float 6s ease-in-out infinite",
        "slide-up": "slide-up 0.4s ease forwards",
        "slide-in-left": "slide-in-left 0.4s ease forwards",
        "fade-in": "fade-in 0.3s ease forwards",
        shimmer: "shimmer 1.5s infinite",
        "pulse-soft": "pulse-soft 2s ease-in-out infinite",
      },
    },
  },
  plugins: [],
};

export default config;
