'use client';

import { useEffect } from 'react';

// Maps keys 1–9 to the board.
export function useKeyboardPlacement(onPlace: (index: number) => void, enabled: boolean) {
  useEffect(() => {
    if (!enabled) return;

    const onKey = (event: KeyboardEvent) => {
      if (event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.matches('input, textarea, select, [contenteditable="true"]')) return;
      if (/^[1-9]$/.test(event.key)) onPlace(Number(event.key) - 1);
    };

    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [enabled, onPlace]);
}