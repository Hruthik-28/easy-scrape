"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function deleteWorkflow(id: string) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Authentication required");
    }

    await prisma.workflow.delete({
      where: {
        id,
        userId,
      },
    });

    revalidatePath("/workflows");
  } catch (error) {
    console.error("Error deleting workflow:", error);
    if (error instanceof Error) {
      throw new Error(`Error deleting workflow: ${error.message}`);
    }
    throw new Error("Error delete workflow");
  }
}
