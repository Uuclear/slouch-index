import { PrismaClient } from "../src/generated/prisma/client";
import { PrismaPg } from "@prisma/adapter-pg";
import bcrypt from "bcryptjs";

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL!,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  // 创建管理员用户
  const hashedPassword = await bcrypt.hash(
    process.env.ADMIN_PASSWORD || "admin123",
    10
  );
  await prisma.user.upsert({
    where: { email: process.env.ADMIN_EMAIL || "admin@slouch.dev" },
    update: {},
    create: {
      email: process.env.ADMIN_EMAIL || "admin@slouch.dev",
      password: hashedPassword,
      name: "Slouch",
      role: "admin",
    },
  });

  // 创建示例摄影作品
  const categories = ["风景", "人像", "城市", "街拍"];
  for (const category of categories) {
    for (let i = 1; i <= 5; i++) {
      await prisma.photo.create({
        data: {
          title: `${category}作品 ${i}`,
          description: `${category}类摄影作品示例`,
          category,
          imageUrl: `https://picsum.photos/800/600?random=${category}-${i}`,
          order: i,
        },
      });
    }
  }

  // 创建示例博客文章
  await prisma.post.create({
    data: {
      title: "欢迎使用 Slouch 博客",
      content: "# 欢迎\n\n这是你的第一篇博客文章。使用 **Markdown** 语法编写。",
      excerpt: "这是你的第一篇博客文章",
      slug: "welcome",
      published: true,
      tags: ["博客", "教程"],
      publishedAt: new Date(),
    },
  });

  console.log("Seed data created successfully");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
