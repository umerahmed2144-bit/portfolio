import { createContext, useContext } from "react";
import { FPS } from "../theme";
import { BEAT as P_BEAT, DOWNBEAT0 as P_DOWN, T, barAt, beatAt } from "../timing";

/**
 * Beat envelopes for a measured grid. Every glow, punch and shake reads from
 * these so nothing animates off the music.
 *  beat       seconds per beat
 *  downbeat0  time of a bar start (seconds)
 *  live       [from, to] seconds where reactions are on
 *  hits       [[seconds, strength]] accent hits (shake / colour split)
 */
export function createBeat({ beat, downbeat0, live, hits }) {
  const locate = (frame) => {
    const t = frame / FPS;
    const n = Math.floor((t - downbeat0) / beat);
    return { t, n, dt: t - (downbeat0 + n * beat) };
  };
  const on = (t) => t >= live[0] && t < live[1];
  return {
    beatPulse(frame, decay = 0.16) {
      const { t, dt } = locate(frame);
      return on(t) ? Math.exp(-dt / decay) : 0;
    },
    downbeatPulse(frame, decay = 0.32) {
      const { t, n, dt } = locate(frame);
      if (!on(t)) return 0;
      const k = ((n % 4) + 4) % 4;
      return Math.exp(-(k * beat + dt) / decay);
    },
    hitEnvelope(frame, decayFrames = 5) {
      return hits.reduce((acc, [s, w]) => {
        const d = frame - Math.round(s * FPS);
        return d >= 0 && d < decayFrames * 6 ? acc + w * Math.exp(-d / decayFrames) : acc;
      }, 0);
    },
  };
}

// The LinkedIn portfolio video's grid ("Command Pattern").
export const portfolioBeat = createBeat({
  beat: P_BEAT,
  downbeat0: P_DOWN,
  live: [1.8, T.end + 0.2],
  hits: [
    [1.23, 0.35],
    [T.shipIt, 1],
    [T.hero, 0.7],
    [T.stat, 1],
    [barAt(4), 0.8],
    [barAt(5), 0.8],
    [barAt(6), 0.8],
    [barAt(7), 0.8],
    [T.process, 0.7],
    [beatAt(36), 0.5],
    [T.end, 1],
  ],
});

export const BeatContext = createContext(portfolioBeat);
export const useBeat = () => useContext(BeatContext);

// Back-compat helpers used by the portfolio video scenes.
export const beatPulse = (f, d) => portfolioBeat.beatPulse(f, d);
export const downbeatPulse = (f, d) => portfolioBeat.downbeatPulse(f, d);
export const hitEnvelope = (f, d) => portfolioBeat.hitEnvelope(f, d);
