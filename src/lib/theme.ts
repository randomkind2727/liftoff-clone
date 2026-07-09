'use client';

import { useEffect } from 'react';
import { useStore } from '@/store/store';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useStore(s => s.settings.theme);

  useEffect(() => {
    const root = document.documentElement;
    const apply = (t: string) => {
      if (t === 'system') {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        root.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
      } else {
        root.setAttribute('data-theme', t);
      }
    };
    apply(theme);

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = (e: MediaQueryListEvent) => root.setAttribute('data-theme', e.matches ? 'dark' : 'light');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }
  }, [theme]);

  return children;
}