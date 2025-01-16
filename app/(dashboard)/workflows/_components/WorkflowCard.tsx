"use client";

import { Workflow } from "@prisma/client";
import { Card, CardContent } from "../../../../components/ui/card";
import { WorkflowStatus } from "@/types/workflow";
import { FileText, MoreVertical, Play, Shuffle, Trash } from "lucide-react";
import { cn } from "@/lib/utils";
import Link from "next/link";
import { Button, buttonVariants } from "../../../../components/ui/button";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import ToolTipWrapper from "../../../../components/ToolTipWrapper";
import DeleteWorkflowDialog from "./DeleteWorkflowDialog";
import { useState } from "react";

const statusColors = {
  [WorkflowStatus.DRAFT]: "bg-yellow-400 text-yellow-600",
  [WorkflowStatus.PUBLISHED]: "bg-primary",
};

function WorkflowCard({ workflow }: { workflow: Workflow }) {
  const isDraft = workflow.status === WorkflowStatus.DRAFT;
  const workflowEditorPath = `/workflow/editor/${workflow.id}`;

  return (
    <Card className="w-full border border-separate shadow-sm rounded-lg hover:shadow-lg overflow-hidden dark:shadow-primary/30">
      <CardContent className="flex justify-between p-4 h-24">
        <div className="flex justify-between items-center gap-4">
          <div
            className={cn(
              "w-10 h-10 rounded-full flex items-center justify-center",
              isDraft
                ? statusColors[WorkflowStatus.DRAFT]
                : statusColors[WorkflowStatus.PUBLISHED]
            )}
          >
            {isDraft ? (
              <FileText className="h-5 w-5" />
            ) : (
              <Play className="h-5 w-5 text-white" />
            )}
          </div>
          <div>
            <h3 className="text-muted-foreground text-xl  flex items-center">
              <Link href={workflowEditorPath} className="hover:underline">
                {workflow.name}
              </Link>

              <span className="ml-2 px-2 py-0.5 text-xs font-medium bg-yellow-100 text-yellow-800 rounded-full">
                Draft
              </span>
            </h3>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Link
            href={workflowEditorPath}
            className={buttonVariants({
              variant: "outline",
              size: "sm",
              className: "flex items-center gap-2",
            })}
          >
            <Shuffle size={18} />
            Edit
          </Link>

          <WorkflowsActions
            workflowName={workflow.name}
            workflowId={workflow.id}
          />
        </div>
      </CardContent>
    </Card>
  );
}

function WorkflowsActions({
  workflowName,
  workflowId,
}: {
  workflowName: string;
  workflowId: string;
}) {
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  return (
    <>
      <DeleteWorkflowDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        workflowName={workflowName}
        workflowId={workflowId}
      />
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant={"outline"} size={"sm"}>
            <ToolTipWrapper content={"More actions"}>
              <div className="flex items-center w-full h-full">
                <MoreVertical size={18}></MoreVertical>
              </div>
            </ToolTipWrapper>
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent className="w-24" align="end">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuItem
            className="text-destructive p-2"
            onSelect={() => setShowDeleteDialog((prev) => !prev)}
          >
            <Trash /> Delete
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </>
  );
}

export default WorkflowCard;
