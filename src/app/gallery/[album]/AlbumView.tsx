'use client';

import { useState } from 'react';

interface Photo {
  filename: string;
  alt?: string;
  exif?: {
    camera?: string;
    lens?: string;
    aperture?: string;
    shutterSpeed?: string;
    iso?: string;
    focalLength?: string;
    dateTaken?: string;
  };
}

interface Album {
  slug: string;
  title: string;
  description?: string;
  photos: Photo[];
}

export default function AlbumView({ album }: { album: Album }) {
  const [selectedPhoto, setSelectedPhoto] = useState<Photo | null>(null);
  const [showExif, setShowExif] = useState(false);

  return (
    <>
      <a href="/gallery" className="text-accent hover:opacity-80 mb-6 inline-block">
        ← 返回画廊
      </a>

      <header className="mb-8">
        <h1 className="text-4xl font-bold mb-2 text-accent">{album.title}</h1>
        {album.description && (
          <p className="text-textSecondary">{album.description}</p>
        )}
      </header>

      <div className="columns-1 md:columns-2 lg:columns-3 gap-4 space-y-4">
        {album.photos.map((photo, index) => (
          <div
            key={index}
            className="break-inside-avoid cursor-pointer group"
            onClick={() => {
              setSelectedPhoto(photo);
              setShowExif(!!photo.exif);
            }}
          >
            <div className="bg-surface border border-surfaceHighlight rounded-lg overflow-hidden hover:border-accent transition-all">
              <img
                src={`/images/gallery/${album.slug}/images/${photo.filename}`}
                alt={photo.alt || `${album.title} - ${index + 1}`}
                className="w-full h-auto"
                loading="lazy"
              />
            </div>
          </div>
        ))}
      </div>

      {selectedPhoto && (
        <div
          className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
          onClick={() => setSelectedPhoto(null)}
        >
          <div className="max-w-5xl w-full max-h-screen overflow-auto">
            <img
              src={`/images/gallery/${album.slug}/images/${selectedPhoto.filename}`}
              alt={selectedPhoto.alt || 'Photo'}
              className="w-full h-auto max-h-[80vh] object-contain"
            />

            {selectedPhoto.exif && (
              <div className="mt-4 bg-surface/90 backdrop-blur rounded-lg p-4 max-w-md mx-auto">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="text-lg font-semibold text-accent">EXIF 信息</h3>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowExif(!showExif);
                    }}
                    className="text-textSecondary hover:text-accent"
                  >
                    {showExif ? '▼' : '▶'}
                  </button>
                </div>

                {showExif && (
                  <div className="grid grid-cols-2 gap-2 text-sm text-textSecondary">
                    {selectedPhoto.exif.camera && (
                      <div><span className="text-accent">相机:</span> {selectedPhoto.exif.camera}</div>
                    )}
                    {selectedPhoto.exif.lens && (
                      <div><span className="text-accent">镜头:</span> {selectedPhoto.exif.lens}</div>
                    )}
                    {selectedPhoto.exif.aperture && (
                      <div><span className="text-accent">光圈:</span> {selectedPhoto.exif.aperture}</div>
                    )}
                    {selectedPhoto.exif.shutterSpeed && (
                      <div><span className="text-accent">快门:</span> {selectedPhoto.exif.shutterSpeed}</div>
                    )}
                    {selectedPhoto.exif.iso && (
                      <div><span className="text-accent">ISO:</span> {selectedPhoto.exif.iso}</div>
                    )}
                    {selectedPhoto.exif.focalLength && (
                      <div><span className="text-accent">焦距:</span> {selectedPhoto.exif.focalLength}</div>
                    )}
                    {selectedPhoto.exif.dateTaken && (
                      <div><span className="text-accent">拍摄日期:</span> {selectedPhoto.exif.dateTaken}</div>
                    )}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}
