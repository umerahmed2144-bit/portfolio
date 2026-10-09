import { Composition } from "remotion";
import { Portfolio } from "./Portfolio";
import { W, H, FPS } from "./theme";
import { DURATION } from "./timing";

export function RemotionRoot() {
  return <Composition id="Portfolio4x5" component={Portfolio} durationInFrames={DURATION} fps={FPS} width={W} height={H} />;
}
