export const MAX_NAME_LENGTH = 20;

const RANDOM_NAMES = ['Juan', 'Pedro', 'Cris', 'Michael', 'Plant', 'Enteng', 'Viper', 'Milo', 'Earth', 'Honda', 'Tito', 'Hebrew'];

export interface FieldErrors {
  player1?: string;
  player2?: string;
}

export const hasErrors = (errors: FieldErrors) => Boolean(errors.player1 || errors.player2);

function checkName(raw: string, label: string): string | undefined {
  const name = raw.trim();
  if (!name) return `Enter a name for ${label}.`;
  if (name.length > MAX_NAME_LENGTH) return `Keep it to ${MAX_NAME_LENGTH} characters or fewer.`;
  return undefined;
}

export function validatePlayers(player1: string, player2: string): FieldErrors {
  const errors: FieldErrors = { player1: checkName(player1, 'Player 1'), player2: checkName(player2, 'Player 2') };
  if (!errors.player1 && !errors.player2 && player1.trim().toLowerCase() === player2.trim().toLowerCase()) {
    errors.player2 = 'Players need different names so the history stays clear.';
  }
  return errors;
}

export function randomName(avoid: string): string {
  const pool = RANDOM_NAMES.filter((name) => name.toLowerCase() !== avoid.trim().toLowerCase());
  return pool[Math.floor(Math.random() * pool.length)];
}
