import { workflow } from "@prisma/client";
import { ReactFlowProvider } from "@xyflow/react";
import React from "react";
import FlowEditor from "./FlowEditor";
import Topbar from "./topbar/Topbar";
import TaskMenu from "./TaskMenu";

function Editor({ workflow }: { workflow: workflow }) {
  return (
    <>
      <ReactFlowProvider>
        <div className="w-full h-full flex flex-col overflow-hidden">
          <Topbar
            title="Workflow editor"
            workflowName={workflow.name}
            workflowId={workflow.id}
          />
          <section className="flex h-full overflow-hidden">
            <TaskMenu />
            <FlowEditor workflow={workflow} />
          </section>
        </div>
      </ReactFlowProvider>
    </>
  );
}

export default Editor;
