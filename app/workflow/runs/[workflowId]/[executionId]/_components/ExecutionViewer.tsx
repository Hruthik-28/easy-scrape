"use client";

import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import { GetWorkflowPhaseDetails } from "@/actions/workflows/getWorkflowPhaseDetails";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { DateToDurationString } from "@/lib/helpers/dates";
import { GetPhasesTotalCost } from "@/lib/helpers/phases";
import { WorkflowExecutionStatus } from "@/types/workflow";
import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import {
  CalendarIcon,
  CircleDashedIcon,
  ClockIcon,
  CoinsIcon,
  LoaderIcon,
  LucideIcon,
  WorkflowIcon,
} from "lucide-react";
import React, { useState } from "react";

type ExecutionData = Awaited<ReturnType<typeof GetWorkflowExecutionWithPhases>>;

function ExecutionViewer({ initialData }: { initialData: ExecutionData }) {
  const [selectedPhase, setSelectedPhase] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["execution", initialData?.id],
    initialData,
    queryFn: () => GetWorkflowExecutionWithPhases(initialData.id),
    refetchInterval: (q) =>
      q.state.data?.status === WorkflowExecutionStatus.RUNNING ? 1000 : false,
  });

  const phaseDetails = useQuery({
    queryKey: ["phaseDetails", selectedPhase],
    enabled: selectedPhase !== null,
    queryFn: () => GetWorkflowPhaseDetails(selectedPhase!),
  });

  const duration = DateToDurationString(
    query.data?.completedAt,
    query.data?.startedAt
  );

  const creditsConsumed = GetPhasesTotalCost(query.data?.phases || []);

  const isRunning = query.data?.status === WorkflowExecutionStatus.RUNNING;

  return (
    <div className="w-full flex">
      <aside className="w-[400px] min-w-[400px] max-w-[400px] h-full border-r-2 border-separate overflow-hidden flex flex-col flex-grow">
        <div className="p-4 space-y-4">
          <ExecutionLabel
            name="Status"
            icon={CircleDashedIcon}
            value={query.data?.status}
          />
          <ExecutionLabel
            name="Started at"
            icon={CalendarIcon}
            value={
              query.data?.startedAt
                ? formatDistanceToNow(new Date(query.data?.startedAt), {
                    addSuffix: true,
                  })
                : "-"
            }
          />
          <ExecutionLabel
            name="Duration"
            icon={ClockIcon}
            value={
              duration ? (
                duration
              ) : (
                <LoaderIcon className="h-5 w-5 animate-spin" />
              )
            }
          />
          <ExecutionLabel
            name="Coins consumed"
            icon={CoinsIcon}
            value={creditsConsumed}
          />
        </div>

        <Separator />
        <div className="flex items-center gap-1 p-2 text-muted-foreground justify-center font-semibold">
          <WorkflowIcon size={20} />
          <span>Phases</span>
        </div>
        <Separator />

        <div className="overflow-auto h-full p-2">
          {query.data?.phases?.map((phase, index) => (
            <Button
              className="w-full flex justify-between items-center"
              variant={phase.id === selectedPhase ? "outline" : "ghost"}
              key={phase.id}
              onClick={() => {
                if (isRunning) return;
                setSelectedPhase(phase.id);
              }}
            >
              <div className="flex items-center gap-2">
                <Badge variant={"outline"}>{index + 1}</Badge>
                <p>{phase.name}</p>
              </div>
              <div className="text-sm">{phase.status}</div>
            </Button>
          ))}
        </div>
      </aside>

      <div className="flex w-full h-full border overflow-auto">
        <pre>{JSON.stringify(phaseDetails.data, null, 4)}</pre>
      </div>
    </div>
  );
}

export default ExecutionViewer;

function ExecutionLabel(props: {
  name: React.ReactNode;
  icon: LucideIcon;
  value: React.ReactNode;
}) {
  return (
    <div className="flex justify-between items-center text-sm">
      <div className="flex text-muted-foreground items-center gap-2">
        <props.icon size={20} /> <span>{props.name}</span>
      </div>
      <div className="flex items-center gap-2 font-semibold">{props.value}</div>
    </div>
  );
}
