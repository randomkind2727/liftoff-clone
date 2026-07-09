'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/store';
import { Play, Pause, Square, Flame, Zap, Clock, Trophy, Heart, CheckCircle } from 'lucide-react';
import { triggerHaptic } from '@/lib/haptics';
import { playSound } from '@/lib/sound';

const INTENSITIES = [
  { name: 'easy', emoji: '😊', mult: 1, label: 'Easy' },
  { name: 'medium', emoji: '💪', mult: 1.2, label: 'Medium' },
  { name: 'hard', emoji: '🔥', mult: 1.5, label: 'Hard' },
  { name: 'beast', emoji: '🦍', mult: 2, label: 'Beast' },
] as const;

const MOODS: ('😫' | '😅' | '🔥' | '🤩')[] = ['😫', '😅', '🔥', '🤩'];

export function WorkoutTab() {
  const { addWorkout, currentWorkout, startWorkout, stopWorkout, templates, personalRecords, settings } = useStore();
  const [selectedType, setSelectedType] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [intensity, setIntensity] = useState<typeof INTENSITIES[number]['name']>('medium');
  const [mood, setMood] = useState<'😫' | '😅' | '🔥' | '🤩'>('🔥');
  const [elapsed, setElapsed] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [showComplete, setShowComplete] = useState(false);
  const [lastXP, setLastXP] = useState(0);
  const [lastPRs, setLastPRs] = useState<string[]>([]);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (currentWorkout && !isPaused) {
      intervalRef.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - currentWorkout.startTime) / 1000));
      }, 1000);
    }
    return () => { if (intervalRef.current) clearInterval(intervalRef.current); };
  }, [currentWorkout, isPaused]);

  const fmt = (s: number) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  const handleTemplateSelect = (t: typeof templates[number]) => {
    setSelectedTemplate(t.id);
    setSelectedType(t.type);
    setIntensity(t.defaultIntensity);
    triggerHaptic('light');
    playSound('tap');
  };

  const handleStart = () => {
    if (!selectedType) return;
    startWorkout(selectedType, selectedTemplate ?? undefined);
    setElapsed(0);
    setIsPaused(false);
    triggerHaptic('medium');
    playSound('start');
  };

  const handlePause = () => {
    setIsPaused(!isPaused);
    triggerHaptic('light');
    playSound('pause');
  };

  const handleStop = () => {
    if (!currentWorkout) return;
    const duration = Math.max(1, Math.floor(elapsed / 60));
    const template = templates.find(t => t.id === currentWorkout.templateId);
    const calPerMin = template?.calPerMin || 8;
    const mult = INTENSITIES.find(i => i.name === intensity)!.mult;
    const cal = Math.floor(calPerMin * duration * mult);
    const xp = Math.floor((duration * 2 + cal * 0.5) * mult);

    // Detect PRs
    const prs: string[] = [];
    const durationPR = personalRecords.find(p => p.workoutType === currentWorkout.type && p.metric === 'duration');
    if (!durationPR || duration > durationPR.value) prs.push(`Longest ${currentWorkout.type}: ${duration} min`);
    const calPR = personalRecords.find(p => p.workoutType === currentWorkout.type && p.metric === 'calories');
    if (!calPR || cal > calPR.value) prs.push(`Most calories ${currentWorkout.type}: ${cal} cal`);

    addWorkout({ type: currentWorkout.type, duration, calories: cal, date: new Date().toISOString(), intensity, mood, templateId: currentWorkout.templateId });
    setLastXP(xp);
    setLastPRs(prs);
    setShowComplete(true);
    stopWorkout();
    setElapsed(0);
    setSelectedTemplate(null);
    triggerHaptic('success');
    playSound('complete');
    setTimeout(() => setShowComplete(false), 3000);
  };

  const estCal = selectedType
    ? Math.floor((templates.find(t => t.type === selectedType)?.calPerMin || 8) * (elapsed / 60 || 1) * INTENSITIES.find(i => i.name === intensity)!.mult)
    : 0;

  return (
    <div className="px-5 pt-2 space-y-5 tab-enter pb-28">
      <div className="text-center">
        <h2 className="text-xl font-black gradient-text">Workout</h2>
        <p className="text-slate-500 text-xs mt-1">{currentWorkout ? 'Timer running...' : 'Pick a template or type'}</p>
      </div>

      {/* Live timer */}
      <AnimatePresence>
        {currentWorkout && (
          <motion.div initial={{ scale: 0.9, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0.9, opacity: 0 }}
            className="glass-strong rounded-3xl p-6 text-center glow-purple">
            <motion.div animate={{ scale: [1, 1.05, 1] }} transition={{ duration: 2, repeat: Infinity }} className="text-4xl mb-2">
              {templates.find(t => t.type === currentWorkout.type)?.icon || '🏋️'}
            </motion.div>
            <p className="text-sm text-slate-400">{currentWorkout.type}</p>
            <p className="text-5xl font-black font-mono my-4">{fmt(elapsed)}</p>
            <div className="flex justify-center gap-5 mb-5">
              <div className="flex items-center gap-1 text-sm"><Flame className="w-4 h-4 text-orange-400" /><span className="font-bold">{estCal} cal</span></div>
              <div className="flex items-center gap-1 text-sm"><Zap className="w-4 h-4 text-purple-400" /><span className="font-bold">+{Math.floor(estCal * 0.5 + (elapsed / 60) * 2)} XP</span></div>
            </div>
            <div className="flex justify-center gap-3">
              <button onClick={handlePause} className="w-14 h-14 rounded-full glass flex items-center justify-center">
                {isPaused ? <Play className="w-5 h-5 text-green-400" /> : <Pause className="w-5 h-5 text-yellow-400" />}
              </button>
              <button onClick={handleStop} className="w-14 h-14 rounded-full bg-gradient-to-r from-red-500 to-pink-500 flex items-center justify-center">
                <Square className="w-5 h-5 text-white" />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Completion */}
      <AnimatePresence>
        {showComplete && (
          <motion.div initial={{ scale: 0, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} exit={{ scale: 0, opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <motion.div initial={{ y: 30 }} animate={{ y: 0 }} className="glass-strong rounded-3xl p-8 text-center max-w-xs mx-4">
              <motion.div animate={{ rotate: [0, -10, 10, 0] }} className="text-5xl mb-3">🎉</motion.div>
              <h3 className="text-xl font-black gradient-text">Done!</h3>
              <p className="text-2xl font-black text-purple-400 mt-2">+{lastXP} XP</p>
              {lastPRs.length > 0 && (
                <div className="mt-3 space-y-1">
                  {lastPRs.map((pr, i) => (
                    <div key={i} className="flex items-center gap-1 justify-center text-xs text-yellow-400">
                      <Trophy className="w-3 h-3" /> {pr}
                    </div>
                  ))}
                </div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Pre-workout */}
      {!currentWorkout && (
        <>
          {/* Templates */}
          <div className="glass rounded-2xl p-4">
            <h3 className="font-bold text-sm mb-3">Quick Templates</h3>
            <div className="grid grid-cols-2 gap-2">
              {templates.filter(t => !t.isCustom).slice(0, 8).map((t) => (
                <button key={t.id} onClick={() => handleTemplateSelect(t)}
                  className={`flex items-center gap-2 p-3 rounded-xl transition ${selectedTemplate === t.id ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/40' : 'bg-slate-800/40 hover:bg-slate-700/40'}`}>
                  <span className="text-xl">{t.icon}</span>
                  <div className="text-left min-w-0">
                    <p className="text-xs font-semibold truncate">{t.name}</p>
                    <p className="text-[10px] text-slate-500">{t.defaultDuration}min</p>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* Type selector */}
          <div className="glass rounded-2xl p-4">
            <h3 className="font-bold text-sm mb-3">Or pick type</h3>
            <div className="grid grid-cols-3 gap-2">
              {Array.from(new Set(templates.map(t => t.type))).map((type) => {
                const icon = templates.find(t => t.type === type)?.icon || '🏋️';
                return (
                  <button key={type} onClick={() => { setSelectedType(type); setSelectedTemplate(null); triggerHaptic('light'); }}
                    className={`flex flex-col items-center gap-1 p-3 rounded-xl transition ${selectedType === type && !selectedTemplate ? 'bg-gradient-to-br from-purple-500/30 to-pink-500/30 border border-purple-500/40' : 'bg-slate-800/40 hover:bg-slate-700/40'}`}>
                    <span className="text-xl">{icon}</span>
                    <span className="text-[10px] font-medium">{type}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Intensity */}
          <div className="glass rounded-2xl p-4">
            <h3 className="font-bold text-sm mb-3">Intensity</h3>
            <div className="grid grid-cols-4 gap-2">
              {INTENSITIES.map((i) => (
                <button key={i.name} onClick={() => { setIntensity(i.name); triggerHaptic('light'); }}
                  className={`flex flex-col items-center gap-1 p-2.5 rounded-xl transition ${intensity === i.name ? 'bg-purple-500/20 border border-purple-500/40' : 'bg-slate-800/40'}`}>
                  <span className="text-lg">{i.emoji}</span>
                  <span className="text-[10px] capitalize">{i.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Mood */}
          <div className="glass rounded-2xl p-4">
            <h3 className="font-bold text-sm mb-3">How do you feel?</h3>
            <div className="flex gap-2 justify-center">
              {MOODS.map((m) => (
                <button key={m} onClick={() => setMood(m)}
                  className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl transition ${mood === m ? 'bg-purple-500/30 border border-purple-500/40 scale-110' : 'bg-slate-800/40 opacity-60'}`}>
                  {m}
                </button>
              ))}
            </div>
          </div>

          <button onClick={handleStart} disabled={!selectedType}
            className="w-full py-4 rounded-2xl bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 font-bold text-lg disabled:opacity-30 shadow-lg shadow-purple-500/20 active:scale-[0.98]">
            🚀 Start Workout
          </button>
        </>
      )}
    </div>
  );
}