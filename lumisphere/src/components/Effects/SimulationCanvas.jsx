import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useLight } from "../../context/LightContext";

// --- Background Shader Material ---
const BackgroundShader = {
    uniforms: {
        uTime: { value: 0 },
        uLightIntensity: { value: 0 },
        uLampPos2D: { value: new THREE.Vector2(0.5, 0.6) },
    },
    vertexShader: `
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 1.0);
        }
    `,
    fragmentShader: `
        uniform float uTime;
        uniform float uLightIntensity;
        uniform vec2 uLampPos2D;
        varying vec2 vUv;

        float hash(vec2 p) {
            return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
        }

        float noise(vec2 p) {
            vec2 i = floor(p);
            vec2 f = fract(p);
            f = f * f * (3.0 - 2.0 * f);
            return mix(mix(hash(i + vec2(0.0, 0.0)), hash(i + vec2(1.0, 0.0)), f.x),
                       mix(hash(i + vec2(0.0, 1.0)), hash(i + vec2(1.0, 1.0)), f.x), f.y);
        }

        float fbm(vec2 p) {
            float v = 0.0;
            float a = 0.5;
            vec2 shift = vec2(100.0);
            mat2 rot = mat2(cos(0.5), sin(0.5), -sin(0.5), cos(0.5));
            for (int i = 0; i < 4; ++i) {
                v += a * noise(p);
                p = rot * p * 2.0 + shift;
                a *= 0.5;
            }
            return v;
        }

        void main() {
            vec3 baseColor = vec3(0.003, 0.002, 0.008); // Deep black/purple void
            
            // Nebula noise
            vec2 motion = vec2(uTime * 0.008, -uTime * 0.005);
            float n = fbm(vUv * 2.5 + motion);
            vec3 nebula = vec3(0.08, 0.03, 0.16) * n; // Slow purple clouds
            
            vec3 color = baseColor + nebula;
            
            // Ambient light glow on wall behind lamp when light is on
            float lightGlow = smoothstep(1.1, 0.0, length(vUv - uLampPos2D)) * uLightIntensity;
            color += vec3(0.24, 0.18, 0.05) * lightGlow;
            
            gl_FragColor = vec4(color, 1.0);
        }
    `
};

// --- Volumetric Spotlight Shader Material ---
const VolumetricLightShader = {
    uniforms: {
        uTime: { value: 0 },
        uLightIntensity: { value: 0 },
        uColor: { value: new THREE.Color("#ffd43f") }, // Realistic Halogen yellow light
    },
    vertexShader: `
        varying vec3 vWorldPosition;
        varying vec3 vLocalPosition;
        void main() {
            vLocalPosition = position;
            vec4 worldPosition = modelMatrix * vec4(position, 1.0);
            vWorldPosition = worldPosition.xyz;
            gl_Position = projectionMatrix * viewMatrix * worldPosition;
        }
    `,
    fragmentShader: `
        varying vec3 vWorldPosition;
        varying vec3 vLocalPosition;
        uniform float uTime;
        uniform float uLightIntensity;
        uniform vec3 uColor;

        float hash(vec3 p) {
            p = fract(p * 0.3183099 + vec3(0.1));
            p *= 17.0;
            return fract(p.x * p.y * p.z * (p.x + p.y + p.z));
        }

        float noise(vec3 x) {
            vec3 i = floor(x);
            vec3 f = fract(x);
            f = f * f * (3.0 - 2.0 * f);
            return mix(mix(mix(hash(i + vec3(0,0,0)), hash(i + vec3(1,0,0)), f.x),
                           mix(hash(i + vec3(0,1,0)), hash(i + vec3(1,1,0)), f.x), f.y),
                       mix(mix(hash(i + vec3(0,0,1)), hash(i + vec3(1,0,1)), f.x),
                           mix(hash(i + vec3(0,1,1)), hash(i + vec3(1,1,1)), f.x), f.y), f.z);
        }

        void main() {
            // Cone extends downwards from y = 0 to y = -9.0
            float h = -vLocalPosition.y;
            float height = 9.0;
            
            if (h < 0.0 || h > height) discard;
            
            float radiusAtH = 0.15 + (3.5 - 0.15) * (h / height);
            float distToAxis = length(vec2(vLocalPosition.x, vLocalPosition.z));
            
            if (distToAxis > radiusAtH) discard;
            
            // Calculate volumetric falloff
            float density = smoothstep(radiusAtH, radiusAtH - 0.7, distToAxis);
            
            // Top/bottom edge smoothing
            density *= smoothstep(0.0, 0.4, h) * smoothstep(height, height - 1.5, h);
            
            // Animated double-octave dust density scrolling downward
            vec3 noiseCoords1 = vec3(vLocalPosition.x * 2.0, vLocalPosition.y * 1.5 - uTime * 0.7, vLocalPosition.z * 2.0);
            vec3 noiseCoords2 = vec3(vLocalPosition.x * 4.5 + uTime * 0.15, vLocalPosition.y * 2.8 - uTime * 1.2, vLocalPosition.z * 4.5);
            float smokePattern = mix(noise(noiseCoords1), noise(noiseCoords2), 0.35);
            
            float finalVolume = density * (0.2 + 0.8 * smokePattern) * uLightIntensity * 0.46;
            
            gl_FragColor = vec4(uColor, finalVolume);
        }
    `
};

// --- GPU Interactive Dust Particles Shader Material ---
const ParticleShader = {
    uniforms: {
        uTime: { value: 0 },
        uMouse: { value: new THREE.Vector2(0, 0) },
        uMouseStrength: { value: 1.0 },
        uLampPos: { value: new THREE.Vector3(0, 3.5, 0) },
        uLampRot: { value: 0 },
        uLightIntensity: { value: 0 },
        uInputFocused: { value: 0.0 },
        uShockwaveAge: { value: -1.0 },
    },
    vertexShader: `
        uniform float uTime;
        uniform vec2 uMouse;
        uniform float uMouseStrength;
        uniform vec3 uLampPos;
        uniform float uLampRot;
        uniform float uLightIntensity;
        uniform float uInputFocused;
        uniform float uShockwaveAge;

        attribute float aSize;
        attribute float aSpeed;
        attribute float aRandom;

        varying vec3 vColor;
        varying float vOpacity;

        void main() {
            vec3 pos = position;
            
            // Slow organic ambient drift
            pos.x += sin(uTime * 0.15 * aSpeed + aRandom * 8.0) * 1.0;
            pos.y += cos(uTime * 0.12 * aSpeed + aRandom * 15.0) * 0.8;
            pos.z += sin(uTime * 0.20 * aSpeed + aRandom * 25.0) * 0.6;
            
            // 1. Magnetic Vortex orbiting the mouse
            vec3 mouse3D = vec3(uMouse.x, uMouse.y, 0.0);
            vec3 toParticle = pos - mouse3D;
            float distToMouse = length(toParticle);
            if (distToMouse < 3.8) {
                float force = (3.8 - distToMouse) / 3.8; // 0 to 1
                
                // Tangential orbital vector
                vec3 tangent = vec3(-toParticle.y, toParticle.x, 0.0);
                if (length(tangent) > 0.0) tangent = normalize(tangent);
                
                // Pull inwards strongly when input is focused, creating an accretion swarm
                float attraction = mix(-0.15, -0.75, uInputFocused);
                float speedCoeff = mix(1.2, 2.5, uInputFocused);
                
                vec3 vortexForce = (tangent * speedCoeff + normalize(toParticle) * attraction) * force * uMouseStrength * 1.3;
                pos += vortexForce;
            }
            
            // 2. Login Shockwave blast
            if (uShockwaveAge > 0.0 && uShockwaveAge < 1.5) {
                // Centered at login card position directly below bulb
                vec3 source = vec3(uLampPos.x, uLampPos.y - 3.2, 0.0);
                vec3 dirToSource = pos - source;
                // Clamp Z coordinate effect so shockwave acts in 3D space
                float distToSource = length(dirToSource);
                
                float waveSpeed = 8.5; // units per second
                float waveFront = waveSpeed * uShockwaveAge;
                float waveWidth = 1.5;
                
                float distToWaveFront = abs(distToSource - waveFront);
                if (distToWaveFront < waveWidth) {
                    float waveForce = (waveWidth - distToWaveFront) / waveWidth;
                    // Push particles outwards explosively
                    pos += normalize(dirToSource) * waveForce * 3.2 * (1.0 - (uShockwaveAge / 1.5));
                }
            }
            
            // Spotlight dynamic lighting calculation (cone intersection check)
            vec3 localPos = pos - uLampPos;
            
            // Rotate particle's localPos to match the lamp's tilt angle
            float cosR = cos(-uLampRot);
            float sinR = sin(-uLampRot);
            float localX = localPos.x * cosR - localPos.y * sinR;
            float localY = localPos.x * sinR + localPos.y * cosR;
            float localZ = localPos.z;
            
            float height = 9.0;
            float rTop = 0.15;
            float rBottom = 3.5;
            
            float h = -localY;
            float lightIntersection = 0.0;
            
            if (h > 0.0 && h < height) {
                float localRadius = rTop + (rBottom - rTop) * (h / height);
                float distToAxis = sqrt(localX * localX + localZ * localZ);
                
                if (distToAxis < localRadius) {
                    float edgeSoftness = smoothstep(localRadius, localRadius - 0.4, distToAxis);
                    float heightFade = smoothstep(0.0, 0.5, h) * smoothstep(height, height - 1.5, h);
                    lightIntersection = edgeSoftness * heightFade * uLightIntensity;
                }
            }
            
            // Lighting colors
            vec3 warmLitColor = vec3(1.0, 0.90, 0.32); // Richer golden-yellow inside beam
            vec3 coolDarkColor = vec3(0.25, 0.30, 0.50); // Subtle deep blue-grey outside
            
            vColor = mix(coolDarkColor, warmLitColor, lightIntersection);
            
            // Brightness boost inside the beam with organic glint/shimmer
            float shimmer = 0.75 + 0.25 * sin(uTime * 3.5 * aSpeed + aRandom * 12.0);
            float baseOpacity = 0.15 + 0.55 * aRandom;
            vOpacity = mix(baseOpacity * 0.4, baseOpacity * 2.2 * shimmer, lightIntersection);
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            
            // Size attenuation based on distance and lighting
            gl_PointSize = aSize * (280.0 / -mvPosition.z) * (1.0 + lightIntersection * 1.8);
        }
    `,
    fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
            // Render circular particle glow
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = smoothstep(0.5, 0.15, dist) * vOpacity;
            gl_FragColor = vec4(vColor, alpha);
        }
    `
};

// --- GPU Interactive Star Flares Shader Material ---
const StarFlareShader = {
    uniforms: {
        uTime: { value: 0 },
        uLampPos: { value: new THREE.Vector3(0, 3.5, 0) },
        uLampRot: { value: 0 },
        uLightIntensity: { value: 0 },
    },
    vertexShader: `
        uniform float uTime;
        uniform vec3 uLampPos;
        uniform float uLampRot;
        uniform float uLightIntensity;

        attribute float aSize;
        attribute float aSpeed;
        attribute float aRandom;

        varying vec3 vColor;
        varying float vOpacity;

        void main() {
            vec3 pos = position;
            
            // Slightly faster drift for sparks
            pos.x += sin(uTime * 0.3 * aSpeed + aRandom * 12.0) * 1.2;
            pos.y += cos(uTime * 0.25 * aSpeed + aRandom * 22.0) * 1.4;
            pos.z += sin(uTime * 0.4 * aSpeed + aRandom * 32.0) * 0.5;
            
            // Sparks only glow in the volumetric light beam
            vec3 localPos = pos - uLampPos;
            float cosR = cos(-uLampRot);
            float sinR = sin(-uLampRot);
            float localX = localPos.x * cosR - localPos.y * sinR;
            float localY = localPos.x * sinR + localPos.y * cosR;
            float localZ = localPos.z;
            
            float height = 9.0;
            float rTop = 0.15;
            float rBottom = 3.5;
            float h = -localY;
            float lightIntersection = 0.0;
            
            if (h > 0.0 && h < height) {
                float localRadius = rTop + (rBottom - rTop) * (h / height);
                float distToAxis = sqrt(localX * localX + localZ * localZ);
                if (distToAxis < localRadius) {
                    lightIntersection = smoothstep(localRadius, localRadius - 0.5, distToAxis) * 
                                        smoothstep(0.0, 0.6, h) * 
                                        smoothstep(height, height - 1.5, h) * 
                                        uLightIntensity;
                }
            }
            
            vColor = vec3(1.0, 0.90, 0.42); // Warm golden yellow spark
            
            // Rapid high-frequency flickering for sparks
            float sparkFlicker = 0.4 + 0.6 * sin(uTime * 15.0 * aSpeed + aRandom * 50.0);
            vOpacity = lightIntersection * sparkFlicker * (0.3 + 0.7 * aRandom);
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            gl_PointSize = aSize * (260.0 / -mvPosition.z);
        }
    `,
    fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
            // Draw cross-shaped glow flare
            float dist = length(gl_PointCoord - vec2(0.5));
            float horiz = smoothstep(0.05, 0.0, abs(gl_PointCoord.y - 0.5)) * smoothstep(0.5, 0.0, abs(gl_PointCoord.x - 0.5));
            float vert = smoothstep(0.05, 0.0, abs(gl_PointCoord.x - 0.5)) * smoothstep(0.5, 0.0, abs(gl_PointCoord.y - 0.5));
            float core = smoothstep(0.16, 0.0, dist) * 0.5;
            
            float flareGlow = max(max(horiz, vert) * 0.95, core);
            if (flareGlow <= 0.0) discard;
            
            gl_FragColor = vec4(vColor, flareGlow * vOpacity);
        }
    `
};

// --- Scene Rendering Controller ---
function SceneElements({ mouseRef }) {
    const { isLightOn, isLoggedIn, isInputFocused, loginTriggerTime, lampIntensity } = useLight();
    const { viewport, size } = useThree();
    
    // Refs for meshes/materials
    const bgMaterialRef = useRef();
    const spotlightRef = useRef();
    const spotlightMaterialRef = useRef();
    const particlesRef = useRef();
    const particlesMaterialRef = useRef();
    const starFlaresRef = useRef();
    const starFlaresMaterialRef = useRef();
    
    // Dynamics variables
    const lampRotation = useRef(0);
    const lightIntensity = useRef(0);
    const flickerTimer = useRef(0);
    const lastLightOn = useRef(false);
    
    // Mouse coords smoothed in 3D
    const smoothMouse3D = useRef(new THREE.Vector2(0, 0));
    
    // Initialize 3000 GPU particles
    const particleData = useMemo(() => {
        const count = 3000;
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const speeds = new Float32Array(count);
        const randoms = new Float32Array(count);
        
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 16;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 10 - 1.0;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 8;
            
            sizes[i] = 1.0 + Math.random() * 3.5;
            speeds[i] = 0.3 + Math.random() * 1.4;
            randoms[i] = Math.random();
        }
        
        return { positions, sizes, speeds, randoms };
    }, []);

    // Initialize 220 secondary Star Sparks
    const starData = useMemo(() => {
        const count = 220;
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const speeds = new Float32Array(count);
        const randoms = new Float32Array(count);
        
        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 12;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 9 - 1.5;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 6;
            
            sizes[i] = 6.0 + Math.random() * 8.0; // Larger to accommodate lens cross flare
            speeds[i] = 0.6 + Math.random() * 1.6;
            randoms[i] = Math.random();
        }
        
        return { positions, sizes, speeds, randoms };
    }, []);

    // Setup volumetric spotlight geometry
    const coneGeometry = useMemo(() => {
        const geom = new THREE.CylinderGeometry(0.15, 3.5, 9.0, 32, 1, true);
        geom.translate(0, -4.5, 0);
        return geom;
    }, []);

    useFrame((state, delta) => {
        const elapsed = state.clock.elapsedTime;
        
        // --- 1. Compute lamp rotation & coordinates in sync with HTML ---
        const targetRotDeg = isLoggedIn ? 4 : mouseRef.current.x * 4.8;
        lampRotation.current = THREE.MathUtils.lerp(lampRotation.current, targetRotDeg * Math.PI / 180, 0.05);

        const yOffset3D = (isLoggedIn ? -80 : 0) * (viewport.height / size.height);
        const xOffset3D = isLoggedIn ? -0.32 * viewport.width : 0;
        const scale3D = isLoggedIn ? 0.84 : 1;

        const pivotX = xOffset3D;
        const pivotY = viewport.height / 2 + yOffset3D;
        
        if (spotlightRef.current) {
            spotlightRef.current.position.set(pivotX, pivotY, -0.2);
            spotlightRef.current.rotation.z = lampRotation.current;
            spotlightRef.current.scale.set(scale3D, scale3D, scale3D);
        }
        
        const bulbOffset3D = 248 * (viewport.height / size.height) * scale3D;
        const bulbX = pivotX - Math.sin(lampRotation.current) * bulbOffset3D;
        const bulbY = pivotY - Math.cos(lampRotation.current) * bulbOffset3D;
        const bulbPos3D = new THREE.Vector3(bulbX, bulbY, -0.2);
        
        // --- 2. Calculate flickering & target lighting intensity ---
        if (isLightOn && !lastLightOn.current) {
            flickerTimer.current = 0.45;
        }
        lastLightOn.current = isLightOn;

        let targetIntensity = 0;
        if (isLightOn) {
            if (flickerTimer.current > 0) {
                flickerTimer.current -= delta;
                const randVal = Math.sin(elapsed * 98.0) * Math.cos(elapsed * 62.0);
                targetIntensity = randVal > 0.0 ? 1.0 : 0.06;
            } else {
                targetIntensity = 0.94 + 0.06 * Math.sin(elapsed * 7.5);
            }
        }
        
        const lerpSpeed = isLightOn && flickerTimer.current > 0 ? 0.85 : 0.08;
        lightIntensity.current = THREE.MathUtils.lerp(lightIntensity.current, targetIntensity, lerpSpeed);
        
        // --- 3. Compute 3D mouse positions mapped to viewport ---
        const targetMouseX = mouseRef.current.x * (viewport.width / 2);
        const targetMouseY = mouseRef.current.y * (viewport.height / 2);
        smoothMouse3D.current.x = THREE.MathUtils.lerp(smoothMouse3D.current.x, targetMouseX, 0.08);
        smoothMouse3D.current.y = THREE.MathUtils.lerp(smoothMouse3D.current.y, targetMouseY, 0.08);
        
        // --- 4. Calculate login shockwave age ---
        const shockwaveAge = loginTriggerTime > 0 ? (Date.now() - loginTriggerTime) / 1000 : -1.0;
        
        // --- 5. Push updates to GPU uniforms ---
        const scaledIntensity = lightIntensity.current * (lampIntensity / 100);

        if (bgMaterialRef.current) {
            bgMaterialRef.current.uniforms.uTime.value = elapsed;
            bgMaterialRef.current.uniforms.uLightIntensity.value = scaledIntensity;
            const uvX = (bulbPos3D.x / viewport.width) + 0.5;
            const uvY = (bulbPos3D.y / viewport.height) + 0.5;
            bgMaterialRef.current.uniforms.uLampPos2D.value.set(uvX, uvY);
        }
        
        if (spotlightMaterialRef.current) {
            spotlightMaterialRef.current.uniforms.uTime.value = elapsed;
            spotlightMaterialRef.current.uniforms.uLightIntensity.value = scaledIntensity;
        }
        
        if (particlesMaterialRef.current) {
            particlesMaterialRef.current.uniforms.uTime.value = elapsed;
            particlesMaterialRef.current.uniforms.uLightIntensity.value = scaledIntensity;
            particlesMaterialRef.current.uniforms.uMouse.value.copy(smoothMouse3D.current);
            particlesMaterialRef.current.uniforms.uLampPos.value.copy(bulbPos3D);
            particlesMaterialRef.current.uniforms.uLampRot.value = lampRotation.current;
            particlesMaterialRef.current.uniforms.uInputFocused.value = isInputFocused ? 1.0 : 0.0;
            particlesMaterialRef.current.uniforms.uShockwaveAge.value = shockwaveAge;
            particlesMaterialRef.current.uniforms.uMouseStrength.value = 1.0;
        }

        if (starFlaresMaterialRef.current) {
            starFlaresMaterialRef.current.uniforms.uTime.value = elapsed;
            starFlaresMaterialRef.current.uniforms.uLightIntensity.value = scaledIntensity;
            starFlaresMaterialRef.current.uniforms.uLampPos.value.copy(bulbPos3D);
            starFlaresMaterialRef.current.uniforms.uLampRot.value = lampRotation.current;
        }
    });

    return (
        <>
            {/* Background Quad */}
            <mesh position={[0, 0, -5]}>
                <planeGeometry args={[viewport.width * 2, viewport.height * 2]} />
                <shaderMaterial
                    ref={bgMaterialRef}
                    {...BackgroundShader}
                    depthWrite={false}
                    depthTest={false}
                />
            </mesh>

            {/* Volumetric SpotLight Mesh */}
            <mesh ref={spotlightRef} geometry={coneGeometry}>
                <shaderMaterial
                    ref={spotlightMaterialRef}
                    {...VolumetricLightShader}
                    transparent={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </mesh>

            {/* GPU Interactive Particle System (Ambient Dust) */}
            <points ref={particlesRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[particleData.positions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-aSize"
                        args={[particleData.sizes, 1]}
                    />
                    <bufferAttribute
                        attach="attributes-aSpeed"
                        args={[particleData.speeds, 1]}
                    />
                    <bufferAttribute
                        attach="attributes-aRandom"
                        args={[particleData.randoms, 1]}
                    />
                </bufferGeometry>
                <shaderMaterial
                    ref={particlesMaterialRef}
                    {...ParticleShader}
                    transparent={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* GPU Star Sparks Layer (Volumetric Glow Lens Flares) */}
            <points ref={starFlaresRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[starData.positions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-aSize"
                        args={[starData.sizes, 1]}
                    />
                    <bufferAttribute
                        attach="attributes-aSpeed"
                        args={[starData.speeds, 1]}
                    />
                    <bufferAttribute
                        attach="attributes-aRandom"
                        args={[starData.randoms, 1]}
                    />
                </bufferGeometry>
                <shaderMaterial
                    ref={starFlaresMaterialRef}
                    {...StarFlareShader}
                    transparent={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>
        </>
    );
}

// --- Main Simulation Canvas Component ---
export default function SimulationCanvas() {
    const mouseRef = useRef(new THREE.Vector2(0, 0));

    useEffect(() => {
        const handleMouseMove = (e) => {
            const x = (e.clientX / window.innerWidth) * 2 - 1;
            const y = -(e.clientY / window.innerHeight) * 2 + 1;
            mouseRef.current.set(x, y);
        };
        window.addEventListener("mousemove", handleMouseMove);
        return () => window.removeEventListener("mousemove", handleMouseMove);
    }, []);

    return (
        <div className="absolute inset-0 w-full h-full overflow-hidden pointer-events-none z-0">
            <Canvas
                gl={{
                    powerPreference: "high-performance",
                    antialias: true,
                    alpha: false,
                    depth: false,
                    stencil: false,
                }}
                camera={{
                    position: [0, 0, 5],
                    fov: 55,
                    near: 0.1,
                    far: 20,
                }}
                style={{
                    width: "100%",
                    height: "100%",
                    position: "absolute",
                    top: 0,
                    left: 0,
                }}
            >
                <SceneElements mouseRef={mouseRef} />
            </Canvas>
        </div>
    );
}
