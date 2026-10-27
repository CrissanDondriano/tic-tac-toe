import test from 'node:test';
import assert from 'node:assert/strict';
import { summarizeRounds, type RoundWinner } from './stats';

const rounds = (...winners: RoundWinner[]) => winners.map((winner) => ({ winner }));

test('counts wins, losses and draws for both players', () => {
  const { stats, winner } = summarizeRounds(rounds('player1', 'player1', 'player2', 'draw'));
  assert.deepEqual(stats.player1, { wins: 2, losses: 1, draws: 1 });
  assert.deepEqual(stats.player2, { wins: 1, losses: 2, draws: 1 });
  assert.equal(winner, 'player1');
});

test('session winner is the player with more round wins', () => {
  assert.equal(summarizeRounds(rounds('player2', 'draw', 'player2', 'player1')).winner, 'player2');
});

test('level scores produce a drawn session', () => {
  assert.equal(summarizeRounds(rounds('player1', 'player2')).winner, 'draw');
  assert.equal(summarizeRounds(rounds('draw', 'draw')).winner, 'draw');
});
