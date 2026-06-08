import { prisma } from "@/lib/db";

async function getStats() {
  const [photoCount, postCount, projectCount] = await Promise.all([
    prisma.photo.count(),
    prisma.post.count(),
    prisma.project.count(),
  ]);
  return { photoCount, postCount, projectCount };
}

export default async function AdminDashboard() {
  const stats = await getStats();

  return (
    <div>
      <h1 className="text-xl font-medium mb-8">仪表盘</h1>
      <div className="grid grid-cols-3 gap-6">
        <div className="p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 mb-2">摄影作品</p>
          <p className="text-2xl font-medium">{stats.photoCount}</p>
        </div>
        <div className="p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 mb-2">博客文章</p>
          <p className="text-2xl font-medium">{stats.postCount}</p>
        </div>
        <div className="p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800">
          <p className="text-sm text-neutral-500 mb-2">GitHub项目</p>
          <p className="text-2xl font-medium">{stats.projectCount}</p>
        </div>
      </div>
    </div>
  );
}
