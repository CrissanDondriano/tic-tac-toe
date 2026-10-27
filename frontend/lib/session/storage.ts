import type { SessionState } from './state';

export interface KeyValueStorage {
  getItem(key: string): string | null;
  setItem(key: string, value: string): void;
  removeItem(key: string): void;
}

export interface SessionStore {
  load(): SessionState | null;
  save(state: SessionState): void;
  clear(): void;
}

const STORAGE_KEY = 'ttt:active-session:v1';

const isRecord = (value: unknown): value is Record<string, unknown> => typeof value === 'object' && value !== null;
const isPlayer = (value: unknown) => value === 'player1' || value === 'player2';
const isCell = (value: unknown) => value === null || value === 'X' || value === 'O';
const isLine = (value: unknown) => value === null || (Array.isArray(value) && value.length === 3 && value.every((n) => Number.isInteger(n) && n >= 0 && n < 9));
const isLastMove = (value: unknown) => value === undefined || value === null || (Number.isInteger(value) && (value as number) >= 0 && (value as number) < 9);
const hasActivity = (state: SessionState) => state.rounds.length > 0 || state.board.some((cell) => cell !== null);

function isRound(value: unknown): boolean {
  if (!isRecord(value)) return false;
  return (
    typeof value.number === 'number' &&
    (isPlayer(value.winner) || value.winner === 'draw') &&
    isPlayer(value.startingPlayer) &&
    typeof value.moves === 'number' &&
    Array.isArray(value.board) &&
    value.board.length === 9 &&
    value.board.every((cell) => cell === '' || isCell(cell))
  );
}

function isSessionState(value: unknown): value is SessionState {
  if (!isRecord(value)) return false;
  const roundOver = value.status === 'roundOver';
  return (
    typeof value.player1 === 'string' &&
    typeof value.player2 === 'string' &&
    typeof value.startedAt === 'string' &&
    Array.isArray(value.rounds) &&
    value.rounds.every(isRound) &&
    Array.isArray(value.board) &&
    value.board.length === 9 &&
    value.board.every(isCell) &&
    isPlayer(value.turn) &&
    isPlayer(value.roundStarter) &&
    typeof value.roundNumber === 'number' &&
    (value.status === 'playing' || roundOver) &&
    (roundOver ? isRecord(value.result) && isLine(value.result.line) : value.result === null) &&
    isLastMove(value.lastMove)
  );
}

// Lazy to avoid localStorage errors in SSR or blocked storage. 
export function createSessionStore(getStorage: () => KeyValueStorage | null, key = STORAGE_KEY): SessionStore {
  const withStorage = <T>(fallback: T, action: (storage: KeyValueStorage) => T): T => {
    try {
      const storage = getStorage();
      return storage ? action(storage) : fallback;
    } catch {
      return fallback;
    }
  };

  const clear = () => withStorage<void>(undefined, (storage) => storage.removeItem(key));

  return {
    clear,
    save: (state) => withStorage<void>(undefined, (storage) => storage.setItem(key, JSON.stringify(state))),
    load: () => {
      const raw = withStorage<string | null>(null, (storage) => storage.getItem(key));
      if (!raw) return null;

      let parsed: unknown;
      try {
        parsed = JSON.parse(raw);
      } catch {
        clear();
        return null;
      }

      if (!isSessionState(parsed) || !hasActivity(parsed)) {
        clear();
        return null;
      }
      return parsed;
    },
  };
}