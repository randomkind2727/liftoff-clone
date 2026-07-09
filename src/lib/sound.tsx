'use client';

import { useEffect, useRef, useState } from 'react';
import { useStore } from '@/store/store';

const AudioContext = typeof window !== 'undefined' ? (window.AudioContext || (window as any).webkitAudioContext) : null;

type SoundType = 'start' | 'pause' | 'complete' | 'achievement' | 'levelup' | 'tap' | 'error';

const SOUND_CONFIG: Record<SoundType, { freq: number; type: OscillatorType; duration: number; volume: number }> = {
  start: { freq: 440, type: 'sine', duration: 0.15, volume: 0.15 },
  pause: { freq: 330, type: 'sine', duration: 0.1, volume: 0.1 },
  complete: { freq: 523.25, type: 'triangle', duration: 0.3, volume: 0.2 },
  achievement: { freq: 659.25, type: 'triangle', duration: 0.5, volume: 0.25 },
  levelup: { freq: 880, type: 'sine', duration: 0.8, volume: 0.3 },
  tap: { freq: 800, type: 'square', duration: 0.05, volume: 0.05 },
  error: { freq: 200, type: 'sawtooth', duration: 0.2, volume: 0.15 },
};

export function useSound() {
  const soundsEnabled = useStore(s => s.settings.soundsEnabled);
  const audioCtxRef = useRef<AudioContext | null>(null);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    if (AudioContext && soundsEnabled) {
      audioCtxRef.current = new AudioContext();
      setReady(true);
    }
    return () => {
      audioCtxRef.current?.close();
    };
  }, [soundsEnabled]);

  const play = (type: SoundType) => {
    if (!soundsEnabled || !ready || !audioCtxRef.current) return;
    
    const ctx = audioCtxRef.current;
    if (ctx.state === 'suspended') ctx.resume();

    const config = SOUND_CONFIG[type];
    const oscillator = ctx.createOscillator();
    const gainNode = ctx.createGain();
    
    oscillator.type = config.type;
    oscillator.frequency.setValueAtTime(config.freq, ctx.currentTime);
    
    gainNode.gain.setValueAtTime(config.volume, ctx.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + config.duration);
    
    oscillator.connect(gainNode);
    gainNode.connect(ctx.destination);
    
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + config.duration);
  };

  return { play, ready };
}

export function SoundProvider({ children }: { children: React.ReactNode }) {
  const { play } = useSound();
  
  useEffect(() => {
    const handleStart = (e: CustomEvent) => play(e.detail);
    window.addEventListener('liftoff-sound', handleStart as EventListener);
    return () => window.removeEventListener('liftoff-sound', handleStart as EventListener);
  }, [play]);

  return <>{children}</>;
}

export function playSound(type: SoundType) {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent<SoundType>('liftoff-sound', { detail: type }));
  }
}