import "server-only"; // makes this Function unusable in client components
import prisma from "../prisma";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { ExecutionPhase, Workflow, WorkflowExecution } from "@prisma/client";
import { waitFor } from "../helpers/waitFor";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/TaskRegistry";

export async function ExecuteWorkflow(executionId: string) {
  const execution = await prisma.workflowExecution.findUnique({
    where: { id: executionId },
    include: {
      workflow: true,
      phases: true,
    },
  });

  if (!execution) {
    throw new Error(`No worfklow execution found for Id: ${executionId}`);
  }

  // const environment = { phases: {} };

  await initializeWorkflowExecution(execution.id, execution.workflowId);
  await initializePhasesStatuses(execution);

  let executionFailed = false;
  let creditsConsumed = 0;
  for (const phase of execution.phases) {
    // await waitFor(2000);
    const phaseExecution = await executeWorkflowPhase(phase);
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
    creditsConsumed += 1; // dummy credits consume (remove later)
  }

  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    creditsConsumed,
    executionFailed
  );

  // TODO: clean up the environment
}

async function initializeWorkflowExecution(
  executionId: string,
  workflowId: string
) {
  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      startedAt: new Date(),
      status: WorkflowExecutionStatus.RUNNING,
    },
  });

  await prisma.workflow.update({
    where: { id: workflowId },
    data: {
      lastRunAt: new Date(),
      lastRunId: executionId,
      lastRunStatus: WorkflowExecutionStatus.RUNNING,
    },
  });
}

type ExecutionWithWorkflowAndPhases = WorkflowExecution & {
  workflow: Workflow;
  phases: ExecutionPhase[];
};

async function initializePhasesStatuses(
  execution: ExecutionWithWorkflowAndPhases
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
  creditsConsumed: number,
  executionFailed: boolean
) {
  const finalStatus = executionFailed
    ? WorkflowExecutionStatus.FAILED
    : WorkflowExecutionStatus.COMPLETED;

  await prisma.workflowExecution.update({
    where: { id: executionId },
    data: {
      status: finalStatus,
      creditsConsumed,
      completedAt: new Date(),
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    .catch((err) => {
      // ignore
      // this means we have triggered other runs of this workflows
      // while and execution was running
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
  console.log(`Executing phase ${phase.name} with credits ${creditsRequired}`);

  // TODO: decrement user balance with required credits

  await waitFor(3000);
  const success = true;

  await finalizeExecutionPhase(phase.id, success);

  return { success };
}
async function finalizeExecutionPhase(phaseId: string, success: boolean) {
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
