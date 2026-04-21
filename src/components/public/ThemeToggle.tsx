"use client";

import { useTheme } from "next-themes";
import { Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return <div className="w-[72px] h-9 rounded-full bg-bg-secondary border border-border-soft" />;
  }

  const isDark = theme === "dark";

  return (
    <button
      onClick={() => setTheme(isDark ? "light" : "dark")}
      className="flex items-center gap-2 px-3 py-2 rounded-full bg-bg-secondary border border-border-soft hover:border-accent-primary hover:bg-accent-soft transition-all duration-200 group"
      aria-label="Toggle theme"
    >
      {isDark ? (
        <>
          <Sun size={14} className="text-accent-peach" />
          <span className="text-xs text-text-secondary font-body">Light</span>
        </>
      ) : (
        <>
          <Moon size={14} className="text-accent-lavender" />
          <span className="text-xs text-text-secondary font-body">Dark</span>
        </>
      )}
    </button>
  );
}
