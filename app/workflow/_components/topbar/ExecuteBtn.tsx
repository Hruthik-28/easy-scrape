import useExecutionPlan from "@/components/hooks/useExecutionPlan";
import { Button } from "@/components/ui/button";
import { PlayIcon } from "lucide-react";

function ExecuteBtn({ workflowId }: { workflowId: string }) {
  const generate = useExecutionPlan();
  console.log(workflowId);
  return (
    <Button
      variant={"outline"}
      className="flex items-center gap-2"
      onClick={() => {
        const plan = generate();
        console.log("--------------PLAN-------------");
        console.table(plan);
      }}
    >
      <PlayIcon size={16} className="stroke-amber-400" />
      Execute
    </Button>
  );
}

export default ExecuteBtn;