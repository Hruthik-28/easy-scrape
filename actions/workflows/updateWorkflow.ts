"use server";

import prisma from "@/lib/prisma";
import { workflowStatus } from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function updateWorkflow({
  id,
  defination,
}: {
  id: string;
  defination: string;
}) {
  try {
    const { userId } = await auth();

    if (!userId) {
      throw new Error("Authentication required");
    }

    const workflow = await prisma.workflow.findUnique({
      where: { id, userId },
    });

    if (!workflow) {
      throw new Error("No Workflow Found");
    }

    if (workflow.status !== workflowStatus.DRAFT) {
      throw new Error("Workflow status is not draft");
    }

    await prisma.workflow.update({
      where: { id, userId },
      data: { defination },
    });

    revalidatePath(`/workflows`);
  } catch (error) {
    console.error("Error Saving workflow:", error);
    if (error instanceof Error) {
      throw new Error(`Error Saving workflow: ${error.message}`);
    }
    throw new Error("Error Saving workflow");
  }
}
