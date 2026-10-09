import { useMemo } from "react";
import { useCurrentFrame, useVideoConfig } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { rng } from "./ease";

const VIOLET = new THREE.Color("#8b5cf6");
const CYAN = new THREE.Color("#22d3ee");

function useDot() {
  return useMemo(() => {
    const s = 64;
    const cv = document.createElement("canvas");
    cv.width = cv.height = s;
    const ctx = cv.getContext("2d");
    const g = ctx.createRadialGradient(s / 2, s / 2, 0, s / 2, s / 2, s / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.75)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, s, s);
    const tex = new THREE.CanvasTexture(cv);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function Field({ count, t }) {
  const dot = useDot();
  const [pos, col] = useMemo(() => {
    const r = rng(7);
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    const tmp = new THREE.Color();
    for (let i = 0; i < count; i++) {
      const rad = 3.4 + r() * 3.4;
      const th = r() * Math.PI * 2;
      const ph = Math.acos(2 * r() - 1);
      const y = rad * Math.sin(ph) * Math.sin(th);
      p.set([rad * Math.sin(ph) * Math.cos(th), y, rad * Math.cos(ph)], i * 3);
      tmp.copy(VIOLET).lerp(CYAN, THREE.MathUtils.clamp((y + 6) / 12 + (r() - 0.5) * 0.4, 0, 1));
      c.set([tmp.r, tmp.g, tmp.b], i * 3);
    }
    return [p, c];
  }, [count]);
  return (
    <points rotation={[0.15 * Math.sin(t * 0.3), t * 0.05, 0]}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[col, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.075}
        map={dot}
        alphaTest={0.01}
        vertexColors
        transparent
        opacity={0.9}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

/**
 * The hero's violet/cyan core: a particle shell and two wireframe icosahedra,
 * driven by the frame number so renders are deterministic.
 */
export function CoreScene({ opacity = 1, scale = 1, y = 0.6, zoom = 0, spin = 1 }) {
  const frame = useCurrentFrame();
  const { width, height } = useVideoConfig();
  const t = (frame / 30) * spin;
  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      <ThreeCanvas width={width} height={height} camera={{ position: [0, 0, 9 - zoom], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <fog attach="fog" args={["#08080a", 7, 16]} />
        <Field count={2600} t={t} />
        <group position={[0, y, 0]} scale={scale}>
          <mesh rotation={[t * 0.16, t * 0.24, 0]}>
            <icosahedronGeometry args={[2.3, 1]} />
            <meshBasicMaterial color={VIOLET} wireframe transparent opacity={0.38} />
          </mesh>
          <mesh rotation={[-t * 0.28, 0, t * 0.2]}>
            <icosahedronGeometry args={[1.25, 0]} />
            <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.5} />
          </mesh>
        </group>
      </ThreeCanvas>
    </div>
  );
}
