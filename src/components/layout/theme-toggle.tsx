"use client";

import { useTheme } from "next-themes";
import { motion } from "framer-motion";
import { useEffect, useState } from "react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <div className="w-[14px] h-[14px]" />;
  }

  return (
    <motion.button
      className={`w-[14px] h-[14px] rounded-full border transition-colors ${
        theme === "dark"
          ? "border-neutral-600 hover:border-neutral-400 bg-neutral-800"
          : "border-neutral-300 hover:border-neutral-500 bg-neutral-100"
      }`}
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
      title="切换主题"
    />
  );
}
