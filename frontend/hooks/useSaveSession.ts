'use client';

import { useCallback, useState } from 'react';
import { gamesApi, type GameWriter } from '@/lib/api';
import type { SessionState } from '@/lib/session';

// Saves the session and returns true on success.
export function useSaveSession(writer: Pick<GameWriter, 'createGame'> = gamesApi) {
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const save = useCallback(
    async (state: SessionState): Promise<boolean> => {
      setSaving(true);
      setError(null);
      try {
        await writer.createGame({
          player1: state.player1,
          player2: state.player2,
          startedAt: state.startedAt,
          rounds: state.rounds,
        });
        return true;
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Could not save the session.');
        setSaving(false);
        return false;
      }
    },
    [writer],
  );

  return { saving, error, save };
}