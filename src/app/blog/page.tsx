import { getAllPosts, getAllCategories, getAllTags } from '@/lib/blog';
import Link from 'next/link';

export default function BlogPage() {
  const posts = getAllPosts();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-accent text-center">博客</h1>

      {posts.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-textSecondary text-xl">暂无文章</p>
          <p className="text-textSecondary mt-2">第一篇文章正在路上...</p>
        </div>
      ) : (
        <div className="space-y-8">
          {/* 分类和标签 */}
          {(categories.length > 0 || tags.length > 0) && (
            <div className="flex flex-wrap gap-4 justify-center mb-8">
              {categories.map(cat => (
                <span key={cat} className="px-3 py-1 bg-surface border border-surfaceHighlight rounded-full text-sm text-textSecondary">
                  {cat}
                </span>
              ))}
              {tags.map(tag => (
                <span key={tag} className="px-3 py-1 bg-surface/50 border border-surfaceHighlight rounded-full text-sm text-textSecondary">
                  #{tag}
                </span>
              ))}
            </div>
          )}

          {/* 文章列表 */}
          {posts.map((post) => (
            <article
              key={post.slug}
              className="bg-surface border border-surfaceHighlight rounded-xl p-6 hover:border-accent transition-all glow hover:glow-lg"
            >
              <Link href={`/blog/${post.slug}`}>
                <h2 className="text-2xl font-bold mb-2 text-accent hover:opacity-80">
                  {post.title}
                </h2>
              </Link>
              <div className="flex flex-wrap gap-4 text-sm text-textSecondary mb-3">
                <time>{post.date}</time>
                {post.category && (
                  <span>· {post.category}</span>
                )}
              </div>
              {post.description && (
                <p className="text-textSecondary">{post.description}</p>
              )}
              <Link
                href={`/blog/${post.slug}`}
                className="inline-block mt-4 text-accent hover:opacity-80"
              >
                阅读全文 →
              </Link>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
