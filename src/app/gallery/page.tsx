import { getAllAlbums } from '@/lib/gallery';
import Link from 'next/link';

export default function GalleryPage() {
  const albums = getAllAlbums();

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-accent text-center">摄影画廊</h1>

      {albums.length === 0 ? (
        <div className="text-center py-20">
          <div className="text-6xl mb-4">📷</div>
          <p className="text-textSecondary text-xl">暂无相册</p>
          <p className="text-textSecondary mt-2">第一本相册正在整理中...</p>
        </div>
      ) : (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {albums.map((album) => (
            <Link key={album.slug} href={`/gallery/${album.slug}`}>
              <article className="bg-surface border border-surfaceHighlight rounded-xl overflow-hidden hover:border-accent transition-all glow hover:glow-lg group">
                {album.cover ? (
                  <div className="aspect-[4/3] bg-surfaceHighlight overflow-hidden">
                    <img
                      src={`/images/gallery/${album.slug}/${album.cover}`}
                      alt={album.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                ) : (
                  <div className="aspect-[4/3] bg-surfaceHighlight flex items-center justify-center">
                    <span className="text-6xl">📷</span>
                  </div>
                )}
                <div className="p-4">
                  <h2 className="text-xl font-bold mb-2 text-accent group-hover:opacity-80">
                    {album.title}
                  </h2>
                  {album.description && (
                    <p className="text-textSecondary text-sm line-clamp-2">
                      {album.description}
                    </p>
                  )}
                  <p className="text-textSecondary text-sm mt-2">
                    {album.photos.length} 张照片
                  </p>
                </div>
              </article>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
