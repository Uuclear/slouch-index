import Link from "next/link";

interface Post {
  id: string;
  title: string;
  excerpt: string | null;
  slug: string;
  tags: string[];
  publishedAt: Date | null;
}

export function PostCard({ post }: { post: Post }) {
  return (
    <Link
      href={`/blog/${post.slug}`}
      className="block p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 card-hover group"
    >
      <h3 className="text-lg font-medium mb-2 group-hover:text-neutral-600 dark:group-hover:text-neutral-300 transition-colors">
        {post.title}
      </h3>
      {post.excerpt && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
          {post.excerpt}
        </p>
      )}
      <div className="flex items-center gap-2 flex-wrap">
        {post.tags.map((tag) => (
          <span
            key={tag}
            className="text-xs px-2 py-1 bg-neutral-100 dark:bg-neutral-800 rounded"
          >
            {tag}
          </span>
        ))}
        {post.publishedAt && (
          <span className="text-xs text-neutral-400 ml-auto">
            {new Date(post.publishedAt).toLocaleDateString("zh-CN")}
          </span>
        )}
      </div>
    </Link>
  );
}
