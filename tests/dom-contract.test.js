import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('card exposes accessible interaction labels and exact message', async () => {
  const html = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  for (const copy of ['Open your card', 'One more thing...', 'Play our memories',
    'Happy Father’s Day to the most wonderful husband and dad.',
    'Today is your day and you deserve to be celebrated!', 'We love you so much.']) {
    assert.match(html, new RegExp(copy.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')));
  }
  assert.doesNotMatch(html, /emoji|confetti/i);
});
