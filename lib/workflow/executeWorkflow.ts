import "server-only"; // This import make sures that this Fn can be used only on server side
import prisma from "../prisma";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { ExecutionPhase, Workflow, WorkflowExecution } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/TaskRegistry";
import { waitFor } from "../helpers/waitFor";

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: {
      workflow: true,
      phases: true,
    },
  });

  if (!execution) {
    console.error(`Execution with ID ${executionId} not found.`);
    throw new Error("Execution not found");
  }

  const environment = { phases: {} };

  await initializeWorkflowExecution(execution.id, execution.workflowId);

  await initializePhasesStatuses(execution);

  let creditsConsumed = 0;
  let executionFailed = false;
  for (const phase of execution.phases) {
    const phaseExecution = await executeWorkflowPhase(phase);
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  // finialize execution
  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    executionFailed,
    creditsConsumed
  );
  // TODO: clean up environment
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string
) {
  const updatedExecution = await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  });
  const updatedWorkflow = await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      lastRunAt: new Date(),
      lastRunId: updatedExecution.id,
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
    },
  });

  console.log(updatedWorkflow);
}

type WorkflowExecutionWithWorkflowAndPhases = WorkflowExecution & {
  workflow: Workflow;
  phases: ExecutionPhase[];
};

async function initializePhasesStatuses(
  execution: WorkflowExecutionWithWorkflowAndPhases
) {
  await prisma.executionPhase.updateMany({
    where: {
      id: {
        in: execution.phases.map((phase) => phase.id),
      },
    },
    data: {
      status: ExecutionPhaseStatus.PENDING,
    },
  });
}

async function finalizeWorkflowExecution(
  executionId: string,
  workflowId: string,
  executionFailed: boolean,
  creditsConsumed: number
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      status: finalStatus,
      completedAt: new Date(),
      creditsConsumed,
    },
  });

  await prisma.workflow
    .update({
      where: {
        id: workflowId,
        lastRunId: executionId, //ensure only latest execution can update the workflow
      },
      data: {
        lastRunStatus: finalStatus,
      },
    })
    .catch((err) => {
      // ignore
      // this means that we have triggered other runs for this workflow
      // while an execution was running
    });
}

async function executeWorkflowPhase(phase: ExecutionPhase) {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;

  // update phase status
  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      startedAt,
      status: ExecutionPhaseStatus.RUNNING,
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;
  console.log(
    `Executing phase ${phase.name} with ${creditsRequired}credits required`
  );

  // TODO: decrement userBalance credits with credit consumed

  // Execute phase simulation
  await waitFor(3000);
  const success = Math.random() < 0.9;

  await finializePhase(phase.id, success);

  return { success };
}

async function finializePhase(phaseId: string, success: boolean) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: { id: phaseId },
    data: {
      completedAt: new Date(),
      status: finalStatus,
    },
  });
}
