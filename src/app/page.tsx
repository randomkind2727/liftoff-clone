'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useWorkoutStore } from '@/store/workoutStore';
import { WorkoutForm } from '@/components/WorkoutForm';
import { StatsCard } from '@/components/StatsCard';
import { WorkoutHistory } from '@/components/WorkoutHistory';
import { Achievements } from '@/components/Achievements';
import { ProgressChart } from '@/components/ProgressChart';
import { Flame, Trophy, Zap, TrendingUp, Plus, X, Activity } from 'lucide-react';

export default function Home() {
  const [showForm, setShowForm] = useState(false);
  const { totalXP, level, streak, workouts, achievements } = useWorkoutStore();

  const xpForNextLevel = level * 100;
  const currentLevelXP = totalXP - (level - 1) * 100;
  const progressPercent = (currentLevelXP / xpForNextLevel) * 100;

  const unlockedAchievements = achievements.filter(a => a.unlocked).length;
  const totalCalories = workouts.reduce((sum, w) => sum + w.calories, 0);
  const totalMinutes = workouts.reduce((sum, w) => sum + w.duration, 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-950 text-white">
      {/* Ambient glow */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-purple-600/20 rounded-full blur-[150px]" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[500px] h-[500px] bg-orange-500/15 rounded-full blur-[150px]" />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 py-8">
        {/* Header */}
        <motion.header
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-12"
        >
          <div className="flex items-center justify-center gap-3 mb-4">
            <Activity className="w-10 h-10 text-orange-400" />
            <h1 className="text-5xl font-black tracking-tight bg-gradient-to-r from-orange-400 via-pink-400 to-purple-400 bg-clip-text text-transparent">
              Liftoff
            </h1>
          </div>
          <p className="text-slate-400 text-lg">Gamified Workout Tracker</p>

          {/* Level & XP Bar */}
          <div className="mt-6 max-w-md mx-auto">
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-bold text-purple-300">Level {level}</span>
              <span className="text-sm text-slate-400">{currentLevelXP}/{xpForNextLevel} XP</span>
            </div>
            <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
              <motion.div
                className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: `${progressPercent}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
              />
            </div>
          </div>
        </motion.header>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <StatsCard icon={<Flame className="w-5 h-5" />} label="Streak" value={`${streak} days`} color="orange" />
          <StatsCard icon={<Zap className="w-5 h-5" />} label="Total XP" value={totalXP.toLocaleString()} color="purple" />
          <StatsCard icon={<TrendingUp className="w-5 h-5" />} label="Workouts" value={workouts.length.toString()} color="blue" />
          <StatsCard icon={<Trophy className="w-5 h-5" />} label="Achievements" value={`${unlockedAchievements}/${achievements.length}`} color="yellow" />
        </div>

        {/* Main Content Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-8">
          {/* Chart */}
          <div className="md:col-span-2">
            <ProgressChart />
          </div>
          {/* Quick Stats */}
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.3 }}
              className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6"
            >
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">This Week</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Total Time</span>
                  <span className="font-bold text-white">{totalMinutes} min</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Calories Burned</span>
                  <span className="font-bold text-orange-400">{totalCalories.toLocaleString()}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-300">Avg per Workout</span>
                  <span className="font-bold text-blue-400">
                    {workouts.length > 0 ? Math.round(totalMinutes / workouts.length) : 0} min
                  </span>
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.4 }}
              className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6"
            >
              <h3 className="text-sm font-semibold text-slate-400 uppercase tracking-wider mb-4">Top Workouts</h3>
              <div className="space-y-2">
                {Array.from(new Set(workouts.map(w => w.type)))
                  .map(type => ({
                    type,
                    count: workouts.filter(w => w.type === type).length,
                  }))
                  .sort((a, b) => b.count - a.count)
                  .slice(0, 5)
                  .map(({ type, count }) => (
                    <div key={type} className="flex justify-between items-center">
                      <span className="text-slate-300 text-sm">{type}</span>
                      <div className="flex items-center gap-2">
                        <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                          <div
                            className="h-full bg-gradient-to-r from-purple-500 to-pink-500 rounded-full"
                            style={{ width: `${(count / workouts.length) * 100}%` }}
                          />
                        </div>
                        <span className="text-xs text-slate-400">{count}</span>
                      </div>
                    </div>
                  ))}
                {workouts.length === 0 && (
                  <p className="text-slate-500 text-sm text-center py-4">No workouts yet. Start lifting!</p>
                )}
              </div>
            </motion.div>
          </div>
        </div>

        {/* Achievements */}
        <Achievements />

        {/* Workout History */}
        <WorkoutHistory />

        {/* FAB */}
        <motion.button
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowForm(true)}
          className="fixed bottom-8 right-8 w-16 h-16 bg-gradient-to-r from-orange-500 to-pink-500 rounded-full shadow-lg shadow-orange-500/30 flex items-center justify-center z-50 hover:shadow-orange-500/50 transition-shadow"
        >
          <Plus className="w-7 h-7 text-white" />
        </motion.button>

        {/* Workout Form Modal */}
        <AnimatePresence>
          {showForm && <WorkoutForm onClose={() => setShowForm(false)} />}
        </AnimatePresence>
      </div>
    </div>
  );
}
