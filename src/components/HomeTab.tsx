'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/store';
import { ChallengeCard } from '@/components/ChallengeCard';
import { Flame, Zap, Trophy, ChevronRight, Sparkles, Coins } from 'lucide-react';

export function HomeTab() {
  const { totalXP, level, streak, coins, bestStreak, workouts, setActiveTab, achievements } = useStore();

  const xpForNextLevel = level * 150;
  const currentLevelXP = totalXP - (level - 1) * 150;
  const progressPercent = Math.min((currentLevelXP / xpForNextLevel) * 100, 100);
  const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  const todayWorkouts = workouts.filter(w => {
    const d = new Date(w.date);
    const today = new Date();
    return d.toDateString() === today.toDateString();
  });
  const todayCalories = todayWorkouts.reduce((s, w) => s + w.calories, 0);
  const todayMinutes = todayWorkouts.reduce((s, w) => s + w.duration, 0);

  return (
    <div className="px-4 space-y-5 tab-enter">
      {/* Header */}
      <div className="flex items-center justify-between pt-2">
        <div>
          <motion.h1
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="text-2xl font-black"
          >
            <span className="gradient-text">Liftoff</span>
            <Sparkles className="inline w-5 h-5 text-yellow-400 ml-1 -mt-1" />
          </motion.h1>
          <p className="text-slate-500 text-xs mt-0.5">Let&apos;s crush it today! 💪</p>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass"
        >
          <Coins className="w-4 h-4 text-yellow-400" />
          <span className="text-sm font-bold text-yellow-400">{coins}</span>
        </motion.div>
      </div>

      {/* Level Card */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass-strong rounded-3xl p-5 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-purple-500/20 to-transparent rounded-bl-full" />
        <div className="relative z-10">
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center glow-purple">
                <span className="text-xl font-black">{level}</span>
              </div>
              <div>
                <p className="text-sm text-slate-400">Level</p>
                <p className="font-bold text-lg">{totalXP.toLocaleString()} XP</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-xs text-slate-500">Next Level</p>
              <p className="text-sm font-semibold text-purple-400">{xpForNextLevel - currentLevelXP} XP to go</p>
            </div>
          </div>

          {/* XP Progress Bar */}
          <div className="relative h-3 bg-slate-800 rounded-full overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 1, ease: 'easeOut' }}
              className="absolute h-full rounded-full progress-glow"
              style={{ background: 'linear-gradient(90deg, #8b5cf6, #ec4899, #f97316)' }}
            />
            <div className="absolute inset-0 shimmer rounded-full" />
          </div>
          <p className="text-xs text-slate-500 mt-1.5 text-center">{currentLevelXP}/{xpForNextLevel} XP</p>
        </div>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="grid grid-cols-3 gap-3"
      >
        <div className="glass rounded-2xl p-3 text-center glow-orange">
          <Flame className="w-5 h-5 text-orange-400 mx-auto mb-1" />
          <p className="text-xl font-black">{streak}</p>
          <p className="text-xs text-slate-500">Streak</p>
        </div>
        <div className="glass rounded-2xl p-3 text-center glow-purple">
          <Zap className="w-5 h-5 text-purple-400 mx-auto mb-1" />
          <p className="text-xl font-black">{totalCalories.toLocaleString()}</p>
          <p className="text-xs text-slate-500">Calories</p>
        </div>
        <div className="glass rounded-2xl p-3 text-center glow-pink">
          <Trophy className="w-5 h-5 text-pink-400 mx-auto mb-1" />
          <p className="text-xl font-black">{totalMinutes}</p>
          <p className="text-xs text-slate-500">Minutes</p>
        </div>
      </motion.div>

      {/* Today's Summary */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">Today</h3>
          <span className="text-xs text-slate-500">{new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'short', day: 'numeric' })}</span>
        </div>
        <div className="grid grid-cols-2 gap-3">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-orange-500/20 flex items-center justify-center">
              <Flame className="w-4 h-4 text-orange-400" />
            </div>
            <div>
              <p className="font-bold text-sm">{todayCalories}</p>
              <p className="text-xs text-slate-500">cal burned</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-500/20 flex items-center justify-center">
              <Zap className="w-4 h-4 text-blue-400" />
            </div>
            <div>
              <p className="font-bold text-sm">{todayMinutes}m</p>
              <p className="text-xs text-slate-500">active</p>
            </div>
          </div>
        </div>

        {/* Motivational message */}
        {todayWorkouts.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 p-3 rounded-xl bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20"
          >
            <p className="text-xs text-center text-purple-300">
              🚀 Start your first workout today and keep your streak alive!
            </p>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="mt-3 p-3 rounded-xl bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20"
          >
            <p className="text-xs text-center text-green-300">
              🔥 {todayWorkouts.length} workout{todayWorkouts.length > 1 ? 's' : ''} done today! Keep it up!
            </p>
          </motion.div>
        )}
      </motion.div>

      {/* Challenges */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">Active Challenges</h3>
          <button className="text-xs text-purple-400 flex items-center gap-0.5">
            View all <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="space-y-2">
          <ChallengeCard id="ch1" />
          <ChallengeCard id="ch2" />
        </div>
      </motion.div>

      {/* Achievements Preview */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">Achievements</h3>
          <button
            onClick={() => setActiveTab('profile')}
            className="text-xs text-purple-400 flex items-center gap-0.5"
          >
            {unlockedAchievements}/{achievements.length} <ChevronRight className="w-3 h-3" />
          </button>
        </div>
        <div className="flex gap-2 overflow-x-auto pb-1">
          {achievements.slice(0, 8).map((ach) => (
            <div
              key={ach.id}
              className={`flex-shrink-0 w-12 h-12 rounded-xl flex items-center justify-center text-xl ${
                ach.unlocked
                  ? 'bg-gradient-to-br from-yellow-500/20 to-orange-500/20 border border-yellow-500/30'
                  : 'bg-slate-800/50 border border-slate-700/50 opacity-40 grayscale'
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
