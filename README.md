# Umer Ahmed: portfolio

A one-page portfolio built with Vite + React. Dark theme, electric violet and cyan accents, a Three.js hero, Lenis smooth scroll, and spring-style text reveals.

```bash
npm install
npm run dev      # local dev server
npm run build    # production build → dist/
npm run preview  # serve the build locally
```

It deploys to Vercel as a static site with no config needed: the framework preset is **Vite** and the output folder is `dist`.

## Editing content

All copy lives in **`src/content.js`**. Section order is set in `src/App.jsx`.

## Placeholders to fill in

Anything still missing is a string starting with `TODO_` in `src/content.js`. To list them all:

```bash
grep -n TODO_ src/content.js
```

| Key | What to put there |
| --- | --- |
| `TODO_KAHWA_URL` | Live link for kahwa. (FulfillIQ, NurtureAI, StudyForge and RestockIQ already point at their Vercel URLs) |
| `TODO_KAHWA_SCREENSHOT_1` | Put an image in `public/img/` and set it to e.g. `/img/kahwa-1.jpg` (1440×900 crops work best). The other products already use screenshots of their live apps. |
| `TODO_CLIENT_CARTEBLANCHE_IMAGE`, `TODO_CLIENT_UKIYO_IMAGE`, `TODO_CLIENT_RIZQ_IMAGE` | Optional client or brand images (4:5 crop) |

Product status badges come from `status` / `tone` on each product. kahwa. currently reads **"Status TBC"**. Change them to `"Live"` / `tone: "live"` once confirmed.

While `SHOW_TODOS = true` (at the top of `content.js`), every placeholder shows its TODO key on the page so it's easy to spot. Set it to `false` before launch to show neutral "coming soon" labels instead.

The hero portrait is `public/img/portrait.webp`, a transparent cutout. To change it, replace that file with another background-removed, chest-up image.

## Structure

```
src/content.js        all copy + placeholders
src/styles/global.css tokens (colours, type scale), adaptive rem grid, reveal primitives
src/hooks/            Lenis, in-view, adaptive grid, motion helpers
src/components/       Preloader, SiteNav, Marquee, HeroCanvas (r3f), LiquidImage,
                      Reveal / RevealText, TodoLink, Eyebrow
src/sections/         Hero, FeaturedProducts, ClientWork, Experiments, Services, About, Contact
```

Motion respects `prefers-reduced-motion`. When it's on, the preloader, marquee and reveals are skipped and the 3D scene stays still.
