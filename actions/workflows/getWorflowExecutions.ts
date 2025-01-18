"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";

export async function GetWorkflowExecutions(workflowId: string) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Unauthenticated");
  }

  const executions = await prisma.workflowExecution.findMany({
    where: { workflowId },
    orderBy: { startedAt: "desc" },
  });

  if (!executions) {
    throw new Error("No executions found with given workflowId");
  }
  
  return executions;
}
