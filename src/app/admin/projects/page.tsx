"use client";

import { useState, useEffect } from "react";

interface Project {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  language: string | null;
  stars: number;
  featured: boolean;
}

export default function AdminProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [syncing, setSyncing] = useState(false);

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await fetch("/api/projects");
    const data = await res.json();
    setProjects(data);
  };

  const handleSync = async () => {
    setSyncing(true);
    await fetch("/api/github/sync", { method: "POST" });
    await fetchProjects();
    setSyncing(false);
  };

  const handleToggleFeatured = async (project: Project) => {
    await fetch("/api/projects", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id: project.id,
        featured: !project.featured,
      }),
    });
    fetchProjects();
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-xl font-medium">GitHub 项目管理</h1>
        <button
          onClick={handleSync}
          disabled={syncing}
          className="px-4 py-2 bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 rounded-lg text-sm disabled:opacity-50"
        >
          {syncing ? "同步中..." : "同步 GitHub"}
        </button>
      </div>

      <div className="space-y-3">
        {projects.map((project) => (
          <div
            key={project.id}
            className="flex items-center justify-between p-4 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800"
          >
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm font-medium">{project.name}</h3>
                {project.language && (
                  <span className="text-xs text-neutral-500">
                    {project.language}
                  </span>
                )}
                {project.stars > 0 && (
                  <span className="text-xs text-neutral-500">
                    ⭐ {project.stars}
                  </span>
                )}
              </div>
              {project.description && (
                <p className="text-xs text-neutral-500 mt-1 line-clamp-1">
                  {project.description}
                </p>
              )}
            </div>
            <button
              onClick={() => handleToggleFeatured(project)}
              className={`text-xs px-3 py-1 rounded border ${
                project.featured
                  ? "bg-neutral-800 dark:bg-neutral-200 text-white dark:text-neutral-900 border-transparent"
                  : "border-neutral-300 dark:border-neutral-700"
              }`}
            >
              {project.featured ? "展示中" : "设为展示"}
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
