'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/store';
import { ChevronRight, X, CheckCircle, Circle, Clock, Flame, Zap, Target, Medal, TrendingUp, Dumbbell } from 'lucide-react';

const goalIcons: Record<string, React.ComponentType<{ className?: string }>> = {
  workouts: Dumbbell,
  calories: Flame,
  minutes: Clock,
  xp: Zap,
};

export function WeeklyGoalsCard({ onDismiss }: { onDismiss: () => void }) {
  const { weeklyGoals, updateWeeklyGoals } = useStore();
  
  if (weeklyGoals.length === 0) {
    updateWeeklyGoals();
  }

  const goals = weeklyGoals;
  const totalProgress = goals.length > 0 
    ? Math.round(goals.reduce((sum, g) => sum + Math.min((g.current / g.target) * 100, 100), 0) / goals.length)
    : 0;

  return (
    <motion.div
      initial={{ opacity: 0, height: 0 }}
      animate={{ opacity: 1, height: 'auto' }}
      exit={{ opacity: 0, height: 0 }}
      className="glass-strong rounded-2xl p-4 overflow-hidden"
    >
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-2">
          <Target className="w-5 h-5 text-purple-400" />
          <h3 className="font-bold">Weekly Goals</h3>
        </div>
        <button onClick={onDismiss} className="text-slate-500 hover:text-slate-300 p-1">
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Overall Progress Ring */}
      <div className="flex items-center gap-4 mb-4">
        <div className="relative w-16 h-16">
          <svg className="w-full h-full transform -rotate-90">
            <circle cx="28" cy="28" r="24" fill="none" stroke="#1e293b" strokeWidth="4" />
            <motion.circle
              cx="28" cy="28" r="24" fill="none" stroke="url(#progressGradient)" strokeWidth="4" strokeLinecap="round"
              strokeDasharray={150.8}
              initial={{ strokeDashoffset: 150.8 }}
              animate={{ strokeDashoffset: 150.8 - (totalProgress / 100) * 150.8 }}
              transition={{ duration: 1, ease: 'easeOut' }}
            />
            <defs>
              <linearGradient id="progressGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#8b5cf6" />
                <stop offset="100%" stopColor="#ec4899" />
              </linearGradient>
            </defs>
          </svg>
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="text-lg font-black">{totalProgress}%</span>
          </div>
        </div>
        <div className="flex-1">
          <p className="text-sm text-slate-400">Weekly Progress</p>
          <p className="text-xl font-black gradient-text">
            {goals.filter(g => g.completed).length}/{goals.length} Complete
          </p>
        </div>
      </div>

      {/* Individual Goals */}
      <div className="space-y-2">
        {goals.map((goal) => {
          const progress = Math.min((goal.current / goal.target) * 100, 100);
          const Icon = goalIcons[goal.type] || Target;
          
          return (
            <motion.div
              key={goal.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3 }}
              className={`glass rounded-xl p-3 ${goal.completed ? 'border-green-500/30' : ''}`}
            >
              <div className="flex items-center gap-3 mb-2">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center" style={{ background: `rgba(139, 92, 246, 0.15)` }}>
                  <Icon className="w-4 h-4 text-purple-400" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm truncate">{getGoalTitle(goal)}</p>
                  <p className="text-xs text-slate-500">{getGoalUnit(goal)}</p>
                </div>
              </div>
              <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${progress}%` }}
                  transition={{ duration: 0.8, ease: 'easeOut' }}
                  className={`absolute h-full rounded-full ${goal.completed ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'}`}
                />
              </div>
              <div className="flex justify-between mt-1">
                <p className="text-xs text-slate-500">{goal.current}/{goal.target}</p>
                <p className="text-xs text-slate-500">{Math.round(progress)}%</p>
              </div>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}

function getGoalTitle(goal: { type: string; target: number }) {
  const titles: Record<string, string> = {
    workouts: `${goal.target} Workouts`,
    calories: `${goal.target.toLocaleString()} Calories`,
    minutes: `${goal.target} Minutes`,
    xp: `${goal.target.toLocaleString()} XP`,
  };
  return titles[goal.type] || 'Goal';
}

function getGoalUnit(goal: { type: string }) {
  const units: Record<string, string> = {
    workouts: 'workouts this week',
    calories: 'cal burned this week',
    minutes: 'min exercised this week',
    xp: 'XP earned this week',
  };
  return units[goal.type] || '';
}