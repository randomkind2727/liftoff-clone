export type HapticType = 'light' | 'medium' | 'heavy' | 'selection' | 'success' | 'warning' | 'error';

const HAPTIC_PATTERNS: Record<HapticType, number | number[]> = {
  light: 10,
  medium: 20,
  heavy: 40,
  selection: 5,
  success: [10, 50, 10],
  warning: [30, 30, 30],
  error: [50, 100, 50],
};

export function useHaptics() {
  const hapticsEnabled = typeof window !== 'undefined' 
    ? JSON.parse(localStorage.getItem('liftoff-v2') || '{}').state?.settings?.hapticsEnabled ?? true
    : true;

  const vibrate = (type: HapticType) => {
    if (!hapticsEnabled) return;
    if (typeof navigator !== 'undefined' && navigator.vibrate) {
      const pattern = HAPTIC_PATTERNS[type];
      navigator.vibrate(pattern);
    }
  };

  return { vibrate, enabled: hapticsEnabled };
}

export function triggerHaptic(type: HapticType) {
  if (typeof navigator !== 'undefined' && navigator.vibrate) {
    const pattern = HAPTIC_PATTERNS[type];
    navigator.vibrate(pattern);
  }
}