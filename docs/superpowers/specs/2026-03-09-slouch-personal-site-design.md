# Slouch 个人网站设计文档

**日期:** 2026-03-09
**域名:** film.slouch.top
**部署:** Debian VPS + Nginx + acme.sh

---

## 1. 概述

个人社交主页网站，集博客、摄影作品展示、实用工具和外链导航于一体的综合性个人站点。

### 1.1 功能范围
- 个人主页：展示社交媒体链接
- 博客系统：分类/标签、目录导航、无评论
- 摄影画廊：瀑布流展示、专辑分类、EXIF 信息
- 实用工具：天气查询（后续可扩展）
- 外链导航：精选链接集合

### 1.2 非功能需求
- 深色电影风格设计
- 响应式布局
- SEO 友好
- 本地 VPS 部署，Nginx 反向代理
- Cloudflare DNS + acme.sh 自动 SSL 证书

---

## 2. 技术架构

### 2.1 技术栈
```
┌─────────────────────────────────────┐
│         Cloudflare DNS/CDN          │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│   acme.sh (自动 SSL 证书管理)         │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│            Nginx 反向代理            │
│      film.slouch.top :443 → :3000   │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│        Next.js 14 (Node.js)         │
│    SSR + SSG 混合渲染模式             │
└─────────────────┬───────────────────┘
                  │
┌─────────────────▼───────────────────┐
│      本地文件系统 (Markdown/图片)    │
└─────────────────────────────────────┘
```

### 2.2 目录结构
```
/opt/slouch-index/
├── src/
│   ├── app/
│   │   ├── layout.tsx          # 根布局（深色主题）
│   │   ├── page.tsx            # 首页
│   │   ├── blog/
│   │   │   ├── page.tsx        # 博客列表
│   │   │   └── [slug]/
│   │   │       └── page.tsx    # 文章详情
│   │   ├── gallery/
│   │   │   ├── page.tsx        # 画廊首页
│   │   │   └── [album]/
│   │   │       └── page.tsx    # 专辑详情
│   │   ├── tools/
│   │   │   ├── page.tsx        # 工具导航
│   │   │   └── weather/
│   │   │       └── page.tsx    # 天气查询
│   │   └── links/
│   │       └── page.tsx        # 外链导航
│   ├── components/
│   │   ├── ui/                 # 基础 UI 组件
│   │   ├── layout/             # 布局组件
│   │   ├── blog/               # 博客相关组件
│   │   └── gallery/            # 画廊组件
│   ├── lib/
│   │   ├── blog.ts             # 博客数据层
│   │   ├── gallery.ts          # 画廊数据层
│   │   └── exif.ts             # EXIF 解析工具
│   └── styles/
│       └── globals.css         # 全局样式
├── content/
│   ├── blog/                   # Markdown 文章
│   └── gallery/                # 摄影作品
│       └── [album]/
│           ├── images/
│           └── metadata.json
├── public/                     # 静态资源
├── docs/
│   └── superpowers/specs/
├── package.json
├── next.config.js
├── tailwind.config.js
└── tsconfig.json
```

---

## 3. 功能模块设计

### 3.1 首页 (`/`)
- 电影风格深色主题
- 个人介绍卡片
- 社交媒体链接：
  - Instagram: @uniq_slouch
  - GitHub: https://github.com/Uuclear
  - QQ 空间：382563984
- 快速导航到各功能模块

### 3.2 博客系统 (`/blog`)
**数据层:**
- Markdown 文件存储于 `content/blog/`
- Frontmatter 元数据：title, date, category, tags, draft

**功能:**
- 文章列表（按时间倒序）
- 分类筛选
- 标签云
- 文章内目录大纲（根据 H2/H3 生成）
- 支持 MDX 语法（后续扩展）

### 3.3 摄影画廊 (`/gallery`)
**数据层:**
- 图片存储于 `content/gallery/[album]/images/`
- 专辑元数据：`metadata.json` (album name, description, cover)
- 图片元数据：从 EXIF 自动读取

**功能:**
- 专辑列表页
- 专辑详情页（瀑布流展示）
- 图片灯箱效果
- EXIF 信息展示（相机、光圈、快门、ISO 等）

### 3.4 实用工具 (`/tools`)
**天气查询 (`/tools/weather`):**
- 使用 wttr.in 免费 API（无需 API Key）
- 显示当前天气、预报
- 简洁的命令行风格 UI

**扩展性:**
- 工具注册机制
- 后续可添加更多工具

### 3.5 外链导航 (`/links`)
- 简洁链接列表
- 初始链接：fuliba2023.net
- 支持通过配置文件添加

---

## 4. 设计风格

### 4.1 色彩方案
```css
/* 深色电影风格 */
--background: #0a0a0f;
--surface: #12121a;
--surface-highlight: #1e1e2a;
--text-primary: #e0e0e0;
--text-secondary: #a0a0a0;
--accent: #7c3aed;  /* 紫色强调 */
--accent-glow: rgba(124, 58, 237, 0.3);
```

### 4.2 字体
- 标题：系统默认无衬线字体
- 正文：系统默认无衬线字体
- 代码：monospace

### 4.3 视觉元素
- 微妙的发光效果
- 渐变边框
- 平滑过渡动画
- 胶片质感纹理（可选）

---

## 5. 部署架构

### 5.1 Nginx 配置
```nginx
server {
    listen 80;
    server_name film.slouch.top;
    return 301 https://$server_name$request_uri;
}

server {
    listen 443 ssl http2;
    server_name film.slouch.top;

    ssl_certificate /etc/ssl/certs/film.slouch.top/fullchain.pem;
    ssl_certificate_key /etc/ssl/certs/film.slouch.top/privkey.pem;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 5.2 SSL 证书 (acme.sh)
```bash
# 使用 Cloudflare DNS 验证
acme.sh --issue --dns dns_cf -d film.slouch.top
acme.sh --install-cert -d film.slouch.top \
  --cert-file /etc/ssl/certs/film.slouch.top/cert.pem \
  --key-file /etc/ssl/certs/film.slouch.top/privkey.pem \
  --fullchain-file /etc/ssl/certs/film.slouch.top/fullchain.pem
```

### 5.3 Next.js 服务
- 使用 PM2 管理 Node.js 进程
- 生产环境构建：`npm run build && npm run start`
- 监听端口：3000

---

## 6. GitHub 部署

### 6.1 生成 Personal Access Token
1. 访问 https://github.com/settings/tokens
2. 选择 "Generate new token (classic)"
3. 勾选权限：`repo` (Full control of private repositories)
4. 生成并保存 Token

### 6.2 推送命令
```bash
cd /opt/slouch-index
git init
git remote add origin https://Uuclear:<TOKEN>@github.com/Uuclear/slouch-index.git
git add .
git commit -m "Initial commit: Slouch personal site"
git push -u origin main
```

---

## 7. 实施计划

1. 初始化 Next.js 项目
2. 实现核心页面和组件
3. 配置 Nginx 反向代理
4. 配置 acme.sh SSL 证书
5. 推送代码到 GitHub
6. 创建示例内容

---

## 8. 待确认事项

- [ ] GitHub Personal Access Token 生成
- [ ] Cloudflare DNS 解析设置 (A 记录指向服务器 IP)
- [ ] 示例博客文章内容
- [ ] 示例摄影专辑结构
