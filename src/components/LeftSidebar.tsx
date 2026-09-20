import React, { useState } from 'react';
import {
  LayoutTemplate,
  ListTree,
  Keyboard,
  Upload,
  ChevronLeft,
  ChevronRight,
  BookOpen,
  GraduationCap,
  KanbanSquare,
  Lightbulb,
  TrendingUp,
  CalendarCheck,
  Search,
  Plus,
} from 'lucide-react';
import { MindMap, MindNodeData, TemplateDefinition } from '../types';
import { TEMPLATES } from '../data/templates';

interface LeftSidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onSelectTemplate: (template: TemplateDefinition) => void;
  nodes: Record<string, MindNodeData>;
  rootId: string;
  selectedNodeId: string | null;
  onSelectNode: (id: string) => void;
  onImportJson: (file: File) => void;
  onAddChild: (parentId: string) => void;
}

type TabType = 'templates' | 'outline' | 'shortcuts';

export const LeftSidebar: React.FC<LeftSidebarProps> = ({
  isOpen,
  onToggle,
  onSelectTemplate,
  nodes,
  rootId,
  selectedNodeId,
  onSelectNode,
  onImportJson,
  onAddChild,
}) => {
  const [activeTab, setActiveTab] = useState<TabType>('templates');
  const [outlineSearch, setOutlineSearch] = useState('');
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  const getTemplateIcon = (iconName: string) => {
    switch (iconName) {
      case 'GraduationCap':
        return <GraduationCap className="w-4 h-4 text-blue-500" />;
      case 'BookOpen':
        return <BookOpen className="w-4 h-4 text-amber-500" />;
      case 'KanbanSquare':
        return <KanbanSquare className="w-4 h-4 text-emerald-500" />;
      case 'Lightbulb':
        return <Lightbulb className="w-4 h-4 text-pink-500" />;
      case 'TrendingUp':
        return <TrendingUp className="w-4 h-4 text-cyan-500" />;
      case 'CalendarCheck':
        return <CalendarCheck className="w-4 h-4 text-purple-500" />;
      default:
        return <LayoutTemplate className="w-4 h-4 text-indigo-500" />;
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      onImportJson(file);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  // Render recursive outline item
  const renderOutlineNode = (nodeId: string, depth = 0) => {
    const node = nodes[nodeId];
    if (!node) return null;

    const childIds = Object.values(nodes)
      .filter((n) => n.parentId === nodeId)
      .map((n) => n.id);

    const matchesSearch =
      outlineSearch.trim() === '' ||
      node.text.toLowerCase().includes(outlineSearch.toLowerCase());

    const isSelected = selectedNodeId === nodeId;

    return (
      <div key={`outline-${node.id}`} className="select-none">
        {matchesSearch && (
          <div
            onClick={() => onSelectNode(node.id)}
            className={`flex items-center justify-between group px-2 py-1.5 rounded-lg cursor-pointer text-xs transition-colors ${
              isSelected
                ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-700 dark:text-indigo-300 font-medium'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
            style={{ paddingLeft: `${Math.max(8, depth * 16 + 8)}px` }}
          >
            <div className="flex items-center gap-1.5 truncate">
              <span
                className="w-2 h-2 rounded-full shrink-0"
                style={{ backgroundColor: node.branchColor || node.color || '#6366f1' }}
              />
              <span className="truncate">
                {node.emoji && <span className="mr-1">{node.emoji}</span>}
                {node.text || 'Untitled'}
              </span>
            </div>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onAddChild(node.id);
              }}
              title="Add child to this node"
              className="opacity-0 group-hover:opacity-100 p-0.5 rounded hover:bg-indigo-200 dark:hover:bg-indigo-900 text-indigo-600 transition-opacity"
            >
              <Plus className="w-3 h-3" />
            </button>
          </div>
        )}

        {childIds.map((cid) => renderOutlineNode(cid, depth + 1))}
      </div>
    );
  };

  return (
    <aside
      id="left-sidebar"
      className={`relative h-[calc(100vh-3.5rem)] bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-200 z-30 shrink-0 ${
        isOpen ? 'w-72' : 'w-12'
      }`}
    >
      {/* Toggle button pinned to border */}
      <button
        id="toggle-left-sidebar-btn"
        onClick={onToggle}
        className="absolute -right-3 top-6 z-40 w-6 h-6 rounded-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm flex items-center justify-center text-slate-500 hover:text-indigo-600 dark:hover:text-indigo-400 transition-colors"
        title={isOpen ? 'Collapse Sidebar' : 'Expand Sidebar'}
      >
        {isOpen ? <ChevronLeft className="w-3.5 h-3.5" /> : <ChevronRight className="w-3.5 h-3.5" />}
      </button>

      {/* When collapsed, vertical icon tab bar */}
      {!isOpen ? (
        <div className="flex flex-col items-center py-4 gap-3">
          <button
            onClick={() => {
              onToggle();
              setActiveTab('templates');
            }}
            title="Templates"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
          >
            <LayoutTemplate className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              onToggle();
              setActiveTab('outline');
            }}
            title="Mind Map Outline"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
          >
            <ListTree className="w-5 h-5" />
          </button>
          <button
            onClick={() => {
              onToggle();
              setActiveTab('shortcuts');
            }}
            title="Keyboard Shortcuts"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-indigo-600 transition-colors"
          >
            <Keyboard className="w-5 h-5" />
          </button>
        </div>
      ) : (
        /* Full Sidebar Content */
        <div className="flex flex-col h-full overflow-hidden">
          {/* Tabs header */}
          <div className="flex items-center border-b border-slate-200 dark:border-slate-800 px-2 pt-2 bg-slate-50/50 dark:bg-slate-900/50">
            <button
              onClick={() => setActiveTab('templates')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'templates'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <LayoutTemplate className="w-3.5 h-3.5" />
              Templates
            </button>
            <button
              onClick={() => setActiveTab('outline')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'outline'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <ListTree className="w-3.5 h-3.5" />
              Outline
            </button>
            <button
              onClick={() => setActiveTab('shortcuts')}
              className={`flex-1 flex items-center justify-center gap-1.5 py-2 text-xs font-medium border-b-2 transition-colors ${
                activeTab === 'shortcuts'
                  ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400'
                  : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
              }`}
            >
              <Keyboard className="w-3.5 h-3.5" />
              Keys
            </button>
          </div>

          {/* Tab 1: Templates */}
          {activeTab === 'templates' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-2.5">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider">
                  Preset Blueprints
                </span>
                {/* Hidden JSON file input */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileUpload}
                  accept=".json"
                  className="hidden"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  title="Import mind map JSON file"
                  className="flex items-center gap-1 text-[11px] text-indigo-600 dark:text-indigo-400 hover:underline"
                >
                  <Upload className="w-3 h-3" />
                  Import JSON
                </button>
              </div>

              {TEMPLATES.map((tmpl) => (
                <div
                  key={tmpl.id}
                  id={`template-item-${tmpl.id}`}
                  onClick={() => onSelectTemplate(tmpl)}
                  className="group p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-700 bg-white dark:bg-slate-850 hover:bg-indigo-50/30 dark:hover:bg-indigo-950/20 cursor-pointer transition-all shadow-xs"
                >
                  <div className="flex items-center gap-2 mb-1">
                    <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-800 group-hover:bg-white dark:group-hover:bg-slate-700">
                      {getTemplateIcon(tmpl.iconName)}
                    </div>
                    <span className="text-xs font-semibold text-slate-800 dark:text-slate-100 group-hover:text-indigo-600 dark:group-hover:text-indigo-400">
                      {tmpl.name}
                    </span>
                    <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-500">
                      {tmpl.category}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-snug">
                    {tmpl.description}
                  </p>
                </div>
              ))}
            </div>
          )}

          {/* Tab 2: Outline */}
          {activeTab === 'outline' && (
            <div className="flex-1 flex flex-col overflow-hidden p-3">
              <div className="relative mb-2">
                <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  placeholder="Filter outline nodes..."
                  value={outlineSearch}
                  onChange={(e) => setOutlineSearch(e.target.value)}
                  className="w-full text-xs pl-8 pr-2 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 outline-none focus:border-indigo-500"
                />
              </div>
              <div className="flex-1 overflow-y-auto space-y-0.5 pr-1">
                {rootId && renderOutlineNode(rootId)}
              </div>
            </div>
          )}

          {/* Tab 3: Keyboard Shortcuts */}
          {activeTab === 'shortcuts' && (
            <div className="flex-1 overflow-y-auto p-3 space-y-3 text-xs">
              <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider pb-1">
                Desktop Navigation
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Add Child Node</span>
                  <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                    Tab
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Add Sibling Node</span>
                  <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                    Enter
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Edit Node Text</span>
                  <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                    Space / Double Click
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Delete Node</span>
                  <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                    Delete / Backspace
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Duplicate Node</span>
                  <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                    Ctrl + D
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Undo / Redo</span>
                  <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                    Ctrl + Z / Y
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Pan Canvas</span>
                  <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                    Drag Canvas / Space
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Zoom In / Out</span>
                  <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                    Scroll Wheel
                  </kbd>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-slate-600 dark:text-slate-300">Auto Layout</span>
                  <kbd className="px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 font-mono text-[11px]">
                    Ctrl + L
                  </kbd>
                </div>
              </div>
            </div>
          )}
        </div>
      )}
    </aside>
  );
};
