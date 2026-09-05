# Father’s Day Interactive Card 💌

A mobile-first, handcrafted interactive Father’s Day card website built with pure semantic HTML5, CSS 3D transforms, and vanilla JavaScript.

## Experience Flow

1. **Cover ("Baby Made It")**: The card sits folded on a warm cotton-paper background. It features the baby's cutout portrait, hand-cut paper carnations, and the title *"I made this for you, Dad."* with an *"Open your card"* button.
2. **Card Opening**: Opening the card rotates the front cover smoothly with a 3D paper bend and moving shadow, revealing the two-panel inside spread.
3. **Baby-to-Dad Animation**: Inside the left panel, the baby cutout enters and moves toward Dad, raising an offered tissue-paper carnation over 3 seconds.
4. **Message Groups**: The Father's Day greeting reveals in short, calm phrases:
   - *"Happy Father’s Day to the most wonderful husband and dad."*
   - *"Today is your day and you deserve to be celebrated!"*
   - *"We love you so much."*
5. **Hidden Photo Strip**: Activating *"One more thing..."* pulls a vintage instant-photo strip upward from a paper pocket on the lower-right panel.
6. **Family Memory Film**: Clicking *"Play our memories"* on the strip opens an elegant film layer above the card, playing a curated 50.5-second sequence of authentic family photos and video clips, concluding on the full family portrait with the caption: *"Our favourite memories are the ones with you."*

## Running & Testing

### Run Automated Tests
```bash
npm test
```
Runs Node.js built-in test runner covering:
- Card state machine transitions
- DOM accessibility and keyboard navigation
- DOM contract and content verification
- Media manifest duration (45–60s) and privacy checks
- Memory player playlist timing
- Portrait non-generative provenance verification

### Run Local Server
```bash
npm run serve
```
Serves the static application at:
[http://localhost:4173](http://localhost:4173)

## Static Deployment

The project is completely self-contained without dependencies or backend:
- Can be deployed directly to any static host (e.g. Cloudflare Pages, Netlify, Vercel, GitHub Pages, or S3).
- **Privacy Notice**: Deploying to a public URL will make the curated family photos and videos accessible to anyone with the site URL. Use a password-protected deployment or private link if restricted sharing is desired.

## Accessibility & Fallbacks

- **Keyboard & Focus**: Full keyboard navigation support (Tab, Enter, Space, Escape to close film). Focus returns smoothly to the relevant interactive button after each phase.
- **Reduced Motion**: Under `@media (prefers-reduced-motion: reduce)`, 3D flips and sliding movements are replaced with immediate fades.
- **No-JavaScript**: A semantic `<noscript>` block displays the full Father's Day message and high-resolution family portrait if JavaScript is disabled.
- **Media Resilience**: If any video fails to load or cannot autoplay, the player advances gracefully to the next memory.
