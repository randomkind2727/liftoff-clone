'use client';

import { motion } from 'framer-motion';
import { useWorkoutStore } from '@/store/workoutStore';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, AreaChart, Area } from 'recharts';

export function ProgressChart() {
  const { workouts } = useWorkoutStore();

  // Group workouts by date for the chart
  const last7Days = Array.from({ length: 7 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() - (6 - i));
    date.setHours(0, 0, 0, 0);
    return date;
  });

  const chartData = last7Days.map((date) => {
    const dayWorkouts = workouts.filter((w) => {
      const wd = new Date(w.date);
      wd.setHours(0, 0, 0, 0);
      return wd.getTime() === date.getTime();
    });

    return {
      day: date.toLocaleDateString('en-US', { weekday: 'short' }),
      xp: dayWorkouts.reduce((sum, w) => sum + w.xpEarned, 0),
      calories: dayWorkouts.reduce((sum, w) => sum + w.calories, 0),
      workouts: dayWorkouts.length,
    };
  });

  const totalXP = workouts.reduce((sum, w) => sum + w.xpEarned, 0);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-white">Progress</h2>
        <div className="text-sm text-slate-400">Last 7 days</div>
      </div>

      {workouts.length === 0 ? (
        <div className="h-64 flex items-center justify-center">
          <p className="text-slate-500 text-center">
            Log your first workout to see your progress chart! 📊
          </p>
        </div>
      ) : (
        <>
          {/* Mini stats */}
          <div className="grid grid-cols-3 gap-3 mb-6">
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-purple-400">{totalXP}</p>
              <p className="text-xs text-slate-500">Total XP</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-orange-400">
                {workouts.reduce((s, w) => s + w.calories, 0)}
              </p>
              <p className="text-xs text-slate-500">Calories</p>
            </div>
            <div className="bg-slate-800/50 rounded-lg p-3 text-center">
              <p className="text-lg font-bold text-blue-400">{workouts.length}</p>
              <p className="text-xs text-slate-500">Workouts</p>
            </div>
          </div>

          {/* Chart */}
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData}>
                <defs>
                  <linearGradient id="xpGradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#a855f7" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="#a855f7" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis
                  dataKey="day"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#64748b', fontSize: 12 }}
                />
                <YAxis hide />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#1e293b',
                    border: '1px solid #334155',
                    borderRadius: '12px',
                    color: '#fff',
                  }}
                  labelStyle={{ color: '#94a3b8' }}
                />
                <Area
                  type="monotone"
                  dataKey="xp"
                  stroke="#a855f7"
                  strokeWidth={2}
                  fill="url(#xpGradient)"
                  name="XP Earned"
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </>
      )}
    </motion.div>
  );
}
