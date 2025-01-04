"use client";

import { workflow } from "@prisma/client";
import {
  addEdge,
  Background,
  BackgroundVariant,
  Connection,
  Controls,
  getOutgoers,
  Node,
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
import { TaskRegistry } from "@/lib/workflow/task/TaskRegistry";

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
  const {
    setViewport,
    screenToFlowPosition,
    updateNodeData,
    getNode,
  } = useReactFlow();

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

  const onDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      const taskType = e.dataTransfer.getData("application/reactflow");
      if (typeof taskType === undefined || !taskType) return;

      const position = screenToFlowPosition({ x: e.clientX, y: e.clientY });
      const newNode = CreateFlowNode(taskType as TaskType, position);

      setNodes((prevNodes) => prevNodes.concat(newNode));
    },
    [screenToFlowPosition, setNodes]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      const newEdge = CreateFlowEdge(connection);
      setEdges((edges) => addEdge(newEdge, edges));
      if (!connection.targetHandle || !connection.target) return;
      const node = nodes.find((node) => node.id === connection.target);
      if (!node) return;
      const nodeInputs = node.data.inputs;
      updateNodeData(node.id, {
        inputs: {
          ...nodeInputs,
          [connection.targetHandle]: "",
        },
      });
    },
    [setEdges, updateNodeData, nodes]
  );

  const isValidConnection = useCallback(
    (connection: AppEdge | Connection) => {
      // No self connection allowed
      if (connection.source === connection.target) return false;

      // No connection b/w 2 same taskParam type is allowed
      const sourceNode = getNode(connection.source) as AppNode;
      const targetNode = getNode(connection.target) as AppNode;

      if (!sourceNode || !targetNode) {
        console.error("Invalid connection: source or target not found");
        return false;
      }

      const sourceNodeTask = TaskRegistry[sourceNode.data.type];
      const targetNodeTask = TaskRegistry[targetNode.data.type];

      const output = sourceNodeTask.outputs.find(
        (op) => op.name === connection.sourceHandle
      );
      const input = targetNodeTask.inputs.find(
        (inp) => inp.name === connection.targetHandle
      );

      if (output?.type !== input?.type) {
        console.error(
          "Invalid connection: source and target node types mismatch"
        );
        return false;
      }

      // Not allowed if it has a cycle
      const hasCycle = (node: Node, visited = new Set()) => {
        if (visited.has(node.id)) return false;

        visited.add(node.id);

        for (const outgoer of getOutgoers(node, nodes, edges)) {
          if (outgoer.id === connection.source) return true;
          if (hasCycle(outgoer, visited)) return true;
        }
      };

      return !hasCycle(targetNode);
    },
    [edges, getNode, nodes]
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
        isValidConnection={isValidConnection}
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
