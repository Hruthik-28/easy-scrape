import { LucideProps } from "lucide-react";
import { TaskParam, TaskType } from "./task";
import { AppNode, AppNodeMissingInputs } from "./appNode";

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
  "NO_ENTRY_POINT",
  "INVALID_INPUTS",
}

export type FlowToExecutionPlanType = {
  executionPlan?: WorkflowExecutionPlan;
  error?: FlowToExecutionPlanError;
};

export type FlowToExecutionPlanError = {
  type: FlowToExecutionPlanValidationError;
  inValidElements?: AppNodeMissingInputs[];
};