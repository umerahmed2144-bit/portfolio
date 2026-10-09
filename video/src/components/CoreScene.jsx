import { useMemo } from "react";
import { useCurrentFrame } from "remotion";
import { ThreeCanvas } from "@remotion/three";
import * as THREE from "three";
import { W, H } from "../theme";
import { rng } from "./ease";

const VIOLET = new THREE.Color("#8b5cf6");
const CYAN = new THREE.Color("#22d3ee");

// Rendered at half resolution and scaled up 2x: invisible on a phone, ~4x cheaper.
const RES = 0.5;

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

const tint = (y, jitter) => new THREE.Color().copy(VIOLET).lerp(CYAN, THREE.MathUtils.clamp((y + 6) / 12 + jitter, 0, 1));

/** Particle shell; `shell` scales it (0 = imploded point, >1 = exploded). */
function Shell({ count, t, shell }) {
  const dot = useDot();
  const [pos, col] = useMemo(() => {
    const r = rng(7);
    const p = new Float32Array(count * 3);
    const c = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      const rad = 3.4 + r() * 3.4;
      const th = r() * Math.PI * 2;
      const ph = Math.acos(2 * r() - 1);
      const y = rad * Math.sin(ph) * Math.sin(th);
      p.set([rad * Math.sin(ph) * Math.cos(th), y, rad * Math.cos(ph)], i * 3);
      const k = tint(y, (r() - 0.5) * 0.4);
      c.set([k.r, k.g, k.b], i * 3);
    }
    return [p, c];
  }, [count]);
  if (shell <= 0.001) return null;
  return (
    <points rotation={[0.15 * Math.sin(t * 0.3), t * 0.06, 0]} scale={shell}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[col, 3]} />
      </bufferGeometry>
      <pointsMaterial size={0.08} map={dot} alphaTest={0.01} vertexColors transparent opacity={0.9} depthWrite={false} blending={THREE.AdditiveBlending} />
    </points>
  );
}

/** Hyperspace: streaks in a tunnel, length proportional to `warp` (0..1). */
function Warp({ count, travel, warp }) {
  const seeds = useMemo(() => {
    const r = rng(11);
    return Array.from({ length: count }, () => {
      const a = r() * Math.PI * 2;
      const rad = 1.2 + r() * 7;
      return [Math.cos(a) * rad, Math.sin(a) * rad, -r() * 80, r()];
    });
  }, [count]);
  const { pos, col } = useMemo(() => {
    const p = new Float32Array(count * 6);
    const c = new Float32Array(count * 6);
    const len = 0.2 + warp * 14;
    seeds.forEach(([x, y, z0, j], i) => {
      const z = ((z0 + travel) % 80 + 80) % 80 - 72; // wrap through the tunnel
      p.set([x, y, z, x, y, z - len], i * 6);
      const k = tint(y, j - 0.5);
      c.set([k.r, k.g, k.b, k.r * 0.1, k.g * 0.1, k.b * 0.1], i * 6);
    });
    return { pos: p, col: c };
  }, [seeds, travel, warp, count]);
  if (warp <= 0.01) return null;
  return (
    <lineSegments>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
        <bufferAttribute attach="attributes-color" args={[col, 3]} />
      </bufferGeometry>
      <lineBasicMaterial vertexColors transparent opacity={Math.min(1, warp * 1.5)} blending={THREE.AdditiveBlending} depthWrite={false} />
    </lineSegments>
  );
}

/** Wireframe icosahedron whose edges fly apart as `shatter` goes 0→1. */
function Core({ radius, detail, color, opacity, rot, shatter, seed }) {
  const base = useMemo(() => {
    const wire = new THREE.WireframeGeometry(new THREE.IcosahedronGeometry(radius, detail));
    const arr = wire.attributes.position.array;
    const r = rng(seed);
    const segs = [];
    for (let i = 0; i < arr.length; i += 6) {
      const a = new THREE.Vector3(arr[i], arr[i + 1], arr[i + 2]);
      const b = new THREE.Vector3(arr[i + 3], arr[i + 4], arr[i + 5]);
      const mid = a.clone().add(b).multiplyScalar(0.5);
      segs.push({ a, b, dir: mid.clone().normalize(), k: 2 + r() * 6, spin: (r() - 0.5) * 6 });
    }
    return segs;
  }, [radius, detail, seed]);
  const pos = useMemo(() => {
    const p = new Float32Array(base.length * 6);
    const q = new THREE.Quaternion();
    base.forEach(({ a, b, dir, k, spin }, i) => {
      const off = dir.clone().multiplyScalar(shatter * k);
      const mid = a.clone().add(b).multiplyScalar(0.5);
      q.setFromAxisAngle(dir, shatter * spin);
      const aa = a.clone().sub(mid).applyQuaternion(q).add(mid).add(off);
      const bb = b.clone().sub(mid).applyQuaternion(q).add(mid).add(off);
      p.set([aa.x, aa.y, aa.z, bb.x, bb.y, bb.z], i * 6);
    });
    return p;
  }, [base, shatter]);
  return (
    <lineSegments rotation={rot}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[pos, 3]} />
      </bufferGeometry>
      <lineBasicMaterial color={color} transparent opacity={opacity * (1 - shatter * 0.6)} />
    </lineSegments>
  );
}

/**
 * The violet/cyan core as a camera rig. All motion comes from props + frame:
 *  warp     0..1 hyperspace streak speed      shell   particle shell scale
 *  shatter  0..1 icosahedron breaks apart      core    core scale (0 hides)
 *  orbit    radians around Y                   tilt    radians around X
 *  dolly    world z offset (toward camera +)   y       core vertical offset
 */
export function CoreScene({ opacity = 1, warp = 0, travel = 0, shell = 1, shatter = 0, core = 1, orbit = 0, tilt = 0, dolly = 0, y = 0.4, spin = 1 }) {
  const frame = useCurrentFrame();
  const t = (frame / 30) * spin;
  return (
    <div style={{ position: "absolute", left: 0, top: 0, width: W * RES, height: H * RES, transform: `scale(${1 / RES})`, transformOrigin: "0 0", opacity }}>
      <ThreeCanvas width={W * RES} height={H * RES} camera={{ position: [0, 0, 9], fov: 50 }} gl={{ antialias: true, alpha: true }}>
        <fog attach="fog" args={["#08080a", 7, 18]} />
        <Warp count={900} travel={travel} warp={warp} />
        <group rotation={[tilt, orbit, 0]} position={[0, 0, dolly]}>
          <Shell count={2400} t={t} shell={shell} />
          {core > 0.001 && (
            <group position={[0, y, 0]} scale={core}>
              <Core radius={2.3} detail={1} color={VIOLET} opacity={0.5} rot={[t * 0.16, t * 0.24, 0]} shatter={shatter} seed={3} />
              <Core radius={1.25} detail={0} color={CYAN} opacity={0.65} rot={[-t * 0.28, 0, t * 0.2]} shatter={shatter * 1.2} seed={5} />
            </group>
          )}
        </group>
      </ThreeCanvas>
    </div>
  );
}
