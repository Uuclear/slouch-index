# SLŌUCH 个人网站

一个基于 Next.js 构建的个人社交主页网站，集博客、摄影作品展示、实用工具和外链导航于一体。

**在线访问：** [https://film.slouch.top](https://film.slouch.top)

---

## 目录

- [功能特性](#功能特性)
- [技术栈](#技术栈)
- [项目结构](#项目结构)
- [本地开发](#本地开发)
- [部署指南](#部署指南)
- [内容管理](#内容管理)
- [功能扩展](#功能扩展)
- [迁移指南](#迁移指南)
- [常见问题](#常见问题)

---

## 功能特性

### 核心功能
- **个人主页** - 展示社交媒体链接和个人介绍
- **博客系统** - 支持分类、标签、目录大纲导航
- **摄影画廊** - 瀑布流展示、专辑分类、EXIF 信息显示
- **实用工具** - 可扩展的工具集合（天气查询、IP 查询等）
- **外链导航** - 精选链接收集

### 社交媒体集成
- Instagram
- GitHub
- QQ 空间
- 哔哩哔哩

### 设计特点
- 深色电影风格主题
- 响应式布局（支持移动端）
- 平滑动画过渡
- 胶片质感视觉效果

---

## 技术栈

| 类别 | 技术 |
|------|------|
| 前端框架 | Next.js 14 (App Router) |
| 编程语言 | TypeScript |
| 样式框架 | Tailwind CSS |
| 部署平台 | Linux VPS (Debian) |
| Web 服务器 | Nginx |
| SSL 证书 | Let's Encrypt + acme.sh |
| 进程管理 | PM2 |
| 域名解析 | Cloudflare |

---

## 项目结构

```
/opt/slouch-index/
├── src/
│   ├── app/                      # Next.js App Router 页面
│   │   ├── layout.tsx            # 根布局（导航栏、页脚）
│   │   ├── page.tsx              # 首页
│   │   ├── blog/
│   │   │   ├── page.tsx          # 博客列表页
│   │   │   └── [slug]/
│   │   │       └── page.tsx      # 文章详情页
│   │   ├── gallery/
│   │   │   ├── page.tsx          # 画廊首页
│   │   │   └── [album]/
│   │   │       ├── page.tsx      # 专辑详情页
│   │   │       └── AlbumView.tsx # 相册展示组件
│   │   ├── tools/
│   │   │   ├── page.tsx          # 工具导航页
│   │   │   └── weather/
│   │   │       └── page.tsx      # 天气查询工具
│   │   └── links/
│   │       └── page.tsx          # 外链导航页
│   ├── components/               # React 组件
│   │   ├── layout/               # 布局组件
│   │   │   ├── Navbar.tsx        # 导航栏
│   │   │   └── Footer.tsx        # 页脚
│   │   ├── blog/                 # 博客组件
│   │   │   └── TableOfContents.tsx
│   │   └── gallery/              # 画廊组件
│   ├── lib/                      # 工具函数库
│   │   ├── blog.ts               # 博客数据处理
│   │   └── gallery.ts            # 画廊数据处理
│   └── styles/
│       └── globals.css           # 全局样式
├── content/                      # 内容目录
│   ├── blog/                     # 博客文章 (Markdown)
│   │   └── welcome.md            # 示例文章
│   └── gallery/                  # 摄影作品
│       └── [album]/              # 专辑目录
│           ├── images/           # 图片文件
│           └── metadata.json     # 专辑元数据
├── docs/                         # 文档目录
│   ├── superpowers/specs/        # 设计文档
│   └── tools-development-guide.md # 工具开发指南
├── public/                       # 静态资源
├── package.json
├── next.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

---

## 本地开发

### 环境要求
- Node.js 18+
- npm / yarn / pnpm

### 安装步骤

```bash
# 1. 克隆仓库
git clone https://github.com/Uuclear/slouch-index.git
cd slouch-index

# 2. 安装依赖
npm install

# 3. 启动开发服务器
npm run dev

# 4. 访问 http://localhost:3000
```

### 开发命令

```bash
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
npm run lint         # 运行 ESLint 检查
```

---

## 部署指南

### 服务器要求
- Debian/Ubuntu Linux
- 至少 512MB 内存
- 开放端口：80, 443

### 一键部署脚本

```bash
# 1. 安装 Node.js (如未安装)
curl -fsSL https://deb.nodesource.com/setup_20.x | bash -
apt-get install -y nodejs

# 2. 克隆项目
git clone https://github.com/Uuclear/slouch-index.git /opt/slouch-index
cd /opt/slouch-index

# 3. 安装依赖
npm install

# 4. 构建项目
npm run build

# 5. 安装 PM2
npm install -g pm2

# 6. 启动应用
pm2 start npm --name "slouch-site" -- start
pm2 save
pm2 startup

# 7. 执行输出的命令以设置开机自启
```

### Nginx 配置

```bash
# 1. 安装 Nginx
apt-get install -y nginx

# 2. 创建配置文件
cat > /etc/nginx/sites-available/film.slouch.top << 'EOF'
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

    ssl_protocols TLSv1.2 TLSv1.3;
    ssl_prefer_server_ciphers on;

    location / {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_cache_bypass $http_upgrade;
    }
}
EOF

# 3. 启用配置
ln -sf /etc/nginx/sites-available/film.slouch.top /etc/nginx/sites-enabled/
rm -f /etc/nginx/sites-enabled/default
nginx -t && systemctl reload nginx
```

### SSL 证书配置

```bash
# 1. 安装 acme.sh
curl https://get.acme.sh | sh

# 2. 注册账户
/root/.acme.sh/acme.sh --register-account -m your@email.com

# 3. 设置 Cloudflare API Token
export CF_Token="your_cloudflare_api_token"

# 4. 申请证书
/root/.acme.sh/acme.sh --issue --dns dns_cf -d film.slouch.top

# 5. 安装证书
/root/.acme.sh/acme.sh --install-cert -d film.slouch.top --ecc \
  --cert-file /etc/ssl/certs/film.slouch.top/cert.pem \
  --key-file /etc/ssl/certs/film.slouch.top/privkey.pem \
  --fullchain-file /etc/ssl/certs/film.slouch.top/fullchain.pem

# 6. 重载 Nginx
systemctl reload nginx
```

---

## 内容管理

### 添加博客文章

1. 在 `content/blog/` 目录下创建新的 Markdown 文件：

```markdown
---
title: '文章标题'
date: '2026-03-09'
category: '技术'
tags: ['Next.js', 'React']
description: '文章简介'
---

## 章节标题

这里是文章内容...

### 子标题

更多内容...
```

2. 文章会自动出现在博客列表页，按日期倒序排列。

### 添加摄影专辑

1. 创建专辑目录结构：

```bash
mkdir -p /opt/slouch-index/content/gallery/my-album/images
```

2. 创建元数据文件 `metadata.json`：

```json
{
  "title": "我的专辑",
  "description": "专辑描述",
  "cover": "cover.jpg",
  "dateCreated": "2026-03-09"
}
```

3. 将照片放入 `images/` 目录。

4. （可选）为照片添加 EXIF 信息文件 `xxx.json`：

```json
{
  "camera": "Fujifilm X-T4",
  "lens": "XF 35mm F1.4",
  "aperture": "f/1.4",
  "shutterSpeed": "1/250",
  "iso": "400",
  "focalLength": "35mm",
  "dateTaken": "2026-03-09"
}
```

### 添加工具

1. 创建工具页面 `src/app/tools/[工具名]/page.tsx`

2. 更新工具导航 `src/app/tools/page.tsx`

详细指南见 [工具开发指南](docs/tools-development-guide.md)

### 添加外链

编辑 `src/app/links/page.tsx`：

```tsx
const links = [
  {
    title: '网站名称',
    url: 'https://example.com',
    description: '网站描述',
  },
  // 添加更多...
];
```

### 添加社交媒体链接

编辑 `src/app/page.tsx`，修改 `socialLinks` 数组：

```tsx
const socialLinks = [
  {
    name: '新平台',
    url: 'https://...',
    username: '用户名',
    description: '描述',
    avatar: '头像 URL',
    avatarFallback: '备用头像 URL',
  },
];
```

---

## 功能扩展

### 添加新页面

1. 在 `src/app/` 下创建新目录和 `page.tsx`

2. 在导航栏 `src/components/layout/Navbar.tsx` 添加链接

### 修改主题样式

编辑 `src/app/globals.css` 和 `tailwind.config.ts`：

```ts
// tailwind.config.ts
theme: {
  extend: {
    colors: {
      background: '#0a0a0f',    // 背景色
      surface: '#12121a',       // 卡片背景
      accent: '#7c3aed',        // 强调色
      // ...
    },
  },
}
```

### 添加 API 端点

创建 `src/app/api/[接口名]/route.ts`：

```typescript
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ data: 'Hello' });
}
```

---

## 迁移指南

### 从其他平台迁移

#### 导入博客文章

编写脚本将现有文章转换为 Markdown 格式：

```bash
# 示例：WordPress 导出
# 1. 从 WordPress 导出 XML
# 2. 使用 wp2md 等工具转换
# 3. 手动调整 frontmatter 格式
```

#### 迁移照片

```bash
# 将照片复制到画廊目录
cp -r /path/to/photos/* /opt/slouch-index/content/gallery/imported/images/
```

### 部署到新服务器

```bash
# 1. 打包项目
cd /opt/slouch-index
tar -czf slouch-site.tar.gz .

# 2. 传输到新服务器
scp slouch-site.tar.gz user@new-server:/opt/

# 3. 解压并部署
ssh user@new-server
cd /opt
mkdir slouch-index
tar -xzf slouch-site.tar.gz -C slouch-index
cd slouch-index
npm install
npm run build
pm2 restart slouch-site
```

### 数据备份

```bash
# 备份内容目录
tar -czf content-backup-$(date +%Y%m%d).tar.gz content/

# 备份数据库（如有）
# mysqldump 或 pg_dump

# 备份 SSL 证书
cp -r /etc/ssl/certs/film.slouch.top /backup/
cp -r /root/.acme.sh /backup/
```

---

## 常见问题

### 应用无法启动

```bash
# 检查 PM2 状态
pm2 status

# 查看日志
pm2 logs slouch-site

# 重启应用
pm2 restart slouch-site
```

### SSL 证书过期

```bash
# acme.sh 会自动续期，手动续期：
/root/.acme.sh/acme.sh --renew -d film.slouch.top

# 重载 Nginx
systemctl reload nginx
```

### 构建失败

```bash
# 清理缓存
rm -rf node_modules .next
npm install
npm run build
```

### 图片不显示

- 检查图片路径是否正确
- 确保图片在 `public/images/` 或 `content/gallery/` 目录下
- 检查文件权限 `chmod 644 image.jpg`

---

## 相关文档

- [工具开发指南](docs/tools-development-guide.md)
- [设计文档](docs/superpowers/specs/2026-03-09-slouch-personal-site-design.md)
- [Next.js 官方文档](https://nextjs.org/docs)
- [Tailwind CSS 文档](https://tailwindcss.com/docs)

---

## 许可证

MIT License

---

## 联系方式

- 网站：https://film.slouch.top
- GitHub：https://github.com/Uuclear
- Email：382563984@qq.com
