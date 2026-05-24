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

  // CSV Export
  const exportToCSV = () => {
    if (trades.length === 0) {
      toast.error("No trades to export");
      return;
    }
    const headers = ["pair", "direction", "entryTime", "pnl", "rrAchieved", "emotionalState", "disciplineScore", "fomoDetected", "notes"];
    const csvRows = trades.map((t) => [
      t.pair, t.direction, t.entryTime, t.pnl, t.rrAchieved, t.emotionalState, t.disciplineScore, t.fomoDetected,
      `"${(t.notes || "").replace(/"/g, '""')}"`
    ]);
    const csvContent = [headers.join(","), ...csvRows.map((row) => row.join(","))].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `tradevault_${format(new Date(), "yyyy-MM-dd")}.csv`;
    link.click();
    URL.revokeObjectURL(url);
    toast.success("Journal exported successfully");
  };

  // AI Coach
  const getAIInsights = () => {
    const insights: string[] = [];
    if (metrics.totalTrades > 5 && metrics.winRate < 48) {
      insights.push("Your win rate is below 48%. Be extremely selective. Only take A+ setups.");
    }
    if (metrics.expectancy < 0) {
      insights.push("Negative expectancy detected. Review your R:R and emotional discipline immediately.");
    }
    const fomoTrades = trades.filter((t) => t.fomoDetected).length;
    if (fomoTrades > 2) {
      insights.push(`${fomoTrades} FOMO trades detected. This is your biggest leak. Add a mandatory cooling-off period.`);
    }
    if (insights.length === 0 && metrics.totalTrades > 4) {
      insights.push("Execution quality is solid. Continue logging with rich detail to compound your edge.");
    }
    return insights.length > 0 ? insights : ["Log more trades with full psychology data to unlock deeper coaching."];
  };

  const aiInsights = getAIInsights();

  // Safe average discipline (fixes NaN when no trades)
  const avgDiscipline = trades.length > 0
    ? (trades.reduce((sum, t) => sum + t.disciplineScore, 0) / trades.length).toFixed(1)
    : "0.0";

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      <Sidebar currentView={currentView} onViewChange={(v) => setCurrentView(v as View)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 border-b border-[#1F1F1F] flex items-center justify-between px-8 bg-[#0A0A0A]/95 backdrop-blur-xl z-50">
          <div className="flex items-center gap-4">
            <div className="text-sm text-[#A1A1AA]">{format(new Date(), "EEEE, dd MMM yyyy")}</div>
            <div className="h-3 w-px bg-[#1F1F1F]" />
            <div className="text-emerald-500 text-xs tracking-[2px] flex items-center gap-2">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" /> PRODUCTION EDGE
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={exportToCSV} className="btn-ghost flex items-center gap-2 px-5 py-2 rounded-2xl text-sm">
              <Download size={16} /> EXPORT CSV
            </button>
            <button onClick={() => setShowLogModal(true)} className="btn-primary flex items-center gap-2 px-6 py-2 rounded-2xl text-sm font-medium">
              <Plus size={17} /> LOG TRADE
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <AnimatePresence mode="wait">
            {/* DASHBOARD */}
            {currentView === "dashboard" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8 max-w-7xl">
                <div>
                  <div className="text-5xl font-semibold tracking-[-2.2px]">Good evening, Timon.</div>
                  <div className="text-[#A1A1AA] mt-2">Your edge is being forged with every honest entry.</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[ 
                    { label: "WIN RATE", value: `${metrics.winRate}%` },
                    { label: "EXPECTANCY", value: `$${metrics.expectancy}` },
                    { label: "PROFIT FACTOR", value: metrics.profitFactor.toFixed(2) },
                    { label: "STREAK", value: metrics.currentStreak },
                  ].map((kpi, index) => (
                    <div key={index} className="card rounded-3xl p-6">
                      <div className="text-xs tracking-[1.5px] text-[#A1A1AA]">{kpi.label}</div>
                      <div className="text-5xl font-semibold tracking-[-1.5px] mt-3 metric-value">{kpi.value}</div>
                    </div>
                  ))}
                </div>

                <EquityCurve trades={trades} />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-3 card rounded-3xl p-6">
                    <div className="flex justify-between items-center mb-5">
                      <div className="font-semibold tracking-tight">Recent Executions</div>
                      <button onClick={() => setCurrentView("analytics")} className="text-xs text-emerald-500 tracking-widest hover:underline">VIEW ALL →</button>
                    </div>
                    <div className="space-y-3">
                      {trades.length > 0 ? (
                        trades.slice(0, 5).map((trade) => (
                          <div key={trade.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#0A0A0A] border border-[#1F1F1F]">
                            <div className="flex items-center gap-4">
                              <div className={`px-3 py-1 rounded-xl text-xs font-mono tracking-widest ${trade.direction === "LONG" ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"}`}>{trade.direction}</div>
                              <div className="font-medium">{trade.pair}</div>
                            </div>
                              <div className={`font-mono text-lg tracking-tight ${trade.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>{trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(1)}</div>
                          </div>
                        ))
                      ) : (
                        <div className="text-center py-8 text-[#A1A1AA] text-sm">No trades logged yet. Start building your edge.</div>
                      )}
                    </div>
                  </div>

                  <div className="lg:col-span-2 card rounded-3xl p-6 flex flex-col">
                    <div className="font-semibold mb-4 tracking-tight">Discipline Snapshot</div>
                    <div className="flex-1 flex flex-col justify-center text-center">
                      <div className="text-[92px] font-semibold tracking-[-4px] text-emerald-500 leading-none">{metrics.currentStreak}</div>
                      <div className="text-sm text-[#A1A1AA] -mt-2">CURRENT WINNING STREAK</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* ANALYTICS */}
            {currentView === "analytics" && (
              <div className="max-w-5xl">
                <div className="text-3xl font-semibold tracking-[-1px] mb-8">Performance Intelligence</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="card rounded-3xl p-6">
                    <div className="text-xs text-[#A1A1AA] tracking-widest mb-4">OVERALL</div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span>Win Rate</span><span className="font-mono">{metrics.winRate}%</span></div>
                      <div className="flex justify-between"><span>Profit Factor</span><span className="font-mono">{metrics.profitFactor}</span></div>
                      <div className="flex justify-between"><span>Expectancy</span><span className="font-mono">${metrics.expectancy}</span></div>
                    </div>
                  </div>
                  <div className="card rounded-3xl p-6">
                    <div className="text-xs text-[#A1A1AA] tracking-widest mb-4">STREAKS & RISK</div>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between"><span>Current Streak</span><span className="font-mono text-emerald-400">{metrics.currentStreak}</span></div>
                      <div className="flex justify-between"><span>Best / Worst</span><span className="font-mono">{metrics.bestStreak} / {metrics.worstStreak}</span></div>
                      <div className="flex justify-between"><span>Max Drawdown</span><span className="font-mono text-red-400">${metrics.maxDrawdown}</span></div>
                    </div>
                  </div>
                  <div className="card rounded-3xl p-6">
                    <div className="text-xs text-[#A1A1AA] tracking-widest mb-4">BEHAVIORAL</div>
                    <div className="text-sm text-[#A1A1AA] space-y-1">
                      <div>FOMO trades: {trades.filter((t) => t.fomoDetected).length}</div>
                      <div>Revenge trades: {trades.filter((t) => t.revengeTrade).length}</div>
                      <div>Avg Discipline: {avgDiscipline}/10</div>
                    </div>
                  </div>
                </div>
                <EquityCurve trades={trades} />
              </div>
            )}

            {/* AI COACH */}
            {currentView === "coach" && (
              <div className="max-w-2xl mx-auto">
                <div className="text-3xl font-semibold tracking-[-1px] mb-8">AI Trade Coach</div>
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="glass rounded-3xl p-7 border-l-4 border-emerald-500 text-[15px] leading-relaxed">{insight}</div>
                  ))}
                </div>
              </div>
            )}

            {/* REPLAY */}
            {currentView === "replay" && <div className="max-w-4xl mx-auto"><ReplayTimeline trades={trades} /></div>}

            {/* GAMIFICATION */}
            {currentView === "gamification" && <div className="max-w-4xl mx-auto"><Gamification trades={trades} metrics={metrics} /></div>}

            {/* SETTINGS */}
            {currentView === "settings" && (
              <div className="max-w-xl">
                <div className="text-3xl font-semibold tracking-[-1px] mb-8">Settings</div>
                <div className="card rounded-3xl p-8">
                  <div className="text-sm text-[#A1A1AA]">More production settings coming in next updates.</div>
                  <button onClick={() => { if (confirm("Clear all local journal data? This cannot be undone.")) { clearAll(); toast.success("All data cleared"); } }} className="mt-6 text-red-400 text-sm underline">Clear All Local Data</button>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Log Trade Modal */}
      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-6" onClick={() => setShowLogModal(false)}>
            <motion.div initial={{ opacity: 0, scale: 0.96, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.96, y: 20 }} className="w-full max-w-3xl" onClick={e => e.stopPropagation()}>
              <div className="card rounded-3xl p-8 relative">
                <button onClick={() => setShowLogModal(false)} className="absolute top-6 right-6 text-[#A1A1AA] hover:text-white">
                  <X size={20} />
                </button>
                <TradeLogForm onSuccess={() => { setShowLogModal(false); setCurrentView("dashboard"); }} />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
