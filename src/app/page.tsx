'use client';

import Link from 'next/link';

const socialLinks = [
  {
    name: 'Instagram',
    url: 'https://instagram.com/uniq_slouch',
    username: '@uniq_slouch',
    description: '摄影与生活记录',
    avatar: '/images/avatars/instagram.png',
  },
  {
    name: 'GitHub',
    url: 'https://github.com/Uuclear',
    username: 'Uuclear',
    description: '代码与开源项目',
    avatar: '/images/avatars/github.png',
  },
  {
    name: 'QQ 空间',
    url: 'https://user.qzone.qq.com/382563984',
    username: '382563984',
    description: '心情与动态',
    avatar: '/images/avatars/qq.png',
  },
  {
    name: '哔哩哔哩',
    url: 'https://space.bilibili.com/2990769',
    username: 'UID: 2990769',
    description: '视频与创作',
    avatar: '/images/avatars/bilibili.png',
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
  return (
    <div className="min-h-screen">
      {/* Social Links */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-accent">社交媒体</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {socialLinks.map((link) => (
              <a
                key={link.name}
                href={link.url}
                target="_blank"
                rel="noopener noreferrer"
                className="group relative bg-surface border border-surfaceHighlight rounded-xl overflow-hidden hover:border-accent transition-all duration-300 glow hover:glow-lg"
              >
                {/* 头像容器 - 覆盖文字 */}
                <div className="relative w-full aspect-square overflow-hidden bg-surfaceHighlight">
                  <img
                    src={link.avatar}
                    alt={link.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:-translate-y-8"
                  />
                </div>

                {/* 文字信息 - 被头像覆盖，悬停时显示 */}
                <div className="absolute inset-0 flex flex-col justify-end p-4 pointer-events-none">
                  <div className="transform transition-transform duration-500 translate-y-8 group-hover:translate-y-0">
                    <h3 className="text-sm font-semibold text-center text-white drop-shadow-lg opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-100">
                      {link.name}
                    </h3>
                    <p className="text-xs text-center text-gray-200 drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-150">
                      {link.username}
                    </p>
                    <p className="text-xs text-center text-gray-300 drop-shadow-md opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200">
                      {link.description}
                    </p>
                  </div>
                </div>
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-12 px-4">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-2xl font-bold mb-8 text-center text-accent">探索</h2>
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
