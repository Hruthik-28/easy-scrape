"use client";

import { useFlowValidationStore } from "@/components/store/FlowValidationStore";
import { cn } from "@/lib/utils";
import { useReactFlow } from "@xyflow/react";
import React from "react";

function NodeCard({
  children,
  nodeId,
  isSelected,
}: {
  children: React.ReactNode;
  nodeId: string;
  isSelected: boolean;
}) {
  const { getNode, setCenter } = useReactFlow();
  const invalidInputs = useFlowValidationStore((state) => state.invalidInputs);
  const hasInvalidInputs = invalidInputs.some((node) => node.nodeId === nodeId);

  return (
    <div
      onDoubleClick={() => {
        const node = getNode(nodeId);
        if (!node) return;
        const { position, measured } = node;
        if (!position || !measured) return;
        const { width, height } = measured;
        if (!width || !height) return;
        const x = position.x + width / 2;
        const y = position.y + height / 2;
        if (x === undefined || y === undefined) return;
        setCenter(x, y, {
          zoom: 1,
          duration: 500,
        });
      }}
      className={cn(
        "rounded-md border-2 border-separate flex flex-col w-[420px] text-xs gap-1 bg-background",
        isSelected && "border-primary",
        hasInvalidInputs && "border-destructive/60 border-2"
      )}
    >
      {children}
    </div>
  );
}

export default NodeCard;
