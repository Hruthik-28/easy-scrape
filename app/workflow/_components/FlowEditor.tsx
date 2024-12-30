"use client";

import { workflow } from "@prisma/client";
import {
  Background,
  BackgroundVariant,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import React, { useEffect } from "react";
import NodeComponent from "./nodes/NodeComponent";
import "@xyflow/react/dist/style.css";

const nodeTypes = {
  EasyScrapeNode: NodeComponent,
};

const snapGrid: [number, number] = [1, 1];
const fitViewOptions = { padding: 1 };

function FlowEditor({ workflow }: { workflow: workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);
  const { setViewport } = useReactFlow();

  useEffect(() => {
    try {
      const flow = JSON.parse(workflow.defination);
      if (!flow) return;
      setNodes(flow.nodes);
      setEdges(flow.edges);
      if (!flow.viewport) return;
      const { x = 0, y = 0, zoom = 1 } = flow.viewport;
      setViewport({ x, y, zoom }); //restore viewport => to remove uncomment fitView below in ReactFlow
    } catch (error) {
      console.log(error);
    }
  }, [workflow.defination, setViewport, setNodes, setEdges]);

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        fitViewOptions={fitViewOptions}
        snapGrid={snapGrid}
        snapToGrid
        // fitView
      >
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        <Controls
          position="top-right"
          fitViewOptions={fitViewOptions}
          className="dark:text-black"
        />
      </ReactFlow>
    </main>
  );
}

export default FlowEditor;
