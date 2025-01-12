import { LucideProps } from "lucide-react";
import { TaskParam, TaskType } from "./task";
import { AppNode, AppNodeMissingInputs } from "./appNode";
import { AppEdge } from "./appEdge";
import { Viewport } from "@xyflow/react";

export interface Workflow {
  nodes: AppNode[];
  edges: AppEdge[];
  viewport: Viewport;
}

export enum WorkflowStatus {
  DRAFT = "DRAFT",
  PUBLISHED = "PUBLISHED",
}

export type WorkflowTask = {
  type: TaskType;
  label: string;
  icon: React.FC<LucideProps>;
  isEntryPoint: boolean;
  inputs: TaskParam[];
  outputs: TaskParam[];
  credits: number;
};

export type WorkflowExecutionPlanPhase = {
  phase: number;
  nodes: AppNode[];
};

export type WorkflowExecutionPlan = WorkflowExecutionPlanPhase[];

export enum FlowToExecutionPlanValidationError {
  NO_ENTRY_POINT = "NO_ENTRY_POINT",
  INVALID_INPUTS = "INVALID_INPUTS",
}

export type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
  error?: FlowToExecutionPlanError;
};

export type FlowToExecutionPlanError = {
  type: FlowToExecutionPlanValidationError;
  inValidElements?: AppNodeMissingInputs[];
};

export enum WorkflowExecutionStatus {
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}
export enum ExecutionPhaseStatus {
  CREATED = "CREATED",
  PENDING = "PENDING",
  RUNNING = "RUNNING",
  COMPLETED = "COMPLETED",
  FAILED = "FAILED",
}

export enum WorkflowExecutionTrigger{
  MANUAL = "MANUAL"
}
