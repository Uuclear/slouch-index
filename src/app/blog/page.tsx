import { prisma } from "@/lib/db";
import { PostCard } from "@/components/blog/post-card";

async function getPublishedPosts() {
  return prisma.post.findMany({
    where: { published: true },
    orderBy: { publishedAt: "desc" },
  });
}

export default async function BlogPage() {
  const posts = await getPublishedPosts();

  return (
    <div className="pt-20 pb-12 px-6 max-w-3xl mx-auto">
      <div className="space-y-6">
        {posts.map((post) => (
          <PostCard key={post.id} post={post} />
        ))}
      </div>
      {posts.length === 0 && (
        <p className="text-center text-neutral-500 mt-20">暂无博客文章</p>
      )}
    </div>
  );
}
