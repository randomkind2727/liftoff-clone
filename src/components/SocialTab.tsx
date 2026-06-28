'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/store';
import { Trophy, Flame, Zap, Crown, TrendingUp } from 'lucide-react';

export function SocialTab() {
  const { friends, level, totalXP, streak } = useStore();

  const leaderboard = [
    ...friends,
    { id: 'me', name: 'You ⭐', avatar: '🦉', level, totalXP, streak, lastActive: new Date().toISOString() },
  ].sort((a, b) => b.totalXP - a.totalXP);

  const myRank = leaderboard.findIndex(f => f.id === 'me') + 1;

  return (
    <div className="px-4 pt-2 space-y-5 tab-enter">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-black gradient-text">Social</h2>
        <p className="text-slate-500 text-xs mt-1">Compete with friends 🏆</p>
      </div>

      {/* Your Rank */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-strong rounded-2xl p-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-bl from-yellow-500/20 to-transparent rounded-bl-full" />
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-3xl glow-purple">
            🦉
          </div>
          <div className="flex-1">
            <p className="text-xs text-slate-400">Your Rank</p>
            <p className="text-3xl font-black">#{myRank}</p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1 text-yellow-400">
              <Crown className="w-4 h-4" />
              <span className="font-bold">{totalXP} XP</span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">🔥 {streak} day streak</p>
          </div>
        </div>
      </motion.div>

      {/* Leaderboard */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="glass rounded-2xl p-4"
      >
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm flex items-center gap-2">
            <Trophy className="w-4 h-4 text-yellow-400" />
            Leaderboard
          </h3>
          <span className="text-xs text-slate-500">This week</span>
        </div>

        <div className="space-y-2">
          {leaderboard.map((friend, i) => {
            const isMe = friend.id === 'me';
            const medals = ['🥇', '🥈', '🥉'];

            return (
              <motion.div
                key={friend.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className={`flex items-center gap-3 p-3 rounded-xl transition ${
                  isMe ? 'bg-gradient-to-r from-purple-500/10 to-pink-500/10 border border-purple-500/20' : 'bg-slate-800/30'
                }`}
              >
                <div className="w-8 text-center">
                  {i < 3 ? (
                    <span className="text-xl">{medals[i]}</span>
                  ) : (
                    <span className="text-sm font-bold text-slate-500">#{i + 1}</span>
                  )}
                </div>

                <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center text-xl">
                  {friend.avatar}
                </div>

                <div className="flex-1 min-w-0">
                  <p className={`font-semibold text-sm truncate ${isMe ? 'text-purple-300' : ''}`}>
                    {friend.name}
                  </p>
                  <p className="text-xs text-slate-500">Level {friend.level}</p>
                </div>

                <div className="text-right">
                  <p className="font-bold text-sm">{friend.totalXP.toLocaleString()} XP</p>
                  <div className="flex items-center gap-0.5 text-xs text-orange-400">
                    <Flame className="w-3 h-3" />
                    {friend.streak}
                  </div>
                </div>
              </motion.div>
            );
          })}
        </div>
      </motion.div>

      {/* Weekly Challenge */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="glass rounded-2xl p-4"
      >
        <h3 className="font-bold text-sm flex items-center gap-2 mb-3">
          <TrendingUp className="w-4 h-4 text-green-400" />
          Weekly Challenge
        </h3>
        <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-500/20 rounded-xl p-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-green-500/20 flex items-center justify-center text-2xl">
              🏆
            </div>
            <div className="flex-1">
              <p className="font-bold text-sm">Top the Leaderboard</p>
              <p className="text-xs text-slate-400">Beat Alex Thunder&apos;s 1,800 XP this week</p>
            </div>
          </div>
          <div className="mt-3">
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-400">Progress</span>
              <span className="text-green-400 font-bold">{Math.min(100, Math.round((totalXP / 1800) * 100))}%</span>
            </div>
            <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.min(100, (totalXP / 1800) * 100)}%` }}
                transition={{ duration: 1, ease: 'easeOut' }}
                className="h-full bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"
              />
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
