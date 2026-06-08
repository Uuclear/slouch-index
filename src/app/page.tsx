import { prisma } from "@/lib/db";
import { FilmStrip } from "@/components/film/film-strip";
import { AlbumSelectorWrapper } from "@/components/film/album-selector-wrapper";

async function getCategories() {
  const photos = await prisma.photo.findMany({
    select: { category: true },
    distinct: ["category"],
    orderBy: { category: "asc" },
  });
  return photos.map((p) => p.category);
}

async function getPhotos(category: string) {
  return prisma.photo.findMany({
    where: { category },
    orderBy: { order: "asc" },
  });
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const categories = await getCategories();
  const selectedCategory = searchParams.category || categories[0] || "风景";
  const photos = await getPhotos(selectedCategory);

  const albums = categories.map((c) => ({ id: c, name: c }));

  return (
    <div className="pt-20 pb-12 px-6">
      <div className="mb-12">
        <AlbumSelectorWrapper
          albums={albums}
          selectedId={selectedCategory}
        />
      </div>
      <FilmStrip
        photos={photos.map((p) => ({
          id: p.id,
          title: p.title,
          imageUrl: p.imageUrl,
        }))}
      />
    </div>
  );
}
