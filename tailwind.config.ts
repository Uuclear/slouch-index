import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        background: "#0a0a0f",
        surface: "#12121a",
        surfaceHighlight: "#1e1e2a",
        textPrimary: "#e0e0e0",
        textSecondary: "#a0a0a0",
        accent: "#7c3aed",
        accentGlow: "rgba(124, 58, 237, 0.3)",
      },
      boxShadow: {
        glow: "0 0 20px rgba(124, 58, 237, 0.3)",
        glowLg: "0 0 40px rgba(124, 58, 237, 0.4)",
      },
    },
  },
  plugins: [],
};
export default config;
