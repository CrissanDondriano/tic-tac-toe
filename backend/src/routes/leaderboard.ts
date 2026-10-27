import { Router } from 'express';
import type { PipelineStage } from 'mongoose';
import { Game } from '../models/Game';

const router = Router();

const pipeline: PipelineStage[] = [
  {
    $project: {
      entries: [
        {
          name: '$player1',
          wins: '$stats.player1.wins',
          losses: '$stats.player1.losses',
          draws: '$stats.player1.draws',
        },
        {
          name: '$player2',
          wins: '$stats.player2.wins',
          losses: '$stats.player2.losses',
          draws: '$stats.player2.draws',
        },
      ],
    },
  },
  { $unwind: '$entries' },
  {
    $group: {
      _id: { $toLower: '$entries.name' },
      name: { $first: '$entries.name' },
      sessions: { $sum: 1 },
      wins: { $sum: '$entries.wins' },
      losses: { $sum: '$entries.losses' },
      draws: { $sum: '$entries.draws' },
    },
  },
  { $sort: { wins: -1, losses: 1, sessions: -1, name: 1 } },
  { $limit: 10 },
  { $project: { _id: 0, name: 1, sessions: 1, wins: 1, losses: 1, draws: 1 } },
];

router.get('/', async (_req, res) => {
  const leaderboard = await Game.aggregate(pipeline);
  res.json({ leaderboard });
});

export default router;
