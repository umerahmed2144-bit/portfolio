import { continueRender, delayRender, staticFile } from "remotion";

// Load the site's fonts before any frame renders, so no frame uses a fallback.
const faces = [
  ["Anton", "fonts/anton-latin-400-normal.woff2", "400"],
  ["Onest", "fonts/onest-latin-400-normal.woff2", "400"],
  ["Onest", "fonts/onest-latin-500-normal.woff2", "500"],
  ["Onest", "fonts/onest-latin-600-normal.woff2", "600"],
];

if (typeof document !== "undefined") {
  const handle = delayRender("Loading fonts");
  Promise.all(
    faces.map(([family, file, weight]) => {
      const face = new FontFace(family, `url(${staticFile(file)}) format("woff2")`, { weight });
      document.fonts.add(face);
      return face.load();
    })
  )
    .then(() => continueRender(handle))
    .catch((err) => {
      console.error(err);
      continueRender(handle);
    });
}
