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
    if (trades.length === 0) return toast.error("No trades");

    const csv = "pair,direction,pnl\n" + trades.map(t => `${t.pair},${t.direction},${t.pnl}`).join("\n");
    const url = URL.createObjectURL(new Blob([csv], {type:"text/csv"}));
    const a = document.createElement("a");
    a.href = url; a.download = "trades.csv"; a.click();
    toast.success("Exported");
  };

  const insights = ["Keep logging with detail."];

  return (
    <div className="flex h-screen overflow-hidden bg-[#0A0A0A]">
      <Sidebar currentView={currentView} onViewChange={v => setCurrentView(v as View)} />

      <div className="flex-1 flex flex-col overflow-hidden">
        <div className="h-16 border-b border-[#1F1F1F] flex items-center justify-between px-8 bg-[#0A0A0A]/95 backdrop-blur z-50">
          <div className="text-sm">{format(new Date(), "dd MMM yyyy")}</div>
          <button onClick={() => setShowLogModal(true)} className="btn-primary px-6 py-2 rounded-2xl text-sm">Log Trade</button>
        </div>

        <div className="flex-1 overflow-auto p-8">
          <AnimatePresence mode="wait">
            {currentView === "dashboard" && (
              <div>
                <div className="text-4xl font-semibold mb-6">Good evening, Timon.</div>
                <EquityCurve trades={trades} />
              </div>
            )}
            {currentView === "log" && <TradeLogForm onSuccess={() => setCurrentView("dashboard")} />}
            {currentView === "analytics" && <div>Analytics</div>}
            {currentView === "coach" && <div>AI Coach</div>}
            {currentView === "replay" && <ReplayTimeline trades={trades} />}
            {currentView === "gamification" && <Gamification trades={trades} metrics={metrics} />}
          </AnimatePresence>
        </div>
      </div>

      <AnimatePresence>
        {showLogModal && (
          <div className="fixed inset-0 bg-black/90 z-[100] flex items-center justify-center p-6" onClick={() => setShowLogModal(false)}>
            <div className="card p-8 rounded-3xl w-full max-w-2xl" onClick={e => e.stopPropagation()}>
              <TradeLogForm onSuccess={() => { setShowLogModal(false); setCurrentView("dashboard"); }} />
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
