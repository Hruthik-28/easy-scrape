import { RunWorkflow } from "@/actions/workflows/runWorkFlow";
import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { PlayIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

function ExecuteBtn({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();
  const generateExecutionPlan = useExecutionPlan();
  const router = useRouter();

  const handleExecutionMutation = useMutation({
    mutationFn: RunWorkflow,
    onSuccess: (result) => {
      if (result.success) {
        toast.success("Workflow execution started", { id: "run-workflow" });
        const { workflowId, executionId } = result.data;
        router.push(`/workflow/runs/${workflowId}/${executionId}`);
      }
    },
    onError: () =>
      toast.error("Error executing workflow", { id: "run-workflow" }),
  });
  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      disabled={handleExecutionMutation.isPending}
      onClick={() => {
        const plan = generateExecutionPlan();
        if (!plan) {
          // client side validation
          return;
        }
        const flowDefinition = JSON.stringify(toObject());
        handleExecutionMutation.mutate({ workflowId, flowDefinition });
      }}
    >
      <PlayIcon size={16} className="stroke-amber-400" />
      {handleExecutionMutation.isPending ? "Executing..." : "Execute"}
    </Button>
  );
}

export default ExecuteBtn;
