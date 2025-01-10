import { NodeProps } from "@xyflow/react";
import { memo } from "react";
import NodeCard from "./NodeCard";
import NodeHeader from "./NodeHeader";
import { AppNodeData } from "@/types/appNode";
import { TaskRegistry } from "@/lib/workflow/task/TaskRegistry";
import { NodeInputs, NodeInput } from "./NodeInputs";
import { NodeOutput, NodeOutputs } from "./NodeOutputs";
import { Badge } from "@/components/ui/badge";

const DEV_MODE = process.env.NEXT_PUBLIC_DEV_MODE === "true" || false;

const NodeComponent = memo((props: NodeProps) => {
  const nodeData = props.data as AppNodeData;
  const nodeTask = TaskRegistry[nodeData.type];
  return (
    <NodeCard nodeId={props.id} isSelected={!!props.selected}>
      {DEV_MODE && <Badge>DEV: {props.id}</Badge>}
      <NodeHeader taskType={nodeData.type} nodeId={props.id} />
      <NodeInputs>
        {nodeTask?.inputs.map((taskInput) => (
          <NodeInput key={taskInput.name} input={taskInput} nodeId={props.id} />
        ))}
      </NodeInputs>
      <NodeOutputs>
        {nodeTask?.outputs.map((taskOuput) => (
          <NodeOutput key={taskOuput.name} output={taskOuput} />
        ))}
      </NodeOutputs>
    </NodeCard>
  );
});

export default NodeComponent;
NodeComponent.displayName = "NodeComponent";
