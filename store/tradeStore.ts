import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Trade, TradeInput } from '@/lib/types';

interface TradeStore {
  trades: Trade[];
  addTrade: (input: TradeInput) => void;
  updateTrade: (id: string, updates: Partial<Trade>) => void;
  deleteTrade: (id: string) => void;
  clearAll: () => void;

  // Analytics cache (will be expanded)
  lastCalculatedAt: number | null;
}

export const useTradeStore = create<TradeStore>()(
  persist(
    (set, get) => ({
      trades: [],
      lastCalculatedAt: null,

      addTrade: (input) => {
        const newTrade: Trade = {
          ...input,
          id: 't' + Date.now(),
          createdAt: new Date().toISOString(),
          pnl: calculatePnL(input),
          rrAchieved: calculateRR(input),
        };

        set((state) => ({
          trades: [newTrade, ...state.trades],
          lastCalculatedAt: Date.now(),
        }));
      },

      updateTrade: (id, updates) => {
        set((state) => ({
          trades: state.trades.map((t) => (t.id === id ? { ...t, ...updates } : t)),
          lastCalculatedAt: Date.now(),
        }));
      },

      deleteTrade: (id) => {
        set((state) => ({
          trades: state.trades.filter((t) => t.id !== id),
          lastCalculatedAt: Date.now(),
        }));
      },

      clearAll: () => set({ trades: [], lastCalculatedAt: Date.now() }),
    }),
    {
      name: 'tradevault-store-v1',
      partialize: (state) => ({ trades: state.trades }),
    }
  )
);

function calculateRR(input: TradeInput): number {
  const risk = Math.abs(input.entryPrice - input.stopLoss);
  const reward = Math.abs(input.takeProfit - input.entryPrice);
  return risk > 0 ? Math.round((reward / risk) * 10) / 10 : 0;
}

function calculatePnL(input: TradeInput): number {
  const riskAmount = (input.riskPercent / 100) * 100000;
  const rr = calculateRR(input);
  const dir = input.direction === 'LONG' ? 1 : -1;
  const tpDir = input.takeProfit > input.entryPrice ? 1 : -1;
  return riskAmount * rr * dir * tpDir;
}
