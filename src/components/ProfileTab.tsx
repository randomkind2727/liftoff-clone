'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/store';
import { ChevronRight, Lock } from 'lucide-react';
import type { Achievement } from '@/store/store';

const rarityColors: Record<string, string> = {
  common: 'bg-slate-500/20 text-slate-300',
  rare: 'bg-blue-500/20 text-blue-300',
  epic: 'bg-pink-500/20 text-pink-300',
  legendary: 'bg-purple-500/20 text-purple-300',
};

export function ProfileTab() {
  const { level, totalXP, streak, bestStreak, coins, workouts, achievements, addBodyMetric, bodyMetrics } = useStore();
  const [showAchievements, setShowAchievements] = useState(false);
  const [weight, setWeight] = useState('');
  const [fat, setFat] = useState('');
  const [showMetrics, setShowMetrics] = useState(false);

  const unlocked = achievements.filter(a => a.unlocked);
  const totalCal = workouts.reduce((s, w) => s + w.calories, 0);

  const handleAddMetric = () => {
    if (!weight) return;
    addBodyMetric({ date: new Date().toISOString(), weight: parseFloat(weight), bodyFat: fat ? parseFloat(fat) : undefined });
    setWeight(''); setFat(''); setShowMetrics(false);
  };

  return (
    <div className="px-5 pt-2 space-y-5 tab-enter">
      {/* Avatar */}
      <div className="text-center pt-2">
        <div className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-4xl glow-purple mb-2">
          🦉
        </div>
        <h2 className="text-lg font-black">Fitness Warrior</h2>
        <p className="text-slate-500 text-sm">Level {level} • {totalXP.toLocaleString()} XP</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-4 gap-2">
        <div className="glass rounded-xl p-2.5 text-center">
          <p className="text-lg font-black text-orange-400">{streak}</p>
          <p className="text-[9px] text-slate-500">Streak</p>
        </div>
        <div className="glass rounded-xl p-2.5 text-center">
          <p className="text-lg font-black text-purple-400">{totalCal}</p>
          <p className="text-[9px] text-slate-500">Calories</p>
        </div>
        <div className="glass rounded-xl p-2.5 text-center">
          <p className="text-lg font-black text-yellow-400">{coins}</p>
          <p className="text-[9px] text-slate-500">Coins</p>
        </div>
        <div className="glass rounded-xl p-2.5 text-center">
          <p className="text-lg font-black text-cyan-400">{bestStreak}</p>
          <p className="text-[9px] text-slate-500">Best</p>
        </div>
      </div>

      {/* Achievements */}
      <div className="glass rounded-2xl p-4">
        <button onClick={() => setShowAchievements(!showAchievements)} className="flex items-center justify-between w-full">
          <h3 className="font-bold text-sm">Achievements ({unlocked.length}/{achievements.length})</h3>
          <ChevronRight className={`w-4 h-4 text-slate-400 transition ${showAchievements ? 'rotate-90' : ''}`} />
        </button>

        <AnimatePresence>
          {showAchievements && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="grid grid-cols-2 gap-2 mt-3">
                {achievements.map((ach) => (
                  <div key={ach.id} className={`p-3 rounded-xl border ${ach.unlocked ? 'bg-yellow-500/5 border-yellow-500/20' : 'bg-slate-800/30 border-slate-700/30 opacity-40'}`}>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{ach.icon}</span>
                      <span className={`text-[10px] px-1.5 py-0.5 rounded-full ${rarityColors[ach.rarity]}`}>{ach.rarity}</span>
                    </div>
                    <p className="font-semibold text-xs">{ach.name}</p>
                    <p className="text-[10px] text-slate-500">{ach.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Body Metrics */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm">Body Metrics</h3>
          <button onClick={() => setShowMetrics(!showMetrics)} className="text-xs text-purple-400">+ Add</button>
        </div>
        <AnimatePresence>
          {showMetrics && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="flex gap-2 mt-3">
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight (kg)" className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500" />
                <input type="number" value={fat} onChange={(e) => setFat(e.target.value)} placeholder="Body Fat %" className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500" />
                <button onClick={handleAddMetric} className="px-4 py-2 bg-purple-500 rounded-lg text-sm font-medium">Save</button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        {bodyMetrics.length > 0 && (
          <div className="mt-2 space-y-1">
            {bodyMetrics.slice(-3).reverse().map((m) => (
              <div key={m.id} className="flex justify-between p-2 bg-slate-800/30 rounded-lg text-sm">
                <span className="text-slate-400 text-xs">{new Date(m.date).toLocaleDateString()}</span>
                <span className="font-bold">{m.weight}kg{m.bodyFat ? ` • ${m.bodyFat}%` : ''}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
