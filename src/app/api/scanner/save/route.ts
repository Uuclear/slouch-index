import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
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
