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

function haptic(ms = 15) {
  if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
    try { navigator.vibrate(ms); } catch {}
  }
}

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

    const duration = isReduced ? 150 : 2800;
    clearTimeout(animationTimer);
    animationTimer = setTimeout(() => {
      resolve();
    }, duration);
  });
}

export function renderState(nextState, elements, { focus = true } = {}) {
  const { main, cover, open, openRegion, strip, film, pause, rightPanel } = elements;
  if (main?.dataset) main.dataset.view = nextState.view;
  if (openRegion) {
    openRegion.hidden = nextState.view === 'closed';
    if (nextState.view === 'closed' && typeof openRegion.scrollTo === 'function') {
      openRegion.scrollTo({ left: 0, behavior: 'instant' });
    }
  }
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
        // On mobile, smoothly slide to the message panel after the animation
        if (openRegion && rightPanel && window.innerWidth < 768) {
          openRegion.scrollTo({ left: rightPanel.offsetLeft, behavior: 'smooth' });
        }
        focusWithoutScrolling(elements.reveal);
      });
    } else {
      if (['strip', 'film'].includes(nextState.view)) {
        if (openRegion && rightPanel && window.innerWidth < 768) {
          openRegion.scrollTo({ left: rightPanel.offsetLeft, behavior: 'auto' });
        }
      }
      focusWithoutScrolling(focusTarget(nextState, elements));
    }
  }
}

export function dispatch(event, elements = getElements()) {
  haptic(15);
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
  const qa = (sel) => (typeof root.querySelectorAll === 'function' ? root.querySelectorAll(sel) : []);
  return {
    main: q('main'),
    cover: q('.card-cover'),
    open: q('.open-card'),
    openRegion: q('.open-card-region'),
    leftPanel: q('.card-left'),
    rightPanel: q('.card-right'),
    dots: qa('.indicator-dot'),
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
    storyBars: q('.film-story-bars'),
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
  if (elements.storyBars && manifest.length > 0) {
    elements.storyBars.innerHTML = '';
    manifest.forEach((_, idx) => {
      const seg = document.createElement('div');
      seg.className = idx === 0 ? 'story-segment active' : 'story-segment';
      elements.storyBars.appendChild(seg);
    });
  }

  if (elements.screen && manifest.length > 0) {
    memoryPlayer = createMemoryPlayer({
      container: elements.screen,
      manifest,
      onEnd: () => {
        dispatch(EVENTS.end, elements);
      },
      onStatusChange: (item, index) => {
        if (elements.status && item.caption) {
          elements.status.textContent = item.caption;
        }
        if (elements.storyBars) {
          const segs = elements.storyBars.children;
          for (let i = 0; i < segs.length; i++) {
            if (i < index) segs[i].className = 'story-segment completed';
            else if (i === index) segs[i].className = 'story-segment active';
            else segs[i].className = 'story-segment';
          }
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
      if (elements.mute) elements.mute.textContent = isMuted ? 'Muted' : 'Sound';
    }
  });
  elements.replay?.addEventListener('click', () => {
    if (elements.storyBars) {
      const segs = elements.storyBars.children;
      for (let i = 0; i < segs.length; i++) {
        segs[i].className = i === 0 ? 'story-segment active' : 'story-segment';
      }
    }
    dispatch(EVENTS.replay, elements);
  });
  elements.close?.addEventListener('click', () => dispatch(EVENTS.close, elements));

  elements.film.addEventListener('cancel', (event) => {
    event.preventDefault();
    dispatch(EVENTS.close, elements);
  });
  elements.film.addEventListener('close', () => {
    if (state.view === 'film') dispatch(EVENTS.close, elements);
  });

  // Mobile Touch Swipe Gesture on Cover (Swipe left to open)
  let touchStartX = 0;
  let touchStartY = 0;

  elements.cover?.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].clientX;
    touchStartY = e.changedTouches[0].clientY;
  }, { passive: true });

  elements.cover?.addEventListener('touchend', (e) => {
    if (state.view !== 'closed') return;
    const deltaX = e.changedTouches[0].clientX - touchStartX;
    const deltaY = e.changedTouches[0].clientY - touchStartY;
    // Swipe left by at least 40px
    if (deltaX < -40 && Math.abs(deltaY) < 80) {
      dispatch(EVENTS.open, elements);
    }
  }, { passive: true });

  // Mobile inside scroll-snap panel indicator sync
  if (elements.openRegion && elements.dots.length > 0) {
    elements.openRegion.addEventListener('scroll', () => {
      const scrollLeft = elements.openRegion.scrollLeft;
      const width = elements.openRegion.clientWidth;
      const activeIndex = Math.round(scrollLeft / width);
      elements.dots.forEach((dot, idx) => {
        dot.classList.toggle('active', idx === activeIndex);
      });
    }, { passive: true });

    elements.dots.forEach((dot) => {
      dot.addEventListener('click', () => {
        const panelIdx = parseInt(dot.dataset.panel, 10);
        const target = panelIdx === 0 ? elements.leftPanel : elements.rightPanel;
        if (target) {
          elements.openRegion.scrollTo({ left: target.offsetLeft, behavior: 'smooth' });
        }
      });
    });
  }

  // Global keyboard shortcut: Escape closes film
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && state.view === 'film') {
      dispatch(EVENTS.close, elements);
    }
  });

  // URL query parameter support for direct previewing (?view=open | strip | film)
  if (typeof window !== 'undefined' && window.location?.search) {
    const params = new URLSearchParams(window.location.search);
    const viewParam = params.get('view');
    if (viewParam === 'open') {
      dispatch(EVENTS.open, elements);
    } else if (viewParam === 'strip') {
      dispatch(EVENTS.open, elements);
      dispatch(EVENTS.reveal, elements);
    } else if (viewParam === 'film') {
      dispatch(EVENTS.open, elements);
      dispatch(EVENTS.reveal, elements);
      dispatch(EVENTS.play, elements);
    }
  }

  return {
    getState: () => state,
    dispatch: (event) => dispatch(event, elements),
    getMemoryPlayer: () => memoryPlayer,
  };
}

if (typeof window !== 'undefined' && typeof document !== 'undefined') {
  initialise();
}
