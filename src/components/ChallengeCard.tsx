'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/store';

export function ChallengeCard({ id }: { id: string }) {
  const challenges = useStore((s) => s.challenges);
  const challenge = challenges.find((ch) => ch.id === id);
  if (!challenge) return null;

  const progress = Math.min((challenge.current / challenge.target) * 100, 100);
  const isComplete = progress >= 100;

  return (
    <motion.div
      layout
      className={`glass rounded-xl p-3 ${isComplete ? 'border-green-500/30' : ''}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div>
          <p className="font-semibold text-sm">{challenge.title}</p>
          <p className="text-xs text-slate-500">{challenge.description}</p>
        </div>
        <div className="flex items-center gap-1 px-2 py-1 rounded-full bg-yellow-500/10 border border-yellow-500/20">
          <span className="text-xs font-bold text-yellow-400">+{challenge.reward}</span>
          <span className="text-xs">🪙</span>
        </div>
      </div>
      <div className="relative h-2 bg-slate-800 rounded-full overflow-hidden">
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.8, ease: 'easeOut' }}
          className={`absolute h-full rounded-full ${
            isComplete ? 'bg-gradient-to-r from-green-500 to-emerald-500' : 'bg-gradient-to-r from-purple-500 to-pink-500'
          }`}
        />
      </div>
      <p className="text-xs text-slate-500 mt-1">{challenge.current}/{challenge.target}</p>
    </motion.div>
  );
}
