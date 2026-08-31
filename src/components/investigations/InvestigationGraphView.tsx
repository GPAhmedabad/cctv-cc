import React, { useState } from 'react';
import {
  GitGraph,
  Share2,
  FolderLock,
  Car,
  Camera as CameraIcon,
  MapPin,
  FileText,
  User,
  Shield,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  Info,
} from 'lucide-react';
import { Badge } from '../common/Badge';

interface GraphNode {
  id: string;
  label: string;
  type: 'CASE' | 'VEHICLE' | 'CAMERA' | 'LOCATION' | 'FIR' | 'PERSON';
  x: number;
  y: number;
  details: string;
  meta?: Record<string, any>;
}

interface GraphLink {
  source: string;
  target: string;
  label: string;
}

export const InvestigationGraphView: React.FC = () => {
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [zoomLevel, setZoomLevel] = useState(1);

  // Nodes for Operation Hawk Link Graph
  const nodes: GraphNode[] = [
    {
      id: 'case-1',
      label: 'INV-2025-042 (Operation Hawk)',
      type: 'CASE',
      x: 450,
      y: 250,
      details: 'Active inter-city gold robbery case under investigation by Gujarat CID Crime.',
    },
    {
      id: 'veh-1',
      label: 'GJ01AB1234 (Black Fortuner)',
      type: 'VEHICLE',
      x: 300,
      y: 150,
      details: 'Primary getaway vehicle flagged in SG Highway robbery FIR.',
      meta: { make: 'Toyota Fortuner', color: 'Midnight Black', owner: 'Suspect Alias: Vikram S.' },
    },
    {
      id: 'cam-1',
      label: 'CAM-AMD-001 (Pakwan Crossroad)',
      type: 'CAMERA',
      x: 150,
      y: 80,
      details: 'Sighting captured at 20:12:04 IST • Speed 74 km/h.',
    },
    {
      id: 'cam-2',
      label: 'CAM-AMD-002 (Thaltej Flyover)',
      type: 'CAMERA',
      x: 220,
      y: 350,
      details: 'Sighting captured at 20:18:22 IST • Heading North towards Gandhinagar.',
    },
    {
      id: 'cam-3',
      label: 'CAM-GND-001 (Koba Circle)',
      type: 'CAMERA',
      x: 650,
      y: 120,
      details: 'Sighting captured at 20:34:10 IST • Speed 62 km/h.',
    },
    {
      id: 'fir-1',
      label: 'FIR-2025-SG-HIGHWAY-09',
      type: 'FIR',
      x: 650,
      y: 320,
      details: 'Registered under IPC 392 / Motor Vehicles Act at Vastrapur PS.',
    },
    {
      id: 'loc-1',
      label: 'GIFT City Security Perimeter',
      type: 'LOCATION',
      x: 750,
      y: 200,
      details: 'Predictive interception sector with automated barricade deployment.',
    },
    {
      id: 'person-1',
      label: 'Vikram S. (Registered Owner)',
      type: 'PERSON',
      x: 120,
      y: 240,
      details: 'Previous record for interstate transport evasion.',
    },
  ];

  const links: GraphLink[] = [
    { source: 'case-1', target: 'veh-1', label: 'Primary Target' },
    { source: 'case-1', target: 'fir-1', label: 'Origin FIR' },
    { source: 'veh-1', target: 'cam-1', label: 'First Sighting' },
    { source: 'veh-1', target: 'cam-2', label: 'Second Sighting' },
    { source: 'veh-1', target: 'cam-3', label: 'Third Sighting' },
    { source: 'veh-1', target: 'person-1', label: 'Registered To' },
    { source: 'cam-3', target: 'loc-1', label: 'Heading Towards' },
    { source: 'case-1', target: 'loc-1', label: 'Target Intercept' },
  ];

  const getNodeColor = (type: GraphNode['type']) => {
    switch (type) {
      case 'CASE':
        return '#a855f7'; // Purple
      case 'VEHICLE':
        return '#06b6d4'; // Cyan
      case 'CAMERA':
        return '#3b82f6'; // Blue
      case 'LOCATION':
        return '#10b981'; // Emerald
      case 'FIR':
        return '#f59e0b'; // Amber
      case 'PERSON':
        return '#ec4899'; // Pink
      default:
        return '#64748b';
    }
  };

  return (
    <div id="investigation-graph-view" className="p-6 space-y-6 max-w-[1800px] mx-auto animate-fade-in">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <GitGraph className="w-6 h-6 text-purple-400" />
            <h1 className="font-display text-xl font-bold tracking-wider text-slate-100 uppercase">
              INTER-ENTITY INVESTIGATION LINK GRAPH
            </h1>
          </div>
          <p className="text-xs text-slate-400 font-mono mt-1">
            Visual topology mapping relationships between Cases, Vehicles, Surveillance Cameras, FIRs, and Suspects
          </p>
        </div>

        {/* Graph Controls */}
        <div className="flex items-center gap-2 font-mono text-xs">
          <button
            onClick={() => setZoomLevel((z) => Math.min(z + 0.2, 1.8))}
            className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(z - 0.2, 0.6))}
            className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-2 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Canvas & Details Side Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left 3 Cols: SVG Interactive Canvas */}
        <div className="lg:col-span-3 bg-slate-950 rounded-xl border border-slate-800 relative overflow-hidden shadow-2xl h-[68vh] flex items-center justify-center">
          {/* Subtle Grid Background */}
          <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:24px_24px] opacity-40"></div>

          {/* SVG Graph Viewport */}
          <svg
            className="w-full h-full cursor-grab active:cursor-grabbing"
            viewBox="0 0 900 500"
            style={{ transform: `scale(${zoomLevel})`, transformOrigin: 'center' }}
          >
            <defs>
              <marker
                id="arrowhead"
                markerWidth="10"
                markerHeight="7"
                refX="22"
                refY="3.5"
                orient="auto"
              >
                <polygon points="0 0, 10 3.5, 0 7" fill="#475569" />
              </marker>
            </defs>

            {/* Links */}
            {links.map((link, idx) => {
              const srcNode = nodes.find((n) => n.id === link.source);
              const tgtNode = nodes.find((n) => n.id === link.target);
              if (!srcNode || !tgtNode) return null;

              const midX = (srcNode.x + tgtNode.x) / 2;
              const midY = (srcNode.y + tgtNode.y) / 2;

              return (
                <g key={idx}>
                  <line
                    x1={srcNode.x}
                    y1={srcNode.y}
                    x2={tgtNode.x}
                    y2={tgtNode.y}
                    stroke="#334155"
                    strokeWidth="2"
                    strokeDasharray="4 2"
                    markerEnd="url(#arrowhead)"
                  />
                  <text
                    x={midX}
                    y={midY - 4}
                    fill="#64748b"
                    fontSize="9"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none"
                  >
                    {link.label}
                  </text>
                </g>
              );
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const isSelected = selectedNode?.id === node.id;
              const color = getNodeColor(node.type);

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => setSelectedNode(node)}
                  className="cursor-pointer group"
                >
                  {/* Outer pulse if selected */}
                  {isSelected && (
                    <circle
                      r="28"
                      fill="none"
                      stroke={color}
                      strokeWidth="2"
                      className="animate-ping opacity-50"
                    />
                  )}

                  {/* Main Circle */}
                  <circle
                    r="18"
                    fill="#0f172a"
                    stroke={color}
                    strokeWidth={isSelected ? '3' : '2'}
                    className="transition-transform group-hover:scale-110"
                  />

                  {/* Node Type Indicator Dot */}
                  <circle r="6" fill={color} />

                  {/* Label */}
                  <text
                    y="32"
                    fill="#e2e8f0"
                    fontSize="10"
                    fontWeight="bold"
                    fontFamily="monospace"
                    textAnchor="middle"
                    className="select-none drop-shadow"
                  >
                    {node.label}
                  </text>
                </g>
              );
            })}
          </svg>

          {/* Bottom Legend */}
          <div className="absolute bottom-3 left-3 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-lg p-2 flex items-center gap-3 text-[10px] font-mono text-slate-400">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-purple-500"></span> Case
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-cyan-400"></span> Vehicle
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span> Camera
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-amber-500"></span> FIR
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-500"></span> Location
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-pink-500"></span> Person
            </span>
          </div>
        </div>

        {/* Right Col: Node Inspector Panel */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl space-y-4 font-mono text-xs">
          <div className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
            <Info className="w-4 h-4 text-cyan-400" />
            <span>NODE INSPECTOR</span>
          </div>

          {selectedNode ? (
            <div className="space-y-3 animate-fade-in">
              <div>
                <Badge variant="purple" size="sm">
                  {selectedNode.type} NODE
                </Badge>
                <div className="text-sm font-bold text-white mt-1">
                  {selectedNode.label}
                </div>
              </div>

              <p className="text-slate-300 text-xs bg-slate-950 p-3 rounded-lg border border-slate-800 leading-relaxed">
                {selectedNode.details}
              </p>

              {selectedNode.meta && (
                <div className="space-y-1 bg-slate-950 p-2.5 rounded-lg border border-slate-800 text-[11px] text-slate-400">
                  {Object.entries(selectedNode.meta).map(([k, v]) => (
                    <div key={k} className="flex items-center justify-between">
                      <span className="capitalize text-slate-500">{k}:</span>
                      <span className="text-slate-200 font-semibold">{String(v)}</span>
                    </div>
                  ))}
                </div>
              )}

              <div className="pt-2 border-t border-slate-800 space-y-2">
                <button
                  onClick={() => setSelectedNode(null)}
                  className="w-full py-1.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  Clear Selection
                </button>
              </div>
            </div>
          ) : (
            <div className="text-slate-500 text-center py-12">
              Click any node in the graph to inspect linked intelligence
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
