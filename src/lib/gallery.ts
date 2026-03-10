import fs from 'fs';
import path from 'path';

const galleryDirectory = path.join(process.cwd(), 'content/gallery');

export interface Photo {
  filename: string;
  alt?: string;
  caption?: string;
  exif?: ExifData;
}

export interface ExifData {
  camera?: string;
  lens?: string;
  aperture?: string;
  shutterSpeed?: string;
  iso?: string;
  focalLength?: string;
  dateTaken?: string;
}

export interface Album {
  slug: string;
  title: string;
  description?: string;
  cover?: string;
  photos: Photo[];
  dateCreated?: string;
}

export function getAllAlbums(): Album[] {
  if (!fs.existsSync(galleryDirectory)) {
    return [];
  }

  const albumDirs = fs.readdirSync(galleryDirectory);

  const albums: Album[] = albumDirs
    .filter(dir => {
      const dirPath = path.join(galleryDirectory, dir);
      return fs.statSync(dirPath).isDirectory();
    })
    .map(dir => {
      const albumDir = path.join(galleryDirectory, dir);
      const metadataPath = path.join(albumDir, 'metadata.json');
      const imagesDir = path.join(albumDir, 'images');

      let metadata: Album = {
        slug: dir,
        title: dir,
        photos: [],
      };

      if (fs.existsSync(metadataPath)) {
        const fileContent = fs.readFileSync(metadataPath, 'utf-8');
        const data = JSON.parse(fileContent);
        metadata = { ...metadata, ...data };
      }

      // Get photos from images directory
      if (fs.existsSync(imagesDir)) {
        const imageFiles = fs.readdirSync(imagesDir).filter(file => {
          const ext = path.extname(file).toLowerCase();
          return ['.jpg', '.jpeg', '.png', '.webp', '.heic'].includes(ext);
        });

        metadata.photos = imageFiles.map(filename => {
          const exifPath = path.join(imagesDir, `${path.parse(filename).name}.json`);
          let exif: ExifData | undefined;

          if (fs.existsSync(exifPath)) {
            const exifContent = fs.readFileSync(exifPath, 'utf-8');
            exif = JSON.parse(exifContent);
          }

          return {
            filename,
            exif,
          };
        });
      }

      return metadata;
    });

  return albums;
}

export function getAlbumBySlug(slug: string): Album | null {
  const albums = getAllAlbums();
  return albums.find(album => album.slug === slug) || null;
}
