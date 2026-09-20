import React, { useState, useRef, useEffect } from 'react';
import { MindNodeData } from '../types';

interface NodeViewProps {
  node: MindNodeData;
  isSelected: boolean;
  hasChildren: boolean;
  isCollapsed: boolean;
  childrenCount: number;
  searchHighlight: boolean;
  onSelect: (id: string, e: React.MouseEvent) => void;
  onStartDrag: (id: string, e: React.MouseEvent | React.TouchEvent) => void;
  onTextChange: (id: string, newText: string) => void;
  onToggleCollapse: (id: string, e: React.MouseEvent) => void;
  onAddChildQuick: (parentId: string) => void;
  onAddSiblingQuick: (siblingId: string) => void;
}

export const NodeView: React.FC<NodeViewProps> = ({
  node,
  isSelected,
  hasChildren,
  isCollapsed,
  childrenCount,
  searchHighlight,
  onSelect,
  onStartDrag,
  onTextChange,
  onToggleCollapse,
  onAddChildQuick,
  onAddSiblingQuick,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editText, setEditText] = useState(node.text);
  const [isHovered, setIsHovered] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    setEditText(node.text);
  }, [node.text]);

  useEffect(() => {
    if (isEditing && inputRef.current) {
      inputRef.current.focus();
      inputRef.current.select();
    }
  }, [isEditing]);

  const handleDoubleClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsEditing(true);
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (editText.trim()) {
      onTextChange(node.id, editText.trim());
    } else {
      setEditText(node.text);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      setIsEditing(false);
      if (editText.trim()) {
        onTextChange(node.id, editText.trim());
      }
    } else if (e.key === 'Escape') {
      setEditText(node.text);
      setIsEditing(false);
    }
  };

  // Font family mapping
  const getFontFamily = () => {
    switch (node.fontStyle) {
      case 'serif':
        return 'font-serif';
      case 'mono':
        return 'font-mono';
      case 'handwriting':
        return 'font-["Caveat",cursive] text-lg';
      case 'sans':
      default:
        return 'font-sans';
    }
  };

  // Shape classes
  const getShapeClass = () => {
    if (node.shape === 'underline') {
      return 'bg-transparent border-b-2 rounded-none px-2 py-1';
    }
    switch (node.shape) {
      case 'rounded':
        return 'rounded-xl px-4 py-2';
      case 'rectangle':
        return 'rounded-md px-3.5 py-1.5';
      case 'oval':
        return 'rounded-[2rem] px-5 py-2.5';
      case 'pill':
      default:
        return 'rounded-full px-4 py-2';
    }
  };

  const borderStyleVal = node.borderStyle || (node.shape === 'underline' ? 'solid' : 'none');
  const borderColorVal = node.borderColor || node.branchColor || '#cbd5e1';
  const borderWidthVal = node.borderWidth ?? (node.shape === 'underline' ? 3 : borderStyleVal === 'none' ? 0 : 2);

  const style: React.CSSProperties = {
    backgroundColor: node.shape === 'underline' ? 'transparent' : (node.color || '#ffffff'),
    color: node.textColor || (node.shape === 'underline' ? '#0f172a' : '#1e293b'),
    fontSize: node.fontSize ? `${node.fontSize}px` : '15px',
    borderStyle: borderStyleVal,
    borderColor: borderColorVal,
    borderWidth: `${borderWidthVal}px`,
  };

  // Collapse toggle position (right or left depending on node side)
  const isLeftSide = node.side === 'left';

  return (
    <div
      id={`mind-node-${node.id}`}
      className="absolute select-none cursor-grab active:cursor-grabbing transition-shadow duration-150"
      style={{
        left: `${node.x}px`,
        top: `${node.y}px`,
        transform: 'translate(-50%, -50%)',
        zIndex: isSelected ? 40 : 20,
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onMouseDown={(e) => {
        onSelect(node.id, e);
        onStartDrag(node.id, e);
      }}
      onTouchStart={(e) => {
        onSelect(node.id, e as unknown as React.MouseEvent);
        onStartDrag(node.id, e);
      }}
    >
      <div
        className={`group relative flex items-center justify-center gap-1.5 shadow-sm transition-all duration-200 ${getShapeClass()} ${getFontFamily()} ${
          isSelected
            ? 'ring-3 ring-indigo-500 ring-offset-2 shadow-lg scale-[1.02]'
            : 'hover:shadow-md'
        } ${searchHighlight ? 'ring-4 ring-amber-400 animate-pulse' : ''}`}
        style={style}
        onDoubleClick={handleDoubleClick}
      >
        {/* Node Emoji Tag if present */}
        {node.emoji && (
          <span className="text-base leading-none select-none" role="img" aria-label="node icon">
            {node.emoji}
          </span>
        )}

        {/* Text Content / Direct Inline Edit */}
        {isEditing ? (
          <input
            ref={inputRef}
            type="text"
            value={editText}
            onChange={(e) => setEditText(e.target.value)}
            onBlur={handleBlur}
            onKeyDown={handleKeyDown}
            className="bg-transparent outline-none border-b border-indigo-400 text-center min-w-[60px] max-w-[280px]"
            style={{
              color: node.textColor || '#1e293b',
              fontSize: node.fontSize ? `${node.fontSize}px` : '15px',
              fontWeight: node.fontWeight || 'normal',
            }}
            onClick={(e) => e.stopPropagation()}
            onMouseDown={(e) => e.stopPropagation()}
          />
        ) : (
          <span
            className="whitespace-pre tracking-normal leading-tight select-none inline-block"
            style={{
              fontWeight: node.fontWeight || 'normal',
            }}
          >
            {node.text || 'Untitled'}
          </span>
        )}

        {/* Notes indicator badge if present */}
        {node.notes && (
          <span
            title={node.notes}
            className="w-1.5 h-1.5 rounded-full bg-amber-400 -mr-0.5"
          />
        )}

        {/* Branch Fold/Collapse Button if node has children */}
        {hasChildren && (
          <button
            id={`collapse-btn-${node.id}`}
            title={isCollapsed ? `Expand branch (${childrenCount} items)` : 'Collapse branch'}
            onClick={(e) => {
              e.stopPropagation();
              onToggleCollapse(node.id, e);
            }}
            onMouseDown={(e) => e.stopPropagation()}
            className={`absolute top-1/2 -translate-y-1/2 ${
              isLeftSide ? '-left-6' : '-right-6'
            } w-5 h-5 rounded-full bg-white dark:bg-slate-800 border-2 flex items-center justify-center text-[10px] font-bold shadow-md transition-transform hover:scale-115 active:scale-95 z-30`}
            style={{
              borderColor: node.branchColor || '#6366f1',
              color: node.branchColor || '#6366f1',
            }}
          >
            {isCollapsed ? `+` : `–`}
          </button>
        )}

        {/* Quick Add Child / Sibling Action Buttons on Node Selection/Hover */}
        {(isSelected || isHovered) && (
          <div
            className={`absolute top-1/2 -translate-y-1/2 ${
              isLeftSide ? '-right-7' : '-left-7'
            } flex items-center gap-1 opacity-90 transition-opacity`}
            onMouseDown={(e) => e.stopPropagation()}
          >
            <button
              id={`quick-child-${node.id}`}
              title="Add Child Node (Tab)"
              onClick={(e) => {
                e.stopPropagation();
                onAddChildQuick(node.id);
              }}
              className="w-5 h-5 rounded-full bg-indigo-600 hover:bg-indigo-700 text-white flex items-center justify-center text-xs font-bold shadow hover:scale-110 active:scale-95 transition-all"
            >
              +
            </button>
            {node.parentId && (
              <button
                id={`quick-sibling-${node.id}`}
                title="Add Sibling Node (Enter)"
                onClick={(e) => {
                  e.stopPropagation();
                  onAddSiblingQuick(node.id);
                }}
                className="w-5 h-5 rounded-full bg-slate-600 hover:bg-slate-700 text-white flex items-center justify-center text-[10px] font-bold shadow hover:scale-110 active:scale-95 transition-all"
              >
                ↵
              </button>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
