import { Schema, model } from 'mongoose';

const playerStatsSchema = new Schema(
  {
    wins: { type: Number, required: true, min: 0 },
    losses: { type: Number, required: true, min: 0 },
    draws: { type: Number, required: true, min: 0 },
  },
  { _id: false },
);

const roundSchema = new Schema(
  {
    number: { type: Number, required: true, min: 1 },
    winner: { type: String, enum: ['player1', 'player2', 'draw'], required: true },
    startingPlayer: { type: String, enum: ['player1', 'player2'], required: true },
    moves: { type: Number, required: true, min: 5, max: 9 },
    board: { type: [String], default: [] },
  },
  { _id: false },
);

const gameSchema = new Schema(
  {
    player1: { type: String, required: true, trim: true, maxlength: 20 },
    player2: { type: String, required: true, trim: true, maxlength: 20 },
    stats: {
      player1: { type: playerStatsSchema, required: true },
      player2: { type: playerStatsSchema, required: true },
    },
    rounds: { type: [roundSchema], default: [] },
    totalRounds: { type: Number, required: true, min: 1 },
    winner: { type: String, enum: ['player1', 'player2', 'draw'], required: true },
    startedAt: { type: Date, required: true },
    endedAt: { type: Date, required: true },
    durationSeconds: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

gameSchema.index({ endedAt: -1 });
gameSchema.index({ player1: 1 });
gameSchema.index({ player2: 1 });

gameSchema.set('toJSON', {
  versionKey: false,
  transform: (_doc, ret) => {
    const { _id, ...rest } = ret as Record<string, unknown>;
    return { id: String(_id), ...rest };
  },
});

export const Game = model('Game', gameSchema);
