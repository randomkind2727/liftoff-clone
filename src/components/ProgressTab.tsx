'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/store';
import { AreaChart, Area, XAxis, Tooltip, ResponsiveContainer, BarChart, Bar, PieChart, Pie, Cell, RadarChart, PolarGrid, PolarAngleAxis, Radar } from 'recharts';
import { TrendingUp, Calendar, Download, Trophy } from 'lucide-react';
import { useState } from 'react';

const RANGES = [
  { id: 'week', label: 'Week', days: 7 },
  { id: 'month', label: 'Month', days: 30 },
  { id: 'year', label: 'Year', days: 365 },
] as const;

const COLORS = ['#8b5cf6', '#ec4899', '#f97316', '#06b6d4', '#22c55e', '#eab308'];

export function ProgressTab() {
  const { workouts, personalRecords, totalXP } = useStore();
  const [range, setRange] = useState<typeof RANGES[number]['id']>('week');

  const days = RANGES.find(r => r.id === range)!.days;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - (days - 1));
  startDate.setHours(0, 0, 0, 0);

  const filtered = workouts.filter(w => new Date(w.date) >= startDate);

  const chartData = Array.from({ length: days }, (_, i) => {
    const date = new Date(startDate);
    date.setDate(date.getDate() + i);
    date.setHours(0, 0, 0, 0);
    const dayWorkouts = filtered.filter(w => {
      const wd = new Date(w.date); wd.setHours(0, 0, 0, 0);
      return wd.getTime() === date.getTime();
    });
    return {
      day: days <= 7 ? date.toLocaleDateString('en-US', { weekday: 'short' }) : date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
      xp: dayWorkouts.reduce((s, w) => s + w.xpEarned, 0),
      calories: dayWorkouts.reduce((s, w) => s + w.calories, 0),
      count: dayWorkouts.length,
    };
  });

  const typeDist = Array.from(new Set(filtered.map(w => w.type))).map(type => ({
    name: type,
    value: filtered.filter(w => w.type === type).length,
  }));

  const intensityRadar = [
    { intensity: 'Easy', value: filtered.filter(w => w.intensity === 'easy').length },
    { intensity: 'Medium', value: filtered.filter(w => w.intensity === 'medium').length },
    { intensity: 'Hard', value: filtered.filter(w => w.intensity === 'hard').length },
    { intensity: 'Beast', value: filtered.filter(w => w.intensity === 'beast').length },
  ];

  const totalXPAll = filtered.reduce((s, w) => s + w.xpEarned, 0);
  const totalCal = filtered.reduce((s, w) => s + w.calories, 0);
  const totalMin = filtered.reduce((s, w) => s + w.duration, 0);

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ workouts, personalRecords }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'liftoff-data.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="px-5 pt-2 space-y-5 tab-enter pb-28">
      <div className="text-center">
        <h2 className="text-xl font-black gradient-text">Progress</h2>
        <p className="text-slate-500 text-xs mt-1">Your fitness analytics</p>
      </div>

      {/* Range selector */}
      <div className="flex gap-2 justify-center">
        {RANGES.map((r) => (
          <button key={r.id} onClick={() => setRange(r.id)}
            className={`px-4 py-2 rounded-xl text-sm font-semibold transition ${range === r.id ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white' : 'glass text-slate-400'}`}>
            {r.label}
          </button>
        ))}
      </div>

      {/* Summary */}
      <div className="grid grid-cols-3 gap-3">
        {[{ v: totalXPAll.toLocaleString(), l: 'XP', c: 'text-purple-400', i: TrendingUp },
          { v: `${Math.floor(totalMin / 60)}h${totalMin % 60}m`, l: 'Time', c: 'text-orange-400', i: Calendar },
          { v: totalCal.toLocaleString(), l: 'Calories', c: 'text-cyan-400', i: '🔥' }].map((s, i) => (
          <motion.div key={i} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.05 }}
            className="glass rounded-2xl p-3 text-center">
            <p className={`text-lg font-black ${s.c}`}>{s.v}</p>
            <p className="text-[10px] text-slate-500">{s.l}</p>
          </motion.div>
        ))}
      </div>

      {/* XP Chart */}
      <div className="glass rounded-2xl p-4">
        <h3 className="font-bold text-sm mb-3">XP Over Time</h3>
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

      {/* Type Distribution */}
      <div className="glass rounded-2xl p-4">
        <h3 className="font-bold text-sm mb-3">Workout Types</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={typeDist} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={60} innerRadius={30} paddingAngle={5}>
                {typeDist.map((_, i) => <Cell key={i} fill={COLORS[i % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex flex-wrap gap-2 mt-2 justify-center">
          {typeDist.map((t, i) => (
            <div key={t.name} className="flex items-center gap-1 text-xs">
              <div className="w-3 h-3 rounded-full" style={{ background: COLORS[i % COLORS.length] }} />
              <span className="text-slate-400">{t.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Intensity Radar */}
      <div className="glass rounded-2xl p-4">
        <h3 className="font-bold text-sm mb-3">Intensity Mix</h3>
        <div className="h-40">
          <ResponsiveContainer width="100%" height="100%">
            <RadarChart data={intensityRadar}>
              <PolarGrid stroke="#334155" />
              <PolarAngleAxis dataKey="intensity" tick={{ fill: '#94a3b8', fontSize: 11 }} />
              <Radar dataKey="value" stroke="#ec4899" fill="#ec4899" fillOpacity={0.3} />
              <Tooltip contentStyle={{ backgroundColor: '#1e293b', border: '1px solid #334155', borderRadius: '12px', color: '#fff', fontSize: '12px' }} />
            </RadarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* PRs */}
      {personalRecords.length > 0 && (
        <div className="glass rounded-2xl p-4">
          <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-400" /> Personal Records</h3>
          <div className="space-y-2">
            {personalRecords.map((pr) => (
              <div key={pr.id} className="flex items-center justify-between p-2 rounded-xl bg-slate-800/30">
                <span className="text-sm font-medium">{pr.workoutType}</span>
                <span className="text-sm font-bold text-yellow-400">{pr.value} {pr.unit}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      <button onClick={exportData} className="w-full py-3 rounded-xl glass-strong font-semibold flex items-center justify-center gap-2 text-sm active:scale-[0.98]">
        <Download className="w-4 h-4" /> Export Data
      </button>
    </div>
  );
}