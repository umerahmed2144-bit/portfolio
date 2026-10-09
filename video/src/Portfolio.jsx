import { AbsoluteFill, Audio, Sequence, interpolate, staticFile } from "remotion";
import "./fonts";
import { sec, barAt, T, DURATION } from "./timing";
import { Backdrop, Finish } from "./components/Backdrop";
import { MaskWipe } from "./components/MaskWipe";
import { ColdOpen } from "./scenes/ColdOpen";
import { Hero } from "./scenes/Hero";
import { Stat } from "./scenes/Stat";
import { Product, PRODUCTS } from "./scenes/Product";
import { Process } from "./scenes/Process";
import { EndCard } from "./scenes/EndCard";

const span = (a, b) => ({ from: sec(a), durationInFrames: sec(b) - sec(a) });

export function Portfolio() {
  const productStarts = PRODUCTS.map((_, i) => barAt(4 + i));
  // Cuts that get a violet wipe (the hero → stat lift and each product change).
  const wipes = [T.stat, T.products, ...productStarts.slice(1), T.process];
  return (
    <AbsoluteFill style={{ background: "#08080a" }}>
      <Backdrop />
      <Sequence {...span(0, T.hero)}>
        <ColdOpen />
      </Sequence>
      <Sequence {...span(T.hero, T.stat)}>
        <Hero />
      </Sequence>
      <Sequence {...span(T.stat, T.products)}>
        <Stat />
      </Sequence>
      {PRODUCTS.map((p, i) => {
        const s = span(productStarts[i], i < 3 ? productStarts[i + 1] : T.process);
        return (
          <Sequence key={p.name} {...s}>
            <Product p={p} len={s.durationInFrames} />
          </Sequence>
        );
      })}
      <Sequence {...span(T.process, T.end)}>
        <Process />
      </Sequence>
      <Sequence {...span(T.end, 30)}>
        <EndCard />
      </Sequence>
      {wipes.map((w) => (
        <MaskWipe key={w} at={sec(w)} />
      ))}
      <Finish />
      <Audio
        src={staticFile("audio/command-pattern-30s.wav")}
        volume={(f) => interpolate(f, [0, 6, DURATION - 30, DURATION], [0, 1, 1, 0], { extrapolateLeft: "clamp", extrapolateRight: "clamp" })}
      />
    </AbsoluteFill>
  );
}
