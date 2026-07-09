'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/store';
import { Trophy, Flame, Crown, Plus, Share2, Swords } from 'lucide-react';

export function SocialTab() {
  const { friends, level, totalXP, streak, workouts } = useStore();

  const leaderboard = [
    ...friends,
    { id: 'me', name: 'You', avatar: '🦉', level, totalXP, streak, lastActive: new Date().toISOString() },
  ].sort((a, b) => b.totalXP - a.totalXP);

  const myRank = leaderboard.findIndex(f => f.id === 'me') + 1;
  const medals = ['🥇', '🥈', '🥉'];

  const recentActivity = [...workouts]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 5);

  return (
    <div className="px-5 pt-2 space-y-5 tab-enter pb-28">
      <div className="text-center">
        <h2 className="text-xl font-black gradient-text">Social</h2>
        <p className="text-slate-500 text-xs mt-1">Compete with friends</p>
      </div>

      {/* Your rank */}
      <div className="glass-strong rounded-2xl p-4 flex items-center gap-4">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-2xl glow-purple">🦉</div>
        <div className="flex-1">
          <p className="text-xs text-slate-400">Your Rank</p>
          <p className="text-3xl font-black">#{myRank}</p>
        </div>
        <div className="text-right">
          <p className="font-bold text-yellow-400">{totalXP.toLocaleString()} XP</p>
          <p className="text-xs text-orange-400">🔥 {streak} days</p>
        </div>
      </div>

      {/* Leaderboard */}
      <div className="glass rounded-2xl p-4">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm flex items-center gap-2"><Trophy className="w-4 h-4 text-yellow-400" /> Leaderboard</h3>
          <span className="text-xs text-slate-500">This week</span>
        </div>
        <div className="space-y-1">
          {leaderboard.map((f, i) => (
            <motion.div key={f.id} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.04 }}
              className={`flex items-center gap-3 p-2.5 rounded-xl ${f.id === 'me' ? 'bg-purple-500/10 border border-purple-500/20' : ''}`}>
              <div className="w-7 text-center">{i < 3 ? <span className="text-lg">{medals[i]}</span> : <span className="text-xs text-slate-500">#{i + 1}</span>}</div>
              <div className="w-9 h-9 rounded-lg bg-slate-700/50 flex items-center justify-center text-lg">{f.avatar}</div>
              <div className="flex-1 min-w-0">
                <p className={`font-semibold text-sm truncate ${f.id === 'me' ? 'text-purple-300' : ''}`}>{f.name}</p>
                <p className="text-xs text-slate-500">Lv.{f.level}</p>
              </div>
              <div className="text-right">
                <p className="font-bold text-sm">{f.totalXP.toLocaleString()}</p>
                <p className="text-xs text-orange-400">🔥{f.streak}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Activity feed */}
      <div className="glass rounded-2xl p-4">
        <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><Flame className="w-4 h-4 text-orange-400" /> Recent Activity</h3>
        <div className="space-y-2">
          {recentActivity.map((w) => (
            <div key={w.id} className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/30">
              <span className="text-lg">{(useStore.getState().templates.find(t => t.type === w.type)?.icon) || '🏋️'}</span>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium truncate">{w.type} • {w.duration}min</p>
                <p className="text-xs text-slate-500">{new Date(w.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</p>
              </div>
              <span className="text-xs font-bold text-purple-400">+{w.xpEarned} XP</span>
            </div>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex gap-2">
        <button className="flex-1 py-3 rounded-xl glass-strong font-semibold flex items-center justify-center gap-2 text-sm active:scale-[0.98]">
          <Plus className="w-4 h-4" /> Add Friend
        </button>
        <button className="flex-1 py-3 rounded-xl glass-strong font-semibold flex items-center justify-center gap-2 text-sm active:scale-[0.98]">
          <Swords className="w-4 h-4" /> Challenge
        </button>
        <button className="flex-1 py-3 rounded-xl glass-strong font-semibold flex items-center justify-center gap-2 text-sm active:scale-[0.98]">
          <Share2 className="w-4 h-4" /> Share
        </button>
      </div>
    </div>
  );
}