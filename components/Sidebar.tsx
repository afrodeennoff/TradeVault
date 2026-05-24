"use client";

import { LayoutDashboard, BookOpen, BarChart3, Brain, PlayCircle, Award, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

interface SidebarProps {
  currentView: string;
  onViewChange: (view: string) => void;
}

const navItems = [
  { id: "dashboard", label: "Dashboard", icon: LayoutDashboard },
  { id: "log", label: "Log Trade", icon: BookOpen },
  { id: "analytics", label: "Analytics", icon: BarChart3 },
  { id: "coach", label: "AI Coach", icon: Brain },
  { id: "replay", label: "Replay", icon: PlayCircle },
  { id: "gamification", label: "Gamification", icon: Award },
  { id: "settings", label: "Settings", icon: Settings },
];

export default function Sidebar({ currentView, onViewChange }: SidebarProps) {
  return (
    <div className="w-64 border-r border-[#1F1F1F] bg-[#0A0A0A] flex flex-col h-screen sticky top-0">
      <div className="p-6 border-b border-[#1F1F1F]">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-emerald-500 flex items-center justify-center">
            <span className="text-[#0A0A0A] font-bold text-xl tracking-[-1px]">TV</span>
          </div>
          <div>
            <div className="font-semibold text-xl tracking-[-0.5px]">TradeVault</div>
            <div className="text-[10px] text-[#A1A1AA] -mt-1">v1.0 • ELITE</div>
          </div>
        </div>
      </div>

      <div className="flex-1 p-3 overflow-auto">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = currentView === item.id;
          return (
            <button
              key={item.id}
              onClick={() => onViewChange(item.id)}
              className={cn(
                "w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all mb-1 text-left",
                isActive
                  ? "bg-[#111] text-white border border-[#1F1F1F]"
                  : "text-[#A1A1AA] hover:bg-[#111] hover:text-white"
              )}
            >
              <Icon size={18} />
              {item.label}
            </button>
          );
        })}
      </div>

      <div className="p-4 border-t border-[#1F1F1F] mt-auto">
        <div className="flex items-center gap-3 px-3 py-2 rounded-2xl bg-[#111]">
          <div className="w-8 h-8 rounded-full bg-zinc-700 flex items-center justify-center text-xs">TA</div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-medium truncate">Timon</div>
            <div className="text-[10px] text-emerald-500">Prop Trader • Edge Builder</div>
          </div>
        </div>
      </div>
    </div>
  );
}
