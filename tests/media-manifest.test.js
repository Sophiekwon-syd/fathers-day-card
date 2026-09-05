import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, access } from 'node:fs/promises';

test('playlist is private, complete, and 45–60 seconds', async () => {
  const data = JSON.parse(await readFile(new URL('../assets/media/manifest.json', import.meta.url)));
  assert.ok(data.length >= 8 && data.length <= 12);
  const total = data.reduce((sum, item) => sum + item.durationMs, 0);
  assert.ok(total >= 45000 && total <= 60000);
  assert.equal(data.at(-1).id, 'family-finale');
  for (const item of data) {
    assert.doesNotMatch(item.src, /IMG_|\/Users\/|Downloads/i);
    await access(new URL(`../${item.src}`, import.meta.url));
  }
});
