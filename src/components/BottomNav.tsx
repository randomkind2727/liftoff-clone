'use client';

import { motion } from 'framer-motion';
import { useStore } from '@/store/store';
import { Home, Dumbbell, Users, BarChart3, User } from 'lucide-react';

const tabs = [
  { id: 'home' as const, icon: Home, label: 'Home' },
  { id: 'workout' as const, icon: Dumbbell, label: 'Workout' },
  { id: 'social' as const, icon: Users, label: 'Social' },
  { id: 'progress' as const, icon: BarChart3, label: 'Progress' },
  { id: 'profile' as const, icon: User, label: 'Profile' },
];

export function BottomNav() {
  const { activeTab, setActiveTab, currentWorkout } = useStore();

  return (
    <div className="fixed bottom-0 left-0 right-0 z-40 safe-bottom">
      <div className="max-w-md mx-auto">
        <div className="glass-strong border-t border-white/5 px-2 pb-2 pt-1">
          <div className="flex items-center justify-around">
            {tabs.map((tab) => {
              const isActive = activeTab === tab.id;
              const Icon = tab.icon;

              return (
                <motion.button
                  key={tab.id}
                  whileTap={{ scale: 0.85 }}
                  onClick={() => setActiveTab(tab.id)}
                  className={`relative flex flex-col items-center gap-0.5 py-2 px-3 rounded-xl transition-all ${
                    isActive ? 'text-white' : 'text-slate-500'
                  }`}
                >
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute inset-0 bg-gradient-to-t from-purple-500/20 to-transparent rounded-xl"
                      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
                    />
                  )}
                  <Icon className="w-5 h-5 relative z-10" />
                  <span className="text-[10px] font-medium relative z-10">{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
