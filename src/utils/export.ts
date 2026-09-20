import { jsPDF } from 'jspdf';
import { MindMap, MindNodeData } from '../types';

/**
 * Calculates bounding box of all visible nodes to frame exports nicely
 */
export function getMapBoundingBox(nodes: Record<string, MindNodeData>) {
  const nodeList = Object.values(nodes);
  if (nodeList.length === 0) {
    return { minX: -200, minY: -200, maxX: 200, maxY: 200, width: 400, height: 400 };
  }

  let minX = Infinity;
  let minY = Infinity;
  let maxX = -Infinity;
  let maxY = -Infinity;

  nodeList.forEach((node) => {
    // Generous bounding box for text length + emoji + padding
    const textWidth = Math.max(80, (node.text?.length || 8) * 9 + 48);
    const textHeight = 44;
    minX = Math.min(minX, node.x - textWidth / 2);
    minY = Math.min(minY, node.y - textHeight / 2);
    maxX = Math.max(maxX, node.x + textWidth / 2);
    maxY = Math.max(maxY, node.y + textHeight / 2);
  });

  const padding = 100;
  minX -= padding;
  minY -= padding;
  maxX += padding;
  maxY += padding;

  return {
    minX: Math.round(minX),
    minY: Math.round(minY),
    maxX: Math.round(maxX),
    maxY: Math.round(maxY),
    width: Math.round(maxX - minX),
    height: Math.round(maxY - minY),
  };
}

/**
 * Builds a clean, fully standalone SVG string representation of the entire mind map
 */
export function generateStandaloneSvgString(map: MindMap): string {
  const bbox = getMapBoundingBox(map.nodes);
  const bgColor = map.backgroundColor || '#ffffff';

  // Compute set of collapsed ancestors
  const collapsedSet = new Set<string>();
  Object.values(map.nodes).forEach((n) => {
    if (n.collapsed) collapsedSet.add(n.id);
  });

  const isHidden = (id: string): boolean => {
    let curr = map.nodes[id]?.parentId;
    while (curr) {
      if (collapsedSet.has(curr)) return true;
      curr = map.nodes[curr]?.parentId || null;
    }
    return false;
  };

  // Generate branch paths
  const branchesSvg: string[] = [];
  Object.values(map.nodes).forEach((child) => {
    if (!child.parentId) return;
    const parent = map.nodes[child.parentId];
    if (!parent || isHidden(child.id)) return;

    const x1 = parent.x;
    const y1 = parent.y;
    const x2 = child.x;
    const y2 = child.y;
    const dx = x2 - x1;

    const styleType = child.lineStyle || parent.lineStyle || map.defaultLineStyle || 'curved';
    const strokeColor = child.branchColor || parent.branchColor || '#6366f1';
    const strokeWidth = child.lineWidth || (parent.parentId === null ? 3 : 2);

    let pathD = '';
    if (styleType === 'straight') {
      pathD = `M ${x1} ${y1} L ${x2} ${y2}`;
    } else if (styleType === 'stepped') {
      const midX = x1 + dx * 0.5;
      pathD = `M ${x1} ${y1} H ${midX} V ${y2} H ${x2}`;
    } else {
      const cx1 = x1 + dx * 0.55;
      const cy1 = y1;
      const cx2 = x1 + dx * 0.45;
      const cy2 = y2;
      pathD = `M ${x1} ${y1} C ${cx1} ${cy1}, ${cx2} ${cy2}, ${x2} ${y2}`;
    }

    branchesSvg.push(
      `<path d="${pathD}" fill="none" stroke="${strokeColor}" stroke-width="${strokeWidth}" stroke-linecap="round" stroke-linejoin="round" />`
    );
  });

  // Generate node shapes and texts
  const nodesSvg: string[] = [];
  Object.values(map.nodes).forEach((node) => {
    if (isHidden(node.id)) return;

    const fontSize = node.fontSize || 15;
    const label = (node.emoji ? `${node.emoji} ` : '') + (node.text || 'Untitled');
    // Approximate node dimensions
    const nodeWidth = Math.max(90, label.length * (fontSize * 0.58) + 32);
    const nodeHeight = fontSize + 24;

    const rectX = node.x - nodeWidth / 2;
    const rectY = node.y - nodeHeight / 2;

    const fillColor = node.shape === 'underline' ? 'none' : (node.color || '#ffffff');
    const textColor = node.textColor || (node.shape === 'underline' ? '#0f172a' : '#1e293b');
    const borderColor = node.borderColor || node.branchColor || '#cbd5e1';
    const borderWidth = node.borderStyle === 'none' ? 0 : (node.borderWidth || 2);
    const strokeDash =
      node.borderStyle === 'dashed' ? 'stroke-dasharray="4 3"' :
      node.borderStyle === 'dotted' ? 'stroke-dasharray="2 2"' : '';

    let rx = 24; // pill
    if (node.shape === 'rounded') rx = 10;
    else if (node.shape === 'rectangle') rx = 4;
    else if (node.shape === 'oval') rx = nodeHeight / 2;

    if (node.shape === 'underline') {
      nodesSvg.push(`
        <g>
          <line x1="${rectX}" y1="${rectY + nodeHeight}" x2="${rectX + nodeWidth}" y2="${rectY + nodeHeight}" stroke="${borderColor}" stroke-width="3" stroke-linecap="round" />
          <text x="${node.x}" y="${node.y + 5}" fill="${textColor}" font-size="${fontSize}px" font-family="system-ui, sans-serif" font-weight="${node.fontWeight || 'normal'}" text-anchor="middle" dominant-baseline="middle">${escapeXml(label)}</text>
        </g>
      `);
    } else {
      nodesSvg.push(`
        <g>
          <rect x="${rectX}" y="${rectY}" width="${nodeWidth}" height="${nodeHeight}" rx="${rx}" ry="${rx}" fill="${fillColor}" stroke="${borderWidth > 0 ? borderColor : 'none'}" stroke-width="${borderWidth}" ${strokeDash} filter="drop-shadow(0 2px 4px rgba(0,0,0,0.06))" />
          <text x="${node.x}" y="${node.y + 4}" fill="${textColor}" font-size="${fontSize}px" font-family="system-ui, sans-serif" font-weight="${node.fontWeight || 'normal'}" text-anchor="middle" dominant-baseline="middle">${escapeXml(label)}</text>
        </g>
      `);
    }
  });

  return `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="${bbox.minX} ${bbox.minY} ${bbox.width} ${bbox.height}" width="${bbox.width}" height="${bbox.height}">
  <rect x="${bbox.minX}" y="${bbox.minY}" width="${bbox.width}" height="${bbox.height}" fill="${bgColor}" />
  <g id="branches">
    ${branchesSvg.join('\n    ')}
  </g>
  <g id="nodes">
    ${nodesSvg.join('\n    ')}
  </g>
</svg>`;
}

function escapeXml(unsafe: string) {
  return unsafe
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&apos;');
}

/**
 * Export the mind map as a stand-alone SVG file
 */
export function exportMapAsSvg(map: MindMap) {
  const svgString = generateStandaloneSvgString(map);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `${map.title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'mindmap'}.svg`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}

/**
 * Export the mind map as high-resolution PNG
 */
export function exportMapAsPng(map: MindMap) {
  const bbox = getMapBoundingBox(map.nodes);
  const svgString = generateStandaloneSvgString(map);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const scale = 2; // Crisp Retina DPI
    const canvas = document.createElement('canvas');
    canvas.width = bbox.width * scale;
    canvas.height = bbox.height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, bbox.width, bbox.height);
    URL.revokeObjectURL(url);

    const pngUrl = canvas.toDataURL('image/png');
    const downloadLink = document.createElement('a');
    downloadLink.href = pngUrl;
    downloadLink.download = `${map.title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'mindmap'}.png`;
    document.body.appendChild(downloadLink);
    downloadLink.click();
    document.body.removeChild(downloadLink);
  };
  img.src = url;
}

/**
 * Export the mind map as high-quality PDF using jsPDF
 */
export function exportMapAsPdf(map: MindMap) {
  const bbox = getMapBoundingBox(map.nodes);
  const svgString = generateStandaloneSvgString(map);
  const svgBlob = new Blob([svgString], { type: 'image/svg+xml;charset=utf-8' });
  const url = URL.createObjectURL(svgBlob);

  const img = new Image();
  img.onload = () => {
    const scale = 2;
    const canvas = document.createElement('canvas');
    canvas.width = bbox.width * scale;
    canvas.height = bbox.height * scale;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.scale(scale, scale);
    ctx.drawImage(img, 0, 0, bbox.width, bbox.height);
    URL.revokeObjectURL(url);

    const imgData = canvas.toDataURL('image/jpeg', 0.95);
    const isLandscape = bbox.width >= bbox.height;
    const pdf = new jsPDF({
      orientation: isLandscape ? 'landscape' : 'portrait',
      unit: 'pt',
      format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 36;
    const maxWidth = pageWidth - margin * 2;
    const maxHeight = pageHeight - margin * 2;

    const imgRatio = bbox.width / bbox.height;
    let renderW = maxWidth;
    let renderH = renderW / imgRatio;

    if (renderH > maxHeight) {
      renderH = maxHeight;
      renderW = renderH * imgRatio;
    }

    const posX = margin + (maxWidth - renderW) / 2;
    const posY = margin + (maxHeight - renderH) / 2;

    pdf.addImage(imgData, 'JPEG', posX, posY, renderW, renderH);
    pdf.save(`${map.title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'mindmap'}.pdf`);
  };
  img.src = url;
}

/**
 * Export mind map data as JSON file
 */
export function exportMapAsJson(map: MindMap) {
  const jsonString = JSON.stringify(map, null, 2);
  const blob = new Blob([jsonString], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const downloadLink = document.createElement('a');
  downloadLink.href = url;
  downloadLink.download = `${map.title.toLowerCase().replace(/[^a-z0-9]/g, '_') || 'mindmap'}.json`;
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
  URL.revokeObjectURL(url);
}
