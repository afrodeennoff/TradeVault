"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, TrendingUp, Target, Award, AlertTriangle, Brain, Calendar, Clock } from "lucide-react";
import { format } from "date-fns";
import { toast } from "sonner";

import Sidebar from "@/components/Sidebar";
import { Trade, TradeInput, EmotionalState, Direction, Market, Session } from "@/lib/types";
import { calculateMetrics } from "@/lib/analytics";

// Sample seed data for instant wow factor
const seedTrades: Trade[] = [
  {
    id: "t1",
    pair: "XAUUSD",
    market: "COMMODITIES",
    direction: "LONG",
    entryTime: "2026-05-20T09:15:00Z",
    exitTime: "2026-05-20T11:45:00Z",
    entryPrice: 2384.5,
    stopLoss: 2378.2,
    takeProfit: 2397.8,
    riskPercent: 0.5,
    positionSize: 2.5,
    leverage: 30,
    session: "LONDON",
    setupType: "Order Block + FVG",
    marketStructure: "BOS + CHoCH",
    liquidityConcepts: "Equal Highs sweep + Premium array",
    confirmationModel: "Candle close + Volume profile",
    timeframeAlignment: "15m structure | 5m entry",
    biasReasoning: "Strong bullish displacement after NY open liquidity grab",
    confidenceLevel: 8,
    emotionalState: "FOCUSED",
    disciplineScore: 9,
    fomoDetected: false,
    revengeTrade: false,
    patienceRating: 8,
    pnl: 168.5,
    rrAchieved: 2.1,
    exitReason: "TP hit cleanly",
    notes: "Perfect execution. Waited for displacement confirmation.",
    createdAt: "2026-05-20T09:16:00Z",
  },
  {
    id: "t2",
    pair: "BTCUSDT",
    market: "CRYPTO",
    direction: "SHORT",
    entryTime: "2026-05-21T14:30:00Z",
    exitTime: "2026-05-21T16:10:00Z",
    entryPrice: 67240,
    stopLoss: 67580,
    takeProfit: 66500,
    riskPercent: 0.75,
    positionSize: 0.08,
    leverage: 20,
    session: "NEW_YORK",
    setupType: "Liquidity + FVG",
    marketStructure: "CHoCH into discount",
    liquidityConcepts: "NY low sweep",
    confirmationModel: "Strong rejection candle",
    timeframeAlignment: "5m entry | 1H bias",
    biasReasoning: "Bearish order flow after fakeout above previous day high",
    confidenceLevel: 7,
    emotionalState: "CALM",
    disciplineScore: 8,
    fomoDetected: false,
    revengeTrade: false,
    patienceRating: 7,
    pnl: -42.3,
    rrAchieved: 0.8,
    exitReason: "SL hit - good risk management",
    notes: "Acceptable loss. Followed process.",
    createdAt: "2026-05-21T14:31:00Z",
  },
];

export default function TradeVault() {
  const [trades, setTrades] = useState<Trade[]>(seedTrades);
  const [currentView, setCurrentView] = useState<"dashboard" | "log" | "analytics" | "coach">("dashboard");
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Persist to localStorage
  useEffect(() => {
    const saved = localStorage.getItem("tradevault_trades");
    if (saved) {
      setTrades(JSON.parse(saved));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("tradevault_trades", JSON.stringify(trades));
  }, [trades]);

  const metrics = calculateMetrics(trades);

  // Add new trade
  const addTrade = (input: TradeInput) => {
    const newTrade: Trade = {
      ...input,
      id: "t" + Date.now(),
      createdAt: new Date().toISOString(),
      pnl: calculatePnL(input),
      rrAchieved: calculateRR(input),
    };
    setTrades((prev) => [newTrade, ...prev]);
    setIsFormOpen(false);
    toast.success("Trade logged successfully", {
      description: `${input.pair} • ${input.direction} • R:R ${newTrade.rrAchieved.toFixed(1)}`,
    });
    // Switch to dashboard to see impact
    setCurrentView("dashboard");
  };

  function calculatePnL(input: TradeInput): number {
    const riskAmount = (input.riskPercent / 100) * 100000; // assume 100k account for demo
    const rr = calculateRR(input);
    return input.direction === "LONG"
      ? riskAmount * rr * (input.takeProfit > input.entryPrice ? 1 : -1)
      : riskAmount * rr * (input.takeProfit < input.entryPrice ? 1 : -1);
  }

  function calculateRR(input: TradeInput): number {
    const risk = Math.abs(input.entryPrice - input.stopLoss);
    const reward = Math.abs(input.takeProfit - input.entryPrice);
    return risk > 0 ? Math.round((reward / risk) * 10) / 10 : 0;
  }

  // Simple AI Coach logic (rule-based + insightful)
  const getAIInsights = () => {
    const insights: string[] = [];
    if (metrics.winRate < 45) {
      insights.push("Your win rate is below 45%. Focus on higher quality setups only. Reduce trade frequency by 40%.");
    }
    if (metrics.expectancy < 0) {
      insights.push("Negative expectancy detected. Review your R:R distribution — you are risking more than you are making on average.");
    }
    if (metrics.currentStreak > 4) {
      insights.push("Strong winning streak! Protect your psychology — consider reducing size for next 3 trades to lock in discipline.");
    }
    const fomoTrades = trades.filter(t => t.fomoDetected).length;
    if (fomoTrades > 2) {
      insights.push(`${fomoTrades} FOMO trades detected. This is your #1 leak. Implement mandatory 15-min cool-off before entry.`);
    }
    if (insights.length === 0) {
      insights.push("Execution quality is solid. Keep journaling every detail — your edge is compounding.");
    }
    return insights;
  };

  const aiInsights = getAIInsights();

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      <Sidebar currentView={currentView} onViewChange={(v) => setCurrentView(v as any)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Top Bar */}
        <div className="h-16 border-b border-[#1F1F1F] flex items-center justify-between px-8 bg-[#0A0A0A]/95 backdrop-blur-xl z-50">
          <div className="flex items-center gap-4">
            <div className="text-sm text-[#A1A1AA]">Sunday, 24 May 2026</div>
            <div className="h-3 w-px bg-[#1F1F1F]" />
            <div className="text-emerald-500 text-sm font-medium flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse" /> LIVE EDGE
            </div>
          </div>
          <button
            onClick={() => {
              setIsFormOpen(true);
              setCurrentView("log");
            }}
            className="btn-primary flex items-center gap-2 px-5 py-2 rounded-2xl text-sm"
          >
            <Plus size={16} /> LOG NEW TRADE
          </button>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <AnimatePresence mode="wait">
            {/* DASHBOARD */}
            {currentView === "dashboard" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                <div>
                  <div className="text-4xl font-semibold tracking-[-1.5px]">Good evening, Timon.</div>
                  <div className="text-[#A1A1AA] mt-1">Your edge is being forged.  {trades.length} trades logged.</div>
                </div>

                {/* KPI Cards */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  {[ 
                    { label: "WIN RATE", value: `${metrics.winRate}%`, icon: Target, color: metrics.winRate > 55 ? "emerald" : "amber" },
                    { label: "EXPECTANCY", value: metrics.expectancy > 0 ? `+$${metrics.expectancy}` : `$${metrics.expectancy}`, icon: TrendingUp, color: metrics.expectancy > 0 ? "emerald" : "red" },
                    { label: "PROFIT FACTOR", value: metrics.profitFactor.toFixed(2), icon: Award, color: metrics.profitFactor > 1.5 ? "emerald" : "amber" },
                    { label: "CURRENT STREAK", value: metrics.currentStreak, icon: Award, color: "emerald" },
                  ].map((kpi, i) => (
                    <div key={i} className="card rounded-3xl p-6">
                      <div className="flex justify-between items-start">
                        <div>
                          <div className="text-xs tracking-[1px] text-[#A1A1AA] font-medium">{kpi.label}</div>
                          <div className="text-4xl font-semibold tracking-[-1px] mt-3 metric-value">{kpi.value}</div>
                        </div>
                        <kpi.icon className={`text-${kpi.color}-500 opacity-60`} size={28} />
                      </div>
                    </div>
                  ))}
                </div>

                {/* Recent Trades & Quick Stats */}
                <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
                  <div className="lg:col-span-3 card rounded-3xl p-6">
                    <div className="flex items-center justify-between mb-5">
                      <div className="font-semibold tracking-tight">Recent Executions</div>
                      <button onClick={() => setCurrentView("analytics")} className="text-xs text-emerald-500 hover:underline">VIEW ALL →</button>
                    </div>
                    <div className="space-y-3">
                      {trades.slice(0, 4).map((trade) => (
                        <div key={trade.id} className="flex items-center justify-between p-4 rounded-2xl bg-[#0A0A0A] border border-[#1F1F1F]">
                          <div className="flex items-center gap-4">
                            <div className={`px-3 py-1 rounded-xl text-xs font-mono tracking-widest ${trade.direction === "LONG" ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"}`}>
                              {trade.direction}
                            </div>
                            <div>
                              <div className="font-medium">{trade.pair}</div>
                              <div className="text-xs text-[#A1A1AA]">{format(new Date(trade.entryTime), "MMM dd • HH:mm")}</div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className={`font-mono text-lg tracking-tight ${trade.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>
                              {trade.pnl >= 0 ? "+" : ""}${trade.pnl.toFixed(1)}
                            </div>
                            <div className="text-[10px] text-[#A1A1AA]">R:R {trade.rrAchieved}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="lg:col-span-2 card rounded-3xl p-6 flex flex-col">
                    <div className="font-semibold tracking-tight mb-4">Discipline Snapshot</div>
                    <div className="flex-1 flex flex-col justify-center items-center text-center">
                      <div className="text-7xl font-semibold tracking-[-3px] text-emerald-500">{metrics.currentStreak}</div>
                      <div className="text-sm text-[#A1A1AA] mt-1">CURRENT WINNING STREAK</div>
                      <div className="mt-6 text-xs max-w-[220px] text-[#A1A1AA]">
                        Best: {metrics.bestStreak} • Worst: {metrics.worstStreak} • Max DD: ${metrics.maxDrawdown}
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* LOG TRADE VIEW */}
            {currentView === "log" && (
              <div className="max-w-3xl mx-auto">
                <div className="mb-8">
                  <div className="text-3xl font-semibold tracking-[-1px]">Log New Execution</div>
                  <div className="text-[#A1A1AA]">Every detail matters. Precision creates edge.</div>
                </div>

                <TradeLogForm onSubmit={addTrade} onCancel={() => setCurrentView("dashboard")} />
              </div>
            )}

            {/* ANALYTICS */}
            {currentView === "analytics" && (
              <div>
                <div className="text-3xl font-semibold tracking-[-1px] mb-8">Performance Intelligence</div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                  <div className="card rounded-3xl p-6">
                    <div className="text-xs text-[#A1A1AA] tracking-widest">OVERALL</div>
                    <div className="mt-4 space-y-4 text-sm">
                      <div className="flex justify-between"><span>Win Rate</span><span className="font-mono">{metrics.winRate}%</span></div>
                      <div className="flex justify-between"><span>Profit Factor</span><span className="font-mono">{metrics.profitFactor}</span></div>
                      <div className="flex justify-between"><span>Expectancy</span><span className="font-mono">${metrics.expectancy}</span></div>
                      <div className="flex justify-between"><span>Avg Win / Loss</span><span className="font-mono">${metrics.averageWin} / ${metrics.averageLoss}</span></div>
                    </div>
                  </div>
                  <div className="card rounded-3xl p-6">
                    <div className="text-xs text-[#A1A1AA] tracking-widest">STREAKS & RISK</div>
                    <div className="mt-4 space-y-4 text-sm">
                      <div className="flex justify-between"><span>Current Streak</span><span className="font-mono text-emerald-400">{metrics.currentStreak}</span></div>
                      <div className="flex justify-between"><span>Best / Worst</span><span className="font-mono">{metrics.bestStreak} / {metrics.worstStreak}</span></div>
                      <div className="flex justify-between"><span>Max Drawdown</span><span className="font-mono text-red-400">${metrics.maxDrawdown}</span></div>
                    </div>
                  </div>
                  <div className="card rounded-3xl p-6">
                    <div className="text-xs text-[#A1A1AA] tracking-widest">BEHAVIORAL</div>
                    <div className="mt-4 text-sm text-[#A1A1AA]">
                      FOMO trades: {trades.filter(t => t.fomoDetected).length}<br />
                      Revenge trades: {trades.filter(t => t.revengeTrade).length}<br />
                      Avg Discipline: {(trades.reduce((sum, t) => sum + t.disciplineScore, 0) / trades.length || 0).toFixed(1)}/10
                    </div>
                  </div>
                </div>

                <div className="card rounded-3xl p-6">
                  <div className="font-semibold mb-4">All Logged Trades ({trades.length})</div>
                  <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                      <thead>
                        <tr className="border-b border-[#1F1F1F] text-left">
                          <th className="py-3 pr-4">PAIR</th>
                          <th>DIRECTION</th>
                          <th>ENTRY</th>
                          <th>PnL</th>
                          <th>R:R</th>
                          <th>EMOTION</th>
                          <th>DISCIPLINE</th>
                        </tr>
                      </thead>
                      <tbody>
                        {trades.map((t) => (
                          <tr key={t.id} className="border-b border-[#1F1F1F] last:border-0 hover:bg-[#111]">
                            <td className="py-4 pr-4 font-medium">{t.pair}</td>
                            <td><span className={`inline-block px-2.5 py-px rounded text-xs ${t.direction === "LONG" ? "bg-emerald-950 text-emerald-400" : "bg-red-950 text-red-400"}`}>{t.direction}</span></td>
                            <td className="font-mono text-xs text-[#A1A1AA]">{format(new Date(t.entryTime), "dd MMM HH:mm")}</td>
                            <td className={`font-mono ${t.pnl >= 0 ? "text-emerald-400" : "text-red-400"}`}>{t.pnl >= 0 ? "+" : ""}${t.pnl.toFixed(1)}</td>
                            <td className="font-mono">{t.rrAchieved}</td>
                            <td className="text-xs">{t.emotionalState}</td>
                            <td><span className="font-mono">{t.disciplineScore}/10</span></td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* AI COACH */}
            {currentView === "coach" && (
              <div className="max-w-2xl mx-auto">
                <div className="flex items-center gap-3 mb-8">
                  <Brain className="text-emerald-500" size={32} />
                  <div>
                    <div className="text-3xl font-semibold tracking-[-1px]">AI Trade Coach</div>
                    <div className="text-[#A1A1AA]">Brutally honest feedback. No sugarcoating.</div>
                  </div>
                </div>

                <div className="space-y-4">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="glass rounded-3xl p-6 border-l-4 border-emerald-500">
                      <div className="flex gap-3">
                        <AlertTriangle className="text-emerald-500 mt-1 flex-shrink-0" size={20} />
                        <p className="text-[15px] leading-relaxed">{insight}</p>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="mt-8 text-xs text-[#A1A1AA] text-center">
                  Phase 2 will connect this to real OpenAI with your full trade history + vector memory for personalized coaching.
                </div>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>

      {/* Trade Log Modal */}
      <AnimatePresence>
        {isFormOpen && currentView !== "log" && (
          <div className="fixed inset-0 bg-black/80 z-[100] flex items-center justify-center p-6" onClick={() => setIsFormOpen(false)}>
            <motion.div 
              initial={{ opacity: 0, scale: 0.96, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 20 }}
              className="w-full max-w-2xl"
              onClick={e => e.stopPropagation()}
            >
              <div className="card rounded-3xl p-8">
                <TradeLogForm onSubmit={addTrade} onCancel={() => setIsFormOpen(false)} />
              </div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

// Separate Form Component for cleanliness
function TradeLogForm({ onSubmit, onCancel }: { onSubmit: (data: TradeInput) => void; onCancel: () => void }) {
  const [formData, setFormData] = useState<Partial<TradeInput>>({
    pair: "XAUUSD",
    market: "COMMODITIES",
    direction: "LONG",
    entryTime: new Date().toISOString().slice(0, 16),
    entryPrice: 0,
    stopLoss: 0,
    takeProfit: 0,
    riskPercent: 0.5,
    positionSize: 1,
    leverage: 30,
    session: "LONDON",
    setupType: "",
    marketStructure: "",
    liquidityConcepts: "",
    confirmationModel: "",
    timeframeAlignment: "",
    biasReasoning: "",
    confidenceLevel: 7,
    emotionalState: "FOCUSED",
    disciplineScore: 8,
    fomoDetected: false,
    revengeTrade: false,
    patienceRating: 8,
    notes: "",
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.pair || !formData.entryPrice || !formData.stopLoss || !formData.takeProfit) {
      toast.error("Please fill required fields: Pair, Entry, SL, TP");
      return;
    }
    onSubmit(formData as TradeInput);
  };

  const updateField = (field: keyof TradeInput, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold tracking-tight">New Trade Entry</div>
        <button type="button" onClick={onCancel} className="text-[#A1A1AA] hover:text-white">Cancel</button>
      </div>

      {/* Basic Data */}
      <div>
        <div className="text-xs uppercase tracking-[2px] text-[#A1A1AA] mb-3">BASIC DATA</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div>
            <label className="text-xs text-[#A1A1AA]">Pair / Ticker</label>
            <input value={formData.pair} onChange={e => updateField("pair", e.target.value.toUpperCase())} className="w-full rounded-2xl px-4 py-3 text-sm" placeholder="XAUUSD" required />
          </div>
          <div>
            <label className="text-xs text-[#A1A1AA]">Market</label>
            <select value={formData.market} onChange={e => updateField("market", e.target.value as Market)} className="w-full rounded-2xl px-4 py-3 text-sm">
              {["FOREX", "CRYPTO", "INDICES", "COMMODITIES", "STOCKS"].map(m => <option key={m} value={m}>{m}</option>)}
            </select>
          </div>
          <div>
            <label className="text-xs text-[#A1A1AA]">Direction</label>
            <select value={formData.direction} onChange={e => updateField("direction", e.target.value as Direction)} className="w-full rounded-2xl px-4 py-3 text-sm">
              <option value="LONG">LONG</option>
              <option value="SHORT">SHORT</option>
            </select>
          </div>
          <div>
            <label className="text-xs text-[#A1A1AA]">Session</label>
            <select value={formData.session} onChange={e => updateField("session", e.target.value as Session)} className="w-full rounded-2xl px-4 py-3 text-sm">
              {["ASIAN", "LONDON", "NEW_YORK", "OVERLAP"].map(s => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>
      </div>

      {/* Prices & Risk */}
      <div>
        <div className="text-xs uppercase tracking-[2px] text-[#A1A1AA] mb-3">PRICES & RISK</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          <div>
            <label className="text-xs text-[#A1A1AA]">Entry Price</label>
            <input type="number" step="0.01" value={formData.entryPrice} onChange={e => updateField("entryPrice", parseFloat(e.target.value))} className="w-full rounded-2xl px-4 py-3 text-sm font-mono" required />
          </div>
          <div>
            <label className="text-xs text-[#A1A1AA]">Stop Loss</label>
            <input type="number" step="0.01" value={formData.stopLoss} onChange={e => updateField("stopLoss", parseFloat(e.target.value))} className="w-full rounded-2xl px-4 py-3 text-sm font-mono" required />
          </div>
          <div>
            <label className="text-xs text-[#A1A1AA]">Take Profit</label>
            <input type="number" step="0.01" value={formData.takeProfit} onChange={e => updateField("takeProfit", parseFloat(e.target.value))} className="w-full rounded-2xl px-4 py-3 text-sm font-mono" required />
          </div>
          <div>
            <label className="text-xs text-[#A1A1AA]">Risk %</label>
            <input type="number" step="0.1" value={formData.riskPercent} onChange={e => updateField("riskPercent", parseFloat(e.target.value))} className="w-full rounded-2xl px-4 py-3 text-sm" />
          </div>
          <div>
            <label className="text-xs text-[#A1A1AA]">Leverage</label>
            <input type="number" value={formData.leverage} onChange={e => updateField("leverage", parseInt(e.target.value))} className="w-full rounded-2xl px-4 py-3 text-sm" />
          </div>
        </div>
      </div>

      {/* Strategy & Psychology */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="text-xs uppercase tracking-[2px] text-[#A1A1AA] mb-3">STRATEGY & ICT</div>
          <div className="space-y-4">
            <input value={formData.setupType} onChange={e => updateField("setupType", e.target.value)} placeholder="Setup Type (e.g. Order Block + FVG)" className="w-full rounded-2xl px-4 py-3 text-sm" />
            <input value={formData.marketStructure} onChange={e => updateField("marketStructure", e.target.value)} placeholder="Market Structure (BOS / CHoCH)" className="w-full rounded-2xl px-4 py-3 text-sm" />
            <input value={formData.liquidityConcepts} onChange={e => updateField("liquidityConcepts", e.target.value)} placeholder="Liquidity Concepts" className="w-full rounded-2xl px-4 py-3 text-sm" />
            <textarea value={formData.biasReasoning} onChange={e => updateField("biasReasoning", e.target.value)} placeholder="Bias Reasoning..." rows={3} className="w-full rounded-3xl px-4 py-3 text-sm resize-y" />
          </div>
        </div>

        <div>
          <div className="text-xs uppercase tracking-[2px] text-[#A1A1AA] mb-3">PSYCHOLOGY</div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-[#A1A1AA]">Confidence (1-10)</label>
                <input type="number" min="1" max="10" value={formData.confidenceLevel} onChange={e => updateField("confidenceLevel", parseInt(e.target.value))} className="w-full rounded-2xl px-4 py-3 text-sm" />
              </div>
              <div>
                <label className="text-xs text-[#A1A1AA]">Discipline (1-10)</label>
                <input type="number" min="1" max="10" value={formData.disciplineScore} onChange={e => updateField("disciplineScore", parseInt(e.target.value))} className="w-full rounded-2xl px-4 py-3 text-sm" />
              </div>
            </div>
            <div>
              <label className="text-xs text-[#A1A1AA]">Emotional State</label>
              <select value={formData.emotionalState} onChange={e => updateField("emotionalState", e.target.value as EmotionalState)} className="w-full rounded-2xl px-4 py-3 text-sm">
                {["CALM", "FOCUSED", "ANXIOUS", "FOMO", "REVENGE", "OVERCONFIDENT", "TIRED"].map(s => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>
            <div className="flex gap-6 text-sm pt-2">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.fomoDetected} onChange={e => updateField("fomoDetected", e.target.checked)} className="accent-emerald-500" /> FOMO detected
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={formData.revengeTrade} onChange={e => updateField("revengeTrade", e.target.checked)} className="accent-emerald-500" /> Revenge trade
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <label className="text-xs uppercase tracking-[2px] text-[#A1A1AA] mb-2 block">NOTES / LESSONS</label>
        <textarea value={formData.notes} onChange={e => updateField("notes", e.target.value)} placeholder="What went well? What will you improve?" rows={3} className="w-full rounded-3xl px-4 py-3 text-sm" />
      </div>

      <div className="flex justify-end gap-3 pt-4">
        <button type="button" onClick={onCancel} className="btn-ghost px-8 py-3 rounded-2xl text-sm">Cancel</button>
        <button type="submit" className="btn-primary px-10 py-3 rounded-2xl text-sm font-semibold">SAVE TRADE TO JOURNAL</button>
      </div>
    </form>
  );
}
