"use client";

import React from "react";
import { Trade } from "@/lib/types";

interface EquityCurveProps {
  trades: Trade[];
}

export default function EquityCurve({ trades }: EquityCurveProps) {
  if (trades.length === 0) {
    return <div className="h-64 flex items-center justify-center text-[#A1A1AA]">No trades yet</div>;
  }

  const sorted = [...trades].sort((a, b) => 
    new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime()
  );

  let running = 0;
  const points = sorted.map((t, i) => {
    running += t.pnl;
    return { x: i, y: running };
  });

  const minY = Math.min(...points.map(p => p.y));
  const maxY = Math.max(...points.map(p => p.y));
  const range = maxY - minY || 1;

  const width = 600;
  const height = 220;
  const padding = 30;

  const getX = (i: number) => padding + (i / (points.length - 1 || 1)) * (width - padding * 2);
  const getY = (val: number) => height - padding - ((val - minY) / range) * (height - padding * 2);

  const pathD = points.map((p, i) => 
    `${i === 0 ? 'M' : 'L'} ${getX(p.x)} ${getY(p.y)}`
  ).join(' ');

  return (
    <div className="bg-[#111] rounded-3xl p-6 border border-[#1F1F1F]">
      <div className="flex justify-between items-center mb-4">
        <div className="font-semibold tracking-tight">Equity Curve</div>
        <div className="text-xs text-[#A1A1AA]">Running PnL (demo account)</div>
      </div>
      <svg width={width} height={height} className="w-full">
        {/* Grid */}
        {[0, 1, 2, 3, 4].map(i => (
          <line 
            key={i}
            x1={padding} 
            y1={padding + (i * (height - padding*2) / 4)} 
            x2={width - padding} 
            y2={padding + (i * (height - padding*2) / 4)} 
            stroke="#1F1F1F" 
            strokeWidth="1" 
          />
        ))}
        
        {/* Area under curve */}
        <path 
          d={`${pathD} L ${getX(points.length-1)} ${height - padding} L ${padding} ${height - padding} Z`}
          fill="rgba(16, 185, 129, 0.08)" 
          stroke="none"
        />
        
        {/* Main line */}
        <path 
          d={pathD} 
          fill="none" 
          stroke="#10B981" 
          strokeWidth="2.5" 
          strokeLinejoin="round"
          strokeLinecap="round"
        />
        
        {/* Dots */}
        {points.map((p, i) => (
          <circle 
            key={i}
            cx={getX(p.x)} 
            cy={getY(p.y)} 
            r="3.5" 
            fill="#10B981" 
            stroke="#0A0A0A" 
            strokeWidth="2"
          />
        ))}
      </svg>
      <div className="flex justify-between text-[10px] text-[#A1A1AA] mt-2 px-1">
        <div>Start</div>
        <div>Latest</div>
      </div>
    </div>
  );
}
