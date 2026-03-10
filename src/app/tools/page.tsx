import Link from 'next/link';

const tools = [
  {
    title: '天气查询',
    description: '查看实时天气预报',
    href: '/tools/weather',
    icon: '🌤️',
  },
];

export default function ToolsPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-12">
      <h1 className="text-4xl font-bold mb-8 text-accent text-center">实用工具</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {tools.map((tool) => (
          <Link
            key={tool.title}
            href={tool.href}
            className="bg-surface border border-surfaceHighlight rounded-xl p-6 hover:border-accent transition-all glow hover:glow-lg group"
          >
            <div className="text-4xl mb-4">{tool.icon}</div>
            <h2 className="text-xl font-bold mb-2 text-accent group-hover:opacity-80">
              {tool.title}
            </h2>
            <p className="text-textSecondary">{tool.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
