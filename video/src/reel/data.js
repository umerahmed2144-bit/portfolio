// Reel copy comes straight from the portfolio's own content file, so the
// video always matches the site.
import { person, hero, visibleProducts, stats, process, aboutIntro } from "../../../src/content.js";

export const NAME = person.name; // "Umer Ahmed"
export const URL = "umer-ahmed.vercel.app";
export const CTA = hero.primaryCta.label; // "Hire me for a build"
export const TAGLINE = aboutIntro.heading.join(" "); // "Marketing brain, builder's hands."
export const ROLES = hero.roles; // Marketer / Builder / AI-first / Shipper

// Products shown on the site (kahwa. stays hidden until it's ready).
export const PRODUCTS = visibleProducts.map((p) => ({
  name: p.name,
  tagline: p.tagline.replace(/[“”"]/g, ""),
  status: p.status,
  // site paths are "/img/x.jpg"; Remotion's staticFile wants "img/x.jpg"
  image: p.images[0].replace(/^\//, ""),
}));

// Numeric stats only (odometers need digits), e.g. 4 products, 550K+ PKR.
export const STATS = stats
  .map((s) => {
    const m = String(s.value).match(/^(\d+)(.*)$/);
    return m ? { value: m[1], suffix: m[2], label: s.label } : null;
  })
  .filter(Boolean)
  .slice(0, 3);

// One short chart label per build step, in the site's order.
const SHORT = ["Problem", "Spec", "Build", "Economics", "Ship"];
export const STEPS = process.steps.map((s, i) => SHORT[i] ?? s.title.split(" ").pop());
