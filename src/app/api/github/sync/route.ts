import { NextResponse } from "next/server";
import { syncGitHubProjects } from "@/lib/github";

export async function POST() {
  try {
    const username = process.env.GITHUB_USERNAME;
    if (!username) {
      return NextResponse.json(
        { error: "GITHUB_USERNAME not configured" },
        { status: 500 }
      );
    }

    const count = await syncGitHubProjects(username);
    return NextResponse.json({ synced: count });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to sync GitHub projects" },
      { status: 500 }
    );
  }
}
