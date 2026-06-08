"use client";

import { motion } from "framer-motion";

interface Project {
  id: string;
  name: string;
  description: string | null;
  url: string | null;
  language: string | null;
  stars: number;
}

export function ProjectCard({ project }: { project: Project }) {
  return (
    <motion.a
      href={project.url || "#"}
      target="_blank"
      rel="noopener noreferrer"
      className="block p-6 bg-white dark:bg-neutral-900 rounded-lg border border-neutral-200 dark:border-neutral-800 card-hover"
      whileHover={{ y: -8, boxShadow: "0 12px 30px rgba(0,0,0,0.1)" }}
      transition={{ duration: 0.3 }}
    >
      <h3 className="text-lg font-medium mb-2">{project.name}</h3>
      {project.description && (
        <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4 line-clamp-2">
          {project.description}
        </p>
      )}
      <div className="flex items-center gap-4 text-xs text-neutral-500">
        {project.language && (
          <span className="flex items-center gap-1">
            <span className="w-2 h-2 rounded-full bg-blue-500" />
            {project.language}
          </span>
        )}
        {project.stars > 0 && <span>⭐ {project.stars}</span>}
      </div>
    </motion.a>
  );
}
