import { AppNodeMissingInputs } from "@/types/appNode";
import { create } from "zustand";

type FlowValidation = {
  invalidInputs: AppNodeMissingInputs[];
  setInvalidInputs: (input: AppNodeMissingInputs[]) => void;
  clearErrors: () => void;
};

export const useFlowValidationStore = create<FlowValidation>((set) => ({
  invalidInputs: [],
  setInvalidInputs: (input: AppNodeMissingInputs[]) =>
    set({ invalidInputs: input }),
  clearErrors: () => set({ invalidInputs: [] }),
}));
