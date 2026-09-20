import React from 'react';
import { ConnectionStyle, MindNodeData } from '../types';

interface BranchLinesProps {
  nodes: Record<string, MindNodeData>;
  defaultLineStyle: ConnectionStyle;
  collapsedSet: Set<string>;
  selectedNodeId: string | null;
}

export const BranchLines: React.FC<BranchLinesProps> = ({
  nodes,
  defaultLineStyle,
  collapsedSet,
  selectedNodeId,
}) => {
  const lines: React.ReactNode[] = [];

  Object.values(nodes).forEach((child) => {
    if (!child.parentId) return;
    const parent = nodes[child.parentId];
    if (!parent) return;

    // Check if any ancestor is collapsed
    let currentAncestorId: string | null = child.parentId;
    let isHiddenByCollapse = false;

    while (currentAncestorId) {
      if (collapsedSet.has(currentAncestorId)) {
        isHiddenByCollapse = true;
        break;
      }
      currentAncestorId = nodes[currentAncestorId]?.parentId || null;
    }

    if (isHiddenByCollapse) return;

    const x1 = parent.x;
    const y1 = parent.y;
    const x2 = child.x;
    const y2 = child.y;
    const dx = x2 - x1;

    const styleType = child.lineStyle || parent.lineStyle || defaultLineStyle;
    const strokeColor = child.branchColor || parent.branchColor || '#6366f1';
    const strokeWidth = child.lineWidth || (parent.parentId === null ? 2.8 : 2);
    const isSelectedBranch = selectedNodeId === child.id || selectedNodeId === parent.id;

    let pathD = '';

    if (styleType === 'straight') {
      pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
    } else if (styleType === 'stepped') {
      const midX = x1 + dx * 0.5;
      pathD = `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`;
    } else {
      // Curved organic Bézier curve (MindNode signature)
      const cx1 = x1 + dx * 0.55;
      const cy1 = y1;
      const cx2 = x1 + dx * 0.45;
      const cy2 = y2;
      pathD = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
    }

    lines.push(
      <g key={`branch-${parent.id}-${child.id}`}>
        {/* Subtle glow / hover path when branch is selected */}
        {isSelectedBranch && (
          <path
            d={pathD}
            fill="none"
            stroke={strokeColor}
            strokeWidth={strokeWidth + 4}
            strokeOpacity={0.25}
            strokeLinecap="round"
          />
        )}
        <path
          id={`branch-line-${child.id}`}
          d={pathD}
          fill="none"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="transition-all duration-150"
        />
      </g>
    );
  });

  return <>{lines}</>;
};
