import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

const VIOLET = new THREE.Color("#8b5cf6");
const CYAN = new THREE.Color("#22d3ee");

// Soft round sprite so points render as dots, not squares.
function useDotTexture() {
  return useMemo(() => {
    const size = 64;
    const canvas = document.createElement("canvas");
    canvas.width = canvas.height = size;
    const ctx = canvas.getContext("2d");
    const g = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.35, "rgba(255,255,255,0.8)");
    g.addColorStop(1, "rgba(255,255,255,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, size, size);
    const tex = new THREE.CanvasTexture(canvas);
    tex.colorSpace = THREE.SRGBColorSpace;
    return tex;
  }, []);
}

function Particles({ count }) {
  const ref = useRef();
  const dot = useDotTexture();
  const [positions, colors] = useMemo(() => {
    const pos = new Float32Array(count * 3);
    const col = new Float32Array(count * 3);
    const c = new THREE.Color();
    for (let i = 0; i < count; i++) {
      // points in a thick spherical shell
      const r = 3.4 + Math.random() * 3.2;
      const theta = Math.random() * Math.PI * 2;
      const phi = Math.acos(2 * Math.random() - 1);
      const x = r * Math.sin(phi) * Math.cos(theta);
      const y = r * Math.sin(phi) * Math.sin(theta);
      const z = r * Math.cos(phi);
      pos.set([x, y, z], i * 3);
      c.copy(VIOLET).lerp(CYAN, THREE.MathUtils.clamp((y + 6) / 12 + (Math.random() - 0.5) * 0.4, 0, 1));
      col.set([c.r, c.g, c.b], i * 3);
    }
    return [pos, col];
  }, [count]);

  useFrame((state, dt) => {
    const p = ref.current;
    p.rotation.y += dt * 0.03;
    p.rotation.x = THREE.MathUtils.lerp(p.rotation.x, state.pointer.y * 0.12, 0.04);
  });

  return (
    <points ref={ref}>
      <bufferGeometry>
        <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        <bufferAttribute attach="attributes-color" args={[colors, 3]} />
      </bufferGeometry>
      <pointsMaterial
        size={0.07}
        map={dot}
        alphaTest={0.01}
        vertexColors
        transparent
        opacity={0.85}
        sizeAttenuation
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  );
}

function Core({ scale = 1 }) {
  const group = useRef();
  const outer = useRef();
  const inner = useRef();
  useFrame((state, dt) => {
    outer.current.rotation.x += dt * 0.08;
    outer.current.rotation.y += dt * 0.12;
    inner.current.rotation.x -= dt * 0.14;
    inner.current.rotation.z += dt * 0.1;
    const g = group.current;
    g.position.x = THREE.MathUtils.lerp(g.position.x, state.pointer.x * 0.5, 0.05);
    g.position.y = THREE.MathUtils.lerp(g.position.y, 0.9 + state.pointer.y * 0.3, 0.05);
  });
  return (
    <group ref={group} position={[0, 0.9, 0]} scale={scale}>
      <mesh ref={outer}>
        <icosahedronGeometry args={[2.3, 1]} />
        <meshBasicMaterial color={VIOLET} wireframe transparent opacity={0.32} />
      </mesh>
      <mesh ref={inner}>
        <icosahedronGeometry args={[1.25, 0]} />
        <meshBasicMaterial color={CYAN} wireframe transparent opacity={0.4} />
      </mesh>
    </group>
  );
}

// Decorative violet/cyan scene behind the hero. `active` pauses rendering when
// the hero is off-screen; `still` renders a single frame (reduced motion).
export default function HeroCanvas({ active = true, still = false, compact = false }) {
  return (
    <Canvas
      dpr={[1, 1.5]}
      camera={{ position: [0, 0, 8], fov: 50 }}
      gl={{ antialias: true, alpha: true, powerPreference: "low-power" }}
      frameloop={still ? "demand" : active ? "always" : "never"}
      eventSource={typeof document !== "undefined" ? document.body : undefined}
      eventPrefix="client"
    >
      <fog attach="fog" args={["#08080a", 7, 15]} />
      <Particles count={compact ? 900 : 2200} />
      <Core scale={compact ? 0.72 : 1} />
    </Canvas>
  );
}
