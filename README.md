# Slouch - Photography & Development Blog

![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-blue?logo=typescript)
![Prisma](https://img.shields.io/badge/Prisma-7-blueviolet?logo=prisma)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-blue?logo=postgresql)

一个极简主义风格的个人博客系统，以胶卷为设计主题，用于展示摄影作品、GitHub 项目和技术博客。

![Screenshot](https://raw.githubusercontent.com/Uuclear/slouch-index/main/docs/screenshot.png)

## ✨ 特性

### 前端展示

- ️ **胶卷风格摄影展示** — 基于 ISO 1007 标准的真实 35mm 胶卷尺寸还原，包含齿孔、片头、暗盒等细节
- 📷 **相册选择器** — 迷你胶卷 + 暗盒样式，侧边展示相册封面照片
- 🌓 **主题切换** — 浅色/深色双主题，支持系统跟随
- 📱 **响应式设计** — 移动端和桌面端自适应
-  **微交互效果** — 拖拽滑动、hover 动画、平滑过渡

### 后台管理

- 🔐 **认证系统** — 基于 NextAuth.js 的凭证认证
-  **摄影作品管理** — 图片上传、分类管理、排序控制
-  **博客文章管理** — Markdown 编辑器，发布/草稿管理
- 💻 **GitHub 项目同步** — 自动同步公开项目，手动筛选展示
- 📊 **仪表盘** — 数据概览统计

### 技术架构

- **全栈框架** — Next.js 14 App Router (Server/Client Components)
- **样式方案** — Tailwind CSS + Framer Motion
- **数据库** — PostgreSQL + Prisma ORM 7
- **认证** — NextAuth.js v4 (JWT Session)
- **部署** — PM2 + Nginx + SSL (Let's Encrypt)

## 🚀 快速开始

### 前置要求

- Node.js 18+
- PostgreSQL 14+
- npm 10+

### 本地开发

```bash
# 克隆项目
git clone https://github.com/Uuclear/slouch-index.git
cd slouch-index

# 安装依赖
npm install

# 配置环境变量
cp .env.example .env
# 编辑 .env 填入你的数据库信息

# 运行数据库迁移
npx prisma migrate dev

# 初始化种子数据（管理员账号 + 示例内容）
npm run prisma:seed

# 启动开发服务器
npm run dev
```

打开 http://localhost:3000 查看效果。

### 默认管理员账号

| 项目 | 值 |
|------|-----|
| 邮箱 | `admin@slouch.dev` |
| 密码 | `admin123` |

⚠️ **生产环境请务必修改默认密码！**

## 📁 项目结构

```
slouch/
├── src/
│   ├── app/
│   │   ├── page.tsx                 # 首页（胶卷摄影展示）
│   │   ├── layout.tsx               # 根布局（主题 + 导航）
│   │   ├── globals.css              # 全局样式
│   │   ├── projects/                # GitHub 项目展示页
│   │   ├── blog/                    # 博客（列表 + 详情）
│   │   ├── about/                   # 关于我
│   │   ├── admin/                   # 后台管理
│   │   │   ├── layout.tsx           # 后台布局
│   │   │   ├── login/               # 登录页
│   │   │   └── (protected)/         # 受保护页面
│   │   │       ├── page.tsx         # 仪表盘
│   │   │       ├── photos/          # 作品管理
│   │   │       ├── posts/           # 文章管理
│   │   │       └── projects/        # 项目管理
│   │   ── api/                     # API 路由
│   │       ├── auth/                # NextAuth
│   │       ├── photos/              # 作品 CRUD + 上传
│   │       ├── posts/               # 文章 CRUD
│   │       ├── projects/            # 项目 CRUD
│   │       └── github/sync/         # GitHub 同步
│   ├── components/
│   │   ├── film/                    # 胶卷系列组件
│   │   │   ├── film-strip.tsx       # 胶卷条展示
│   │   │   ├── album-selector.tsx   # 相册选择器
│   │   │   └── film-perforations.tsx# 齿孔组件
│   │   ├── layout/                  # 导航 + 主题切换
│   │   ├── admin/                   # 后台侧边栏
│   │   ├── blog/                    # 博客卡片 + Markdown 渲染
│   │   └── projects/                # 项目卡片
│   └── lib/                         # 工具函数
├── prisma/
│   ├── schema.prisma                # 数据模型
│   ├── seed.ts                      # 种子数据
│   └── migrations/                  # 数据库迁移
├── nginx/
│   └── slouch.conf                  # Nginx 配置
├── ecosystem.config.js              # PM2 配置
└── docs/
    └── deployment.md                # 部署指南
```

## 🎞️ 胶卷设计还原

基于 ISO 1007 和 35mm 胶卷标准：

| 参数 | 真实尺寸 | 设计还原 |
|------|----------|----------|
| 胶卷宽度 | 34.98 mm | 自适应宽度 |
| 齿孔间距 | 4.75 mm | 16px 比例 |
| 齿孔尺寸 | 2.8 × 2.0 mm | 7 × 5 px |
| 画幅比例 | 36:24 (3:2) | 自适应 3:2 |
| 暗盒直径 | 39.4 mm | 55px |
| 暗盒高度 | 40 mm | 自适应 |

## 📖 数据库模型

### User（用户）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String (cuid) | 主键 |
| email | String | 唯一，登录邮箱 |
| password | String | bcrypt 哈希 |
| name | String? | 用户名 |
| role | String | 默认 "admin" |

### Photo（摄影作品）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String (cuid) | 主键 |
| title | String | 标题 |
| description | String? | 描述 |
| category | String | 分类（风景/人像/城市/街拍）|
| imageUrl | String | 图片地址 |
| order | Int | 排序，默认 0 |

### Post（博客文章）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String (cuid) | 主键 |
| title | String | 标题 |
| content | String | Markdown 内容 |
| slug | String | 唯一 URL 路径 |
| published | Boolean | 是否发布 |
| tags | String[] | 标签 |

### Project（GitHub 项目）
| 字段 | 类型 | 说明 |
|------|------|------|
| id | String (cuid) | 主键 |
| githubId | String? | GitHub API ID |
| name | String | 项目名 |
| description | String? | 描述 |
| language | String? | 编程语言 |
| stars | Int | Star 数 |
| featured | Boolean | 是否展示 |

## 🔧 环境变量

复制 `.env.example` 为 `.env` 并填写：

```env
# 数据库连接
DATABASE_URL="postgresql://user:password@localhost:5432/slouch"

# NextAuth 认证
NEXTAUTH_SECRET="your-random-secret-key"
NEXTAUTH_URL="http://localhost:3000"

# GitHub 项目同步
GITHUB_USERNAME="your-github-username"
GITHUB_TOKEN="your-github-personal-access-token"  # 可选，提高 API 限制

# 管理员账号
ADMIN_EMAIL="admin@your-domain.com"
ADMIN_PASSWORD="your-strong-password"
```

## 🌐 生产部署

详见 [docs/deployment.md](docs/deployment.md)，核心步骤：

```bash
# 1. 克隆并安装
git clone <repo-url> /var/www/slouch
cd /var/www/slouch
npm install

# 2. 配置数据库和迁移
npx prisma migrate deploy
npm run prisma:seed

# 3. 构建并启动
npm run build
pm2 start ecosystem.config.js

# 4. 配置 Nginx + SSL
sudo cp nginx/slouch.conf /etc/nginx/sites-available/slouch
sudo certbot --nginx -d your-domain.com
```

## 📝 脚本命令

| 命令 | 说明 |
|------|------|
| `npm run dev` | 启动开发服务器 |
| `npm run build` | 生产构建 |
| `npm run start` | 启动生产服务（端口 3000）|
| `npm run lint` | ESLint 检查 |
| `npm run prisma:seed` | 运行种子数据 |
| `npx prisma migrate dev` | 开发数据库迁移 |
| `npx prisma migrate deploy` | 生产数据库迁移 |

## 📄 许可证

MIT License

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

1. Fork 本项目
2. 创建特性分支 (`git checkout -b feature/your-feature`)
3. 提交更改 (`git commit -m 'feat: add your feature'`)
4. 推送到分支 (`git push origin feature/your-feature`)
5. 开启 Pull Request
