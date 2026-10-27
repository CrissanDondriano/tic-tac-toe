'use client';

import { useCallback, useEffect, useReducer, useRef } from 'react';
import { gamesApi, type GameReader, type GameWriter } from '@/lib/api';
import type { LeaderboardEntry, SavedGame } from '@/lib/types';

type Status = 'loading' | 'ready' | 'error';

interface State {
  status: Status;
  games: SavedGame[];
  leaders: LeaderboardEntry[];
  error: string;
}

type Action =
  | { type: 'LOAD' }
  | { type: 'LOADED'; games: SavedGame[]; leaders: LeaderboardEntry[] }
  | { type: 'FAILED'; error: string }
  | { type: 'REMOVED'; id: string }
  | { type: 'LEADERS'; leaders: LeaderboardEntry[] };

const initialState: State = { status: 'loading', games: [], leaders: [], error: '' };

function reducer(state: State, action: Action): State {
  switch (action.type) {
    case 'LOAD':
      return { ...state, status: 'loading', error: '' };
    case 'LOADED':
      return { status: 'ready', games: action.games, leaders: action.leaders, error: '' };
    case 'FAILED':
      return { ...state, status: 'error', error: action.error };
    case 'REMOVED':
      return { ...state, games: state.games.filter((game) => game.id !== action.id) };
    case 'LEADERS':
      return { ...state, leaders: action.leaders };
  }
}

// Fetches the game history and leaderboard, and allows deleting games.
export function useGameHistory(api: GameReader & Pick<GameWriter, 'deleteGame'> = gamesApi) {
  const [state, dispatch] = useReducer(reducer, initialState);
  const mounted = useRef(true);

  const load = useCallback(async () => {
    dispatch({ type: 'LOAD' });
    try {
      const [{ games }, leaders] = await Promise.all([api.fetchGames(), api.fetchLeaderboard()]);
      if (mounted.current) dispatch({ type: 'LOADED', games, leaders });
    } catch (err) {
      if (mounted.current) dispatch({ type: 'FAILED', error: err instanceof Error ? err.message : 'Something went wrong.' });
    }
  }, [api]);

  useEffect(() => {
    mounted.current = true;
    void load();
    return () => {
      mounted.current = false;
    };
  }, [load]);

  const remove = useCallback(
    async (id: string) => {
      await api.deleteGame(id);
      dispatch({ type: 'REMOVED', id });
      api
        .fetchLeaderboard()
        .then((leaders) => mounted.current && dispatch({ type: 'LEADERS', leaders }))
        .catch(() => undefined);
    },
    [api],
  );

  return { ...state, reload: load, remove };
}
