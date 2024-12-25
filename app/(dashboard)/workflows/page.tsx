import { Suspense } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { GetWorkFlowForUsers } from "@/actions/workflows/getWorkFlowForUsers";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircleIcon, InboxIcon } from "lucide-react";
import CreateWorkflowDialog from "./_components/CreateWorkflowDialog";

function WorkflowsPage() {
  return (
    <div>
      <div className="flex justify-between">
        <div className="flex flex-col">
          <h1 className="sm:text-3xl text-2xl font-bold">Workflows</h1>
          <p className="text-muted-foreground">Manage your workflows</p>
        </div>

        <CreateWorkflowDialog />
      </div>

      <div className="flex h-full flex-col py-6">
        <Suspense fallback={<UserWorkflowsSkeleton />}>
          <UserWorkflows />
        </Suspense>
      </div>
    </div>
  );
}

function UserWorkflowsSkeleton() {
  return (
    <div className="space-y-2">
      {[1, 2, 3, 4].map((i) => (
        <Skeleton key={i} className="h-24" />
      ))}
    </div>
  );
}

async function UserWorkflows() {
  const userWorkflows = await GetWorkFlowForUsers();

  if (!userWorkflows) {
    return (
      <Alert variant={"destructive"}>
        <AlertCircleIcon className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Failed to fetch workflows. Please try again later.
        </AlertDescription>
      </Alert>
    );
  }

  if (userWorkflows.length === 0) {
    return (
      <div className="flex flex-col gap-3 justify-center items-center text-center">
        <div className="rounded-full bg-muted p-4">
          <InboxIcon className="text-primary" size={40} />
        </div>
        <h2 className="text-xl font-semibold">No workflow created yet.</h2>
        <p className="text-muted-foreground">
          Click the button below to create your first workflow
        </p>
        <CreateWorkflowDialog triggerText="Create your first workflow" />
      </div>
    );
  }

  return (
    <div className="flex flex-col justify-center items-center gap-6"></div>
  );
}

export default WorkflowsPage;
