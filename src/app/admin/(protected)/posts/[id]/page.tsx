"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";

export default function AdminPostEditPage() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === "new";

  const [form, setForm] = useState({
    title: "",
    content: "",
    excerpt: "",
    slug: "",
    published: false,
    tags: "",
  });

  useEffect(() => {
    if (!isNew) {
      fetch(`/api/posts`)
        .then((res) => res.json())
        .then((posts) => {
          const post = posts.find((p: any) => p.id === params.id);
          if (post) {
            setForm({
              title: post.title,
              content: post.content,
              excerpt: post.excerpt || "",
              slug: post.slug,
              published: post.published,
              tags: post.tags.join(", "),
            });
          }
        });
    }
  }, [isNew, params.id]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      ...form,
      tags: form.tags
        .split(",")
        .map((t) => t.trim())
        .filter(Boolean),
    };

    if (isNew) {
      await fetch("/api/posts", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
    } else {
      await fetch("/api/posts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ id: params.id, ...payload }),
      });
    }
    router.push("/admin/posts");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-medium">
          {isNew ? "新建文章" : "编辑文章"}
        </h1>
        <button
          onClick={() => router.back()}
          className="text-sm text-neutral-500"
        >
          ← 返回列表
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4 max-w-3xl">
        <input
          type="text"
          placeholder="标题"
          value={form.title}
          onChange={(e) => setForm({ ...form, title: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm"
          required
        />
        <input
          type="text"
          placeholder="Slug（URL路径）"
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm"
          required
        />
        <textarea
          placeholder="文章摘要"
          value={form.excerpt}
          onChange={(e) => setForm({ ...form, excerpt: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm"
          rows={2}
        />
        <textarea
          placeholder="文章内容（Markdown）"
          value={form.content}
          onChange={(e) => setForm({ ...form, content: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm font-mono"
          rows={16}
          required
        />
        <input
          type="text"
          placeholder="标签（逗号分隔）"
          value={form.tags}
          onChange={(e) => setForm({ ...form, tags: e.target.value })}
          className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm"
        />
        <label className="flex items-center gap-2 text-sm">
          <input
            type="checkbox"
            checked={form.published}
            onChange={(e) => setForm({ ...form, published: e.target.checked })}
          />
          发布
        </label>
        <button
          type="submit"
          className="px-6 py-2 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg text-sm"
        >
          保存
        </button>
      </form>
    </div>
  );
}
