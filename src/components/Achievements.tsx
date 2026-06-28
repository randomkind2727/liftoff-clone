'use client';

import { motion } from 'framer-motion';
import { useWorkoutStore } from '@/store/workoutStore';
import { Lock } from 'lucide-react';

export function Achievements() {
  const { achievements } = useWorkoutStore();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6 mb-8"
    >
      <h2 className="text-xl font-bold text-white mb-4">Achievements</h2>

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {achievements.map((achievement, i) => (
          <motion.div
            key={achievement.id}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.1 * i }}
            className={`relative p-4 rounded-xl border text-center transition ${
              achievement.unlocked
                ? 'bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/30'
                : 'bg-slate-800/40 border-slate-700/50 opacity-60'
            }`}
          >
            {!achievement.unlocked && (
              <Lock className="absolute top-2 right-2 w-3 h-3 text-slate-600" />
            )}
            <span className="text-2xl block mb-1">{achievement.icon}</span>
            <p className={`text-xs font-semibold ${achievement.unlocked ? 'text-white' : 'text-slate-500'}`}>
              {achievement.name}
            </p>
            <p className="text-xs text-slate-500 mt-0.5">{achievement.description}</p>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}
