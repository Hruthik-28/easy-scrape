import { updateWorkflow } from "@/actions/workflows/updateWorkflow";
import { Button } from "@/components/ui/button";
import { useMutation } from "@tanstack/react-query";
import { useReactFlow } from "@xyflow/react";
import { SaveIcon } from "lucide-react";
import React from "react";
import { toast } from "sonner";

function SaveBtn({ workflowId }: { workflowId: string }) {
  const { toObject } = useReactFlow();

  const saveWorkflow = useMutation({
    mutationFn: updateWorkflow,
    onSuccess: () => {
      toast.success("Workflow saved", { id: "save-workflow" });
    },
    onError: () => {
      toast.error("Failed to save workflow", { id: "save-workflow" });
    },
  });

  return (
    <Button
      variant={"outline"}
      disabled={saveWorkflow.isPending}
      onClick={() => {
        const workflowDefination = JSON.stringify(toObject());
        toast.loading("Saving workflow", { id: "save-workflow" });
        saveWorkflow.mutate({
          id: workflowId,
          defination: workflowDefination,
        });
      }}
    >
      <SaveIcon size={16} className="stroke-green-400" />
      {saveWorkflow.isPending ? "Saving..." : "Save"}
    </Button>
  );
}

export default SaveBtn;
