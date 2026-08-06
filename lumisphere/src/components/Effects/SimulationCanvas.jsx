import React, { useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { useLight } from "../../context/LightContext";

// --- Full-Screen Atmospheric Background & Weather Environment Shader ---
const BackgroundShader = {
    uniforms: {
        uTime: { value: 0 },
        uLightIntensity: { value: 0 },
        uLampPos2D: { value: new THREE.Vector2(0.5, 0.6) },
        uResolution: { value: new THREE.Vector2(1920, 1080) },
        uTimeOfDay: { value: 2.0 }, // 0.0 = Morning, 1.0 = Evening, 2.0 = Night
        uWeather: { value: 0.0 },   // 0.0 = Clear, 1.0 = Rain, 2.0 = Snow
        uLightning: { value: 0.0 },
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
        uniform vec2 uResolution;
        uniform float uTimeOfDay;
        uniform float uWeather;
        uniform float uLightning;
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
            vec2 uv = vUv;
            float aspect = uResolution.x / max(1.0, uResolution.y);
            vec2 aspectUv = vec2((uv.x - 0.5) * aspect, uv.y - 0.5);

            // 1. Compute Base Sky & Room Colors for Morning, Evening, and Night
            vec3 morningHorizon = vec3(1.0, 0.74, 0.45);
            vec3 morningZenith  = vec3(0.24, 0.54, 0.88);
            vec3 morningBase    = mix(morningHorizon, morningZenith, smoothstep(0.0, 0.9, uv.y));

            // Volumetric Sunlight Beams
            float godRay = fbm(vec2(aspectUv.x * 1.5 - aspectUv.y * 1.2 + uTime * 0.04, aspectUv.y * 1.2));
            morningBase += vec3(0.35, 0.28, 0.12) * godRay * (1.0 - uv.y * 0.7);

            // Evening: Deep twilight magenta/amber horizon fading into dusk indigo
            vec3 eveningHorizon = vec3(0.92, 0.36, 0.18);
            vec3 eveningZenith  = vec3(0.08, 0.09, 0.28);
            vec3 eveningBase    = mix(eveningHorizon, eveningZenith, smoothstep(0.0, 0.85, uv.y));
            float twilightHaze  = fbm(vec2(aspectUv.x * 1.2 + uTime * 0.02, aspectUv.y * 1.0));
            eveningBase += vec3(0.15, 0.05, 0.10) * twilightHaze;

            // Night: Deep cosmic midnight void + twinkling starfield
            vec3 nightHorizon = vec3(0.015, 0.02, 0.05);
            vec3 nightZenith  = vec3(0.003, 0.004, 0.012);
            vec3 nightBase    = mix(nightHorizon, nightZenith, uv.y);

            // Twinkling Cosmic Stars
            float starPattern = fbm(aspectUv * 8.0 + vec2(0.0, uTime * 0.01));
            float starGlitter = smoothstep(0.72, 0.95, starPattern);
            float twinkle     = 0.5 + 0.5 * sin(uTime * 3.0 + aspectUv.x * 10.0 + aspectUv.y * 10.0);
            nightBase += vec3(0.75, 0.88, 1.0) * starGlitter * twinkle * 0.25;

            // 🌀 MOVING NEBULA (GLSL Domain Warping)
            vec2 q = vec2(fbm(aspectUv * 1.5 + uTime * 0.015), fbm(aspectUv * 1.5 + vec2(1.0)));
            vec2 r = vec2(fbm(aspectUv * 2.0 + 4.0 * q + uTime * 0.02), fbm(aspectUv * 2.0 + 4.0 * q));
            float nebulaPattern = fbm(aspectUv * 2.5 + 4.0 * r);
            vec3 nebulaColor = mix(vec3(0.12, 0.02, 0.25), vec3(0.02, 0.18, 0.35), nebulaPattern);
            nightBase += nebulaColor * smoothstep(0.2, 0.8, nebulaPattern) * 0.45;

            // 🌌 AURORA BOREALIS (Undulating Shimmering Wave Curtains)
            float auroraWave = sin(aspectUv.x * 4.5 + uTime * 0.4) * cos(aspectUv.y * 3.0 - uTime * 0.2);
            float auroraMask = smoothstep(0.35, 0.9, uv.y) * smoothstep(0.1, 0.8, auroraWave);
            vec3 auroraColor = mix(vec3(0.1, 0.9, 0.5), vec3(0.5, 0.2, 0.9), sin(uTime * 0.2) * 0.5 + 0.5);
            nightBase += auroraColor * auroraMask * 0.35;

            // 🌙 MOON & CRESCENT MOON PHASES
            vec2 moonPos = vec2(0.75, 0.78);
            float moonDist = length(uv - moonPos);
            if (moonDist < 0.045) {
                float moonCore = smoothstep(0.045, 0.04, moonDist);
                float crater = fbm(aspectUv * 40.0);
                vec3 moonTex = mix(vec3(0.92, 0.94, 0.98), vec3(0.65, 0.68, 0.75), crater * 0.4);
                // Shadow crescent phase calculation
                float shadowOffset = sin(uTime * 0.05) * 0.03;
                float shadowDist = length(uv - (moonPos + vec2(shadowOffset, 0.01)));
                float moonPhaseMask = smoothstep(0.038, 0.045, shadowDist);
                nightBase += moonTex * moonCore * moonPhaseMask * 0.95;
            }

            // ☄️ SHOOTING STARS (METEOR STREAKS)
            float meteorTime = mod(uTime * 0.4, 4.0);
            vec2 meteorStart = vec2(0.2, 0.9);
            vec2 meteorDir = vec2(0.3, -0.2);
            vec2 meteorCurrent = meteorStart + meteorDir * meteorTime;
            float meteorDist = length(uv - meteorCurrent);
            if (meteorDist < 0.015 && meteorTime < 1.2) {
                float meteorGlow = smoothstep(0.015, 0.0, meteorDist);
                nightBase += vec3(0.9, 0.95, 1.0) * meteorGlow * (1.2 - meteorTime);
            }

            // 🛰️ FLYING SATELLITE (High-Orbit Beacon)
            vec2 satCurrent = vec2(mod(uTime * 0.02, 1.4) - 0.2, 0.88);
            float satDist = length(uv - satCurrent);
            if (satDist < 0.004) {
                float satPulse = sin(uTime * 6.0) * 0.5 + 0.5;
                nightBase += vec3(0.4, 0.85, 1.0) * satPulse * 0.9;
            }

            // ✈️ PASSING AIRCRAFT (Horizon Navigation Strobe)
            vec2 planeCurrent = vec2(mod(uTime * 0.04 + 0.5, 1.5) - 0.25, 0.48);
            float planeDist = length(uv - planeCurrent);
            if (planeDist < 0.005) {
                float strobe = step(0.6, sin(uTime * 12.0));
                nightBase += vec3(1.0, 0.2, 0.2) * strobe * 0.95;
            }

            // ☁️ PROCEDURAL DRIFTING FBM CLOUDS
            float cloudNoise = fbm(aspectUv * 2.5 + vec2(uTime * 0.02, 0.0));
            float cloudMask = smoothstep(0.45, 0.8, cloudNoise);
            nightBase += vec3(0.12, 0.15, 0.22) * cloudMask * 0.25;

            // Horizon Ambient Glow
            float horizonGlow = smoothstep(0.35, 0.0, uv.y);
            nightBase += vec3(0.06, 0.09, 0.18) * horizonGlow;

            // Blend Sky Environment across Time of Day (0=Morning, 1=Evening, 2=Night)
            vec3 skyColor = mix(morningBase, eveningBase, clamp(uTimeOfDay, 0.0, 1.0));
            skyColor = mix(skyColor, nightBase, clamp(uTimeOfDay - 1.0, 0.0, 1.0));

            // 2. Atmospheric Rainstorm Tinting
            if (uWeather > 0.5 && uWeather < 1.5) {
                skyColor = mix(skyColor, vec3(0.02, 0.04, 0.09), 0.45);
            }

            // 3. Viewport Edge Frost Crystallization
            if (uWeather > 1.5) {
                vec2 borderDist = abs(uv - 0.5) * 2.0;
                float borderEdge = max(borderDist.x, borderDist.y);
                float crystalNoise = fbm(aspectUv * 6.0 + uTime * 0.01);
                float frostMask = smoothstep(0.76, 0.98, borderEdge + crystalNoise * 0.14);
                skyColor = mix(skyColor, vec3(0.82, 0.90, 0.98), frostMask * 0.75);
            }

            // 4. Dynamic Lightning Storm Flash
            if (uLightning > 0.01) {
                vec3 flashColor = vec3(0.65, 0.80, 1.0) * uLightning * 0.85;
                skyColor += flashColor;
            }

            // 5. Desk Lamp Volumetric Radiant Glow on Wall
            float lightGlow = smoothstep(1.2, 0.0, length(uv - uLampPos2D)) * uLightIntensity;
            vec3 lampGlowColor = vec3(0.28, 0.21, 0.07);
            float lampWeight = mix(0.45, 1.0, clamp(uTimeOfDay * 0.6, 0.0, 1.0));
            skyColor += lampGlowColor * lightGlow * lampWeight;

            gl_FragColor = vec4(skyColor, 1.0);
        }
    `
};

// --- Volumetric Lamp Spotlight Shader ---
const VolumetricLightShader = {
    uniforms: {
        uTime: { value: 0 },
        uLightIntensity: { value: 0 },
        uColor: { value: new THREE.Color("#ffd43f") },
        uTimeOfDay: { value: 2.0 },
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
        uniform float uTimeOfDay;

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
            float h = -vLocalPosition.y;
            float height = 9.0;
            
            if (h < 0.0 || h > height) discard;
            
            float radiusAtH = 0.15 + (3.5 - 0.15) * (h / height);
            float distToAxis = length(vec2(vLocalPosition.x, vLocalPosition.z));
            
            if (distToAxis > radiusAtH) discard;
            
            float density = smoothstep(radiusAtH, radiusAtH - 0.7, distToAxis);
            density *= smoothstep(0.0, 0.4, h) * smoothstep(height, height - 1.5, h);
            
            vec3 noiseCoords1 = vec3(vLocalPosition.x * 2.0, vLocalPosition.y * 1.5 - uTime * 0.7, vLocalPosition.z * 2.0);
            vec3 noiseCoords2 = vec3(vLocalPosition.x * 4.5 + uTime * 0.15, vLocalPosition.y * 2.8 - uTime * 1.2, vLocalPosition.z * 4.5);
            float smokePattern = mix(noise(noiseCoords1), noise(noiseCoords2), 0.35);
            
            float modeMultiplier = mix(0.7, 1.0, clamp(uTimeOfDay * 0.5, 0.0, 1.0));
            float finalVolume = density * (0.2 + 0.8 * smokePattern) * uLightIntensity * 0.46 * modeMultiplier;
            
            gl_FragColor = vec4(uColor, finalVolume);
        }
    `
};

// --- GPU Dust Particles Shader ---
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
        uTimeOfDay: { value: 2.0 },
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
        uniform float uTimeOfDay;

        attribute float aSize;
        attribute float aSpeed;
        attribute float aRandom;

        varying vec3 vColor;
        varying float vOpacity;

        void main() {
            vec3 pos = position;
            
            pos.x += sin(uTime * 0.15 * aSpeed + aRandom * 8.0) * 1.0;
            pos.y += cos(uTime * 0.12 * aSpeed + aRandom * 15.0) * 0.8;
            pos.z += sin(uTime * 0.20 * aSpeed + aRandom * 25.0) * 0.6;
            
            vec3 mouse3D = vec3(uMouse.x, uMouse.y, 0.0);
            vec3 toParticle = pos - mouse3D;
            float distToMouse = length(toParticle);
            if (distToMouse < 3.8) {
                float force = (3.8 - distToMouse) / 3.8;
                vec3 tangent = vec3(-toParticle.y, toParticle.x, 0.0);
                if (length(tangent) > 0.0) tangent = normalize(tangent);
                
                float attraction = mix(-0.15, -0.75, uInputFocused);
                float speedCoeff = mix(1.2, 2.5, uInputFocused);
                
                vec3 vortexForce = (tangent * speedCoeff + normalize(toParticle) * attraction) * force * uMouseStrength * 1.3;
                pos += vortexForce;
            }
            
            if (uShockwaveAge > 0.0 && uShockwaveAge < 1.5) {
                vec3 source = vec3(uLampPos.x, uLampPos.y - 3.2, 0.0);
                vec3 dirToSource = pos - source;
                float distToSource = length(dirToSource);
                
                float waveSpeed = 8.5;
                float waveFront = waveSpeed * uShockwaveAge;
                float waveWidth = 1.5;
                
                float distToWaveFront = abs(distToSource - waveFront);
                if (distToWaveFront < waveWidth) {
                    float waveForce = (waveWidth - distToWaveFront) / waveWidth;
                    pos += normalize(dirToSource) * waveForce * 3.2 * (1.0 - (uShockwaveAge / 1.5));
                }
            }
            
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
                    float edgeSoftness = smoothstep(localRadius, localRadius - 0.4, distToAxis);
                    float heightFade = smoothstep(0.0, 0.5, h) * smoothstep(height, height - 1.5, h);
                    lightIntersection = edgeSoftness * heightFade * uLightIntensity;
                }
            }
            
            vec3 warmLitColor = vec3(1.0, 0.90, 0.32);
            vec3 coolMorningColor = vec3(0.40, 0.55, 0.70);
            vec3 coolEveningColor = vec3(0.35, 0.28, 0.55);
            vec3 coolNightColor   = vec3(0.25, 0.30, 0.50);
            
            vec3 coolDarkColor = mix(coolMorningColor, coolEveningColor, clamp(uTimeOfDay, 0.0, 1.0));
            coolDarkColor = mix(coolDarkColor, coolNightColor, clamp(uTimeOfDay - 1.0, 0.0, 1.0));
            
            vColor = mix(coolDarkColor, warmLitColor, lightIntersection);
            
            float shimmer = 0.75 + 0.25 * sin(uTime * 3.5 * aSpeed + aRandom * 12.0);
            float baseOpacity = 0.15 + 0.55 * aRandom;
            vOpacity = mix(baseOpacity * 0.4, baseOpacity * 2.2 * shimmer, lightIntersection);
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            float depth = max(1.0, -mvPosition.z);
            gl_PointSize = clamp(aSize * (24.0 / depth) * (1.0 + lightIntersection * 1.2), 1.0, 18.0);
        }
    `,
    fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = smoothstep(0.5, 0.15, dist) * vOpacity;
            gl_FragColor = vec4(vColor, alpha);
        }
    `
};

// --- GPU Star Flares Shader ---
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
            
            pos.x += sin(uTime * 0.3 * aSpeed + aRandom * 12.0) * 1.2;
            pos.y += cos(uTime * 0.25 * aSpeed + aRandom * 22.0) * 1.4;
            pos.z += sin(uTime * 0.4 * aSpeed + aRandom * 32.0) * 0.5;
            
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
            
            vColor = vec3(1.0, 0.90, 0.42);
            float sparkFlicker = 0.4 + 0.6 * sin(uTime * 15.0 * aSpeed + aRandom * 50.0);
            vOpacity = lightIntersection * sparkFlicker * (0.3 + 0.7 * aRandom);
            
            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            float depth = max(1.0, -mvPosition.z);
            gl_PointSize = clamp(aSize * (18.0 / depth), 1.0, 16.0);
        }
    `,
    fragmentShader: `
        varying vec3 vColor;
        varying float vOpacity;
        void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float flareGlow = smoothstep(0.5, 0.0, dist);
            gl_FragColor = vec4(vColor, flareGlow * vOpacity);
        }
    `
};

// --- GPU Rain Droplets Shader ---
const RainParticleShader = {
    uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.0 },
    },
    vertexShader: `
        uniform float uTime;
        attribute float aSpeed;
        attribute float aLength;
        varying float vAlpha;

        void main() {
            vec3 pos = position;
            float fall = mod(uTime * aSpeed * 12.0 + position.y * 2.5, 16.0);
            pos.y = 8.0 - fall;
            pos.x += (pos.y - 8.0) * 0.08;

            vAlpha = smoothstep(-8.0, -4.0, pos.y) * smoothstep(8.0, 4.0, pos.y);

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            float depth = max(1.0, -mvPosition.z);
            gl_PointSize = clamp(aLength * (0.8 / depth), 1.0, 3.0);
        }
    `,
    fragmentShader: `
        varying float vAlpha;
        uniform float uOpacity;

        void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = smoothstep(0.5, 0.0, dist) * vAlpha * uOpacity * 0.8;
            gl_FragColor = vec4(0.75, 0.88, 1.0, alpha);
        }
    `
};

// --- GPU Snow Flakes Shader ---
const SnowParticleShader = {
    uniforms: {
        uTime: { value: 0 },
        uOpacity: { value: 0.0 },
    },
    vertexShader: `
        uniform float uTime;
        attribute float aSpeed;
        attribute float aSize;
        attribute float aRandom;
        varying float vAlpha;

        void main() {
            vec3 pos = position;
            float fall = mod(uTime * aSpeed * 1.8 + aRandom * 20.0, 14.0);
            pos.y = 7.0 - fall;
            pos.x += sin(uTime * 1.2 + aRandom * 10.0) * 0.8;
            pos.z += cos(uTime * 0.9 + aRandom * 15.0) * 0.5;

            vAlpha = smoothstep(-7.0, -3.0, pos.y) * smoothstep(7.0, 3.0, pos.y);

            vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
            gl_Position = projectionMatrix * mvPosition;
            float depth = max(1.0, -mvPosition.z);
            gl_PointSize = clamp(aSize * (4.0 / depth), 1.0, 12.0);
        }
    `,
    fragmentShader: `
        varying float vAlpha;
        uniform float uOpacity;

        void main() {
            float dist = length(gl_PointCoord - vec2(0.5));
            if (dist > 0.5) discard;
            float alpha = smoothstep(0.5, 0.1, dist) * vAlpha * uOpacity * 0.75;
            gl_FragColor = vec4(0.92, 0.96, 1.0, alpha);
        }
    `
};

// --- Scene Elements Rendering Controller ---
function SceneElements({ mouseRef }) {
    const {
        isLightOn,
        isLoggedIn,
        isInputFocused,
        loginTriggerTime,
        lampIntensity,
        timeOfDay,
        weather,
        lightningFlash,
    } = useLight();

    const { viewport, size } = useThree();
    
    // Shader Material Refs
    const bgMaterialRef = useRef();
    const spotlightRef = useRef();
    const spotlightMaterialRef = useRef();
    const particlesRef = useRef();
    const particlesMaterialRef = useRef();
    const starFlaresRef = useRef();
    const starFlaresMaterialRef = useRef();
    const rainMaterialRef = useRef();
    const snowMaterialRef = useRef();
    
    // Dynamic Refs
    const lampRotation = useRef(0);
    const lightIntensity = useRef(0);
    const flickerTimer = useRef(0);
    const lastLightOn = useRef(false);
    const smoothMouse3D = useRef(new THREE.Vector2(0, 0));
    
    // GPU Dust Particles (3000)
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

    // GPU Star Sparks (220)
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
            
            sizes[i] = 6.0 + Math.random() * 8.0;
            speeds[i] = 0.6 + Math.random() * 1.6;
            randoms[i] = Math.random();
        }
        
        return { positions, sizes, speeds, randoms };
    }, []);

    // GPU Rain Drops (1200)
    const rainData = useMemo(() => {
        const count = 1200;
        const positions = new Float32Array(count * 3);
        const speeds = new Float32Array(count);
        const lengths = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 14;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 16;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 6;

            speeds[i] = 0.8 + Math.random() * 1.2;
            lengths[i] = 4.0 + Math.random() * 6.0;
        }

        return { positions, speeds, lengths };
    }, []);

    // GPU Snow Flakes (700)
    const snowData = useMemo(() => {
        const count = 700;
        const positions = new Float32Array(count * 3);
        const sizes = new Float32Array(count);
        const speeds = new Float32Array(count);
        const randoms = new Float32Array(count);

        for (let i = 0; i < count; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 15;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 14;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 7;

            sizes[i] = 3.5 + Math.random() * 5.5;
            speeds[i] = 0.4 + Math.random() * 0.8;
            randoms[i] = Math.random();
        }

        return { positions, sizes, speeds, randoms };
    }, []);

    // Cone Geometry for Spotlight
    const coneGeometry = useMemo(() => {
        const geom = new THREE.CylinderGeometry(0.15, 3.5, 9.0, 32, 1, true);
        geom.translate(0, -4.5, 0);
        return geom;
    }, []);

    useFrame((state, delta) => {
        const elapsed = state.clock.elapsedTime;
        
        // --- 1. Compute lamp rotation & coordinates in sync with HTML ---
        const isMobile = size.width < 1024;
        const targetRotDeg = isLoggedIn ? (isMobile ? 0 : 4) : mouseRef.current.x * (isMobile ? 2.5 : 4.8);
        lampRotation.current = THREE.MathUtils.lerp(lampRotation.current, targetRotDeg * Math.PI / 180, 0.05);

        const yOffset3D = (isLoggedIn ? (isMobile ? -60 : -80) : 0) * (viewport.height / size.height);
        const xOffset3D = isLoggedIn ? (isMobile ? 0 : -0.32 * viewport.width) : 0;
        const scale3D = isLoggedIn ? (isMobile ? 0.72 : 0.84) : (isMobile ? 0.85 : 1);

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
        
        // --- 5. Environment & Weather parameters ---
        let timeVal = 2.0; // Night
        if (timeOfDay === "morning") timeVal = 0.0;
        else if (timeOfDay === "evening") timeVal = 1.0;

        let weatherVal = 0.0; // Clear
        if (weather === "rain") weatherVal = 1.0;
        else if (weather === "snow") weatherVal = 2.0;

        const scaledIntensity = lightIntensity.current * (lampIntensity / 100);

        // Dynamic Spotlight color by time of day
        let spotlightColor = new THREE.Color("#ffd43f");
        if (timeOfDay === "morning") spotlightColor = new THREE.Color("#ffe79a");
        else if (timeOfDay === "evening") spotlightColor = new THREE.Color("#ffaa33");

        // --- 6. Push updates to GPU uniforms ---
        if (bgMaterialRef.current) {
            bgMaterialRef.current.uniforms.uTime.value = elapsed;
            bgMaterialRef.current.uniforms.uLightIntensity.value = scaledIntensity;
            bgMaterialRef.current.uniforms.uTimeOfDay.value = timeVal;
            bgMaterialRef.current.uniforms.uWeather.value = weatherVal;
            bgMaterialRef.current.uniforms.uLightning.value = lightningFlash;
            bgMaterialRef.current.uniforms.uResolution.value.set(size.width, size.height);
            const uvX = (bulbPos3D.x / viewport.width) + 0.5;
            const uvY = (bulbPos3D.y / viewport.height) + 0.5;
            bgMaterialRef.current.uniforms.uLampPos2D.value.set(uvX, uvY);
        }
        
        if (spotlightMaterialRef.current) {
            spotlightMaterialRef.current.uniforms.uTime.value = elapsed;
            spotlightMaterialRef.current.uniforms.uLightIntensity.value = scaledIntensity;
            spotlightMaterialRef.current.uniforms.uTimeOfDay.value = timeVal;
            spotlightMaterialRef.current.uniforms.uColor.value = spotlightColor;
        }
        
        if (particlesMaterialRef.current) {
            particlesMaterialRef.current.uniforms.uTime.value = elapsed;
            particlesMaterialRef.current.uniforms.uLightIntensity.value = scaledIntensity;
            particlesMaterialRef.current.uniforms.uTimeOfDay.value = timeVal;
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

        if (rainMaterialRef.current) {
            rainMaterialRef.current.uniforms.uTime.value = elapsed;
            const targetOpacity = weather === "rain" ? 1.0 : 0.0;
            rainMaterialRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(
                rainMaterialRef.current.uniforms.uOpacity.value,
                targetOpacity,
                0.05
            );
        }

        if (snowMaterialRef.current) {
            snowMaterialRef.current.uniforms.uTime.value = elapsed;
            const targetOpacity = weather === "snow" ? 1.0 : 0.0;
            snowMaterialRef.current.uniforms.uOpacity.value = THREE.MathUtils.lerp(
                snowMaterialRef.current.uniforms.uOpacity.value,
                targetOpacity,
                0.05
            );
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

            {/* GPU Rain Particles */}
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[rainData.positions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-aSpeed"
                        args={[rainData.speeds, 1]}
                    />
                    <bufferAttribute
                        attach="attributes-aLength"
                        args={[rainData.lengths, 1]}
                    />
                </bufferGeometry>
                <shaderMaterial
                    ref={rainMaterialRef}
                    {...RainParticleShader}
                    transparent={true}
                    depthWrite={false}
                    blending={THREE.AdditiveBlending}
                />
            </points>

            {/* GPU Snow Particles */}
            <points>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[snowData.positions, 3]}
                    />
                    <bufferAttribute
                        attach="attributes-aSize"
                        args={[snowData.sizes, 1]}
                    />
                    <bufferAttribute
                        attach="attributes-aSpeed"
                        args={[snowData.speeds, 1]}
                    />
                    <bufferAttribute
                        attach="attributes-aRandom"
                        args={[snowData.randoms, 1]}
                    />
                </bufferGeometry>
                <shaderMaterial
                    ref={snowMaterialRef}
                    {...SnowParticleShader}
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
        const handleMove = (e) => {
            const clientX = e.touches && e.touches.length > 0 ? e.touches[0].clientX : e.clientX;
            const clientY = e.touches && e.touches.length > 0 ? e.touches[0].clientY : e.clientY;
            const x = (clientX / window.innerWidth) * 2 - 1;
            const y = -(clientY / window.innerHeight) * 2 + 1;
            mouseRef.current.set(x, y);
        };

        window.addEventListener("mousemove", handleMove);
        window.addEventListener("touchstart", handleMove, { passive: true });
        window.addEventListener("touchmove", handleMove, { passive: true });

        return () => {
            window.removeEventListener("mousemove", handleMove);
            window.removeEventListener("touchstart", handleMove);
            window.removeEventListener("touchmove", handleMove);
        };
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
