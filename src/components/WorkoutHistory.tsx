'use client';

import { motion } from 'framer-motion';
import { useWorkoutStore } from '@/store/workoutStore';
import { Clock, Flame, Zap, Database } from 'lucide-react';

export function WorkoutHistory() {
  const { workouts, loadDemoData } = useWorkoutStore();

  const sortedWorkouts = [...workouts].reverse();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.5 }}
      className="bg-slate-900/60 backdrop-blur-xl border border-slate-800 rounded-2xl p-6"
    >
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-bold text-white">Workout History</h2>
        {workouts.length === 0 && (
          <button
            onClick={loadDemoData}
            className="flex items-center gap-2 px-3 py-1.5 text-xs font-medium text-slate-400 bg-slate-800 hover:bg-slate-700 rounded-lg transition"
          >
            <Database className="w-3.5 h-3.5" />
            Load Demo
          </button>
        )}
      </div>

      {sortedWorkouts.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-slate-500 text-lg">No workouts yet</p>
          <p className="text-slate-600 text-sm mt-1">Tap the + button to log your first workout!</p>
        </div>
      ) : (
        <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
          {sortedWorkouts.map((workout, i) => (
            <motion.div
              key={workout.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: i * 0.05 }}
              className="bg-slate-800/60 border border-slate-700/50 rounded-xl p-4 flex items-center justify-between hover:bg-slate-800 transition"
            >
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 rounded-lg flex items-center justify-center">
                  <span className="text-lg">
                    {workout.type === 'Running' ? '🏃' :
                     workout.type === 'Cycling' ? '🚴' :
                     workout.type === 'Swimming' ? '🏊' :
                     workout.type === 'Weightlifting' ? '🏋️' :
                     workout.type === 'Yoga' ? '🧘' :
                     workout.type === 'HIIT' ? '⚡' :
                     workout.type === 'Boxing' ? '🥊' :
                     workout.type === 'Dancing' ? '💃' :
                     workout.type === 'Hiking' ? '🥾' :
                     workout.type === 'Stretching' ? '🤸' : '💪'}
                  </span>
                </div>
                <div>
                  <p className="font-semibold text-white">{workout.type}</p>
                  <p className="text-xs text-slate-400">
                    {new Date(workout.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      hour: '2-digit',
                      minute: '2-digit',
                    })}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-4 text-sm">
                <div className="flex items-center gap-1 text-slate-400">
                  <Clock className="w-3.5 h-3.5" />
                  <span>{workout.duration}m</span>
                </div>
                <div className="flex items-center gap-1 text-orange-400">
                  <Flame className="w-3.5 h-3.5" />
                  <span>{workout.calories}</span>
                </div>
                <div className="flex items-center gap-1 text-purple-400">
                  <Zap className="w-3.5 h-3.5" />
                  <span>+{workout.xpEarned}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
