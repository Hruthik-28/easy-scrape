import { cn } from "@/lib/utils";
import { Handle, Position } from "@xyflow/react";
import React from "react";
import { ColorForHandle } from "./common";
import { TaskParam } from "@/types/task";

export function NodeOutputs({ children }: { children: React.ReactNode }) {
  return <div className="flex border flex-col gap-1 ">{children}</div>;
}

export function NodeOutput({ output }: { output: TaskParam }) {
  return (
    <div className="flex justify-end p-3 relative bg-secondary w-full">
      <p className="text-muted-foreground text-xs">{output.name}</p>
      <Handle
        id={output.name}
        position={Position.Right}
        type="source"
        className={cn(
          "!border-2 !border-background !bg-muted-foreground !h-4 !w-4 !-right-2",
          ColorForHandle[output.type]
        )}
      />
    </div>
  );
}
