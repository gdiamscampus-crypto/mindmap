import React from 'react';
import {
  Palette,
  Type,
  Maximize,
  Sliders,
  ChevronRight,
  ChevronLeft,
  Circle,
  Square,
  Sparkles,
  FileText,
  Smile,
  Hash,
} from 'lucide-react';
import { CanvasPattern, ConnectionStyle, FontStyle, MindMap, MindNodeData, NodeShape } from '../types';

interface RightSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  selectedNode: MindNodeData | null;
  map: MindMap;
  onUpdateNode: (id: string, updates: Partial<MindNodeData>) => void;
  onUpdateMap: (updates: Partial<MindMap>) => void;
}

// Preset color options for nodes
const PRESET_NODE_COLORS = [
  '#4f46e5', // Indigo
  '#0284c7', // Sky
  '#10b981', // Emerald
  '#f59e0b', // Amber
  '#ef4444', // Red
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#06b6d4', // Cyan
  '#1e293b', // Slate Dark
  '#ffffff', // Clean White
  '#f1f5f9', // Light Slate
  '#fef3c7', // Warm Cream
  '#e0f2fe', // Soft Ice
  '#d1fae5', // Soft Mint
  '#ede9fe', // Soft Lavender
  '#fee2e2', // Soft Rose
];

// Preset text colors
const PRESET_TEXT_COLORS = [
  '#ffffff', // White
  '#0f172a', // Slate 900
  '#334155', // Slate 700
  '#1e3a8a', // Dark Blue
  '#064e3b', // Dark Green
  '#78350f', // Dark Amber
  '#881337', // Dark Rose
  '#4c1d95', // Dark Violet
];

// Canvas background presets
const PRESET_CANVAS_BG = [
  { name: 'Pure White', color: '#ffffff' },
  { name: 'Soft Slate', color: '#f8fafc' },
  { name: 'Warm Paper', color: '#fdfbf7' },
  { name: 'Pale Mist', color: '#f1f5f9' },
  { name: 'Dark Slate', color: '#0f172a' },
  { name: 'Midnight', color: '#090d16' },
];

const PRESET_EMOJIS = ['🧠', '💡', '🎯', '🚀', '⭐', '🔥', '📚', '⚡', '📊', '🤝', '🛠️', '✅', '❓', '💬', '🔬', '🎨'];

export const RightSidebar: React.FC<RightSidebarProps> = ({
  isOpen,
  onToggle,
  selectedNode,
  map,
  onUpdateNode,
  onUpdateMap,
}) => {
  if (!isOpen) {
    return (
      <button
        id="toggle-right-sidebar-btn"
        onClick={onToggle}
        className="absolute right-0 top-16 z-30 w-7 h-10 rounded-l-xl bg-white dark:bg-slate-800 border-l border-y border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-500 hover:text-indigo-600 transition-colors"
        title="Open Inspector"
      >
        <ChevronLeft className="w-4 h-4" />
      </button>
    );
  }

  return (
    <aside
      id="right-sidebar"
      className="relative w-80 h-[calc(100vh-3.5rem)] bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 flex flex-col z-30 select-none shrink-0"
    >
      {/* Pinned close toggle */}
      <button
        onClick={onToggle}
        className="absolute -left-3 top-6 z-40 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        title="Collapse Inspector"
      >
        <ChevronRight className="w-3.5 h-3.5" />
      </button>

      {/* Header */}
      <div className="h-11 px-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-700 dark:text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
          <Sliders className="w-3.5 h-3.5 text-indigo-500" />
          {selectedNode ? 'Node Inspector' : 'Canvas Style'}
        </span>
        {selectedNode && (
          <span className="text-[11px] text-slate-400 truncate max-w-[120px]">
            {selectedNode.text || 'Selected'}
          </span>
        )}
      </div>

      {/* Body */}
      <div className="flex-1 overflow-y-auto p-4 space-y-5 text-xs">
        {selectedNode ? (
          <>
            {/* 1. Emoji Tag & Quick Icons */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                <Smile className="w-3.5 h-3.5 text-amber-500" />
                Emoji Tag
              </label>
              <div className="flex flex-wrap gap-1.5 p-2 bg-slate-50 dark:bg-slate-800/60 rounded-xl border border-slate-200 dark:border-slate-800">
                <button
                  onClick={() => onUpdateNode(selectedNode.id, { emoji: undefined })}
                  className={`w-7 h-7 rounded-lg text-xs flex items-center justify-center transition-all ${
                    !selectedNode.emoji
                      ? 'bg-indigo-600 text-white font-medium shadow-xs'
                      : 'bg-white dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-500'
                  }`}
                  title="No icon"
                >
                  ∅
                </button>
                {PRESET_EMOJIS.map((emoji) => (
                  <button
                    key={emoji}
                    onClick={() => onUpdateNode(selectedNode.id, { emoji })}
                    className={`w-7 h-7 rounded-lg text-sm flex items-center justify-center transition-all ${
                      selectedNode.emoji === emoji
                        ? 'bg-indigo-600 shadow-sm scale-110'
                        : 'hover:bg-slate-200 dark:hover:bg-slate-700'
                    }`}
                  >
                    {emoji}
                  </button>
                ))}
              </div>
            </div>

            {/* 2. Shape Customization */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Node Shape
              </label>
              <div className="grid grid-cols-3 gap-1.5">
                {[
                  { id: 'pill', label: 'Capsule' },
                  { id: 'rounded', label: 'Rounded' },
                  { id: 'rectangle', label: 'Rectangle' },
                  { id: 'oval', label: 'Oval' },
                  { id: 'underline', label: 'Underline' },
                ].map((s) => (
                  <button
                    key={s.id}
                    onClick={() => onUpdateNode(selectedNode.id, { shape: s.id as NodeShape })}
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border transition-all ${
                      (selectedNode.shape || 'pill') === s.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {s.label}
                  </button>
                ))}
              </div>
            </div>

            {/* 3. Node Background Color */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-indigo-500" />
                  Node Color
                </label>
                <input
                  type="color"
                  value={selectedNode.color || '#4f46e5'}
                  onChange={(e) => onUpdateNode(selectedNode.id, { color: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
                  title="Custom Hex Picker"
                />
              </div>
              <div className="grid grid-cols-8 gap-1.5">
                {PRESET_NODE_COLORS.map((hex) => (
                  <button
                    key={hex}
                    onClick={() => onUpdateNode(selectedNode.id, { color: hex })}
                    className={`w-6 h-6 rounded-md border transition-transform hover:scale-115 ${
                      selectedNode.color === hex
                        ? 'ring-2 ring-indigo-500 ring-offset-1 scale-105'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>

            {/* 4. Text Color */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Type className="w-3.5 h-3.5 text-cyan-500" />
                  Text Color
                </label>
                <input
                  type="color"
                  value={selectedNode.textColor || '#1e293b'}
                  onChange={(e) => onUpdateNode(selectedNode.id, { textColor: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
                />
              </div>
              <div className="grid grid-cols-8 gap-1.5">
                {PRESET_TEXT_COLORS.map((hex) => (
                  <button
                    key={hex}
                    onClick={() => onUpdateNode(selectedNode.id, { textColor: hex })}
                    className={`w-6 h-6 rounded-md border transition-transform hover:scale-115 ${
                      selectedNode.textColor === hex
                        ? 'ring-2 ring-indigo-500 ring-offset-1 scale-105'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                    style={{ backgroundColor: hex }}
                  />
                ))}
              </div>
            </div>

            {/* 5. Typography: Font Style, Font Size, Weight */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Typography
              </label>

              {/* Font Family */}
              <div className="grid grid-cols-4 gap-1 mb-2">
                {[
                  { id: 'sans', label: 'Sans' },
                  { id: 'serif', label: 'Serif' },
                  { id: 'mono', label: 'Mono' },
                  { id: 'handwriting', label: 'Hand' },
                ].map((f) => (
                  <button
                    key={f.id}
                    onClick={() => onUpdateNode(selectedNode.id, { fontStyle: f.id as FontStyle })}
                    className={`py-1 rounded-md text-xs font-medium border ${
                      (selectedNode.fontStyle || 'sans') === f.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {f.label}
                  </button>
                ))}
              </div>

              {/* Font Size & Weight */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-[10px] text-slate-400 mb-1 block">Size</span>
                  <select
                    value={selectedNode.fontSize || 15}
                    onChange={(e) => onUpdateNode(selectedNode.id, { fontSize: Number(e.target.value) })}
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                  >
                    <option value={12}>Small (12px)</option>
                    <option value={14}>Regular (14px)</option>
                    <option value={16}>Medium (16px)</option>
                    <option value={19}>Large (19px)</option>
                    <option value={22}>Heading (22px)</option>
                    <option value={26}>Hero (26px)</option>
                  </select>
                </div>

                <div>
                  <span className="text-[10px] text-slate-400 mb-1 block">Weight</span>
                  <select
                    value={selectedNode.fontWeight || 'normal'}
                    onChange={(e) =>
                      onUpdateNode(selectedNode.id, {
                        fontWeight: e.target.value as 'normal' | 'medium' | 'bold',
                      })
                    }
                    className="w-full text-xs p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100"
                  >
                    <option value="normal">Normal</option>
                    <option value="medium">Medium</option>
                    <option value="bold">Bold</option>
                  </select>
                </div>
              </div>
            </div>

            {/* 6. Border Style & Width */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider">
                Border Style
              </label>
              <div className="grid grid-cols-4 gap-1 mb-2">
                {['none', 'solid', 'dashed', 'dotted'].map((b) => (
                  <button
                    key={b}
                    onClick={() =>
                      onUpdateNode(selectedNode.id, {
                        borderStyle: b as 'none' | 'solid' | 'dashed' | 'dotted',
                      })
                    }
                    className={`py-1 rounded-md text-xs font-medium border capitalize ${
                      (selectedNode.borderStyle || 'none') === b
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {b}
                  </button>
                ))}
              </div>
            </div>

            {/* 7. Connection / Line Style & Branch Color */}
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Branch / Connection
                </label>
                <input
                  type="color"
                  value={selectedNode.branchColor || '#6366f1'}
                  onChange={(e) => onUpdateNode(selectedNode.id, { branchColor: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
                  title="Branch line color"
                />
              </div>

              <div className="grid grid-cols-3 gap-1.5 mb-2">
                {[
                  { id: 'curved', label: 'Curved' },
                  { id: 'straight', label: 'Straight' },
                  { id: 'stepped', label: 'Stepped' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() =>
                      onUpdateNode(selectedNode.id, { lineStyle: l.id as ConnectionStyle })
                    }
                    className={`py-1.5 px-2 rounded-lg text-xs font-medium border ${
                      (selectedNode.lineStyle || map.defaultLineStyle) === l.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-300'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>

              {/* Line thickness */}
              <div className="flex items-center justify-between mt-2">
                <span className="text-[10px] text-slate-400">Thickness</span>
                <div className="flex gap-1">
                  {[1.5, 2.5, 4].map((width) => (
                    <button
                      key={width}
                      onClick={() => onUpdateNode(selectedNode.id, { lineWidth: width })}
                      className={`px-2 py-0.5 rounded text-xs border ${
                        (selectedNode.lineWidth || 2.5) === width
                          ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-950 text-indigo-600 font-semibold'
                          : 'border-slate-200 dark:border-slate-800 text-slate-600'
                      }`}
                    >
                      {width}px
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* 8. Node Notes */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-1.5 uppercase tracking-wider flex items-center gap-1">
                <FileText className="w-3.5 h-3.5 text-emerald-500" />
                Node Notes & Reference
              </label>
              <textarea
                value={selectedNode.notes || ''}
                onChange={(e) => onUpdateNode(selectedNode.id, { notes: e.target.value })}
                placeholder="Add contextual details, definitions, URLs, or homework tasks..."
                rows={3}
                className="w-full text-xs p-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500 resize-none"
              />
            </div>
          </>
        ) : (
          /* Canvas Global Settings (when no node is selected) */
          <>
            <div className="p-3 rounded-xl bg-indigo-50/50 dark:bg-indigo-950/30 border border-indigo-100 dark:border-indigo-900/40 text-slate-600 dark:text-slate-300">
              <p className="text-xs">
                Select any node on the canvas to inspect and customize its shape, colors, font, and branch styling.
              </p>
            </div>

            {/* Canvas Background Color */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="text-[11px] font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center gap-1">
                  <Palette className="w-3.5 h-3.5 text-indigo-500" />
                  Canvas Background
                </label>
                <input
                  type="color"
                  value={map.backgroundColor || '#f8fafc'}
                  onChange={(e) => onUpdateMap({ backgroundColor: e.target.value })}
                  className="w-5 h-5 rounded cursor-pointer border-0 p-0 bg-transparent"
                />
              </div>

              <div className="grid grid-cols-3 gap-2">
                {PRESET_CANVAS_BG.map((bg) => (
                  <button
                    key={bg.color}
                    onClick={() => onUpdateMap({ backgroundColor: bg.color })}
                    className={`p-2 rounded-lg border text-left flex flex-col gap-1 transition-all ${
                      map.backgroundColor === bg.color
                        ? 'ring-2 ring-indigo-500 border-indigo-500'
                        : 'border-slate-200 dark:border-slate-700'
                    }`}
                  >
                    <div
                      className="w-full h-5 rounded border border-slate-200 dark:border-slate-600"
                      style={{ backgroundColor: bg.color }}
                    />
                    <span className="text-[10px] text-slate-600 dark:text-slate-300 truncate">
                      {bg.name}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Canvas Grid Pattern */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                Canvas Grid Pattern
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'dots', label: 'Dot Grid' },
                  { id: 'grid', label: 'Line Grid' },
                  { id: 'blank', label: 'Clean Blank' },
                ].map((p) => (
                  <button
                    key={p.id}
                    onClick={() => onUpdateMap({ canvasPattern: p.id as CanvasPattern })}
                    className={`py-2 px-2 rounded-lg text-xs font-medium border text-center ${
                      map.canvasPattern === p.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Default Connection Line Style */}
            <div>
              <label className="block text-[11px] font-semibold text-slate-500 dark:text-slate-400 mb-2 uppercase tracking-wider">
                Default Line Style
              </label>
              <div className="grid grid-cols-3 gap-2">
                {[
                  { id: 'curved', label: 'Curved' },
                  { id: 'straight', label: 'Straight' },
                  { id: 'stepped', label: 'Stepped' },
                ].map((l) => (
                  <button
                    key={l.id}
                    onClick={() => onUpdateMap({ defaultLineStyle: l.id as ConnectionStyle })}
                    className={`py-2 px-2 rounded-lg text-xs font-medium border text-center ${
                      map.defaultLineStyle === l.id
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-600 dark:text-indigo-300 font-semibold'
                        : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                    }`}
                  >
                    {l.label}
                  </button>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </aside>
  );
};
