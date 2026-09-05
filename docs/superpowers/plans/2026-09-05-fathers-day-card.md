# Father’s Day Interactive Card Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [x]`) syntax for tracking.

**Goal:** Build a mobile-first handmade Father’s Day card that opens once, animates Baby toward Dad, reveals a hidden photo strip, and plays a curated family-memory film.

**Architecture:** Use a dependency-free static HTML/CSS/JavaScript site. Keep interaction state in a small pure state-machine module, render card and film controls from that state, and store optimised family media locally under `assets/media/` with a declarative playlist manifest.

**Tech Stack:** Semantic HTML5, CSS 3D transforms and keyframes, ES modules, Node.js built-in test runner, macOS `sips`, FFmpeg when available, GPT image generation for non-person craft assets.

**Spec:** `docs/superpowers/specs/2026-09-05-fathers-day-card-design.md`

## Global Constraints

- The first interaction must unmistakably open one folded card; it must not resemble a multi-page flipbook.
- No emoji, confetti, generic celebration graphics, glossy UI elements, or cartoon characters.
- Real family faces must remain original photographs and must not be AI-redrawn.
- Generated assets contain no text and no people.
- The supplied message must remain exactly readable and correctly punctuated.
- Memory media must not autoplay with sound before the user presses `Play our memories`.
- Mouse, touch, keyboard, and `prefers-reduced-motion` must be supported.
- Family media stays local to the static site and exposes no original filenames, dates, locations, or metadata.

---

### Task 1: Static App Shell and Card State Machine

**Files:**
- Create: `index.html`
- Create: `src/card-state.js`
- Create: `src/main.js`
- Create: `styles/base.css`
- Create: `tests/card-state.test.js`
- Create: `package.json`

**Interfaces:**
- Produces: `createCardState(): CardState`, `transition(state, event): CardState`
- `CardState` is `{ view: 'closed'|'open'|'strip'|'film', filmStatus: 'idle'|'playing'|'paused'|'ended' }`.
- Events are `'OPEN_CARD'|'REVEAL_STRIP'|'PLAY_FILM'|'PAUSE_FILM'|'END_FILM'|'CLOSE_FILM'|'REPLAY_FILM'`.

- [x] **Step 1: Write state transition tests**

```js
// tests/card-state.test.js
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
```

- [x] **Step 2: Run the tests and confirm the expected missing-module failure**

Run: `node --test tests/card-state.test.js`

Expected: FAIL because `src/card-state.js` does not exist.

- [x] **Step 3: Implement the pure card state machine**

```js
// src/card-state.js
export const createCardState = () => ({ view: 'closed', filmStatus: 'idle' });

export function transition(state, event) {
  if (event === 'OPEN_CARD' && state.view === 'closed') return { view: 'open', filmStatus: 'idle' };
  if (event === 'REVEAL_STRIP' && state.view === 'open') return { ...state, view: 'strip' };
  if (event === 'PLAY_FILM' && state.view === 'strip') return { view: 'film', filmStatus: 'playing' };
  if (event === 'PAUSE_FILM' && state.view === 'film') return { ...state, filmStatus: 'paused' };
  if (event === 'END_FILM' && state.view === 'film') return { ...state, filmStatus: 'ended' };
  if (event === 'REPLAY_FILM' && state.view === 'film') return { ...state, filmStatus: 'playing' };
  if (event === 'CLOSE_FILM' && state.view === 'film') return { view: 'strip', filmStatus: 'idle' };
  return state;
}
```

- [x] **Step 4: Add the semantic shell and module entry point**

`index.html` must contain one `<main>`, a button labelled `Open your card`, an open-card region initially hidden, a `One more thing...` button, a `Play our memories` button, and a `<dialog aria-label="Our family memories">` for the film. `src/main.js` imports the state machine, dispatches events, updates `data-view` on `<main>`, and manages focus after every transition.

- [x] **Step 5: Add scripts and run the tests**

```json
{
  "type": "module",
  "scripts": {
    "test": "node --test",
    "serve": "python3 -m http.server 4173"
  }
}
```

Run: `npm test`

Expected: all four tests PASS.

---

### Task 2: Generate and Prepare the Handmade Craft Asset Set

**Files:**
- Create: `assets/craft/paper-background.webp`
- Create: `assets/craft/card-cover.webp`
- Create: `assets/craft/card-inside.webp`
- Create: `assets/craft/carnation-petals.webp`
- Create: `assets/craft/carnation-stem.webp`
- Create: `assets/craft/card-pocket.webp`
- Create: `assets/craft/photo-strip.webp`
- Create: `assets/craft/asset-notes.md`

**Interfaces:**
- Produces: web-ready generated images referenced by CSS custom properties in Task 3.
- Every movable foreground asset has a transparent background; base textures are opaque.

- [x] **Step 1: Generate one coordinated contact sheet for visual approval**

Use GPT image generation with this art direction: photographed handmade paper craft, warm ivory stock, dusty carnation pink, deep red layered tissue-paper carnations, muted leaf green, imperfect scissor-cut edges, soft real shadows, restrained composition, no people, no faces, no letters, no words, no symbols, no watermark, no glossy 3D rendering.

- [x] **Step 2: Generate the seven production assets from the approved contact sheet**

Request consistent lighting from upper left, straight-on camera angle, and generous separation around transparent foreground pieces. Do not ask the model to render any UI copy.

- [x] **Step 3: Inspect every generated image at full resolution**

Reject assets containing accidental text, face-like forms, malformed petals, inconsistent light direction, watermarks, or visible checkerboard backgrounds.

- [x] **Step 4: Optimise and document the assets**

Convert opaque images to WebP at quality 82 and transparent pieces to lossless WebP. Record source dimensions, final dimensions, transparency, and intended CSS use in `assets/craft/asset-notes.md`.

---

### Task 3: Folded Card Layout and Opening Interaction

**Files:**
- Create: `styles/card.css`
- Modify: `index.html`
- Modify: `src/main.js`
- Create: `tests/dom-contract.test.js`

**Interfaces:**
- Consumes: `transition()` from Task 1 and craft assets from Task 2.
- Produces: `renderCard(state)` and the `data-view="closed|open|strip|film"` DOM contract.

- [x] **Step 1: Write a DOM contract test**

```js
// tests/dom-contract.test.js
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
```

- [x] **Step 2: Run the test and confirm it fails before the full markup exists**

Run: `node --test tests/dom-contract.test.js`

Expected: FAIL on at least one missing required string.

- [x] **Step 3: Implement the closed and open card markup**

Create `.card-scene`, `.card-spread`, `.card-cover`, `.card-left`, and `.card-right`. Put real text in the DOM, never inside generated images. Use a `<button class="open-card">Open your card</button>` spanning the closed cover edge.

- [x] **Step 4: Implement the physical opening motion**

Set perspective on `.card-scene`, `transform-origin: left center` on `.card-cover`, and rotate the cover from `0deg` to `-165deg` when `data-view` is not `closed`. Use 800 ms easing, a moving paper shadow, and no repeated page elements.

- [x] **Step 5: Add reduced-motion and responsive rules**

Under `@media (prefers-reduced-motion: reduce)`, remove 3D interpolation and change state immediately with a 120 ms opacity transition. Under 700 px, scale the full open spread as a single unit so its halves never stack.

- [x] **Step 6: Run all tests**

Run: `npm test`

Expected: PASS.

---

### Task 4: Family Photo Cutouts and Baby-to-Dad Motion

**Files:**
- Create: `assets/portraits/baby.webp`
- Create: `assets/portraits/dad.webp`
- Create: `styles/characters.css`
- Modify: `index.html`
- Modify: `src/main.js`
- Create: `tests/portrait-policy.test.js`

**Interfaces:**
- Produces: `.portrait--baby`, `.portrait--dad`, and `startInsideAnimation(): Promise<void>`.
- The animation fires once after `OPEN_CARD`; a replay control may call it again.

- [x] **Step 1: Select source frames without generative alteration**

Inspect supplied photos and video contact sheets. Pick a clear Dad portrait and Baby portrait with compatible direction and lighting. Extract/crop the original pixels, remove only the background, retain natural facial features, and export transparent WebP.

- [x] **Step 2: Write a source-policy test**

```js
// tests/portrait-policy.test.js
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
```

- [x] **Step 3: Create `assets/portraits/provenance.json`**

Record anonymised output IDs such as `family-photo-03` rather than original filenames. Set `generated: false` for both cutouts and do not include capture metadata.

- [x] **Step 4: Animate the inside scene**

Dad settles on the right. Baby enters from the left using translate and slight rotation, stops beside Dad, and raises the separate carnation asset. Run the sequence once over 3 seconds after the cover opens. Keep faces unwarped by animating only the containing elements.

- [x] **Step 5: Reveal message groups and restore focus**

Reveal the three message groups at 1.4, 2.0, and 2.6 seconds. After completion, focus the `One more thing...` button without scrolling.

- [x] **Step 6: Run all tests**

Run: `npm test`

Expected: PASS.

---

### Task 5: Media Inventory, Conversion, and Curated Playlist

**Files:**
- Create: `scripts/build-media.mjs`
- Create: `assets/media/manifest.json`
- Create: `assets/media/poster-*.webp`
- Create: `assets/media/photo-*.webp`
- Create: `assets/media/video-*.mp4`
- Create: `tests/media-manifest.test.js`

**Interfaces:**
- Produces: `manifest.json` with `{ id, type, src, poster?, durationMs, caption, includeOriginalAudio }[]`.
- `type` is `'photo'|'video'`; total `durationMs` must be between 45,000 and 60,000.

- [x] **Step 1: Create contact sheets and inspect all 11 photos and 5 videos**

Use `sips` to make photo previews and `ffmpeg -vf fps=1/3,scale=320:-1` to sample video frames. Select 8–12 moments prioritising Dad-and-child interaction, smiles, play, and family closeness. End on the supplied full-family portrait.

- [x] **Step 2: Write manifest validation tests**

```js
// tests/media-manifest.test.js
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
```

- [x] **Step 3: Confirm the validation test fails before media output exists**

Run: `node --test tests/media-manifest.test.js`

Expected: FAIL because `manifest.json` does not exist.

- [x] **Step 4: Convert selected photos and video excerpts**

Use `sips -s format jpeg` as the HEIC compatibility bridge, then create WebP photos no wider than 1920 px. Transcode selected clips to H.264 MP4 with `yuv420p`, `faststart`, and AAC audio only for clips whose natural sound is intentionally retained. Strip metadata from every output.

- [x] **Step 5: Write the final playlist manifest**

Use anonymous filenames such as `photo-01.webp` and `video-01.mp4`. Give each photo 3.5–5 seconds and each video its selected excerpt duration. Set the finale caption to `Our favourite memories are the ones with you.`

- [x] **Step 6: Run all tests**

Run: `npm test`

Expected: PASS, including file-existence and total-duration assertions.

---

### Task 6: Hidden Photo Strip and Memory Film Player

**Files:**
- Create: `src/memory-player.js`
- Create: `styles/memories.css`
- Modify: `index.html`
- Modify: `src/main.js`
- Create: `tests/memory-player.test.js`

**Interfaces:**
- Consumes: `assets/media/manifest.json` from Task 5.
- Produces: `createMemoryPlayer({ container, manifest, onEnd })` returning `{ play, pause, replay, destroy }`.

- [x] **Step 1: Write timing helper tests**

```js
// tests/memory-player.test.js
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
```

- [x] **Step 2: Run the test and confirm the missing-module failure**

Run: `node --test tests/memory-player.test.js`

Expected: FAIL because `src/memory-player.js` does not exist.

- [x] **Step 3: Implement playlist timing and controls**

Implement `itemAtTime`, preload only the next item, use `<img>` for photos and `<video playsinline>` for clips, and expose play/pause/replay/close buttons. A video failure advances to the next item instead of ending the film.

- [x] **Step 4: Implement the pocket and photo-strip reveal**

Keep the pocket inside the physical card. On `REVEAL_STRIP`, translate the strip upward 70% over 900 ms with a soft overshoot. The final strip frame is a real button labelled `Play our memories`.

- [x] **Step 5: Implement the film layer and finale**

Open the native `<dialog>` only after the play-button gesture. Keep the open card visible behind a dim paper-toned backdrop. Show pause, mute, replay, and close controls. End on `family-finale` and its exact caption.

- [x] **Step 6: Run all tests**

Run: `npm test`

Expected: PASS.

---

### Task 7: Accessibility, Fallbacks, and Production Verification

**Files:**
- Modify: `index.html`
- Modify: `styles/base.css`
- Modify: `styles/card.css`
- Modify: `styles/characters.css`
- Modify: `styles/memories.css`
- Modify: `src/main.js`
- Create: `README.md`

**Interfaces:**
- Consumes all prior modules and assets.
- Produces the shareable static site and documented local preview steps.

- [x] **Step 1: Add keyboard and focus behaviour**

Ensure Enter/Space activates every card action, Escape closes the film, focus returns to `Play our memories` after closing, and all decorative images have empty alt text. Give meaningful family images concise alt text without names or locations.

- [x] **Step 2: Add the no-JavaScript fallback**

Inside `<noscript>`, show the complete Father’s Day message and a simple responsive gallery using selected web-ready photos. Do not expose videos that require custom controls.

- [x] **Step 3: Verify responsive layouts manually**

Run: `npm run serve`

Inspect at 390×844, 768×1024, and 1440×900. Confirm the open spread scales as one object, copy remains readable, the photo strip is not clipped, and the dialog controls stay on screen.

- [x] **Step 4: Verify reduced motion and media failure**

Enable reduced motion and confirm the cover opens without 3D interpolation. Temporarily point one manifest entry at a missing file and confirm the film skips it and reaches the finale.

- [x] **Step 5: Run the complete automated suite**

Run: `npm test`

Expected: every state, DOM-contract, portrait-policy, manifest, and memory-player test PASS.

- [x] **Step 6: Inspect the final experience visually**

Open the card from a clean reload, watch the complete Baby-to-Dad motion, reveal the strip, play the whole 45–60 second film, replay it once, and close it. Confirm no emoji, watermarks, AI-redrawn faces, exposed source filenames, accidental generated text, or console errors appear.

- [x] **Step 7: Document preview and deployment**

In `README.md`, document `npm test`, `npm run serve`, the local URL, the static-host deployment requirement, and the privacy note that deployment makes selected family media accessible to anyone who has the site URL.

