'use client';

import { useCallback, useEffect, useState } from 'react';
import { takeFlash } from '@/lib/flash';

// Reads the message left by the previous page.
export function useFlash() {
  const [message, setMessage] = useState<string | null>(null);

  useEffect(() => {
    const flash = takeFlash();
    if (flash) setMessage(flash);
  }, []);

  const dismiss = useCallback(() => setMessage(null), []);
  return { message, dismiss };
}
