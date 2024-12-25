"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  createWorkflowSchema,
  CreateWorkFlowSchemaType,
} from "@/schema/workflow";
import { workflowStatus } from "@/types/workflow";

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

    const workflow = await prisma.workflow.create({
      data: {
        userId,
        status: workflowStatus.DRAFT,
        defination: "TODO",
        ...data,
      },
    });

    if (!workflow) {
      throw new Error("Failed to create workflow");
    }

    return { success: true, workflowId: workflow.id };
  } catch (error) {
    console.error("Error creating workflow:", error);
    if (error instanceof Error) {
      throw new Error(`Error creating workflow: ${error.message}`);
    }
    throw new Error("Error creating workflow");
  }
}
