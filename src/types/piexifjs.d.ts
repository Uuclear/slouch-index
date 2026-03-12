/* eslint-disable @typescript-eslint/no-explicit-any */
declare module 'piexifjs' {
  interface ExifIFD {
    [key: number]: unknown;
  }

  interface ExifObject {
    '0th': Record<string, unknown>;
    'Exif': Record<string, unknown>;
    'GPS': Record<string, unknown>;
    '1st': Record<string, unknown>;
    'thumbnail': unknown;
  }

  interface ImageIFD {
    ImageDescription: number;
    Software: number;
    UserComment: number;
  }

  function load(base64: string): ExifObject;
  function dump(exif: ExifObject): string;
  function insert(exif: string, image: string): string;

  const ImageIFD: ImageIFD;
}
