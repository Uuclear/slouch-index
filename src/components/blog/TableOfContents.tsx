'use client';

import { useState, useEffect } from 'react';

interface TableOfContentsProps {
  markdownContent: string;
}

export default function TableOfContents({ markdownContent }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<{ id: string; text: string; level: number }[]>([]);
  const [activeId, setActiveId] = useState('');

  useEffect(() => {
    // Parse markdown headings (H2 and H3)
    const headingRegex = /^(#{2,3})\s+(.+)$/gm;
    const matches: RegExpMatchArray[] = [];
    let match;
    while ((match = headingRegex.exec(markdownContent)) !== null) {
      matches.push(match);
    }

    const parsedHeadings = matches.map((match, index) => ({
      id: `heading-${index}`,
      text: match[2].trim(),
      level: match[1].length,
    }));

    setHeadings(parsedHeadings);
  }, [markdownContent]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '-20% 0% -60% 0%' }
    );

    headings.forEach((heading) => {
      const element = document.getElementById(heading.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [headings]);

  if (headings.length === 0) return null;

  return (
    <nav className="bg-surface border border-surfaceHighlight rounded-lg p-4 sticky top-24">
      <h3 className="text-sm font-semibold text-accent mb-3">目录</h3>
      <ul className="space-y-2">
        {headings.map((heading) => (
          <li
            key={heading.id}
            style={{ paddingLeft: `${(heading.level - 2) * 12}px` }}
          >
            <a
              href={`#${heading.id}`}
              className={`text-sm transition-colors block py-1 ${
                activeId === heading.id
                  ? 'text-accent'
                  : 'text-textSecondary hover:text-textPrimary'
              }`}
            >
              {heading.text}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
