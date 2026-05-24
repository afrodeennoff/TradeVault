"use client";

import React, { useState } from "react";
import { toast } from "sonner";
import { useTradeStore } from "@/store/tradeStore";
import { TradeInput, EmotionalState, Direction, Market, Session } from "@/lib/types";

export default function TradeLogForm({ onSuccess }: { onSuccess?: () => void }) {
  const addTrade = useTradeStore((state) => state.addTrade);

  const [form, setForm] = useState<Partial<TradeInput>>({
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

  const update = (field: keyof TradeInput, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!form.pair || !form.entryPrice || !form.stopLoss || !form.takeProfit) {
      toast.error("Missing required fields");
      return;
    }

    addTrade(form as TradeInput);
    toast.success("Trade logged successfully");

    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="flex justify-between items-center">
        <div className="text-2xl font-semibold tracking-tight">Log New Execution</div>
      </div>

      <div>
        <div className="text-xs tracking-[2px] text-[#A1A1AA] mb-3">BASIC DATA</div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <input value={form.pair} onChange={(e) => update("pair", e.target.value.toUpperCase())} placeholder="PAIR" className="rounded-2xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]" required />
          <select value={form.market} onChange={(e) => update("market", e.target.value as Market)} className="rounded-2xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]">
            {["FOREX", "CRYPTO", "INDICES", "COMMODITIES", "STOCKS"].map((m) => (<option key={m} value={m}>{m}</option>))}
          </select>
          <select value={form.direction} onChange={(e) => update("direction", e.target.value as Direction)} className="rounded-2xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]">
            <option value="LONG">LONG</option><option value="SHORT">SHORT</option>
          </select>
          <select value={form.session} onChange={(e) => update("session", e.target.value as Session)} className="rounded-2xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]">
            {["ASIAN", "LONDON", "NEW_YORK", "OVERLAP"].map((s) => (<option key={s} value={s}>{s}</option>))}
          </select>
        </div>
      </div>

      <div>
        <div className="text-xs tracking-[2px] text-[#A1A1AA] mb-3">PRICES & RISK</div>
        <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
          {["entryPrice", "stopLoss", "takeProfit", "riskPercent", "leverage"].map((field) => (
            <div key={field}>
              <div className="text-xs text-[#A1A1AA] mb-1 capitalize">{field.replace(/([A-Z])/g, ' $1')}</div>
              <input type="number" step="0.01" value={(form as any)[field] || 0} onChange={(e) => update(field as any, parseFloat(e.target.value) || 0)} className="w-full rounded-2xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F] font-mono" />
            </div>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="text-xs tracking-[2px] text-[#A1A1AA] mb-3">STRATEGY / ICT</div>
          <div className="space-y-3">
            {["setupType", "marketStructure", "liquidityConcepts", "timeframeAlignment"].map((f) => (
              <input key={f} value={(form as any)[f] || ""} onChange={(e) => update(f as any, e.target.value)} placeholder={f} className="w-full rounded-2xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]" />
            ))}
            <textarea value={form.biasReasoning || ""} onChange={(e) => update("biasReasoning", e.target.value)} placeholder="Bias Reasoning" rows={2} className="w-full rounded-3xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]" />
          </div>
        </div>

        <div>
          <div className="text-xs tracking-[2px] text-[#A1A1AA] mb-3">PSYCHOLOGY</div>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="text-xs text-[#A1A1AA] mb-1">Confidence</div>
                <input type="number" min="1" max="10" value={form.confidenceLevel || 7} onChange={(e) => update("confidenceLevel", parseInt(e.target.value))} className="w-full rounded-2xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]" />
              </div>
              <div>
                <div className="text-xs text-[#A1A1AA] mb-1">Discipline</div>
                <input type="number" min="1" max="10" value={form.disciplineScore || 8} onChange={(e) => update("disciplineScore", parseInt(e.target.value))} className="w-full rounded-2xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]" />
              </div>
            </div>

            <select value={form.emotionalState} onChange={(e) => update("emotionalState", e.target.value as EmotionalState)} className="w-full rounded-2xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]">
              {["CALM", "FOCUSED", "ANXIOUS", "FOMO", "REVENGE", "OVERCONFIDENT", "TIRED"].map((s) => (<option key={s} value={s}>{s}</option>))}
            </select>

            <div className="flex gap-6 text-sm pt-1">
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.fomoDetected} onChange={(e) => update("fomoDetected", e.target.checked)} className="accent-emerald-500" /> FOMO
              </label>
              <label className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" checked={form.revengeTrade} onChange={(e) => update("revengeTrade", e.target.checked)} className="accent-emerald-500" /> Revenge
              </label>
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="text-xs tracking-[2px] text-[#A1A1AA] mb-2">NOTES</div>
        <textarea 
          value={form.notes || ""} 
          onChange={(e) => update("notes", e.target.value)} 
          placeholder="What went well? What will you improve?" 
          rows={4} 
          className="w-full rounded-3xl px-4 py-3 text-sm bg-[#0F0F0F] border border-[#1F1F1F]" 
        />
      </div>

      <div className="flex justify-end pt-4">
        <button type="submit" className="btn-primary px-10 py-3.5 rounded-2xl font-semibold text-sm">SAVE TRADE</button>
      </div>
    </form>
  );
}
