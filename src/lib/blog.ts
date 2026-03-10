import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const blogDirectory = path.join(process.cwd(), 'content/blog');

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  category?: string;
  tags?: string[];
  description?: string;
  content: string;
}

export function getAllPosts(): BlogPost[] {
  if (!fs.existsSync(blogDirectory)) {
    return [];
  }

  const files = fs.readdirSync(blogDirectory);
  const markdownFiles = files.filter(file => file.endsWith('.md'));

  const posts: BlogPost[] = markdownFiles.map(file => {
    const slug = file.replace('.md', '');
    const filePath = path.join(blogDirectory, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data, content } = matter(fileContent);

    return {
      slug,
      title: data.title || slug,
      date: data.date || new Date().toISOString().split('T')[0],
      category: data.category,
      tags: data.tags || [],
      description: data.description,
      content,
    };
  });

  // Sort by date (newest first)
  return posts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export function getPostBySlug(slug: string): BlogPost | null {
  if (!fs.existsSync(blogDirectory)) {
    return null;
  }

  const filePath = path.join(blogDirectory, `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return null;
  }

  const fileContent = fs.readFileSync(filePath, 'utf-8');
  const { data, content } = matter(fileContent);

  return {
    slug,
    title: data.title || slug,
    date: data.date || new Date().toISOString().split('T')[0],
    category: data.category,
    tags: data.tags || [],
    description: data.description,
    content,
  };
}

export function getAllCategories(): string[] {
  const posts = getAllPosts();
  const categories = posts.map(post => post.category).filter(Boolean) as string[];
  return Array.from(new Set(categories));
}

export function getAllTags(): string[] {
  const posts = getAllPosts();
  const tags = posts.flatMap(post => post.tags || []);
  return Array.from(new Set(tags));
}
