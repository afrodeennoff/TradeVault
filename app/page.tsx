"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Download, X } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import Sidebar from "@/components/Sidebar";
import EquityCurve from "@/components/EquityCurve";
import ReplayTimeline from "@/components/ReplayTimeline";
import Gamification from "@/components/Gamification";
import TradeLogForm from "@/components/TradeLogForm";
import { useTradeStore } from "@/store/tradeStore";
import { calculateMetrics } from "@/lib/analytics";

type View = "dashboard" | "log" | "analytics" | "coach" | "replay" | "gamification" | "settings";

export default function TradeVault() {
  const { trades, clearAll } = useTradeStore();
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [showLogModal, setShowLogModal] = useState(false);

  const metrics = calculateMetrics(trades);

  const exportToCSV = () => {
    if (trades.length === 0) return toast.error("No trades to export");

    const headers = ["pair", "direction", "entryTime", "pnl", "rrAchieved", "emotionalState", "disciplineScore", "fomoDetected", "notes"];
    const rows = trades.map(t => [t.pair, t.direction, t.entryTime, t.pnl, t.rrAchieved, t.emotionalState, t.disciplineScore, t.fomoDetected, `"${(t.notes||'').replace(/"/g,'""')}"`]);
    const csv = [headers.join(','), ...rows.map(r => r.join(','))].join('\n');

    const url = URL.createObjectURL(new Blob([csv], { type: 'text/csv' }));
    const a = document.createElement('a');
    a.href = url; a.download = `tradevault_${format(new Date(), 'yyyy-MM-dd')}.csv`; a.click();
    URL.revokeObjectURL(url);
    toast.success('Exported');
  };

  const getAIInsights = () => {
    const list: string[] = [];
    if (metrics.totalTrades > 5 && metrics.winRate < 48) list.push("Win rate low. Be very selective.");
    if (metrics.expectancy < 0) list.push("Negative expectancy. Fix R:R.");
    const fomo = trades.filter(t => t.fomoDetected).length;
    if (fomo > 2) list.push(`${fomo} FOMO trades. Add cooling off.`);
    return list.length ? list : ["Good progress. Keep journaling."];
  };

  const insights = getAIInsights();

  let avgDisc = "0.0";
  if (trades.length > 0) {
    avgDisc = (trades.reduce((s, t) => s + t.disciplineScore, 0) / trades.length).toFixed(1);
  }

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      <Sidebar currentView={currentView} onViewChange={v => setCurrentView(v as View)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 border-b border-[#1F1F1F] flex items-center justify-between px-8 bg-[#0A0A0A]/95 backdrop-blur z-50">
          <div className="flex items-center gap-4 text-sm">
            <div>{format(new Date(), "EEEE, dd MMM yyyy")}</div>
            <div className="h-3 w-px bg-[#1F1F1F]" />
            <div className="text-emerald-500 text-xs tracking-widest flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> LIVE
            </div>
          </div>

          <div className="flex gap-3">
            <button onClick={exportToCSV} className="btn-ghost px-5 py-2 rounded-2xl text-sm flex items-center gap-2">
              <Download size={16} /> Export
            </button>
            <button onClick={() => setShowLogModal(true)} className="btn-primary px-6 py-2 rounded-2xl text-sm flex items-center gap-2">
              <Plus size={17} /> LOG TRADE
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <AnimatePresence mode="wait">
            {currentView === "dashboard" && (
              <motion.div initial={{opacity:0,y:15}} animate={{opacity:1,y:0}} className="space-y-8">
                <div>
                  <div className="text-5xl font-semibold tracking-[-2px]">Good evening, Timon.</div>
                  <div className="text-[#A1A1AA]">Your edge compounds with every entry.</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[ 
                    {l:"WIN RATE", v:`${metrics.winRate}%`},
                    {l:"EXPECTANCY", v:`$${metrics.expectancy}`},
                    {l:"PROFIT FACTOR", v:metrics.profitFactor.toFixed(2)},
                    {l:"STREAK", v:metrics.currentStreak},
                  ].map((k,i) => (
                    <div key={i} className="card rounded-3xl p-6">
                      <div className="text-xs text-[#A1A1AA] tracking-widest">{k.l}</div>
                      <div className="text-5xl font-semibold tracking-[-1.5px] mt-2">{k.v}</div>
                    </div>
                  ))}
                </div>

                <EquityCurve trades={trades} />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-3 card rounded-3xl p-6">
                    <div className="font-semibold mb-4">Recent Trades</div>
                    {trades.length > 0 ? trades.slice(0,5).map(t => (
                      <div key={t.id} className="flex justify-between p-3 border-b border-[#1F1F1F] last:border-0">
                        <div>{t.pair} <span className={t.direction === "LONG" ? "text-emerald-400" : "text-red-400"}>{t.direction}</span></div>
                        <div className={t.pnl >= 0 ? "text-emerald-400" : "text-red-400"}>{t.pnl}</div>
                      </div>
                    )) : <div className="text-[#A1A1AA]">No trades yet</div>}
                  </div>

                  <div className="lg:col-span-2 card rounded-3xl p-6">
                    <div className="font-semibold mb-2">Discipline</div>
                    <div className="text-6xl font-semibold text-emerald-500">{metrics.currentStreak}</div>
                  </div>
                </div>
              </motion.div>
            )}

            {currentView === "analytics" && <div className="max-w-4xl">Analytics view (coming in next update)</div>}
            {currentView === "coach" && <div className="max-w-2xl">{insights.map((m,i) => <div key={i} className="glass p-6 mb-3 rounded-3xl">{m}</div>)}</div>}
            {currentView === "replay" && <ReplayTimeline trades={trades} />}
            {currentView === "gamification" && <Gamification trades={trades} metrics={metrics} />}
            {currentView === "settings" && <div className="max-w-xl card p-8">Settings panel</div>}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-6" onClick={() => setShowLogModal(false)}>
            <motion.div initial={{opacity:0,scale:0.96}} animate={{opacity:1,scale:1}} className="w-full max-w-2xl" onClick={e=>e.stopPropagation()}>
              <div className="card p-8 rounded-3xl"><TradeLogForm onSuccess={() => {setShowLogModal(false); setCurrentView("dashboard");}} /></div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
