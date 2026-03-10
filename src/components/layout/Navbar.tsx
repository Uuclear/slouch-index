import Link from 'next/link';

export default function Navbar() {
  const navItems = [
    { href: '/', label: '首页' },
    { href: '/blog', label: '博客' },
    { href: '/gallery', label: '摄影' },
    { href: '/tools', label: '工具' },
    { href: '/links', label: '外链' },
  ];

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/80 backdrop-blur-md border-b border-surfaceHighlight">
      <div className="max-w-6xl mx-auto px-4 py-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold text-accent glow">
            SLŌUCH
          </Link>
          <div className="flex gap-6">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="text-textSecondary hover:text-accent transition-colors"
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
