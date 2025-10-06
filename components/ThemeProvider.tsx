"use client";

import { useEffect } from "react";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    // Check system preference and apply dark mode
    const darkModeMediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    
    const updateTheme = (e: MediaQueryListEvent | MediaQueryList) => {
      if (e.matches) {
        document.documentElement.classList.add("dark");
      } else {
        document.documentElement.classList.remove("dark");
      }
    };

    // Initial check
    updateTheme(darkModeMediaQuery);

    // Listen for changes
    darkModeMediaQuery.addEventListener("change", updateTheme);

    return () => darkModeMediaQuery.removeEventListener("change", updateTheme);
  }, []);

  return <>{children}</>;
}

