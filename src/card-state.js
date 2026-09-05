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
