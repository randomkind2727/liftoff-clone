'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Zap } from 'lucide-react';
import { useWorkoutStore } from '@/store/workoutStore';

const WORKOUT_TYPES = [
  'Running', 'Cycling', 'Swimming', 'Weightlifting', 'Yoga',
  'HIIT', 'Boxing', 'Dancing', 'Hiking', 'Stretching', 'Other',
];

export function WorkoutForm({ onClose }: { onClose: () => void }) {
  const { addWorkout } = useWorkoutStore();
  const [type, setType] = useState('');
  const [duration, setDuration] = useState('');
  const [calories, setCalories] = useState('');
  const [notes, setNotes] = useState('');
  const [showSuccess, setShowSuccess] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!type || !duration || !calories) return;

    addWorkout({
      type,
      duration: parseInt(duration),
      calories: parseInt(calories),
      date: new Date().toISOString(),
      notes: notes || undefined,
    });

    setShowSuccess(true);
    setTimeout(() => {
      onClose();
    }, 1500);
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.9, opacity: 0 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-slate-900 border border-slate-800 rounded-3xl p-8 w-full max-w-md shadow-2xl"
      >
        {showSuccess ? (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="text-center py-8"
          >
            <motion.div
              animate={{ rotate: [0, -10, 10, -10, 0] }}
              transition={{ duration: 0.5 }}
            >
              <Zap className="w-16 h-16 text-yellow-400 mx-auto mb-4" />
            </motion.div>
            <h3 className="text-2xl font-bold text-white mb-2">Workout Logged!</h3>
            <p className="text-slate-400">+{Math.floor(parseInt(duration) * 2 + parseInt(calories) * 0.5)} XP earned</p>
          </motion.div>
        ) : (
          <>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold text-white">Log Workout</h2>
              <button onClick={onClose} className="text-slate-400 hover:text-white transition">
                <X className="w-6 h-6" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Workout Type</label>
                <div className="grid grid-cols-3 gap-2">
                  {WORKOUT_TYPES.map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setType(t)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition ${
                        type === t
                          ? 'bg-purple-500 text-white'
                          : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Duration (minutes)</label>
                <input
                  type="number"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  placeholder="30"
                  min="1"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Calories Burned</label>
                <input
                  type="number"
                  value={calories}
                  onChange={(e) => setCalories(e.target.value)}
                  placeholder="200"
                  min="1"
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Notes (optional)</label>
                <textarea
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  placeholder="How did it feel?"
                  rows={2}
                  className="w-full px-4 py-3 bg-slate-800 border border-slate-700 rounded-xl text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-purple-500 resize-none"
                />
              </div>

              <button
                type="submit"
                disabled={!type || !duration || !calories}
                className="w-full py-4 bg-gradient-to-r from-orange-500 to-pink-500 text-white font-bold rounded-xl hover:opacity-90 transition disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Log Workout 🚀
              </button>
            </form>
          </>
        )}
      </motion.div>
    </motion.div>
  );
}
