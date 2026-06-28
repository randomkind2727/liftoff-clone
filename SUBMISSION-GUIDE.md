# 📋 LIFTOFF CLONE — 8x Engineer Contest Submission

**Built by:** OWL (Owly) for Tanmay Wankhade
**Date:** June 28, 2026
**Contest:** Liftoff Clone — Gamified Workout Tracker

---

## ✅ WHAT'S DONE

1. **Full Next.js app built** — TypeScript, Tailwind, Zustand, Framer Motion, Recharts
2. **All core features implemented:**
   - Workout logging (type, duration, calories, notes)
   - XP system (duration×2 + calories×0.5)
   - Leveling (100 XP per level, progress bar)
   - Streak tracking (consecutive days)
   - 10 achievement badges (6 unlock with demo data)
   - 7-day progress area chart
   - Workout history with emoji indicators
   - Demo data loader for testing
3. **Beautiful dark theme UI** with purple/orange gradients and ambient glows
4. **Zero build errors** — compiles cleanly with Next.js 16 Turbopack
5. **Demo data** — 7 workouts across 7 days, 6 achievements unlocked
6. **AI logs** — Full conversation log ready for submission

---

## ⚠️ WHAT TANMAY NEEDS TO DO

### 1. Create GitHub Repo (REQUIRED)
- Go to https://github.com/new
- Name: `liftoff-clone`
- Make it **public**
- Don't add README or .gitignore (I already have them)

### 2. Deploy to Vercel (REQUIRED for live URL)
```bash
cd /home/random/liftoff-clone
vercel login   # if token expired
vercel --prod
```

### 3. Record Loom Walkthrough (REQUIRED by contest)
- Walk through the app: log a workout, view achievements, check progress chart
- Keep it 2-3 minutes
- Upload to Loom and grab the share link

### 4. Submit on 8xEngineer.com
- Go to https://8xengineer.com
- Find Liftoff Clone contest
- Submit: GitHub repo URL + Loom link + AI logs + Resume

---

## 🚀 TO RUN LOCALLY

```bash
cd /home/random/liftoff-clone
npm run dev
# Open http://localhost:3000
```

---

## 📸 APP STRUCTURE

```
src/
├── app/
│   ├── page.tsx          # Main dashboard
│   ├── layout.tsx        # Root layout
│   └── globals.css       # Global styles
├── components/
│   ├── WorkoutForm.tsx   # Modal form
│   ├── WorkoutHistory.tsx # History list + demo loader
│   ├── Achievements.tsx  # 10 badge grid
│   ├── ProgressChart.tsx  # 7-day area chart
│   └── StatsCard.tsx     # Stats cards
└── store/
    └── workoutStore.ts   # Zustand + persistence + logic
```

---

## 🎮 DEMO DATA (Load Demo button in History tab)

- Day 1: Running 30min (280 cal)
- Day 2: Weightlifting 45min (320 cal)
- Day 3: Yoga 60min (180 cal)
- Day 4: HIIT 25min (380 cal)
- Day 5: Cycling 40min (300 cal)
- Day 6: Swimming 35min (260 cal)
- Day 7: Running 20min (180 cal)

**Totals:** 1,500 calories, 7-day streak, Level 2+, 6 achievements unlocked
