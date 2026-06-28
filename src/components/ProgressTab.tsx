'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/store';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { TrendingUp, Calendar } from 'lucide-react';

export function ProgressTab() {
  const { workouts } = useStore();

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
      count: dayWorkouts.length,
    };
  });

  const totalXP = workouts.reduce((s, w) => s + w.xpEarned, 0);
  const totalCal = workouts.reduce((s, w) => s + w.calories, 0);
  const totalMin = workouts.reduce((s, w) => s + w.duration, 0);

  return (
    <div className="px-5 pt-2 space-y-5 tab-enter">
      <div className="text-center">
        <h2 className="text-xl font-black gradient-text">Progress</h2>
        <p className="text-slate-500 text-xs mt-1">Your fitness analytics</p>
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        <div className="glass rounded-2xl p-3 text-center">
          <TrendingUp className="w-4 h-4 text-purple-400 mx-auto mb-1" />
          <p className="text-lg font-black">{totalXP.toLocaleString()}</p>
          <p className="text-[10px] text-slate-500">XP</p>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <Calendar className="w-4 h-4 text-orange-400 mx-auto mb-1" />
          <p className="text-lg font-black">{Math.floor(totalMin / 60)}h{totalMin % 60}m</p>
          <p className="text-[10px] text-slate-500">Time</p>
        </div>
        <div className="glass rounded-2xl p-3 text-center">
          <span className="text-lg block mb-0.5">🔥</span>
          <p className="text-lg font-black">{totalCal.toLocaleString()}</p>
          <p className="text-[10px] text-slate-500">Calories</p>
        </div>
      </div>

      {/* XP Chart */}
      <div className="glass rounded-2xl p-4">
        <h3 className="font-bold text-sm mb-3">XP This Week</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={chartData}>
              <defs>
                <linearGradient id="pg" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0} />
                </linearGradient>
              </defs>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              <Area type="monotone" dataKey="xp" stroke="#8b5cf6" strokeWidth={2} fill="url(#pg)" />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Workout Frequency */}
      <div className="glass rounded-2xl p-4">
        <h3 className="font-bold text-sm mb-3">Workouts</h3>
        <div className="h-32">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 10 }} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
              <Bar dataKey="count" fill="#ec4899" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}
