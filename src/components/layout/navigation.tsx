"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { ThemeToggle } from "./theme-toggle";

function CameraIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#888"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M23 19a2 2 0 01-2 2H3a2 2 0 01-2-2V8a2 2 0 012-2h4l2-3h6l2 3h4a2 2 0 012 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  );
}

function CodeIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#888"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="16 18 22 12 16 6"/>
      <polyline points="8 6 2 12 8 18"/>
    </svg>
  );
}

function PenIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#888"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M12 19l7-7 3 3-7 7-3-3z"/>
      <path d="M18 13l-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/>
      <path d="M2 2l7.586 7.586"/>
      <circle cx="11" cy="11" r="2"/>
    </svg>
  );
}

function UserIcon({ active }: { active: boolean }) {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke={active ? "#fff" : "#888"} strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/>
      <circle cx="12" cy="7" r="4"/>
    </svg>
  );
}

const navItems = [
  { href: "/", icon: CameraIcon, label: "作品" },
  { href: "/projects", icon: CodeIcon, label: "项目" },
  { href: "/blog", icon: PenIcon, label: "博客" },
  { href: "/about", icon: UserIcon, label: "关于" },
];

export function Navigation() {
  const pathname = usePathname();

  return (
    <nav
      className="fixed top-5 right-5 z-50 flex items-center gap-1.5 px-2 py-1.5 rounded-full"
      style={{
        background: "rgba(255,255,255,0.72)",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
        border: "1px solid rgba(0,0,0,0.06)",
        boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
      }}
    >
      {navItems.map((item) => {
        const isActive = pathname === item.href;
        const Icon = item.icon;
        return (
          <Link key={item.href} href={item.href}>
            <motion.div
              className={`w-[34px] h-[34px] rounded-full flex items-center justify-center ${
                isActive
                  ? "bg-neutral-900 dark:bg-neutral-100"
                  : "hover:bg-neutral-100 dark:hover:bg-neutral-800"
              } transition-colors duration-300`}
              whileHover={{ scale: 1.12 }}
              whileTap={{ scale: 0.92 }}
              title={item.label}
            >
              <Icon active={isActive} />
            </motion.div>
          </Link>
        );
      })}
      <div className="w-px h-4 bg-neutral-200 dark:bg-neutral-700 mx-1" />
      <ThemeToggle />
    </nav>
  );
}
