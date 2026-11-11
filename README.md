# 💡 LumiSphere

> **An immersive, interactive WebGL developer experience and portfolio powered by React, Three.js, custom shader physics, procedural Web Audio API synthesis, and glassmorphic UI.**

---

## 🌟 Overview

**LumiSphere** is a high-performance, interactive web application and developer portfolio built by **Varun Vaibhav**. Designed as an interactive fusion between art, physics, and software engineering, LumiSphere centers around an overhead retro-futuristic halogen desk lamp featuring realistic drag-and-pull physics.

Toggling the lamp ignites a dynamic WebGL volumetric lighting engine with atmospheric dust particles, custom GLSL shaders, procedural Web Audio synthesis, and unlocks an interactive portfolio dashboard detailing Varun's engineering projects, industry experience, machine learning background, skills matrix, career roadmap, and an embedded terminal CLI.

---

## ✨ Key Features & Mechanics

### 1. 🪢 Physics-Driven Overhead Halogen Lamp & Pull Chain
* **Spring Physics Pull Chain**: Realistic drag-and-release chain physics built using `framer-motion` spring dynamics (`stiffness: 300`, `damping: 18`) with beaded chain links and dynamic audio feedback.
* **Realistic Halogen Flicker & Dimming**: Multi-stage electrical sputter animation on ignition with variable brightness control (0% to 100% dimmer adjustment).
* **Parallax Lamp Motion**: Smooth tilt and rotation tracking mouse coordinates across the viewport.

### 2. 🌌 Volumetric WebGL Shaders & Physics Canvas
* **Volumetric Light Cone (God Rays)**: Custom GLSL Fragment & Vertex Shaders rendering light scatter, density fading, and dynamic volumetric cones.
* **Atmospheric Dust Simulation**: 200+ light-reactive particles floating with continuous noise vectors and mouse repulsion physics.
* **FBM Background Shader**: Fractional Brownian Motion (FBM) shader rendering slow nebula clouds behind the lamp.
* **Surface Reflections**: Dynamic light reflections across floor elements, lamp surfaces, and glassmorphic cards.

### 3. 🔊 Procedural Web Audio Engine (Pure Synthesizer)
* **Zero External Audio Files**: 100% synthesized in real time using the **Web Audio API**:
  * **Relay Clicks**: Crisp dual-frequency impulse clicks for lamp toggles.
  * **Bulb Hum**: Low-pass filtered 60Hz AC mains hum with subtle frequency modulation.
  * **Chain Pull Sound**: Metallic multi-bead collision sound sequence on chain pull.
  * **Ambient Drone**: Deep binaural synth drone atmosphere.
  * **Terminal Sounds**: Mechanical key click sound feedback and glitch sound sweeps.
* **Audio Persistence**: Mute/Unmute toggle state saved in `localStorage`.

### 4. 🔮 Interactive Hologram 3D Particle Visualizer
* **React Three Fiber (R3F) & Three.js**: Real-time 3D particle visualizer embedded in the portfolio view.
* **Dynamic Geometry Morphing**: Morphing particle point cloud that dynamically transitions shapes based on the active tab:
  * **Dashboard**: Double-Helix Reactor Core
  * **Skills**: Neural Constellation Network (Brain Sphere)
  * **Projects**: 6x6x6 Digital Matrix Grid
  * **Roadmap**: Winding Spiral Helix
* **Interactive Orbit Controls & Calibration**: Interactive rotation, zoom, and animation speed adjustments.

### 5. 💻 Built-in Interactive Terminal CLI
* Integrated command-line interface supporting interactive commands:
  * `/help` – View available commands
  * `/dim <0-100>` – Calibrate halogen light intensity directly from the terminal
  * `/glitch` – Trigger video buffer glitch matrix animation
  * `/status` – Display live halogen core telemetry and diagnostic data
  * `/whoami` – Display current user session state
  * `/clear` – Clear terminal history log

### 6. 📊 Developer Portfolio & Career Showcase
* **Single source of truth**: every personal detail lives in [`src/data/profile.js`](lumisphere/src/data/profile.js). Portfolio sections, the résumé, the terminal, the Ask Lumi AI chat and the desk props all read from it.
* **Sections**: Overview (impact numbers, featured work, live terminal), Experience (L&T, Neoshaan, education, leadership), Projects (25 projects, filterable and searchable, with detail sheets), Skills, Awards & Research, Journey and Contact.
* **Résumé**: printable document view (Save as PDF), plain-text copy, and a gallery view.
* **Entry**: pull the chain (or focus it and press Enter), then sign in with a name or continue as a guest. The intro plays once per session; add `?skipintro` to skip it.
* **Ask Lumi AI about me**: a button under my name opens a chat pop-up that answers in first person from `src/utils/askMe.js` (offline, no AI service), with project links, follow-ups and read-aloud.
* **Responsive**: phone, tablet and desktop layouts; the WebGL hologram loads only on desktop.

---

## 🛠️ Tech Stack & Technologies

| Category | Technology / Library |
| :--- | :--- |
| **Frontend Core** | React 19, Vite, JavaScript (ES6+) |
| **Styling & Design** | Tailwind CSS v4, Lucide React Icons, Glassmorphism CSS |
| **Animation Engine** | Framer Motion, Motion |
| **3D & Graphics** | Three.js, `@react-three/fiber`, `@react-three/drei`, GLSL Shaders |
| **Audio Synthesizer** | Custom Web Audio API (`AudioEngine.js`) |
| **State & Scroll** | React Context API, `@studio-freight/lenis` |
| **Validation & Forms** | React Hook Form, Zod |

---

## 📂 Project Architecture

```
lumisphere/
├── public/                     # Static assets & favicon
├── src/
│   ├── assets/                 # SVGs and static media
│   ├── components/
│   │   ├── About/
│   │   │   └── AboutPage.jsx   # Portfolio dashboard, tabs, terminal, 3D hologram
│   │   ├── Effects/
│   │   │   ├── SimulationCanvas.jsx # WebGL canvas, dust particles, FBM shaders
│   │   │   └── GodRays.jsx     # Volumetric light ray calculations
│   │   ├── Lamp/
│   │   │   ├── Lamp.jsx        # Lamp housing, tilt physics, flicker controller
│   │   │   ├── PullChain.jsx   # Spring-physics pull chain mechanism
│   │   │   └── BulbGlow.jsx    # SVG & CSS radial halogen glow layers
│   │   ├── Login/
│   │   │   ├── LoginCard.jsx   # Interactive authentication / welcome card
│   │   └── UI/
│   │       ├── AudioToggle.jsx # Ambient audio toggle control button
│   │       ├── SecretModalsHost.jsx # Easter-egg modals (arcade, dev room, achievements)
│   │       ├── FloorReflection.jsx # Lighting reflection on floor surface
│   │       ├── GlassBorder.jsx # Glassmorphic border container
│   │       ├── InputField.jsx  # Glowing input component
│   │       ├── LampReflection.jsx # Light reflection effect
│   │       ├── NoiseLayer.jsx  # SVG film grain/noise overlay
│   │       ├── PremiumButton.jsx # Dynamic glowing action button
│   │       └── PremiumInput.jsx # Multi-style input field
│   ├── context/
│   │   ├── LightContext.jsx    # Global light, dimmer, audio & auth state
│   │   └── SceneContext.jsx    # 3D viewport canvas context
│   ├── hooks/
│   │   ├── UseCamera.js        # 3D camera controls
│   │   ├── useMobile.js        # Responsive mobile viewport hook
│   │   ├── useMousePosition.js # Mouse tracking hook
│   │   └── useSceneStartup.js  # Startup fade-in orchestrator
│   ├── utils/
│   │   └── AudioEngine.js      # Procedural Web Audio API synthesizer
│   ├── App.jsx                 # Application entry route
│   ├── global.css              # Custom styling & animation utilities
│   └── main.jsx                # React DOM render root
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** (v18.0.0 or higher) and **npm** installed on your system.

### Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/theflighttechofficial/lumisphere.git
   cd lumisphere/lumisphere
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start the development server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Open your browser and navigate to `http://localhost:5173`.

---

## ⚡ NPM Scripts

| Script | Command | Purpose |
| :--- | :--- | :--- |
| `npm run dev` | `vite` | Starts local Vite development server |
| `npm run build` | `vite build` | Compiles optimized production bundle |
| `npm run preview` | `vite preview` | Previews production build locally |
| `npm run lint` | `eslint .` | Runs ESLint analysis |

---

## 👨‍💻 Developer Profile

**S. Varun Vaibhav**  
*The Flight Tech Labs | Data Engineer • AI/ML Builder • Full-Stack Developer*  
*3rd-year B.Tech in Computer Science Engineering (AI & Data Analytics)*  
*Sri Ramachandra Faculty of Engineering and Technology (SRIHER), Chennai*

* **Philosophy**: *"Ship working code, not prototypes. Solve real problems, not hypothetical ones."*
* **GitHub**: [@theflighttechofficial](https://github.com/theflighttechofficial)
* **LinkedIn**: [varun-vaibhav-s-11b69a2ba](https://linkedin.com/in/varun-vaibhav-s-11b69a2ba)
* **Hashnode**: [theflighttechlabs.hashnode.dev](https://theflighttechlabs.hashnode.dev)
* **Experience**: Data Analyst Intern at **Larsen & Toubro Construction** (hybrid RAG tender-spec extractor: 3–4 days → ~15 min per run, $22 → $2 per run; Scan2Sheet OCR for AutoCAD SLDs).
* **Certifications**: 8 Verified Certifications including Stanford Machine Learning (Andrew Ng), Google Prompting Essentials, HackerRank Python & SQL Gold Badges (5★), Cisco Packet Tracer, IBM & Microsoft ML.
* **Target**: 1-Year Placement (May 2028 - May 2029) -> MS in CS/Data Science @ Arizona State University (Fall 2029).

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
