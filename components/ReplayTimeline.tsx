"use client";

import React, { useState } from "react";
import { Trade } from "@/lib/types";
import { format } from "date-fns";
import { Play, Pause, RotateCcw } from "lucide-react";

interface ReplayTimelineProps {
  trades: Trade[];
}

export default function ReplayTimeline({ trades }: ReplayTimelineProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [intervalId, setIntervalId] = useState<NodeJS.Timeout | null>(null);

  const sortedTrades = [...trades].sort((a, b) => 
    new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime()
  );

  const currentTrade = sortedTrades[currentIndex];

  const togglePlay = () => {
    if (isPlaying) {
      if (intervalId) clearInterval(intervalId);
      setIsPlaying(false);
      setIntervalId(null);
    } else {
      const id = setInterval(() => {
        setCurrentIndex(prev => {
          if (prev >= sortedTrades.length - 1) {
            clearInterval(id);
            setIsPlaying(false);
            return prev;
          }
          return prev + 1;
        });
      }, 1200);
      setIntervalId(id);
      setIsPlaying(true);
    }
  };

  const reset = () => {
    if (intervalId) clearInterval(intervalId);
    setCurrentIndex(0);
    setIsPlaying(false);
    setIntervalId(null);
  };

  if (sortedTrades.length === 0) {
    return <div className="text-center py-12 text-[#A1A1AA]">No trades to replay. Log some executions first.</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <div className="font-semibold tracking-tight text-xl">Session Replay</div>
          <div className="text-sm text-[#A1A1AA]">Reconstruct your trading day. Spot mistakes in real time.</div>
        </div>
        <div className="flex gap-2">
          <button onClick={reset} className="btn-ghost px-4 py-2 rounded-2xl flex items-center gap-2 text-sm">
            <RotateCcw size={16} /> Reset
          </button>
          <button onClick={togglePlay} className="btn-primary px-6 py-2 rounded-2xl flex items-center gap-2 text-sm">
            {isPlaying ? <Pause size={16} /> : <Play size={16} />} {isPlaying ? "Pause" : "Play Timeline"}
          </button>
        </div>
      </div>

      {/* Timeline Bar */}
      <div className="relative h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
        <div 
          className="absolute h-2 bg-emerald-500 transition-all duration-300" 
          style={{ width: `${((currentIndex + 1) / sortedTrades.length) * 100}%` }} 
        />
      </div>

      <div className="flex justify-between text-xs text-[#A1A1AA] px-1">
        <div>Trade 1</div>
        <div>Trade {sortedTrades.length}</div>
      </div>

      {/* Current Trade Card */}
      {currentTrade && (
        <div className="glass rounded-3xl p-8 border border-[#1F1F1F]">
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3">
                <div className={`px-4 py-1 rounded-2xl text-sm font-medium tracking-widest ${currentTrade.direction === "LONG" ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"}`}>
                  {currentTrade.direction}
                </div>
                <div className="text-2xl font-semibold tracking-tight">{currentTrade.pair}</div>
              </div>
              <div className="text-[#A1A1AA] mt-1">{format(new Date(currentTrade.entryTime), "EEEE, dd MMM yyyy • HH:mm")}</div>
            </div>
            <div className={`text-right text-3xl font-mono tracking-tighter ${currentTrade.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
              {currentTrade.pnl >= 0 ? "+" : ""}${currentTrade.pnl.toFixed(1)}
            </div>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
            <div>
              <div className="text-[#A1A1AA] text-xs tracking-widest mb-1">ENTRY → EXIT</div>
              <div className="font-mono">{currentTrade.entryPrice} → {currentTrade.takeProfit}</div>
            </div>
            <div>
              <div className="text-[#A1A1AA] text-xs tracking-widest mb-1">R:R ACHIEVED</div>
              <div className="font-mono text-lg">{currentTrade.rrAchieved}</div>
            </div>
            <div>
              <div className="text-[#A1A1AA] text-xs tracking-widest mb-1">EMOTIONAL STATE</div>
              <div>{currentTrade.emotionalState}</div>
            </div>
            <div>
              <div className="text-[#A1A1AA] text-xs tracking-widest mb-1">DISCIPLINE</div>
              <div className="font-mono">{currentTrade.disciplineScore}/10</div>
            </div>
          </div>

          {currentTrade.notes && (
            <div className="mt-6 pt-6 border-t border-[#1F1F1F] text-sm text-[#A1A1AA]">
              <span className="text-white">Your note:</span> {currentTrade.notes}
            </div>
          )}

          {currentTrade.fomoDetected || currentTrade.revengeTrade ? (
            <div className="mt-4 inline-flex items-center gap-2 px-3 py-1 bg-red-950/50 text-red-400 text-xs rounded-2xl">
              ⚠️ {currentTrade.fomoDetected ? "FOMO detected" : ""} {currentTrade.revengeTrade ? "Revenge trade" : ""}
            </div>
          ) : null}
        </div>
      )}

      {/* Trade Dots */}
      <div className="flex flex-wrap gap-2 pt-4">
        {sortedTrades.map((t, idx) => (
          <button
            key={idx}
            onClick={() => {
              if (intervalId) clearInterval(intervalId);
              setIsPlaying(false);
              setCurrentIndex(idx);
            }}
            className={`w-9 h-9 rounded-2xl text-xs font-mono transition-all flex items-center justify-center border ${idx === currentIndex 
              ? "bg-emerald-500 text-black border-emerald-400 scale-110" 
              : "bg-[#111] border-[#1F1F1F] hover:border-[#333]"}`}
          >
            {idx + 1}
          </button>
        ))}
      </div>
    </div>
  );
}
