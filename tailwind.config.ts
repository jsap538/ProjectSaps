import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        // SAPS Brand Colors
        ink: "#0B0C0E",        // near black
        graphite: "#1B1E22",   // dark graphite
        onyx: "#2A2F35",       // elevated surfaces
        nickel: "#A8ADB3",     // muted text
        titanium: "#D9D9D9",   // accent
        porcelain: "#F5F6F7",  // light text
        // Legacy colors for gradual migration
        primary: {
          DEFAULT: "#D9D9D9",   // titanium as primary
          dark: "#A8ADB3",     // nickel
          light: "#F5F6F7",    // porcelain
        },
        dark: {
          DEFAULT: "#1B1E22",   // graphite
          light: "#2A2F35",    // onyx
          lighter: "#A8ADB3",  // nickel
        },
        gray: {
          light: "#F5F6F7",   // porcelain
          medium: "#D9D9D9",   // titanium
        },
      },
      borderRadius: {
        xl: "14px",
        "2xl": "20px",
      },
      boxShadow: {
        soft: "0 8px 20px rgba(0,0,0,0.12)",
        subtle: "0 2px 10px rgba(0,0,0,0.10)",
      },
      letterSpacing: {
        wide1: "0.02em",
      },
      fontFamily: {
        sans: ["Inter", "SF Pro Text", "Segoe UI", "Roboto", "system-ui", "sans-serif"],
      },
      transitionDuration: {
        sap: "160ms",
      },
      animation: {
        "fade-in": "fadeIn 0.5s ease-in-out",
      },
      keyframes: {
        fadeIn: {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
      },
    },
  },
  plugins: [],
};

export default config;

