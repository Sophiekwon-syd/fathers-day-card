import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('card exposes accessible interaction labels and exact message', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const copy of ['Open your card', 'One more thing...', 'Play our memories',
    'My love, Happy Father’s Day!',
    'This is your first Father’s Day as a dad of two',
    'We love you so much. Happy Father’s Day!']) {
    assert.match(html, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.doesNotMatch(html, /emoji|confetti/i);
});
