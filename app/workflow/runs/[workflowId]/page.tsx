import React, { Suspense } from "react";
import Topbar from "../../_components/topbar/Topbar";
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { GetWorkflowExecutions } from "@/actions/workflows/getWorflowExecutions";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, LoaderIcon } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { DateToDurationString } from "@/lib/helpers/dates";
import ExecutionRow from "./_components/ExecutionRow";

async function Page({ params }: { params: Promise<{ workflowId: string }> }) {
  const workflowId = (await params).workflowId;
  return (
    <div className="w-full h-full">
      <Topbar
        title="All runs"
        subTitle="List of all your workflow runs"
        workflowId={workflowId}
        hideButtons
        tabState={"runs"}
      />

      <div className="flex-grow flex items-center w-full py-10 md:px-20 px-10">
        <Suspense
          fallback={
            <div className="w-full flex items-center justify-center">
              <LoaderIcon className="w-5 h-5 stroke-primary" />
            </div>
          }
        >
          <ListRuns workflowId={workflowId} />
        </Suspense>
      </div>
    </div>
  );
}

async function ListRuns({ workflowId }: { workflowId: string }) {
  const executions = await GetWorkflowExecutions(workflowId);

  if (!executions) {
    return (
      <Alert variant={"destructive"}>
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to fetch workflow executions. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="border-2 rounded-md w-full overflow-x-auto">
      <Table className="w-full">
        <TableHeader className="bg-muted">
          <TableRow>
            <TableHead className="w-1/3 min-w-[150px]">id</TableHead>
            <TableHead className="w-1/3 min-w-[100px]">Status</TableHead>
            <TableHead className="w-1/3 min-w-[100px]">Consumed</TableHead>
            <TableHead className="w-1/3 min-w-[150px]">
              Started at (desc)
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {executions.map((execution) => (
            <React.Fragment key={execution.id}>
              <ExecutionRow
                executionId={execution.id}
                workflowId={workflowId}
                status={execution.status}
                trigger={execution.trigger}
                creditsConsumed={execution.creditsConsumed}
                startedAt={formatDistanceToNow(new Date(execution.startedAt!), {
                  addSuffix: true,
                })}
                duration={
                  DateToDurationString(
                    execution.completedAt,
                    execution.startedAt
                  )!
                }
              />
            </React.Fragment>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
export default Page;
