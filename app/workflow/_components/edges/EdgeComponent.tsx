import ToolTipWrapper from "@/components/ToolTipWrapper";
import { Button } from "@/components/ui/button";
import {
  BaseEdge,
  EdgeLabelRenderer,
  EdgeProps,
  getSimpleBezierPath,
  useReactFlow,
} from "@xyflow/react";
import { XIcon } from "lucide-react";
import React from "react";

function EdgeComponent(props: EdgeProps) {
  const { setEdges } = useReactFlow();
  const [edgePath, labelX, labelY] = getSimpleBezierPath(props);

  const deleteEdge = () => {
    setEdges((edges) => edges.filter((edge) => edge.id !== props.id));
  };

  return (
    <>
      <BaseEdge id={props.id} path={edgePath} style={props.style} />
      <EdgeLabelRenderer>
        <ToolTipWrapper content="Delete">
          <Button
            size={"icon"}
            variant={"outline"}
            onClick={deleteEdge}
            className="rounded-full bg-background h-5 w-5 text-xs"
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px, ${labelY}px)`,
              pointerEvents: "all",
            }}
          >
            <XIcon size={16} />
          </Button>
        </ToolTipWrapper>
      </EdgeLabelRenderer>
    </>
  );
}

export default EdgeComponent;
