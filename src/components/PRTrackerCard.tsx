'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/store';
import { Trophy, TrendingUp } from 'lucide-react';

export function PRTrackerCard() {
  const { personalRecords, workouts } = useStore();
  
  if (personalRecords.length === 0) return null;

  const recent = [...personalRecords]
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
    .slice(0, 3);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.25 }}
      className="glass rounded-2xl p-4"
    >
      <div className="flex items-center gap-2 mb-3">
        <Trophy className="w-5 h-5 text-yellow-400" />
        <h3 className="font-bold text-sm">Recent Records</h3>
      </div>
      <div className="space-y-2">
        {recent.map((pr) => (
          <div key={pr.id} className="flex items-center gap-3 p-2 rounded-xl bg-slate-800/30">
            <div className="w-8 h-8 rounded-lg bg-yellow-500/10 flex items-center justify-center">
              <TrendingUp className="w-4 h-4 text-yellow-400" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold truncate">{pr.workoutType}</p>
              <p className="text-xs text-slate-500">
                {pr.metric === 'duration' ? 'Longest' : pr.metric === 'calories' ? 'Most calories' : 'Farthest'}: {pr.value} {pr.unit}
              </p>
            </div>
            <span className="text-xs text-slate-500">
              {new Date(pr.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
            </span>
          </div>
        ))}
      </div>
    </motion.div>
  );
}