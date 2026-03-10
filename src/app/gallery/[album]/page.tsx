import { getAlbumBySlug, getAllAlbums } from '@/lib/gallery';
import { notFound } from 'next/navigation';
import AlbumView from './AlbumView';

export function generateStaticParams() {
  const albums = getAllAlbums();
  return albums.map((album) => ({
    album: album.slug,
  }));
}

export default function AlbumPage({ params }: { params: { album: string } }) {
  const album = getAlbumBySlug(params.album);

  if (!album) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <AlbumView album={album} />
    </div>
  );
}
