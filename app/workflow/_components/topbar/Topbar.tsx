"use client";

import ToolTipWrapper from "@/components/ToolTipWrapper";
import { Button } from "@/components/ui/button";
import { ChevronLeftIcon } from "lucide-react";
import { useRouter } from "next/navigation";
import React from "react";
import SaveBtn from "./SaveBtn";
import ExecuteBtn from "./ExecuteBtn";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import Link from "next/link";

interface Props {
  title: string;
  subTitle?: string;
  workflowId: string;
  hideButtons?: boolean;
  tabState: TabState["EDITOR"] | TabState["RUNS"];
}

type TabState = {
  EDITOR: "editor";
  RUNS: "runs";
};

function Topbar({
  title,
  subTitle,
  workflowId,
  hideButtons = false,
  tabState,
}: Props) {
  const router = useRouter();
  const navigateBack = () => router.back();

  return (
    <header className="w-full border-b-2 bg-background z-10">
      <div className="flex flex-col md:flex-row items-center p-2 space-y-2 md:space-y-0 md:h-16">
        <div className="flex items-center w-full md:w-1/3 justify-between md:justify-start">
          <ToolTipWrapper content="Back">
            <Button
              size="icon"
              variant="ghost"
              onClick={navigateBack}
              className="md:mr-2"
            >
              <ChevronLeftIcon size={16} />
            </Button>
          </ToolTipWrapper>
          <div className="flex flex-col items-center md:items-start">
            <h1 className="font-bold text-center md:text-left">{title}</h1>
            {subTitle && (
              <p className="text-xs text-muted-foreground text-center md:text-left">
                {subTitle}
              </p>
            )}
          </div>
          <div className="md:hidden w-10" />{" "}
          {/* Spacer for mobile layout balance */}
        </div>

        <div className="w-full md:w-1/3 flex justify-center">
          <Tabs value={tabState} className="w-full max-w-[400px]">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="editor" asChild>
                <Link href={`/workflow/editor/${workflowId}`}>Editor</Link>
              </TabsTrigger>
              <TabsTrigger value="runs" asChild>
                <Link href={`/workflow/runs/${workflowId}`}>Runs</Link>
              </TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="w-full md:w-1/3 flex justify-end">
          {!hideButtons && (
            <div className="flex space-x-2">
              <ExecuteBtn workflowId={workflowId} />
              <SaveBtn workflowId={workflowId} />
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Topbar;
