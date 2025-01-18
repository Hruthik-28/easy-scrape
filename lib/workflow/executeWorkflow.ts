import "server-only"; // makes this Function unusable in client components
import prisma from "../prisma";
import {
  ExecutionPhaseStatus,
  WorkflowExecutionStatus,
} from "@/types/workflow";
import { ExecutionPhase, Workflow, WorkflowExecution } from "@prisma/client";
import { AppNode } from "@/types/appNode";
import { TaskRegistry } from "./task/TaskRegistry";
import { ExecutorRegistory } from "./executor/executorRegistory";
import { Environment, ExecutionEnvironment } from "@/types/executor";
import { TaskParamType } from "@/types/task";
import { Browser, Page } from "puppeteer-core";
import { AppEdge } from "@/types/appEdge";
import { LogCollector } from "@/types/logCollector";
import { createLogCollector } from "../log";

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

  const edges = JSON.parse(execution.defination).edges as AppEdge[];

  const environment: Environment = { phases: {} };

  await initializeWorkflowExecution(execution.id, execution.workflowId);
  await initializePhasesStatuses(execution);

  let executionFailed = false;
  const creditsConsumed = 0; // TODO: make use of this
  for (const phase of execution.phases) {
    const logCollector = createLogCollector();
    const phaseExecution = await executeWorkflowPhase(
      phase,
      environment,
      edges,
      logCollector
    );
    console.log(logCollector.getAll());
    if (!phaseExecution.success) {
      executionFailed = true;
      break;
    }
  }

  await finalizeWorkflowExecution(
    executionId,
    execution.workflowId,
    creditsConsumed,
    executionFailed
  );

  // clean up the environment
  await cleanupEnvironment(environment);
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

async function executeWorkflowPhase(
  phase: ExecutionPhase,
  environment: Environment,
  edges: AppEdge[],
  logCollector: LogCollector
) {
  const startedAt = new Date();
  const node = JSON.parse(phase.node) as AppNode;

  await setUpEnvironmentForPhase(node, environment, edges);

  // update phase status
  await prisma.executionPhase.update({
    where: { id: phase.id },
    data: {
      startedAt,
      status: ExecutionPhaseStatus.RUNNING,
      inputs: JSON.stringify(environment.phases[node.id].inputs),
    },
  });

  const creditsRequired = TaskRegistry[node.data.type].credits;
  console.log(`Executing phase ${phase.name} with credits ${creditsRequired}`);

  // TODO: decrement user balance with required credits

  const success = await executePhase(phase, node, environment, logCollector);
  const outputs = environment.phases[node.id].outputs;
  await finalizeExecutionPhase(phase.id, success, outputs, logCollector);

  return { success };
}

async function finalizeExecutionPhase(
  phaseId: string,
  success: boolean,
  outputs: any,
  logCollector: LogCollector
) {
  const finalStatus = success
    ? ExecutionPhaseStatus.COMPLETED
    : ExecutionPhaseStatus.FAILED;

  await prisma.executionPhase.update({
    where: { id: phaseId },
    data: {
      completedAt: new Date(),
      status: finalStatus,
      outputs: JSON.stringify(outputs),
      logs: {
        createMany: {
          data: logCollector.getAll().map((log) => ({
            logLevel: log.level,
            message: log.message,
            timeStamp: log.timestamp,
          })),
        },
      },
    },
  });
}

async function executePhase(
  phase: ExecutionPhase,
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): Promise<boolean> {
  const runFn = ExecutorRegistory[node.data.type];
  if (!runFn) {
    return false;
  }

  const executionEnvironment: ExecutionEnvironment<any> =
    createExecutionEnvironment(node, environment, logCollector);

  return await runFn(executionEnvironment);
}

async function setUpEnvironmentForPhase(
  node: AppNode,
  environment: Environment,
  edges: AppEdge[]
) {
  environment.phases[node.id] = { inputs: {}, outputs: {} };

  const nodeInputs = TaskRegistry[node.data.type].inputs;

  for (const input of nodeInputs) {
    if (input.type === TaskParamType.BROWSER_INSTANCE) {
      continue;
    }

    const inputValue = node.data.inputs[input.name];
    if (inputValue) {
      environment.phases[node.id].inputs[input.name] = inputValue;
      continue;
    }

    // handle input coming from output of other node
    const connectedEdge = edges.find(
      (edge) => edge.target === node.id && edge.targetHandle === input.name
    );

    if (!connectedEdge) {
      console.error(
        `Missing edge for input: ${input.name} node id: ${node.id}`
      );
      continue;
    }

    const outputValue =
      environment.phases[connectedEdge.source].outputs[
        connectedEdge.sourceHandle!
      ];

    environment.phases[node.id].inputs[input.name] = outputValue;
  }

  return environment;
}

function createExecutionEnvironment(
  node: AppNode,
  environment: Environment,
  logCollector: LogCollector
): ExecutionEnvironment<any> {
  return {
    getInput: (name: string) => environment.phases[node.id]?.inputs[name],
    setOutput: (name: string, value: string) =>
      (environment.phases[node.id].outputs[name] = value),

    getBrowser: () => environment.browser,
    setBrowser: (browser: Browser) => (environment.browser = browser),

    getPage: () => environment.page,
    setPage: (page: Page) => (environment.page = page),

    log: logCollector,
  };
}

async function cleanupEnvironment(environment: Environment) {
  if (environment.browser) {
    await environment.browser
      .close()
      .then(() => console.log("Browser closed"))
      .catch((err) => console.error("Cannot close the browser", err));
  }
}
