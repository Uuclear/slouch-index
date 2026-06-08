"use client";

import { useState, useEffect } from "react";

interface Photo {
  id: string;
  title: string;
  description: string | null;
  category: string;
  imageUrl: string;
  order: number;
}

export default function AdminPhotosPage() {
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "风景",
    imageUrl: "",
    order: 0,
  });

  useEffect(() => {
    fetchPhotos();
  }, []);

  const fetchPhotos = async () => {
    const res = await fetch("/api/photos");
    const data = await res.json();
    setPhotos(data);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/photos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(form),
    });
    setForm({ title: "", description: "", category: "风景", imageUrl: "", order: 0 });
    setShowForm(false);
    fetchPhotos();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("确认删除？")) return;
    await fetch("/api/photos", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    fetchPhotos();
  };

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);
    const res = await fetch("/api/photos/upload", {
      method: "POST",
      body: formData,
    });
    const data = await res.json();
    setForm((prev) => ({ ...prev, imageUrl: data.url }));
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-medium">摄影作品管理</h1>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg text-sm"
        >
          {showForm ? "取消" : "添加作品"}
        </button>
      </div>

      {showForm && (
        <form
          onSubmit={handleSubmit}
          className="mb-8 p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 space-y-4"
        >
          <input
            type="text"
            placeholder="标题"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm"
            required
          />
          <textarea
            placeholder="描述"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm"
            rows={2}
          />
          <select
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
            className="w-full px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm"
          >
            <option value="风景">风景</option>
            <option value="人像">人像</option>
            <option value="城市">城市</option>
            <option value="街拍">街拍</option>
          </select>
          <div className="flex gap-4">
            <input
              type="file"
              accept="image/*"
              onChange={handleUpload}
              className="text-sm"
            />
            <input
              type="text"
              placeholder="或输入图片URL"
              value={form.imageUrl}
              onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
              className="flex-1 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm"
            />
          </div>
          <input
            type="number"
            placeholder="排序"
            value={form.order}
            onChange={(e) => setForm({ ...form, order: parseInt(e.target.value) })}
            className="w-32 px-4 py-2 border border-neutral-300 dark:border-neutral-700 rounded-lg bg-transparent text-sm"
          />
          <button
            type="submit"
            className="px-6 py-2 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg text-sm"
          >
            保存
          </button>
        </form>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {photos.map((photo) => (
          <div
            key={photo.id}
            className="bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 overflow-hidden"
          >
            <img
              src={photo.imageUrl}
              alt={photo.title}
              className="w-full aspect-square object-cover"
            />
            <div className="p-3">
              <p className="text-sm font-medium truncate">{photo.title}</p>
              <p className="text-xs text-neutral-500">{photo.category}</p>
              <button
                onClick={() => handleDelete(photo.id)}
                className="mt-2 text-xs text-red-500 hover:text-red-700"
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
