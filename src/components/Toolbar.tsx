import React, { useState, useRef, useEffect } from 'react';
import {
  Plus,
  GitBranch,
  CornerDownRight,
  Trash2,
  Undo2,
  Redo2,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Sparkles,
  Search,
  Download,
  Save,
  FilePlus2,
  Sun,
  Moon,
  ChevronDown,
  Copy,
  FileText,
  FileCode,
  Image as ImageIcon,
  Check,
} from 'lucide-react';

interface ToolbarProps {
  mapTitle: string;
  onUpdateTitle: (title: string) => void;
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  onNewMap: () => void;
  onAddNode: () => void;
  onAddChild: () => void;
  onAddSibling: () => void;
  onDeleteNode: () => void;
  onDuplicateNode: () => void;
  hasSelectedNode: boolean;
  isRootSelected: boolean;
  zoom: number;
  onZoomIn: () => void;
  onZoomOut: () => void;
  onZoomReset: () => void;
  onFitToScreen: () => void;
  onAutoLayout: () => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  searchResultsCount: number;
  onExport: (format: 'png' | 'pdf' | 'svg' | 'json') => void;
  onSave: () => void;
  isSaved: boolean;
  isDarkMode: boolean;
  onToggleDarkMode: () => void;
  onToggleLeftSidebar: () => void;
  onToggleRightSidebar: () => void;
  isLeftSidebarOpen: boolean;
  isRightSidebarOpen: boolean;
}

export const Toolbar: React.FC<ToolbarProps> = ({
  mapTitle,
  onUpdateTitle,
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  onNewMap,
  onAddNode,
  onAddChild,
  onAddSibling,
  onDeleteNode,
  onDuplicateNode,
  hasSelectedNode,
  isRootSelected,
  zoom,
  onZoomIn,
  onZoomOut,
  onZoomReset,
  onFitToScreen,
  onAutoLayout,
  searchQuery,
  onSearchChange,
  searchResultsCount,
  onExport,
  onSave,
  isSaved,
  isDarkMode,
  onToggleDarkMode,
}) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [titleInput, setTitleInput] = useState(mapTitle);
  const [isExportMenuOpen, setIsExportMenuOpen] = useState(false);
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const exportRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setTitleInput(mapTitle);
  }, [mapTitle]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (exportRef.current && !exportRef.current.contains(e.target as Node)) {
        setIsExportMenuOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleTitleSubmit = () => {
    setIsEditingTitle(false);
    if (titleInput.trim()) {
      onUpdateTitle(titleInput.trim());
    } else {
      setTitleInput(mapTitle);
    }
  };

  return (
    <header
      id="main-toolbar"
      className="h-14 bg-white/95 dark:bg-slate-900/95 border-b border-slate-200 dark:border-slate-800 px-3 sm:px-4 flex items-center justify-between gap-2 z-40 backdrop-blur-md select-none shrink-0"
    >
      {/* Left: App Logo & Map Title */}
      <div className="flex items-center gap-2.5 min-w-0">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-indigo-600 text-white flex items-center justify-center font-bold text-sm shadow-sm ring-2 ring-indigo-500/20">
            🧠
          </div>
          {isEditingTitle ? (
            <input
              type="text"
              value={titleInput}
              onChange={(e) => setTitleInput(e.target.value)}
              onBlur={handleTitleSubmit}
              onKeyDown={(e) => {
                if (e.key === 'Enter') handleTitleSubmit();
                if (e.key === 'Escape') {
                  setTitleInput(mapTitle);
                  setIsEditingTitle(false);
                }
              }}
              autoFocus
              className="text-sm font-semibold px-2 py-0.5 rounded border border-indigo-400 bg-transparent text-slate-800 dark:text-slate-100 outline-none w-48 sm:w-64"
            />
          ) : (
            <h1
              id="map-title-heading"
              onClick={() => setIsEditingTitle(true)}
              title="Click to rename"
              className="text-sm sm:text-base font-semibold text-slate-800 dark:text-slate-100 truncate cursor-pointer hover:bg-slate-100 dark:hover:bg-slate-800 px-1.5 py-0.5 rounded transition-colors"
            >
              {mapTitle}
            </h1>
          )}
        </div>

        {/* New Map */}
        <button
          id="btn-new-map"
          onClick={onNewMap}
          title="New Mind Map"
          className="hidden md:flex items-center gap-1 text-xs text-slate-600 dark:text-slate-300 hover:text-indigo-600 dark:hover:text-indigo-400 hover:bg-slate-100 dark:hover:bg-slate-800 px-2 py-1 rounded-md transition-colors"
        >
          <FilePlus2 className="w-3.5 h-3.5" />
          <span>New</span>
        </button>
      </div>

      {/* Center: Editing Actions */}
      <div className="flex items-center gap-1 sm:gap-1.5 overflow-x-auto py-1">
        {/* Undo / Redo */}
        <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
          <button
            id="btn-undo"
            onClick={onUndo}
            disabled={!canUndo}
            title="Undo (Ctrl+Z)"
            className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-35 disabled:hover:bg-transparent transition-all"
          >
            <Undo2 className="w-4 h-4" />
          </button>
          <button
            id="btn-redo"
            onClick={onRedo}
            disabled={!canRedo}
            title="Redo (Ctrl+Y)"
            className="p-1.5 rounded-md text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 disabled:opacity-35 disabled:hover:bg-transparent transition-all"
          >
            <Redo2 className="w-4 h-4" />
          </button>
        </div>

        <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-0.5 hidden sm:block" />

        {/* Node Actions */}
        <button
          id="btn-add-node"
          onClick={onAddNode}
          title="Add Standalone Central Topic"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 dark:hover:bg-indigo-900/60 text-xs font-medium transition-colors"
        >
          <Plus className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Add Topic</span>
        </button>

        <button
          id="btn-add-child"
          onClick={onAddChild}
          disabled={!hasSelectedNode}
          title="Add Child Node (Tab)"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-100 text-xs font-medium transition-colors"
        >
          <CornerDownRight className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
          <span className="hidden md:inline">Child</span>
        </button>

        <button
          id="btn-add-sibling"
          onClick={onAddSibling}
          disabled={!hasSelectedNode || isRootSelected}
          title="Add Sibling Node (Enter)"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-slate-100 text-xs font-medium transition-colors"
        >
          <GitBranch className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          <span className="hidden md:inline">Sibling</span>
        </button>

        <button
          id="btn-duplicate-node"
          onClick={onDuplicateNode}
          disabled={!hasSelectedNode || isRootSelected}
          title="Duplicate Node (Ctrl+D)"
          className="hidden lg:flex items-center gap-1 px-2 py-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 disabled:opacity-40 text-xs transition-colors"
        >
          <Copy className="w-3.5 h-3.5" />
        </button>

        <button
          id="btn-delete-node"
          onClick={onDeleteNode}
          disabled={!hasSelectedNode || isRootSelected}
          title="Delete Selected Node (Delete)"
          className="p-1.5 rounded-lg text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 disabled:opacity-35 disabled:hover:bg-transparent transition-colors"
        >
          <Trash2 className="w-4 h-4" />
        </button>

        <div className="h-5 w-[1px] bg-slate-200 dark:bg-slate-700 mx-0.5 hidden sm:block" />

        {/* Auto Layout */}
        <button
          id="btn-auto-layout"
          onClick={onAutoLayout}
          title="Organize Layout (Auto-align branches)"
          className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-300 hover:bg-amber-100 dark:hover:bg-amber-900/50 text-xs font-medium transition-colors"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span className="hidden lg:inline">Auto Layout</span>
        </button>
      </div>

      {/* Right: Search, Zoom, Export, Save, Theme */}
      <div className="flex items-center gap-1 sm:gap-2">
        {/* Search */}
        <div className="relative flex items-center">
          {isSearchExpanded ? (
            <div className="flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg px-2 py-1 border border-slate-200 dark:border-slate-700 transition-all">
              <Search className="w-3.5 h-3.5 text-slate-400 mr-1.5 shrink-0" />
              <input
                id="search-nodes-input"
                type="text"
                placeholder="Search nodes..."
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                autoFocus
                className="w-24 sm:w-36 bg-transparent text-xs text-slate-800 dark:text-slate-100 outline-none"
              />
              {searchQuery && (
                <span className="text-[10px] text-slate-400 font-medium ml-1">
                  {searchResultsCount}
                </span>
              )}
              <button
                onClick={() => {
                  onSearchChange('');
                  setIsSearchExpanded(false);
                }}
                className="ml-1 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 text-xs"
              >
                ✕
              </button>
            </div>
          ) : (
            <button
              id="btn-expand-search"
              onClick={() => setIsSearchExpanded(true)}
              title="Search Nodes"
              className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Search className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Zoom Controls */}
        <div className="hidden sm:flex items-center bg-slate-100 dark:bg-slate-800 rounded-lg p-0.5">
          <button
            id="btn-zoom-out"
            onClick={onZoomOut}
            title="Zoom Out"
            className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={onZoomReset}
            title="Reset to 100%"
            className="px-1.5 text-[11px] font-medium text-slate-600 dark:text-slate-300 hover:text-indigo-600"
          >
            {Math.round(zoom * 100)}%
          </button>
          <button
            id="btn-zoom-in"
            onClick={onZoomIn}
            title="Zoom In"
            className="p-1 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            id="btn-fit-screen"
            onClick={onFitToScreen}
            title="Fit to Screen"
            className="p-1 ml-0.5 rounded text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-all"
          >
            <Maximize2 className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Save Button */}
        <button
          id="btn-save-map"
          onClick={onSave}
          title={isSaved ? 'Saved to LocalStorage' : 'Save Mind Map'}
          className={`flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
            isSaved
              ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-200 dark:hover:bg-slate-700'
          }`}
        >
          {isSaved ? (
            <Check className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
          ) : (
            <Save className="w-3.5 h-3.5" />
          )}
          <span className="hidden md:inline">{isSaved ? 'Saved' : 'Save'}</span>
        </button>

        {/* Export Dropdown */}
        <div className="relative" ref={exportRef}>
          <button
            id="btn-export-dropdown"
            onClick={() => setIsExportMenuOpen(!isExportMenuOpen)}
            className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
            <ChevronDown className="w-3 h-3 ml-0.5" />
          </button>

          {isExportMenuOpen && (
            <div
              id="export-menu-popover"
              className="absolute right-0 mt-1 w-44 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-1.5 z-50 animate-in fade-in slide-in-from-top-1"
            >
              <div className="px-3 py-1 text-[10px] font-semibold tracking-wider text-slate-400 uppercase">
                Export As
              </div>
              <button
                id="export-png-btn"
                onClick={() => {
                  onExport('png');
                  setIsExportMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 flex items-center gap-2"
              >
                <ImageIcon className="w-3.5 h-3.5 text-blue-500" />
                PNG Image (High-Res)
              </button>
              <button
                id="export-pdf-btn"
                onClick={() => {
                  onExport('pdf');
                  setIsExportMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 flex items-center gap-2"
              >
                <FileText className="w-3.5 h-3.5 text-rose-500" />
                PDF Document
              </button>
              <button
                id="export-svg-btn"
                onClick={() => {
                  onExport('svg');
                  setIsExportMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 flex items-center gap-2"
              >
                <FileCode className="w-3.5 h-3.5 text-emerald-500" />
                SVG Vector
              </button>
              <div className="my-1 border-t border-slate-100 dark:border-slate-800" />
              <button
                id="export-json-btn"
                onClick={() => {
                  onExport('json');
                  setIsExportMenuOpen(false);
                }}
                className="w-full text-left px-3 py-1.5 text-xs text-slate-700 dark:text-slate-200 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 hover:text-indigo-600 flex items-center gap-2"
              >
                <FileCode className="w-3.5 h-3.5 text-amber-500" />
                JSON (Backup / Share)
              </button>
            </div>
          )}
        </div>

        {/* Dark / Light Mode Toggle */}
        <button
          id="btn-toggle-dark-mode"
          onClick={onToggleDarkMode}
          title={isDarkMode ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
          className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
        >
          {isDarkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4" />}
        </button>
      </div>
    </header>
  );
};
