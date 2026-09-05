import { mkdir, writeFile } from 'node:fs/promises';
import { execFileSync } from 'node:child_process';
import path from 'node:path';

const MEDIA_DIR = new URL('../assets/media/', import.meta.url).pathname;
await mkdir(MEDIA_DIR, { recursive: true });

const DOWNLOADS = '/Users/sophiekwon/Downloads';

console.log('Building media assets in:', MEDIA_DIR);

// 1. video-01: IMG_0963.mov (0s to 6s)
execFileSync('ffmpeg', [
  '-ss', '0', '-t', '6',
  '-i', path.join(DOWNLOADS, 'IMG_0963.mov'),
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-profile:v', 'main', '-level', '3.1',
  '-c:a', 'aac', '-b:a', '128k',
  '-movflags', '+faststart',
  '-map_metadata', '-1',
  '-y', path.join(MEDIA_DIR, 'video-01.mp4')
]);
execFileSync('ffmpeg', [
  '-ss', '1',
  '-i', path.join(MEDIA_DIR, 'video-01.mp4'),
  '-frames:v', '1',
  '-vf', 'scale=1280:-1',
  '-y', '/tmp/poster-01.png'
]);
execFileSync('cwebp', ['-q', '82', '/tmp/poster-01.png', '-o', path.join(MEDIA_DIR, 'poster-01.webp')]);

// 2. photo-01: IMG_3510.HEIC (Dad holding newborn & toddler)
execFileSync('sips', ['-s', 'format', 'jpeg', path.join(DOWNLOADS, 'IMG_3510.HEIC'), '--resampleWidth', '1920', '--out', '/tmp/photo-01.jpg']);
execFileSync('cwebp', ['-q', '84', '/tmp/photo-01.jpg', '-o', path.join(MEDIA_DIR, 'photo-01.webp')]);

// 3. photo-02: IMG_8185.HEIC (Baby sleeping on Dad chest)
execFileSync('sips', ['-s', 'format', 'jpeg', path.join(DOWNLOADS, 'IMG_8185.HEIC'), '--resampleWidth', '1920', '--out', '/tmp/photo-02.jpg']);
execFileSync('cwebp', ['-q', '84', '/tmp/photo-02.jpg', '-o', path.join(MEDIA_DIR, 'photo-02.webp')]);

// 4. video-02: IMG_3424.MOV (tummy time play, 1s to 7s)
execFileSync('ffmpeg', [
  '-ss', '1', '-t', '6',
  '-i', path.join(DOWNLOADS, 'IMG_3424.MOV'),
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-profile:v', 'main', '-level', '3.1',
  '-c:a', 'aac', '-b:a', '128k',
  '-movflags', '+faststart',
  '-map_metadata', '-1',
  '-y', path.join(MEDIA_DIR, 'video-02.mp4')
]);
execFileSync('ffmpeg', [
  '-ss', '1',
  '-i', path.join(MEDIA_DIR, 'video-02.mp4'),
  '-frames:v', '1',
  '-vf', 'scale=1280:-1',
  '-y', '/tmp/poster-02.png'
]);
execFileSync('cwebp', ['-q', '82', '/tmp/poster-02.png', '-o', path.join(MEDIA_DIR, 'poster-02.webp')]);

// 5. photo-03: IMG_9160.HEIC (Dad kissing baby on cheek)
execFileSync('sips', ['-s', 'format', 'jpeg', path.join(DOWNLOADS, 'IMG_9160.HEIC'), '--resampleWidth', '1920', '--out', '/tmp/photo-03.jpg']);
execFileSync('cwebp', ['-q', '84', '/tmp/photo-03.jpg', '-o', path.join(MEDIA_DIR, 'photo-03.webp')]);

// 6. photo-04: IMG_8270.HEIC (Playing lego on floor)
execFileSync('sips', ['-s', 'format', 'jpeg', path.join(DOWNLOADS, 'IMG_8270.HEIC'), '--resampleWidth', '1920', '--out', '/tmp/photo-04.jpg']);
execFileSync('cwebp', ['-q', '84', '/tmp/photo-04.jpg', '-o', path.join(MEDIA_DIR, 'photo-04.webp')]);

// 7. video-03: IMG_8060.MOV (Couch laughing, 0s to 5.5s)
execFileSync('ffmpeg', [
  '-ss', '0', '-t', '5.5',
  '-i', path.join(DOWNLOADS, 'IMG_8060.MOV'),
  '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-profile:v', 'main', '-level', '3.1',
  '-c:a', 'aac', '-b:a', '128k',
  '-movflags', '+faststart',
  '-map_metadata', '-1',
  '-y', path.join(MEDIA_DIR, 'video-03.mp4')
]);
execFileSync('ffmpeg', [
  '-ss', '1',
  '-i', path.join(MEDIA_DIR, 'video-03.mp4'),
  '-frames:v', '1',
  '-vf', 'scale=1280:-1',
  '-y', '/tmp/poster-03.png'
]);
execFileSync('cwebp', ['-q', '82', '/tmp/poster-03.png', '-o', path.join(MEDIA_DIR, 'poster-03.webp')]);

// 8. photo-05: IMG_2005.HEIC (Mirror selfie carrying toddler)
execFileSync('sips', ['-s', 'format', 'jpeg', path.join(DOWNLOADS, 'IMG_2005.HEIC'), '--resampleWidth', '1920', '--out', '/tmp/photo-05.jpg']);
execFileSync('cwebp', ['-q', '84', '/tmp/photo-05.jpg', '-o', path.join(MEDIA_DIR, 'photo-05.webp')]);

// 9. photo-06: IMG_0913.HEIC (Birthday cake celebration)
execFileSync('sips', ['-s', 'format', 'jpeg', path.join(DOWNLOADS, 'IMG_0913.HEIC'), '--resampleWidth', '1920', '--out', '/tmp/photo-06.jpg']);
execFileSync('cwebp', ['-q', '84', '/tmp/photo-06.jpg', '-o', path.join(MEDIA_DIR, 'photo-06.webp')]);

// 10. family-finale: IMG_9450.JPG (Full family portrait)
execFileSync('sips', ['-s', 'format', 'jpeg', path.join(DOWNLOADS, 'IMG_9450.JPG'), '--resampleWidth', '1920', '--out', '/tmp/photo-finale.jpg']);
execFileSync('cwebp', ['-q', '84', '/tmp/photo-finale.jpg', '-o', path.join(MEDIA_DIR, 'photo-finale.webp')]);

const playlist = [
  {
    id: 'memory-01',
    type: 'video',
    src: 'assets/media/video-01.mp4',
    poster: 'assets/media/poster-01.webp',
    durationMs: 6000,
    caption: 'Quiet, tender moments that mean the world.',
    includeOriginalAudio: true,
  },
  {
    id: 'memory-02',
    type: 'photo',
    src: 'assets/media/photo-01.webp',
    durationMs: 4500,
    caption: 'Holding our whole world in your arms.',
  },
  {
    id: 'memory-03',
    type: 'photo',
    src: 'assets/media/photo-02.webp',
    durationMs: 4500,
    caption: 'The safest, warmest place to sleep.',
  },
  {
    id: 'memory-04',
    type: 'video',
    src: 'assets/media/video-02.mp4',
    poster: 'assets/media/poster-02.webp',
    durationMs: 6000,
    caption: 'Cheering on every little milestone and tumble.',
    includeOriginalAudio: true,
  },
  {
    id: 'memory-05',
    type: 'photo',
    src: 'assets/media/photo-03.webp',
    durationMs: 4500,
    caption: 'Your warmth and smiles brighten every single day.',
  },
  {
    id: 'memory-06',
    type: 'photo',
    src: 'assets/media/photo-04.webp',
    durationMs: 4500,
    caption: 'Always ready to play, build, and explore together.',
  },
  {
    id: 'memory-07',
    type: 'video',
    src: 'assets/media/video-03.mp4',
    poster: 'assets/media/poster-03.webp',
    durationMs: 5500,
    caption: 'The endless laughter and joy you bring our home.',
    includeOriginalAudio: true,
  },
  {
    id: 'memory-08',
    type: 'photo',
    src: 'assets/media/photo-05.webp',
    durationMs: 4500,
    caption: 'Our favourite everyday adventure partner.',
  },
  {
    id: 'memory-09',
    type: 'photo',
    src: 'assets/media/photo-06.webp',
    durationMs: 4500,
    caption: 'Every celebration is sweeter with you.',
  },
  {
    id: 'family-finale',
    type: 'photo',
    src: 'assets/media/photo-finale.webp',
    durationMs: 6000,
    caption: 'Our favourite memories are the ones with you.',
  },
];

await writeFile(path.join(MEDIA_DIR, 'manifest.json'), JSON.stringify(playlist, null, 2));
console.log('Successfully generated media manifest and assets!');
