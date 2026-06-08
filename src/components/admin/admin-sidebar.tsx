"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const sidebarItems = [
  { href: "/admin", label: "仪表盘", icon: "📊" },
  { href: "/admin/photos", label: "摄影作品", icon: "📷" },
  { href: "/admin/posts", label: "博客文章", icon: "📝" },
  { href: "/admin/projects", label: "GitHub项目", icon: "💻" },
];

export function AdminSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-56 min-h-screen bg-white dark:bg-neutral-900 border-r border-neutral-200 dark:border-neutral-800 p-4">
      <h2 className="text-sm font-medium tracking-wider mb-8 px-3">
        管理后台
      </h2>
      <nav className="space-y-1">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive
                  ? "bg-neutral-100 dark:bg-neutral-800 font-medium"
                  : "hover:bg-neutral-50 dark:hover:bg-neutral-800/50"
              }`}
            >
              <span>{item.icon}</span>
              <span>{item.label}</span>
            </Link>
          );
        })}
      </nav>
      <div className="mt-8 pt-4 border-t border-neutral-200 dark:border-neutral-800">
        <Link
          href="/"
          className="flex items-center gap-2 px-3 py-2 text-sm text-neutral-500 hover:text-neutral-700 dark:hover:text-neutral-300 transition-colors"
        >
          ← 返回前台
        </Link>
      </div>
    </aside>
  );
}
