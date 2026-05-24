# TradeVault

> The most intelligent trading journal platform.
> A complete trader evolution system that transforms impulsive traders into disciplined, data-driven operators.

**Built for serious prop traders, quant minds, and those obsessed with edge.**

[![Next.js](https://img.shields.io/badge/Next.js-15-black?logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.8-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4.1-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Prisma](https://img.shields.io/badge/Prisma-6.8-2D3748?logo=prisma)](https://www.prisma.io/)

---

## Mission

TradeVault is not another logging app. It is a **complete trader evolution system**.

It combines:
- Institutional-grade trade tracking
- Deep behavioral psychology analysis
- AI-powered execution coach
- Visual replay & mistake playback
- Gamified discipline building
- Statistical edge detection

The goal: Turn every trade into data that makes you *unrecognizable* as a trader in 90 days.

---

## Core Philosophy

| From | To |
|------|-----|
| Impulsive | Disciplined |
| Emotional | Data-driven |
| Revenge trading | Process-oriented |
| Inconsistent | Streak machine |
| Hope & fear | Edge & probability |

---

## Key Features (Current + Roadmap)

### Phase 1 (Shipped in v0.1)
- ✅ Modern institutional dark UI (glassmorphism + precision spacing)
- ✅ Comprehensive trade entry (Basic + Strategy + Psychology + Media)
- ✅ Local-first persistence (localStorage + future Prisma sync)
- ✅ Real-time dashboard with KPIs, equity curve, recent trades
- ✅ Basic analytics engine (Win rate, Expectancy, Profit Factor, Streaks, Time-of-day)
- ✅ AI Trade Coach (rule-based + ready for OpenAI)
- ✅ Beautiful form validation with Zod
- ✅ Smooth Framer Motion animations
- ✅ Mobile responsive

### Phase 2 (Next)
- Prisma + PostgreSQL (Neon / Supabase / self-hosted)
- User authentication (Clerk or NextAuth v5)
- Screenshot upload & markup ( Vercel Blob + excalidraw or tldraw)
- Full AI Coach with vector memory (OpenAI + embeddings)
- Advanced behavioral clustering
- Trade replay timeline

### Phase 3
- Gamification engine (levels, badges, consistency score)
- Multi-account support (prop firms)
- Backtesting integration
- Export to CSV / Notion / TradingView
- Mobile app (React Native / Tauri)

---

## Tech Stack

**Frontend**
- Next.js 15 (App Router)
- React 19 + TypeScript
- Tailwind CSS 4 + shadcn/ui aesthetic
- Framer Motion
- Lucide icons

**Backend & Data**
- Prisma ORM
- PostgreSQL
- Server Actions + Zod validation

**Charts & Visualization**
- TradingView Lightweight Charts (or custom SVG equity)
- Recharts / custom canvas for performance visuals

**AI Layer**
- OpenAI GPT-4o / o3 for coach
- Future: Local models via Ollama (for privacy)

**Deployment**
- Vercel (frontend + serverless)
- Docker + GitHub Actions for self-host

---

## Getting Started (Zero Error Setup)

```bash
# 1. Clone the repo
git clone https://github.com/afrodeennoff/TradeVault.git
cd TradeVault

# 2. Install dependencies
npm install

# 3. Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) — you will see the elite trading command center.

**Add your OpenAI key later** in `.env.local` for full AI Coach:

```env
OPENAI_API_KEY=sk-...
```

---

## Project Structure

```
TradeVault/
├── app/
│   ├── layout.tsx          # Root layout + providers
│   ├── page.tsx            # Main dashboard shell
│   ├── globals.css         # Institutional dark theme
│   └── (future routes: /trades, /analytics, /coach)
├── components/
│   ├── ui/                 # Reusable shadcn-style primitives
│   ├── TradeForm.tsx
│   ├── TradeTable.tsx
│   ├── AnalyticsDashboard.tsx
│   ├── AICoach.tsx
│   ├── Sidebar.tsx
│   └── EquityCurve.tsx
├── lib/
│   ├── utils.ts            # cn() helper
│   ├── types.ts            # Trade, Psychology interfaces
│   └── analytics.ts        # Core calculation engine
├── prisma/
│   └── schema.prisma       # (Phase 2)
├── public/
├── .env.example
├── package.json
├── tailwind.config.ts
├── tsconfig.json
└── README.md
```

---

## Design Language

- **Background**: Deep black (#0A0A0A)
- **Cards**: Zinc-900 with subtle glass / border
- **Accent**: Emerald-500 (profit) / Red-500 (loss) / Amber-400 (warning)
- **Typography**: Inter + system-ui for clarity
- **Spacing**: Generous but precise (institutional, never cramped)
- **Motion**: Subtle, purposeful (Framer Motion)
- **No neon. No meme. No retail cringe.**

---

## Why TradeVault Wins

Most journals are glorified spreadsheets.
TradeVault is a **performance psychologist + quant analyst + execution coach** in one interface.

Every field you fill trains the system to understand *you*.
Every review makes you better.

This is how professionals actually improve.

---

## Contribution

This is an open-source mission. Pull requests that improve the psychology engine, analytics depth, or UI precision are welcome.

**Before contributing**: Read the vision in this README. We build only what is durable and perfect.

---

## License

MIT © afrodeennoff — Built for the Legion of serious traders.

---

*"The goal is not to trade more. The goal is to become the trader who only takes the highest probability setups — and executes them with machine-like consistency."*
