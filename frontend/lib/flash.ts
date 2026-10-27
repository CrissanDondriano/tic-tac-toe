const KEY = 'ttt:flash';

let memoryFlash: string | null = null;

export function setFlash(message: string): void {
  try {
    sessionStorage.setItem(KEY, message);
  } catch {
    memoryFlash = message;
  }
}

export function takeFlash(): string | null {
  let message: string | null = memoryFlash;
  memoryFlash = null;
  try {
    const stored = sessionStorage.getItem(KEY);
    if (stored) {
      sessionStorage.removeItem(KEY);
      message = stored;
    }
  } catch {
    return message;
  }
  return message;
}