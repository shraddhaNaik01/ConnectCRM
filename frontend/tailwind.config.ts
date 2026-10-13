import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        dark: {
          bg: "#0B1120",      // Main background deep navy
          sidebar: "#0F172A", // Dark navy sidebar
          card: "#151F32",    // Dark slate card
          elevated: "#1B2840",// Elevated surfaces
          border: "#263449",  // Subtle slate border
        },
        brand: {
          accent: "#60A5FA",  // Vivid blue primary accent
          violet: "#A78BFA",  // Violet secondary accent
          success: "#34D399", // Soft emerald success
          warning: "#FBBF24", // Warm amber warning
        },
        slate: {
          text: "#F1F5F9",    // Near-white main text
          muted: "#94A3B8",   // Muted slate secondary text
        },
      },
    },
  },
  plugins: [],
};
export default config;
