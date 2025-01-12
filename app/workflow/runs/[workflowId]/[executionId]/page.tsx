import { GetWorkflowExecutionWithPhases } from "@/actions/workflows/getWorkflowExecutionWithPhases";
import Topbar from "@/app/workflow/_components/topbar/Topbar";
import { Loader2Icon } from "lucide-react";
import { Suspense } from "react";
import ExecutionViewer from "./_components/ExecutionViewer";

export default async function Page({
  params,
}: {
  params: Promise<{ workflowId: string; executionId: string }>;
}) {
  const { workflowId, executionId } = await params;

  return (
    <div className="flex flex-col h-screen w-full overflow-hidden">
      <Topbar
        workflowId={workflowId}
        title="Workflow run details"
        subTitle={`Run ID: ${executionId}`}
        hideButtons={true}
      />
      <section className="flex h-full overflow-auto">
        <Suspense
          fallback={
            <div className="w-full flex items-center justify-center">
              <Loader2Icon className="w-10 h-10 animate-spin stroke-primary" />
            </div>
          }
        >
          <ExecutionViewerWrapper executionId={executionId} />
        </Suspense>
      </section>
    </div>
  );
}

async function ExecutionViewerWrapper({
  executionId,
}: {
  executionId: string;
}) {
  const workflowExecution = await GetWorkflowExecutionWithPhases(executionId);

  if (!workflowExecution) {
    return <div>NO Workflow executions found</div>;
  }

  return <ExecutionViewer initialData={workflowExecution}/>
}
