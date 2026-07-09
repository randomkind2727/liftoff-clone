'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/store';
import { ChallengeCard } from '@/components/ChallengeCard';
import { WeeklyGoalsCard } from '@/components/WeeklyGoalsCard';
import { PRTrackerCard } from '@/components/PRTrackerCard';
import { Flame, Coins, ChevronRight, Sparkles, Trophy, Target } from 'lucide-react';
import { useEffect, useState } from 'react';
import { triggerHaptic } from '@/lib/haptics';
import { playSound } from '@/lib/sound';

export function HomeTab() {
  const { totalXP, level, streak, coins, workouts, setActiveTab, achievements, checkWeeklyGoals } = useStore();
  const [showGoals, setShowGoals] = useState(true);

  const xpForNextLevel = level * 150;
  const currentLevelXP = totalXP - (level - 1) * 150;
  const progressPercent = Math.min((currentLevelXP / xpForNextLevel) * 100, 100);
  const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
  const unlocked = achievements.filter(a => a.unlocked).length;

  const todayWorkouts = workouts.filter(w => new Date(w.date).toDateString() === new Date().toDateString());
  const todayCalories = todayWorkouts.reduce((s, w) => s + w.calories, 0);

  useEffect(() => { checkWeeklyGoals(); }, [workouts.length, checkWeeklyGoals]);

  const streakMsg = streak === 0 ? "Start your journey today! 🚀"
    : streak === 1 ? "Day 1 complete. Keep going! 💪"
    : streak < 7 ? `${streak} days strong! 🔥`
    : streak < 30 ? `${streak} days — unstoppable! ⚡`
    : `${streak} days — LEGENDARY! 👑`;

  return (
    <div className="px-5 space-y-5 tab-enter pb-28">
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-2xl font-black gradient-text">Liftoff</h1>
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
            <Flame className="w-4 h-4 text-orange-400" /><span className="text-sm font-bold">{streak}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
            <Coins className="w-4 h-4 text-yellow-400" /><span className="text-sm font-bold">{coins}</span>
          </div>
        </div>
      </div>

      {/* Level hero */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-500/15 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-tr-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 3, repeat: Infinity }}
              className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center glow-purple">
              <span className="text-2xl font-black">{level}</span>
            </motion.div>
            <div className="flex-1">
              <p className="text-slate-400 text-sm">Level {level}</p>
              <p className="font-bold text-xl">{totalXP.toLocaleString()} XP</p>
            </div>
          </div>
          <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
            <motion.div initial={{ width: 0 }} animate={{ width: `${progressPercent}%` }} transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute h-full rounded-full" style={{ background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #f97316)' }} />
          </div>
          <p className="text-xs text-slate-500 mt-2 text-right">{currentLevelXP}/{xpForNextLevel} XP to L{level + 1}</p>
        </div>
      </motion.div>

      {/* Stats */}
      <div className="flex gap-3">
        {[{ v: streak, l: '🔥 Streak', c: 'text-orange-400' }, { v: totalCalories.toLocaleString(), l: 'Calories', c: 'text-purple-400' }, { v: unlocked, l: 'Badges', c: 'text-cyan-400' }].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 + i * 0.05 }}
            className="flex-1 glass rounded-2xl p-4 text-center">
            <p className={`text-2xl font-black ${s.c}`}>{s.v}</p>
            <p className="text-xs text-slate-500 mt-0.5">{s.l}</p>
          </motion.div>
        ))}
      </div>

      {/* Today */}
      <div className="glass rounded-2xl p-5">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Today</h3>
          <span className="text-xs text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-6">
          <div><p className="text-xl font-black">{todayCalories}</p><p className="text-xs text-slate-500">cal burned</p></div>
          <div className="h-8 w-px bg-slate-700" />
          <div><p className="text-xl font-black">{todayWorkouts.length}</p><p className="text-xs text-slate-500">workouts</p></div>
        </div>
        <p className={`text-xs mt-3 py-2 px-3 rounded-lg text-center ${todayWorkouts.length === 0 ? 'text-purple-300 bg-purple-500/10' : 'text-green-300 bg-green-500/10'}`}>
          {todayWorkouts.length === 0 ? '🚀 Start your first workout today!' : `🔥 ${streakMsg}`}
        </p>
      </div>

      <AnimatePresence>{showGoals && <WeeklyGoalsCard onDismiss={() => setShowGoals(false)} />}</AnimatePresence>
      <PRTrackerCard />

      {/* Challenges */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">Challenges</h3>
          <button onClick={() => { triggerHaptic('light'); playSound('tap'); setActiveTab('social'); }} className="text-xs text-purple-400 flex items-center gap-0.5">
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          <ChallengeCard id="ch1" />
          <ChallengeCard id="ch2" />
        </div>
      </div>

      {/* Achievements */}
      <div className="glass rounded-2xl pb-4 pt-3 px-4">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">Achievements</h3>
          <button onClick={() => setActiveTab('profile')} className="text-xs text-purple-400">{unlocked}/{achievements.length}</button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {achievements.slice(0, 10).map((ach) => (
            <div key={ach.id} className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg transition-all ${ach.unlocked ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30' : 'bg-slate-800/50 border border-slate-700/30 opacity-30 grayscale'}`}>
              {ach.icon}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}