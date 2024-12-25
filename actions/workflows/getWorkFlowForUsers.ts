"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetWorkFlowForUsers() {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Authentication required");
    }

    return prisma.workflow.findMany({
      where: { userId },
      orderBy: { createdAt: "asc" },
    });
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Failed to fetch workflows: ${error.message}`);
    }
    throw new Error("Failed to fetch workflows");
  }
}
