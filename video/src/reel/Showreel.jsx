import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import "../fonts";
import { BEAT, DOWN0, DURATION, S, barT, beatT } from "./timing";
import { createBeat, BeatContext } from "../components/beat";
import { Backdrop, Finish } from "../components/Backdrop";
import { Camera } from "../components/Camera";
import { LightLeak, Flash } from "../components/fx";
import { Slate } from "./Slate";
import { KineticType } from "./KineticType";
import { DropCore } from "./DropCore";
import { GridMontage } from "./GridMontage";
import { DataMotion } from "./DataMotion";
import { ShapeMorph } from "./ShapeMorph";
import { TextTunnel } from "./TextTunnel";
import { EndSlate } from "./EndSlate";

const reelBeat = createBeat({
  beat: BEAT,
  downbeat0: DOWN0,
  live: [DOWN0, 14.7],
  hits: [
    [barT(1), 0.6],
    [beatT(6), 0.9], // the drop riser, under "SHIP"
    [barT(2), 1],
    [barT(3), 0.7],
    [barT(4), 0.7],
    [barT(5), 0.7],
    [barT(6), 0.7],
    [barT(7), 0.8],
    [barT(8), 0.6],
  ],
});

const SCENES = [Slate, KineticType, DropCore, GridMontage, DataMotion, ShapeMorph, TextTunnel, EndSlate];

// 15s, 1920×1080 showreel: a different technique on every bar, cut to the
// measured beat grid of the track.
export function Showreel() {
  return (
    <BeatContext.Provider value={reelBeat}>
      <AbsoluteFill style={{ background: "#08080a", overflow: "hidden" }}>
        <Backdrop glowY={70} />
        <LightLeak />
        <Camera>
          {SCENES.map((Scene, i) => (
            <Sequence key={i} from={S[i]} durationInFrames={(S[i + 1] ?? DURATION) - S[i]}>
              <Scene />
            </Sequence>
          ))}
          {/* hard-cut flashes on the big section changes */}
          <Flash at={S[1]} peak={0.35} len={6} color="#ffffff" />
          <Flash at={S[3]} peak={0.3} len={6} color="#c4b5fd" />
        </Camera>
        <Finish />
        <Audio
          src={staticFile("audio/kenji-15s.wav")}
          volume={(fr) => interpolate(fr, [0, 3, DURATION - 12, DURATION], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      </AbsoluteFill>
    </BeatContext.Provider>
  );
}
