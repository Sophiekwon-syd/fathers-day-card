export function itemAtTime(items, timeMs) {
  if (timeMs < 0) return null;
  let elapsed = 0;
  for (let i = 0; i < items.length; i++) {
    const item = items[i];
    const nextElapsed = elapsed + item.durationMs;
    if (timeMs < nextElapsed) {
      return {
        item,
        index: i,
        offsetMs: timeMs - elapsed,
        remainingMs: nextElapsed - timeMs,
      };
    }
    elapsed = nextElapsed;
  }
  return null;
}

export function createMemoryPlayer({
  container,
  manifest = [],
  onEnd = () => {},
  onStatusChange = () => {},
}) {
  let currentIndex = 0;
  let isPlaying = false;
  let isMuted = false;
  let timerId = null;
  let currentMediaEl = null;

  function renderCurrentItem() {
    if (!container) return;
    const item = manifest[currentIndex];
    if (!item) {
      isPlaying = false;
      onEnd();
      return;
    }

    container.innerHTML = '';

    const slideWrapper = document.createElement('div');
    slideWrapper.className = 'film-slide';

    if (item.type === 'video') {
      const video = document.createElement('video');
      video.src = item.src;
      if (item.poster) video.poster = item.poster;
      video.playsInline = true;
      video.autoplay = true;
      video.muted = isMuted || !item.includeOriginalAudio;
      video.className = 'film-media film-video';

      video.addEventListener('error', () => {
        advanceNext();
      });

      video.addEventListener('ended', () => {
        advanceNext();
      });

      slideWrapper.appendChild(video);
      currentMediaEl = video;
      video.play().catch(() => {
        // Autoplay policy fallback: mute and retry, or advance on failure
        video.muted = true;
        video.play().catch(() => advanceNext());
      });
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = item.caption || 'Family memory';
      img.className = 'film-media film-photo';
      slideWrapper.appendChild(img);
      currentMediaEl = img;

      clearTimeout(timerId);
      timerId = setTimeout(() => {
        if (isPlaying) advanceNext();
      }, item.durationMs);
    }

    if (item.caption) {
      const caption = document.createElement('p');
      caption.className = 'film-caption';
      caption.textContent = item.caption;
      slideWrapper.appendChild(caption);
    }

    container.appendChild(slideWrapper);
    onStatusChange(item, currentIndex);

    // Preload next item
    const nextItem = manifest[currentIndex + 1];
    if (nextItem && typeof window !== 'undefined') {
      if (nextItem.type === 'photo') {
        const pre = new Image();
        pre.src = nextItem.src;
      }
    }
  }

  function advanceNext() {
    clearTimeout(timerId);
    if (currentIndex < manifest.length - 1) {
      currentIndex++;
      if (isPlaying) renderCurrentItem();
    } else {
      isPlaying = false;
      onEnd();
    }
  }

  function play() {
    isPlaying = true;
    if (currentMediaEl && currentMediaEl.tagName === 'VIDEO') {
      currentMediaEl.play().catch(() => {});
    } else if (!container.hasChildNodes()) {
      renderCurrentItem();
    }
  }

  function pause() {
    isPlaying = false;
    clearTimeout(timerId);
    if (currentMediaEl && currentMediaEl.tagName === 'VIDEO') {
      currentMediaEl.pause();
    }
  }

  function replay() {
    clearTimeout(timerId);
    currentIndex = 0;
    isPlaying = true;
    renderCurrentItem();
  }

  function toggleMute() {
    isMuted = !isMuted;
    if (currentMediaEl && currentMediaEl.tagName === 'VIDEO') {
      currentMediaEl.muted = isMuted;
    }
    return isMuted;
  }

  function destroy() {
    pause();
    if (container) container.innerHTML = '';
  }

  return {
    play,
    pause,
    replay,
    toggleMute,
    destroy,
    getCurrentIndex: () => currentIndex,
    isPlaying: () => isPlaying,
  };
}
