# 实用工具开发指南

本文档说明如何为网站添加更多实用工具。

## 可用的后端技术栈

### 1. Node.js / TypeScript（推荐）
**当前项目使用的技术栈**

- **优势**：
  - 与现有项目技术栈一致
  - 可以直接在 Next.js API Routes 中编写后端逻辑
  - 丰富的 npm 生态系统
  - 前后端代码复用

- **适用场景**：
  - RESTful API
  - 实时数据处理
  - 文件处理
  - 第三方 API 集成

- **示例位置**：`src/app/tools/weather/page.tsx`

### 2. Python
**适合数据科学、AI 相关工具**

- **优势**：
  - 强大的数据处理库（pandas, numpy）
  - AI/ML 框架支持（TensorFlow, PyTorch）
  - 简洁的语法

- **部署方式**：
  ```bash
  # 1. 安装 Python 和依赖
  apt-get install python3 python3-pip

  # 2. 创建 Flask/FastAPI 应用
  pip3 install fastapi uvicorn

  # 3. 运行在独立端口（如 8001）
  uvicorn main:app --host 0.0.0.0 --port 8001

  # 4. 配置 Nginx 反向代理
  # 在 /etc/nginx/sites-available/film.slouch.top 添加：
  # location /api/python/ {
  #     proxy_pass http://localhost:8001;
  # }
  ```

### 3. Go
**适合高性能、并发场景**

- **优势**：
  - 编译型语言，性能优秀
  - 内置并发支持
  - 单一二进制文件部署简单

- **部署方式**：
  ```bash
  # 1. 安装 Go
  apt-get install golang-go

  # 2. 编译并运行
  go build -o tool-server main.go
  ./tool-server  # 运行在独立端口

  # 3. 使用 PM2 管理
  pm2 start tool-server --name "go-tool"
  ```

### 4. Rust
**适合系统级、高安全性工具**

- **优势**：
  - 内存安全
  - 性能极佳
  - 适合 cryptographic 相关工具

### 5. Java / Kotlin
**适合企业级应用**

- **优势**：
  - 成熟的生态系统
  - Spring Boot 框架支持
  - 跨平台

## 在 Next.js 中添加新工具

### 方法一：纯前端工具（推荐简单工具）

适用于：计算器、格式转换、查询类工具

1. 创建新页面：
```bash
mkdir -p src/app/tools/[工具名称]
```

2. 创建 `page.tsx`：
```tsx
'use client';

import { useState } from 'react';

export default function ToolPage() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState('');

  const handleProcess = () => {
    // 处理逻辑
    setResult(input.toUpperCase());
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-accent text-center">工具名称</h1>

      <div className="space-y-4">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="输入..."
          className="w-full bg-surface border border-surfaceHighlight rounded-lg px-4 py-3 text-textPrimary"
        />
        <button
          onClick={handleProcess}
          className="w-full bg-accent hover:bg-accent/80 text-white px-6 py-3 rounded-lg"
        >
          处理
        </button>
        {result && (
          <div className="bg-surface border border-surfaceHighlight rounded-lg p-4">
            <p>结果：{result}</p>
          </div>
        )}
      </div>
    </div>
  );
}
```

### 方法二：使用 Next.js API Routes

适用于：需要后端处理的工具

1. 创建 API 路由 `src/app/api/tools/[工具名称]/route.ts`：
```typescript
import { NextResponse } from 'next/server';

export async function POST(request: Request) {
  const data = await request.json();

  // 处理逻辑
  const result = { success: true, data };

  return NextResponse.json(result);
}
```

2. 在前端页面调用：
```tsx
const response = await fetch('/api/tools/[工具名称]', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ input: 'data' }),
});
const result = await response.json();
```

### 方法三：独立后端服务

适用于：复杂工具、需要特定语言的场景

1. 在 `/opt/slouch-index/tools/` 目录下创建独立服务

2. 配置 Nginx 反向代理（编辑 `/etc/nginx/sites-available/film.slouch.top`）：
```nginx
# Python 工具示例
location /api/python/ {
    proxy_pass http://localhost:8001;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}

# Go 工具示例
location /api/go/ {
    proxy_pass http://localhost:8002;
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
}
```

3. 重新加载 Nginx：
```bash
nginx -t && systemctl reload nginx
```

## 工具示例

### 示例 1：IP 地址查询工具

```tsx
'use client';

import { useState } from 'react';

export default function IPTool() {
  const [ipInfo, setIpInfo] = useState<any>(null);

  const lookupIP = async () => {
    const res = await fetch('https://ipapi.co/json/');
    const data = await res.json();
    setIpInfo(data);
  };

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-accent text-center">🌐 IP 地址查询</h1>
      <button onClick={lookupIP} className="w-full bg-accent text-white py-3 rounded-lg">
        查询我的 IP
      </button>
      {ipInfo && (
        <div className="mt-6 bg-surface p-6 rounded-lg">
          <p>IP: {ipInfo.ip}</p>
          <p>城市：{ipInfo.city}</p>
          <p>国家：{ipInfo.country_name}</p>
          <p>ISP: {ipInfo.org}</p>
        </div>
      )}
    </div>
  );
}
```

### 示例 2：Base64 编解码工具

```tsx
'use client';

import { useState } from 'react';

export default function Base64Tool() {
  const [input, setInput] = useState('');
  const [output, setOutput] = useState('');

  const encode = () => setOutput(btoa(input));
  const decode = () => setOutput(atob(input));

  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-accent text-center">Base64 编解码</h1>
      <textarea
        value={input}
        onChange={(e) => setInput(e.target.value)}
        className="w-full bg-surface border border-surfaceHighlight rounded-lg p-4 text-textPrimary"
        rows={4}
      />
      <div className="flex gap-4 mt-4">
        <button onClick={encode} className="flex-1 bg-accent text-white py-3 rounded-lg">
          编码
        </button>
        <button onClick={decode} className="flex-1 bg-accent text-white py-3 rounded-lg">
          解码
        </button>
      </div>
      {output && (
        <textarea
          value={output}
          readOnly
          className="w-full bg-surface border border-surfaceHighlight rounded-lg p-4 mt-4"
          rows={4}
        />
      )}
    </div>
  );
}
```

## 更新工具导航页面

添加新工具后，更新 `src/app/tools/page.tsx`：

```tsx
const tools = [
  {
    title: '天气查询',
    description: '查看实时天气预报',
    href: '/tools/weather',
    icon: '🌤️',
  },
  // 添加新工具
  {
    title: 'IP 查询',
    description: '查询 IP 地址信息',
    href: '/tools/ip',
    icon: '🌐',
  },
];
```

## 部署新工具

```bash
# 1. 构建项目
cd /opt/slouch-index
npm run build

# 2. 重启应用
pm2 restart slouch-site

# 3. 验证
pm2 logs slouch-site
```

## 推荐工具创意

1. **二维码生成器** - 生成二维码图片
2. **密码生成器** - 生成随机强密码
3. **时间戳转换** - Unix 时间戳与日期互转
4. **JSON 格式化** - 美化/压缩 JSON
5. **颜色选择器** - 取色/颜色转换工具
6. **字数统计** - 文本字数、阅读时间计算
7. **短链接生成** - 调用第三方 API 生成短链
8. **汇率转换器** - 实时汇率查询转换
