"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import ReactFlow, {
  Background,
  Controls,
  MiniMap,
  MarkerType,
  type Edge,
  type Node,
} from "reactflow";
import dagre from "@dagrejs/dagre";
import "reactflow/dist/style.css";
import type { ThoughtNodeRecord } from "@/lib/nodes-shared";

type Props = {
  nodes: ThoughtNodeRecord[];
};

type LayoutConfig = {
  nodeWidth: number;
  nodeHeight: number;
  nodesep: number;
  ranksep: number;
};

function layoutElements(nodes: ThoughtNodeRecord[], config: LayoutConfig) {
  const { nodeWidth, nodeHeight, nodesep, ranksep } = config;
  const graph = new dagre.graphlib.Graph();
  graph.setDefaultEdgeLabel(() => ({}));
  graph.setGraph({ rankdir: "TB", nodesep, ranksep });

  const flowNodes: Node[] = nodes.map((node) => {
    graph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    return {
      id: node.id,
      data: {
        label: (
          <Link
            href={`/dusunce/${node.slug}`}
            className="block h-full w-full touch-manipulation p-2.5 text-left sm:p-3"
          >
            {node.branchLabel && (
              <span className="mb-1 inline-block rounded-full bg-[#eef2ed] px-2 py-0.5 text-[10px] font-medium text-[#4a5d49]">
                {node.branchLabel}
              </span>
            )}
            <p className="font-serif text-xs leading-snug text-stone-900 hover:text-[#4a5d49] sm:text-sm">
              {node.title}
            </p>
            {node.branchQuestion && (
              <p className="mt-1.5 line-clamp-2 text-[10px] text-stone-500 sm:mt-2 sm:text-[11px]">
                → {node.branchQuestion}
              </p>
            )}
          </Link>
        ),
      },
      position: { x: 0, y: 0 },
      style: {
        width: nodeWidth,
        border: "1px solid #d6d3d1",
        borderRadius: "12px",
        background: "#ffffff",
        boxShadow: "0 1px 3px rgba(0,0,0,0.06)",
      },
    };
  });

  const flowEdges: Edge[] = nodes
    .filter((node) => node.parentId)
    .map((node) => {
      graph.setEdge(node.parentId!, node.id);
      return {
        id: `${node.parentId}-${node.id}`,
        source: node.parentId!,
        target: node.id,
        label: node.branchLabel ?? undefined,
        labelStyle: { fill: "#57534e", fontSize: 10, fontWeight: 500 },
        labelBgStyle: { fill: "#f7f5f0", fillOpacity: 0.9 },
        labelBgPadding: [6, 4] as [number, number],
        markerEnd: { type: MarkerType.ArrowClosed, color: "#a8a29e", width: 16, height: 16 },
        style: { stroke: "#a8a29e", strokeWidth: 1.5 },
      };
    });

  flowNodes.forEach((node) => {
    if (!graph.hasNode(node.id)) {
      graph.setNode(node.id, { width: nodeWidth, height: nodeHeight });
    }
  });

  dagre.layout(graph);

  const positionedNodes = flowNodes.map((node) => {
    const position = graph.node(node.id);
    return {
      ...node,
      position: {
        x: position.x - nodeWidth / 2,
        y: position.y - nodeHeight / 2,
      },
    };
  });

  return { nodes: positionedNodes, edges: flowEdges };
}

function useLayoutConfig() {
  const [config, setConfig] = useState<LayoutConfig>({
    nodeWidth: 220,
    nodeHeight: 110,
    nodesep: 28,
    ranksep: 56,
  });

  useEffect(() => {
    const update = () => {
      const mobile = window.matchMedia("(max-width: 639px)").matches;
      setConfig(
        mobile
          ? { nodeWidth: 168, nodeHeight: 96, nodesep: 20, ranksep: 44 }
          : { nodeWidth: 240, nodeHeight: 118, nodesep: 40, ranksep: 72 },
      );
    };

    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);

  return config;
}

export function ThoughtFlowChart({ nodes }: Props) {
  const layoutConfig = useLayoutConfig();
  const isMobile = layoutConfig.nodeWidth < 200;

  const { nodes: flowNodes, edges } = useMemo(
    () => layoutElements(nodes, layoutConfig),
    [nodes, layoutConfig],
  );

  if (nodes.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-stone-300 bg-white p-8 text-center text-sm text-stone-500 sm:p-10">
        Henüz yayınlanmış düşünce yok.
      </div>
    );
  }

  return (
    <div className="flow-chart-shell">
      {isMobile && (
        <p className="mb-3 text-xs text-stone-500">
          Parmağınla kaydır, iki parmakla yakınlaştır. Kutuya dokunarak detaya git.
        </p>
      )}
      <div className="flow-chart-canvas">
        <ReactFlow
          nodes={flowNodes}
          edges={edges}
          fitView
          fitViewOptions={{ padding: isMobile ? 0.35 : 0.2 }}
          minZoom={0.25}
          maxZoom={1.5}
          nodesDraggable={false}
          nodesConnectable={false}
          elementsSelectable={false}
          panOnDrag
          panOnScroll={!isMobile}
          zoomOnScroll={!isMobile}
          zoomOnPinch
          zoomOnDoubleClick={false}
          proOptions={{ hideAttribution: true }}
        >
          <Background color="#e7e5e4" gap={isMobile ? 16 : 20} />
          <Controls
            showInteractive={false}
            className={isMobile ? "flow-controls-mobile" : undefined}
          />
          {!isMobile && (
            <MiniMap
              nodeColor="#eef2ed"
              maskColor="rgba(247, 245, 240, 0.75)"
              pannable
              zoomable
            />
          )}
        </ReactFlow>
      </div>
    </div>
  );
}
