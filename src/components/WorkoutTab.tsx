'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/store';
import { Play, Pause, Square, Timer, Flame, Zap, Heart, X } from 'lucide-react';

const WORKOUT_TYPES = [
  { name: 'Running', icon: '🏃', color: 'from-blue-500 to-cyan-500', calPerMin: 10 },
  { name: 'Cycling', icon: '🚴', color: 'from-green-500 to-emerald-500', calPerMin: 8 },
  { name: 'Swimming', icon: '🏊', color: 'from-cyan-500 to-blue-500', calPerMin: 12 },
  { name: 'Weightlifting', icon: '🏋️', color: 'from-purple-500 to-pink-500', calPerMin: 6 },
  { name: 'Yoga', icon: '🧘', color: 'from-pink-500 to-rose-500', calPerMin: 4 },
  { name: 'HIIT', icon: '⚡', color: 'from-orange-500 to-red-500', calPerMin: 15 },
  { name: 'Boxing', icon: '🥊', color: 'from-red-500 to-orange-500', calPerMin: 12 },
  { name: 'Dancing', icon: '💃', color: 'from-fuchsia-500 to-purple-500', calPerMin: 7 },
  { name: 'Hiking', icon: '🥾', color: 'from-emerald-500 to-green-500', calPerMin: 8 },
  { name: 'Stretching', icon: '🤸', color: 'from-teal-500 to-cyan-500', calPerMin: 3 },
];

const INTENSITIES = [
  { name: 'easy', label: 'Easy', emoji: '😊', multiplier: 1 },
  { name: 'medium', label: 'Medium', emoji: '💪', multiplier: 1.2 },
  { name: 'hard', label: 'Hard', emoji: '🔥', multiplier: 1.5 },
  { name: 'beast', label: 'Beast', emoji: '🦍', multiplier: 2 },
];

export function WorkoutTab() {
  const { addWorkout, currentWorkout, startWorkout, stopWorkout } = useStore();
  const [selectedType, setSelectedType] = useState('');
  const [intensity, setIntensity] = useState<'easy' | 'medium' | 'hard' | 'beast'>('medium');
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [lastWorkout, setLastWorkout] = useState<{ xp: number; calories: number } | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (currentWorkout && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - currentWorkout.startTime) / 1000));
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [currentWorkout, isPaused]);

  const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return `${h > 0 ? h + ':' : ''}${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  const handleStart = () => {
    if (!selectedType) return;
    startWorkout(selectedType);
    setElapsed(0);
    setIsPaused(false);
  };

  const handleStop = () => {
    if (!currentWorkout) return;
    const duration = Math.max(1, Math.floor(elapsed / 60));
    const workoutType = WORKOUT_TYPES.find(w => w.name === currentWorkout.type);
    const baseCalories = (workoutType?.calPerMin || 8) * duration;
    const calories = Math.floor(baseCalories * INTENSITIES.find(i => i.name === intensity)!.multiplier);
    const xp = Math.floor((duration * 2 + calories * 0.5) * INTENSITIES.find(i => i.name === intensity)!.multiplier);

    addWorkout({
      type: currentWorkout.type,
      duration,
      calories,
      date: new Date().toISOString(),
      intensity,
      mood: '🔥',
    });

    setLastWorkout({ xp, calories });
    setShowComplete(true);
    stopWorkout();
    setElapsed(0);

    setTimeout(() => setShowComplete(false), 3000);
  };

  const estimatedCalories = selectedType
    ? Math.floor((WORKOUT_TYPES.find(w => w.name === selectedType)?.calPerMin || 8) * (elapsed / 60 || 1) * INTENSITIES.find(i => i.name === intensity)!.multiplier)
    : 0;

  return (
    <div className="px-4 pt-2 pb-4 space-y-5 tab-enter">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-xl font-black gradient-text">Start Workout</h2>
        <p className="text-slate-500 text-xs mt-1">Choose your weapon 🔥</p>
      </div>

      {/* Active Workout Timer */}
      <AnimatePresence>
        {currentWorkout && (
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            className="glass-strong rounded-3xl p-6 text-center relative overflow-hidden glow-purple"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5" />
            <div className="relative z-10">
              <motion.div
                animate={{ scale: [1, 1.1, 1] }}
                transition={{ duration: 2, repeat: Infinity }}
                className="text-5xl mb-3"
              >
                {WORKOUT_TYPES.find(w => w.name === currentWorkout.type)?.icon}
              </motion.div>
              <p className="text-sm text-slate-400 mb-1">{currentWorkout.type}</p>
              <p className="text-5xl font-black font-mono tracking-wider mb-4">{formatTime(elapsed)}</p>

              <div className="flex items-center justify-center gap-6 mb-5">
                <div className="flex items-center gap-1.5">
                  <Flame className="w-4 h-4 text-orange-400" />
                  <span className="text-sm font-bold">{estimatedCalories} cal</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <Zap className="w-4 h-4 text-purple-400" />
                  <span className="text-sm font-bold">+{Math.floor(estimatedCalories * 0.5 + elapsed / 60 * 2)} XP</span>
                </div>
              </div>

              <div className="flex items-center justify-center gap-3">
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsPaused(!isPaused)}
                  className="w-14 h-14 rounded-full glass flex items-center justify-center"
                >
                  {isPaused ? <Play className="w-6 h-6 text-green-400" /> : <Pause className="w-6 h-6 text-yellow-400" />}
                </motion.button>
                <motion.button
                  whileTap={{ scale: 0.9 }}
                  onClick={handleStop}
                  className="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center"
                >
                  <Square className="w-6 h-6 text-white" />
                </motion.button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion Animation */}
      <AnimatePresence>
        {showComplete && lastWorkout && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm"
          >
            <motion.div
              initial={{ y: 50 }}
              animate={{ y: 0 }}
              className="glass-strong rounded-3xl p-8 text-center max-w-xs mx-4"
            >
              <motion.div
                animate={{ rotate: [0, -10, 10, -10, 0], scale: [1, 1.2, 1] }}
                transition={{ duration: 0.5 }}
                className="text-6xl mb-4"
              >
                🎉
              </motion.div>
              <h3 className="text-2xl font-black gradient-text mb-2">Workout Complete!</h3>
              <div className="flex items-center justify-center gap-4 mt-4">
                <div className="text-center">
                  <p className="text-2xl font-black text-purple-400">+{lastWorkout.xp}</p>
                  <p className="text-xs text-slate-500">XP</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-black text-orange-400">{lastWorkout.calories}</p>
                  <p className="text-xs text-slate-500">Calories</p>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Workout Type Selector */}
      {!currentWorkout && (
        <>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass rounded-2xl p-4"
          >
            <h3 className="font-bold text-sm mb-3">Workout Type</h3>
            <div className="grid grid-cols-5 gap-2">
              {WORKOUT_TYPES.map((type) => (
                <motion.button
                  key={type.name}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setSelectedType(type.name)}
                  className={`flex flex-col items-center gap-1 p-2 rounded-xl transition-all ${
                    selectedType === type.name
                      ? `bg-gradient-to-br ${type.color} shadow-lg`
                      : 'bg-slate-800/50 hover:bg-slate-700/50'
                  }`}
                >
                  <span className="text-xl">{type.icon}</span>
                  <span className="text-[10px] font-medium">{type.name}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Intensity Selector */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="glass rounded-2xl p-4"
          >
            <h3 className="font-bold text-sm mb-3">Intensity</h3>
            <div className="grid grid-cols-4 gap-2">
              {INTENSITIES.map((int) => (
                <motion.button
                  key={int.name}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIntensity(int.name as typeof intensity)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition-all ${
                    intensity === int.name
                      ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/50'
                      : 'bg-slate-800/50 hover:bg-slate-700/50'
                  }`}
                >
                  <span className="text-lg">{int.emoji}</span>
                  <span className="text-[10px] font-medium">{int.label}</span>
                </motion.button>
              ))}
            </div>
          </motion.div>

          {/* Start Button */}
          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            whileTap={{ scale: 0.95 }}
            onClick={handleStart}
            disabled={!selectedType}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 font-bold text-lg disabled:opacity-30 disabled:cursor-not-allowed shadow-lg shadow-purple-500/20 relative overflow-hidden"
          >
            <span className="relative z-10">🚀 Start Workout</span>
            <div className="absolute inset-0 shimmer" />
          </motion.button>
        </>
      )}
    </div>
  );
}
