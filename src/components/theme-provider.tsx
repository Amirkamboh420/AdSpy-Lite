"use client";

import { useEffect } from "react";
import { useAppStore } from "@/lib/store";

/**
 * Applies the `dark` class to <html> based on the persisted theme.
 * Also runs on theme toggle. Must be mounted in the root layout.
 */
export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useAppStore((s) => s.theme);

  useEffect(() => {
    const root = document.documentElement;
    if (theme === "dark") {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    root.style.colorScheme = theme;
  }, [theme]);

  return <>{children}</>;
}
