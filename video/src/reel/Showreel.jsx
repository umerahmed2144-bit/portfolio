import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import "../fonts";
import { BEAT, DOWN0, DURATION, S, beatT } from "./timing";
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
  live: [DOWN0, beatT(28)], // beat punches stop when the music falls into its outro
  // Hits only on scene changes (plus the first accent after the drop);
  // ordinary beats get a smaller punch from the camera.
  hits: [
    [S[1] / 30, 0.6],
    [S[2] / 30, 1],
    [beatT(8), 0.8],
    [S[3] / 30, 0.7],
    [S[4] / 30, 0.7],
    [S[5] / 30, 0.7],
    [S[6] / 30, 0.7],
    [S[7] / 30, 0.8],
  ],
});

const SCENES = [Slate, KineticType, DropCore, GridMontage, DataMotion, ShapeMorph, TextTunnel, EndSlate];

// ~21s showreel: a different technique per scene, changes on every other
// beat of the measured grid so each idea has time to read.
export function Showreel() {
  return (
    <BeatContext.Provider value={reelBeat}>
      <AbsoluteFill style={{ background: "#08080a", overflow: "hidden" }}>
        <Backdrop glowY={70} />
        <LightLeak />
        <Camera beatStrength={0.45}>
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
          src={staticFile("audio/kenji-21s.wav")}
          volume={(fr) => interpolate(fr, [0, 3, DURATION - 12, DURATION], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
        />
      </AbsoluteFill>
    </BeatContext.Provider>
  );
}
