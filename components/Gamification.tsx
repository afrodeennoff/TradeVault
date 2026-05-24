"use client";

import React from "react";
import { Trade } from "@/lib/types";
import { Award, Flame, Target, TrendingUp } from "lucide-react";

interface GamificationProps {
  trades: Trade[];
  metrics: any;
}

export default function Gamification({ trades, metrics }: GamificationProps) {
  const totalTrades = trades.length;
  const avgDiscipline = totalTrades > 0 
    ? (trades.reduce((sum, t) => sum + t.disciplineScore, 0) / totalTrades) 
    : 0;

  // Simple level system
  const level = Math.floor(totalTrades / 8) + 1;
  const xp = (totalTrades % 8) * 12.5;
  const nextLevel = (level) * 8;

  const badges = [
    { name: "First Blood", earned: totalTrades >= 1, icon: Target },
    { name: "10 Trade Club", earned: totalTrades >= 10, icon: Award },
    { name: "Streak Guardian", earned: metrics.currentStreak >= 3, icon: Flame },
    { name: "Discipline Master", earned: avgDiscipline >= 8, icon: TrendingUp },
  ];

  return (
    <div className="space-y-8">
      <div>
        <div className="font-semibold tracking-tight text-xl mb-1">Discipline Arena</div>
        <div className="text-[#A1A1AA]">Your trading character is forged here. Every A+ execution levels you up.</div>
      </div>

      {/* Level Card */}
      <div className="glass rounded-3xl p-8 border border-[#1F1F1F]">
        <div className="flex items-end justify-between">
          <div>
            <div className="text-xs tracking-[2px] text-emerald-500">TRADER LEVEL</div>
            <div className="text-[92px] font-semibold tracking-[-6px] leading-none text-white mt-2">{level}</div>
          </div>
          <div className="text-right">
            <div className="text-emerald-400 text-sm">{xp.toFixed(0)} / 100 XP</div>
            <div className="text-xs text-[#A1A1AA]">to Level {level + 1}</div>
          </div>
        </div>

        <div className="mt-6 h-2 bg-[#1F1F1F] rounded-full overflow-hidden">
          <div className="h-2 bg-gradient-to-r from-emerald-400 to-emerald-600 rounded-full transition-all" style={{ width: `${xp}%` }}></div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="card rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Flame className="text-orange-400" />
            <div className="text-sm text-[#A1A1AA]">CURRENT STREAK</div>
          </div>
          <div className="text-5xl font-semibold tracking-tighter">{metrics.currentStreak}</div>
          <div className="text-xs text-[#A1A1AA] mt-1">Consecutive winning days</div>
        </div>

        <div className="card rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Target className="text-emerald-400" />
            <div className="text-sm text-[#A1A1AA]">AVG DISCIPLINE</div>
          </div>
          <div className="text-5xl font-semibold tracking-tighter">{avgDiscipline.toFixed(1)}</div>
          <div className="text-xs text-[#A1A1AA] mt-1">out of 10</div>
        </div>

        <div className="card rounded-3xl p-6">
          <div className="flex items-center gap-3 mb-4">
            <Award className="text-amber-400" />
            <div className="text-sm text-[#A1A1AA]">TRADES LOGGED</div>
          </div>
          <div className="text-5xl font-semibold tracking-tighter">{totalTrades}</div>
          <div className="text-xs text-[#A1A1AA] mt-1">Total executions</div>
        </div>
      </div>

      {/* Badges */}
      <div>
        <div className="text-sm text-[#A1A1AA] tracking-widest mb-4">BADGES EARNED</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {badges.map((badge, i) => {
            const Icon = badge.icon;
            return (
              <div key={i} className={`card rounded-3xl p-5 flex flex-col items-center text-center transition-all ${badge.earned ? "border-emerald-900/50" : "opacity-40 grayscale"}`}>
                <Icon size={32} className={badge.earned ? "text-emerald-400" : "text-[#333]"} />
                <div className="mt-4 text-sm font-medium">{badge.name}</div>
                <div className="text-[10px] text-[#A1A1AA] mt-1">{badge.earned ? "UNLOCKED" : "LOCKED"}</div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="text-center text-xs text-[#A1A1AA] pt-4">
        Consistency compounds. Protect your streak at all costs.
      </div>
    </div>
  );
}
