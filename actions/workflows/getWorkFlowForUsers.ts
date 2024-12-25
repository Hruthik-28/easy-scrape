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
    console.error("Error fetching workflows:", error);
    if (error instanceof Error) {
      throw new Error(`Error fetching workflows: ${error.message}`);
    }
    throw new Error("Error fetching workflows");
  }
}
