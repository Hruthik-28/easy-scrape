"use server";

import prisma from "@/lib/prisma";
import { ExecuteWorkflow } from "@/lib/workflow/executeWorkflow";
import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { TaskRegistry } from "@/lib/workflow/task/TaskRegistry";
import {
  ExecutionPhaseStatus,
  Workflow,
  WorkflowExecutionPlan,
  WorkflowExecutionStatus,
  WorkflowExecutionTrigger,
} from "@/types/workflow";
import { auth } from "@clerk/nextjs/server";
import { revalidatePath } from "next/cache";

export async function RunWorkflow({
  workflowId,
  flowDefinition,
}: {
  workflowId: string;
  flowDefinition?: string;
}) {
  const { userId } = await auth();

  if (!userId) {
    throw new Error("Authentication required");
  }

  if (!workflowId) {
    throw new Error("Workflow Id is required");
  }

  const workflow = await prisma.workflow.findUnique({
    where: { userId, id: workflowId },
  });

  if (!workflow) {
    throw new Error("Workflow Not found");
  }

  if (!flowDefinition) {
    throw new Error("flowDefinition is not defined");
  }

  const flow = JSON.parse(flowDefinition) as Workflow;
  const result = FlowToExecutionPlan(flow.nodes, flow.edges);

  if (result.error) {
    console.error(result.error);
    throw new Error("flow defination is not valid");
  }

  if (!result.executionPlan) {
    throw new Error("Failed to generate execution plan");
  }

  const executionPlan: WorkflowExecutionPlan = result.executionPlan;

  const workflowExecution = await prisma.workflowExecution.create({
    data: {
      workflowId,
      userId,
      status: WorkflowExecutionStatus.PENDING,
      trigger: WorkflowExecutionTrigger.MANUAL,
      startedAt: new Date(),
      phases: {
        create: executionPlan.flatMap(({ phase, nodes }) =>
          nodes.flatMap((node) => {
            return {
              userId,
              status: ExecutionPhaseStatus.CREATED,
              number: phase,
              node: JSON.stringify(node),
              name: TaskRegistry[node.data.type].label,
            };
          })
        ),
      },
    },
    select: {
      id: true,
      phases: true,
    },
  });

  if (!workflowExecution) {
    throw new Error("Failed to create WorkflowExecution");
  }

  const executedWorkflow = ExecuteWorkflow(workflowExecution.id); // run this on background

  revalidatePath("/workflow/runs");

  return {
    success: true,
    data: {
      workflowId,
      executionId: workflowExecution.id,
    },
  };
}
