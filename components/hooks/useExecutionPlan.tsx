import { FlowToExecutionPlan } from "@/lib/workflow/executionPlan";
import { AppNode } from "@/types/appNode";
import { useReactFlow } from "@xyflow/react";
import { useCallback } from "react";
import { useFlowValidationStore } from "../store/FlowValidationStore";
import { toast } from "sonner";
import {
  FlowToExecutionPlanError,
  FlowToExecutionPlanValidationError,
} from "@/types/workflow";

const useExecutionPlan = () => {
  const { toObject } = useReactFlow();
  const setInvalidInputs = useFlowValidationStore(
    (state) => state.setInvalidInputs
  );
  const clearErrors = useFlowValidationStore((state) => state.clearErrors);

  const handleErrors = useCallback(
    (error: FlowToExecutionPlanError) => {
      switch (error.type) {
        case FlowToExecutionPlanValidationError.NO_ENTRY_POINT:
          toast.error("No entry point found");
          break;
        case FlowToExecutionPlanValidationError.INVALID_INPUTS:
          toast.error("Not All inputs are provided");
          if (error.inValidElements) setInvalidInputs(error.inValidElements);
          break;
        default:
          toast.error("Something went wrong");
          break;
      }
    },
    [setInvalidInputs]
  );

  const generateExecutionPlan = useCallback(() => {
    const { nodes, edges } = toObject();
    const { executionPlan, error } = FlowToExecutionPlan(
      nodes as AppNode[],
      edges
    );

    if (error) {
      handleErrors(error);
      return null;
    }

    clearErrors();

    return executionPlan;
  }, [toObject, handleErrors, clearErrors]);

  return generateExecutionPlan;
};

export default useExecutionPlan;
