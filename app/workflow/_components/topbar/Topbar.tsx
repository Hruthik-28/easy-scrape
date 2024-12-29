"use client";

import ToolTipWrapper from "@/components/ToolTipWrapper";
import { Button } from "@/components/ui/button";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ChevronLeftIcon, SaveIcon } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import SaveBtn from "./SaveBtn";

interface Props {
  title: string;
  workflowName?: string;
  workflowId: string;
}

function Topbar({ title, workflowName, workflowId }: Props) {
  const router = useRouter();
  const navigateBack = () => router.back();
  return (
    <header className="border-b-2 h-16 p-2 flex justify-between items-center top-0 bg-background z-10">
      <div className="flex gap-2 flex-1 justify-start">
        <ToolTipWrapper content="Back">
          <Button size={"icon"} variant={"ghost"} onClick={navigateBack}>
            <ChevronLeftIcon size={16} />
          </Button>
        </ToolTipWrapper>

        <div className="flex flex-col gap-1">
          <p className="font-bold">{title}</p>
          {workflowName && (
            <p className="text-xs text-muted-foreground">{workflowName}</p>
          )}
        </div>
      </div>
      {/* <div className="">
        <Tabs defaultValue="editor" className="w-[400px]">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="editor" asChild>
              <Link href={`/workflow/editor/${workflowId}`}>Editor</Link>
            </TabsTrigger>
            <TabsTrigger value="runs" asChild>
              <Link href={`/workflow/runs/${workflowId}`}>Runs</Link>
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div> */}

      <div className="flex gap-2 flex-1 justify-end">
        <SaveBtn workflowId={workflowId} />
      </div>
    </header>
  );
}

export default Topbar;
