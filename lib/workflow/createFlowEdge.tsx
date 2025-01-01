import { AppEdge } from "@/types/appEdge";
import { Connection } from "@xyflow/react";

export function CreateFlowEdge(connection: Connection): AppEdge {
  const { source, target, sourceHandle, targetHandle } = connection;

  return {
    id: source + " -> " + target,
    source,
    target,
    type: "EasyScrapeEdge",
    animated: true,
    sourceHandle,
    targetHandle,
  };
}
