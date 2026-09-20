import React, { useState, useRef, useEffect, useCallback } from 'react';
import { CanvasViewport, MindMap, MindNodeData } from '../types';
import { BranchLines } from './BranchLines';
import { NodeView } from './NodeView';
import { MiniMap } from './MiniMap';

interface MindMapCanvasProps {
  map: MindMap;
  selectedNodeId: string | null;
  onSelectNode: (id: string | null) => void;
  onUpdateNodePosition: (id: string, dx: number, dy: number) => void;
  onUpdateNodeText: (id: string, text: string) => void;
  onToggleCollapse: (id: string) => void;
  onAddChildQuick: (parentId: string) => void;
  onAddSiblingQuick: (siblingId: string) => void;
  viewport: CanvasViewport;
  onUpdateViewport: (viewport: CanvasViewport | ((prev: CanvasViewport) => CanvasViewport)) => void;
  searchQuery: string;
  svgRef: React.RefObject<SVGSVGElement | null>;
}

export const MindMapCanvas: React.FC<MindMapCanvasProps> = ({
  map,
  selectedNodeId,
  onSelectNode,
  onUpdateNodePosition,
  onUpdateNodeText,
  onToggleCollapse,
  onAddChildQuick,
  onAddSiblingQuick,
  viewport,
  onUpdateViewport,
  searchQuery,
  svgRef,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 700 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });

  // Dragging node state
  const [draggingNodeId, setDraggingNodeId] = useState<string | null>(null);
  const [dragStartPos, setDragStartPos] = useState({ x: 0, y: 0 });

  // Mini-map toggle
  const [isMiniMapOpen, setIsMiniMapOpen] = useState(true);

  // Resize observer
  useEffect(() => {
    if (!containerRef.current) return;
    const observer = new ResizeObserver((entries) => {
      for (const entry of entries) {
        setDimensions({
          width: entry.contentRect.width,
          height: entry.contentRect.height,
        });
      }
    });
    observer.observe(containerRef.current);
    return () => observer.disconnect();
  }, []);

  // Compute set of collapsed ancestor node IDs
  const collapsedSet = new Set<string>();
  Object.values(map.nodes).forEach((node) => {
    if (node.collapsed) {
      collapsedSet.add(node.id);
    }
  });

  // Check if a node is hidden by any collapsed ancestor
  const isNodeHidden = useCallback(
    (nodeId: string): boolean => {
      let currentParentId = map.nodes[nodeId]?.parentId;
      while (currentParentId) {
        if (collapsedSet.has(currentParentId)) return true;
        currentParentId = map.nodes[currentParentId]?.parentId || null;
      }
      return false;
    },
    [map.nodes, collapsedSet]
  );

  // Count children for a node
  const getChildrenCount = (nodeId: string) => {
    return Object.values(map.nodes).filter((n) => n.parentId === nodeId).length;
  };

  // Canvas Pan Handlers
  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only pan if clicking canvas background (not nodes)
    if (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg') {
      setIsPanning(true);
      setPanStart({ x: e.clientX - viewport.x, y: e.clientY - viewport.y });
      onSelectNode(null);
    }
  };

  // Mouse Wheel Zoom / Pan
  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!containerRef.current) return;

    if (e.ctrlKey || e.metaKey) {
      // Zoom
      const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
      const rect = containerRef.current.getBoundingClientRect();
      const mouseX = e.clientX - rect.left;
      const mouseY = e.clientY - rect.top;

      onUpdateViewport((prev) => {
        const newZoom = Math.min(Math.max(0.2, prev.zoom * zoomFactor), 3);
        const newX = mouseX - (mouseX - prev.x) * (newZoom / prev.zoom);
        const newY = mouseY - (mouseY - prev.y) * (newZoom / prev.zoom);
        return { x: newX, y: newY, zoom: newZoom };
      });
    } else {
      // Pan
      onUpdateViewport((prev) => ({
        ...prev,
        x: prev.x - e.deltaX,
        y: prev.y - e.deltaY,
      }));
    }
  };

  // Node Drag Start
  const handleStartDrag = (id: string, e: React.MouseEvent | React.TouchEvent) => {
    e.stopPropagation();
    setDraggingNodeId(id);
    const clientX = 'touches' in e ? e.touches[0].clientX : e.clientX;
    const clientY = 'touches' in e ? e.touches[0].clientY : e.clientY;
    setDragStartPos({ x: clientX, y: clientY });
  };

  // Global Mouse Move & Mouse Up
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isPanning) {
        onUpdateViewport((prev) => ({
          ...prev,
          x: e.clientX - panStart.x,
          y: e.clientY - panStart.y,
        }));
      } else if (draggingNodeId) {
        const dx = (e.clientX - dragStartPos.x) / viewport.zoom;
        const dy = (e.clientY - dragStartPos.y) / viewport.zoom;

        if (Math.abs(dx) > 1 || Math.abs(dy) > 1) {
          onUpdateNodePosition(draggingNodeId, dx, dy);
          setDragStartPos({ x: e.clientX, y: e.clientY });
        }
      }
    };

    const handleMouseUp = () => {
      setIsPanning(false);
      setDraggingNodeId(null);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isPanning, panStart, draggingNodeId, dragStartPos, viewport.zoom, onUpdateViewport, onUpdateNodePosition]);

  // Touch handlers for mobile/tablet
  const touchStartRef = useRef<{ dist: number; midX: number; midY: number } | null>(null);

  const handleTouchStart = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && (e.target === containerRef.current || (e.target as HTMLElement).tagName === 'svg')) {
      setIsPanning(true);
      setPanStart({
        x: e.touches[0].clientX - viewport.x,
        y: e.touches[0].clientY - viewport.y,
      });
      onSelectNode(null);
    } else if (e.touches.length === 2) {
      // Pinch zoom
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const dist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const midX = (t1.clientX + t2.clientX) / 2;
      const midY = (t1.clientY + t2.clientY) / 2;
      touchStartRef.current = { dist, midX, midY };
    }
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (e.touches.length === 1 && isPanning) {
      onUpdateViewport((prev) => ({
        ...prev,
        x: e.touches[0].clientX - panStart.x,
        y: e.touches[0].clientY - panStart.y,
      }));
    } else if (e.touches.length === 2 && touchStartRef.current && containerRef.current) {
      const t1 = e.touches[0];
      const t2 = e.touches[1];
      const currentDist = Math.hypot(t1.clientX - t2.clientX, t1.clientY - t2.clientY);
      const ratio = currentDist / touchStartRef.current.dist;

      const rect = containerRef.current.getBoundingClientRect();
      const midX = touchStartRef.current.midX - rect.left;
      const midY = touchStartRef.current.midY - rect.top;

      onUpdateViewport((prev) => {
        const newZoom = Math.min(Math.max(0.3, prev.zoom * ratio), 2.5);
        const newX = midX - (midX - prev.x) * (newZoom / prev.zoom);
        const newY = midY - (midY - prev.y) * (newZoom / prev.zoom);
        return { x: newX, y: newY, zoom: newZoom };
      });
      touchStartRef.current.dist = currentDist;
    }
  };

  const handleTouchEnd = () => {
    setIsPanning(false);
    touchStartRef.current = null;
    setDraggingNodeId(null);
  };

  return (
    <div
      id="mind-map-canvas-container"
      ref={containerRef}
      onMouseDown={handleCanvasMouseDown}
      onWheel={handleWheel}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      className="relative flex-1 h-[calc(100vh-3.5rem)] overflow-hidden cursor-default select-none focus:outline-none"
      style={{
        backgroundColor: map.backgroundColor || '#f8fafc',
      }}
    >
      {/* Interactive Transform World */}
      <div
        id="canvas-world"
        className="absolute inset-0 origin-top-left pointer-events-none"
        style={{
          transform: `translate(${viewport.x}px, ${viewport.y}px) scale(${viewport.zoom})`,
          width: '100%',
          height: '100%',
        }}
      >
        {/* SVG Layer: Pattern background and Branch connection curves */}
        <svg
          ref={svgRef}
          className="absolute overflow-visible w-full h-full pointer-events-none"
          style={{
            minWidth: '5000px',
            minHeight: '5000px',
            transform: 'translate(-2500px, -2500px)',
          }}
        >
          <defs>
            {/* Dot Grid Pattern */}
            <pattern id="dot-pattern" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="12" cy="12" r="1.2" className="fill-slate-300 dark:fill-slate-700" />
            </pattern>
            {/* Line Grid Pattern */}
            <pattern id="line-grid-pattern" x="0" y="0" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" className="stroke-slate-200/80 dark:stroke-slate-800" strokeWidth="0.8" />
            </pattern>
          </defs>

          {/* Background Grid Fill */}
          {map.canvasPattern === 'dots' && (
            <rect x="0" y="0" width="5000" height="5000" fill="url(#dot-pattern)" />
          )}
          {map.canvasPattern === 'grid' && (
            <rect x="0" y="0" width="5000" height="5000" fill="url(#line-grid-pattern)" />
          )}

          {/* Centered transform for branches */}
          <g transform="translate(2500, 2500)">
            <BranchLines
              nodes={map.nodes}
              defaultLineStyle={map.defaultLineStyle}
              collapsedSet={collapsedSet}
              selectedNodeId={selectedNodeId}
            />
          </g>
        </svg>

        {/* Node Layer: Interactive React DOM Nodes */}
        <div className="absolute inset-0 pointer-events-auto">
          {Object.values(map.nodes).map((node) => {
            if (isNodeHidden(node.id)) return null;

            const hasChildren = getChildrenCount(node.id) > 0;
            const searchHighlight =
              searchQuery.trim() !== '' &&
              node.text.toLowerCase().includes(searchQuery.toLowerCase());

            return (
              <NodeView
                key={node.id}
                node={node}
                isSelected={selectedNodeId === node.id}
                hasChildren={hasChildren}
                isCollapsed={Boolean(node.collapsed)}
                childrenCount={getChildrenCount(node.id)}
                searchHighlight={searchHighlight}
                onSelect={(id, e) => {
                  e.stopPropagation();
                  onSelectNode(id);
                }}
                onStartDrag={handleStartDrag}
                onTextChange={onUpdateNodeText}
                onToggleCollapse={onToggleCollapse}
                onAddChildQuick={onAddChildQuick}
                onAddSiblingQuick={onAddSiblingQuick}
              />
            );
          })}
        </div>
      </div>

      {/* Mini-Map Navigator */}
      <MiniMap
        nodes={map.nodes}
        viewport={viewport}
        containerWidth={dimensions.width}
        containerHeight={dimensions.height}
        onPanTo={(nx, ny) => {
          onUpdateViewport((prev) => ({ ...prev, x: nx, y: ny }));
        }}
        isOpen={isMiniMapOpen}
        onToggle={() => setIsMiniMapOpen(!isMiniMapOpen)}
      />
    </div>
  );
};
