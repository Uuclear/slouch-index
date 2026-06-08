"use client";

import { useState, useEffect } from "react";
import Link from "next/link";

interface Post {
  id: string;
  title: string;
  slug: string;
  published: boolean;
  tags: string[];
  createdAt: string;
}

export default function AdminPostsPage() {
  const [posts, setPosts] = useState<Post[]>([]);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    const res = await fetch("/api/posts");
    const data = await res.json();
    setPosts(data);
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确认删除？")) return;
    await fetch("/api/posts", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchPosts();
  };

  const handleTogglePublish = async (post: Post) => {
    await fetch("/api/posts", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...post,
        published: !post.published,
      }),
    });
    fetchPosts();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-medium">博客文章管理</h1>
        <Link
          href="/admin/posts/new"
          className="px-4 py-2 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg text-sm"
        >
          新建文章
        </Link>
      </div>

      <div className="space-y-3">
        {posts.map((post) => (
          <div
            key={post.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800"
          >
            <div>
              <h3 className="text-sm font-medium">{post.title}</h3>
              <div className="flex items-center gap-2 mt-1">
                <span
                  className={`text-xs px-2 py-0.5 rounded ${
                    post.published
                      ? "bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-300"
                      : "bg-neutral-100 text-neutral-500 dark:bg-neutral-800"
                  }`}
                >
                  {post.published ? "已发布" : "草稿"}
                </span>
                <span className="text-xs text-neutral-400">
                  {new Date(post.createdAt).toLocaleDateString("zh-CN")}
                </span>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                onClick={() => handleTogglePublish(post)}
                className="text-xs px-3 py-1 border border-neutral-300 dark:border-neutral-700 rounded"
              >
                {post.published ? "取消发布" : "发布"}
              </button>
              <Link
                href={`/admin/posts/${post.id}`}
                className="text-xs px-3 py-1 border border-neutral-300 dark:border-neutral-700 rounded"
              >
                编辑
              </Link>
              <button
                onClick={() => handleDelete(post.id)}
                className="text-xs px-3 py-1 text-red-500 border border-red-300 dark:border-red-800 rounded"
              >
                删除
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
