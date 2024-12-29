"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  createWorkflowSchema,
  CreateWorkFlowSchemaType,
} from "@/schema/workflow";
import { workflowStatus } from "@/types/workflow";
import { AppNode } from "@/types/appNode";
import { Edge } from "@xyflow/react";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import { revalidatePath } from "next/cache";

export async function CreateWorkFlow(form: CreateWorkFlowSchemaType) {
  try {
    const { success, data } = createWorkflowSchema.safeParse(form);

    if (!success) {
      throw new Error("Invalid form data");
    }

    const { userId } = await auth();

    if (!userId) {
      throw new Error("Authentication required");
    }

    const initialFlow: { nodes: AppNode[]; edges: Edge[] } = {
      nodes: [],
      edges: [],
    };

    // create a inital flow node of Type LAUNCH_BROWSER
    initialFlow.nodes.push(CreateFlowNode(TaskType.LAUNCH_BROWSER));

    const workflow = await prisma.workflow.create({
      data: {
        userId,
        status: workflowStatus.DRAFT,
        defination: JSON.stringify(initialFlow),
        ...data,
      },
    });

    if (!workflow) {
      throw new Error("Failed to create workflow");
    }

    revalidatePath("/workflows");

    return { success: true, workflowId: workflow.id };
  } catch (error) {
    console.error("Error creating workflow:", error);
    if (error instanceof Error) {
      throw new Error(`Error creating workflow: ${error.message}`);
    }
    throw new Error("Error creating workflow");
  }
}
