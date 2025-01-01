import { cn } from "@/lib/utils";
import { TaskParam } from "@/types/task";
import { Handle, Position } from "@xyflow/react";
import React from "react";
import NodeParamField from "./NodeParamField";
import { ColorForHandle } from "./common";

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
  return (
    <div className="flex flex-col justify-start gap-2 relative p-3 bg-secondary w-full">
      {!input.hideHandle && (
        <Handle
          id={input.name}
          type="target"
          position={Position.Left}
          className={cn(
            "!border-2 !border-background !bg-muted-foreground !h-4 !w-4 !-left-2",
            ColorForHandle[input.type]
          )}
        />
      )}
      <NodeParamField param={input} nodeId={nodeId} />
    </div>
  );
}
