"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Download, Settings as SettingsIcon } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import Sidebar from "@/components/Sidebar";
import EquityCurve from "@/components/EquityCurve";
import ReplayTimeline from "@/components/ReplayTimeline";
import Gamification from "@/components/Gamification";
import { Trade, TradeInput, EmotionalState, Direction, Market, Session } from "@/lib/types";
import { calculateMetrics } from "@/lib/analytics";

// Seed data
const seedTrades: Trade[] = [
  { id: "t1", pair: "XAUUSD", market: "COMMODITIES", direction: "LONG", entryTime: "2026-05-20T09:15:00Z", exitTime: "2026-05-20T11:45:00Z", entryPrice: 2384.5, stopLoss: 2378.2, takeProfit: 2397.8, riskPercent: 0.5, positionSize: 2.5, leverage: 30, session: "LONDON", setupType: "Order Block + FVG", marketStructure: "BOS + CHoCH", liquidityConcepts: "Equal Highs sweep + Premium array", confirmationModel: "Candle close + Volume profile", timeframeAlignment: "15m structure | 5m entry", biasReasoning: "Strong bullish displacement after NY open liquidity grab", confidenceLevel: 8, emotionalState: "FOCUSED", disciplineScore: 9, fomoDetected: false, revengeTrade: false, patienceRating: 8, pnl: 168.5, rrAchieved: 2.1, exitReason: "TP hit cleanly", notes: "Perfect execution. Waited for displacement confirmation.", createdAt: "2026-05-20T09:16:00Z" },
  { id: "t2", pair: "BTCUSDT", market: "CRYPTO", direction: "SHORT", entryTime: "2026-05-21T14:30:00Z", exitTime: "2026-05-21T16:10:00Z", entryPrice: 67240, stopLoss: 67580, takeProfit: 66500, riskPercent: 0.75, positionSize: 0.08, leverage: 20, session: "NEW_YORK", setupType: "Liquidity + FVG", marketStructure: "CHoCH into discount", liquidityConcepts: "NY low sweep", confirmationModel: "Strong rejection candle", timeframeAlignment: "5m entry | 1H bias", biasReasoning: "Bearish order flow after fakeout above previous day high", confidenceLevel: 7, emotionalState: "CALM", disciplineScore: 8, fomoDetected: false, revengeTrade: false, patienceRating: 7, pnl: -42.3, rrAchieved: 0.8, exitReason: "SL hit - good risk management", notes: "Acceptable loss. Followed process.", createdAt: "2026-05-21T14:31:00Z" },
];

type View = "dashboard" | "log" | "analytics" | "coach" | "replay" | "gamification" | "settings";

export default function TradeVault() {
  const [trades, setTrades] = useState<Trade[]>(seedTrades);
  const [currentView, setCurrentView] = useState<View>("dashboard");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Persistence
  useEffect(() => {
    const saved = localStorage.getItem("tradevault_trades_v1");
    if (saved) setTrades(JSON.parse(saved));
  }, []);

  useEffect(() => {
    localStorage.setItem("tradevault_trades_v1", JSON.stringify(trades));
  }, [trades]);

  const metrics = calculateMetrics(trades);

  const addTrade = (input: TradeInput) => {
    const newTrade: Trade = {
      ...input,
      id: "t" + Date.now(),
      createdAt: new Date().toISOString(),
      pnl: calculatePnL(input),
      rrAchieved: calculateRR(input),
    };
    setTrades(prev => [newTrade, ...prev]);
    setIsFormOpen(false);
    toast.success("Trade logged. Edge increased.", { description: `${input.pair} • R:R ${newTrade.rrAchieved}` });
    setCurrentView("dashboard");
  };

  function calculatePnL(input: TradeInput): number {
    const riskAmount = (input.riskPercent / 100) * 100000; // demo 100k account
    const rr = calculateRR(input);
    const directionMultiplier = input.direction === "LONG" ? 1 : -1;
    return riskAmount * rr * directionMultiplier * (input.takeProfit > input.entryPrice ? 1 : -1);
  }

  function calculateRR(input: TradeInput): number {
    const risk = Math.abs(input.entryPrice - input.stopLoss);
    const reward = Math.abs(input.takeProfit - input.entryPrice);
    return risk > 0 ? Math.round((reward / risk) * 10) / 10 : 0;
  }

  // Advanced AI Coach
  const getAIInsights = () => {
    const insights: string[] = [];
    if (metrics.winRate < 48 && metrics.totalTrades > 5) {
      insights.push("Win rate below 48%. You are taking too many low-quality setups. Ruthlessly filter for A+ only.");
    }
    if (metrics.expectancy < 0) {
      insights.push("Negative expectancy. Your average winner is smaller than your average loser. Fix R:R or win rate immediately.");
    }
    if (metrics.currentStreak >= 4) {
      insights.push("Strong streak. Reduce position size by 30% for the next 5 trades to protect psychology and lock in gains.");
    }
    const fomoCount = trades.filter(t => t.fomoDetected).length;
    if (fomoCount > 1) {
      insights.push(`${fomoCount} FOMO trades logged. This is your primary leak. Implement mandatory 20-minute rule before any entry.`);
    }
    if (insights.length === 0 && metrics.totalTrades > 3) {
      insights.push("Execution quality is high. Your journal is becoming a weapon. Keep this standard for 30 more trades.");
    }
    if (insights.length === 0) {
      insights.push("Start logging more trades with full psychology data to unlock deeper coaching.");
    }
    return insights;
  };

  const aiInsights = getAIInsights();

  // CSV Export
  const exportToCSV = () => {
    if (trades.length === 0) return;
    const headers = ["pair", "direction", "entryTime", "pnl", "rrAchieved", "emotionalState", "disciplineScore", "fomoDetected", "notes"];
    const csvContent = [
      headers.join(","),
      ...trades.map(t => [
        t.pair,
        t.direction,
        t.entryTime,
        t.pnl,
        t.rrAchieved,
        t.emotionalState,
        t.disciplineScore,
        t.fomoDetected,
        `"${(t.notes || "").replace(/"/g, '""')}"`
      ].join(","))
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `tradevault_journal_${format(new Date(), "yyyy-MM-dd")}.csv`;
    a.click();
    URL.revokeObjectURL(url);
    toast.success("Journal exported", { description: "CSV ready for your backtesting tools" });
  };

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      <Sidebar currentView={currentView} onViewChange={(v) => setCurrentView(v as View)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 border-b border-[#1F1F1F] flex items-center justify-between px-8 bg-[#0A0A0A]/95 backdrop-blur z-50">
          <div className="flex items-center gap-4 text-sm">
            <div className="text-[#A1A1AA]">{format(new Date(), "EEEE, dd MMM yyyy")}</div>
            <div className="h-3 w-px bg-[#1F1F1F]" />
            <div className="text-emerald-500 flex items-center gap-1.5 text-xs tracking-widest">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> EDGE ACTIVE
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button onClick={exportToCSV} className="btn-ghost flex items-center gap-2 px-5 py-2 rounded-2xl text-sm">
              <Download size={16} /> EXPORT CSV
            </button>
            <button onClick={() => { setIsFormOpen(true); setCurrentView("log"); }} className="btn-primary flex items-center gap-2 px-6 py-2 rounded-2xl text-sm font-medium">
              <Plus size={17} /> LOG TRADE
            </button>
          </div>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <AnimatePresence mode="wait">
            {/* DASHBOARD */}
            {currentView === "dashboard" && (
              <motion.div initial={{opacity:0, y:15}} animate={{opacity:1, y:0}} className="space-y-8 max-w-7xl">
                <div>
                  <div className="text-5xl font-semibold tracking-[-2.2px]">Good evening, Timon.</div>
                  <div className="text-[#A1A1AA] mt-2">Your edge compounds with every honest entry.</div>
                </div>

                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[ 
                    { label: "WIN RATE", value: `${metrics.winRate}%` },
                    { label: "EXPECTANCY", value: `$${metrics.expectancy}` },
                    { label: "PROFIT FACTOR", value: metrics.profitFactor.toFixed(2) },
                    { label: "STREAK", value: metrics.currentStreak },
                  ].map((kpi, i) => (
                    <div key={i} className="card rounded-3xl p-6">
                      <div className="text-xs tracking-[1.5px] text-[#A1A1AA]">{kpi.label}</div>
                      <div className="text-5xl font-semibold tracking-[-1.5px] mt-3 metric-value">{kpi.value}</div>
                    </div>
                  ))}
                </div>

                <EquityCurve trades={trades} />

                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-3 card rounded-3xl p-6">
                    <div className="flex justify-between mb-5">
                      <div className="font-semibold">Recent Executions</div>
                      <button onClick={() => setCurrentView("analytics")} className="text-emerald-500 text-xs tracking-widest hover:underline">FULL ANALYTICS →</button>
                    </div>
                    <div className="space-y-3">
                      {trades.slice(0,5).map(trade => (
                        <div key={trade.id} className="flex justify-between items-center p-4 rounded-2xl bg-[#0A0A0A] border border-[#1F1F1F]">
                          <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 text-xs rounded-xl font-mono tracking-widest ${trade.direction === "LONG" ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"}`}>{trade.direction}</div>
                            <div className="font-medium">{trade.pair}</div>
                          </div>
                          <div className={`font-mono text-lg tracking-tight ${trade.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>{trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(1)}</div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-2 card rounded-3xl p-6 flex flex-col">
                    <div className="font-semibold mb-4">Discipline Snapshot</div>
                    <div className="flex-1 flex flex-col justify-center text-center">
                      <div className="text-[92px] font-semibold tracking-[-4px] text-emerald-500 leading-none">{metrics.currentStreak}</div>
                      <div className="text-sm text-[#A1A1AA] -mt-2">CURRENT WINNING STREAK</div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LOG TRADE */}
            {currentView === "log" && (
              <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                  <div className="text-3xl font-semibold tracking-[-1px]">Log New Execution</div>
                  <div className="text-[#A1A1AA]">Precision in. Edge out.</div>
                </div>
                <TradeLogForm onSubmit={addTrade} onCancel={() => setCurrentView("dashboard")} />
              </div>
            )}

            {/* ANALYTICS */}
            {currentView === "analytics" && (
              <div className="max-w-5xl">
                <div className="text-3xl font-semibold tracking-[-1px] mb-8">Performance Intelligence</div>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="card rounded-3xl p-6"><div className="text-xs text-[#A1A1AA] tracking-widest mb-4">OVERALL</div><div className="space-y-3 text-sm"><div className="flex justify-between"><span>Win Rate</span><span className="font-mono">{metrics.winRate}%</span></div><div className="flex justify-between"><span>Profit Factor</span><span className="font-mono">{metrics.profitFactor}</span></div><div className="flex justify-between"><span>Expectancy</span><span className="font-mono">${metrics.expectancy}</span></div></div></div>
                  <div className="card rounded-3xl p-6"><div className="text-xs text-[#A1A1AA] tracking-widest mb-4">STREAKS & RISK</div><div className="space-y-3 text-sm"><div className="flex justify-between"><span>Current Streak</span><span className="font-mono text-emerald-400">{metrics.currentStreak}</span></div><div className="flex justify-between"><span>Best / Worst</span><span className="font-mono">{metrics.bestStreak} / {metrics.worstStreak}</span></div><div className="flex justify-between"><span>Max Drawdown</span><span className="font-mono text-red-400">${metrics.maxDrawdown}</span></div></div></div>
                  <div className="card rounded-3xl p-6"><div className="text-xs text-[#A1A1AA] tracking-widest mb-4">BEHAVIOR</div><div className="text-sm text-[#A1A1AA] space-y-1"><div>FOMO trades: {trades.filter(t=>t.fomoDetected).length}</div><div>Revenge trades: {trades.filter(t=>t.revengeTrade).length}</div><div>Avg Discipline: {(trades.reduce((s,t)=>s+t.disciplineScore,0)/trades.length || 0).toFixed(1)}/10</div></div></div>
                </div>
                <EquityCurve trades={trades} />
              </div>
            )}

            {/* AI COACH */}
            {currentView === "coach" && (
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-4 mb-8">
                  <div className="text-3xl font-semibold tracking-[-1px]">AI Trade Coach</div>
                </div>
                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="glass rounded-3xl p-7 border-l-4 border-emerald-500 text-[15px] leading-relaxed">{insight}</div>
                  ))}
                </div>
                <div className="text-center text-xs text-[#A1A1AA] mt-10">Phase 2 will connect this to real GPT-4o with your full history + memory.</div>
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
                <div className="card rounded-3xl p-8 space-y-6 text-sm">
                  <div>
                    <div className="text-[#A1A1AA] text-xs tracking-widest mb-2">DEMO ACCOUNT SIZE</div>
                    <div className="font-mono text-2xl">$100,000</div>
                    <div className="text-xs text-[#A1A1AA] mt-1">(Used for PnL simulation. Change in future versions)</div>
                  </div>
                  <div className="pt-6 border-t border-[#1F1F1F]">
                    <div className="text-emerald-500 text-xs tracking-[2px]">PHASE 2 COMING</div>
                    <div className="mt-2 text-[#A1A1AA]">Real database, authentication, OpenAI integration, and screenshot markup will be added here.</div>
                  </div>
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Modal Form */}
      <AnimatePresence>
        {isFormOpen && (
          <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-6" onClick={() => setIsFormOpen(false)}>
            <motion.div initial={{opacity:0, scale:0.96, y:20}} animate={{opacity:1, scale:1, y:0}} exit={{opacity:0, scale:0.96, y:20}} className="w-full max-w-2xl" onClick={e=>e.stopPropagation()}>
              <div className="card rounded-3xl p-8"><TradeLogForm onSubmit={addTrade} onCancel={() => setIsFormOpen(false)} /></div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Trade Log Form Component
function TradeLogForm({ onSubmit, onCancel }: { onSubmit: (data: TradeInput) => void; onCancel: () => void }) {
  const [form, setForm] = useState<Partial<TradeInput>>({
    pair: "XAUUSD", market: "COMMODITIES", direction: "LONG", entryTime: new Date().toISOString().slice(0,16),
    entryPrice: 0, stopLoss: 0, takeProfit: 0, riskPercent: 0.5, positionSize: 1, leverage: 30, session: "LONDON",
    setupType: "", marketStructure: "", liquidityConcepts: "", confirmationModel: "", timeframeAlignment: "", biasReasoning: "",
    confidenceLevel: 7, emotionalState: "FOCUSED", disciplineScore: 8, fomoDetected: false, revengeTrade: false, patienceRating: 8, notes: "",
  });

  const update = (field: keyof TradeInput, value: any) => setForm(prev => ({...prev, [field]: value}));

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.pair || !form.entryPrice || !form.stopLoss || !form.takeProfit) {
      toast.error("Required fields missing"); return;
    }
    onSubmit(form as TradeInput);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-between"><div className="text-2xl font-semibold tracking-tight">New Trade Entry</div><button type="button" onClick={onCancel} className="text-[#A1A1AA]">Cancel</button></div>

      <div>
        <div className="text-xs tracking-[2px] text-[#A1A1AA] mb-3">BASIC DATA</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input value={form.pair} onChange={e=>update("pair", e.target.value.toUpperCase())} placeholder="PAIR" className="rounded-2xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]" required/>
          <select value={form.market} onChange={e=>update("market", e.target.value as Market)} className="rounded-2xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]">{["FOREX","CRYPTO","INDICES","COMMODITIES","STOCKS"].map(m=><option key={m} value={m}>{m}</option>)}</select>
          <select value={form.direction} onChange={e=>update("direction", e.target.value as Direction)} className="rounded-2xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]"><option value="LONG">LONG</option><option value="SHORT">SHORT</option></select>
          <select value={form.session} onChange={e=>update("session", e.target.value as Session)} className="rounded-2xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]">{["ASIAN","LONDON","NEW_YORK","OVERLAP"].map(s=><option key={s} value={s}>{s}</option>)}</select>
        </div>
      </div>

      <div>
        <div className="text-xs tracking-[2px] text-[#A1A1AA] mb-3">PRICES & RISK</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["entryPrice","stopLoss","takeProfit","riskPercent","leverage"].map(field => (
            <input key={field} type="number" step="0.01" value={(form as any)[field]} onChange={e=>update(field as any, parseFloat(e.target.value))} placeholder={field} className="rounded-2xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F] font-mono" />
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="text-xs tracking-[2px] text-[#A1A1AA] mb-3">STRATEGY / ICT</div>
          <div className="space-y-3">
            {["setupType","marketStructure","liquidityConcepts","timeframeAlignment"].map(f => <input key={f} value={(form as any)[f]} onChange={e=>update(f as any, e.target.value)} placeholder={f} className="w-full rounded-2xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]" />)}
            <textarea value={form.biasReasoning} onChange={e=>update("biasReasoning", e.target.value)} placeholder="Bias Reasoning" rows={2} className="w-full rounded-3xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]" />
          </div>
        </div>
        <div>
          <div className="text-xs tracking-[2px] text-[#A1A1AA] mb-3">PSYCHOLOGY</div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div><div className="text-xs text-[#A1A1AA] mb-1">Confidence</div><input type="number" min="1" max="10" value={form.confidenceLevel} onChange={e=>update("confidenceLevel", parseInt(e.target.value))} className="w-full rounded-2xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]" /></div>
              <div><div className="text-xs text-[#A1A1AA] mb-1">Discipline</div><input type="number" min="1" max="10" value={form.disciplineScore} onChange={e=>update("disciplineScore", parseInt(e.target.value))} className="w-full rounded-2xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]" /></div>
            </div>
            <select value={form.emotionalState} onChange={e=>update("emotionalState", e.target.value as EmotionalState)} className="w-full rounded-2xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]">{["CALM","FOCUSED","ANXIOUS","FOMO","REVENGE","OVERCONFIDENT","TIRED"].map(s=><option key={s} value={s}>{s}</option>)}</select>
            <div className="flex gap-6 text-sm">
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.fomoDetected} onChange={e=>update("fomoDetected", e.target.checked)} className="accent-emerald-500" /> FOMO</label>
              <label className="flex items-center gap-2"><input type="checkbox" checked={form.revengeTrade} onChange={e=>update("revengeTrade", e.target.checked)} className="accent-emerald-500" /> Revenge</label>
            </div>
          </div>
        </div>
      </div>

      <div><div className="text-xs tracking-[2px] text-[#A1A1AA] mb-2">NOTES</div><textarea value={form.notes} onChange={e=>update("notes", e.target.value)} placeholder="What did you learn?" rows={3} className="w-full rounded-3xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]" /></div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="btn-ghost px-8 py-3 rounded-2xl">Cancel</button>
        <button type="submit" className="btn-primary px-10 py-3 rounded-2xl font-semibold">SAVE TO JOURNAL</button>
      </div>
    </form>
  );
}
