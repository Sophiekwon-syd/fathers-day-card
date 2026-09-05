import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';

test('portrait provenance records non-generative source crops', async () => {
  const notes = await readFile(new URL('../assets/portraits/provenance.json', import.meta.url), 'utf8');
  const data = JSON.parse(notes);
  assert.equal(data.baby.generated, false);
  assert.equal(data.dad.generated, false);
  assert.ok(data.baby.source && data.dad.source);
});
