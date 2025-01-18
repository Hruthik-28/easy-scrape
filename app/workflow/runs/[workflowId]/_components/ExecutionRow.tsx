"use client";

import { Badge } from "@/components/ui/badge";
import { TableCell, TableRow } from "@/components/ui/table";
import { ExecutionPhaseStatus } from "@/types/workflow";
import { CoinsIcon } from "lucide-react";
import { useRouter } from "next/navigation";

function ExecutionRow({
  executionId,
  trigger,
  startedAt,
  status,
  duration,
  creditsConsumed,
  workflowId,
}: {
  executionId: string;
  trigger: string;
  status: string;
  duration: string;
  startedAt: string;
  creditsConsumed: number;
  workflowId: string;
}) {
  const router = useRouter();
  return (
    <TableRow
      className="hover:cursor-pointer"
      onClick={() => router.push(`/workflow/runs/${workflowId}/${executionId}`)}
    >
      <TableCell>
        <div className="flex flex-col gap-1">
          <p className="font-semibold">{executionId}</p>
          <div>
            <span className="text-xs text-muted-foreground">Triggered via</span>{" "}
            <Badge variant="outline">{trigger}</Badge>
          </div>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <div className="font-semibold capitalize flex items-center gap-2">
            {status === ExecutionPhaseStatus.COMPLETED ? (
              <span className="w-2 h-2 bg-green-500/80 rounded-full"></span>
            ) : (
              <span className="w-5 h-5 bg-red-500/80"></span>
            )}
            <span>{status}</span>
          </div>
          <p className="text-xs text-muted-foreground ml-4">{duration}</p>
        </div>
      </TableCell>
      <TableCell>
        <div className="flex flex-col gap-1">
          <div className="flex gap-1 font-semibold">
            <CoinsIcon size={16} className="stroke-primary" />
            {creditsConsumed}
          </div>
          <p className="text-xs text-muted-foreground">Credits</p>
        </div>
      </TableCell>
      <TableCell className="text-muted-foreground">{startedAt}</TableCell>
    </TableRow>
  );
}

export default ExecutionRow;
