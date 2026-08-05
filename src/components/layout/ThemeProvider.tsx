"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  return (
    <NextThemesProvider
      attribute="class"
      defaultTheme="system"
      enableSystem
      // The theme swap is instantaneous; letting Next animate it produces a
      // full-page colour flash on every toggle.
      disableTransitionOnChange
    >
      {children}
    </NextThemesProvider>
  );
}
