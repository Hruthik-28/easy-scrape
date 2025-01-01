"use client";

import { workflow } from "@prisma/client";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  ReactFlow,
  useEdgesState,
  useNodesState,
  useReactFlow,
} from "@xyflow/react";
import React, { useCallback, useEffect } from "react";
import NodeComponent from "./nodes/NodeComponent";
import "@xyflow/react/dist/style.css";
import { CreateFlowNode } from "@/lib/workflow/createFlowNode";
import { TaskType } from "@/types/task";
import { AppNode } from "@/types/appNode";
import EdgeComponent from "./edges/EdgeComponent";
import { CreateFlowEdge } from "@/lib/workflow/createFlowEdge";
import { AppEdge } from "@/types/appEdge";

const nodeTypes = {
  EasyScrapeNode: NodeComponent,
};

const edgeTypes = {
  EasyScrapeEdge: EdgeComponent,
};

const snapGrid: [number, number] = [1, 1];
const fitViewOptions = { padding: 1 };

function FlowEditor({ workflow }: { workflow: workflow }) {
  const [nodes, setNodes, onNodesChange] = useNodesState<AppNode>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<AppEdge>([]);
  const { setViewport, screenToFlowPosition } = useReactFlow();

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

  const onDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = "move";
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    const taskType = e.dataTransfer.getData("application/reactflow");
    if (typeof taskType === undefined || !taskType) return;

    const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
    const newNode = CreateFlowNode(taskType as TaskType, position);

    setNodes((prevNodes) => prevNodes.concat(newNode));
  }, []);

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = CreateFlowEdge(connection);
      setEdges((edges) => addEdge(newEdge, edges));
    },
    [setEdges]
  );

  return (
    <main className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        fitViewOptions={fitViewOptions}
        snapGrid={snapGrid}
        snapToGrid
        // fitView
        draggable
        onDragOver={(e) => onDragOver(e)}
        onDrop={(e) => onDrop(e)}
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
