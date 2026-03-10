import { getPostBySlug, getAllPosts } from '@/lib/blog';
import { notFound } from 'next/navigation';
import TableOfContents from '@/components/blog/TableOfContents';

export function generateStaticParams() {
  const posts = getAllPosts();
  return posts.map((post) => ({
    slug: post.slug,
  }));
}

export default function BlogPost({ params }: { params: { slug: string } }) {
  const post = getPostBySlug(params.slug);

  if (!post) {
    notFound();
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-12">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* 文章内容 */}
        <article className="lg:col-span-3">
          <header className="mb-8">
            <h1 className="text-4xl font-bold mb-4 text-accent">{post.title}</h1>
            <div className="flex flex-wrap gap-4 text-sm text-textSecondary">
              <time>{post.date}</time>
              {post.category && (
                <span>· 分类：{post.category}</span>
              )}
              {post.tags && post.tags.length > 0 && (
                <span>· 标签：{post.tags.join(', ')}</span>
              )}
            </div>
          </header>

          <div className="prose prose-invert prose-lg max-w-none">
            {renderContent(post.content)}
          </div>
        </article>

        {/* 目录侧边栏 */}
        <aside className="hidden lg:block">
          <TableOfContents markdownContent={post.content} />
        </aside>
      </div>
    </div>
  );
}

// Simple markdown renderer
function renderContent(content: string) {
  // This is a simple implementation
  // For production, consider using react-markdown or similar
  const lines = content.split('\n');

  return lines.map((line, index) => {
    // Headings
    if (line.startsWith('### ')) {
      return (
        <h3 key={index} id={`heading-${index}`} className="text-xl font-bold mt-8 mb-4 text-accent">
          {line.replace('### ', '')}
        </h3>
      );
    }
    if (line.startsWith('## ')) {
      return (
        <h2 key={index} id={`heading-${index}`} className="text-2xl font-bold mt-10 mb-4 text-accent">
          {line.replace('## ', '')}
        </h2>
      );
    }
    if (line.startsWith('# ')) {
      return (
        <h1 key={index} className="text-3xl font-bold mt-12 mb-6">
          {line.replace('# ', '')}
        </h1>
      );
    }

    // Empty lines
    if (line.trim() === '') {
      return <br key={index} />;
    }

    // Regular paragraphs
    return (
      <p key={index} className="text-textPrimary leading-relaxed mb-4">
        {line}
      </p>
    );
  });
}
