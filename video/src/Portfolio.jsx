import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import "./fonts";
import { sec, T, DURATION } from "./timing";
import { Backdrop, Finish } from "./components/Backdrop";
import { Camera } from "./components/Camera";
import { LightLeak } from "./components/fx";
import { WarpOpen } from "./scenes/WarpOpen";
import { Name } from "./scenes/Name";
import { Stat } from "./scenes/Stat";
import { Carousel } from "./scenes/Carousel";
import { Process } from "./scenes/Process";
import { Finale } from "./scenes/Finale";

const span = (a, b) => ({ from: sec(a), durationInFrames: sec(b) - sec(a) });

export function Portfolio() {
  return (
    <AbsoluteFill style={{ background: "#08080a", overflow: "hidden" }}>
      <Backdrop />
      <LightLeak />
      <Camera>
        <Sequence {...span(0, T.hero)}>
          <WarpOpen />
        </Sequence>
        <Sequence {...span(T.hero, T.stat)}>
          <Name />
        </Sequence>
        <Sequence {...span(T.stat, T.products)}>
          <Stat />
        </Sequence>
        <Sequence {...span(T.products, T.process)}>
          <Carousel />
        </Sequence>
        <Sequence {...span(T.process, T.end)}>
          <Process />
        </Sequence>
        <Sequence {...span(T.end, 30)}>
          <Finale />
        </Sequence>
      </Camera>
      <Finish />
      <Audio
        src={staticFile("audio/command-pattern-30s.wav")}
        volume={(f) => interpolate(f, [0, 6, DURATION - 30, DURATION], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    </AbsoluteFill>
  );
}
