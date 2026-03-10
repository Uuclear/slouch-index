'use client';

import Link from 'next/link';

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://instagram.com/uniq_slouch',
    username: '@uniq_slouch',
    description: '摄影与生活记录',
    avatar: 'https://ui-avatars.com/api/?name=I&background=7c3aed&color=fff&size=128',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/Uuclear',
    username: 'Uuclear',
    description: '代码与开源项目',
    avatar: 'https://avatars.githubusercontent.com/Uuclear',
  },
  {
    name: 'QQ 空间',
    url: 'https://user.qzone.qq.com/382563984',
    username: '382563984',
    description: '心情与动态',
    avatar: 'https://q2.qlogo.cn/headimg_dl?dst_uin=382563984&spec=100',
  },
  {
    name: '哔哩哔哩',
    url: 'https://space.bilibili.com/2990769',
    username: 'UID: 2990769',
    description: '视频与创作',
    avatar: 'https://ui-avatars.com/api/?name=B&background=fb7299&color=fff&size=128',
  },
];

const features = [
  {
    title: '博客',
    description: '技术文章与生活随笔',
    href: '/blog',
    icon: '📝',
  },
  {
    title: '摄影',
    description: '胶片风格摄影作品展示',
    href: '/gallery',
    icon: '📷',
  },
  {
    title: '工具',
    description: '实用小工具集合',
    href: '/tools',
    icon: '🛠️',
  },
  {
    title: '外链',
    description: '精选链接导航',
    href: '/links',
    icon: '🔗',
  },
];

export default function Home() {
  const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
    const target = e.target as HTMLImageElement;
    target.src = 'https://ui-avatars.com/api/?name=U&background=7c3aed&color=fff&size=128';
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-6xl font-bold mb-6 text-accent glow-lg inline-block">
            SLŌUCH
          </h1>
          <p className="text-xl text-textSecondary mb-8">
            摄影师 · 开发者 · 创作者
          </p>
          <div className="w-24 h-1 bg-accent mx-auto rounded-full glow" />
        </div>
      </section>

      {/* Social Links */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">社交媒体</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-surface p-4 rounded-xl border border-surfaceHighlight hover:border-accent transition-all glow hover:glow-lg group text-center"
              >
                <div className="w-16 h-16 mx-auto mb-3 rounded-full overflow-hidden border-2 border-surfaceHighlight group-hover:border-accent transition-colors">
                  <img
                    src={link.avatar}
                    alt={link.name}
                    className="w-full h-full object-cover"
                    onError={handleImageError}
                  />
                </div>
                <h3 className="text-sm font-semibold text-accent group-hover:text-accent/80 mb-1">
                  {link.name}
                </h3>
                <p className="text-textSecondary text-xs mb-1">{link.username}</p>
                <p className="text-textSecondary text-xs">{link.description}</p>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center">探索</h2>
          <div className="grid md:grid-cols-2 gap-4">
            {features.map((feature) => (
              <Link
                key={feature.title}
                href={feature.href}
                className="bg-surface p-6 rounded-xl border border-surfaceHighlight hover:border-accent transition-all glow hover:glow-lg group"
              >
                <div className="text-4xl mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-2 group-hover:text-accent transition-colors">
                  {feature.title}
                </h3>
                <p className="text-textSecondary">{feature.description}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
