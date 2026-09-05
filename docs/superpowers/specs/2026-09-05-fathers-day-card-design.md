# Father’s Day Interactive Card — Design

## Purpose

Create a mobile-first website that feels like opening a handmade Father’s Day card. The experience uses the family’s real photos and videos, while generated artwork supplies only the paper card, carnation, pocket, photo strip, and decorative craft elements.

## Experience Flow

1. A closed portrait card sits on a quiet paper-textured background.
2. The cover uses the selected “Baby Made It” design: baby photo cutout, handmade carnations, and the title “I made this for you, Dad.” A translucent `Open your card` prompt appears near the lower-right edge.
3. Clicking or dragging the right edge opens the cover to the left with a realistic paper bend and shadow.
4. Inside, the baby photo cutout moves toward Dad’s photo cutout and offers a small carnation. The motion plays once and lasts about 3 seconds.
5. The Father’s Day message appears in short groups rather than all at once:

   > Happy Father’s Day to the most wonderful husband and dad.  
   > Today is your day and you deserve to be celebrated!  
   > We love you so much.

6. A small paper tab labelled `One more thing...` moves subtly below the message.
7. Clicking it pulls a photo strip from a pocket at the bottom of the card. The final frame is labelled `Play our memories`.
8. Clicking the final frame enlarges a memory-film layer above the still-visible card.
9. The film plays a curated 45–60 second sequence of supplied photos and short video excerpts.
10. The film ends on the supplied full-family portrait with the line `Our favourite memories are the ones with you.` The user can replay the film or return to the open card.

## Visual Direction

- No emoji, confetti, generic celebration graphics, glossy UI elements, or cartoon characters.
- Handmade classroom-card language: warm paper, slight cut edges, layered shadows, restrained red carnations, and imperfect handwriting.
- Generated art must look like photographed paper craft rather than synthetic 3D illustration.
- Real faces must not be regenerated or stylised. People appear as original photographs or carefully masked photographic cutouts.
- Palette: warm ivory, dusty carnation pink, deep red, leaf green, and muted graphite.
- Display lettering: an English handwritten font with natural irregularity. Body message: a calm, highly legible serif.
- Decorative movement remains physical: paper bending, cutouts sliding, a flower being offered, and a strip being pulled from a pocket.

## Generated Assets

Generate a coordinated asset set with GPT image generation:

- neutral handmade-paper desktop/background;
- closed-card cover base;
- open-card interior spread;
- layered red carnation petals and green stem;
- paper pocket and long instant-photo strip;
- optional tape, pencil line, and cut-paper shadow details.

Assets should be generated without text and without people so the website can add sharp accessible text and preserve the original family photos. Wherever possible, individual craft pieces use transparent backgrounds for animation.

## Family Media

The supplied 10 HEIC/JPG photos and 6 MOV videos are source material. During implementation:

- inspect all images and video contact sheets;
- prioritise Dad-and-child interactions, smiles, play, and family closeness;
- use approximately 8–12 strong moments rather than forcing every file into the film;
- convert HEIC to web-ready JPEG/WebP;
- transcode selected video excerpts to broadly compatible H.264 MP4;
- preserve video audio only where laughter, a child’s voice, or another meaningful natural sound improves the sequence;
- do not publish filenames, dates, locations, or other metadata.

## Motion and Sound

- Card opening: 700–900 ms with reduced-motion fallback.
- Baby-to-Dad scene: about 3 seconds, using transform/opacity animations only.
- Photo strip pull: 800–1000 ms with a soft overshoot.
- Memory film: deliberate play button; never autoplay with sound.
- Background music, if used, begins only after `Play our memories` is pressed and sits beneath meaningful original audio.
- Users can pause, replay, mute, close the film, and use keyboard controls.

## Technical Shape

Build a self-contained static site using HTML, CSS, and JavaScript so it can be shared from a simple web host without accounts or a backend. Components remain separate by responsibility:

- card state and opening interaction;
- inside-card character motion;
- pocket/photo-strip reveal;
- memory-film playlist and controls;
- responsive layout and reduced-motion behavior.

Media files are local static assets. No family photo or video is uploaded to an external service during normal site use.

## Responsive Behaviour

- On phones, the closed card fills most of the viewport and opens with a perspective effect while remaining readable.
- On narrow screens, the open spread may scale as one unit rather than stacking its halves.
- On desktops, the open card remains centred with visible background around it.
- The memory film uses the largest safe area while preserving each asset’s aspect ratio with a soft paper-toned matte.

## Error and Fallback Behaviour

- If a video cannot play, skip to the next memory and keep the film controls available.
- If generated craft assets fail to load, paper-colour CSS fallbacks preserve readability.
- If JavaScript is unavailable, show the open-card message and a simple media gallery.
- Reduced-motion users receive fades and immediate state changes instead of perspective flips and sliding motion.

## Acceptance Criteria

- The first interaction unmistakably opens one folded card; it must not resemble a multi-page flipbook.
- No emoji appears anywhere.
- Real family faces are not AI-redrawn.
- The baby-to-Dad animation completes cleanly once the card opens.
- The full supplied message is readable and correctly punctuated.
- The photo strip emerges only after `One more thing...` is activated.
- The memory film never starts with sound before a user gesture.
- The experience works with mouse, touch, and keyboard and respects reduced-motion preferences.
- A production build contains optimised, web-compatible versions of the selected family media.

