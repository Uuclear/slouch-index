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

interface ExifObject {
  '0th': Record<string, unknown>;
  'Exif': Record<string, unknown>;
  'GPS': Record<string, unknown>;
  '1st': Record<string, unknown>;
  'thumbnail': null | unknown;
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
    let exifObj: ExifObject;

    try {
      exifObj = piexif.load(imageBase64) as ExifObject;
    } catch {
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
