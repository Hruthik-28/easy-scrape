import { AppEdge } from "@/types/appEdge";
import { Connection } from "@xyflow/react";

export function CreateFlowEdge(connection: Connection): AppEdge {
  return {
    id: crypto.randomUUID(),
    ...connection,
    type: "EasyScrapeEdge",
    animated: true,
  };
}
