import { prisma } from "@/lib/db";
import { ProjectCard } from "@/components/projects/project-card";

async function getFeaturedProjects() {
  return prisma.project.findMany({
    where: { featured: true },
    orderBy: { stars: "desc" },
  });
}

export default async function ProjectsPage() {
  const projects = await getFeaturedProjects();

  return (
    <div className="pt-20 pb-12 px-6 max-w-4xl mx-auto">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {projects.map((project) => (
          <ProjectCard key={project.id} project={project} />
        ))}
      </div>
      {projects.length === 0 && (
        <p className="text-center text-neutral-500 mt-20">
          暂无展示项目，请在后台管理中筛选 GitHub 项目
        </p>
      )}
    </div>
  );
}
