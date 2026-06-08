import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export async function GET() {
  const photos = await prisma.photo.findMany({
    orderBy: [{ category: "asc" }, { order: "asc" }],
  });
  return NextResponse.json(photos);
}

export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const photo = await prisma.photo.create({
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      imageUrl: data.imageUrl,
      order: data.order ?? 0,
    },
  });
  return NextResponse.json(photo, { status: 201 });
}

export async function PUT(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const data = await request.json();
  const photo = await prisma.photo.update({
    where: { id: data.id },
    data: {
      title: data.title,
      description: data.description,
      category: data.category,
      imageUrl: data.imageUrl,
      order: data.order,
    },
  });
  return NextResponse.json(photo);
}

export async function DELETE(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { id } = await request.json();
  await prisma.photo.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
