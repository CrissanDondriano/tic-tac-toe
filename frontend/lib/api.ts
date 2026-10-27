import type { CreateGamePayload, LeaderboardEntry, SavedGame } from './types';

const baseUrl = (process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:5000/api').replace(/\/$/, '');

export const gamesApi = createGamesApi(createHttpClient({ baseUrl }));
export const { fetchGames, fetchLeaderboard, createGame, deleteGame } = gamesApi;

export interface GamesApi {
  fetchGames(): Promise<{ games: SavedGame[]; total: number }>;
  fetchLeaderboard(): Promise<LeaderboardEntry[]>;
  createGame(payload: CreateGamePayload): Promise<SavedGame>;
  deleteGame(id: string): Promise<void>;
}

export type GameReader = Pick<GamesApi, 'fetchGames' | 'fetchLeaderboard'>;
export type GameWriter = Pick<GamesApi, 'createGame' | 'deleteGame'>;
export type HttpRequest = <T>(path: string, init?: RequestInit) => Promise<T>;

export class ApiError extends Error {
  readonly status?: number;

  constructor(message: string, status?: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface HttpClientOptions {
  baseUrl: string;
  timeoutMs?: number;
  fetchImpl?: typeof fetch;
}

export function createHttpClient({ baseUrl, timeoutMs = 10_000, fetchImpl = fetch }: HttpClientOptions): HttpRequest {
  return async function request<T>(path: string, init: RequestInit = {}): Promise<T> {

    const headers = new Headers(init.headers);
    if (init.body && !headers.has('Content-Type')) headers.set('Content-Type', 'application/json');

    const controller = new AbortController();
    let timedOut = false;
    const timer = setTimeout(() => {
      timedOut = true;
      controller.abort();
    }, timeoutMs);

    let response: Response;
    try {
      response = await fetchImpl(`${baseUrl}${path}`, {
        ...init,
        headers,
        cache: 'no-store',
        signal: controller.signal,
      });
    } catch {
      throw new ApiError(
        timedOut
          ? 'The game server took too long to respond. Please try again.'
          : 'Cannot reach the game server. Make sure the backend is running.',
      );
    } finally {
      clearTimeout(timer);
    }

    if (!response.ok) {
      let message = `Request failed (${response.status})`;
      try {
        const body = (await response.json()) as { error?: string; message?: string };
        message = body.error ?? body.message ?? message;
      } catch {
        if (response.statusText) message = `Request failed (${response.status} ${response.statusText})`;
      }
      throw new ApiError(message, response.status);
    }

    if (response.status === 204) return undefined as T;
    return (await response.json()) as T;
  };
}

export function createGamesApi(request: HttpRequest): GamesApi {
  return {
    fetchGames: () => request<{ games: SavedGame[]; total: number }>('/games'),
    fetchLeaderboard: async () => {
      const { leaderboard } = await request<{ leaderboard: LeaderboardEntry[] }>('/leaderboard');
      return leaderboard;
    },
    createGame: (payload) => request<SavedGame>('/games', { method: 'POST', body: JSON.stringify(payload) }),
    deleteGame: (id) => request<void>(`/games/${encodeURIComponent(id)}`, { method: 'DELETE' }),
  };
}