'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/store';
import { User, Trophy, Settings, ChevronRight, Star, Flame, Zap, Target, Moon, Sun, Volume2, Bell, Shield, LogOut } from 'lucide-react';

export function ProfileTab() {
  const { level, totalXP, streak, bestStreak, coins, workouts, achievements, bodyMetrics, addBodyMetric } = useStore();
  const [showAchievements, setShowAchievements] = useState(false);
  const [showBodyForm, setShowBodyForm] = useState(false);
  const [weight, setWeight] = useState('');
  const [bodyFat, setBodyFat] = useState('');

  const unlockedAchievements = achievements.filter(a => a.unlocked);
  const totalCalories = workouts.reduce((s, w) => s + w.calories, 0);
  const totalMinutes = workouts.reduce((s, w) => s + w.duration, 0);

  const handleAddMetric = () => {
    if (!weight) return;
    addBodyMetric({
      date: new Date().toISOString(),
      weight: parseFloat(weight),
      bodyFat: bodyFat ? parseFloat(bodyFat) : undefined,
    });
    setWeight('');
    setBodyFat('');
    setShowBodyForm(false);
  };

  return (
    <div className="px-4 pt-2 space-y-5 tab-enter">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center"
      >
        <div className="w-24 h-24 mx-auto rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-5xl glow-purple mb-3">
          🦉
        </div>
        <h2 className="text-xl font-black">Fitness Warrior</h2>
        <p className="text-slate-500 text-sm">Level {level} • {totalXP.toLocaleString()} XP</p>
      </motion.div>

      {/* Quick Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-4 gap-2"
      >
        <div className="glass rounded-xl p-3 text-center">
          <Flame className="w-4 h-4 text-orange-400 mx-auto mb-1" />
          <p className="text-lg font-black">{streak}</p>
          <p className="text-[10px] text-slate-500">Streak</p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <Zap className="w-4 h-4 text-purple-400 mx-auto mb-1" />
          <p className="text-lg font-black">{totalCalories}</p>
          <p className="text-[10px] text-slate-500">Calories</p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <Trophy className="w-4 h-4 text-yellow-400 mx-auto mb-1" />
          <p className="text-lg font-black">{unlockedAchievements.length}</p>
          <p className="text-[10px] text-slate-500">Badges</p>
        </div>
        <div className="glass rounded-xl p-3 text-center">
          <Star className="w-4 h-4 text-cyan-400 mx-auto mb-1" />
          <p className="text-lg font-black">{coins}</p>
          <p className="text-[10px] text-slate-500">Coins</p>
        </div>
      </motion.div>

      {/* All-Time Stats */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-4"
      >
        <h3 className="font-bold text-sm mb-3">All-Time Stats</h3>
        <div className="space-y-2.5">
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Total Workouts</span>
            <span className="font-bold">{workouts.length}</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Total Time</span>
            <span className="font-bold">{Math.floor(totalMinutes / 60)}h {totalMinutes % 60}m</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Best Streak</span>
            <span className="font-bold text-orange-400">{bestStreak} days</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-sm text-slate-400">Coins Earned</span>
            <span className="font-bold text-yellow-400">{coins}</span>
          </div>
        </div>
      </motion.div>

      {/* Achievements */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="glass rounded-2xl p-4"
      >
        <button
          onClick={() => setShowAchievements(!showAchievements)}
          className="flex items-center justify-between w-full"
        >
          <h3 className="font-bold text-sm">Achievements ({unlockedAchievements.length}/{achievements.length})</h3>
          <ChevronRight className={`w-4 h-4 text-slate-400 transition ${showAchievements ? 'rotate-90' : ''}`} />
        </button>

        <AnimatePresence>
          {showAchievements && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden"
            >
              <div className="grid grid-cols-2 gap-2 mt-3">
                {achievements.map((ach) => (
                  <div
                    key={ach.id}
                    className={`p-3 rounded-xl border ${
                      ach.unlocked
                        ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20'
                        : 'bg-slate-800/30 border-slate-700/30 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xl">{ach.icon}</span>
                      <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                        ach.rarity === 'legendary' ? 'bg-purple-500/20 text-purple-300' :
                        ach.rarity === 'epic' ? 'bg-pink-500/20 text-pink-300' :
                        ach.rarity === 'rare' ? 'bg-blue-500/20 text-blue-300' :
                        'bg-slate-500/20 text-slate-300'
                      }`}>
                        {ach.rarity}
                      </span>
                    </div>
                    <p className="font-semibold text-xs">{ach.name}</p>
                    <p className="text-[10px] text-slate-500">{ach.description}</p>
                  </div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      {/* Body Metrics */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="glass rounded-2xl p-4"
      >
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-bold text-sm">Body Metrics</h3>
          <button
            onClick={() => setShowBodyForm(!showBodyForm)}
            className="text-xs text-purple-400"
          >
            + Add
          </button>
        </div>

        <AnimatePresence>
          {showBodyForm && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              className="overflow-hidden mb-3"
            >
              <div className="flex gap-2">
                <input
                  type="number"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                  placeholder="Weight (kg)"
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <input
                  type="number"
                  value={bodyFat}
                  onChange={(e) => setBodyFat(e.target.value)}
                  placeholder="Body Fat %"
                  className="flex-1 px-3 py-2 bg-slate-800 border border-slate-700 rounded-lg text-sm text-white placeholder-slate-500 focus:outline-none focus:ring-1 focus:ring-purple-500"
                />
                <button
                  onClick={handleAddMetric}
                  className="px-4 py-2 bg-purple-500 rounded-lg text-sm font-medium"
                >
                  Save
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {bodyMetrics.length > 0 ? (
          <div className="space-y-2">
            {bodyMetrics.slice(-3).reverse().map((metric) => (
              <div key={metric.id} className="flex items-center justify-between p-2 bg-slate-800/30 rounded-lg">
                <span className="text-xs text-slate-400">
                  {new Date(metric.date).toLocaleDateString()}
                </span>
                <div className="flex gap-3">
                  {metric.weight && <span className="text-sm font-bold">{metric.weight}kg</span>}
                  {metric.bodyFat && <span className="text-sm text-slate-400">{metric.bodyFat}%</span>}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-500 text-center py-2">No body metrics logged yet</p>
        )}
      </motion.div>

      {/* Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
        className="glass rounded-2xl p-4"
      >
        <h3 className="font-bold text-sm mb-3">Settings</h3>
        <div className="space-y-1">
          {[
            { icon: <Bell className="w-4 h-4" />, label: 'Notifications', color: 'text-blue-400' },
            { icon: <Moon className="w-4 h-4" />, label: 'Dark Mode', color: 'text-purple-400' },
            { icon: <Volume2 className="w-4 h-4" />, label: 'Sound Effects', color: 'text-green-400' },
            { icon: <Shield className="w-4 h-4" />, label: 'Privacy', color: 'text-orange-400' },
          ].map((item) => (
            <button key={item.label} className="flex items-center gap-3 w-full p-2.5 rounded-lg hover:bg-slate-800/50 transition">
              <span className={item.color}>{item.icon}</span>
              <span className="text-sm flex-1 text-left">{item.label}</span>
              <ChevronRight className="w-4 h-4 text-slate-600" />
            </button>
          ))}
        </div>
      </motion.div>
    </div>
  );
}
