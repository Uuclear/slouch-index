# 文档扫描工具设计文档

**日期:** 2026-03-12
**工具路径:** `/tools/scanner`
**依赖库:** OpenCV.js, @zxing/library

---

## 1. 概述

为个人网站添加文档扫描工具，支持调用电脑或手机摄像头进行文档扫描、拍照保存，并自动解析文档中的二维码。

### 1.1 功能范围
- 调用设备摄像头（前置/后置可选）
- 实时摄像头预览
- 拍照并自动检测文档边缘
- 透视校正（将倾斜文档拉正）
- 图像增强（去阴影、对比度优化）
- 保存处理后的图片到服务器
- 自动解析图片中的二维码
- 保存二维码数据到 JSON 文件
- 将二维码信息写入图片 EXIF 元数据

### 1.2 非功能需求
- 响应式设计，支持移动端和桌面端
- 图像处理在客户端完成（减少服务器负载）
- 文件按日期分类存储
- 本地开发使用本地 OpenCV.js，生产环境使用 CDN

---

## 2. 技术架构

### 2.1 架构图
```
┌─────────────────────────────────────────────────────────┐
│                    用户浏览器                            │
│  ┌─────────────┐  ┌──────────────┐  ┌───────────────┐  │
│  │   摄像头    │→ │  预览界面    │  │  OpenCV.js    │  │
│  │  getUserMedia│  │  React 组件   │  │  图像处理     │  │
│  └─────────────┘  └──────────────┘  └───────────────┘  │
│                          │                   │          │
│                          ▼                   ▼          │
│                   ┌──────────────────────────┐         │
│                   │     @zxing/library       │         │
│                   │     二维码解析           │         │
│                   └──────────────────────────┘         │
└─────────────────────────────────────────────────────────┘
                          │
                          │ FormData (图片 Blob)
                          ▼
┌─────────────────────────────────────────────────────────┐
│              Next.js API Routes (后端)                   │
│  ┌──────────────────┐  ┌─────────────────────────────┐  │
│  │  /api/scanner/save│  │  /api/scanner/parse-qr      │  │
│  │  - 接收图片       │  │  - 解析二维码               │  │
│  │  - 按日期分类保存 │  │  - 返回解析结果             │  │
│  │  - 生成 JSON 文件  │  │                             │  │
│  └──────────────────┘  └─────────────────────────────┘  │
│                          │                               │
│                          ▼                               │
│  ┌─────────────────────────────────────────────────────┐│
│  │              src/lib/scanner/exif.ts                ││
│  │              - 将二维码信息写入图片 EXIF             ││
│  └─────────────────────────────────────────────────────┘│
└─────────────────────────────────────────────────────────┘
                          │
                          ▼
┌─────────────────────────────────────────────────────────┐
│                  文件系统存储                            │
│  /opt/slouch-index/public/scans/                        │
│  ├── 2026-03-12/                                        │
│  │   ├── scan_001.jpg                                   │
│  │   ├── scan_001.json                                  │
│  │   └── scan_002.jpg                                   │
│  └── 2026-03-13/                                        │
│      └── ...                                            │
└─────────────────────────────────────────────────────────┘
```

### 2.2 目录结构
```
src/
├── app/
│   ├── tools/
│   │   ├── page.tsx              # 工具导航页（更新）
│   │   └── scanner/
│   │       ├── page.tsx          # 扫描工具主页面
│   │       └── layout.tsx        # 扫描工具布局
├── components/
│   └── scanner/
│       ├── Scanner.tsx           # 核心扫描组件
│       ├── CameraPreview.tsx     # 摄像头预览
│       ├── ImageEditor.tsx       # 图像处理界面
│       └── ScanResult.tsx        # 扫描结果展示
├── lib/
│   └── scanner/
│       ├── exif.ts               # EXIF 写入工具
│       └── image-processing.ts   # 图像处理辅助函数
└── app/
    └── api/
        └── scanner/
            ├── save/
            │   └── route.ts      # 保存图片 API
            └── parse-qr/
                └── route.ts      # 二维码解析 API

public/
└── scans/                        # 扫描文件存储目录
    └── .gitkeep
```

---

## 3. 功能模块设计

### 3.1 摄像头调用模块

**技术:** WebRTC `navigator.mediaDevices.getUserMedia`

**功能:**
- 请求摄像头权限
- 列举可用摄像头（前置/后置/外接）
- 切换摄像头
- 设置分辨率（默认 1920x1080）

**API:**
```typescript
interface CameraControls {
  cameras: MediaDeviceInfo[];
  currentCamera: string;
  switchCamera: (deviceId: string) => void;
  start: () => Promise<void>;
  stop: () => void;
}
```

### 3.2 图像处理模块

**技术:** OpenCV.js

**处理流程:**
```
原始帧 → 灰度化 → Canny 边缘检测 → 轮廓查找 →
最大四边形检测 → 透视变换 → 图像增强 → 输出
```

**处理步骤:**

1. **边缘检测**
   - 转为灰度图
   - Canny 边缘检测
   - 膨胀操作连接断开的边缘

2. **文档区域检测**
   - 查找轮廓
   - 按面积排序，取最大四边形
   - 验证四边形有效性

3. **透视校正**
   - 获取四个角点坐标
   - 计算目标尺寸
   - 应用透视变换矩阵

4. **图像增强**
   - 自适应阈值二值化（可选）
   - 对比度拉伸
   - 去噪

### 3.3 二维码解析模块

**技术:** @zxing/library

**功能:**
- 支持 QR Code、Data Matrix、PDF417 等
- 多码同时识别
- 返回解码内容和格式信息

**API 响应:**
```typescript
interface QRResult {
  format: string;      // 码制类型
  data: string;        // 解码内容
  points: Array<{x, y}>; // 位置坐标
}
```

### 3.4 文件保存模块

**保存路径:** `/public/scans/YYYY-MM-DD/scan_XXX.jpg`

**文件命名:**
- 图片：`scan_001.jpg`, `scan_002.jpg`, ...
- JSON: `scan_001.json`, `scan_002.json`, ...

**JSON 文件结构:**
```json
{
  "timestamp": "2026-03-12T10:30:00.000Z",
  "filename": "scan_001.jpg",
  "qrCodes": [
    {
      "format": "QR_CODE",
      "data": "https://example.com",
      "points": [[0,0], [100,0], [100,100], [0,100]]
    }
  ],
  "processing": {
    "edgesDetected": true,
    "perspectiveCorrected": true,
    "enhancementApplied": "adaptive"
  },
  "metadata": {
    "originalSize": {"width": 1920, "height": 1080},
    "processedSize": {"width": 1200, "height": 1600},
    "fileSize": 245760
  }
}
```

### 3.5 EXIF 写入模块

**技术:** piexifjs (纯 JavaScript 库，兼容 Next.js)

**写入字段:**
- `UserComment`: 二维码解析结果
- `ImageDescription`: 扫描时间戳
- `Software`: "Slouch Scanner"

**实现说明:**
- 在前端处理 EXIF 写入（避免后端原生模块兼容问题）
- 将包含 EXIF 的图片 Blob 发送到后端保存

---

## 4. 组件设计

### 4.1 Scanner 组件状态机

```
┌─────────────┐     ┌─────────────┐     ┌─────────────┐
│   初始状态   │ ──▶ │  请求权限   │ ──▶ │   预览中    │
└─────────────┘     └─────────────┘     └─────────────┘
                                              │
                    ┌─────────────────────────┤
                    ▼                         ▼
            ┌─────────────┐           ┌─────────────┐
            │   拍照完成   │ ◀──────── │   处理中    │
            └─────────────┘           └─────────────┘
                    │
                    ▼
            ┌─────────────┐     ┌─────────────┐
            │   保存中    │ ──▶ │   完成/错误   │
            └─────────────┘     └─────────────┘
```

### 4.2 组件 Props

```typescript
interface ScannerProps {
  onSave?: (result: ScanResult) => void;
  onError?: (error: Error) => void;
}

interface ScanResult {
  id: string;
  imageUrl: string;
  jsonUrl: string;
  qrCodes: QRResult[];
  timestamp: Date;
}
```

---

## 5. API 设计

### 5.1 POST /api/scanner/save

**请求:**
```
Content-Type: multipart/form-data
{
  "image": File (Blob),
  "metadata": string (JSON)
}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "imageUrl": "/scans/2026-03-12/scan_001.jpg",
    "jsonUrl": "/scans/2026-03-12/scan_001.json",
    "id": "scan_001"
  }
}
```

### 5.2 POST /api/scanner/parse-qr

**请求:**
```
Content-Type: application/json
{
  "imageData": string (base64 或 Blob URL)
}
```

**响应:**
```json
{
  "success": true,
  "data": {
    "qrCodes": [
      {
        "format": "QR_CODE",
        "data": "https://example.com",
        "points": [[0,0], [100,0], [100,100], [0,100]]
      }
    ]
  }
}
```

---

## 6. 样式设计

### 6.1 布局
- 深色电影风格（与主站一致）
- 移动端：竖屏优化，大按钮
- 桌面端：横向布局，预览区 + 控制区

### 6.2 组件样式
- 预览框：16:9 或 4:3 比例，圆角边框
- 拍照按钮：大圆形，强调色，发光效果
- 状态指示：加载动画，进度条

---

## 7. OpenCV.js 加载策略

### 7.1 本地开发环境
```typescript
// 检测环境
const isDev = process.env.NODE_ENV === 'development';
const opencvUrl = isDev
  ? '/opencv.js'  // 本地文件
  : 'https://docs.opencv.org/4.x/opencv.js';  // CDN
```

### 7.2 生产环境
- 使用 CDN 加载，减少仓库体积
- 添加加载状态和错误处理
- 失败时降级到简单拍照模式

### 7.3 初始化检测
```typescript
// OpenCV.js 加载完成检测
function loadOpenCV(): Promise<void> {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = opencvUrl;
    script.onload = () => {
      // cv 对象可用时 resolve
      if (typeof cv !== 'undefined') {
        resolve();
      }
    };
    script.onerror = () => reject(new Error('OpenCV.js 加载失败'));
    document.head.appendChild(script);
  });
}
```

---

## 8. 错误处理

| 错误类型 | 处理方式 |
|----------|----------|
| 摄像头权限拒绝 | 显示提示，提供手动上传选项 |
| 摄像头不可用 | 显示错误信息，建议使用其他设备 |
| OpenCV 加载失败 | 降级到简单拍照模式 |
| 保存失败 | 提示重试，保留本地副本 |
| 二维码解析失败 | 显示"未检测到二维码" |

## 9. API 安全性

### 9.1 请求验证
- 限制上传文件大小（最大 10MB）
- 验证文件类型为图片（MIME type 检查）
- Rate limiting（每 IP 每分钟最多 10 次请求）

### 9.2 文件命名安全
- 使用 UUID 或时间戳 + 随机数生成文件名
- 避免文件名冲突
- 过滤特殊字符

---

## 10. 依赖安装

```bash
# 二维码解析库
npm install @zxing/library

# EXIF 写入（纯 JavaScript 库）
npm install piexifjs
```

---

## 11. 待确认事项

- [ ] 是否支持批量扫描模式
- [ ] 是否需要扫描历史记录功能
- [ ] 图片质量/压缩级别设置
- [ ] 是否支持其他码制（条形码等）

---

## 12. 实施计划

1. 安装依赖包（@zxing/library, piexifjs）
2. 创建 API 路由（保存、解析）
3. 实现 EXIF 写入工具
4. 创建 Scanner 组件
5. 创建扫描工具页面
6. 更新工具导航
7. 配置 OpenCV.js 加载
8. 测试验证
