'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/store';
import { Play, Pause, Square, Flame, Zap } from 'lucide-react';

const WORKOUT_TYPES = [
  { name: 'Running', icon: '🏃', calPerMin: 10 },
  { name: 'Cycling', icon: '🚴', calPerMin: 8 },
  { name: 'Swimming', icon: '🏊', calPerMin: 12 },
  { name: 'Weights', icon: '🏋️', calPerMin: 6 },
  { name: 'Yoga', icon: '🧘', calPerMin: 4 },
  { name: 'HIIT', icon: '⚡', calPerMin: 15 },
];

const INTENSITIES = [
  { name: 'easy', emoji: '😊', mult: 1 },
  { name: 'medium', emoji: '💪', mult: 1.2 },
  { name: 'hard', emoji: '🔥', mult: 1.5 },
  { name: 'beast', emoji: '🦍', mult: 2 },
];

export function WorkoutTab() {
  const { addWorkout, currentWorkout, startWorkout, stopWorkout } = useStore();
  const [selectedType, setSelectedType] = useState('');
  const [intensity, setIntensity] = useState<'easy' | 'medium' | 'hard' | 'beast'>('medium');
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [lastXP, setLastXP] = useState(0);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (currentWorkout && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - currentWorkout.startTime) / 1000));
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [currentWorkout, isPaused]);

  const fmt = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
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
    const wt = WORKOUT_TYPES.find(w => w.name === currentWorkout.type);
    const cal = Math.floor((wt?.calPerMin || 8) * duration * INTENSITIES.find(i => i.name === intensity)!.mult);
    const xp = Math.floor((duration * 2 + cal * 0.5) * INTENSITIES.find(i => i.name === intensity)!.mult);
    addWorkout({ type: currentWorkout.type, duration, calories: cal, date: new Date().toISOString(), intensity, mood: '🔥' });
    setLastXP(xp);
    setShowComplete(true);
    stopWorkout();
    setElapsed(0);
    setTimeout(() => setShowComplete(false), 2500);
  };

  const estCal = selectedType
    ? Math.floor((WORKOUT_TYPES.find(w => w.name === selectedType)?.calPerMin || 8) * (elapsed / 60 || 1) * INTENSITIES.find(i => i.name === intensity)!.mult)
    : 0;

  return (
    <div className="px-5 pt-2 space-y-5 tab-enter">
      <div className="text-center">
        <h2 className="text-xl font-black gradient-text">Workout</h2>
        <p className="text-slate-500 text-xs mt-1">
          {currentWorkout ? 'Timer running...' : 'Pick your workout'}
        </p>
      </div>

      {/* Timer / Active Workout */}
      <AnimatePresence>
        {currentWorkout && (
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="glass-strong rounded-3xl p-6 text-center glow-purple"
          >
            <motion.div
              animate={{ scale: [1, 1.05, 1] }}
              transition={{ duration: 2, repeat: Infinity }}
              className="text-4xl mb-2"
            >
              {WORKOUT_TYPES.find(w => w.name === currentWorkout.type)?.icon}
            </motion.div>
            <p className="text-sm text-slate-400">{currentWorkout.type}</p>
            <p className="text-5xl font-black font-mono my-4">{fmt(elapsed)}</p>
            <div className="flex justify-center gap-5 mb-5">
              <div className="flex items-center gap-1 text-sm">
                <Flame className="w-4 h-4 text-orange-400" />
                <span className="font-bold">{estCal} cal</span>
              </div>
              <div className="flex items-center gap-1 text-sm">
                <Zap className="w-4 h-4 text-purple-400" />
                <span className="font-bold">+{Math.floor(estCal * 0.5 + elapsed / 60 * 2)} XP</span>
              </div>
            </div>
            <div className="flex justify-center gap-3">
              <button onClick={() => setIsPaused(!isPaused)} className="w-14 h-14 rounded-full glass flex items-center justify-center">
                {isPaused ? <Play className="w-5 h-5 text-green-400" /> : <Pause className="w-5 h-5 text-yellow-400" />}
              </button>
              <button onClick={handleStop} className="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                <Square className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion toast */}
      <AnimatePresence>
        {showComplete && (
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
          >
            <motion.div
              initial={{ y: 30 }}
              animate={{ y: 0 }}
              className="glass-strong rounded-3xl p-8 text-center"
            >
              <motion.div animate={{ rotate: [0, -10, 10, 0] }} className="text-5xl mb-3">🎉</motion.div>
              <h3 className="text-xl font-black gradient-text">Done!</h3>
              <p className="text-2xl font-black text-purple-400 mt-2">+{lastXP} XP</p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pre-workout selectors */}
      {!currentWorkout && (
        <>
          {/* Type selector */}
          <div className="glass rounded-2xl p-4">
            <h3 className="font-bold text-sm mb-3">Type</h3>
            <div className="grid grid-cols-3 gap-2">
              {WORKOUT_TYPES.map((t) => (
                <button
                  key={t.name}
                  onClick={() => setSelectedType(t.name)}
                  className={`flex flex-col items-center gap-1 p-3 rounded-xl transition ${
                    selectedType === t.name
                      ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/40'
                      : 'bg-slate-800/40 hover:bg-slate-700/40'
                  }`}
                >
                  <span className="text-xl">{t.icon}</span>
                  <span className="text-[10px] font-medium">{t.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Intensity */}
          <div className="glass rounded-2xl p-4">
            <h3 className="font-bold text-sm mb-3">Intensity</h3>
            <div className="grid grid-cols-4 gap-2">
              {INTENSITIES.map((i) => (
                <button
                  key={i.name}
                  onClick={() => setIntensity(i.name as typeof intensity)}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition ${
                    intensity === i.name
                      ? 'bg-purple-500/20 border border-purple-500/40'
                      : 'bg-slate-800/40'
                  }`}
                >
                  <span className="text-lg">{i.emoji}</span>
                  <span className="text-[10px] capitalize">{i.name}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Start */}
          <button
            onClick={handleStart}
            disabled={!selectedType}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 font-bold text-lg disabled:opacity-30 shadow-lg shadow-purple-500/20"
          >
            🚀 Start
          </button>
        </>
      )}
    </div>
  );
}
