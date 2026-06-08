export default function AboutPage() {
  return (
    <div className="pt-20 pb-12 px-6 max-w-2xl mx-auto">
      <div className="space-y-12">
        <div className="flex justify-center">
          <div className="w-24 h-24 rounded-full bg-neutral-200 dark:bg-neutral-800" />
        </div>

        <div className="text-center space-y-4">
          <h1 className="text-xl font-light tracking-wider">SLOUCH</h1>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
            摄影师 · 开发者 · 写作者
          </p>
        </div>

        <div className="flex justify-center gap-6">
          <a
            href="https://github.com/slouch"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            title="GitHub"
          >
            <span className="text-sm">🐙</span>
          </a>
          <a
            href="https://twitter.com/slouch"
            target="_blank"
            rel="noopener noreferrer"
            className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            title="Twitter"
          >
            <span className="text-sm">🐦</span>
          </a>
          <a
            href="mailto:hello@slouch.dev"
            className="w-10 h-10 rounded-full bg-neutral-200 dark:bg-neutral-800 flex items-center justify-center hover:bg-neutral-300 dark:hover:bg-neutral-700 transition-colors"
            title="Email"
          >
            <span className="text-sm">✉️</span>
          </a>
        </div>
      </div>
    </div>
  );
}
