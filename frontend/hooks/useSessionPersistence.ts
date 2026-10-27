'use client';

import { useCallback, useEffect, useRef } from 'react';
import { sessionStore, type SessionState, type SessionStore } from '@/lib/session';

// Keeps the session after refresh; discard when done.
export function useSessionPersistence(state: SessionState, store: SessionStore = sessionStore) {
  const discarded = useRef(false);

  useEffect(() => {
    if (!discarded.current) store.save(state);
  }, [state, store]);

  const discard = useCallback(() => {
    discarded.current = true;
    store.clear();
  }, [store]);

  return { discard };
}