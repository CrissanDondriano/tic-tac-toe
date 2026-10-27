import { z } from 'zod';

const playerName = z
  .string({ required_error: 'Player name is required' })
  .trim()
  .min(1, 'Player name is required')
  .max(20, 'Player name must be 20 characters or fewer');

const roundSchema = z.object({
  winner: z.enum(['player1', 'player2', 'draw']),
  startingPlayer: z.enum(['player1', 'player2']),
  moves: z.number().int().min(5).max(9),
  board: z.array(z.enum(['X', 'O', ''])).length(9),
});

export const createGameSchema = z
  .object({
    player1: playerName,
    player2: playerName,
    startedAt: z.coerce.date().optional(),
    rounds: z.array(roundSchema).min(1, 'At least one round must be played').max(500),
  })
  .refine((game) => game.player1.toLowerCase() !== game.player2.toLowerCase(), {
    message: 'Player names must be different',
    path: ['player2'],
  });

export const listQuerySchema = z.object({
  search: z.string().trim().max(50).optional(),
  limit: z.coerce.number().int().min(1).max(500).default(200),
});

export type CreateGameInput = z.infer<typeof createGameSchema>;
