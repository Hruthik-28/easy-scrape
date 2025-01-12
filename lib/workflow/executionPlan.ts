import { AppEdge } from "@/types/appEdge";
import { AppNode, AppNodeMissingInputs } from "@/types/appNode";
import {
  FlowToExecutionPlanType,
  FlowToExecutionPlanValidationError,
  WorkflowExecutionPlan,
  WorkflowExecutionPlanPhase,
} from "@/types/workflow";
import { TaskRegistry } from "./task/TaskRegistry";

export function FlowToExecutionPlan(
  nodes: AppNode[],
  edges: AppEdge[]
): FlowToExecutionPlanType {
  const entryPoint = nodes.find(
    (node) => TaskRegistry[node.data.type].isEntryPoint === true
  );

  if (!entryPoint) {
    return {
      error: { type: FlowToExecutionPlanValidationError.NO_ENTRY_POINT },
    };
  }

  const inputsWithErros: AppNodeMissingInputs[] = [];
  const planned = new Set<string>();

  const invalidInputs = getInvalidInputs(entryPoint, edges, planned);
  if (invalidInputs.length > 0) {
    inputsWithErros.push({
      nodeId: entryPoint.id,
      inputs: invalidInputs,
    });
  }

  // Initial execution plan (phase 1) includes the entry point node
  const executionPlan: WorkflowExecutionPlan = [
    {
      phase: 1,
      nodes: [entryPoint],
    },
  ];

  planned.add(entryPoint.id);

  for (
    let phase = 2;
    phase <= nodes.length && planned.size < nodes.length;
    phase++
  ) {
    const nextPhase: WorkflowExecutionPlanPhase = { phase, nodes: [] };

    for (const currentNode of nodes) {
      if (planned.has(currentNode.id)) {
        // current node is already planned
        continue;
      }

      // validation for currentNode
      const invalidInputs = getInvalidInputs(currentNode, edges, planned);

      if (invalidInputs.length > 0) {
        const incomers = getIncomers(currentNode, nodes, edges);
        // console.log("@incomers", incomers)
        if (incomers.every((incomer) => planned.has(incomer.id))) {
          // If all incoming edges/incomers are planned and there are still invalid inputs
          // this means that the particular node has an invalid input
          // which means that the workflow is invalid
          console.error("@invalid inputs", currentNode.id, invalidInputs);
          inputsWithErros.push({
            nodeId: currentNode.id,
            inputs: invalidInputs,
          });
        } else {
          // skip the current node for now
          continue;
        }
      }

      // At this point currentNode is valid
      nextPhase.nodes.push(currentNode);
    }

    for (const node of nextPhase.nodes) {
      planned.add(node.id);
    }
    executionPlan.push(nextPhase);
  }

  if (inputsWithErros.length > 0) {
    return {
      error: {
        type: FlowToExecutionPlanValidationError.INVALID_INPUTS,
        inValidElements: inputsWithErros,
      },
    };
  }

  return { executionPlan };
}

function getInvalidInputs(
  currentNode: AppNode,
  edges: AppEdge[],
  planned: Set<string>
) {
  const invalidInputs = [];
  const inputs = TaskRegistry[currentNode.data.type].inputs;

  for (const input of inputs) {
    const inputValue = currentNode.data.inputs[input.name];
    const isInputValueProvided = inputValue?.length > 0;

    if (isInputValueProvided) {
      // Input is fine, move on
      continue;
    }

    // If value is not provided by user manually, we need to check
    // if any output of a node is connected as input to the currentNode
    const incomingEdges = edges.filter(
      (edge) => edge.target === currentNode.id
    );

    const inputLinkedToOutput = incomingEdges.find(
      (edge) => edge.targetHandle === input.name
    );

    const requiredInputProvidedByVisitedOutput =
      input.required &&
      inputLinkedToOutput &&
      planned.has(inputLinkedToOutput.source);

    if (requiredInputProvidedByVisitedOutput) {
      // The input is required and we have a valid value for it
      // provided by a task i.e already planned
      
      continue;
    } else if (!input.required) {
      // If an input is not required but there is an output linked to it
      // we need to make sure that the output is already planned
      if (!inputLinkedToOutput) continue;
      if (inputLinkedToOutput && planned.has(inputLinkedToOutput.source)) {
        // The output is providing a value to input: The input is valid
        continue;
      }
    }

    invalidInputs.push(input.name);
  }
  return invalidInputs;
}

function getIncomers(
  node: AppNode,
  nodes: AppNode[],
  edges: AppEdge[]
): AppNode[] {
  if (!node.id) {
    return [];
  }

  const incomerIds = new Set();

  edges.forEach((edge) => {
    if (edge.target === node.id) {
      incomerIds.add(edge.source);
    }
  });

  return nodes.filter((node) => incomerIds.has(node.id));
}
