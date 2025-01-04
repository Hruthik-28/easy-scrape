import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskRegistry } from "@/lib/workflow/task/TaskRegistry";
import { AppNode } from "@/types/appNode";
import { TaskType } from "@/types/task";
import { useReactFlow } from "@xyflow/react";
import { CoinsIcon, CopyIcon, GripVerticalIcon, TrashIcon } from "lucide-react";
import React from "react";

function NodeHeader({
  taskType,
  nodeId,
}: {
  taskType: TaskType;
  nodeId: string;
}) {
  const { getNode, deleteElements, addNodes } = useReactFlow();
  const task = TaskRegistry[taskType];

  const deleteNode = () => {
    deleteElements({ nodes: [{ id: nodeId }] });
  };

  const copyNode = () => {
    const node = getNode(nodeId) as AppNode;
    if (!node) return;
    const newX = node.position.x;
    const newY = node.position.y + node.measured?.height + 20;
    addNodes(CreateFlowNode(node.data.type, { x: newX, y: newY }));
  };

  return (
    <div className="flex items-center gap-2 p-2">
      <task.icon size={16} />
      <div className="flex items-center justify-between w-full">
        <p className="text-xs uppercase text-muted-foreground font-semibold">
          {task.label}
        </p>
        <div className="flex gap-1 items-center">
          {task.isEntryPoint && <Badge>Entry Point</Badge>}
          <Badge className="flex gap-2 items-center text-xs">
            <CoinsIcon size={16} /> {task.credits}
          </Badge>
          {!task.isEntryPoint && (
            <>
              <Button size={"icon"} variant={"ghost"} onClick={deleteNode}>
                <TrashIcon size={12} />
              </Button>
              <Button size={"icon"} variant={"ghost"} onClick={copyNode}>
                <CopyIcon size={12} />
              </Button>
            </>
          )}
          <Button
            variant={"ghost"}
            size={"icon"}
            className="drag-handle cursor-grab"
          >
            <GripVerticalIcon size={16} />
          </Button>
        </div>
      </div>
    </div>
  );
}

export default NodeHeader;
