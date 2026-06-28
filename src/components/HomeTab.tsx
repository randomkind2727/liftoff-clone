'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/store';
import { ChallengeCard } from '@/components/ChallengeCard';
import { Flame, Zap, Trophy, ChevronRight, Sparkles, Coins } from 'lucide-react';

export function HomeTab() {
  const { totalXP, level, streak, coins, workouts, setActiveTab, achievements } = useStore();

  const xpForNextLevel = level * 150;
  const currentLevelXP = totalXP - (level - 1) * 150;
  const progressPercent = Math.min((currentLevelXP / xpForNextLevel) * 100, 100);
  const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  const todayWorkouts = workouts.filter(w => {
    const d = new Date(w.date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });
  const todayCalories = todayWorkouts.reduce((s, w) => s + w.calories, 0);

  return (
    <div className="px-5 space-y-6 tab-enter">
      {/* Header — minimal */}
      <div className="flex items-center justify-between pt-1">
        <h1 className="text-2xl font-black gradient-text">Liftoff</h1>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
            <Flame className="w-4 h-4 text-orange-400" />
            <span className="text-sm font-bold">{streak}</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
            <Coins className="w-4 h-4 text-yellow-400" />
            <span className="text-sm font-bold">{coins}</span>
          </div>
        </div>
      </div>

      {/* Level Card — the hero element */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-3xl p-6 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-bl from-purple-500/15 to-transparent rounded-bl-full" />
        <div className="absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr from-pink-500/10 to-transparent rounded-tr-full" />
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center glow-purple">
              <span className="text-2xl font-black">{level}</span>
            </div>
            <div className="flex-1">
              <p className="text-slate-400 text-sm">Level {level}</p>
              <p className="font-bold text-xl">{totalXP.toLocaleString()} XP</p>
            </div>
          </div>
          <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1.2, ease: 'easeOut' }}
              className="absolute h-full rounded-full progress-glow"
              style={{ background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #f97316)' }}
            />
          </div>
          <p className="text-xs text-slate-500 mt-2 text-right">{currentLevelXP}/{xpForNextLevel} XP</p>
        </div>
      </motion.div>

      {/* Quick Stats — clean row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="flex gap-3"
      >
        <div className="flex-1 glass rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-orange-400">{streak}</p>
          <p className="text-xs text-slate-500 mt-0.5">🔥 Streak</p>
        </div>
        <div className="flex-1 glass rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-purple-400">{totalCalories.toLocaleString()}</p>
          <p className="text-xs text-slate-500 mt-0.5">Calories</p>
        </div>
        <div className="flex-1 glass rounded-2xl p-4 text-center">
          <p className="text-2xl font-black text-cyan-400">{unlockedAchievements}</p>
          <p className="text-xs text-slate-500 mt-0.5">Badges</p>
        </div>
      </motion.div>

      {/* Today — single clean card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-5"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold">Today</h3>
          <span className="text-xs text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="flex items-center gap-6">
          <div>
            <p className="text-xl font-black">{todayCalories}</p>
            <p className="text-xs text-slate-500">cal burned</p>
          </div>
          <div className="h-8 w-px bg-slate-700" />
          <div>
            <p className="text-xl font-black">{todayWorkouts.length}</p>
            <p className="text-xs text-slate-500">workouts</p>
          </div>
        </div>
        {todayWorkouts.length === 0 ? (
          <p className="text-xs text-purple-300 mt-3 py-2 px-3 rounded-lg bg-purple-500/10 text-center">
            🚀 Start your first workout today!
          </p>
        ) : (
          <p className="text-xs text-green-300 mt-3 py-2 px-3 rounded-lg bg-green-500/10 text-center">
            🔥 Keep it up — you&apos;re on fire!
          </p>
        )}
      </motion.div>

      {/* Challenges — just show 2, link to view all */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">Challenges</h3>
          <button className="text-xs text-purple-400 flex items-center gap-0.5">
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          <ChallengeCard id="ch1" />
          <ChallengeCard id="ch2" />
        </div>
      </motion.div>

      {/* Achievements — compact row */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl pb-4 pt-3 px-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">Achievements</h3>
          <button
            onClick={() => setActiveTab('profile')}
            className="text-xs text-purple-400"
          >
            {unlockedAchievements}/{achievements.length}
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1 -mx-1 px-1">
          {achievements.slice(0, 10).map((ach) => (
            <div
              key={ach.id}
              className={`flex-shrink-0 w-11 h-11 rounded-xl flex items-center justify-center text-lg transition ${
                ach.unlocked
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                  : 'bg-slate-800/50 border border-slate-700/30 opacity-30 grayscale'
              }`}
            >
              {ach.icon}
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
