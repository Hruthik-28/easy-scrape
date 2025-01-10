import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position, useEdges } from "@xyflow/react";
import React from "react";
import NodeParamField from "./NodeParamField";
import { ColorForHandle } from "./common";
import { useFlowValidationStore } from "@/components/store/FlowValidationStore";

export function NodeInputs({ children }: { children: React.ReactNode }) {
  return <div className="flex flex-col gap-2 divide-y">{children}</div>;
}

export function NodeInput({
  input,
  nodeId,
}: {
  input: TaskParam;
  nodeId: string;
}) {
  const invalidInputs = useFlowValidationStore((state) => state.invalidInputs);
  const hasErros = invalidInputs
    .find((node) => node.nodeId === nodeId)
    ?.inputs.find((inValidInput) => inValidInput === input.name);

  const edges = useEdges();
  const isConnected = edges.some(
    (edge) => edge.target === nodeId && edge.targetHandle === input.name
  );
  return (
    <div
      className={cn(
        "flex flex-col justify-start gap-2 relative p-3 bg-secondary w-full",
        hasErros && "bg-destructive/30"
      )}
    >
      {!input.hideHandle && (
        <Handle
          id={input.name}
          type="target"
          isConnectable={!isConnected}
          position={Position.Left}
          className={cn(
            "!border-2 !border-background !bg-muted-foreground !h-4 !w-4 !-left-2",
            ColorForHandle[input.type]
          )}
        />
      )}
      <NodeParamField param={input} nodeId={nodeId} disabled={isConnected} />
    </div>
  );
}
