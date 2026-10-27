import { Router } from 'express';
import { isValidObjectId } from 'mongoose';
import { Game } from '../models/Game';
import { HttpError } from '../middleware/errors';
import { summarizeRounds } from '../services/stats';
import { createGameSchema, listQuerySchema } from '../validation/game';

const router = Router();

const escapeRegex = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

function assertValidId(id: string): void {
  if (!isValidObjectId(id)) throw new HttpError(400, 'Invalid game id');
}

router.get('/', async (req, res) => {
  const { search, limit } = listQuerySchema.parse(req.query);

  const filter = search
    ? {
        $or: [
          { player1: new RegExp(escapeRegex(search), 'i') },
          { player2: new RegExp(escapeRegex(search), 'i') },
        ],
      }
    : {};

  const [games, total] = await Promise.all([
    Game.find(filter).sort({ endedAt: -1 }).limit(limit),
    Game.countDocuments(filter),
  ]);

  res.json({ games, total });
});

router.get('/:id', async (req, res) => {
  assertValidId(req.params.id);
  const game = await Game.findById(req.params.id);
  if (!game) throw new HttpError(404, 'Game not found');
  res.json(game);
});

router.post('/', async (req, res) => {
  const input = createGameSchema.parse(req.body);

  const { stats, winner } = summarizeRounds(input.rounds);

  const endedAt = new Date();
  const startedAt = input.startedAt && input.startedAt <= endedAt ? input.startedAt : endedAt;

  const game = await Game.create({
    player1: input.player1,
    player2: input.player2,
    stats,
    winner,
    rounds: input.rounds.map((round, index) => ({ ...round, number: index + 1 })),
    totalRounds: input.rounds.length,
    startedAt,
    endedAt,
    durationSeconds: Math.round((endedAt.getTime() - startedAt.getTime()) / 1000),
  });

  res.status(201).json(game);
});

router.delete('/:id', async (req, res) => {
  assertValidId(req.params.id);
  const deleted = await Game.findByIdAndDelete(req.params.id);
  if (!deleted) throw new HttpError(404, 'Game not found');
  res.status(204).end();
});

export default router;
