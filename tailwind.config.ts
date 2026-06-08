import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        light: "#fafafa",
        dark: "#0a0a0a",
      },
      animation: {
        "float-up": "floatUp 0.3s ease-out forwards",
      },
      keyframes: {
        floatUp: {
          "0%": { transform: "translateY(0)", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" },
          "100%": { transform: "translateY(-8px)", boxShadow: "0 12px 30px rgba(0,0,0,0.1)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
