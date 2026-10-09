# Portfolio motion video

A 30-second, 1080×1350 (4:5) promo built with [Remotion](https://remotion.dev). It uses the site's colours, fonts, portrait and product screenshots, and every cut is timed to the music's beat.

## Render

```bash
cd video
npm install
npm run studio   # live preview + scrubbing in the browser
npm run render   # → out/portfolio-4x5.mp4
```

`remotion.config.js` points at the Chromium build preinstalled in the cloud sandbox. On your own machine, delete the `setBrowserExecutable` line and Remotion downloads its own browser.

## Music

The track is **"Command Pattern" by Max Anson**, from Epidemic Sound. It's a 30 s edit, saved as `public/audio/command-pattern-30s.wav`.

The audio file is not committed, because it's licensed to your Epidemic Sound account. To swap the track:
1. Download a new 30 s edit into `public/audio/`.
2. Update the file name in `src/Portfolio.jsx`.
3. Update the beat grid in `src/timing.js` (`BEAT`, `DOWNBEAT0`).

All scene timings come from that beat grid, so the cuts move to the new track automatically.

## Editing

| What | Where |
| --- | --- |
| Scene timings (all on bar lines) | `src/timing.js` |
| Product copy, URLs, screenshots | `src/scenes/Product.jsx` (`PRODUCTS`) |
| Colours and fonts | `src/theme.js` |
| Scenes | `src/scenes/` |

Remotion is free for individuals and companies of up to 3 people.
