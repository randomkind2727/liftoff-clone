import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Workout {
  id: string;
  type: string;
  duration: number;
  calories: number;
  xpEarned: number;
  date: string;
  notes?: string;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

interface WorkoutState {
  workouts: Workout[];
  totalXP: number;
  level: number;
  streak: number;
  lastWorkoutDate: string | null;
  achievements: Achievement[];
  addWorkout: (workout: Omit<Workout, 'id' | 'xpEarned'>) => void;
  unlockAchievement: (id: string) => void;
  loadDemoData: () => void;
}

const DEMO_WORKOUTS: Workout[] = [
  { id: 'demo-1', type: 'Running', duration: 30, calories: 280, xpEarned: 200, date: new Date(Date.now() - 86400000 * 6).toISOString(), notes: 'Morning jog, felt great!' },
  { id: 'demo-2', type: 'Weightlifting', duration: 45, calories: 320, xpEarned: 250, date: new Date(Date.now() - 86400000 * 5).toISOString(), notes: 'Leg day' },
  { id: 'demo-3', type: 'Yoga', duration: 60, calories: 180, xpEarned: 210, date: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 'demo-4', type: 'HIIT', duration: 25, calories: 380, xpEarned: 240, date: new Date(Date.now() - 86400000 * 3).toISOString(), notes: 'Intense session!' },
  { id: 'demo-5', type: 'Cycling', duration: 40, calories: 300, xpEarned: 230, date: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'demo-6', type: 'Swimming', duration: 35, calories: 260, xpEarned: 200, date: new Date(Date.now() - 86400000 * 1).toISOString(), notes: 'Pool was empty, great laps' },
  { id: 'demo-7', type: 'Running', duration: 20, calories: 180, xpEarned: 130, date: new Date().toISOString() },
];

const DEMO_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_workout', name: 'First Step', description: 'Complete your first workout', icon: '🚀', unlocked: true, unlockedAt: new Date(Date.now() - 86400000 * 6).toISOString() },
  { id: 'streak_3', name: 'On Fire', description: '3-day workout streak', icon: '🔥', unlocked: true, unlockedAt: new Date(Date.now() - 86400000 * 3).toISOString() },
  { id: 'streak_7', name: 'Unstoppable', description: '7-day workout streak', icon: '⚡', unlocked: true, unlockedAt: new Date().toISOString() },
  { id: 'total_10', name: 'Dedicated', description: 'Complete 10 workouts', icon: '💪', unlocked: false },
  { id: 'total_50', name: 'Iron Will', description: 'Complete 50 workouts', icon: '🏆', unlocked: false },
  { id: 'calories_1000', name: 'Calorie Crusher', description: 'Burn 1000 total calories', icon: '🔥', unlocked: true, unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
  { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: '⭐', unlocked: false },
  { id: 'level_10', name: 'Elite', description: 'Reach level 10', icon: '👑', unlocked: false },
  { id: 'long_workout', name: 'Marathon', description: 'Complete a 60+ minute workout', icon: '🏃', unlocked: true, unlockedAt: new Date(Date.now() - 86400000 * 4).toISOString() },
  { id: 'variety', name: 'Jack of All Trades', description: 'Try 5 different workout types', icon: '🎯', unlocked: true, unlockedAt: new Date(Date.now() - 86400000 * 2).toISOString() },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_workout', name: 'First Step', description: 'Complete your first workout', icon: '🚀', unlocked: false },
  { id: 'streak_3', name: 'On Fire', description: '3-day workout streak', icon: '🔥', unlocked: false },
  { id: 'streak_7', name: 'Unstoppable', description: '7-day workout streak', icon: '⚡', unlocked: false },
  { id: 'total_10', name: 'Dedicated', description: 'Complete 10 workouts', icon: '💪', unlocked: false },
  { id: 'total_50', name: 'Iron Will', description: 'Complete 50 workouts', icon: '🏆', unlocked: false },
  { id: 'calories_1000', name: 'Calorie Crusher', description: 'Burn 1000 total calories', icon: '🔥', unlocked: false },
  { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: '⭐', unlocked: false },
  { id: 'level_10', name: 'Elite', description: 'Reach level 10', icon: '👑', unlocked: false },
  { id: 'long_workout', name: 'Marathon', description: 'Complete a 60+ minute workout', icon: '🏃', unlocked: false },
  { id: 'variety', name: 'Jack of All Trades', description: 'Try 5 different workout types', icon: '🎯', unlocked: false },
];

const XP_PER_LEVEL = 100;

function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

function calculateStreak(workouts: Workout[]): number {
  if (workouts.length === 0) return 0;

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const dateArray = workouts.map(w => {
    const d = new Date(w.date);
    d.setHours(0, 0, 0, 0);
    return d.getTime();
  });
  const uniqueDates = Array.from(new Set(dateArray)).sort((a, b) => b - a);

  if (uniqueDates.length === 0) return 0;

  const mostRecent = new Date(uniqueDates[0]);
  const diffFromToday = Math.floor((today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24));

  if (diffFromToday > 1) return 0;

  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const diff = Math.floor((uniqueDates[i - 1] - uniqueDates[i]) / (1000 * 60 * 60 * 24));
    if (diff === 1) {
      streak++;
    } else {
      break;
    }
  }

  return streak;
}

export const useWorkoutStore = create<WorkoutState>()(
  persist(
    (set, get) => ({
      workouts: [],
      totalXP: 0,
      level: 1,
      streak: 0,
      lastWorkoutDate: null,
      achievements: INITIAL_ACHIEVEMENTS,

      addWorkout: (workout) => {
        const state = get();
        const xpEarned = Math.floor(workout.duration * 2 + workout.calories * 0.5);
        const newWorkout: Workout = {
          ...workout,
          id: crypto.randomUUID(),
          xpEarned,
        };

        const newWorkouts = [...state.workouts, newWorkout];
        const newTotalXP = state.totalXP + xpEarned;
        const newLevel = calculateLevel(newTotalXP);
        const newStreak = calculateStreak(newWorkouts);

        const updatedAchievements = [...state.achievements];
        const unlock = (id: string) => {
          const ach = updatedAchievements.find(a => a.id === id);
          if (ach && !ach.unlocked) {
            ach.unlocked = true;
            ach.unlockedAt = new Date().toISOString();
          }
        };

        if (newWorkouts.length >= 1) unlock('first_workout');
        if (newWorkouts.length >= 10) unlock('total_10');
        if (newWorkouts.length >= 50) unlock('total_50');
        if (newStreak >= 3) unlock('streak_3');
        if (newStreak >= 7) unlock('streak_7');
        if (newLevel >= 5) unlock('level_5');
        if (newLevel >= 10) unlock('level_10');
        if (workout.duration >= 60) unlock('long_workout');

        const totalCalories = newWorkouts.reduce((sum, w) => sum + w.calories, 0);
        if (totalCalories >= 1000) unlock('calories_1000');

        const typeArray = newWorkouts.map(w => w.type);
        const uniqueTypes = Array.from(new Set(typeArray));
        if (uniqueTypes.length >= 5) unlock('variety');

        set({
          workouts: newWorkouts,
          totalXP: newTotalXP,
          level: newLevel,
          streak: newStreak,
          lastWorkoutDate: new Date().toISOString(),
          achievements: updatedAchievements,
        });
      },

      unlockAchievement: (id) => {
        set((state) => ({
          achievements: state.achievements.map(a =>
            a.id === id ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a
          ),
        }));
      },

      loadDemoData: () => {
        const demoXP = DEMO_WORKOUTS.reduce((sum, w) => sum + w.xpEarned, 0);
        set({
          workouts: DEMO_WORKOUTS,
          totalXP: demoXP,
          level: calculateLevel(demoXP),
          streak: 7,
          lastWorkoutDate: new Date().toISOString(),
          achievements: DEMO_ACHIEVEMENTS,
        });
      },
    }),
    {
      name: 'liftoff-workout-storage',
    }
  )
);
