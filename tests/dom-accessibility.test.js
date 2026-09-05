import test from 'node:test';
import assert from 'node:assert/strict';
import { renderState } from '../src/main.js';

test('opening the card removes its trigger from keyboard and assistive technology navigation', () => {
  const elements = {
    main: { dataset: {} },
    cover: { inert: false, toggleAttribute() {} },
    open: { hidden: false, focus() {} },
    openRegion: { hidden: true },
    strip: { hidden: true },
    play: { focus() {} },
    pause: { focus() {} },
    replay: { focus() {} },
    film: { open: false, removeAttribute() {} },
  };

  renderState({ view: 'open', filmStatus: 'idle' }, elements, { focus: false });

  assert.equal(elements.open.hidden, true);
  assert.equal(elements.cover.inert, true);
});
