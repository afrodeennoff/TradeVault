export type Direction = "LONG" | "SHORT";
export type Market = "FOREX" | "CRYPTO" | "INDICES" | "COMMODITIES" | "STOCKS";
export type Session = "ASIAN" | "LONDON" | "NEW_YORK" | "OVERLAP";

export type EmotionalState =
  | "CALM"
  | "FOCUSED"
  | "ANXIOUS"
  | "FOMO"
  | "REVENGE"
  | "OVERCONFIDENT"
  | "TIRED"
  | "DISTRACTED";

export interface Trade {
  id: string;
  pair: string;
  market: Market;
  direction: Direction;
  entryTime: string; // ISO
  exitTime?: string;
  entryPrice: number;
  stopLoss: number;
  takeProfit: number;
  riskPercent: number;
  positionSize: number;
  leverage: number;
  session: Session;
  // Strategy
  setupType: string;
  marketStructure: string;
  liquidityConcepts: string;
  confirmationModel: string;
  timeframeAlignment: string;
  biasReasoning: string;
  // Psychology
  confidenceLevel: number; // 1-10
  emotionalState: EmotionalState;
  disciplineScore: number; // 1-10
  fomoDetected: boolean;
  revengeTrade: boolean;
  patienceRating: number; // 1-10
  // Outcome
  pnl: number; // in account currency or %
  rrAchieved: number;
  exitReason?: string;
  notes: string;
  createdAt: string;
}

export interface TradeInput extends Omit<Trade, "id" | "createdAt" | "pnl" | "rrAchieved"> {
  exitTime?: string;
  exitReason?: string;
}

// For future AI

export interface AIInsight {
  type: "MISTAKE" | "STRENGTH" | "RECOMMENDATION";
  message: string;
  severity: "low" | "medium" | "high";
}
