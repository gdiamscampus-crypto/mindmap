import React, { useRef } from 'react';
import { CanvasViewport, MindNodeData } from '../types';
import { getMapBoundingBox } from '../utils/export';

interface MiniMapProps {
  nodes: Record<string, MindNodeData>;
  viewport: CanvasViewport;
  containerWidth: number;
  containerHeight: number;
  onPanTo: (x: number, y: number) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export const MiniMap: React.FC<MiniMapProps> = ({
  nodes,
  viewport,
  containerWidth,
  containerHeight,
  onPanTo,
  isOpen,
  onToggle,
}) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const bbox = getMapBoundingBox(nodes);

  if (!isOpen) {
    return (
      <button
        id="toggle-minimap-btn"
        title="Open Mini-map Navigator"
        onClick={onToggle}
        className="absolute bottom-4 right-4 z-30 p-2 rounded-xl bg-white/90 dark:bg-slate-800/90 shadow-md border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:text-indigo-600 text-xs font-medium flex items-center gap-1.5 backdrop-blur-sm transition-all"
      >
        <span className="w-2.5 h-2.5 rounded-sm bg-indigo-500" />
        Map
      </button>
    );
  }

  // Mini-map dimensions
  const miniWidth = 160;
  const miniHeight = 110;

  // Compute scale to fit bbox
  const scaleX = miniWidth / Math.max(bbox.width, 100);
  const scaleY = miniHeight / Math.max(bbox.height, 100);
  const scale = Math.min(scaleX, scaleY);

  // Viewport box in canvas space
  const viewLeft = -viewport.x / viewport.zoom;
  const viewTop = -viewport.y / viewport.zoom;
  const viewWidth = containerWidth / viewport.zoom;
  const viewHeight = containerHeight / viewport.zoom;

  // Viewport box in mini-map space
  const miniViewX = (viewLeft - bbox.minX) * scale;
  const miniViewY = (viewTop - bbox.minY) * scale;
  const miniViewW = viewWidth * scale;
  const miniViewH = viewHeight * scale;

  const handleMiniMapClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!mapRef.current) return;
    const rect = mapRef.current.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const clickY = e.clientY - rect.top;

    const targetCanvasX = bbox.minX + clickX / scale;
    const targetCanvasY = bbox.minY + clickY / scale;

    const newViewportX = containerWidth / 2 - targetCanvasX * viewport.zoom;
    const newViewportY = containerHeight / 2 - targetCanvasY * viewport.zoom;

    onPanTo(newViewportX, newViewportY);
  };

  return (
    <div
      id="minimap-container"
      className="absolute bottom-4 right-4 z-30 bg-white/95 dark:bg-slate-900/95 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-2.5 backdrop-blur-md select-none transition-all"
    >
      <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-slate-100 dark:border-slate-800">
        <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">Overview</span>
        <button
          onClick={onToggle}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs px-1"
          title="Minimize"
        >
          ✕
        </button>
      </div>

      <div
        ref={mapRef}
        onClick={handleMiniMapClick}
        className="relative bg-slate-50 dark:bg-slate-950 rounded-lg cursor-crosshair overflow-hidden border border-slate-200/60 dark:border-slate-800/80"
        style={{ width: `${miniWidth}px`, height: `${miniHeight}px` }}
      >
        {/* Render node dots */}
        {Object.values(nodes).map((node) => {
          const nx = (node.x - bbox.minX) * scale;
          const ny = (node.y - bbox.minY) * scale;
          return (
            <div
              key={`mini-${node.id}`}
              className="absolute w-2 h-1.5 rounded-full pointer-events-none transform -translate-x-1/2 -translate-y-1/2"
              style={{
                left: `${nx}px`,
                top: `${ny}px`,
                backgroundColor: node.branchColor || node.color || '#4f46e5',
              }}
            />
          );
        })}

        {/* Viewport lens rectangle */}
        <div
          className="absolute border border-indigo-500 bg-indigo-500/15 pointer-events-none rounded-sm transition-all duration-75"
          style={{
            left: `${Math.max(0, miniViewX)}px`,
            top: `${Math.max(0, miniViewY)}px`,
            width: `${Math.min(miniWidth, Math.max(12, miniViewW))}px`,
            height: `${Math.min(miniHeight, Math.max(8, miniViewH))}px`,
          }}
        />
      </div>
    </div>
  );
};
