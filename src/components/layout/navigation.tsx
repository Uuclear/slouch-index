"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";

const navItems = [
  { href: "/", icon: "📷", label: "作品" },
  { href: "/projects", icon: "💻", label: "项目" },
  { href: "/blog", icon: "📝", label: "博客" },
  { href: "/about", icon: "👤", label: "关于" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav className="fixed top-6 right-6 z-50 flex items-center gap-3">
      {navItems.map((item) => (
        <Link key={item.href} href={item.href}>
          <motion.div
            className={`w-8 h-8 rounded flex items-center justify-center cursor-pointer ${
              pathname === item.href
                ? "bg-neutral-800 dark:bg-neutral-200"
                : "bg-neutral-200 dark:bg-neutral-700 hover:bg-neutral-300 dark:hover:bg-neutral-600"
            } transition-colors duration-300`}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
            title={item.label}
          >
            <span className="text-sm">{item.icon}</span>
          </motion.div>
        </Link>
      ))}
      <ThemeToggle />
    </nav>
  );
}
