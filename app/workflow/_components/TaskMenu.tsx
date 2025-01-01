"use client";

import React from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { CoinsIcon } from "lucide-react";
import { TaskType } from "@/types/task";
import { TaskRegistry } from "@/lib/workflow/task/TaskRegistry";

function TaskMenu() {
  return (
    <aside className="w-96 border-r-2 border-separate overflow-auto p-2">
      <Accordion type="multiple" defaultValue={["extraction"]}>
        <AccordionItem value="extraction">
          <AccordionTrigger className="font-bold">
            Data Extraction
          </AccordionTrigger>
          <AccordionContent className="flex flex-col gap-1 justify-center items-center">
            <TaskMenuButton taskType={TaskType.PAGE_TO_HTML} />
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </aside>
  );
}

const onDragStart = (event: React.DragEvent, taskType: TaskType) => {
  event.dataTransfer.setData("application/reactflow", taskType);
  event.dataTransfer.effectAllowed = "move";
};

function TaskMenuButton({ taskType }: { taskType: TaskType }) {
  const task = TaskRegistry[taskType];
  return (
    <Button
      variant={"secondary"}
      className="w-full flex justify-between"
      draggable
      onDragStart={(e) => onDragStart(e, task.type)}
    >
      <div className="flex items-center gap-2 justify-start">
        {<task.icon size={16} />}
        {task.label}
      </div>
      <CoinsIcon size={16} />
      {/* TODO: COINS */}
    </Button>
  );
}

export default TaskMenu;
