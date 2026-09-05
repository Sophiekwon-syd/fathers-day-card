import test from 'node:test';
import assert from 'node:assert/strict';
import { itemAtTime } from '../src/memory-player.js';

const items = [{ id: 'a', durationMs: 3000 }, { id: 'b', durationMs: 4000 }];
test('maps film time to the correct memory', () => {
  assert.equal(itemAtTime(items, 0).item.id, 'a');
  assert.equal(itemAtTime(items, 2999).item.id, 'a');
  assert.equal(itemAtTime(items, 3000).item.id, 'b');
  assert.equal(itemAtTime(items, 7000), null);
});
