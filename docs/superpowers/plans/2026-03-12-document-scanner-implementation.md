# 文档扫描工具 Implementation Plan

> **For agentic workers:** REQUIRED: Use superpowers:subagent-driven-development (if subagents available) or superpowers:executing-plans to implement this plan. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** 为个人网站添加文档扫描工具，支持摄像头调用、图像处理、二维码解析和本地保存

**Architecture:** 前端 React 组件调用摄像头并使用 OpenCV.js 处理图像，后端 Next.js API Routes 处理文件保存和元数据写入

**Tech Stack:** Next.js 14, React, TypeScript, OpenCV.js, @zxing/library, piexifjs, Tailwind CSS

---

## Chunk 1: 依赖安装和基础配置

### Task 1: 安装依赖包

**Files:**
- Modify: `/opt/slouch-index/package.json`

- [ ] **Step 1: 安装二维码解析和 EXIF 写入库**

```bash
cd /opt/slouch-index
npm install @zxing/library piexifjs
```

- [ ] **Step 2: 安装 OpenCV.js 类型定义（开发依赖）**

```bash
npm install --save-dev @types/node
```

- [ ] **Step 3: 验证安装**

```bash
npm list @zxing/library piexifjs
```

Expected: 显示已安装的包版本

- [ ] **Step 4: 提交**

```bash
git add package.json package-lock.json
git commit -m "feat(scanner): 添加文档扫描工具依赖"
```

---

### Task 2: 创建扫描文件存储目录

**Files:**
- Create: `/opt/slouch-index/public/scans/.gitkeep`

- [ ] **Step 1: 创建存储目录**

```bash
mkdir -p /opt/slouch-index/public/scans
touch /opt/slouch-index/public/scans/.gitkeep
```

- [ ] **Step 2: 更新 .gitignore（排除扫描文件）**

在 `.gitignore` 中添加：
```
# 扫描文件（保留空目录）
public/scans/*
!public/scans/.gitkeep
```

- [ ] **Step 3: 提交**

```bash
git add public/scans/.gitkeep .gitignore
git commit -m "chore: 创建扫描文件存储目录"
```

---

## Chunk 2: 后端 API 路由

### Task 3: 实现保存图片 API 路由

**Files:**
- Create: `/opt/slouch-index/src/app/api/scanner/save/route.ts`

- [ ] **Step 1: 创建保存 API 路由**

```typescript
// src/app/api/scanner/save/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir, readFile } from 'fs/promises';
import { join } from 'path';
import { existsSync } from 'fs';

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const imageFile = formData.get('image') as File;
    const metadataStr = formData.get('metadata') as string;

    if (!imageFile) {
      return NextResponse.json(
        { success: false, error: '未找到图片文件' },
        { status: 400 }
      );
    }

    // 验证文件类型
    if (!imageFile.type.startsWith('image/')) {
      return NextResponse.json(
        { success: false, error: '无效的文件类型' },
        { status: 400 }
      );
    }

    // 验证文件大小（最大 10MB）
    const maxSize = 10 * 1024 * 1024;
    if (imageFile.size > maxSize) {
      return NextResponse.json(
        { success: false, error: '文件大小超过 10MB 限制' },
        { status: 400 }
      );
    }

    // 生成文件名
    const date = new Date().toISOString().split('T')[0];
    const timestamp = Date.now();
    const randomNum = Math.floor(Math.random() * 1000);
    const scanId = `scan_${timestamp}_${randomNum}`;

    const baseDir = join(process.cwd(), 'public', 'scans', date);

    // 确保目录存在
    if (!existsSync(baseDir)) {
      await mkdir(baseDir, { recursive: true });
    }

    // 保存图片
    const imageBuffer = Buffer.from(await imageFile.arrayBuffer());
    const imagePath = join(baseDir, `${scanId}.jpg`);
    await writeFile(imagePath, imageBuffer);

    // 保存元数据 JSON
    const metadata = JSON.parse(metadataStr);
    const jsonPath = join(baseDir, `${scanId}.json`);
    await writeFile(jsonPath, JSON.stringify(metadata, null, 2));

    return NextResponse.json({
      success: true,
      data: {
        id: scanId,
        imageUrl: `/scans/${date}/${scanId}.jpg`,
        jsonUrl: `/scans/${date}/${scanId}.json`,
        date
      }
    });
  } catch (error) {
    console.error('保存失败:', error);
    return NextResponse.json(
      { success: false, error: '保存失败' },
      { status: 500 }
    );
  }
}
```

- [ ] **Step 2: 测试 API 路由（后续前端完成后整体测试）**

- [ ] **Step 3: 提交**

```bash
git add src/app/api/scanner/save/route.ts
git commit -m "feat(scanner): 实现保存图片 API 路由"
```

---

### Task 4: 实现二维码解析 API 路由

**Files:**
- Create: `/opt/slouch-index/src/app/api/scanner/parse-qr/route.ts`

- [ ] **Step 1: 创建二维码解析 API 路由**

```typescript
// src/app/api/scanner/parse-qr/route.ts
import { NextRequest, NextResponse } from 'next/server';
import { BrowserMultiFormatReader } from '@zxing/library';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { imageData } = body;

    if (!imageData) {
      return NextResponse.json(
        { success: false, error: '未提供图片数据' },
        { status: 400 }
      );
    }

    // 解析 base64 图片
    const base64Data = imageData.replace(/^data:image\/(png|jpeg|jpg);base64,/, '');
    const buffer = Buffer.from(base64Data, 'base64');

    // 使用 zxing 解析二维码
    const reader = new BrowserMultiFormatReader();
    await reader.reset();

    // 创建临时图片元素进行解析
    const blob = new Blob([buffer], { type: 'image/jpeg' });
    const imageUrl = URL.createObjectURL(blob);

    const results = await reader.decodeFromImageUrl(imageUrl);
    URL.revokeObjectURL(imageUrl);

    const qrCodes = results.map((result: any) => ({
      format: result?.format?.format || 'QR_CODE',
      data: result?.text || '',
      points: result?.resultPoints?.map((p: any) => ({ x: p.x, y: p.y })) || []
    }));

    return NextResponse.json({
      success: true,
      data: { qrCodes }
    });
  } catch (error) {
    console.error('二维码解析失败:', error);
    // 没有检测到二维码不算错误
    return NextResponse.json({
      success: true,
      data: { qrCodes: [] }
    });
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/app/api/scanner/parse-qr/route.ts
git commit -m "feat(scanner): 实现二维码解析 API 路由"
```

---

## Chunk 3: 前端组件

### Task 5: 创建 EXIF 写入工具库

**Files:**
- Create: `/opt/slouch-index/src/lib/scanner/exif.ts`

- [ ] **Step 1: 创建 EXIF 工具函数**

```typescript
// src/lib/scanner/exif.ts
import piexif from 'piexifjs';

export interface QRCodeData {
  format: string;
  data: string;
  points?: Array<{ x: number; y: number }>;
}

export interface ScanMetadata {
  timestamp: string;
  qrCodes: QRCodeData[];
  processing: {
    edgesDetected: boolean;
    perspectiveCorrected: boolean;
    enhancementApplied: string;
  };
  originalSize: { width: number; height: number };
  processedSize: { width: number; height: number };
}

/**
 * 将二维码信息写入图片 EXIF
 */
export function embedQRCodeToExif(
  imageBase64: string,
  metadata: ScanMetadata
): string {
  try {
    // 解析现有 EXIF 或创建新的
    let exifObj: any = {};

    try {
      exifObj = piexif.load(imageBase64);
    } catch (e) {
      // 没有现有 EXIF，创建新的
      exifObj = { '0th': {}, 'Exif': {}, 'GPS': {}, '1st': {}, 'thumbnail': null };
    }

    // 写入二维码信息到 UserComment
    const qrData = metadata.qrCodes.map(qr =>
      `${qr.format}: ${qr.data}`
    ).join(' | ');

    if (qrData) {
      exifObj['0th'][piexif.ImageIFD.UserComment] = qrData;
    }

    // 写入扫描时间戳
    exifObj['0th'][piexif.ImageIFD.ImageDescription] = `Slouch Scanner - ${metadata.timestamp}`;
    exifObj['0th'][piexif.ImageIFD.Software] = 'Slouch Scanner';

    // 生成新的 EXIF 数据
    const exifBytes = piexif.dump(exifObj);

    // 插入 EXIF 到图片
    return piexif.insert(exifBytes, imageBase64);
  } catch (error) {
    console.error('EXIF 写入失败:', error);
    // 返回原图
    return imageBase64;
  }
}
```

- [ ] **Step 2: 提交**

```bash
git add src/lib/scanner/exif.ts
git commit -m "feat(scanner): 创建 EXIF 写入工具"
```

---

### Task 6: 创建 Scanner 核心组件

**Files:**
- Create: `/opt/slouch-index/src/components/scanner/Scanner.tsx`

- [ ] **Step 1: 创建 Scanner 组件（分多个部分）**

由于组件较大，将分步创建。首先创建组件框架和状态管理：

```typescript
// src/components/scanner/Scanner.tsx
'use client';

import React, { useState, useRef, useCallback, useEffect } from 'react';
import { embedQRCodeToExif, ScanMetadata } from '@/lib/scanner/exif';

interface ScanResult {
  id: string;
  imageUrl: string;
  jsonUrl: string;
  qrCodes: { format: string; data: string }[];
  timestamp: Date;
}

interface ScannerProps {
  onSave?: (result: ScanResult) => void;
  onError?: (error: string) => void;
}

type ScannerState = 'idle' | 'requesting' | 'preview' | 'processing' | 'saving' | 'complete' | 'error';

export default function Scanner({ onSave, onError }: ScannerProps) {
  const [state, setState] = useState<ScannerState>('idle');
  const [cameras, setCameras] = useState<MediaDeviceInfo[]>([]);
  const [currentCamera, setCurrentCamera] = useState<string>('');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [previewUrl, setPreviewUrl] = useState<string>('');
  const [processedImage, setProcessedImage] = useState<string>('');
  const [qrResults, setQrResults] = useState<{ format: string; data: string }[]>([]);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);
  const opencvLoaded = useRef<boolean>(false);

  // 加载 OpenCV.js
  useEffect(() => {
    const loadOpenCV = async () => {
      const isDev = process.env.NODE_ENV === 'development';
      const opencvUrl = isDev
        ? '/opencv.js'
        : 'https://docs.opencv.org/4.x/opencv.js';

      return new Promise<void>((resolve, reject) => {
        if ((window as any).cv?.ready) {
          opencvLoaded.current = true;
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = opencvUrl;
        script.onload = () => {
          const checkReady = setInterval(() => {
            if ((window as any).cv?.ready) {
              clearInterval(checkReady);
              opencvLoaded.current = true;
              resolve();
            }
          }, 100);
        };
        script.onerror = () => reject(new Error('OpenCV.js 加载失败'));
        document.head.appendChild(script);
      });
    };

    loadOpenCV().catch(err => {
      console.error('OpenCV.js 加载失败，降级到简单模式:', err);
    });
  }, []);

  // 枚举摄像头
  const enumerateCameras = useCallback(async () => {
    try {
      const devices = await navigator.mediaDevices.enumerateDevices();
      const videoDevices = devices.filter(d => d.kind === 'videoinput');
      setCameras(videoDevices);
      if (videoDevices.length > 0) {
        setCurrentCamera(videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error('枚举摄像头失败:', err);
    }
  }, []);

  // 启动摄像头
  const startCamera = useCallback(async () => {
    setState('requesting');
    try {
      // 停止之前的流
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: currentCamera ? { exact: currentCamera } : undefined,
          facingMode: 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
      }

      await enumerateCameras();
      setState('preview');
    } catch (err) {
      const msg = err instanceof Error ? err.message : '无法访问摄像头';
      setErrorMessage(msg);
      setState('error');
      onError?.(msg);
    }
  }, [currentCamera, enumerateCameras, onError]);

  // 停止摄像头
  const stopCamera = useCallback(() => {
    if (streamRef.current) {
      streamRef.current.getTracks().forEach(track => track.stop());
      streamRef.current = null;
    }
  }, []);

  // 切换摄像头
  const switchCamera = useCallback((deviceId: string) => {
    setCurrentCamera(deviceId);
    if (state === 'preview') {
      setTimeout(() => startCamera(), 100);
    }
  }, [state, startCamera]);

  // 拍照
  const takePhoto = useCallback(async () => {
    if (!videoRef.current || !canvasRef.current) return;

    const video = videoRef.current;
    const canvas = canvasRef.current;
    const context = canvas.getContext('2d');

    if (!context) return;

    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);

    // 获取原始图片
    const originalImage = canvas.toDataURL('image/jpeg', 0.9);
    setPreviewUrl(originalImage);
    setState('processing');

    // 使用 OpenCV 处理图像
    if (opencvLoaded.current) {
      try {
        const processed = await processWithOpenCV(originalImage);
        setProcessedImage(processed);
      } catch (err) {
        console.error('OpenCV 处理失败，使用原图:', err);
        setProcessedImage(originalImage);
      }
    } else {
      setProcessedImage(originalImage);
    }

    // 解析二维码
    try {
      const qrResponse = await fetch('/api/scanner/parse-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: originalImage })
      });
      const qrData = await qrResponse.json();
      setQrResults(qrData.data?.qrCodes || []);
    } catch (err) {
      console.error('二维码解析失败:', err);
    }

    stopCamera();
  }, [stopCamera]);

  // OpenCV 图像处理
  const processWithOpenCV = async (imageData: string): Promise<string> => {
    const cv = (window as any).cv;
    if (!cv) return imageData;

    return new Promise((resolve) => {
      const imgElement = new Image();
      imgElement.onload = () => {
        try {
          const src = cv.imread(imgElement);
          const dst = new cv.Mat();
          const gray = new cv.Mat();

          // 转灰度
          cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY);

          // Canny 边缘检测
          const edges = new cv.Mat();
          cv.Canny(gray, edges, 75, 200);

          // 查找轮廓
          const contours = new cv.MatVector();
          const hierarchy = new cv.Mat();
          cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

          // 找到最大四边形轮廓
          let maxArea = 0;
          let docContour = null;

          for (let i = 0; i < contours.size(); i++) {
            const contour = contours.get(i);
            const area = cv.contourArea(contour);
            if (area > maxArea) {
              const perimeter = cv.arcLength(contour, true);
              const approx = new cv.Mat();
              cv.approxPolyDP(contour, approx, 0.02 * perimeter, true);

              if (approx.rows === 4) {
                maxArea = area;
                docContour = approx.clone();
              }
              approx.delete();
            }
          }

          // 如果有文档轮廓，进行透视变换
          if (docContour) {
            const points = getDocPoints(docContour);
            const warped = applyPerspectiveTransform(src, points, cv);
            cv.imshow(canvasRef.current!, warped);
            warped.delete();
          } else {
            cv.imshow(canvasRef.current!, src);
          }

          const result = canvasRef.current!.toDataURL('image/jpeg', 0.9);

          // 清理内存
          src.delete();
          dst.delete();
          gray.delete();
          edges.delete();
          contours.delete();
          hierarchy.delete();
          if (docContour) docContour.delete();

          resolve(result);
        } catch (err) {
          console.error('OpenCV 处理错误:', err);
          resolve(imageData);
        }
      };
      imgElement.src = imageData;
    });
  };

  // 辅助函数：获取文档四个角点
  const getDocPoints = (contour: any): Array<{ x: number; y: number }> => {
    const points = [];
    for (let i = 0; i < contour.rows; i++) {
      points.push({
        x: contour.data32S[i * 2],
        y: contour.data32S[i * 2 + 1]
      });
    }
    // 排序：左上、右上、右下、左下
    points.sort((a, b) => a.x - b.x);
    const left = points.slice(0, 2).sort((a, b) => a.y - b.y);
    const right = points.slice(2).sort((a, b) => a.y - b.y);
    return [left[0], right[0], right[1], left[1]];
  };

  // 辅助函数：透视变换
  const applyPerspectiveTransform = (
    src: any,
    points: Array<{ x: number; y: number }>,
    cv: any
  ): any => {
    const width = Math.hypot(
      points[1].x - points[0].x,
      points[1].y - points[0].y
    );
    const height = Math.hypot(
      points[3].x - points[0].x,
      points[3].y - points[0].y
    );

    const srcTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      points[0].x, points[0].y,
      points[1].x, points[1].y,
      points[2].x, points[2].y,
      points[3].x, points[3].y
    ]);

    const dstTri = cv.matFromArray(4, 1, cv.CV_32FC2, [
      0, 0,
      width, 0,
      width, height,
      0, height
    ]);

    const M = cv.getPerspectiveTransform(srcTri, dstTri);
    const dst = new cv.Mat();
    cv.warpPerspective(src, dst, M, new cv.Size(width, height));

    srcTri.delete();
    dstTri.delete();
    M.delete();

    return dst;
  };

  // 保存扫描结果
  const saveScan = useCallback(async () => {
    if (!processedImage) return;

    setState('saving');

    try {
      // 将 base64 转为 Blob
      const response = await fetch(processedImage);
      const blob = await response.blob();

      // 准备元数据
      const metadata: ScanMetadata = {
        timestamp: new Date().toISOString(),
        qrCodes: qrResults.map(qr => ({
          format: qr.format,
          data: qr.data,
          points: []
        })),
        processing: {
          edgesDetected: opencvLoaded.current,
          perspectiveCorrected: opencvLoaded.current,
          enhancementApplied: opencvLoaded.current ? 'opencv' : 'none'
        },
        originalSize: { width: 0, height: 0 },
        processedSize: { width: 0, height: 0 }
      };

      // 如果需要嵌入 EXIF
      const finalImage = embedQRCodeToExif(processedImage, metadata);
      const finalResponse = await fetch(finalImage);
      const finalBlob = await finalResponse.blob();

      // 上传
      const formData = new FormData();
      formData.append('image', finalBlob, 'scan.jpg');
      formData.append('metadata', JSON.stringify(metadata));

      const res = await fetch('/api/scanner/save', {
        method: 'POST',
        body: formData
      });

      const result = await res.json();

      if (result.success) {
        setState('complete');
        onSave?.({
          id: result.data.id,
          imageUrl: result.data.imageUrl,
          jsonUrl: result.data.jsonUrl,
          qrCodes: qrResults,
          timestamp: new Date()
        });
      } else {
        throw new Error(result.error);
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : '保存失败';
      setErrorMessage(msg);
      setState('error');
      onError?.(msg);
    }
  }, [processedImage, qrResults, onSave, onError]);

  // 重置
  const reset = useCallback(() => {
    setPreviewUrl('');
    setProcessedImage('');
    setQrResults([]);
    setErrorMessage('');
    setState('idle');
    startCamera();
  }, [startCamera]);

  // 清理
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-accent text-center">文档扫描仪</h1>

      <div className="bg-surface border border-surfaceHighlight rounded-xl p-6">
        {/* 摄像头预览区 */}
        {(state === 'requesting' || state === 'preview') && (
          <div className="mb-4">
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="w-full rounded-lg bg-black"
            />

            {/* 摄像头切换 */}
            {cameras.length > 1 && (
              <select
                value={currentCamera}
                onChange={(e) => switchCamera(e.target.value)}
                className="mt-2 w-full bg-surfaceHighlight border border-accent/30 rounded px-3 py-2 text-textPrimary"
              >
                {cameras.map((camera, i) => (
                  <option key={camera.deviceId} value={camera.deviceId}>
                    摄像头 {i + 1}
                  </option>
                ))}
              </select>
            )}
          </div>
        )}

        {/* 隐藏 Canvas 用于处理 */}
        <canvas ref={canvasRef} className="hidden" />

        {/* 处理后的图片预览 */}
        {state === 'processing' && (
          <div className="text-center py-8">
            <div className="animate-pulse text-accent">处理图像中...</div>
          </div>
        )}

        {(state === 'processing' || state === 'saving' || state === 'complete') && processedImage && (
          <div className="mb-4">
            <img
              src={processedImage}
              alt="处理结果"
              className="w-full rounded-lg"
            />
          </div>
        )}

        {/* 二维码结果 */}
        {qrResults.length > 0 && (
          <div className="mb-4 p-4 bg-surfaceHighlight rounded-lg">
            <h3 className="text-lg font-semibold text-accent mb-2">检测到二维码</h3>
            {qrResults.map((qr, i) => (
              <div key={i} className="mb-2">
                <span className="text-sm text-textSecondary">{qr.format}: </span>
                <span className="text-textPrimary break-all">{qr.data}</span>
              </div>
            ))}
          </div>
        )}

        {/* 错误信息 */}
        {state === 'error' && (
          <div className="mb-4 p-4 bg-red-900/30 border border-red-500/50 rounded-lg">
            <p className="text-red-300">{errorMessage}</p>
          </div>
        )}

        {/* 操作按钮 */}
        <div className="flex flex-wrap gap-4 justify-center">
          {state === 'idle' && (
            <button
              onClick={startCamera}
              className="px-6 py-3 bg-accent hover:bg-accent/80 rounded-lg font-semibold transition-colors"
            >
              启动摄像头
            </button>
          )}

          {state === 'preview' && (
            <button
              onClick={takePhoto}
              className="px-8 py-4 bg-accent hover:bg-accent/80 rounded-full font-semibold transition-colors text-lg"
            >
              📷 拍照
            </button>
          )}

          {(state === 'processing' || state === 'saving') && (
            <div className="text-accent animate-pulse">处理中...</div>
          )}

          {state === 'complete' && (
            <>
              <button
                onClick={reset}
                className="px-6 py-3 bg-surfaceHighlight hover:bg-surfaceHighlight/80 rounded-lg font-semibold transition-colors"
              >
                继续扫描
              </button>
            </>
          )}

          {state === 'error' && (
            <button
              onClick={reset}
              className="px-6 py-3 bg-surfaceHighlight hover:bg-surfaceHighlight/80 rounded-lg font-semibold transition-colors"
            >
              重试
            </button>
          )}
        </div>
      </div>

      {/* 保存按钮（处理完成后显示） */}
      {state === 'processing' && processedImage && (
        <div className="mt-4 text-center">
          <button
            onClick={saveScan}
            className="px-6 py-3 bg-accent hover:bg-accent/80 rounded-lg font-semibold transition-colors"
          >
            💾 保存到本地
          </button>
        </div>
      )}
    </div>
  );
}
```

- [ ] **Step 2: 提交**

```bash
git add src/components/scanner/Scanner.tsx
git commit -m "feat(scanner): 创建 Scanner 核心组件"
```

---

### Task 7: 创建扫描工具页面

**Files:**
- Create: `/opt/slouch-index/src/app/tools/scanner/page.tsx`
- Create: `/opt/slouch-index/src/app/tools/scanner/layout.tsx`

- [ ] **Step 1: 创建扫描工具页面**

```typescript
// src/app/tools/scanner/page.tsx
import Scanner from '@/components/scanner/Scanner';

export default function ScannerPage() {
  return (
    <div className="min-h-screen">
      <Scanner />
    </div>
  );
}
```

- [ ] **Step 2: 创建布局文件**

```typescript
// src/app/tools/scanner/layout.tsx
export default function ScannerLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="pt-20">
      {children}
    </div>
  );
}
```

- [ ] **Step 3: 提交**

```bash
git add src/app/tools/scanner/page.tsx src/app/tools/scanner/layout.tsx
git commit -m "feat(scanner): 创建扫描工具页面和布局"
```

---

### Task 8: 更新工具导航页面

**Files:**
- Modify: `/opt/slouch-index/src/app/tools/page.tsx`

- [ ] **Step 1: 添加文档扫描工具到导航**

修改 tools 数组，添加新工具：

```typescript
const tools = [
  {
    title: '天气查询',
    description: '查看实时天气预报',
    href: '/tools/weather',
    icon: '🌤️',
  },
  {
    title: '文档扫描',
    description: '摄像头扫描文档，自动识别二维码',
    href: '/tools/scanner',
    icon: '📷',
  },
];
```

- [ ] **Step 2: 提交**

```bash
git add src/app/tools/page.tsx
git commit -m "feat(scanner): 添加文档扫描工具到导航"
```

---

## Chunk 4: OpenCV.js 配置和测试

### Task 9: 配置 OpenCV.js 本地开发文件

**Files:**
- Create: `/opt/slouch-index/public/opencv.js`
- Modify: `/opt/slouch-index/.gitignore`

- [ ] **Step 1: 下载 OpenCV.js（本地开发用）**

```bash
cd /opt/slouch-index/public
curl -o opencv.js https://docs.opencv.org/4.x/opencv.js
```

注意：文件较大（约 8MB），下载可能需要一些时间

- [ ] **Step 2: 更新 .gitignore（排除 opencv.js）**

```
# OpenCV.js（生产环境使用 CDN）
public/opencv.js
```

- [ ] **Step 3: 验证文件存在**

```bash
ls -lh /opt/slouch-index/public/opencv.js
```

- [ ] **Step 4: 提交**

```bash
git add .gitignore
git commit -m "chore(scanner): 配置 OpenCV.js 本地开发文件"
```

---

### Task 10: 测试构建和运行

**Files:**
- 全局测试

- [ ] **Step 1: 构建项目**

```bash
cd /opt/slouch-index
npm run build
```

Expected: 构建成功，无错误

- [ ] **Step 2: 启动开发服务器测试**

```bash
npm run dev
```

然后在浏览器访问 `http://localhost:3000/tools/scanner`

- [ ] **Step 3: 测试功能**
  - [ ] 摄像头权限请求正常
  - [ ] 摄像头预览正常
  - [ ] 拍照功能正常
  - [ ] 图像处理正常（边缘检测、透视校正）
  - [ ] 二维码解析正常
  - [ ] 文件保存正常

- [ ] **Step 4: 提交最终版本**

```bash
git add .
git commit -m "feat(scanner): 完成文档扫描工具开发和测试"
```

---

## 完成检查清单

- [ ] 依赖包安装完成
- [ ] API 路由正常工作
- [ ] 前端组件渲染正常
- [ ] 摄像头调用和切换正常
- [ ] OpenCV 图像处理正常
- [ ] 二维码解析正常
- [ ] 文件保存和 JSON 生成正常
- [ ] EXIF 写入正常
- [ ] 响应式设计正常
- [ ] 错误处理完善

---

## 后续扩展（可选）

- [ ] 批量扫描模式
- [ ] 扫描历史记录
- [ ] 图片质量设置
- [ ] 更多码制支持（条形码等）
- [ ] 云端同步功能
