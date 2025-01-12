"use client";

import ToolTipWrapper from "@/components/ToolTipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import SaveBtn from "./SaveBtn";
import ExecuteBtn from "./ExecuteBtn";

interface Props {
  title: string;
  subTitle?: string;
  workflowId: string;
  hideButtons?: boolean;
}

function Topbar({ title, subTitle, workflowId, hideButtons = false }: Props) {
  const router = useRouter();
  const navigateBack = () => router.back();
  return (
    <header className="w-full border-b-2 h-16 p-2 flex justify-between items-center top-0 bg-background z-10">
      <div className="flex gap-2 flex-1 justify-start">
        <ToolTipWrapper content="Back">
          <Button size={"icon"} variant={"ghost"} onClick={navigateBack}>
            <ChevronLeftIcon size={16} />
          </Button>
        </ToolTipWrapper>

        <div className="flex flex-col gap-1">
          <p className="font-bold">{title}</p>
          {subTitle && (
            <p className="text-xs text-muted-foreground">{subTitle}</p>
          )}
        </div>
      </div>

      <div className="flex gap-2 flex-1 justify-end">
        {hideButtons === false && (
          <>
            <ExecuteBtn workflowId={workflowId} />
            <SaveBtn workflowId={workflowId} />
          </>
        )}
      </div>
    </header>
  );
}

export default Topbar;
