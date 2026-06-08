import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";

export async function GET() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json(posts);
}

export async function POST(request: Request) {
  const data = await request.json();
  const post = await prisma.post.create({
    data: {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      slug: data.slug,
      published: data.published ?? false,
      tags: data.tags ?? [],
      publishedAt: data.published ? new Date() : null,
    },
  });
  return NextResponse.json(post, { status: 201 });
}

export async function PUT(request: Request) {
  const data = await request.json();
  const post = await prisma.post.update({
    where: { id: data.id },
    data: {
      title: data.title,
      content: data.content,
      excerpt: data.excerpt,
      slug: data.slug,
      published: data.published,
      tags: data.tags,
      publishedAt: data.published && !data.publishedAt ? new Date() : data.publishedAt,
    },
  });
  return NextResponse.json(post);
}

export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.post.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
