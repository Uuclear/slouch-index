const links = [
  {
    title: '福利吧',
    url: 'https://fuliba2023.net',
    description: '精选资源分享',
  },
];

export default function LinksPage() {
  return (
    <div className="max-w-2xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-accent text-center">外链导航</h1>

      <div className="space-y-4">
        {links.map((link) => (
          <a
            key={link.title}
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="block bg-surface border border-surfaceHighlight rounded-xl p-6 hover:border-accent transition-all glow hover:glow-lg group"
          >
            <h2 className="text-xl font-bold mb-2 text-accent group-hover:opacity-80">
              {link.title}
            </h2>
            <p className="text-textSecondary mb-2">{link.description}</p>
            <p className="text-accent text-sm">→ 访问链接</p>
          </a>
        ))}
      </div>

      <p className="text-center text-textSecondary mt-8 text-sm">
        更多链接敬请期待...
      </p>
    </div>
  );
}
