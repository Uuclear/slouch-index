/* eslint-disable @typescript-eslint/no-explicit-any */
import { NextRequest, NextResponse } from 'next/server';
import { BrowserMultiFormatReader } from '@zxing/library';

interface QRCodeResult {
  format: string;
  data: string;
  points: Array<{ x: number; y: number }>;
}

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

    try {
      const result = await reader.decodeFromImageUrl(imageUrl);
      URL.revokeObjectURL(imageUrl);

      const qrCodes: QRCodeResult[] = [{
        format: (result as any)?.format?.format || 'QR_CODE',
        data: (result as any)?.text || '',
        points: (result as any)?.resultPoints?.map((p: any) => ({ x: p.x, y: p.y })) || []
      }];

      return NextResponse.json({
        success: true,
        data: { qrCodes }
      });
    } catch {
      URL.revokeObjectURL(imageUrl);
      // 没有检测到二维码
      return NextResponse.json({
        success: true,
        data: { qrCodes: [] }
      });
    }
  } catch (error) {
    console.error('二维码解析失败:', error);
    // 没有检测到二维码不算错误
    return NextResponse.json({
      success: true,
      data: { qrCodes: [] }
    });
  }
}
