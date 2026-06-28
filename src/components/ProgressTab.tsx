'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/store';
import { AreaChart, Area, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Calendar, Target, Award } from 'lucide-react';

export function ProgressTab() {
  const { workouts, bodyMetrics, achievements } = useStore();

  const last14Days = Array.from({ length: 14 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (13 - i));
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const chartData = last14Days.map((date) => {
    const dayWorkouts = workouts.filter((w) => {
      const wd = new Date(w.date);
      wd.setHours(0, 0, 0, 0);
      return wd.getTime() === date.getTime();
    });
    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      xp: dayWorkouts.reduce((sum, w) => sum + w.xpEarned, 0),
      calories: dayWorkouts.reduce((sum, w) => sum + w.calories, 0),
      duration: dayWorkouts.reduce((sum, w) => sum + w.duration, 0),
      workouts: dayWorkouts.length,
    };
  });

  const workoutTypeData = Array.from(new Set(workouts.map(w => w.type))).map(type => ({
    name: type,
    value: workouts.filter(w => w.type === type).length,
  }));

  const COLORS = ['#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#10b981', '#eab308'];

  const totalCalories = workouts.reduce((s, w) => s + w.calories, 0);
  const totalMinutes = workouts.reduce((s, w) => s + w.duration, 0);
  const avgDuration = workouts.length > 0 ? Math.round(totalMinutes / workouts.length) : 0;
  const unlockedAchievements = achievements.filter(a => a.unlocked).length;

  return (
    <div className="px-4 pt-2 space-y-5 tab-enter">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-black gradient-text">Progress</h2>
        <p className="text-slate-500 text-xs mt-1">Your fitness analytics 📊</p>
      </div>

      {/* Summary Cards */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid grid-cols-2 gap-3"
      >
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <TrendingUp className="w-4 h-4 text-purple-400" />
            <span className="text-xs text-slate-400">Total XP</span>
          </div>
          <p className="text-2xl font-black">{workouts.reduce((s, w) => s + w.xpEarned, 0).toLocaleString()}</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-4 h-4 text-orange-400" />
            <span className="text-xs text-slate-400">Total Time</span>
          </div>
          <p className="text-2xl font-black">{Math.round(totalMinutes / 60)}h {totalMinutes % 60}m</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Target className="w-4 h-4 text-cyan-400" />
            <span className="text-xs text-slate-400">Avg Duration</span>
          </div>
          <p className="text-2xl font-black">{avgDuration}m</p>
        </div>
        <div className="glass rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <Award className="w-4 h-4 text-yellow-400" />
            <span className="text-xs text-slate-400">Badges</span>
          </div>
          <p className="text-2xl font-black">{unlockedAchievements}/{achievements.length}</p>
        </div>
      </motion.div>

      {/* XP Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-4"
      >
        <h3 className="font-bold text-sm mb-4">XP Over 14 Days</h3>
        <div className="h-44">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="progressGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.4} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Area type="monotone" dataKey="xp" stroke="#8b5cf6" strokeWidth={2} fill="url(#progressGrad)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Workout Frequency */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-4"
      >
        <h3 className="font-bold text-sm mb-4">Workout Frequency</h3>
        <div className="h-36">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }}
              />
              <Bar dataKey="workouts" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </motion.div>

      {/* Workout Types Pie */}
      {workoutTypeData.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="glass rounded-2xl p-4"
        >
          <h3 className="font-bold text-sm mb-4">Workout Mix</h3>
          <div className="flex items-center gap-4">
            <div className="w-32 h-32">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie data={workoutTypeData} dataKey="value" cx="50%" cy="50%" innerRadius={30} outerRadius={55} paddingAngle={3}>
                    {workoutTypeData.map((_, i) => (
                      <Cell key={i} fill={COLORS[i % COLORS.length]} />
                    ))}
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
            </div>
            <div className="flex-1 space-y-1.5">
              {workoutTypeData.map((entry, i) => (
                <div key={entry.name} className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i % COLORS.length] }} />
                  <span className="text-xs text-slate-300 flex-1">{entry.name}</span>
                  <span className="text-xs text-slate-500">{entry.value}</span>
                </div>
              ))}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
