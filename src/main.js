import { createCardState, transition } from './card-state.js';

const EVENTS = {
  open: 'OPEN_CARD',
  reveal: 'REVEAL_STRIP',
  play: 'PLAY_FILM',
  pause: 'PAUSE_FILM',
  end: 'END_FILM',
  close: 'CLOSE_FILM',
  replay: 'REPLAY_FILM',
};

let state = createCardState();

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

export function renderState(nextState, elements, { focus = true } = {}) {
  const { main, cover, open, openRegion, strip, film } = elements;
  main.dataset.view = nextState.view;
  openRegion.hidden = nextState.view === 'closed';
  if (open) open.hidden = nextState.view !== 'closed';
  if (cover) {
    cover.inert = nextState.view !== 'closed';
    if (typeof cover.toggleAttribute === 'function') cover.toggleAttribute('inert', cover.inert);
  }
  strip.hidden = !['strip', 'film'].includes(nextState.view);

  if (nextState.view === 'film') {
    if (typeof film.showModal === 'function' && !film.open) film.showModal();
    else film.setAttribute('open', '');
  } else if (film.open && typeof film.close === 'function') {
    film.close();
  } else {
    film.removeAttribute('open');
  }

  if (focus) focusWithoutScrolling(focusTarget(nextState, elements));
}

export function dispatch(event, elements = getElements()) {
  const nextState = transition(state, event);
  state = nextState;
  renderState(state, elements);
  return state;
}

export function getElements(root = document) {
  return {
    main: root.querySelector('main'),
    cover: root.querySelector('.card-cover'),
    open: root.querySelector('.open-card'),
    openRegion: root.querySelector('.open-card-region'),
    reveal: root.querySelector('.reveal-strip'),
    strip: root.querySelector('.memory-strip'),
    play: root.querySelector('.play-film'),
    pause: root.querySelector('.pause-film'),
    replay: root.querySelector('.replay-film'),
    close: root.querySelector('.close-film'),
    film: root.querySelector('dialog[aria-label="Our family memories"]'),
  };
}

export function initialise(root = document) {
  const elements = getElements(root);
  if (!elements.main || !elements.openRegion || !elements.film) return null;

  state = createCardState();
  renderState(state, elements, { focus: false });
  elements.open?.addEventListener('click', () => dispatch(EVENTS.open, elements));
  elements.reveal?.addEventListener('click', () => dispatch(EVENTS.reveal, elements));
  elements.play?.addEventListener('click', () => dispatch(EVENTS.play, elements));
  elements.pause?.addEventListener('click', () => {
    dispatch(state.filmStatus === 'paused' ? EVENTS.replay : EVENTS.pause, elements);
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
  return { getState: () => state, dispatch: (event) => dispatch(event, elements) };
}

if (typeof document !== 'undefined') initialise();
