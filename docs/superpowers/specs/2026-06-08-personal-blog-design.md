# 个人博客系统设计文档

**日期**: 2026-06-08
**版本**: 1.0
**作者**: Claude + 用户协作设计

---

## 1. 项目概述

### 1.1 背景
开发一个个人博客页面，用于展示摄影作品、GitHub项目、博客内容以及社交平台链接。系统包含简洁优美的前端展示页面和后台管理页面。

### 1.2 目标
- 打造一个极简主义风格的个人博客
- 以内容为中心，突出摄影作品展示
- 提供便捷的后台管理功能
- 支持主题切换（浅色/深色）

---

## 2. 设计风格

### 2.1 视觉风格
- **极简主义**: 大量留白，干净线条，专注内容本身
- **少文字/图标**: 尽量减少文字和图标的使用
- **内容为中心**: 图片和作品是主角
- **微交互效果**:
  - hover 时卡片上浮 8px
  - 阴影增强 2x
  - 图片微放大 5%
  - 过渡时间 0.3s

### 2.2 主题系统
- **浅色主题**: #fafafa 背景，适合明亮环境
- **深色主题**: #0a0a0a 背景，沉浸式体验
- **无闪烁过渡**: 切换时平滑过渡
- **保存用户偏好**: 本地存储主题选择
- **支持系统跟随**: 可跟随系统主题设置

---

## 3. 前端页面设计

### 3.1 导航结构
- **多页面导航式**: 独立页面分类
- **图标导航**: 右上角 4 个 32x32 带背景图片的图标，无文字标签
  - 作品 → 相机/镜头图案
  - 项目 → 代码/窗口图案
  - 博客 → 书本/笔图案
  - 关于 → 人物/头像图案
- **交互**: hover 时背景图片微放大

### 3.2 首页设计（摄影作品展示）

#### 3.2.1 相册选择器
- **胶卷盒样式**: 真实比例圆形金属质感
  - 直径: 39.4mm（设计尺寸 40px）
  - 高度: 40mm（设计尺寸 40px）
  - 比例接近 1:1（圆形）
  - 中心轴孔设计
  - 底部凸起模拟盒盖
- **分类标签**: 风景、人像、城市、街拍等
- **选中态**: 边框变亮，阴影增强

#### 3.2.2 胶卷风格图片展示
- **真实比例齿孔**:
  - 齿孔间距: 4.75mm（设计尺寸 7px）
  - 齿孔尺寸: 2.8mm × 2.0mm（设计尺寸 7px × 5px）
  - 从头到尾都有齿孔
  - 片头: 单排齿孔（只有一侧）
  - 主体: 双排齿孔（两侧都有）
- **图片布局**:
  - 中心大图: 380×253px（3:2 画幅比例）
  - 两侧只露出少许边缘（半透明，opacity 0.25）
- **胶卷底片效果**:
  - 深色边框 #1a1a1a
  - 图片区域 #2a2a2a
  - 白色齿孔在黑色底上
- **滑动交互**:
  - 无可见箭头（极简设计）
  - 点击左侧区域 → 向左滑动
  - 点击右侧区域 → 向右滑动
  - 支持鼠标拖拽 / 触屏滑动

### 3.3 其他页面概要

#### 3.3.1 GitHub项目页
- 项目卡片列表
- 自动同步 + 手动筛选展示
- 显示项目名称、描述、链接、技术栈

#### 3.3.2 博客页
- 博客文章列表
- 支持分类和标签
- Markdown 渲染

#### 3.3.3 关于我页
- 个人简介
- 技能展示
- 社交平台链接（图标形式）

---

## 4. 后台管理页面设计

### 4.1 功能模块
- **摄影作品管理**: 上传图片、添加描述、分类管理
- **博客文章管理**: 撰写、编辑、发布 Markdown 文章
- **GitHub项目同步**: 自动获取公开项目 + 手动筛选编辑
- **用户认证**: 登录保护（NextAuth.js）
- **系统设置**: 主题配置、站点信息

### 4.2 界面风格
- 简洁实用，与前端风格统一
- 左侧导航栏 + 右侧内容区
- 支持主题切换

---

## 5. 技术架构

### 5.1 前端技术栈
- **框架**: Next.js 14 (App Router)
- **样式**: Tailwind CSS
- **动画**: Framer Motion
- **主题**: next-themes
- **状态**: React Context / Zustand

### 5.2 后端技术栈
- **API**: Next.js API Routes
- **ORM**: Prisma
- **认证**: NextAuth.js
- **数据库**: PostgreSQL

### 5.3 数据库设计

#### 表结构
```sql
-- 用户表
users (
  id          UUID PRIMARY KEY,
  email       VARCHAR UNIQUE,
  password    VARCHAR,
  name        VARCHAR,
  role        VARCHAR DEFAULT 'admin',
  created_at  TIMESTAMP,
  updated_at  TIMESTAMP
)

-- 摄影作品表
photos (
  id          UUID PRIMARY KEY,
  title       VARCHAR,
  description TEXT,
  category    VARCHAR, -- 风景、人像、城市、街拍
  image_url   VARCHAR,
  order       INTEGER,
  created_at  TIMESTAMP,
  updated_at  TIMESTAMP
)

-- 博客文章表
posts (
  id          UUID PRIMARY KEY,
  title       VARCHAR,
  content     TEXT, -- Markdown
  excerpt     TEXT,
  slug        VARCHAR UNIQUE,
  published   BOOLEAN DEFAULT false,
  tags        VARCHAR[],
  created_at  TIMESTAMP,
  updated_at  TIMESTAMP,
  published_at TIMESTAMP
)

-- GitHub项目表
projects (
  id          UUID PRIMARY KEY,
  github_id   VARCHAR,
  name        VARCHAR,
  description TEXT,
  url         VARCHAR,
  language    VARCHAR,
  stars       INTEGER,
  featured    BOOLEAN DEFAULT false, -- 是否展示
  created_at  TIMESTAMP,
  updated_at  TIMESTAMP
)
```

### 5.4 部署架构（云服务器自建）
```
┌─────────────────────────────────────────────┐
│           Nginx 反向代理 + SSL               │
├─────────────────────────────────────────────┤
│           Next.js Server (PM2)              │
├─────────────────────────────────────────────┤
│           PostgreSQL 数据库                 │
├─────────────────────────────────────────────┤
│           图片存储 (本地/OSS)               │
└─────────────────────────────────────────────┘
```

**服务器环境**:
- Node.js 18+
- PM2 进程守护
- Nginx 反向代理 + HTTPS (SSL)
- PostgreSQL 数据库
- 图片存储: 本地文件系统或阿里云 OSS

---

## 6. 外部服务集成

### 6.1 GitHub API
- 自动获取用户公开项目列表
- 同步项目名称、描述、语言、star 数
- 定时同步（每日一次）

### 6.2 图片存储
- 摄影作品图片存储
- 支持 JPG、PNG、WebP 格式
- 自动压缩和优化

---

## 7. 开发计划

### Phase 1: 基础架构搭建
- Next.js 项目初始化
- Tailwind CSS 配置
- PostgreSQL + Prisma 设置
- 基础路由和布局

### Phase 2: 前端页面开发
- 首页胶卷风格展示
- 导航和主题切换
- GitHub项目页
- 博客页
- 关于我页

### Phase 3: 后台管理开发
- 用户认证系统
- 摄影作品管理
- 博客文章管理
- GitHub项目同步

### Phase 4: 部署和测试
- 云服务器环境配置
- Nginx + PM2 设置
- SSL 配置
- 功能测试

---

## 8. 验收标准

### 8.1 功能验收
- [ ] 首页胶卷风格图片展示正常
- [ ] 相册切换功能正常
- [ ] 图片滑动交互正常（点击 + 拖拽）
- [ ] 主题切换无闪烁
- [ ] GitHub项目自动同步
- [ ] 博客文章 CRUD 正常
- [ ] 后台管理登录认证正常

### 8.2 性能验收
- [ ] 首页加载时间 < 3s
- [ ] 图片懒加载正常
- [ ] 动画流畅无卡顿

### 8.3 部署验收
- [ ] HTTPS 正常工作
- [ ] PM2 进程守护正常
- [ ] 数据库连接正常

---

## 9. 参考资料

- ISO 1007:2000 - 135胶卷标准
- JB/T 8253-1999 - 135胶卷暗盒技术要求
- [35毫米胶片 - 维基百科](https://zh.wikipedia.org/zh-cn/35毫米胶片)
- [Film perforations - Wikipedia](https://en.wikipedia.org/wiki/Film_perforations)