import { createSessionStore } from './storage';

export type { RoundResult, SessionAction, SessionState } from './state';
export { createSession, sessionReducer } from './reducer';
export { computeStats } from './stats';
export { createSessionStore, type KeyValueStorage, type SessionStore } from './storage';

export const sessionStore = createSessionStore(() => (typeof window === 'undefined' ? null : window.localStorage));
export const loadSession = () => sessionStore.load();
export const persistSession = (state: Parameters<typeof sessionStore.save>[0]) => sessionStore.save(state);
export const clearSession = () => sessionStore.clear();