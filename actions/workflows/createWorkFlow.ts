"use server";

import prisma from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import {
  createWorkflowSchema,
  CreateWorkFlowSchemaType,
} from "@/schema/workflow";
import { workflowStatus } from "@/types/workflow";
import { redirect } from "next/navigation";

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

    redirect(`/workflow/editor/${workflow.id}`);
  } catch (error) {
    if (error instanceof Error) {
      throw new Error(`Error creating workflow: ${error.message}`);
    }
    throw new Error("Error creating workflow");
  }
}
