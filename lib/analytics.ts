import { Trade } from "./types";

interface PerformanceMetrics {
  totalTrades: number;
  winRate: number;
  profitFactor: number;
  expectancy: number;
  averageWin: number;
  averageLoss: number;
  maxDrawdown: number;
  currentStreak: number;
  bestStreak: number;
  worstStreak: number;
}

export function calculateMetrics(trades: Trade[]): PerformanceMetrics {
  if (trades.length === 0) {
    return {
      totalTrades: 0,
      winRate: 0,
      profitFactor: 0,
      expectancy: 0,
      averageWin: 0,
      averageLoss: 0,
      maxDrawdown: 0,
      currentStreak: 0,
      bestStreak: 0,
      worstStreak: 0,
    };
  }

  const sortedTrades = [...trades].sort(
    (a, b) => new Date(a.entryTime).getTime() - new Date(b.entryTime).getTime()
  );

  let wins = 0;
  let totalWinPnl = 0;
  let totalLossPnl = 0;
  let profitFactorNum = 0;
  let profitFactorDen = 0;

  let peak = 0;
  let maxDD = 0;
  let runningPnl = 0;

  let currentStreak = 0;
  let bestStreak = 0;
  let worstStreak = 0;
  let lastWasWin: boolean | null = null;

  sortedTrades.forEach((trade) => {
    runningPnl += trade.pnl;

    if (runningPnl > peak) peak = runningPnl;
    const dd = peak - runningPnl;
    if (dd > maxDD) maxDD = dd;

    const isWin = trade.pnl > 0;
    if (isWin) {
      wins++;
      totalWinPnl += trade.pnl;
      profitFactorNum += trade.pnl;

      if (lastWasWin === true) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
      if (currentStreak > bestStreak) bestStreak = currentStreak;
      lastWasWin = true;
    } else {
      totalLossPnl += Math.abs(trade.pnl);
      profitFactorDen += Math.abs(trade.pnl);

      if (lastWasWin === false) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }
      if (currentStreak > worstStreak) worstStreak = currentStreak;
      lastWasWin = false;
    }
  });

  const totalTrades = trades.length;
  const winRate = (wins / totalTrades) * 100;
  const profitFactor = profitFactorDen > 0 ? profitFactorNum / profitFactorDen : 0;
  const avgWin = wins > 0 ? totalWinPnl / wins : 0;
  const avgLoss = totalLossPnl > 0 ? totalLossPnl / (totalTrades - wins) : 0;
  const expectancy = (winRate / 100) * avgWin - ((100 - winRate) / 100) * avgLoss;

  return {
    totalTrades,
    winRate: Math.round(winRate * 10) / 10,
    profitFactor: Math.round(profitFactor * 100) / 100,
    expectancy: Math.round(expectancy * 100) / 100,
    averageWin: Math.round(avgWin * 100) / 100,
    averageLoss: Math.round(avgLoss * 100) / 100,
    maxDrawdown: Math.round(maxDD * 100) / 100,
    currentStreak,
    bestStreak,
    worstStreak,
  };
}

export function getTimeOfDayPerformance(trades: Trade[]) {
  // Simple bucket by hour of entry
  const buckets: Record<string, { count: number; pnl: number }> = {};

  trades.forEach((t) => {
    const hour = new Date(t.entryTime).getHours();
    const key = `${hour}:00`;
    if (!buckets[key]) buckets[key] = { count: 0, pnl: 0 };
    buckets[key].count++;
    buckets[key].pnl += t.pnl;
  });

  return Object.entries(buckets)
    .map(([time, data]) => ({
      time,
      count: data.count,
      avgPnl: data.count > 0 ? Math.round((data.pnl / data.count) * 100) / 100 : 0,
    }))
    .sort((a, b) => parseInt(a.time) - parseInt(b.time));
}

// Add more: sessionPerformance, emotionalStatePerformance, etc. as needed
