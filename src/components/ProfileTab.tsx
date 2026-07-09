'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/store';
import { ChevronRight, Lock, Settings as SettingsIcon, Upload, Download } from 'lucide-react';

const rarityColors: Record<string, string> = {
  common: 'bg-slate-500/20 text-slate-300',
  rare: 'bg-blue-500/20 text-blue-300',
  epic: 'bg-pink-500/20 text-pink-300',
  legendary: 'bg-purple-500/20 text-purple-300',
};

const AVATARS = ['🦉', '🐱', '🐶', '🦊', '🐼', '🦁', '🐯', '🐸', '🐵', '🦄'];

export function ProfileTab() {
  const { level, totalXP, streak, bestStreak, coins, workouts, achievements, addBodyMetric, bodyMetrics, settings, updateSettings } = useStore();
  const [showAchievements, setShowAchievements] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [showMetrics, setShowMetrics] = useState(false);
  const [avatar, setAvatar] = useState('🦉');
  const [weight, setWeight] = useState('');
  const [fat, setFat] = useState('');
  const [rarityFilter, setRarityFilter] = useState<string>('all');

  const unlocked = achievements.filter(a => a.unlocked);
  const totalCal = workouts.reduce((s, w) => s + w.calories, 0);

  const filteredAch = rarityFilter === 'all' ? achievements : achievements.filter(a => a.rarity === rarityFilter);

  const handleAddMetric = () => {
    if (!weight) return;
    addBodyMetric({ date: new Date().toISOString(), weight: parseFloat(weight), bodyFat: fat ? parseFloat(fat) : undefined });
    setWeight(''); setFat(''); setShowMetrics(false);
  };

  const exportData = () => {
    const blob = new Blob([JSON.stringify({ workouts, achievements, bodyMetrics, settings }, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = 'liftoff-backup.json'; a.click();
    URL.revokeObjectURL(url);
  };

  const importData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      try {
        const data = JSON.parse(reader.result as string);
        if (data.workouts) useStore.setState({ workouts: data.workouts });
        if (data.achievements) useStore.setState({ achievements: data.achievements });
        if (data.bodyMetrics) useStore.setState({ bodyMetrics: data.bodyMetrics });
      } catch {}
    };
    reader.readAsText(file);
  };

  return (
    <div className="px-5 pt-2 space-y-5 tab-enter pb-28">
      {/* Avatar */}
      <div className="text-center pt-2">
        <motion.div whileTap={{ scale: 0.9 }} onClick={() => setAvatar(AVATARS[(AVATARS.indexOf(avatar) + 1) % AVATARS.length])}
          className="w-20 h-20 mx-auto rounded-3xl bg-gradient-to-br from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center text-4xl glow-purple mb-2 cursor-pointer">
          {avatar}
        </motion.div>
        <h2 className="text-lg font-black">Fitness Warrior</h2>
        <p className="text-slate-500 text-sm">Level {level} • {totalXP.toLocaleString()} XP</p>
        <p className="text-xs text-slate-600 mt-1">Tap avatar to change</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-4 gap-2">
        {[{ v: streak, l: 'Streak', c: 'text-orange-400' }, { v: totalCal, l: 'Calories', c: 'text-purple-400' }, { v: coins, l: 'Coins', c: 'text-yellow-400' }, { v: bestStreak, l: 'Best', c: 'text-cyan-400' }].map((s, i) => (
          <div key={i} className="glass rounded-xl p-2.5 text-center">
            <p className={`text-lg font-black ${s.c}`}>{s.v}</p>
            <p className="text-[9px] text-slate-500">{s.l}</p>
          </div>
        ))}
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
              <div className="flex gap-1 mb-3 mt-3 flex-wrap">
                {['all', 'common', 'rare', 'epic', 'legendary'].map((r) => (
                  <button key={r} onClick={() => setRarityFilter(r)}
                    className={`px-3 py-1 rounded-full text-xs ${rarityFilter === r ? 'bg-purple-500 text-white' : 'glass text-slate-400'}`}>
                    {r}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-2 gap-2 mt-3">
                {filteredAch.map((ach) => (
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
                <input type="number" value={weight} onChange={(e) => setWeight(e.target.value)} placeholder="Weight (kg)" className="input-field text-sm" />
                <input type="number" value={fat} onChange={(e) => setFat(e.target.value)} placeholder="Body Fat %" className="input-field text-sm" />
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

      {/* Settings */}
      <div className="glass rounded-2xl p-4">
        <button onClick={() => setShowSettings(!showSettings)} className="flex items-center justify-between w-full">
          <h3 className="font-bold text-sm flex items-center gap-2"><SettingsIcon className="w-4 h-4 text-slate-400" /> Settings</h3>
          <ChevronRight className={`w-4 h-4 text-slate-400 transition ${showSettings ? 'rotate-90' : ''}`} />
        </button>
        <AnimatePresence>
          {showSettings && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
              <div className="mt-3 space-y-3">
                <Toggle label="Haptics" value={settings.hapticsEnabled} onChange={(v) => updateSettings({ hapticsEnabled: v })} />
                <Toggle label="Sounds" value={settings.soundsEnabled} onChange={(v) => updateSettings({ soundsEnabled: v })} />
                <Toggle label="Reduced Motion" value={settings.reducedMotion} onChange={(v) => updateSettings({ reducedMotion: v })} />
                <div className="flex items-center justify-between">
                  <span className="text-sm">Theme</span>
                  <div className="flex gap-1">
                    {['dark', 'light', 'system'].map((t) => (
                      <button key={t} onClick={() => updateSettings({ theme: t as any })}
                        className={`px-3 py-1 rounded-lg text-xs ${settings.theme === t ? 'bg-purple-500 text-white' : 'glass text-slate-400'}`}>
                        {t}
                      </button>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2 pt-2">
                  <button onClick={exportData} className="flex-1 py-2 rounded-xl glass-strong text-sm font-medium flex items-center justify-center gap-1">
                    <Download className="w-3 h-3" /> Export
                  </button>
                  <label className="flex-1 py-2 rounded-xl glass-strong text-sm font-medium flex items-center justify-center gap-1 cursor-pointer">
                    <Upload className="w-3 h-3" /> Import
                    <input type="file" accept="application/json" onChange={importData} className="hidden" />
                  </label>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function Toggle({ label, value, onChange }: { label: string; value: boolean; onChange: (v: boolean) => void }) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <button onClick={() => onChange(!value)}
        className={`w-12 h-6 rounded-full transition relative ${value ? 'bg-purple-500' : 'bg-slate-700'}`}>
        <motion.div animate={{ x: value ? 24 : 2 }} className="absolute top-1 w-4 h-4 rounded-full bg-white" />
      </button>
    </div>
  );
}