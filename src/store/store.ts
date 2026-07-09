import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export interface Workout {
  id: string;
  type: string;
  duration: number; // minutes
  calories: number;
  xpEarned: number;
  date: string; // ISO
  intensity: 'easy' | 'medium' | 'hard' | 'beast';
  heartRate?: number;
  distance?: number; // km
  notes?: string;
  mood?: '😫' | '😅' | '🔥' | '🤩';
  templateId?: string; // reference to workout template
}

export interface WorkoutTemplate {
  id: string;
  name: string;
  icon: string;
  type: string;
  defaultDuration: number;
  defaultIntensity: 'easy' | 'medium' | 'hard' | 'beast';
  calPerMin: number;
  description: string;
  isCustom: boolean;
}

export interface PersonalRecord {
  id: string;
  workoutType: string;
  metric: 'duration' | 'calories' | 'distance' | 'intensity';
  value: number;
  unit: string;
  date: string;
}

export interface WeeklyGoal {
  id: string;
  type: 'workouts' | 'calories' | 'minutes' | 'xp';
  target: number;
  current: number;
  weekStart: string;
  completed: boolean;
}

export interface Achievement {
  id: string;
  name: string;
  description: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
  rarity: 'common' | 'rare' | 'epic' | 'legendary';
  category: 'streak' | 'volume' | 'intensity' | 'social' | 'special';
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
  type: 'daily' | 'weekly' | 'monthly';
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

export interface Settings {
  hapticsEnabled: boolean;
  soundsEnabled: boolean;
  reducedMotion: boolean;
  theme: 'dark' | 'light' | 'system';
  units: 'metric' | 'imperial';
  notificationsEnabled: boolean;
  workoutReminderTime?: string; // HH:mm
}

interface AppState {
  // Core data
  workouts: Workout[];
  templates: WorkoutTemplate[];
  personalRecords: PersonalRecord[];
  weeklyGoals: WeeklyGoal[];
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
  settings: Settings;
  
  // UI state
  activeTab: 'home' | 'workout' | 'social' | 'progress' | 'profile';
  currentWorkout: { startTime: number; type: string; templateId?: string } | null;
  
  // Actions - Core
  addWorkout: (workout: Omit<Workout, 'id' | 'xpEarned'>) => void;
  startWorkout: (type: string, templateId?: string) => void;
  stopWorkout: () => void;
  addCoins: (amount: number) => void;
  spendCoins: (amount: number) => boolean;
  addBodyMetric: (metric: Omit<BodyMetric, 'id'>) => void;
  setActiveTab: (tab: AppState['activeTab']) => void;
  completeChallenge: (id: string) => void;
  loadDemoData: () => void;
  
  // Actions - Templates
  addTemplate: (template: Omit<WorkoutTemplate, 'id'>) => void;
  deleteTemplate: (id: string) => void;
  getTemplatesForType: (type: string) => WorkoutTemplate[];
  
  // Actions - PRs
  checkAndUpdatePRs: (workout: Workout) => void;
  getPRForType: (type: string) => PersonalRecord[];
  
  // Actions - Weekly Goals
  updateWeeklyGoals: () => void;
  checkWeeklyGoals: () => void;
  
  // Actions - Settings
  updateSettings: (settings: Partial<Settings>) => void;
  
  // Actions - Achievements
  checkAchievements: (workout: Workout) => void;
}

const XP_PER_LEVEL = 150;
const STORAGE_KEY = 'liftoff-v2';

const DEFAULT_TEMPLATES: WorkoutTemplate[] = [
  { id: 't1', name: 'Easy Run', icon: '🏃', type: 'Running', defaultDuration: 30, defaultIntensity: 'medium', calPerMin: 10, description: 'Steady pace jog', isCustom: false },
  { id: 't2', name: 'HIIT Sprints', icon: '⚡', type: 'Running', defaultDuration: 20, defaultIntensity: 'beast', calPerMin: 15, description: '30s on / 30s off', isCustom: false },
  { id: 't3', name: 'Long Ride', icon: '🚴', type: 'Cycling', defaultDuration: 60, defaultIntensity: 'medium', calPerMin: 8, description: 'Endurance cycling', isCustom: false },
  { id: 't4', name: 'Spin Class', icon: '🚴', type: 'Cycling', defaultDuration: 45, defaultIntensity: 'hard', calPerMin: 12, description: 'High intensity intervals', isCustom: false },
  { id: 't5', name: 'Lap Swimming', icon: '🏊', type: 'Swimming', defaultDuration: 30, defaultIntensity: 'medium', calPerMin: 12, description: 'Continuous laps', isCustom: false },
  { id: 't6', name: 'Heavy Lifting', icon: '🏋️', type: 'Weights', defaultDuration: 45, defaultIntensity: 'hard', calPerMin: 6, description: 'Compound movements', isCustom: false },
  { id: 't7', name: 'Bodyweight Pump', icon: '🏋️', type: 'Weights', defaultDuration: 25, defaultIntensity: 'medium', calPerMin: 7, description: 'Push/pull/squats', isCustom: false },
  { id: 't8', name: 'Vinyasa Flow', icon: '🧘', type: 'Yoga', defaultDuration: 45, defaultIntensity: 'easy', calPerMin: 4, description: 'Dynamic flow', isCustom: false },
  { id: 't9', name: 'Power Yoga', icon: '🧘', type: 'Yoga', defaultDuration: 30, defaultIntensity: 'medium', calPerMin: 5, description: 'Strength focused', isCustom: false },
  { id: 't10', name: 'Tabata', icon: '⚡', type: 'HIIT', defaultDuration: 16, defaultIntensity: 'beast', calPerMin: 15, description: '20s/10s x 8 rounds', isCustom: false },
];

const INITIAL_ACHIEVEMENTS: Achievement[] = [
  // Streak
  { id: 'first_workout', name: 'First Step', description: 'Complete your first workout', icon: '🚀', unlocked: false, rarity: 'common', category: 'streak' },
  { id: 'streak_3', name: 'On Fire', description: '3-day workout streak', icon: '🔥', unlocked: false, rarity: 'common', category: 'streak' },
  { id: 'streak_7', name: 'Unstoppable', description: '7-day workout streak', icon: '⚡', unlocked: false, rarity: 'rare', category: 'streak' },
  { id: 'streak_14', name: 'Two Weeks Strong', description: '14-day workout streak', icon: '💪', unlocked: false, rarity: 'rare', category: 'streak' },
  { id: 'streak_30', name: 'Iron Legend', description: '30-day streak', icon: '👑', unlocked: false, rarity: 'legendary', category: 'streak' },
  { id: 'streak_100', name: 'Century', description: '100-day streak', icon: '💯', unlocked: false, rarity: 'legendary', category: 'streak' },
  // Volume
  { id: 'total_10', name: 'Dedicated', description: 'Complete 10 workouts', icon: '💪', unlocked: false, rarity: 'common', category: 'volume' },
  { id: 'total_50', name: 'Iron Will', description: 'Complete 50 workouts', icon: '🏆', unlocked: false, rarity: 'epic', category: 'volume' },
  { id: 'total_100', name: 'Centurion', description: 'Complete 100 workouts', icon: '💯', unlocked: false, rarity: 'legendary', category: 'volume' },
  { id: 'total_500', name: 'Machine', description: 'Complete 500 workouts', icon: '🤖', unlocked: false, rarity: 'legendary', category: 'volume' },
  { id: 'calories_1000', name: 'Calorie Crusher', description: 'Burn 1000 total calories', icon: '🔥', unlocked: false, rarity: 'common', category: 'volume' },
  { id: 'calories_10000', name: 'Inferno', description: 'Burn 10,000 total calories', icon: '☄️', unlocked: false, rarity: 'epic', category: 'volume' },
  { id: 'calories_50000', name: 'Furnace', description: 'Burn 50,000 total calories', icon: '🌋', unlocked: false, rarity: 'legendary', category: 'volume' },
  { id: 'hours_100', name: 'Time Keeper', description: 'Log 100 hours of exercise', icon: '⏱️', unlocked: false, rarity: 'epic', category: 'volume' },
  // Intensity
  { id: 'level_5', name: 'Rising Star', description: 'Reach level 5', icon: '⭐', unlocked: false, rarity: 'rare', category: 'intensity' },
  { id: 'level_10', name: 'Elite', description: 'Reach level 10', icon: '🌟', unlocked: false, rarity: 'epic', category: 'intensity' },
  { id: 'level_25', name: 'Transcendent', description: 'Reach level 25', icon: '✨', unlocked: false, rarity: 'legendary', category: 'intensity' },
  { id: 'level_50', name: 'Demigod', description: 'Reach level 50', icon: '🦸', unlocked: false, rarity: 'legendary', category: 'intensity' },
  { id: 'long_workout', name: 'Marathon', description: 'Complete a 60+ min workout', icon: '🏃', unlocked: false, rarity: 'rare', category: 'intensity' },
  { id: 'beast_mode', name: 'Beast Unleashed', description: 'Complete 5 beast-mode workouts', icon: '🦍', unlocked: false, rarity: 'epic', category: 'intensity' },
  { id: 'beast_25', name: 'Apex Predator', description: 'Complete 25 beast-mode workouts', icon: '🦖', unlocked: false, rarity: 'legendary', category: 'intensity' },
  // Social
  { id: 'early_bird', name: 'Early Bird', description: 'Workout before 7 AM', icon: '🐦', unlocked: false, rarity: 'common', category: 'social' },
  { id: 'night_owl', name: 'Night Owl', description: 'Workout after 10 PM', icon: '🦉', unlocked: false, rarity: 'common', category: 'social' },
  { id: 'social_butterfly', name: 'Social Butterfly', description: 'Add 5 friends', icon: '🦋', unlocked: false, rarity: 'rare', category: 'social' },
  { id: 'coin_collector', name: 'Rich', description: 'Earn 1000 coins', icon: '💰', unlocked: false, rarity: 'epic', category: 'social' },
  { id: 'perfectionist', name: 'Perfectionist', description: 'Log mood on 10 workouts', icon: '🎭', unlocked: false, rarity: 'rare', category: 'social' },
  // Special
  { id: 'variety', name: 'Jack of All Trades', description: 'Try 5 different workout types', icon: '🎯', unlocked: false, rarity: 'rare', category: 'special' },
  { id: 'pr_hunter', name: 'Record Breaker', description: 'Set 10 personal records', icon: '📈', unlocked: false, rarity: 'epic', category: 'special' },
  { id: 'comeback', name: 'Comeback Kid', description: 'Workout after 7+ days off', icon: '🔄', unlocked: false, rarity: 'rare', category: 'special' },
];

const INITIAL_CHALLENGES: Challenge[] = [
  { id: 'ch1', title: 'Week Warrior', description: 'Complete 5 workouts this week', target: 5, current: 0, reward: 200, expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(), completed: false, type: 'weekly' },
  { id: 'ch2', title: 'Calorie Inferno', description: 'Burn 2000 calories this week', target: 2000, current: 0, reward: 300, expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(), completed: false, type: 'weekly' },
  { id: 'ch3', title: 'Streak Master', description: 'Maintain a 7-day streak', target: 7, current: 0, reward: 500, expiresAt: new Date(Date.now() + 14 * 86400000).toISOString(), completed: false, type: 'weekly' },
  { id: 'ch4', title: 'Variety Pack', description: 'Try 4 different workout types this week', target: 4, current: 0, reward: 250, expiresAt: new Date(Date.now() + 7 * 86400000).toISOString(), completed: false, type: 'weekly' },
  { id: 'ch5', title: 'Daily Grind', description: 'Complete a workout today', target: 1, current: 0, reward: 50, expiresAt: new Date(Date.now() + 86400000).toISOString(), completed: false, type: 'daily' },
  { id: 'ch6', title: 'Beast Day', description: 'Complete a beast-mode workout today', target: 1, current: 0, reward: 100, expiresAt: new Date(Date.now() + 86400000).toISOString(), completed: false, type: 'daily' },
];

const MOCK_FRIENDS: Friend[] = [
  { id: 'f1', name: 'Alex Thunder', avatar: '⚡', level: 12, totalXP: 1800, streak: 15, lastActive: new Date().toISOString() },
  { id: 'f2', name: 'Sarah Iron', avatar: '💪', level: 9, totalXP: 1350, streak: 8, lastActive: new Date().toISOString() },
  { id: 'f3', name: 'Mike Beast', avatar: '🦍', level: 15, totalXP: 2250, streak: 22, lastActive: new Date(Date.now() - 86400000).toISOString() },
  { id: 'f4', name: 'Luna Flex', avatar: '🌙', level: 7, totalXP: 1050, streak: 5, lastActive: new Date(Date.now() - 86400000).toISOString() },
  { id: 'f5', name: 'Jake Blaze', avatar: '🔥', level: 11, totalXP: 1650, streak: 12, lastActive: new Date().toISOString() },
];

const DEFAULT_SETTINGS: Settings = {
  hapticsEnabled: true,
  soundsEnabled: true,
  reducedMotion: false,
  theme: 'dark',
  units: 'metric',
  notificationsEnabled: true,
};

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

function getWeekStart(date = new Date()): string {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() - d.getDay());
  return d.toISOString();
}

export const useStore = create<AppState>()(
  persist(
    (set, get) => ({
      workouts: [],
      templates: DEFAULT_TEMPLATES,
      personalRecords: [],
      weeklyGoals: [],
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
      settings: DEFAULT_SETTINGS,
      activeTab: 'home',
      currentWorkout: null,

      // Core actions
      addWorkout: (workout) => {
        const state = get();
        const intensityMult = { easy: 1, medium: 1.2, hard: 1.5, beast: 2 }[workout.intensity];
        const xpEarned = Math.floor((workout.duration * 2 + workout.calories * 0.5) * intensityMult);
        const newWorkout: Workout = { ...workout, id: crypto.randomUUID(), xpEarned };
        const newWorkouts = [...state.workouts, newWorkout];
        const newTotalXP = state.totalXP + xpEarned;
        const newLevel = calculateLevel(newTotalXP);
        const newStreak = calculateStreak(newWorkouts);
        const coinsEarned = Math.floor(xpEarned * 0.5);
        const newTotalCoins = state.coins + coinsEarned;

        // Check achievements
        const updatedAchievements = [...state.achievements];
        const unlock = (id: string) => {
          const ach = updatedAchievements.find(a => a.id === id);
          if (ach && !ach.unlocked) { ach.unlocked = true; ach.unlockedAt = new Date().toISOString(); }
        };

        if (newWorkouts.length >= 1) unlock('first_workout');
        if (newWorkouts.length >= 10) unlock('total_10');
        if (newWorkouts.length >= 50) unlock('total_50');
        if (newWorkouts.length >= 100) unlock('total_100');
        if (newWorkouts.length >= 500) unlock('total_500');
        if (newStreak >= 3) unlock('streak_3');
        if (newStreak >= 7) unlock('streak_7');
        if (newStreak >= 14) unlock('streak_14');
        if (newStreak >= 30) unlock('streak_30');
        if (newStreak >= 100) unlock('streak_100');
        if (newLevel >= 5) unlock('level_5');
        if (newLevel >= 10) unlock('level_10');
        if (newLevel >= 25) unlock('level_25');
        if (newLevel >= 50) unlock('level_50');
        if (workout.duration >= 60) unlock('long_workout');
        if (workout.intensity === 'beast') { 
          const beastCount = newWorkouts.filter(w => w.intensity === 'beast').length; 
          if (beastCount >= 5) unlock('beast_mode');
          if (beastCount >= 25) unlock('beast_25');
        }
        if (workout.mood) { 
          const moodCount = newWorkouts.filter(w => w.mood).length; 
          if (moodCount >= 10) unlock('perfectionist'); 
        }
        const hour = new Date(workout.date).getHours();
        if (hour < 7) unlock('early_bird');
        if (hour >= 22) unlock('night_owl');
        const totalCalories = newWorkouts.reduce((sum, w) => sum + w.calories, 0);
        if (totalCalories >= 1000) unlock('calories_1000');
        if (totalCalories >= 10000) unlock('calories_10000');
        if (totalCalories >= 50000) unlock('calories_50000');
        const totalMinutes = newWorkouts.reduce((sum, w) => sum + w.duration, 0);
        if (totalMinutes >= 6000) unlock('hours_100');
        const uniqueTypes = Array.from(new Set(newWorkouts.map(w => w.type)));
        if (uniqueTypes.length >= 5) unlock('variety');
        if (newTotalCoins >= 1000) unlock('coin_collector');
        
        // Comeback check
        if (state.lastWorkoutDate) {
          const daysSince = Math.floor((Date.now() - new Date(state.lastWorkoutDate).getTime()) / 86400000);
          if (daysSince >= 7) unlock('comeback');
        }

        // Check PRs
        get().checkAndUpdatePRs(newWorkout);

        // Update challenges
        const updatedChallenges = state.challenges.map(ch => {
          if (ch.completed) return ch;
          if (ch.id === 'ch1') return { ...ch, current: ch.current + 1 };
          if (ch.id === 'ch2') return { ...ch, current: ch.current + workout.calories };
          if (ch.id === 'ch3') return { ...ch, current: newStreak };
          if (ch.id === 'ch4') { 
            const weekTypes = Array.from(new Set(newWorkouts.filter(w => new Date(w.date) > new Date(Date.now() - 7 * 86400000)).map(w => w.type))); 
            return { ...ch, current: weekTypes.length }; 
          }
          if (ch.id === 'ch5') return { ...ch, current: ch.current + 1 };
          if (ch.id === 'ch6' && workout.intensity === 'beast') return { ...ch, current: 1 };
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

      startWorkout: (type, templateId) => set({ currentWorkout: { startTime: Date.now(), type, templateId } }),
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
            current: ch.id === 'ch1' ? 5 : ch.id === 'ch2' ? 1500 : ch.id === 'ch3' ? 7 : ch.id === 'ch4' ? 4 : 0,
          })),
        });
      },

      // Template actions
      addTemplate: (template) => set((s) => ({ templates: [...s.templates, { ...template, id: crypto.randomUUID() }] })),
      deleteTemplate: (id) => set((s) => ({ templates: s.templates.filter(t => t.id !== id) })),
      getTemplatesForType: (type) => get().templates.filter(t => t.type === type),

      // PR actions
      checkAndUpdatePRs: (workout) => {
        const state = get();
        const updates: PersonalRecord[] = [];
        
        // Duration PR
        const durationPR = state.personalRecords.find(p => p.workoutType === workout.type && p.metric === 'duration');
        if (!durationPR || workout.duration > durationPR.value) {
          updates.push({ id: crypto.randomUUID(), workoutType: workout.type, metric: 'duration', value: workout.duration, unit: 'min', date: workout.date });
        }
        
        // Calories PR
        const calPR = state.personalRecords.find(p => p.workoutType === workout.type && p.metric === 'calories');
        if (!calPR || workout.calories > calPR.value) {
          updates.push({ id: crypto.randomUUID(), workoutType: workout.type, metric: 'calories', value: workout.calories, unit: 'cal', date: workout.date });
        }
        
        // Distance PR
        if (workout.distance) {
          const distPR = state.personalRecords.find(p => p.workoutType === workout.type && p.metric === 'distance');
          if (!distPR || workout.distance > distPR.value) {
            updates.push({ id: crypto.randomUUID(), workoutType: workout.type, metric: 'distance', value: workout.distance, unit: 'km', date: workout.date });
          }
        }

        if (updates.length > 0) {
          const existingIds = new Set(state.personalRecords.map(p => p.id));
          const filtered = state.personalRecords.filter(p => !updates.some(u => u.workoutType === p.workoutType && u.metric === p.metric));
          set({ personalRecords: [...filtered, ...updates] });
          
          // Check PR hunter achievement
          const prCount = get().personalRecords.length + updates.length;
          if (prCount >= 10) {
            const ach = get().achievements.find(a => a.id === 'pr_hunter');
            if (ach && !ach.unlocked) {
              set((s) => ({ achievements: s.achievements.map(a => a.id === 'pr_hunter' ? { ...a, unlocked: true, unlockedAt: new Date().toISOString() } : a) }));
            }
          }
        }
      },

      getPRForType: (type) => get().personalRecords.filter(p => p.workoutType === type),

      // Weekly goals
      updateWeeklyGoals: () => {
        const state = get();
        const weekStart = getWeekStart();
        const existingGoals = state.weeklyGoals.filter(g => g.weekStart === weekStart);
        
        if (existingGoals.length === 0) {
          const newGoals: WeeklyGoal[] = [
            { id: 'wg1', type: 'workouts', target: 4, current: 0, weekStart, completed: false },
            { id: 'wg2', type: 'calories', target: 1500, current: 0, weekStart, completed: false },
            { id: 'wg3', type: 'minutes', target: 120, current: 0, weekStart, completed: false },
            { id: 'wg4', type: 'xp', target: 500, current: 0, weekStart, completed: false },
          ];
          set({ weeklyGoals: [...state.weeklyGoals.filter(g => g.weekStart !== weekStart), ...newGoals] });
        }
      },

      checkWeeklyGoals: () => {
        const state = get();
        const weekStart = getWeekStart();
        const weekWorkouts = state.workouts.filter(w => new Date(w.date) >= new Date(weekStart));
        const stats = {
          workouts: weekWorkouts.length,
          calories: weekWorkouts.reduce((s, w) => s + w.calories, 0),
          minutes: weekWorkouts.reduce((s, w) => s + w.duration, 0),
          xp: weekWorkouts.reduce((s, w) => s + w.xpEarned, 0),
        };

        set((s) => ({
          weeklyGoals: s.weeklyGoals.map(g => {
            if (g.weekStart !== weekStart || g.completed) return g;
            const current = stats[g.type as keyof typeof stats] || 0;
            return { ...g, current, completed: current >= g.target };
          })
        }));
      },

      // Settings
      updateSettings: (newSettings) => set((s) => ({ settings: { ...s.settings, ...newSettings } })),

      // Achievements
      checkAchievements: (workout) => {
        // Handled in addWorkout
      },
    }),
    {
      name: STORAGE_KEY,
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        workouts: state.workouts,
        templates: state.templates,
        personalRecords: state.personalRecords,
        weeklyGoals: state.weeklyGoals,
        totalXP: state.totalXP,
        level: state.level,
        coins: state.coins,
        streak: state.streak,
        bestStreak: state.bestStreak,
        lastWorkoutDate: state.lastWorkoutDate,
        achievements: state.achievements,
        challenges: state.challenges,
        bodyMetrics: state.bodyMetrics,
        friends: state.friends,
        settings: state.settings,
      }),
    }
  )
);