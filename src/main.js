import { createCardState, transition } from './card-state.js';
import { createMemoryPlayer } from './memory-player.js';

export const EVENTS = {
  open: 'OPEN_CARD',
  reveal: 'REVEAL_STRIP',
  play: 'PLAY_FILM',
  pause: 'PAUSE_FILM',
  end: 'END_FILM',
  close: 'CLOSE_FILM',
  replay: 'REPLAY_FILM',
};

let state = createCardState();
let memoryPlayer = null;
let animationTimer = null;

function focusWithoutScrolling(element) {
  if (!element || typeof element.focus !== 'function') return;
  try {
    element.focus({ preventScroll: true });
  } catch {
    element.focus();
  }
}

function focusTarget(nextState, elements) {
  if (nextState.view === 'closed') return elements.open;
  if (nextState.view === 'open') return elements.reveal;
  if (nextState.view === 'strip') return elements.play;
  if (nextState.filmStatus === 'paused') return elements.pause;
  if (nextState.filmStatus === 'ended') return elements.replay;
  return elements.pause;
}

export function startInsideAnimation(root = (typeof document !== 'undefined' ? document : null)) {
  return new Promise((resolve) => {
    if (!root) return resolve();
    const stage = root.querySelector('.character-stage');
    if (!stage) return resolve();

    const isReduced = typeof window !== 'undefined' &&
      window.matchMedia?.('(prefers-reduced-motion: reduce)')?.matches;

    const duration = isReduced ? 150 : 3000;
    clearTimeout(animationTimer);
    animationTimer = setTimeout(() => {
      resolve();
    }, duration);
  });
}

export function renderState(nextState, elements, { focus = true } = {}) {
  const { main, cover, open, openRegion, strip, film, pause } = elements;
  if (main?.dataset) main.dataset.view = nextState.view;
  if (openRegion) openRegion.hidden = nextState.view === 'closed';
  if (open) open.hidden = nextState.view !== 'closed';
  if (cover) {
    cover.inert = nextState.view !== 'closed';
    if (typeof cover.toggleAttribute === 'function') {
      cover.toggleAttribute('inert', cover.inert);
    }
  }
  if (strip) strip.hidden = !['strip', 'film'].includes(nextState.view);

  if (pause) {
    pause.textContent = nextState.filmStatus === 'paused' ? 'Resume' : 'Pause';
  }

  if (film) {
    if (nextState.view === 'film') {
      if (typeof film.showModal === 'function' && !film.open) film.showModal();
      else film.setAttribute?.('open', '');
    } else if (film.open && typeof film.close === 'function') {
      film.close();
    } else if (typeof film.removeAttribute === 'function') {
      film.removeAttribute('open');
    }
  }

  if (focus) {
    if (nextState.view === 'open') {
      startInsideAnimation().then(() => {
        focusWithoutScrolling(elements.reveal);
      });
    } else {
      focusWithoutScrolling(focusTarget(nextState, elements));
    }
  }
}

export function dispatch(event, elements = getElements()) {
  const nextState = transition(state, event);
  const prevState = state;
  state = nextState;
  renderState(state, elements);

  // Sync memory player on state change
  if (event === EVENTS.play) {
    if (memoryPlayer) memoryPlayer.play();
  } else if (event === EVENTS.pause) {
    if (memoryPlayer) memoryPlayer.pause();
  } else if (event === EVENTS.replay) {
    if (memoryPlayer) memoryPlayer.replay();
  } else if (event === EVENTS.close && prevState.view === 'film') {
    if (memoryPlayer) memoryPlayer.pause();
  }

  return state;
}

export function getElements(root = (typeof document !== 'undefined' ? document : {})) {
  const q = (sel) => (typeof root.querySelector === 'function' ? root.querySelector(sel) : null);
  return {
    main: q('main'),
    cover: q('.card-cover'),
    open: q('.open-card'),
    openRegion: q('.open-card-region'),
    reveal: q('.reveal-strip'),
    strip: q('.memory-strip'),
    play: q('.play-film'),
    pause: q('.pause-film'),
    mute: q('.mute-film'),
    replay: q('.replay-film'),
    close: q('.close-film'),
    film: q('dialog[aria-label="Our family memories"]'),
    screen: q('.film-screen'),
    status: q('.film-status'),
  };
}

async function loadManifest() {
  try {
    const res = await fetch('assets/media/manifest.json');
    if (!res.ok) return [];
    return await res.json();
  } catch {
    return [];
  }
}

export async function initialise(root = (typeof document !== 'undefined' ? document : null)) {
  if (!root) return null;
  const elements = getElements(root);
  if (!elements.main || !elements.openRegion || !elements.film) return null;

  state = createCardState();
  renderState(state, elements, { focus: false });

  // Initialise memory player with manifest
  const manifest = await loadManifest();
  if (elements.screen && manifest.length > 0) {
    memoryPlayer = createMemoryPlayer({
      container: elements.screen,
      manifest,
      onEnd: () => {
        dispatch(EVENTS.end, elements);
      },
      onStatusChange: (item) => {
        if (elements.status && item.caption) {
          elements.status.textContent = item.caption;
        }
      },
    });
  }

  elements.open?.addEventListener('click', () => dispatch(EVENTS.open, elements));
  elements.reveal?.addEventListener('click', () => dispatch(EVENTS.reveal, elements));
  elements.play?.addEventListener('click', () => dispatch(EVENTS.play, elements));
  elements.pause?.addEventListener('click', () => {
    dispatch(state.filmStatus === 'paused' ? EVENTS.replay : EVENTS.pause, elements);
  });
  elements.mute?.addEventListener('click', () => {
    if (memoryPlayer) {
      const isMuted = memoryPlayer.toggleMute();
      if (elements.mute) elements.mute.textContent = isMuted ? 'Unmute' : 'Mute';
    }
  });
  elements.replay?.addEventListener('click', () => dispatch(EVENTS.replay, elements));
  elements.close?.addEventListener('click', () => dispatch(EVENTS.close, elements));

  elements.film.addEventListener('cancel', (event) => {
    event.preventDefault();
    dispatch(EVENTS.close, elements);
  });
  elements.film.addEventListener('close', () => {
    if (state.view === 'film') dispatch(EVENTS.close, elements);
  });

  // Global keyboard shortcut: Escape closes film
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.view === 'film') {
      dispatch(EVENTS.close, elements);
    }
  });

  return {
    getState: () => state,
    dispatch: (event) => dispatch(event, elements),
    getMemoryPlayer: () => memoryPlayer,
  };
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  initialise();
}
