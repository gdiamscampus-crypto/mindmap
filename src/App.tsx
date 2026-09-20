/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { CanvasViewport, ConnectionStyle, MindMap, MindNodeData, TemplateDefinition } from './types';
import { DEMO_MAP, BRANCH_PALETTES } from './data/templates';
import { Toolbar } from './components/Toolbar';
import { LeftSidebar } from './components/LeftSidebar';
import { RightSidebar } from './components/RightSidebar';
import { MindMapCanvas } from './components/MindMapCanvas';
import { TeachersWorkshopView } from './components/workshop/TeachersWorkshopView';
import { calculateAutoLayout } from './utils/layout';
import { exportMapAsJson, exportMapAsPdf, exportMapAsPng, exportMapAsSvg, getMapBoundingBox } from './utils/export';

const STORAGE_KEY = 'mindnode_active_map_v1';
const THEME_KEY = 'mindnode_theme_mode';

export default function App() {
  // Load initial map from localStorage or fallback to DEMO_MAP
  const [map, setMap] = useState<MindMap>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed && parsed.rootId && parsed.nodes) {
          return parsed;
        }
      }
    } catch {
      // ignore
    }
    return DEMO_MAP;
  });

  // Undo / Redo history stacks
  const [past, setPast] = useState<MindMap[]>([]);
  const [future, setFuture] = useState<MindMap[]>([]);

  // Selection & UI state
  const [currentView, setCurrentView] = useState<'canvas' | 'workshop'>('workshop');
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>('root');
  const [isSaved, setIsSaved] = useState(true);
  const [isDarkMode, setIsDarkMode] = useState<boolean>(() => {
    try {
      const mode = localStorage.getItem(THEME_KEY);
      if (mode) return mode === 'dark';
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    } catch {
      return false;
    }
  });

  // Sidebars
  const [isLeftSidebarOpen, setIsLeftSidebarOpen] = useState(true);
  const [isRightSidebarOpen, setIsRightSidebarOpen] = useState(true);

  // Search
  const [searchQuery, setSearchQuery] = useState('');

  // Canvas Viewport
  const [viewport, setViewport] = useState<CanvasViewport>({
    x: typeof window !== 'undefined' ? window.innerWidth / 2 : 500,
    y: typeof window !== 'undefined' ? window.innerHeight / 2 : 400,
    zoom: 1,
  });

  const svgRef = useRef<SVGSVGElement | null>(null);

  // Sync dark mode class
  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem(THEME_KEY, 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem(THEME_KEY, 'light');
    }
  }, [isDarkMode]);

  // Center initial viewport on mount
  useEffect(() => {
    const handleInitialCenter = () => {
      const rootNode = map.nodes[map.rootId];
      const rootX = rootNode ? rootNode.x : 0;
      const rootY = rootNode ? rootNode.y : 0;
      setViewport({
        x: window.innerWidth / 2 - rootX,
        y: window.innerHeight / 2 - rootY,
        zoom: 0.95,
      });
    };
    handleInitialCenter();
  }, []);

  // Auto-save to localStorage debounced
  useEffect(() => {
    setIsSaved(false);
    const timeout = setTimeout(() => {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
        setIsSaved(true);
      } catch (err) {
        console.error('Could not save map to localStorage', err);
      }
    }, 600);
    return () => clearTimeout(timeout);
  }, [map]);

  // Push map to history before making mutation
  const pushToHistory = useCallback(
    (newMap: MindMap) => {
      setPast((prev) => [...prev.slice(-30), map]);
      setFuture([]);
      setMap(newMap);
    },
    [map]
  );

  // Undo
  const handleUndo = useCallback(() => {
    if (past.length === 0) return;
    const previous = past[past.length - 1];
    const newPast = past.slice(0, past.length - 1);
    setPast(newPast);
    setFuture((prev) => [map, ...prev]);
    setMap(previous);
  }, [past, map]);

  // Redo
  const handleRedo = useCallback(() => {
    if (future.length === 0) return;
    const next = future[0];
    const newFuture = future.slice(1);
    setFuture(newFuture);
    setPast((prev) => [...prev, map]);
    setMap(next);
  }, [future, map]);

  // Create brand new map
  const handleNewMap = () => {
    const newRootId = 'root-' + Date.now();
    const newMap: MindMap = {
      id: 'map-' + Date.now(),
      title: 'New Mind Map',
      createdAt: Date.now(),
      updatedAt: Date.now(),
      backgroundColor: isDarkMode ? '#0f172a' : '#f8fafc',
      canvasPattern: 'dots',
      defaultLineStyle: 'curved',
      rootId: newRootId,
      nodes: {
        [newRootId]: {
          id: newRootId,
          parentId: null,
          text: 'Central Topic',
          x: 0,
          y: 0,
          color: '#4f46e5',
          textColor: '#ffffff',
          fontSize: 20,
          fontWeight: 'bold',
          shape: 'pill',
          borderStyle: 'none',
          branchColor: '#4f46e5',
          lineWidth: 3,
          lineStyle: 'curved',
          emoji: '💡',
        },
      },
    };
    pushToHistory(newMap);
    setSelectedNodeId(newRootId);
    setViewport({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      zoom: 1,
    });
  };

  // Load a ready-made template
  const handleSelectTemplate = (template: TemplateDefinition) => {
    const newMap: MindMap = {
      ...template.map,
      id: 'map-' + Date.now(),
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };
    pushToHistory(newMap);
    setSelectedNodeId(newMap.rootId);
    // Center viewport
    setViewport({
      x: window.innerWidth / 2,
      y: window.innerHeight / 2,
      zoom: 0.9,
    });
  };

  // Add child node
  const handleAddChild = useCallback(
    (targetParentId?: string) => {
      const parentId = targetParentId || selectedNodeId || map.rootId;
      const parent = map.nodes[parentId];
      if (!parent) return;

      const newId = 'node-' + Date.now() + '-' + Math.floor(Math.random() * 1000);

      // Existing children count to cycle colors and offsets
      const existingChildren = Object.values(map.nodes).filter((n) => n.parentId === parentId);
      const childCount = existingChildren.length;

      // Determine side:
      // If parent is root, alternate right and left
      // If parent has a side, child inherits parent's side
      let side: 'left' | 'right' = 'right';
      if (parent.parentId === null) {
        side = childCount % 2 === 0 ? 'right' : 'left';
      } else if (parent.side) {
        side = parent.side;
      }

      // Determine branch color:
      // If parent is root, pick a palette color. If parent is subnode, inherit parent branch color
      const branchColor =
        parent.parentId === null
          ? BRANCH_PALETTES[childCount % BRANCH_PALETTES.length]
          : parent.branchColor || '#6366f1';

      const dir = side === 'right' ? 1 : -1;
      const offsetX = dir * 240;
      const offsetY = (childCount - Math.floor(existingChildren.length / 2)) * 60;

      const newNode: MindNodeData = {
        id: newId,
        parentId,
        text: 'New Idea',
        x: parent.x + offsetX,
        y: parent.y + offsetY,
        color: isDarkMode ? '#1e293b' : '#ffffff',
        textColor: isDarkMode ? '#f1f5f9' : '#0f172a',
        fontSize: 14,
        fontStyle: 'sans',
        fontWeight: 'normal',
        shape: 'rounded',
        borderStyle: 'solid',
        borderColor: branchColor,
        borderWidth: 1.5,
        branchColor,
        lineWidth: 2,
        lineStyle: map.defaultLineStyle,
        side,
      };

      const newMap: MindMap = {
        ...map,
        nodes: {
          ...map.nodes,
          [newId]: newNode,
          // If parent was collapsed, expand it so new child is visible
          ...(parent.collapsed ? { [parentId]: { ...parent, collapsed: false } } : {}),
        },
      };

      pushToHistory(newMap);
      setSelectedNodeId(newId);
    },
    [map, selectedNodeId, isDarkMode, pushToHistory]
  );

  // Add sibling node
  const handleAddSibling = useCallback(
    (targetSiblingId?: string) => {
      const siblingId = targetSiblingId || selectedNodeId;
      if (!siblingId) return;
      const sibling = map.nodes[siblingId];
      if (!sibling || !sibling.parentId) return; // Cannot add sibling to root node

      const parent = map.nodes[sibling.parentId];
      if (!parent) return;

      const newId = 'node-' + Date.now() + '-' + Math.floor(Math.random() * 1000);
      const side = sibling.side || 'right';

      const newNode: MindNodeData = {
        id: newId,
        parentId: sibling.parentId,
        text: 'New Sibling',
        x: sibling.x,
        y: sibling.y + 65,
        color: sibling.color || (isDarkMode ? '#1e293b' : '#ffffff'),
        textColor: sibling.textColor || (isDarkMode ? '#f1f5f9' : '#0f172a'),
        fontSize: sibling.fontSize || 14,
        fontStyle: sibling.fontStyle || 'sans',
        fontWeight: sibling.fontWeight || 'normal',
        shape: sibling.shape || 'rounded',
        borderStyle: sibling.borderStyle || 'solid',
        borderColor: sibling.branchColor || parent.branchColor || '#cbd5e1',
        borderWidth: sibling.borderWidth || 1.5,
        branchColor: sibling.branchColor || parent.branchColor || '#6366f1',
        lineWidth: sibling.lineWidth || 2,
        lineStyle: sibling.lineStyle || map.defaultLineStyle,
        side,
      };

      const newMap: MindMap = {
        ...map,
        nodes: {
          ...map.nodes,
          [newId]: newNode,
        },
      };

      pushToHistory(newMap);
      setSelectedNodeId(newId);
    },
    [map, selectedNodeId, isDarkMode, pushToHistory]
  );

  // Delete node and all its descendants
  const handleDeleteNode = useCallback(
    (targetId?: string) => {
      const nodeId = targetId || selectedNodeId;
      if (!nodeId || nodeId === map.rootId) return; // Do not delete root

      // Collect all descendants recursively
      const idsToDelete = new Set<string>([nodeId]);
      let changed = true;
      while (changed) {
        changed = false;
        Object.values(map.nodes).forEach((n) => {
          if (n.parentId && idsToDelete.has(n.parentId) && !idsToDelete.has(n.id)) {
            idsToDelete.add(n.id);
            changed = true;
          }
        });
      }

      const newNodes = { ...map.nodes };
      idsToDelete.forEach((id) => delete newNodes[id]);

      const parentId = map.nodes[nodeId]?.parentId || map.rootId;

      pushToHistory({
        ...map,
        nodes: newNodes,
      });

      setSelectedNodeId(parentId);
    },
    [map, selectedNodeId, pushToHistory]
  );

  // Duplicate node and its subtree
  const handleDuplicateNode = useCallback(
    (targetId?: string) => {
      const nodeId = targetId || selectedNodeId;
      if (!nodeId || nodeId === map.rootId) return;

      const sourceNode = map.nodes[nodeId];
      if (!sourceNode || !sourceNode.parentId) return;

      // Map old IDs to new IDs
      const idMap: Record<string, string> = {};
      const newNodes = { ...map.nodes };

      // Collect all descendants
      const subtreeNodeIds = [nodeId];
      let i = 0;
      while (i < subtreeNodeIds.length) {
        const currId = subtreeNodeIds[i];
        Object.values(map.nodes).forEach((n) => {
          if (n.parentId === currId) {
            subtreeNodeIds.push(n.id);
          }
        });
        i++;
      }

      // Generate new IDs
      subtreeNodeIds.forEach((oldId) => {
        idMap[oldId] = 'node-' + Date.now() + '-' + Math.floor(Math.random() * 10000);
      });

      // Clone nodes with offset
      const offsetX = 30;
      const offsetY = 40;

      subtreeNodeIds.forEach((oldId) => {
        const orig = map.nodes[oldId];
        const newId = idMap[oldId];
        const newParentId = oldId === nodeId ? orig.parentId : idMap[orig.parentId!];

        newNodes[newId] = {
          ...orig,
          id: newId,
          parentId: newParentId,
          text: oldId === nodeId ? `${orig.text} (Copy)` : orig.text,
          x: orig.x + offsetX,
          y: orig.y + offsetY,
        };
      });

      pushToHistory({
        ...map,
        nodes: newNodes,
      });

      setSelectedNodeId(idMap[nodeId]);
    },
    [map, selectedNodeId, pushToHistory]
  );

  // Add central topic / node
  const handleAddCentralNode = () => {
    if (selectedNodeId) {
      handleAddChild(selectedNodeId);
    } else {
      handleAddChild(map.rootId);
    }
  };

  // Move node position and all its subtree descendants
  const handleUpdateNodePosition = useCallback(
    (id: string, dx: number, dy: number) => {
      // Find all descendants of id
      const descendants = new Set<string>([id]);
      let changed = true;
      while (changed) {
        changed = false;
        Object.values(map.nodes).forEach((n) => {
          if (n.parentId && descendants.has(n.parentId) && !descendants.has(n.id)) {
            descendants.add(n.id);
            changed = true;
          }
        });
      }

      setMap((prev) => {
        const newNodes = { ...prev.nodes };
        descendants.forEach((nodeId) => {
          const n = newNodes[nodeId];
          if (n) {
            newNodes[nodeId] = {
              ...n,
              x: Math.round(n.x + dx),
              y: Math.round(n.y + dy),
            };
          }
        });
        return { ...prev, nodes: newNodes };
      });
    },
    [map.nodes]
  );

  // Update node text
  const handleUpdateNodeText = useCallback(
    (id: string, text: string) => {
      const current = map.nodes[id];
      if (!current || current.text === text) return;
      pushToHistory({
        ...map,
        nodes: {
          ...map.nodes,
          [id]: { ...current, text },
        },
      });
    },
    [map, pushToHistory]
  );

  // Update node properties (Inspector)
  const handleUpdateNode = useCallback(
    (id: string, updates: Partial<MindNodeData>) => {
      const current = map.nodes[id];
      if (!current) return;
      pushToHistory({
        ...map,
        nodes: {
          ...map.nodes,
          [id]: { ...current, ...updates },
        },
      });
    },
    [map, pushToHistory]
  );

  // Update global map settings (Canvas background, default lines)
  const handleUpdateMap = useCallback(
    (updates: Partial<MindMap>) => {
      pushToHistory({
        ...map,
        ...updates,
      });
    },
    [map, pushToHistory]
  );

  // Toggle collapse branch
  const handleToggleCollapse = useCallback((id: string) => {
    setMap((prev) => {
      const node = prev.nodes[id];
      if (!node) return prev;
      return {
        ...prev,
        nodes: {
          ...prev.nodes,
          [id]: {
            ...node,
            collapsed: !node.collapsed,
          },
        },
      };
    });
  }, []);

  // Auto Layout
  const handleAutoLayout = useCallback(() => {
    const organizedNodes = calculateAutoLayout(map.nodes, map.rootId);
    pushToHistory({
      ...map,
      nodes: organizedNodes,
    });
  }, [map, pushToHistory]);

  // Fit to screen
  const handleFitToScreen = useCallback(() => {
    const bbox = getMapBoundingBox(map.nodes);
    const canvasW = window.innerWidth - (isLeftSidebarOpen ? 288 : 48) - (isRightSidebarOpen ? 320 : 0);
    const canvasH = window.innerHeight - 56;

    const scaleX = (canvasW - 120) / bbox.width;
    const scaleY = (canvasH - 120) / bbox.height;
    const newZoom = Math.min(Math.max(0.3, Math.min(scaleX, scaleY)), 1.3);

    const centerX = bbox.minX + bbox.width / 2;
    const centerY = bbox.minY + bbox.height / 2;

    setViewport({
      x: canvasW / 2 - centerX * newZoom,
      y: canvasH / 2 - centerY * newZoom,
      zoom: newZoom,
    });
  }, [map.nodes, isLeftSidebarOpen, isRightSidebarOpen]);

  // Zoom helpers
  const handleZoomIn = () => {
    setViewport((prev) => ({ ...prev, zoom: Math.min(prev.zoom * 1.2, 2.5) }));
  };

  const handleZoomOut = () => {
    setViewport((prev) => ({ ...prev, zoom: Math.max(prev.zoom / 1.2, 0.25) }));
  };

  const handleZoomReset = () => {
    setViewport((prev) => ({ ...prev, zoom: 1 }));
  };

  // Export mind map
  const handleExport = (format: 'png' | 'pdf' | 'svg' | 'json') => {
    switch (format) {
      case 'png':
        exportMapAsPng(map);
        break;
      case 'pdf':
        exportMapAsPdf(map);
        break;
      case 'svg':
        exportMapAsSvg(map);
        break;
      case 'json':
        exportMapAsJson(map);
        break;
    }
  };

  // Import JSON mind map file
  const handleImportJson = (file: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const content = e.target?.result as string;
        const parsed = JSON.parse(content);
        if (parsed && parsed.rootId && parsed.nodes) {
          pushToHistory({
            ...parsed,
            id: 'imported-' + Date.now(),
          });
          setSelectedNodeId(parsed.rootId);
          setTimeout(() => handleFitToScreen(), 100);
        } else {
          alert('Invalid mind map JSON format.');
        }
      } catch (err) {
        alert('Could not parse JSON file.');
      }
    };
    reader.readAsText(file);
  };

  // Manual save
  const handleManualSave = () => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(map));
      setIsSaved(true);
    } catch {
      // ignore
    }
  };

  // Global Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Do nothing if typing inside an input or textarea
      const target = e.target as HTMLElement;
      if (
        target.tagName === 'INPUT' ||
        target.tagName === 'TEXTAREA' ||
        target.isContentEditable
      ) {
        return;
      }

      // Undo: Ctrl+Z / Cmd+Z
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'z' && !e.shiftKey) {
        e.preventDefault();
        handleUndo();
        return;
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'z')
      ) {
        e.preventDefault();
        handleRedo();
        return;
      }

      // Duplicate: Ctrl+D / Cmd+D
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'd') {
        e.preventDefault();
        handleDuplicateNode();
        return;
      }

      // Auto Layout: Ctrl+L / Cmd+L
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        handleAutoLayout();
        return;
      }

      // Add Child: Tab
      if (e.key === 'Tab') {
        e.preventDefault();
        handleAddChild();
        return;
      }

      // Add Sibling: Enter
      if (e.key === 'Enter') {
        e.preventDefault();
        handleAddSibling();
        return;
      }

      // Delete: Delete or Backspace
      if (e.key === 'Delete' || e.key === 'Backspace') {
        if (selectedNodeId && selectedNodeId !== map.rootId) {
          e.preventDefault();
          handleDeleteNode();
          return;
        }
      }

      // Deselect: Escape
      if (e.key === 'Escape') {
        setSelectedNodeId(null);
        return;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [
    handleUndo,
    handleRedo,
    handleDuplicateNode,
    handleAutoLayout,
    handleAddChild,
    handleAddSibling,
    handleDeleteNode,
    selectedNodeId,
    map.rootId,
  ]);

  // Search results count
  const searchResultsCount = searchQuery.trim()
    ? Object.values(map.nodes).filter((n) =>
        n.text.toLowerCase().includes(searchQuery.toLowerCase())
      ).length
    : 0;

  const selectedNode = selectedNodeId ? map.nodes[selectedNodeId] || null : null;

  const handleApplyWorkshopMindMap = (mapData: {
    title: string;
    rootId: string;
    nodes: Record<string, MindNodeData>;
    defaultLineStyle?: ConnectionStyle;
  }) => {
    const newMap: MindMap = {
      id: `map-${Date.now()}`,
      title: mapData.title || 'Teacher Workshop Mind Map',
      rootId: mapData.rootId,
      nodes: mapData.nodes,
      backgroundColor: '#ffffff',
      canvasPattern: 'dots',
      defaultLineStyle: mapData.defaultLineStyle || 'curved',
      createdAt: Date.now(),
      updatedAt: Date.now(),
    };

    pushToHistory(newMap);
    setSelectedNodeId(mapData.rootId);
    setCurrentView('canvas');
    setViewport({
      x: window.innerWidth / 2 - 600,
      y: window.innerHeight / 2 - 400,
      zoom: 0.85,
    });
  };

  if (currentView === 'workshop') {
    return (
      <TeachersWorkshopView
        onBackToCanvas={() => setCurrentView('canvas')}
        onApplyMindMap={handleApplyWorkshopMindMap}
      />
    );
  }

  return (
    <div
      id="app-root"
      className="flex flex-col h-screen w-screen overflow-hidden bg-slate-50 dark:bg-slate-950 text-slate-800 dark:text-slate-100 font-sans"
    >
      {/* Top Toolbar */}
      <Toolbar
        mapTitle={map.title}
        onUpdateTitle={(title) => handleUpdateMap({ title })}
        canUndo={past.length > 0}
        canRedo={future.length > 0}
        onUndo={handleUndo}
        onRedo={handleRedo}
        onNewMap={handleNewMap}
        onAddNode={handleAddCentralNode}
        onAddChild={() => handleAddChild()}
        onAddSibling={() => handleAddSibling()}
        onDeleteNode={() => handleDeleteNode()}
        onDuplicateNode={() => handleDuplicateNode()}
        hasSelectedNode={Boolean(selectedNodeId)}
        isRootSelected={selectedNodeId === map.rootId}
        zoom={viewport.zoom}
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onZoomReset={handleZoomReset}
        onFitToScreen={handleFitToScreen}
        onAutoLayout={handleAutoLayout}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        searchResultsCount={searchResultsCount}
        onExport={handleExport}
        onSave={handleManualSave}
        isSaved={isSaved}
        isDarkMode={isDarkMode}
        onToggleDarkMode={() => setIsDarkMode(!isDarkMode)}
        onToggleLeftSidebar={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
        onToggleRightSidebar={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
        isLeftSidebarOpen={isLeftSidebarOpen}
        isRightSidebarOpen={isRightSidebarOpen}
        onOpenWorkshop={() => setCurrentView('workshop')}
      />

      {/* Main Workspace: Left Sidebar + Canvas + Right Sidebar */}
      <div className="flex-1 flex overflow-hidden relative">
        {/* Left Sidebar */}
        <LeftSidebar
          isOpen={isLeftSidebarOpen}
          onToggle={() => setIsLeftSidebarOpen(!isLeftSidebarOpen)}
          onSelectTemplate={handleSelectTemplate}
          nodes={map.nodes}
          rootId={map.rootId}
          selectedNodeId={selectedNodeId}
          onSelectNode={(id) => {
            setSelectedNodeId(id);
            // Center on node
            const n = map.nodes[id];
            if (n) {
              setViewport((prev) => ({
                ...prev,
                x: window.innerWidth / 2 - n.x * prev.zoom,
                y: window.innerHeight / 2 - n.y * prev.zoom,
              }));
            }
          }}
          onImportJson={handleImportJson}
          onAddChild={handleAddChild}
          onOpenWorkshop={() => setCurrentView('workshop')}
        />

        {/* Central Infinite Canvas */}
        <MindMapCanvas
          map={map}
          selectedNodeId={selectedNodeId}
          onSelectNode={setSelectedNodeId}
          onUpdateNodePosition={handleUpdateNodePosition}
          onUpdateNodeText={handleUpdateNodeText}
          onToggleCollapse={handleToggleCollapse}
          onAddChildQuick={handleAddChild}
          onAddSiblingQuick={handleAddSibling}
          viewport={viewport}
          onUpdateViewport={setViewport}
          searchQuery={searchQuery}
          svgRef={svgRef}
        />

        {/* Right Sidebar: Inspector */}
        <RightSidebar
          isOpen={isRightSidebarOpen}
          onToggle={() => setIsRightSidebarOpen(!isRightSidebarOpen)}
          selectedNode={selectedNode}
          map={map}
          onUpdateNode={handleUpdateNode}
          onUpdateMap={handleUpdateMap}
        />
      </div>
    </div>
  );
}
