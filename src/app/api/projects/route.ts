import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const projects = await prisma.project.findMany({
    orderBy: { stars: "desc" },
  });
  return NextResponse.json(projects);
}

export async function PATCH(request: Request) {
  const { id, featured } = await request.json();
  const project = await prisma.project.update({
    where: { id },
    data: { featured },
  });
  return NextResponse.json(project);
}
