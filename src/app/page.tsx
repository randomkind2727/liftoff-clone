'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useStore } from '@/store/store';
import { HomeTab } from '@/components/HomeTab';
import { WorkoutTab } from '@/components/WorkoutTab';
import { SocialTab } from '@/components/SocialTab';
import { ProgressTab } from '@/components/ProgressTab';
import { ProfileTab } from '@/components/ProfileTab';
import { BottomNav } from '@/components/BottomNav';
import { ActiveWorkoutOverlay } from '@/components/ActiveWorkoutOverlay';
import { Confetti } from '@/components/Confetti';
import { Zap } from 'lucide-react';

function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-[#0a0a0f] flex items-center justify-center z-[9999]">
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="text-center"
      >
        <motion.div
          animate={{ rotate: [0, 360] }}
          transition={{ duration: 2, repeat: Infinity, ease: 'linear' }}
          className="w-20 h-20 mx-auto mb-6 relative"
        >
          <div className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 opacity-20 blur-xl" />
          <div className="relative w-full h-full rounded-full bg-gradient-to-r from-purple-500 via-pink-500 to-orange-500 flex items-center justify-center">
            <Zap className="w-10 h-10 text-white" />
          </div>
        </motion.div>
        <h1 className="text-2xl font-black gradient-text">LIFTOFF</h1>
        <p className="text-slate-500 mt-2 text-sm">Loading your fitness journey...</p>
      </motion.div>
    </div>
  );
}

export default function Home() {
  const activeTab = useStore((s) => s.activeTab);
  const currentWorkout = useStore((s) => s.currentWorkout);
  const loadDemoData = useStore((s) => s.loadDemoData);
  const workouts = useStore((s) => s.workouts);
  const [showConfetti, setShowConfetti] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  // Load demo data on first visit
  useEffect(() => {
    if (workouts.length === 0) {
      loadDemoData();
    }
  }, []);

  const renderTab = () => {
    switch (activeTab) {
      case 'home': return <HomeTab />;
      case 'workout': return <WorkoutTab />;
      case 'social': return <SocialTab />;
      case 'progress': return <ProgressTab />;
      case 'profile': return <ProfileTab />;
      default: return <HomeTab />;
    }
  };

  return (
    <div className="animated-bg min-h-[100dvh] flex flex-col max-w-md mx-auto relative overflow-hidden">
      {/* Loading Screen */}
      <AnimatePresence>
        {isLoading && <LoadingScreen />}
      </AnimatePresence>

      {/* Ambient Orbs */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden max-w-md mx-auto">
        <motion.div
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[10%] left-[-20%] w-[300px] h-[300px] bg-purple-600/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, -40, 0], y: [0, 40, 0] }}
          transition={{ duration: 25, repeat: Infinity, ease: 'linear' }}
          className="absolute bottom-[20%] right-[-20%] w-[250px] h-[250px] bg-pink-600/10 rounded-full blur-[100px]"
        />
        <motion.div
          animate={{ x: [0, 30, 0], y: [0, -50, 0] }}
          transition={{ duration: 18, repeat: Infinity, ease: 'linear' }}
          className="absolute top-[50%] right-[-10%] w-[200px] h-[200px] bg-cyan-600/8 rounded-full blur-[80px]"
        />
      </div>

      {/* Confetti */}
      {showConfetti && <Confetti />}

      {/* Main Content */}
      <main className="flex-1 relative z-10 overflow-y-auto pb-24 pt-2">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
          >
            {renderTab()}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Active Workout Overlay */}
      {currentWorkout && <ActiveWorkoutOverlay />}

      {/* Bottom Navigation */}
      <BottomNav />
    </div>
  );
}
