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

async function getCategoryCovers() {
  const covers: Record<string, string> = {};
  const categories = await prisma.photo.findMany({
    select: { category: true },
    distinct: ["category"],
  });

  for (const { category } of categories) {
    const first = await prisma.photo.findFirst({
      where: { category },
      orderBy: { order: "asc" },
      select: { imageUrl: true },
    });
    if (first) covers[category] = first.imageUrl;
  }
  return covers;
}

export default async function HomePage({
  searchParams,
}: {
  searchParams: { category?: string };
}) {
  const categories = await getCategories();
  const selectedCategory = searchParams.category || categories[0] || "风景";
  const photos = await getPhotos(selectedCategory);
  const covers = await getCategoryCovers();

  const albums = categories.map((c) => ({
    id: c,
    name: c,
    coverUrl: covers[c],
  }));

  return (
    <div className="pt-20 pb-12 px-4 md:px-6">
      {/* Film strip at top */}
      <FilmStrip
        photos={photos.map((p) => ({
          id: p.id,
          title: p.title,
          imageUrl: p.imageUrl,
        }))}
      />

      {/* Album selector at bottom */}
      <div className="mt-16">
        <AlbumSelectorWrapper
          albums={albums}
          selectedId={selectedCategory}
        />
      </div>
    </div>
  );
}
