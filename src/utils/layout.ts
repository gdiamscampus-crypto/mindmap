import { MindNodeData } from '../types';

interface LayoutNode {
  id: string;
  data: MindNodeData;
  children: LayoutNode[];
  side: 'left' | 'right';
  depth: number;
  subtreeHeight: number;
  x: number;
  y: number;
}

const HORIZONTAL_SPACING = 260;
const VERTICAL_NODE_GAP = 54;
const ROOT_GAP = 280;

/**
 * Calculates a balanced horizontal dual-sided tree layout for mind maps (similar to MindNode)
 */
export function calculateAutoLayout(
  nodes: Record<string, MindNodeData>,
  rootId: string
): Record<string, MindNodeData> {
  const root = nodes[rootId];
  if (!root) return nodes;

  const childrenMap: Record<string, string[]> = {};
  Object.values(nodes).forEach((node) => {
    if (node.parentId) {
      if (!childrenMap[node.parentId]) {
        childrenMap[node.parentId] = [];
      }
      childrenMap[node.parentId].push(node.id);
    }
  });

  const rootChildrenIds = childrenMap[rootId] || [];
  if (rootChildrenIds.length === 0) {
    return {
      ...nodes,
      [rootId]: { ...root, x: 0, y: 0 },
    };
  }

  // Divide root children into left and right sides
  // Preserve existing side if already set, otherwise balance evenly
  const leftChildIds: string[] = [];
  const rightChildIds: string[] = [];

  rootChildrenIds.forEach((childId, index) => {
    const childNode = nodes[childId];
    if (childNode.side === 'left') {
      leftChildIds.push(childId);
    } else if (childNode.side === 'right') {
      rightChildIds.push(childId);
    } else {
      // Alternate balance
      if (index % 2 === 0) {
        rightChildIds.push(childId);
      } else {
        leftChildIds.push(childId);
      }
    }
  });

  // If one side is empty and there are > 1 children, rebalance
  if (leftChildIds.length === 0 && rightChildIds.length > 1) {
    const half = Math.floor(rightChildIds.length / 2);
    const moved = rightChildIds.splice(0, half);
    leftChildIds.push(...moved);
  }

  const updatedNodes: Record<string, MindNodeData> = {
    ...nodes,
    [rootId]: { ...root, x: 0, y: 0 },
  };

  // Build tree for a side
  function buildSubtree(nodeId: string, side: 'left' | 'right', depth: number): LayoutNode {
    const nodeData = nodes[nodeId];
    const childIds = childrenMap[nodeId] || [];
    
    // If collapsed, don't layout children below it
    const isCollapsed = Boolean(nodeData.collapsed);
    const children = isCollapsed ? [] : childIds.map((cid) => buildSubtree(cid, side, depth + 1));

    let subtreeHeight = 0;
    if (children.length === 0) {
      subtreeHeight = VERTICAL_NODE_GAP;
    } else {
      subtreeHeight = children.reduce((sum, c) => sum + c.subtreeHeight, 0);
    }

    return {
      id: nodeId,
      data: nodeData,
      children,
      side,
      depth,
      subtreeHeight,
      x: 0,
      y: 0,
    };
  }

  // Layout a tree column-wise
  function layoutSide(childIds: string[], side: 'left' | 'right') {
    const trees = childIds.map((cid) => buildSubtree(cid, side, 1));
    const totalSideHeight = trees.reduce((sum, t) => sum + t.subtreeHeight, 0);

    let currentY = -totalSideHeight / 2;

    function positionNode(node: LayoutNode, startY: number) {
      const dir = side === 'right' ? 1 : -1;
      const x = dir * (ROOT_GAP + (node.depth - 1) * HORIZONTAL_SPACING);

      if (node.children.length === 0) {
        node.x = x;
        node.y = startY + node.subtreeHeight / 2;
      } else {
        let childY = startY;
        node.children.forEach((child) => {
          positionNode(child, childY);
          childY += child.subtreeHeight;
        });

        // Center parent between first and last child
        const firstChild = node.children[0];
        const lastChild = node.children[node.children.length - 1];
        node.x = x;
        node.y = (firstChild.y + lastChild.y) / 2;
      }

      updatedNodes[node.id] = {
        ...node.data,
        x: Math.round(node.x),
        y: Math.round(node.y),
        side,
      };
    }

    trees.forEach((tree) => {
      positionNode(tree, currentY);
      currentY += tree.subtreeHeight;
    });
  }

  layoutSide(rightChildIds, 'right');
  layoutSide(leftChildIds, 'left');

  return updatedNodes;
}
