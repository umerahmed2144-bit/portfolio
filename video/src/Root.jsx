import { Composition } from "remotion";
import { Portfolio } from "./Portfolio";
import { Showreel } from "./reel/Showreel";
import { W, H, FPS } from "./theme";
import { DURATION } from "./timing";
import { DURATION as REEL_DURATION } from "./reel/timing";

export function RemotionRoot() {
  return (
    <>
      <Composition id="Portfolio4x5" component={Portfolio} durationInFrames={DURATION} fps={FPS} width={W} height={H} />
      <Composition id="Showreel16x9" component={Showreel} durationInFrames={REEL_DURATION} fps={FPS} width={1920} height={1080} />
    </>
  );
}
