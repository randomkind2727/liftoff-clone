import { create } from 'zustand';

export interface Workout {
  id: string;
  type: string;
  duration: number;
  calories: number;
  xpEarned: number;
  date: string;
  intensity: 'easy' | 'medium' | 'hard' | 'beast';
  heartRate?: number;
  distance?: number;
  notes?: string;
  mood?: '😫' | '😅' | '🔥' | '🤩';
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
}

export interface Challenge {
  id: string;
  title: string;
  description: string;
  target: number;
  current: number;
  reward: number;
  expiresAt: string;
  completed: boolean;
}

export interface BodyMetric {
  id: string;
  date: string;
  weight?: number;
  bodyFat?: number;
  chest?: number;
  waist?: number;
  arms?: number;
  photo?: string;
}

export interface Friend {
  id: string;
  name: string;
  avatar: string;
  level: number;
  totalXP: number;
  streak: number;
  lastActive: string;
}

interface AppState {
  workouts: Workout[];
  totalXP: number;
  level: number;
  coins: number;
  streak: number;
  bestStreak: number;
  lastWorkoutDate: string | null;
  achievements: Achievement[];
  challenges: Challenge[];
  bodyMetrics: BodyMetric[];
  friends: Friend[];
  activeTab: 'home' | 'workout' | 'social' | 'progress' | 'profile';
  currentWorkout: { startTime: number; type: string } | null;
  addWorkout: (workout: Omit<Workout, 'id' | 'xpEarned'>) => void;
  startWorkout: (type: string) => void;
  stopWorkout: () => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addBodyMetric: (metric: Omit<BodyMetric, 'id'>) => void;
  setActiveTab: (tab: AppState['activeTab']) => void;
  completeChallenge: (id: string) => void;
  loadDemoData: () => void;
}

const XP_PER_LEVEL = 150;

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  { id: 'first_workout', name: 'First Step', description: 'Complete your first workout', icon: '🚀', unlocked: false, rarity: 'common' },
  { id: 'streak_3', name: 'On Fire', description: '3-day workout streak', icon: '🔥', unlocked: false, rarity: 'common' },
  { id: 'streak_7', name: 'Unstoppable', description: '7-day workout streak', icon: '⚡', unlocked: false, rarity: 'rare' },
  { id: 'streak_30', name: 'Iron Legend', description: '30-day streak', icon: '👑', unlocked: false, rarity: 'legendary' },
  { id: 'total_10', name: 'Dedicated', description: 'Complete 10 workouts', icon: '💪', unlocked: false, rarity: 'common' },
  { id: 'total_50', name: 'Iron Will', description: 'Complete 50 workouts', icon: '🏆', unlocked: false, rarity: 'epic' },
  { id: 'total_100', name: 'Centurion', description: 'Complete 100 workouts', icon: '💯', unlocked: false, rarity: 'legendary' },
  { id: 'calories_1000', name: 'Calorie Crusher', description: 'Burn 1000 total calories', icon: '🔥', unlocked: false, rarity: 'common' },
  { id: 'calories_10000', name: 'Inferno', description: 'Burn 10,000 total calories', icon: '☄️', unlocked: false, rarity: 'epic' },
  { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: '⭐', unlocked: false, rarity: 'rare' },
  { id: 'level_10', name: 'Elite', description: 'Reach level 10', icon: '🌟', unlocked: false, rarity: 'epic' },
  { id: 'level_25', name: 'Transcendent', description: 'Reach level 25', icon: '✨', unlocked: false, rarity: 'legendary' },
  { id: 'long_workout', name: 'Marathon', description: 'Complete a 60+ min workout', icon: '🏃', unlocked: false, rarity: 'rare' },
  { id: 'variety', name: 'Jack of All Trades', description: 'Try 5 different workout types', icon: '🎯', unlocked: false, rarity: 'rare' },
  { id: 'beast_mode', name: 'Beast Unleashed', description: 'Complete 5 beast-mode workouts', icon: '🦍', unlocked: false, rarity: 'epic' },
  { id: 'early_bird', name: 'Early Bird', description: 'Workout before 7 AM', icon: '🐦', unlocked: false, rarity: 'common' },
  { id: 'night_owl', name: 'Night Owl', description: 'Workout after 10 PM', icon: '🦉', unlocked: false, rarity: 'common' },
  { id: 'social_butterfly', name: 'Social Butterfly', description: 'Add 5 friends', icon: '🦋', unlocked: false, rarity: 'rare' },
  { id: 'coin_collector', name: 'Rich', description: 'Earn 1000 coins', icon: '💰', unlocked: false, rarity: 'epic' },
  { id: 'perfectionist', name: 'Perfectionist', description: 'Log mood on 10 workouts', icon: '🎭', unlocked: false, rarity: 'rare' },
];

const INITIAL_CHALLENGES: Challenge[] = [
  { id: 'ch1', title: 'Week Warrior', description: 'Complete 5 workouts this week', target: 5, current: 0, reward: 200, expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(), completed: false },
  { id: 'ch2', title: 'Calorie Inferno', description: 'Burn 2000 calories this week', target: 2000, current: 0, reward: 300, expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(), completed: false },
  { id: 'ch3', title: 'Streak Master', description: 'Maintain a 7-day streak', target: 7, current: 0, reward: 500, expiresAt: new Date(Date.now() + 14 * 86400000).toISOString(), completed: false },
  { id: 'ch4', title: 'Variety Pack', description: 'Try 4 different workout types this week', target: 4, current: 0, reward: 250, expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(), completed: false },
];

const MOCK_FRIENDS: Friend[] = [
  { id: 'f1', name: 'Alex Thunder', avatar: '⚡', level: 12, totalXP: 1800, streak: 15, lastActive: new Date().toISOString() },
  { id: 'f2', name: 'Sarah Iron', avatar: '💪', level: 9, totalXP: 1350, streak: 8, lastActive: new Date().toISOString() },
  { id: 'f3', name: 'Mike Beast', avatar: '🦍', level: 15, totalXP: 2250, streak: 22, lastActive: new Date(Date.now() - 86400000).toISOString() },
  { id: 'f4', name: 'Luna Flex', avatar: '🌙', level: 7, totalXP: 1050, streak: 5, lastActive: new Date(Date.now() - 86400000).toISOString() },
  { id: 'f5', name: 'Jake Blaze', avatar: '🔥', level: 11, totalXP: 1650, streak: 12, lastActive: new Date().toISOString() },
];

function calculateLevel(xp: number): number {
  return Math.floor(xp / XP_PER_LEVEL) + 1;
}

function calculateStreak(workouts: Workout[]): number {
  if (workouts.length === 0) return 0;
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  const dateArray = workouts.map(w => { const d = new Date(w.date); d.setHours(0, 0, 0, 0); return d.getTime(); });
  const uniqueDates = Array.from(new Set(dateArray)).sort((a, b) => b - a);
  if (uniqueDates.length === 0) return 0;
  const mostRecent = new Date(uniqueDates[0]);
  const diffFromToday = Math.floor((today.getTime() - mostRecent.getTime()) / (1000 * 60 * 60 * 24));
  if (diffFromToday > 1) return 0;
  let streak = 1;
  for (let i = 1; i < uniqueDates.length; i++) {
    const diff = Math.floor((uniqueDates[i - 1] - uniqueDates[i]) / (1000 * 60 * 60 * 24));
    if (diff === 1) streak++; else break;
  }
  return streak;
}

export const useStore = create<AppState>()(
    (set, get) => ({
      workouts: [],
      totalXP: 0,
      level: 1,
      coins: 100,
      streak: 0,
      bestStreak: 0,
      lastWorkoutDate: null,
      achievements: INITIAL_ACHIEVEMENTS,
      challenges: INITIAL_CHALLENGES,
      bodyMetrics: [],
      friends: MOCK_FRIENDS,
      activeTab: 'home',
      currentWorkout: null,

      addWorkout: (workout) => {
        const state = get();
        const intensityMultiplier = { easy: 1, medium: 1.2, hard: 1.5, beast: 2 }[workout.intensity];
        const xpEarned = Math.floor((workout.duration * 2 + workout.calories * 0.5) * intensityMultiplier);
        const newWorkout: Workout = { ...workout, id: crypto.randomUUID(), xpEarned };
        const newWorkouts = [...state.workouts, newWorkout];
        const newTotalXP = state.totalXP + xpEarned;
        const newLevel = calculateLevel(newTotalXP);
        const newStreak = calculateStreak(newWorkouts);
        const coinsEarned = Math.floor(xpEarned * 0.5);

        const updatedAchievements = [...state.achievements];
        const unlock = (id: string) => {
          const ach = updatedAchievements.find(a => a.id === id);
          if (ach && !ach.unlocked) { ach.unlocked = true; ach.unlockedAt = new Date().toISOString(); }
        };

        if (newWorkouts.length >= 1) unlock('first_workout');
        if (newWorkouts.length >= 10) unlock('total_10');
        if (newWorkouts.length >= 50) unlock('total_50');
        if (newWorkouts.length >= 100) unlock('total_100');
        if (newStreak >= 3) unlock('streak_3');
        if (newStreak >= 7) unlock('streak_7');
        if (newStreak >= 30) unlock('streak_30');
        if (newLevel >= 5) unlock('level_5');
        if (newLevel >= 10) unlock('level_10');
        if (newLevel >= 25) unlock('level_25');
        if (workout.duration >= 60) unlock('long_workout');
        if (workout.intensity === 'beast') { const beastCount = newWorkouts.filter(w => w.intensity === 'beast').length; if (beastCount >= 5) unlock('beast_mode'); }
        if (workout.mood) { const moodCount = newWorkouts.filter(w => w.mood).length; if (moodCount >= 10) unlock('perfectionist'); }
        const hour = new Date(workout.date).getHours();
        if (hour < 7) unlock('early_bird');
        if (hour >= 22) unlock('night_owl');
        const totalCalories = newWorkouts.reduce((sum, w) => sum + w.calories, 0);
        if (totalCalories >= 1000) unlock('calories_1000');
        if (totalCalories >= 10000) unlock('calories_10000');
        const uniqueTypes = Array.from(new Set(newWorkouts.map(w => w.type)));
        if (uniqueTypes.length >= 5) unlock('variety');

        const newTotalCoins = state.coins + coinsEarned;
        if (newTotalCoins >= 1000) unlock('coin_collector');

        const updatedChallenges = state.challenges.map(ch => {
          if (ch.completed) return ch;
          if (ch.id === 'ch1') return { ...ch, current: ch.current + 1 };
          if (ch.id === 'ch2') return { ...ch, current: ch.current + workout.calories };
          if (ch.id === 'ch3') return { ...ch, current: newStreak };
          if (ch.id === 'ch4') { const weekTypes = Array.from(new Set(newWorkouts.filter(w => new Date(w.date) > new Date(Date.now() - 7 * 86400000)).map(w => w.type))); return { ...ch, current: weekTypes.length }; }
          return ch;
        });

        set({
          workouts: newWorkouts,
          totalXP: newTotalXP,
          level: newLevel,
          coins: newTotalCoins,
          streak: newStreak,
          bestStreak: Math.max(state.bestStreak, newStreak),
          lastWorkoutDate: new Date().toISOString(),
          achievements: updatedAchievements,
          challenges: updatedChallenges,
        });
      },

      startWorkout: (type) => set({ currentWorkout: { startTime: Date.now(), type } }),
      stopWorkout: () => set({ currentWorkout: null }),
      addCoins: (amount) => set((s) => ({ coins: s.coins + amount })),
      spendCoins: (amount) => {
        const s = get();
        if (s.coins >= amount) { set({ coins: s.coins - amount }); return true; }
        return false;
      },
      addBodyMetric: (metric) => set((s) => ({ bodyMetrics: [...s.bodyMetrics, { ...metric, id: crypto.randomUUID() }] })),
      setActiveTab: (tab) => set({ activeTab: tab }),
      completeChallenge: (id) => set((s) => ({
        challenges: s.challenges.map(ch => ch.id === id ? { ...ch, completed: true } : ch),
        coins: s.coins + (s.challenges.find(ch => ch.id === id)?.reward || 0),
      })),

      loadDemoData: () => {
        const demoWorkouts: Workout[] = [
          { id: 'd1', type: 'Running', duration: 30, calories: 280, xpEarned: 200, date: new Date(Date.now() - 86400000 * 6).toISOString(), intensity: 'medium', mood: '🔥' },
          { id: 'd2', type: 'Weightlifting', duration: 45, calories: 320, xpEarned: 250, date: new Date(Date.now() - 86400000 * 5).toISOString(), intensity: 'hard', mood: '😅' },
          { id: 'd3', type: 'Yoga', duration: 60, calories: 180, xpEarned: 210, date: new Date(Date.now() - 86400000 * 4).toISOString(), intensity: 'easy', mood: '🤩' },
          { id: 'd4', type: 'HIIT', duration: 25, calories: 380, xpEarned: 240, date: new Date(Date.now() - 86400000 * 3).toISOString(), intensity: 'beast', mood: '😫' },
          { id: 'd5', type: 'Cycling', duration: 40, calories: 300, xpEarned: 230, date: new Date(Date.now() - 86400000 * 2).toISOString(), intensity: 'medium', mood: '😅' },
          { id: 'd6', type: 'Swimming', duration: 35, calories: 260, xpEarned: 200, date: new Date(Date.now() - 86400000 * 1).toISOString(), intensity: 'hard', mood: '🔥' },
          { id: 'd7', type: 'Running', duration: 20, calories: 180, xpEarned: 130, date: new Date().toISOString(), intensity: 'medium', mood: '🔥' },
        ];
        const demoXP = demoWorkouts.reduce((s, w) => s + w.xpEarned, 0);
        const demoLevel = calculateLevel(demoXP);
        set({
          workouts: demoWorkouts,
          totalXP: demoXP,
          level: demoLevel,
          coins: Math.floor(demoXP * 0.5) + 100,
          streak: 7,
          bestStreak: 7,
          lastWorkoutDate: new Date().toISOString(),
          achievements: INITIAL_ACHIEVEMENTS.map(a => {
            if (['first_workout', 'streak_3', 'streak_7', 'calories_1000', 'long_workout', 'variety'].includes(a.id)) {
              return { ...a, unlocked: true, unlockedAt: new Date().toISOString() };
            }
            return a;
          }),
          challenges: INITIAL_CHALLENGES.map(ch => ({
            ...ch,
            current: ch.id === 'ch1' ? 5 : ch.id === 'ch2' ? 1500 : ch.id === 'ch3' ? 7 : 4,
          })),
        });
      },
    }),
);
