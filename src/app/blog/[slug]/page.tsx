import { notFound } from "next/navigation";
import { prisma } from "@/lib/db";
import { MarkdownRenderer } from "@/components/blog/markdown-renderer";

async function getPost(slug: string) {
  return prisma.post.findUnique({ where: { slug } });
}

export default async function PostPage({
  params,
}: {
  params: { slug: string };
}) {
  const post = await getPost(params.slug);
  if (!post || !post.published) notFound();

  return (
    <div className="pt-20 pb-12 px-6 max-w-3xl mx-auto">
      <h1 className="text-2xl font-medium mb-4">{post.title}</h1>
      <div className="flex items-center gap-2 mb-8 text-sm text-neutral-500">
        {post.publishedAt && (
          <span>{new Date(post.publishedAt).toLocaleDateString("zh-CN")}</span>
        )}
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded text-xs"
          >
            {tag}
          </span>
        ))}
      </div>
      <MarkdownRenderer content={post.content} />
    </div>
  );
}

export async function generateStaticParams() {
  try {
    const posts = await prisma.post.findMany({
      where: { published: true },
      select: { slug: true },
    });
    return posts.map((post) => ({ slug: post.slug }));
  } catch {
    return [];
  }
}
