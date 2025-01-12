"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetWorkflowExecutionWithPhases(executionId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated request");
  }

  const workflowExecution = await prisma.workflowExecution.findUnique({
    where: {
      id: executionId,
      userId,
    },
    include: {
      phases: {
        orderBy: {
          number: "asc",
        },
      },
    },
  });

  if (!workflowExecution) {
    throw new Error("No Executions Found");
  }

  return workflowExecution;
}
