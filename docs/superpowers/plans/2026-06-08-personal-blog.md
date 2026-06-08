# 个人博客系统实现计划

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 构建一个极简主义风格的个人博客，包含胶卷风格摄影作品展示、GitHub项目展示、博客内容和后台管理。

**Architecture:** Next.js 14 App Router 全栈应用，前端极简主义设计 + 胶卷风格图片展示，后端使用 Prisma ORM + PostgreSQL，认证使用 NextAuth.js，云服务器自建部署。

**Tech Stack:** Next.js 14, Tailwind CSS, Framer Motion, Prisma, PostgreSQL, NextAuth.js, next-themes, PM2, Nginx

---

## 文件结构

```
slouch/
├── prisma/
│   ├── schema.prisma                    # 数据库模型定义
│   └── seed.ts                          # 数据库种子数据
├── src/
│   ├── app/
│   │   ├── layout.tsx                   # 根布局（主题Provider + 全局字体）
│   │   ├── page.tsx                     # 首页（摄影作品展示）
│   │   ├── globals.css                  # 全局样式 + Tailwind
│   │   ├── projects/
│   │   │   └── page.tsx                 # GitHub项目展示页
│   │   ├── blog/
│   │   │   ├── page.tsx                 # 博客列表页
│   │   │   └── [slug]/
│   │   │       └── page.tsx             # 博客文章详情页
│   │   ├── about/
│   │   │   └── page.tsx                 # 关于我页
│   │   ├── admin/
│   │   │   ├── layout.tsx               # 后台布局（侧边栏导航）
│   │   │   ├── page.tsx                 # 后台仪表盘
│   │   │   ├── photos/
│   │   │   │   └── page.tsx             # 摄影作品管理
│   │   │   ├── posts/
│   │   │   │   ├── page.tsx             # 博客文章列表
│   │   │   │   └── [id]/
│   │   │   │       └── page.tsx         # 博客文章编辑
│   │   │   └── projects/
│   │   │       └── page.tsx             # GitHub项目管理
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts         # NextAuth 认证API
│   │   │   ├── photos/
│   │   │   │   ├── route.ts             # 摄影作品CRUD API
│   │   │   │   └── upload/
│   │   │   │       └── route.ts         # 图片上传API
│   │   │   ├── posts/
│   │   │   │   └── route.ts             # 博客文章CRUD API
│   │   │   ├── projects/
│   │   │   │   └── route.ts             # 项目CRUD API
│   │   │   └── github/
│   │   │       └── sync/
│   │   │           └── route.ts         # GitHub同步API
│   │   └── providers/
│   │       └── theme-provider.tsx        # next-themes 主题Provider
│   ├── components/
│   │   ├── layout/
│   │   │   ├── navigation.tsx           # 图标导航组件
│   │   │   └── theme-toggle.tsx         # 主题切换按钮
│   │   ├── film/
│   │   │   ├── film-strip.tsx           # 胶卷条展示组件
│   │   │   ├── film-perforations.tsx    # 胶卷齿孔组件
│   │   │   └── album-selector.tsx       # 相册选择器（胶卷盒样式）
│   │   ├── projects/
│   │   │   └── project-card.tsx         # 项目卡片组件
│   │   ├── blog/
│   │   │   ├── post-card.tsx            # 博客卡片组件
│   │   │   └── markdown-renderer.tsx    # Markdown渲染组件
│   │   └── admin/
│   │       ├── admin-sidebar.tsx        # 后台侧边栏
│   │       └── admin-header.tsx         # 后台头部
│   ├── lib/
│   │   ├── db.ts                        # Prisma客户端实例
│   │   ├── auth.ts                      # NextAuth配置
│   │   ├── github.ts                    # GitHub API工具函数
│   │   └── upload.ts                    # 图片上传工具函数
│   └── types/
│       └── index.ts                     # 全局类型定义
├── public/
│   └── uploads/                         # 上传图片存储目录
├── next.config.js
├── tailwind.config.ts
├── tsconfig.json
├── package.json
├── ecosystem.config.js                  # PM2配置文件
├── .env                                 # 环境变量
├── .env.example                         # 环境变量示例
├── .gitignore
└── nginx/
    └── slouch.conf                      # Nginx配置文件
```

---

## Task 1: 项目初始化与基础配置

**Files:**
- Create: `package.json`
- Create: `next.config.js`
- Create: `tsconfig.json`
- Create: `tailwind.config.ts`
- Create: `.gitignore`
- Create: `.env.example`

- [ ] **Step 1: 初始化 Next.js 项目**

Run:
```bash
cd /home/slouch/github/slouch
npx create-next-app@14 . --typescript --tailwind --eslint --app --src-dir --import-alias "@/*" --use-npm
```

如果提示目录非空，先确认目录为空后执行，或手动初始化：
```bash
npm init -y
```

然后安装核心依赖：
```bash
npm install next@14 react@18 react-dom@18
npm install -D typescript @types/react @types/node @types/react-dom
npm install -D tailwindcss@3 postcss autoprefixer
npx tailwindcss init -p
```

- [ ] **Step 2: 安装项目依赖**

```bash
npm install prisma @prisma/client next-auth@4 next-themes framer-motion
npm install bcryptjs @types/bcryptjs
npm install react-markdown remark-gfm rehype-highlight
npm install -D @tailwindcss/typography
```

- [ ] **Step 3: 配置 tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "es5",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": true,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./src/*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules"]
}
```

- [ ] **Step 4: 配置 tailwind.config.ts**

```typescript
import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      colors: {
        light: "#fafafa",
        dark: "#0a0a0a",
      },
      animation: {
        "float-up": "floatUp 0.3s ease-out forwards",
      },
      keyframes: {
        floatUp: {
          "0%": { transform: "translateY(0)", boxShadow: "0 4px 15px rgba(0,0,0,0.05)" },
          "100%": { transform: "translateY(-8px)", boxShadow: "0 12px 30px rgba(0,0,0,0.1)" },
        },
      },
    },
  },
  plugins: [require("@tailwindcss/typography")],
};

export default config;
```

- [ ] **Step 5: 创建 .env.example**

```env
DATABASE_URL="postgresql://user:password@localhost:5432/slouch"
NEXTAUTH_SECRET="your-secret-key-here"
NEXTAUTH_URL="http://localhost:3000"
GITHUB_USERNAME="your-github-username"
ADMIN_EMAIL="your-email@example.com"
ADMIN_PASSWORD="your-password"
```

- [ ] **Step 6: 复制 .env.example 到 .env 并填入实际值**

```bash
cp .env.example .env
```

- [ ] **Step 7: 配置 .gitignore**

```
node_modules/
.next/
out/
.env
.env.local
public/uploads/*
!public/uploads/.gitkeep
```

- [ ] **Step 8: 初始化 Git 仓库并首次提交**

```bash
git init
git add .
git commit -m "chore: init Next.js 14 project with Tailwind, Prisma, and core deps"
```

---

## Task 2: 数据库模型与 Prisma 设置

**Files:**
- Create: `prisma/schema.prisma`
- Create: `src/lib/db.ts`
- Create: `prisma/seed.ts`

- [ ] **Step 1: 初始化 Prisma**

Run:
```bash
npx prisma init
```

- [ ] **Step 2: 编写 prisma/schema.prisma**

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id        String   @id @default(cuid())
  email     String   @unique
  password  String
  name      String?
  role      String   @default("admin")
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  @@map("users")
}

model Photo {
  id          String   @id @default(cuid())
  title       String
  description String?
  category    String
  imageUrl    String   @map("image_url")
  order       Int      @default(0)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("photos")
}

model Post {
  id          String    @id @default(cuid())
  title       String
  content     String
  excerpt     String?
  slug        String    @unique
  published   Boolean   @default(false)
  tags        String[]
  createdAt   DateTime  @default(now()) @map("created_at")
  updatedAt   DateTime  @updatedAt @map("updated_at")
  publishedAt DateTime? @map("published_at")

  @@map("posts")
}

model Project {
  id          String   @id @default(cuid())
  githubId    String?  @unique @map("github_id")
  name        String
  description String?
  url         String?
  language    String?
  stars       Int      @default(0)
  featured    Boolean  @default(false)
  createdAt   DateTime @default(now()) @map("created_at")
  updatedAt   DateTime @updatedAt @map("updated_at")

  @@map("projects")
}
```

- [ ] **Step 3: 运行 Prisma migrate**

```bash
npx prisma migrate dev --name init
```

- [ ] **Step 4: 创建 src/lib/db.ts**

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma = globalForPrisma.prisma || new PrismaClient();

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
```

- [ ] **Step 5: 创建 prisma/seed.ts**

```typescript
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  // 创建管理员用户
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123",
    10
  );
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@slouch.dev" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@slouch.dev",
      password: hashedPassword,
      name: "Slouch",
      role: "admin",
    },
  });

  // 创建示例摄影作品
  const categories = ["风景", "人像", "城市", "街拍"];
  for (const category of categories) {
    for (let i = 1; i <= 5; i++) {
      await prisma.photo.create({
        data: {
          title: `${category}作品 ${i}`,
          description: `${category}类摄影作品示例`,
          category,
          imageUrl: `https://picsum.photos/800/600?random=${category}-${i}`,
          order: i,
        },
      });
    }
  }

  // 创建示例博客文章
  await prisma.post.create({
    data: {
      title: "欢迎使用 Slouch 博客",
      content: "# 欢迎\n\n这是你的第一篇博客文章。使用 **Markdown** 语法编写。",
      excerpt: "这是你的第一篇博客文章",
      slug: "welcome",
      published: true,
      tags: ["博客", "教程"],
      publishedAt: new Date(),
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
```

- [ ] **Step 6: 在 package.json 添加 seed 脚本**

在 `package.json` 的 `"scripts"` 中添加：
```json
"prisma:seed": "tsx prisma/seed.ts"
```

安装 tsx：
```bash
npm install -D tsx
```

然后运行：
```bash
npm run prisma:seed
```

- [ ] **Step 7: 提交**

```bash
git add .
git commit -m "feat: add Prisma schema, db client, and seed data"
```

---

## Task 3: 全局布局与主题系统

**Files:**
- Create: `src/app/globals.css`
- Create: `src/app/providers/theme-provider.tsx`
- Create: `src/app/layout.tsx`
- Create: `src/components/layout/navigation.tsx`
- Create: `src/components/layout/theme-toggle.tsx`

- [ ] **Step 1: 编写 globals.css**

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  body {
    @apply bg-light text-neutral-800 dark:bg-dark dark:text-neutral-200 transition-colors duration-300;
  }
}

@layer components {
  .card-hover {
    @apply transition-all duration-300 ease-out;
  }
  .card-hover:hover {
    @apply -translate-y-2 shadow-lg;
  }
  .card-hover:hover img {
    @apply scale-105;
  }
}
```

- [ ] **Step 2: 创建 theme-provider.tsx**

```tsx
"use client";

import { ThemeProvider as NextThemesProvider } from "next-themes";
import { type ThemeProviderProps } from "next-themes/dist/types";

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
  return <NextThemesProvider {...props}>{children}</NextThemesProvider>;
}
```

- [ ] **Step 3: 创建 navigation.tsx（图标导航）**

```tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";

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

function ThemeToggle() {
  return (
    <motion.button
      className="w-4 h-4 rounded-full border border-neutral-300 dark:border-neutral-600 hover:border-neutral-500 dark:hover:border-neutral-400 transition-colors"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      onClick={() => {
        const html = document.documentElement;
        const isDark = html.classList.contains("dark");
        html.classList.toggle("dark", !isDark);
        localStorage.setItem("theme", isDark ? "light" : "dark");
      }}
      title="切换主题"
    />
  );
}
```

- [ ] **Step 4: 创建 layout.tsx（根布局）**

```tsx
import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "./providers/theme-provider";
import { Navigation } from "@/components/layout/navigation";

export const metadata: Metadata = {
  title: "Slouch - Photography & Development",
  description: "个人博客 - 摄影作品、开发项目、技术博客",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <body>
        <ThemeProvider
          attribute="class"
          defaultTheme="light"
          enableSystem
          disableTransitionOnChange
        >
          <Navigation />
          <main className="min-h-screen">{children}</main>
        </ThemeProvider>
      </body>
    </html>
  );
}
```

- [ ] **Step 5: 启动开发服务器验证**

Run:
```bash
npm run dev
```

访问 `http://localhost:3000` 验证：
- 页面加载无报错
- 导航图标显示在右上角
- 主题切换按钮正常工作

- [ ] **Step 6: 提交**

```bash
git add .
git commit -m "feat: add global layout, theme system, and icon navigation"
```

---

## Task 4: 胶卷齿孔组件

**Files:**
- Create: `src/components/film/film-perforations.tsx`

- [ ] **Step 1: 创建 film-perforations.tsx**

```tsx
interface FilmPerforationsProps {
  position: "top" | "bottom";
  count?: number;
}

export function FilmPerforations({
  position,
  count = 16,
}: FilmPerforationsProps) {
  return (
    <div
      className={`h-[14px] bg-[#1a1a1a] flex items-center px-2 gap-[12px] ${
        position === "top" ? "rounded-t" : "rounded-b"
      }`}
    >
      {Array.from({ length: count }).map((_, i) => (
        <div
          key={i}
          className="w-[7px] h-[5px] bg-[#fafafa] rounded-[1px] flex-shrink-0"
        />
      ))}
    </div>
  );
}
```

- [ ] **Step 2: 在开发服务器中验证组件渲染**

在任意页面临时导入 `<FilmPerforations position="top" />`，确认齿孔显示正确。

- [ ] **Step 3: 提交**

```bash
git add .
git commit -m "feat: add film perforations component with real 35mm proportions"
```

---

## Task 5: 胶卷条展示组件（Film Strip）

**Files:**
- Create: `src/components/film/film-strip.tsx`

- [ ] **Step 1: 创建 film-strip.tsx**

```tsx
"use client";

import { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FilmPerforations } from "./film-perforations";
import Image from "next/image";

interface Photo {
  id: string;
  title: string;
  imageUrl: string;
}

interface FilmStripProps {
  photos: Photo[];
}

export function FilmStrip({ photos }: FilmStripProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const dragStartX = useRef(0);
  const containerRef = useRef<HTMLDivElement>(null);

  const goToPrev = useCallback(() => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  }, []);

  const goToNext = useCallback(() => {
    setCurrentIndex((prev) => Math.min(photos.length - 1, prev + 1));
  }, [photos.length]);

  const handleDragStart = (e: React.MouseEvent | React.TouchEvent) => {
    setIsDragging(true);
    const clientX =
      "touches" in e ? e.touches[0].clientX : (e as React.MouseEvent).clientX;
    dragStartX.current = clientX;
  };

  const handleDragEnd = (e: React.MouseEvent | React.TouchEvent) => {
    if (!isDragging) return;
    setIsDragging(false);
    const clientX =
      "changedTouches" in e
        ? e.changedTouches[0].clientX
        : (e as React.MouseEvent).clientX;
    const diff = dragStartX.current - clientX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) goToNext();
      else goToPrev();
    }
  };

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (isDragging) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;
    if (x < width * 0.3) goToPrev();
    else if (x > width * 0.7) goToNext();
  };

  if (photos.length === 0) {
    return (
      <div className="bg-[#1a1a1a] rounded-lg p-8 text-center text-neutral-400">
        暂无作品
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      className="relative bg-[#1a1a1a] rounded-lg overflow-hidden max-w-[850px] mx-auto select-none"
      onClick={handleClick}
      onMouseDown={handleDragStart}
      onMouseUp={handleDragEnd}
      onTouchStart={handleDragStart}
      onTouchEnd={handleDragEnd}
    >
      <FilmPerforations position="top" count={16} />

      <div className="bg-[#2a2a2a] py-3 flex items-center justify-center relative overflow-hidden h-[280px]">
        {/* 左侧渐入图片 */}
        {currentIndex > 0 && (
          <div className="absolute left-[3%] w-[45px] h-[30px] opacity-25">
            <img
              src={photos[currentIndex - 1].imageUrl}
              alt=""
              className="w-full h-full object-cover rounded-[2px]"
            />
          </div>
        )}

        {/* 中心大图 */}
        <AnimatePresence mode="wait">
          <motion.div
            key={photos[currentIndex].id}
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="relative w-[380px] h-[253px]"
          >
            <img
              src={photos[currentIndex].imageUrl}
              alt={photos[currentIndex].title}
              className="w-full h-full object-cover rounded-[2px] shadow-[0_0_50px_rgba(255,255,255,0.15)]"
            />
          </motion.div>
        </AnimatePresence>

        {/* 右侧渐出图片 */}
        {currentIndex < photos.length - 1 && (
          <div className="absolute right-[3%] w-[45px] h-[30px] opacity-25">
            <img
              src={photos[currentIndex + 1].imageUrl}
              alt=""
              className="w-full h-full object-cover rounded-[2px]"
            />
          </div>
        )}

        {/* 左侧点击区域 */}
        <div className="absolute left-0 top-0 w-[35%] h-full cursor-pointer z-10" />
        {/* 右侧点击区域 */}
        <div className="absolute right-0 top-0 w-[35%] h-full cursor-pointer z-10" />
      </div>

      <FilmPerforations position="bottom" count={16} />

      {/* 页码指示器 */}
      <div className="text-center py-2 text-neutral-500 text-xs">
        {currentIndex + 1} / {photos.length}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add .
git commit -m "feat: add film strip component with drag/click navigation"
```

---

## Task 6: 相册选择器（胶卷盒样式）

**Files:**
- Create: `src/components/film/album-selector.tsx`

- [ ] **Step 1: 创建 album-selector.tsx**

```tsx
"use client";

import { motion } from "framer-motion";

interface Album {
  id: string;
  name: string;
}

interface AlbumSelectorProps {
  albums: Album[];
  selectedId: string;
  onSelect: (id: string) => void;
}

export function AlbumSelector({
  albums,
  selectedId,
  onSelect,
}: AlbumSelectorProps) {
  return (
    <div className="flex justify-center items-center gap-[18px]">
      {albums.map((album) => {
        const isSelected = album.id === selectedId;
        return (
          <motion.button
            key={album.id}
            onClick={() => onSelect(album.id)}
            className="flex flex-col items-center gap-[12px]"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="relative w-[40px] h-[40px]">
              {/* 胶卷盒主体 */}
              <div
                className={`w-[40px] h-[40px] rounded-full flex items-center justify-center transition-all duration-300 ${
                  isSelected
                    ? "bg-[radial-gradient(circle_at_35%_35%,#5a5a5a,#252525)] border-2 border-neutral-400 shadow-[0_4px_18px_rgba(0,0,0,0.35)]"
                    : "bg-[radial-gradient(circle_at_35%_35%,#5a5a5a,#252525)] border-2 border-neutral-700 shadow-[0_3px_12px_rgba(0,0,0,0.25)]"
                }`}
              >
                {/* 中心轴孔 */}
                <div
                  className={`w-[14px] h-[14px] rounded-full bg-[#1a1a1a] transition-all duration-300 ${
                    isSelected ? "border-[1.5px] border-neutral-200" : "border-[1.5px] border-neutral-600"
                  }`}
                />
              </div>
              {/* 顶部凸起（模拟盒盖/卷轴口） */}
              <div className="absolute -top-[6px] left-1/2 -translate-x-1/2 w-[8px] h-[6px] bg-[#3a3a3a] rounded-t-[2px]" />
            </div>
            {/* 标签 */}
            <span
              className={`text-[10px] transition-colors duration-300 ${
                isSelected
                  ? "text-neutral-800 dark:text-neutral-200 font-medium"
                  : "text-neutral-500"
              }`}
            >
              {album.name}
            </span>
          </motion.button>
        );
      })}
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add .
git commit -m "feat: add album selector with film canister styling"
```

---

## Task 7: 首页（摄影作品展示）

**Files:**
- Create: `src/app/page.tsx`

- [ ] **Step 1: 创建首页 page.tsx**

```tsx
import { prisma } from "@/lib/db";
import { FilmStrip } from "@/components/film/film-strip";
import { AlbumSelector } from "@/components/film/album-selector";

async function getCategories() {
  const photos = await prisma.photo.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return photos.map((p) => p.category);
}

async function getPhotos(category: string) {
  return prisma.photo.findMany({
    where: { category },
    orderBy: { order: "asc" },
  });
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const categories = await getCategories();
  const selectedCategory = searchParams.category || categories[0] || "风景";
  const photos = await getPhotos(selectedCategory);

  const albums = categories.map((c) => ({ id: c, name: c }));

  return (
    <div className="pt-20 pb-12 px-6">
      {/* 相册选择器 */}
      <div className="mb-12">
        <AlbumSelector
          albums={albums}
          selectedId={selectedCategory}
          onSelect={(id) => {
            window.location.href = `/?category=${encodeURIComponent(id)}`;
          }}
        />
      </div>

      {/* 胶卷展示 */}
      <FilmStrip
        photos={photos.map((p) => ({
          id: p.id,
          title: p.title,
          imageUrl: p.imageUrl,
        }))}
      />
    </div>
  );
}
```

- [ ] **Step 2: 验证首页功能**

Run `npm run dev`，访问 `http://localhost:3000`：
- 胶卷盒相册选择器显示
- 胶卷风格图片展示正常
- 点击左侧/右侧可滑动
- 拖拽可滑动
- 切换相册后显示对应图片

- [ ] **Step 3: 提交**

```bash
git add .
git commit -m "feat: add homepage with film strip photography showcase"
```

---

## Task 8: GitHub 项目展示页

**Files:**
- Create: `src/lib/github.ts`
- Create: `src/components/projects/project-card.tsx`
- Create: `src/app/projects/page.tsx`
- Create: `src/app/api/github/sync/route.ts`
- Create: `src/app/api/projects/route.ts`

- [ ] **Step 1: 创建 GitHub API 工具函数 lib/github.ts**

```typescript
interface GitHubRepo {
  id: number;
  name: string;
  description: string | null;
  html_url: string;
  language: string | null;
  stargazers_count: number;
}

export async function fetchGitHubRepos(username: string): Promise<GitHubRepo[]> {
  const res = await fetch(
    `https://api.github.com/users/${username}/repos?sort=updated&per_page=100`,
    {
      headers: {
        Accept: "application/vnd.github.v3+json",
        ...(process.env.GITHUB_TOKEN && {
          Authorization: `token ${process.env.GITHUB_TOKEN}`,
        }),
      },
      next: { revalidate: 86400 }, // 24小时缓存
    }
  );

  if (!res.ok) {
    throw new Error(`GitHub API error: ${res.status}`);
  }

  return res.json();
}

export async function syncGitHubProjects(username: string) {
  const repos = await fetchGitHubRepos(username);
  const { prisma } = await import("@/lib/db");

  for (const repo of repos) {
    await prisma.project.upsert({
      where: { githubId: String(repo.id) },
      update: {
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
      },
      create: {
        githubId: String(repo.id),
        name: repo.name,
        description: repo.description,
        url: repo.html_url,
        language: repo.language,
        stars: repo.stargazers_count,
        featured: false,
      },
    });
  }

  return repos.length;
}
```

- [ ] **Step 2: 创建 project-card.tsx**

```tsx
"use client";

import { motion } from "framer-motion";

interface Project {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  language: string | null;
  stars: number;
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.a
      href={project.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 card-hover"
      whileHover={{ y: -8, boxShadow: "0 12px 30px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-medium mb-2">{project.name}</h3>
      {project.description && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
          {project.description}
        </p>
      )}
      <div className="flex items-center gap-4 text-xs text-neutral-500">
        {project.language && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            {project.language}
          </span>
        )}
        {project.stars > 0 && <span>⭐ {project.stars}</span>}
      </div>
    </motion.a>
  );
}
```

- [ ] **Step 3: 创建 projects/page.tsx**

```tsx
import { prisma } from "@/lib/db";
import { ProjectCard } from "@/components/projects/project-card";

async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { featured: true },
    orderBy: { stars: "desc" },
  });
}

export default async function ProjectsPage() {
  const projects = await getFeaturedProjects();

  return (
    <div className="pt-20 pb-12 px-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {projects.length === 0 && (
        <p className="text-center text-neutral-500 mt-20">
          暂无展示项目，请在后台管理中筛选 GitHub 项目
        </p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: 创建 GitHub 同步 API route.ts**

```typescript
import { NextResponse } from "next/server";
import { syncGitHubProjects } from "@/lib/github";

export async function POST() {
  try {
    const username = process.env.GITHUB_USERNAME;
    if (!username) {
      return NextResponse.json(
        { error: "GITHUB_USERNAME not configured" },
        { status: 500 }
      );
    }

    const count = await syncGitHubProjects(username);
    return NextResponse.json({ synced: count });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to sync GitHub projects" },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 5: 创建 projects API route.ts**

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { stars: "desc" },
  });
  return NextResponse.json(projects);
}

export async function PATCH(request: Request) {
  const { id, featured } = await request.json();
  const project = await prisma.project.update({
    where: { id },
    data: { featured },
  });
  return NextResponse.json(project);
}
```

- [ ] **Step 6: 验证项目页**

Run `npm run dev`，访问 `http://localhost:3000/projects`：
- 页面正常加载
- 显示"暂无展示项目"提示（因为还没有 featured 项目）

- [ ] **Step 7: 提交**

```bash
git add .
git commit -m "feat: add GitHub projects page with sync API"
```

---

## Task 9: 博客页面

**Files:**
- Create: `src/components/blog/post-card.tsx`
- Create: `src/components/blog/markdown-renderer.tsx`
- Create: `src/app/blog/page.tsx`
- Create: `src/app/blog/[slug]/page.tsx`
- Create: `src/app/api/posts/route.ts`

- [ ] **Step 1: 创建 post-card.tsx**

```tsx
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  tags: string[];
  publishedAt: Date | null;
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 card-hover group"
    >
      <h3 className="text-lg font-medium mb-2 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
          {post.excerpt}
        </p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded"
          >
            {tag}
          </span>
        ))}
        {post.publishedAt && (
          <span className="text-xs text-neutral-400 ml-auto">
            {new Date(post.publishedAt).toLocaleDateString("zh-CN")}
          </span>
        )}
      </div>
    </Link>
  );
}
```

- [ ] **Step 2: 创建 markdown-renderer.tsx**

```tsx
"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

export function MarkdownRenderer({ content }: { content: string }) {
  return (
    <article className="prose prose-neutral dark:prose-invert max-w-none">
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </article>
  );
}
```

- [ ] **Step 3: 创建 blog/page.tsx**

```tsx
import { prisma } from "@/lib/db";
import { PostCard } from "@/components/blog/post-card";

async function getPublishedPosts() {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="pt-20 pb-12 px-6 max-w-3xl mx-auto">
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {posts.length === 0 && (
        <p className="text-center text-neutral-500 mt-20">暂无博客文章</p>
      )}
    </div>
  );
}
```

- [ ] **Step 4: 创建 blog/[slug]/page.tsx**

```tsx
import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";

async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  if (!post || !post.published) notFound();

  return (
    <div className="pt-20 pb-12 px-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-medium mb-4">{post.title}</h1>
      <div className="flex items-center gap-2 mb-8 text-sm text-neutral-500">
        {post.publishedAt && (
          <span>{new Date(post.publishedAt).toLocaleDateString("zh-CN")}</span>
        )}
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
      <MarkdownRenderer content={post.content} />
    </div>
  );
}

export async function generateStaticParams() {
  const posts = await prisma.post.findMany({
    where: { published: true },
    select: { slug: true },
  });
  return posts.map((post) => ({ slug: post.slug }));
}
```

- [ ] **Step 5: 创建 posts API route.ts**

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const data = await request.json();
  const post = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      slug: data.slug,
      published: data.published ?? false,
      tags: data.tags ?? [],
      publishedAt: data.published ? new Date() : null,
    },
  });
  return NextResponse.json(post, { status: 201 });
}

export async function PUT(request: Request) {
  const data = await request.json();
  const post = await prisma.post.update({
    where: { id: data.id },
    data: {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      slug: data.slug,
      published: data.published,
      tags: data.tags,
      publishedAt: data.published && !data.publishedAt ? new Date() : data.publishedAt,
    },
  });
  return NextResponse.json(post);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 6: 验证博客页**

访问 `http://localhost:3000/blog`：
- 显示种子数据中的博客文章
- 点击文章进入详情页
- Markdown 内容正确渲染

- [ ] **Step 7: 提交**

```bash
git add .
git commit -m "feat: add blog list, detail pages with markdown rendering"
```

---

## Task 10: 关于我页面

**Files:**
- Create: `src/app/about/page.tsx`

- [ ] **Step 1: 创建 about/page.tsx**

```tsx
export default function AboutPage() {
  return (
    <div className="pt-20 pb-12 px-6 max-w-2xl mx-auto">
      <div className="space-y-12">
        {/* 头像区域 */}
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>

        {/* 简介 */}
        <div className="text-center space-y-4">
          <h1 className="text-xl font-light tracking-wider">SLOUCH</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            摄影师 · 开发者 · 写作者
          </p>
        </div>

        {/* 社交链接 */}
        <div className="flex justify-center gap-6">
          <a
            href="https://github.com/slouch"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            title="GitHub"
          >
            <span className="text-sm">🐙</span>
          </a>
          <a
            href="https://twitter.com/slouch"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            title="Twitter"
          >
            <span className="text-sm">🐦</span>
          </a>
          <a
            href="mailto:hello@slouch.dev"
            className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            title="Email"
          >
            <span className="text-sm">✉️</span>
          </a>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证关于我页**

访问 `http://localhost:3000/about`，确认页面正常显示。

- [ ] **Step 3: 提交**

```bash
git add .
git commit -m "feat: add about page with social links"
```

---

## Task 11: NextAuth 认证系统

**Files:**
- Create: `src/lib/auth.ts`
- Create: `src/app/api/auth/[...nextauth]/route.ts`

- [ ] **Step 1: 创建 auth.ts**

```typescript
import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcryptjs";
import { prisma } from "./db";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email },
        });
        if (!user) return null;

        const isValid = await bcrypt.compare(
          credentials.password,
          user.password
        );
        if (!isValid) return null;

        return { id: user.id, email: user.email, name: user.name };
      },
    }),
  ],
  pages: {
    signIn: "/admin/login",
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60, // 30天
  },
  secret: process.env.NEXTAUTH_SECRET,
};
```

- [ ] **Step 2: 创建 NextAuth API route**

```typescript
import NextAuth from "next-auth";
import { authOptions } from "@/lib/auth";

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
```

- [ ] **Step 3: 验证认证系统**

启动开发服务器，访问 `http://localhost:3000/api/auth/signin`：
- 登录页面正常显示
- 使用种子数据中的账号密码登录成功

- [ ] **Step 4: 提交**

```bash
git add .
git commit -m "feat: add NextAuth credentials authentication"
```

---

## Task 12: 后台管理布局

**Files:**
- Create: `src/components/admin/admin-sidebar.tsx`
- Create: `src/app/admin/layout.tsx`
- Create: `src/app/admin/login/page.tsx`
- Create: `src/app/admin/page.tsx`

- [ ] **Step 1: 创建 admin-sidebar.tsx**

```tsx
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
```

- [ ] **Step 2: 创建 admin/layout.tsx**

```tsx
import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { AdminSidebar } from "@/components/admin/admin-sidebar";

export default async function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/admin/login");

  return (
    <div className="flex min-h-screen">
      <AdminSidebar />
      <div className="flex-1 p-8">{children}</div>
    </div>
  );
}
```

- [ ] **Step 3: 创建 admin/login/page.tsx**

```tsx
"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });
    if (result?.error) {
      setError("邮箱或密码错误");
    } else {
      router.push("/admin");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <form
        onSubmit={handleSubmit}
        className="w-80 space-y-4 p-8 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800"
      >
        <h1 className="text-lg font-medium text-center mb-6">管理后台登录</h1>
        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}
        <input
          type="email"
          placeholder="邮箱"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm focus:outline-none focus:border-neutral-500"
          required
        />
        <input
          type="password"
          placeholder="密码"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm focus:outline-none focus:border-neutral-500"
          required
        />
        <button
          type="submit"
          className="w-full py-2 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg text-sm font-medium hover:bg-neutral-700 dark:hover:bg-neutral-300 transition-colors"
        >
          登录
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 4: 创建 admin/page.tsx（仪表盘）**

```tsx
import { prisma } from "@/lib/db";

async function getStats() {
  const [photoCount, postCount, projectCount] = await Promise.all([
    prisma.photo.count(),
    prisma.post.count(),
    prisma.project.count(),
  ]);
  return { photoCount, postCount, projectCount };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-xl font-medium mb-8">仪表盘</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 mb-2">摄影作品</p>
          <p className="text-2xl font-medium">{stats.photoCount}</p>
        </div>
        <div className="p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 mb-2">博客文章</p>
          <p className="text-2xl font-medium">{stats.postCount}</p>
        </div>
        <div className="p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 mb-2">GitHub项目</p>
          <p className="text-2xl font-medium">{stats.projectCount}</p>
        </div>
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 验证后台管理**

1. 访问 `http://localhost:3000/admin` → 自动跳转到登录页
2. 使用种子数据账号登录
3. 登录后显示仪表盘，统计数据正确

- [ ] **Step 6: 提交**

```bash
git add .
git commit -m "feat: add admin layout, login page, and dashboard"
```

---

## Task 13: 后台 - 摄影作品管理

**Files:**
- Create: `src/app/api/photos/route.ts`
- Create: `src/app/api/photos/upload/route.ts`
- Create: `src/app/admin/photos/page.tsx`

- [ ] **Step 1: 创建 photos API route.ts**

```typescript
import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const photos = await prisma.photo.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
  return NextResponse.json(photos);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const photo = await prisma.photo.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      imageUrl: data.imageUrl,
      order: data.order ?? 0,
    },
  });
  return NextResponse.json(photo, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const photo = await prisma.photo.update({
    where: { id: data.id },
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      imageUrl: data.imageUrl,
      order: data.order,
    },
  });
  return NextResponse.json(photo);
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  await prisma.photo.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
```

- [ ] **Step 2: 创建 photos/upload API route.ts**

```typescript
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { writeFile } from "fs/promises";
import path from "path";

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session)
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const formData = await request.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const bytes = await file.arrayBuffer();
  const buffer = Buffer.from(bytes);

  const filename = `${Date.now()}-${file.name}`;
  const uploadDir = path.join(process.cwd(), "public/uploads");
  const filepath = path.join(uploadDir, filename);

  await writeFile(filepath, buffer);

  return NextResponse.json({ url: `/uploads/${filename}` });
}
```

- [ ] **Step 3: 创建 public/uploads/.gitkeep**

```bash
mkdir -p public/uploads
touch public/uploads/.gitkeep
```

- [ ] **Step 4: 创建 admin/photos/page.tsx**

```tsx
"use client";

import { useState, useEffect } from "react";

interface Photo {
  id: string;
  title: string;
  description: string | null;
  category: string;
  imageUrl: string;
  order: number;
}

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "风景",
    imageUrl: "",
    order: 0,
  });

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const res = await fetch("/api/photos");
    const data = await res.json();
    setPhotos(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", description: "", category: "风景", imageUrl: "", order: 0 });
    setShowForm(false);
    fetchPhotos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确认删除？")) return;
    await fetch("/api/photos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchPhotos();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/photos/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setForm((prev) => ({ ...prev, imageUrl: data.url }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-medium">摄影作品管理</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg text-sm"
        >
          {showForm ? "取消" : "添加作品"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-4"
        >
          <input
            type="text"
            placeholder="标题"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm"
            required
          />
          <textarea
            placeholder="描述"
            value={form.description}
            onChange={(e) =>
              setForm({ ...form, description: e.target.value })
            }
            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm"
            rows={2}
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm"
          >
            <option value="风景">风景</option>
            <option value="人像">人像</option>
            <option value="城市">城市</option>
            <option value="街拍">街拍</option>
          </select>
          <div className="flex gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="text-sm"
            />
            <input
              type="text"
              placeholder="或输入图片URL"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm"
            />
          </div>
          <input
            type="number"
            placeholder="排序"
            value={form.order}
            onChange={(e) =>
              setForm({ ...form, order: parseInt(e.target.value) })
            }
            className="w-32 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg text-sm"
          >
            保存
          </button>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden"
          >
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full aspect-square object-cover"
            />
            <div className="p-3">
              <p className="text-sm font-medium truncate">{photo.title}</p>
              <p className="text-xs text-neutral-500">{photo.category}</p>
              <button
                onClick={() => handleDelete(photo.id)}
                className="mt-2 text-xs text-red-500 hover:text-red-700"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 5: 验证摄影作品管理**

1. 访问 `http://localhost:3000/admin/photos`
2. 添加新作品 → 成功保存
3. 上传图片 → 文件保存到 public/uploads
4. 删除作品 → 确认删除成功

- [ ] **Step 6: 提交**

```bash
git add .
git commit -m "feat: add admin photos management with upload support"
```

---

## Task 14: 后台 - 博客文章管理

**Files:**
- Create: `src/app/admin/posts/page.tsx`
- Create: `src/app/admin/posts/[id]/page.tsx`

- [ ] **Step 1: 创建 admin/posts/page.tsx（文章列表）**

```tsx
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  tags: string[];
  createdAt: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确认删除？")) return;
    await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchPosts();
  };

  const handleTogglePublish = async (post: Post) => {
    await fetch("/api/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...post,
        published: !post.published,
      }),
    });
    fetchPosts();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-medium">博客文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg text-sm"
        >
          新建文章
        </Link>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800"
          >
            <div>
              <h3 className="text-sm font-medium">{post.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    post.published
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800"
                  }`}
                >
                  {post.published ? "已发布" : "草稿"}
                </span>
                <span className="text-xs text-neutral-400">
                  {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTogglePublish(post)}
                className="text-xs px-3 py-1 border border-neutral-300 dark:border-neutral-700 rounded"
              >
                {post.published ? "取消发布" : "发布"}
              </button>
              <Link
                href={`/admin/posts/${post.id}`}
                className="text-xs px-3 py-1 border border-neutral-300 dark:border-neutral-700 rounded"
              >
                编辑
              </Link>
              <button
                onClick={() => handleDelete(post.id)}
                className="text-xs px-3 py-1 text-red-500 border border-red-300 dark:border-red-800 rounded"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 创建 admin/posts/[id]/page.tsx（文章编辑）**

```tsx
"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function AdminPostEditPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";

  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    slug: "",
    published: false,
    tags: "",
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/posts`)
        .then((res) => res.json())
        .then((posts) => {
          const post = posts.find((p: any) => p.id === params.id);
          if (post) {
            setForm({
              title: post.title,
              content: post.content,
              excerpt: post.excerpt || "",
              slug: post.slug,
              published: post.published,
              tags: post.tags.join(", "),
            });
          }
        });
    }
  }, [isNew, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (isNew) {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: params.id, ...payload }),
      });
    }
    router.push("/admin/posts");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-medium">
          {isNew ? "新建文章" : "编辑文章"}
        </h1>
        <button
          onClick={() => router.back()}
          className="text-sm text-neutral-500"
        >
          ← 返回列表
        </button>
      </div>

      <form
        onSubmit={handleSubmit}
        className="space-y-4 max-w-3xl"
      >
        <input
          type="text"
          placeholder="标题"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm"
          required
        />
        <input
          type="text"
          placeholder="Slug（URL路径）"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm"
          required
        />
        <textarea
          placeholder="文章摘要"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm"
          rows={2}
        />
        <textarea
          placeholder="文章内容（Markdown）"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm font-mono"
          rows={16}
          required
        />
        <input
          type="text"
          placeholder="标签（逗号分隔）"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          发布
        </label>
        <button
          type="submit"
          className="px-6 py-2 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg text-sm"
        >
          保存
        </button>
      </form>
    </div>
  );
}
```

- [ ] **Step 3: 验证博客管理**

1. 访问 `http://localhost:3000/admin/posts`
2. 新建文章 → 保存成功
3. 编辑文章 → 内容正确加载
4. 切换发布状态 → 前台 `/blog` 页面相应变化

- [ ] **Step 4: 提交**

```bash
git add .
git commit -m "feat: add admin blog posts management with markdown editor"
```

---

## Task 15: 后台 - GitHub 项目管理

**Files:**
- Create: `src/app/admin/projects/page.tsx`

- [ ] **Step 1: 创建 admin/projects/page.tsx**

```tsx
"use client";

import { useState, useEffect } from "react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  language: string | null;
  stars: number;
  featured: boolean;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  };

  const handleSync = async () => {
    setSyncing(true);
    await fetch("/api/github/sync", { method: "POST" });
    await fetchProjects();
    setSyncing(false);
  };

  const handleToggleFeatured = async (project: Project) => {
    await fetch("/api/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: project.id,
        featured: !project.featured,
      }),
    });
    fetchProjects();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-medium">GitHub 项目管理</h1>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="px-4 py-2 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg text-sm disabled:opacity-50"
        >
          {syncing ? "同步中..." : "同步 GitHub"}
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">{project.name}</h3>
                {project.language && (
                  <span className="text-xs text-neutral-500">
                    {project.language}
                  </span>
                )}
                {project.stars > 0 && (
                  <span className="text-xs text-neutral-500">
                    ⭐ {project.stars}
                  </span>
                )}
              </div>
              {project.description && (
                <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                  {project.description}
                </p>
              )}
            </div>
            <button
              onClick={() => handleToggleFeatured(project)}
              className={`text-xs px-3 py-1 rounded border ${
                project.featured
                  ? "bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 border-transparent"
                  : "border-neutral-300 dark:border-neutral-700"
              }`}
            >
              {project.featured ? "展示中" : "设为展示"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: 验证 GitHub 项目管理**

1. 访问 `http://localhost:3000/admin/projects`
2. 点击"同步 GitHub" → 项目列表更新
3. 切换项目展示状态 → 前台 `/projects` 页面相应变化

- [ ] **Step 3: 提交**

```bash
git add .
git commit -m "feat: add admin GitHub projects management with sync"
```

---

## Task 16: PM2 与 Nginx 部署配置

**Files:**
- Create: `ecosystem.config.js`
- Create: `nginx/slouch.conf`

- [ ] **Step 1: 创建 ecosystem.config.js（PM2 配置）**

```javascript
module.exports = {
  apps: [
    {
      name: "slouch-blog",
      script: "npm",
      args: "start",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "512M",
      env: {
        NODE_ENV: "production",
        PORT: 3000,
      },
    },
  ],
};
```

- [ ] **Step 2: 在 package.json 添加构建脚本**

```json
{
  "scripts": {
    "build": "next build",
    "start": "next start -p 3000",
    "deploy": "npm run build && pm2 restart ecosystem.config.js"
  }
}
```

- [ ] **Step 3: 创建 nginx/slouch.conf**

```nginx
server {
    listen 80;
    server_name your-domain.com;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 20M;
}

server {
    listen 443 ssl;
    server_name your-domain.com;

    ssl_certificate /etc/letsencrypt/live/your-domain.com/fullchain.pem;
    ssl_certificate_key /etc/letsencrypt/live/your-domain.com/privkey.pem;

    location / {
        proxy_pass http://127.0.0.1:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }

    client_max_body_size 20M;
}
```

- [ ] **Step 4: 创建部署文档 docs/deployment.md**

```markdown
# 部署指南

## 服务器环境准备

```bash
# 安装 Node.js 18+
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs

# 安装 PM2
sudo npm install -g pm2

# 安装 PostgreSQL
sudo apt-get install postgresql postgresql-contrib

# 安装 Nginx
sudo apt-get install nginx
```

## 项目部署

```bash
# 克隆代码
git clone <your-repo-url> /var/www/slouch
cd /var/www/slouch

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入实际值

# 数据库迁移
npx prisma migrate deploy

# 初始化种子数据
npm run prisma:seed

# 构建项目
npm run build

# 启动 PM2
pm2 start ecosystem.config.js
pm2 save
pm2 startup

# 配置 Nginx
sudo cp nginx/slouch.conf /etc/nginx/sites-available/slouch
sudo ln -s /etc/nginx/sites-available/slouch /etc/nginx/sites-enabled/
sudo nginx -t
sudo systemctl restart nginx
```

## SSL 证书（Let's Encrypt）

```bash
sudo apt-get install certbot python3-certbot-nginx
sudo certbot --nginx -d your-domain.com
```

## 更新部署

```bash
cd /var/www/slouch
git pull
npm install
npx prisma migrate deploy
npm run build
pm2 restart slouch-blog
```
```

- [ ] **Step 5: 提交**

```bash
git add .
git commit -m "feat: add PM2, Nginx configs, and deployment guide"
```

---

## Task 17: 最终验证与清理

- [ ] **Step 1: 运行完整构建**

```bash
npm run build
```

确认无 TypeScript 错误，构建成功。

- [ ] **Step 2: 验证所有页面**

逐一访问以下页面，确认功能正常：
- `http://localhost:3000/` - 首页胶卷展示
- `http://localhost:3000/projects` - GitHub 项目
- `http://localhost:3000/blog` - 博客列表
- `http://localhost:3000/blog/welcome` - 博客详情
- `http://localhost:3000/about` - 关于我
- `http://localhost:3000/admin` - 后台仪表盘
- `http://localhost:3000/admin/photos` - 作品管理
- `http://localhost:3000/admin/posts` - 文章管理
- `http://localhost:3000/admin/projects` - 项目管理

- [ ] **Step 3: 验证主题切换**

- 点击主题切换按钮
- 确认所有页面切换无闪烁
- 刷新页面后主题保持

- [ ] **Step 4: 验证移动端响应式**

- 使用浏览器开发者工具模拟移动端
- 确认所有页面在小屏幕上正常显示

- [ ] **Step 5: 最终提交**

```bash
git add .
git commit -m "chore: final verification and cleanup"
```
