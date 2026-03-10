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
    <nav className="fixed top-0 left-0 right-0 z-50 bg-background/90 backdrop-blur-lg border-b border-accent/20 shadow-glow" style={{ boxShadow: '0 4px 30px rgba(124, 58, 237, 0.2)' }}>
      <div className="max-w-6xl mx-auto px-4 py-3">
        <div className="flex items-center justify-center">
          <div className="flex gap-8">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="relative text-textSecondary hover:text-accent transition-colors duration-300 text-sm font-medium tracking-wider group"
              >
                {item.label}
                <span className="absolute -bottom-1 left-0 w-0 h-px bg-accent transition-all duration-300 group-hover:w-full" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}
