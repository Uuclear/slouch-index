/* eslint-disable @typescript-eslint/no-explicit-any */
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
  const [processedImage, setProcessedImage] = useState<string>('');
  const [qrResults, setQrResults] = useState<{ format: string; data: string }[]>([]);
  const [openCVReady, setOpenCVReady] = useState(false);

  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const streamRef = useRef<MediaStream | null>(null);

  // 加载 OpenCV.js
  useEffect(() => {
    const loadOpenCV = async () => {
      const opencvUrl = 'https://cdn.jsdelivr.net/npm/opencv.js@1.2.1/opencv.min.js';

      return new Promise<void>((resolve, reject) => {
        if ((window as any).cv?.ready) {
          setOpenCVReady(true);
          resolve();
          return;
        }

        const script = document.createElement('script');
        script.src = opencvUrl;
        script.crossOrigin = 'anonymous';
        script.onload = () => {
          const checkReady = setInterval(() => {
            if ((window as any).cv?.ready) {
              clearInterval(checkReady);
              setOpenCVReady(true);
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
      if (videoDevices.length > 0 && !currentCamera) {
        // 默认选择后置摄像头
        const backCamera = videoDevices.find(d =>
          d.label.toLowerCase().includes('back') ||
          d.label.toLowerCase().includes('environment')
        );
        setCurrentCamera(backCamera ? backCamera.deviceId : videoDevices[0].deviceId);
      }
    } catch (err) {
      console.error('枚举摄像头失败:', err);
    }
  }, [currentCamera]);

  // 启动摄像头
  const startCamera = useCallback(async () => {
    setState('requesting');
    try {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }

      const constraints: MediaStreamConstraints = {
        video: {
          deviceId: currentCamera ? { exact: currentCamera } : undefined,
          facingMode: currentCamera ? undefined : 'environment',
          width: { ideal: 1920 },
          height: { ideal: 1080 }
        }
      };

      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      streamRef.current = stream;

      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
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
  }, []);

  useEffect(() => {
    if (state === 'preview' && currentCamera) {
      startCamera();
    }
  }, [currentCamera]);

  // OpenCV 图像处理
  const processWithOpenCV = useCallback((imageData: string): Promise<string> => {
    const cv = (window as any).cv;
    if (!cv || !cv.Mat) {
      console.log('OpenCV not ready, using original image');
      return Promise.resolve(imageData);
    }

    return new Promise((resolve) => {
      const timeoutId = setTimeout(() => {
        console.error('OpenCV processing timeout');
        resolve(imageData);
      }, 10000);

      const imgElement = new Image();
      imgElement.onload = () => {
        try {
          let src: any = null;
          let gray: any = null;
          let edges: any = null;
          let contours: any = null;
          let hierarchy: any = null;
          let docContour: any = null;
          let warped: any = null;

          try {
            src = cv.imread(imgElement);
            gray = new cv.Mat();
            edges = new cv.Mat();

            // 转灰度
            cv.cvtColor(src, gray, cv.COLOR_RGBA2GRAY, 0);

            // 自适应阈值处理（更适合文档扫描）
            cv.adaptiveThreshold(gray, edges, 255, cv.ADAPTIVE_THRESH_GAUSSIAN_C, cv.THRESH_BINARY, 11, 2);

            // 查找轮廓
            contours = new cv.MatVector();
            hierarchy = new cv.Mat();
            cv.findContours(edges, contours, hierarchy, cv.RETR_EXTERNAL, cv.CHAIN_APPROX_SIMPLE);

            // 找到最大四边形轮廓
            let maxArea = 0;

            for (let i = 0; i < contours.size(); i++) {
              const contour = contours.get(i);
              const area = cv.contourArea(contour);
              if (area > maxArea && area > 1000) {
                const perimeter = cv.arcLength(contour, true);
                const approx = new cv.Mat();
                cv.approxPolyDP(contour, approx, 0.02 * perimeter, true);

                if (approx.rows === 4) {
                  maxArea = area;
                  if (docContour) docContour.delete();
                  docContour = approx;
                } else {
                  approx.delete();
                }
              }
              contour.delete();
            }

            // 透视变换
            if (docContour && docContour.rows === 4) {
              const points = getDocPoints(docContour);
              warped = applyPerspectiveTransform(src, points, cv);
              cv.imshow(canvasRef.current!, warped);
            } else {
              cv.imshow(canvasRef.current!, src);
            }

            const result = canvasRef.current!.toDataURL('image/jpeg', 0.9);
            clearTimeout(timeoutId);
            resolve(result);

          } finally {
            // 清理内存
            if (src) src.delete();
            if (gray) gray.delete();
            if (edges) edges.delete();
            if (contours) contours.delete();
            if (hierarchy) hierarchy.delete();
            if (docContour) docContour.delete();
            if (warped) warped.delete();
          }

        } catch (err) {
          console.error('OpenCV 处理错误:', err);
          clearTimeout(timeoutId);
          resolve(imageData);
        }
      };
      imgElement.onerror = () => {
        clearTimeout(timeoutId);
        resolve(imageData);
      };
      imgElement.src = imageData;
    });
  }, []);

  // 辅助函数：获取文档四个角点
  const getDocPoints = (contour: any): Array<{ x: number; y: number }> => {
    const points: Array<{ x: number; y: number }> = [];
    for (let i = 0; i < contour.rows; i++) {
      const ptr = contour.data32S;
      points.push({
        x: ptr[i * 2],
        y: ptr[i * 2 + 1]
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
    const width = Math.max(
      Math.hypot(points[1].x - points[0].x, points[1].y - points[0].y),
      Math.hypot(points[2].x - points[3].x, points[2].y - points[3].y)
    );
    const height = Math.max(
      Math.hypot(points[3].x - points[0].x, points[3].y - points[0].y),
      Math.hypot(points[2].x - points[1].x, points[2].y - points[1].y)
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
    setState('processing');
    setQrResults([]);

    // 使用 OpenCV 处理图像
    let processed: string;
    if (openCVReady) {
      try {
        processed = await processWithOpenCV(originalImage);
      } catch (err) {
        console.error('OpenCV 处理失败，使用原图:', err);
        processed = originalImage;
      }
    } else {
      processed = originalImage;
    }
    setProcessedImage(processed);

    // 解析二维码
    try {
      const qrResponse = await fetch('/api/scanner/parse-qr', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ imageData: originalImage })
      });
      const qrData = await qrResponse.json();
      if (qrData.success && qrData.data?.qrCodes) {
        setQrResults(qrData.data.qrCodes.filter((qr: any) => qr.data && qr.data.length > 0));
      }
    } catch (err) {
      console.error('二维码解析失败:', err);
    }

    stopCamera();
  }, [processWithOpenCV, openCVReady, stopCamera]);

  // 保存扫描结果
  const saveScan = useCallback(async () => {
    if (!processedImage) return;

    setState('saving');

    try {
      // 准备元数据
      const metadata: ScanMetadata = {
        timestamp: new Date().toISOString(),
        qrCodes: qrResults.map(qr => ({
          format: qr.format,
          data: qr.data,
          points: []
        })),
        processing: {
          edgesDetected: openCVReady,
          perspectiveCorrected: openCVReady,
          enhancementApplied: openCVReady ? 'opencv' : 'none'
        },
        originalSize: { width: 0, height: 0 },
        processedSize: { width: 0, height: 0 }
      };

      // 嵌入 EXIF
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
  }, [processedImage, qrResults, openCVReady, onSave, onError]);

  // 重置
  const reset = useCallback(() => {
    setProcessedImage('');
    setQrResults([]);
    setErrorMessage('');
    setState('idle');
    stopCamera();
    // 延迟启动摄像头，确保状态已更新
    setTimeout(() => {
      startCamera();
    }, 100);
  }, [startCamera, stopCamera]);

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
        {processedImage && state !== 'idle' && state !== 'error' && (
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

          {state === 'processing' && (
            <div className="text-accent animate-pulse">处理图像中...</div>
          )}

          {state === 'saving' && (
            <div className="text-accent animate-pulse">保存中...</div>
          )}

          {state === 'complete' && (
            <button
              onClick={reset}
              className="px-6 py-3 bg-surfaceHighlight hover:bg-surfaceHighlight/80 rounded-lg font-semibold transition-colors"
            >
              继续扫描
            </button>
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
      {processedImage && state === 'processing' && (
        <div className="mt-4 text-center">
          <button
            onClick={saveScan}
            disabled={!processedImage}
            className="px-6 py-3 bg-accent hover:bg-accent/80 rounded-lg font-semibold transition-colors disabled:opacity-50"
          >
            💾 保存到本地
          </button>
        </div>
      )}
    </div>
  );
}
