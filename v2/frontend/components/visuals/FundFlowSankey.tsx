'use client';

import React from 'react';

interface SankeyProps {
  data: {
    total: number;
    admin: number;
    planned: number;
    active: number;
    completed: number;
  };
}

export default function FundFlowSankey({ data }: SankeyProps) {
  // SVG Dimensions
  const width = 800;
  const height = 300;
  const nodeWidth = 140;
  const nodeHeight = 40;
  
  // Normalize values for visual width (max width = 80px for the thickest flow)
  const scale = (val: number) => (val / data.total) * 100;

  return (
    <div className="w-full overflow-x-auto py-8">
      <svg width={width} height={height} viewBox={`0 0 ${width} ${height}`} className="mx-auto">
        <defs>
          <linearGradient id="grad-blue" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3b82f6" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#3b82f6" stopOpacity="0.5" />
          </linearGradient>
          <linearGradient id="grad-green" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0.6" />
          </linearGradient>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
            <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
            </feMerge>
          </filter>
        </defs>

        {/* Nodes */}
        {/* Source: Total Allocation */}
        <rect x="20" y="100" width={nodeWidth} height={nodeHeight} rx="8" fill="#0f172a" />
        <text x={20 + nodeWidth/2} y="125" textAnchor="middle" fill="white" className="text-[10px] font-black uppercase">Total Allocation</text>

        {/* Intermediate: Pool */}
        <rect x="300" y="120" width={nodeWidth} height={nodeHeight} rx="8" fill="#1e293b" />
        <text x={300 + nodeWidth/2} y="145" textAnchor="middle" fill="white" className="text-[10px] font-black uppercase">Infra Pool</text>

        {/* Outcomes */}
        <rect x="600" y="20" width={nodeWidth} height={nodeHeight} rx="8" fill="#64748b" />
        <text x={600 + nodeWidth/2} y="45" textAnchor="middle" fill="white" className="text-[10px] font-black uppercase">Admin & GST</text>

        <rect x="600" y="100" width={nodeWidth} height={nodeHeight} rx="8" fill="#3b82f6" stroke="#3b82f6" strokeDasharray="4 2" fillOpacity="0.1" />
        <text x={600 + nodeWidth/2} y="125" textAnchor="middle" fill="#3b82f6" className="text-[10px] font-black uppercase">Planned Works</text>

        <rect x="600" y="180" width={nodeWidth} height={nodeHeight} rx="8" fill="#10b981" fillOpacity="0.1" stroke="#10b981" />
        <text x={600 + nodeWidth/2} y="205" textAnchor="middle" fill="#059669" className="text-[10px] font-black uppercase">Active Works</text>

        <rect x="600" y="260" width={nodeWidth} height={nodeHeight} rx="8" fill="#059669" filter="url(#glow)" />
        <text x={600 + nodeWidth/2} y="285" textAnchor="middle" fill="white" className="text-[10px] font-black uppercase">Completed Assets</text>

        {/* Flows (Curves) */}
        {/* Total -> Admin */}
        <path d={`M 160 110 C 230 110, 230 40, 600 40`} fill="none" stroke="#cbd5e1" strokeWidth="4" strokeOpacity="0.3" />
        
        {/* Total -> Infra Pool */}
        <path d={`M 160 130 C 230 130, 230 140, 300 140`} fill="none" stroke="#94a3b8" strokeWidth="20" strokeOpacity="0.2" />

        {/* Infra Pool -> Planned */}
        <path d={`M 440 130 C 520 130, 520 120, 600 120`} fill="none" stroke="url(#grad-blue)" strokeWidth="10" />

        {/* Infra Pool -> Active */}
        <path d={`M 440 140 C 520 140, 520 200, 600 200`} fill="none" stroke="url(#grad-green)" strokeWidth="15" />

        {/* Active -> Completed */}
        <path d={`M 670 220 L 670 260`} fill="none" stroke="#10b981" strokeWidth="2" strokeDasharray="4 2" />

      </svg>
      
      {/* Legend / Values */}
      <div className="mt-4 grid grid-cols-4 gap-4 px-4 text-center">
         <div>
            <p className="text-[8px] font-black text-slate-400 uppercase">Total</p>
            <p className="text-xs font-bold">₹{data.total} Cr</p>
         </div>
         <div>
            <p className="text-[8px] font-black text-slate-400 uppercase">Utilized</p>
            <p className="text-xs font-bold text-emerald-600">₹{data.completed + data.active} Cr</p>
         </div>
         <div>
            <p className="text-[8px] font-black text-slate-400 uppercase">Bottleneck</p>
            <p className="text-xs font-bold text-amber-600">₹{data.planned} Cr</p>
         </div>
         <div>
            <p className="text-[8px] font-black text-slate-400 uppercase">Admin</p>
            <p className="text-xs font-bold">₹{data.admin} Cr</p>
         </div>
      </div>
    </div>
  );
}
