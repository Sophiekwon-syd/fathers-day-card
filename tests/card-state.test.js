import test from 'node:test';
import assert from 'node:assert/strict';
import { createCardState, transition } from '../src/card-state.js';

test('opens one folded card', () => {
  assert.deepEqual(transition(createCardState(), 'OPEN_CARD'), { view: 'open', filmStatus: 'idle' });
});

test('reveals strip only from open state', () => {
  assert.equal(transition(createCardState(), 'REVEAL_STRIP').view, 'closed');
  assert.equal(transition({ view: 'open', filmStatus: 'idle' }, 'REVEAL_STRIP').view, 'strip');
});

test('film starts only after strip reveal', () => {
  assert.equal(transition({ view: 'open', filmStatus: 'idle' }, 'PLAY_FILM').filmStatus, 'idle');
  assert.deepEqual(transition({ view: 'strip', filmStatus: 'idle' }, 'PLAY_FILM'), { view: 'film', filmStatus: 'playing' });
});

test('closing the film returns to the revealed strip', () => {
  assert.deepEqual(transition({ view: 'film', filmStatus: 'playing' }, 'CLOSE_FILM'), { view: 'strip', filmStatus: 'idle' });
});
