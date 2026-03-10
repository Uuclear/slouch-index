export default function Footer() {
  return (
    <footer className="border-t border-surfaceHighlight mt-20">
      <div className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-textSecondary text-sm">
            © 2026 SLŌUCH. All rights reserved.
          </p>
          <div className="flex gap-4">
            <a
              href="https://instagram.com/uniq_slouch"
              target="_blank"
              rel="noopener noreferrer"
              className="text-textSecondary hover:text-accent transition-colors"
            >
              Instagram
            </a>
            <a
              href="https://github.com/Uuclear"
              target="_blank"
              rel="noopener noreferrer"
              className="text-textSecondary hover:text-accent transition-colors"
            >
              GitHub
            </a>
            <span className="text-textSecondary">
              QQ: 382563984
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
}
