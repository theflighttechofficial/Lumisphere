import { useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { themePalettes } from "./themes";


// Each portfolio section morphs the particle cloud into its own topology.
const sectionShape = {
    overview: "reactor",
    experience: "reactor",
    projects: "matrix",
    skills: "neural",
    achievements: "helix",
    journey: "helix",
    contact: "neural",
};

const COUNT = 216;
const MAX_LINKS = 120;

function HologramScene({ section, speed, shapeOverride, theme }) {
    const pointsRef = useRef();
    const lineRef = useRef();
    const coreRef = useRef();

    const shapes = useMemo(() => {
        const reactor = new Float32Array(COUNT * 3);
        const neural = new Float32Array(COUNT * 3);
        const matrix = new Float32Array(COUNT * 3);
        const helix = new Float32Array(COUNT * 3);
        const phi = Math.PI * (3 - Math.sqrt(5));

        for (let i = 0; i < COUNT; i++) {
            const angle = (i / COUNT) * Math.PI * 12 + (i % 2 === 0 ? Math.PI : 0);
            reactor.set([Math.sin(angle), (i / COUNT) * 3 - 1.5, Math.cos(angle)], i * 3);

            const y = 1 - (i / (COUNT - 1)) * 2;
            const r = Math.sqrt(1 - y * y) * 1.5;
            neural.set([Math.cos(i * phi) * r, y * 1.5, Math.sin(i * phi) * r], i * 3);

            matrix.set([((i % 6) - 2.5) * 0.52, (Math.floor((i % 36) / 6) - 2.5) * 0.52, (Math.floor(i / 36) - 2.5) * 0.52], i * 3);

            const ha = (i / COUNT) * Math.PI * 10;
            const hr = 1.2 - 0.5 * (i / COUNT);
            helix.set([Math.sin(ha) * hr, (i / COUNT) * 3.2 - 1.6, Math.cos(ha) * hr], i * 3);
        }
        return { reactor, neural, matrix, helix };
    }, []);

    const positions = useMemo(() => new Float32Array(COUNT * 3), []);
    const linePositions = useMemo(() => new Float32Array(MAX_LINKS * 6), []);
    const colors = useMemo(() => ({ points: new THREE.Color(), lines: new THREE.Color(), core: new THREE.Color() }), []);

    useFrame((state, delta) => {
        if (!pointsRef.current) return;
        const key = shapeOverride || sectionShape[section] || "reactor";
        const target = shapes[key];
        const pos = pointsRef.current.geometry.attributes.position.array;

        for (let i = 0; i < pos.length; i++) pos[i] += (target[i] - pos[i]) * 0.08;
        pointsRef.current.geometry.attributes.position.needsUpdate = true;
        pointsRef.current.rotation.y += delta * speed;

        if (lineRef.current) {
            lineRef.current.rotation.copy(pointsRef.current.rotation);
            const lp = lineRef.current.geometry.attributes.position.array;
            lp.fill(0);
            const maxDistSq = (key === "matrix" ? 0.35 : 0.65) ** 2;
            let n = 0;
            outer: for (let i = 0; i < COUNT; i++) {
                for (let j = i + 1; j < COUNT; j++) {
                    const dx = pos[i * 3] - pos[j * 3], dy = pos[i * 3 + 1] - pos[j * 3 + 1], dz = pos[i * 3 + 2] - pos[j * 3 + 2];
                    if (dx * dx + dy * dy + dz * dz < maxDistSq) {
                        lp.set([pos[i * 3], pos[i * 3 + 1], pos[i * 3 + 2], pos[j * 3], pos[j * 3 + 1], pos[j * 3 + 2]], n * 6);
                        if (++n >= MAX_LINKS) break outer;
                    }
                }
            }
            lineRef.current.geometry.attributes.position.needsUpdate = true;
        }

        const palette = themePalettes[theme] || themePalettes.amber;
        pointsRef.current.material.color.lerp(colors.points.set(palette.points), 0.08);
        lineRef.current?.material.color.lerp(colors.lines.set(palette.lines), 0.08);
        if (coreRef.current) {
            coreRef.current.material.color.lerp(colors.core.set(palette.core), 0.08);
            coreRef.current.material.opacity = 0.4 + 0.2 * Math.sin(state.clock.elapsedTime * 4.5);
        }
    });

    return (
        <group>
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[positions, 3]} />
                </bufferGeometry>
                <pointsMaterial color="#ffffff" size={0.065} transparent opacity={0.95} depthWrite={false} />
            </points>
            <lineSegments ref={lineRef}>
                <bufferGeometry>
                    <bufferAttribute attach="attributes-position" args={[linePositions, 3]} />
                </bufferGeometry>
                <lineBasicMaterial color="#fff2cc" transparent opacity={0.35} depthWrite={false} />
            </lineSegments>
            <mesh ref={coreRef}>
                <sphereGeometry args={[0.26, 16, 16]} />
                <meshBasicMaterial color="#fbbf24" transparent opacity={0.45} />
            </mesh>
        </group>
    );
}

export default function Hologram({ section, speed = 0.25, shapeOverride = null, theme = "amber" }) {
    return (
        <Canvas dpr={[1, 1.75]} gl={{ antialias: true, alpha: true, powerPreference: "low-power" }} camera={{ position: [0, 0, 4], fov: 45 }}>
            <HologramScene section={section} speed={speed} shapeOverride={shapeOverride} theme={theme} />
            <OrbitControls enableZoom={false} enablePan={false} enableDamping dampingFactor={0.06} />
        </Canvas>
    );
}
