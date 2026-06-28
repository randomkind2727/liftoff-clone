# 🚀 Liftoff Clone — Gamified Workout Tracker

**8x Engineer Contest Submission**

A full-stack gamified workout tracker built with Next.js 16, TypeScript, Tailwind CSS, and Framer Motion. Track workouts, earn XP, level up, and unlock achievements.

## 🎯 Product Decisions

### Why This Stack?
- **Next.js 16 + Turbopack**: Fastest React framework with App Router for production-grade apps
- **Tailwind CSS**: Utility-first styling for rapid UI development with consistent design tokens
- **Zustand**: Lightweight state management with built-in persistence (no backend needed)
- **Framer Motion**: Smooth animations that make the app feel premium
- **Recharts**: Beautiful, responsive charts for progress visualization

### Gamification Design
- **XP System**: Earn XP based on workout duration (2 XP/min) and calories (0.5 XP/cal)
- **Leveling**: Every 100 XP = 1 level, with visual progress bar
- **Streaks**: Consecutive day tracking with fire emoji indicators
- **Achievements**: 10 unlockable badges for various milestones
- **Visual Feedback**: Animated transitions on every interaction

### UX Decisions
- **Dark theme with purple/orange gradient**: Premium fitness app aesthetic
- **Floating Action Button**: Quick workout logging from any screen
- **Modal form with type selector**: Fast entry with visual workout type picker
- **7-day progress chart**: Immediate visual feedback on consistency
- **Responsive grid layout**: Works on mobile and desktop

## 🏗️ Architecture

```
src/
├── app/
│   ├── page.tsx          # Main dashboard
│   ├── layout.tsx        # Root layout with metadata
│   └── globals.css       # Global styles
├── components/
│   ├── WorkoutForm.tsx   # Modal form for logging workouts
│   ├── WorkoutHistory.tsx # Scrollable list of past workouts
│   ├── Achievements.tsx  # Badge grid with unlock states
│   ├── ProgressChart.tsx  # 7-day XP area chart
│   └── StatsCard.tsx     # Reusable stat display cards
└── store/
    └── workoutStore.ts   # Zustand store with persistence
```

## 🚀 Quick Start

```bash
git clone https://github.com/randomkind2727/liftoff-clone.git
cd liftoff-clone
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📊 Features

- ✅ Log workouts (type, duration, calories, notes)
- ✅ XP & leveling system
- ✅ Streak tracking
- ✅ 10 achievement badges
- ✅ 7-day progress chart
- ✅ Workout history with emoji indicators
- ✅ Persistent data (localStorage)
- ✅ Animated UI with Framer Motion
- ✅ Fully responsive design
- ✅ Dark theme with gradient accents

## 🎮 How It Works

1. **Log a workout** — Tap the + button, select type, enter duration & calories
2. **Earn XP** — XP = duration×2 + calories×0.5
3. **Level up** — Every 100 XP advances you one level
4. **Build streaks** — Work out consecutive days to grow your streak
5. **Unlock achievements** — Hit milestones to earn badges
6. **Track progress** — View your 7-day XP chart and stats

## 🛠️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 16 (App Router + Turbopack) |
| Language | TypeScript |
| Styling | Tailwind CSS |
| State | Zustand (with persist middleware) |
| Charts | Recharts |
| Animations | Framer Motion |
| Icons | Lucide React |

## 📝 AI Logs

This project was built entirely by OWL (AI agent) using Claude Code. The full conversation log is available in `ai-logs.md`.

## 📄 License

MIT License — Built for 8x Engineer contest.
