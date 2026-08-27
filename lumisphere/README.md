# 💡 LumiSphere

> **An immersive, interactive 3D WebGL developer experience, Interactive Desk Workspace, and Portfolio powered by React 19, Three.js / React Three Fiber, Custom GLSL Shaders, Procedural Web Audio API Synthesis, Floating AI Companion Drone, and Glassmorphic UI.**

---

## 🌟 Overview

**LumiSphere** is a high-performance, interactive 3D web application and developer portfolio built by **Varun Vaibhav**. Designed as a fusion between digital art, WebGL physics, procedural sound synthesis, and software engineering, LumiSphere centers around an interactive retro-futuristic halogen desk lamp and a fully functional 3D developer desk environment.

Toggling the lamp ignites a dynamic WebGL volumetric lighting engine featuring atmospheric dust particles, custom GLSL shaders, procedural Web Audio synthesis, an autonomous flying AI companion drone ("Lumi Drone"), interactive desk items (mechanical keyboard, retro arcade cabinet, scribble canvas, bookshelf, sticky notes, monitor display terminal), and unlocks an interactive portfolio dashboard detailing Varun's AI/ML engineering projects, industry experience, machine learning background, holographic skills network, interactive resume room, and embedded CLI terminal.

---

## ✨ Key Features & Mechanics

### 1. 🪢 Physics-Driven Overhead Halogen Lamp & Pull Chain
* **Spring Physics Pull Chain**: Realistic drag-and-release chain physics built using `framer-motion` spring dynamics (`stiffness: 300`, `damping: 18`) with beaded chain links and dynamic multi-bead audio collision feedback.
* **Realistic Halogen Flicker & Dimming**: Multi-stage electrical sputter ignition sequence with variable dimmer intensity adjustment (0% to 100%).
* **Parallax Lamp Physics**: Smooth tilt and 3D rotation tracking viewport mouse coordinates.

### 2. 🌌 Volumetric WebGL Shaders & Physics Canvas
* **Volumetric Light Cone (God Rays)**: Custom GLSL Fragment & Vertex Shaders rendering light scatter, density fading, and dynamic volumetric light cones.
* **Atmospheric Dust Particles**: 200+ light-reactive atmospheric dust particles floating with continuous noise vectors and dynamic mouse repulsion physics.
* **FBM Background Shader**: Fractional Brownian Motion (FBM) shader rendering slow nebula clouds behind the workspace.
* **Surface & Floor Reflections**: Dynamic real-time light reflections across desk surfaces, lamp housing, and glassmorphic cards.

### 3. 🖥️ Interactive Developer Desk & Workstation Suite
* **💻 Telemetry Monitor & Terminal CLI (`MonitorDisplayModal`)**: Live halogen core telemetry, interactive terminal CLI with custom slash commands (`/help`, `/dim`, `/glitch`, `/status`, `/whoami`, `/clear`), screen glitch animation buffer, and system process manager.
* **⌨️ Synthesized Mechanical Keyboard (`MechKeyboardModal`)**: Tactile switch acoustics generated on-the-fly via Web Audio API, keycap visual customization, and integrated typing speed benchmark game.
* **📓 Developer Notebook & Architecture Journal (`NotebookModal`)**: Interactive flipbook detailing system architecture design logs, ML project blueprints, and engineering notes.
* **📌 Sticky Notes Task App (`StickyNotesApp`)**: Draggable, color-coded sticky notes board with persistent task creation and local state synchronization.
* **🎨 Freehand Scribble Canvas (`ScribbleCanvas`)**: Interactive sketching pad with custom brush sizes, color palette picker, eraser, and PNG export capabilities.
* **🕹️ Retro Arcade Cabinet (`RetroArcadeModal`)**: Playable mini-games (Cyberpunk / Space Invaders runner) with synthesized 8-bit sound effects, high score tracker, and keyboard controls.
* **📚 Research Bookshelf (`BookshelfModal`)**: Interactive bookshelf featuring ML research papers, tech stack documentations, and recommended computer science literature.
* **💾 Cyberpunk USB Projects Hub (`USBProjectsModal`)**: Cyberpunk USB drive visualizer exposing raw project code snippets, architecture diagrams, live demo URLs, and GitHub links.
* **🏆 Gamified Achievements & Badges (`AchievementsModal`)**: Interactive achievement system (e.g. *"Night Owl"*, *"Audio Synthesizer"*, *"Terminal Master"*, *"Easter Egg Hunter"*) unlocking badges upon workspace exploration.
* **🔮 Hidden Dev Room (`HiddenDevRoomModal`)**: Secret developer room easter egg featuring Matrix terminal rain, debug metrics, secret codes, and hidden lore.
* **☕ Animated Coffee Mug Steam (`CoffeeMugSteam`)**: Atmospheric steam particle animation rising from the desk coffee mug.

### 4. 🤖 Autonomous Flying AI Companion Drone ("Lumi Drone")
* **Interactive Flying Companion (`Drone.jsx`, `DroneHologram.jsx`, `DroneSparks.jsx`)**: Autonomous drone floating around the workspace with smooth spring hover physics, spark effects, holographic projections, mouse tracking, status updates, and quick interaction triggers.
* **LumiAI Intelligence Integration (`LumiAIModal.jsx`, `LumiAI.js`)**: Context-aware AI assistant capable of answering user questions about Varun's profile, career experience, machine learning background, and project portfolio.

### 5. 🔊 Pure Procedural Web Audio Engine (Zero External Audio Files)
* **100% Code-Synthesized Audio**: Built completely using the native **Web Audio API** (`AudioEngine.js`) without any external MP3/WAV audio assets:
  * **Relay Clicks**: High-frequency electrical impulse clicks on lamp toggles.
  * **AC Transformer Hum**: Low-pass filtered 60Hz mains transformer hum with subtle frequency modulation.
  * **Pull Chain Collisions**: Metallic multi-bead collision sequence during chain pulls.
  * **Mechanical Key Switches**: Dynamic tactile click acoustics for keyboard typing.
  * **Ambient Binaural Drone**: Atmospheric deep synth space drone.
  * **Retro 8-Bit Arcade SFX**: Synthesized square-wave retro audio for mini-games.
  * **Terminal Glitch Sweeps**: Frequency sweep effects during glitch transitions.
* **Audio Persistence**: Global volume control and Mute/Unmute state saved in `localStorage`.

### 6. 🔮 Holographic 3D Particle Visualizer & Resume Room
* **React Three Fiber (R3F) & Three.js**: Real-time interactive 3D particle visualizer embedded in the portfolio view.
* **Dynamic Geometry Morphing**: Morphing point cloud geometry that dynamically shifts shapes according to the selected navigation tab:
  * **Dashboard**: Double-Helix Reactor Core
  * **Skills**: Neural Constellation Network (`HolographicSkillsNetwork.jsx`)
  * **Projects**: 6x6x6 Digital Matrix Grid
  * **Roadmap**: Winding Spiral Helix
* **Interactive Resume Room (`ResumeRoom.jsx`)**: Interactive career room with resume viewing, downloadable PDF documentation, and credential verification.

### 7. 🎛️ Customization & Visual Environment Control Panel
* **Environment Control Panel (`EnvironmentControlPanel.jsx`)**: Real-time visual control dashboard enabling customization of:
  * Color Presets (Cyberpunk, Matrix Synthwave, Retro Warm, Deep Space Nebula)
  * Light Color Temperature & Volumetric Light Scatter Intensity
  * Dust Particle Count & Repulsion Sensitivity
  * Master Audio Volume & Synthesizer Tuning
* **Magnetic Custom Cursor (`MagneticCustomCursor.jsx`)**: Custom glowing cursor with spring physics and magnetic attraction on interactive targets.

---

## 🛠️ Tech Stack & Technologies

| Category | Technology / Library | Purpose |
| :--- | :--- | :--- |
| **Frontend Core** | React 19, Vite 8, JavaScript (ES6+) | Modern SPA framework and fast dev build toolchain |
| **Styling & Design System** | Tailwind CSS v4, Lucide React, Glassmorphism CSS | Responsive layout, dark mode aesthetic, glass components |
| **Animation & Physics** | Framer Motion, Motion, GSAP | Spring dynamics, UI transitions, complex timelines |
| **3D & Graphics** | Three.js, `@react-three/fiber`, `@react-three/drei`, Custom GLSL Shaders | Volumetric lighting, 3D particle systems, God Rays, FBM nebulae |
| **Audio Synthesizer** | Native Web Audio API (`AudioEngine.js`) | 100% procedural sound synthesis without audio files |
| **State & Smooth Scroll** | React Context API, `@studio-freight/lenis` | Global light/audio state management, inertia smooth scroll |
| **Services & Validation** | Firebase, React Hook Form, Zod, React Hot Toast | User auth/session management, form validation, notifications |

---

## 📂 Project Architecture

```
lumisphere/
├── public/                         # Static web assets & favicons
├── src/
│   ├── assets/                     # SVGs and brand assets
│   ├── components/
│   │   ├── About/
│   │   │   ├── AboutPage.jsx       # Portfolio dashboard, tabs, terminal, 3D visualizer
│   │   │   ├── HolographicSkillsNetwork.jsx # 3D neural network visualizer for skills
│   │   │   └── ResumeRoom.jsx      # Interactive resume viewer and document manager
│   │   ├── Effects/
│   │   │   ├── GodRays.jsx         # Volumetric light ray calculations & shaders
│   │   │   └── SimulationCanvas.jsx # WebGL canvas, particle physics, FBM shaders
│   │   ├── InteractiveDesk/
│   │   │   ├── AchievementsModal.jsx # Gamified achievement & badge unlock system
│   │   │   ├── BookshelfModal.jsx  # Interactive research bookshelf & PDF reader
│   │   │   ├── CoffeeMugSteam.jsx  # Particle steam effect for coffee mug
│   │   │   ├── DeskObject.jsx      # Interactive 3D/2D desk hit-target wrapper
│   │   │   ├── HiddenDevRoomModal.jsx # Secret dev room easter egg & Matrix rain
│   │   │   ├── InteractiveDesk.jsx # Core interactive desk container & state manager
│   │   │   ├── MechKeyboardModal.jsx # Mechanical keyboard simulator & typing benchmark
│   │   │   ├── MonitorDisplayModal.jsx # Telemetry screen, CLI terminal & glitch controls
│   │   │   ├── NotebookModal.jsx   # Flipbook engineering journal & architecture notes
│   │   │   ├── RetroArcadeModal.jsx # Playable retro mini-game arcade cabinet
│   │   │   ├── ScribbleCanvas.jsx  # Interactive freehand drawing canvas & PNG export
│   │   │   ├── StickyNotesApp.jsx  # Draggable task sticky notes app
│   │   │   └── USBProjectsModal.jsx # Cyberpunk USB drive project showcase hub
│   │   ├── Lamp/
│   │   │   ├── BulbGlow.jsx        # SVG & CSS radial halogen glow layers
│   │   │   ├── Lamp.jsx            # Lamp housing, tilt physics, flicker controller
│   │   │   └── PullChain.jsx       # Spring-physics pull chain mechanism
│   │   ├── Login/
│   │   │   ├── Header.jsx          # Top brand header banner
│   │   │   └── LoginCard.jsx       # Interactive authentication / welcome card
│   │   └── UI/
│   │       ├── AudioToggle.jsx     # Ambient audio toggle control button
│   │       ├── Drone.jsx           # Autonomous floating helper drone companion
│   │       ├── DroneHologram.jsx   # Holographic projection canvas for drone
│   │       ├── DroneSparks.jsx     # Dynamic spark particle emitter for drone
│   │       ├── EnvironmentControlPanel.jsx # Real-time visual & audio customizer panel
│   │       ├── FloorReflection.jsx # Lighting reflection on floor surface
│   │       ├── GlassBorder.jsx     # Glassmorphic border container
│   │       ├── GlassTiltCard.jsx   # 3D parallax tilt card container
│   │       ├── InputField.jsx      # Glowing input component
│   │       ├── LampReflection.jsx  # Light reflection effect
│   │       ├── LumiAIModal.jsx     # Conversational AI assistant modal window
│   │       ├── MagneticCustomCursor.jsx # Magnetic glowing mouse cursor
│   │       ├── NoiseLayer.jsx      # SVG film grain/noise overlay
│   │       ├── PremiumButton.jsx   # Dynamic glowing action button
│   │       └── PremiumInput.jsx    # Multi-style glowing input field
│   ├── context/
│   │   ├── LightContext.jsx        # Global light, dimmer, theme, audio & state
│   │   └── SceneContext.jsx        # 3D viewport canvas context
│   ├── hooks/
│   │   ├── UseCamera.js            # 3D camera positioning hook
│   │   ├── useMobile.js            # Responsive mobile viewport detector
│   │   ├── useMousePosition.js     # Global mouse coordinates tracking hook
│   │   └── useSceneStartup.js      # Startup sequence fade-in orchestrator
│   ├── pages/
│   │   └── LoginPage.jsx           # Welcome & authentication page entry
│   ├── utils/
│   │   ├── AudioEngine.js          # Procedural Web Audio API synthesizer engine
│   │   ├── LumiAI.js               # AI knowledge base & query response engine
│   │   └── SecretsManager.js       # Secret code & easter egg unlock engine
│   ├── App.jsx                     # Core application router & main layout
│   ├── global.css                  # Custom CSS styles, keyframes, & Tailwind directives
│   └── main.jsx                    # React DOM root entry point
├── eslint.config.js
├── index.html
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
   Navigate to `http://localhost:5173` in your web browser.

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
* **Experience**: Former Data Analyst Intern at **Larsen & Toubro Construction Analytics** (Pioneered PDF RAG Spec Extractor & SLD Diagram OCR, 91% token cost reduction, 1,200+ pgs daily).
* **Certifications**: 8 Verified Certifications including Stanford Machine Learning (Andrew Ng), Google Prompting Essentials, HackerRank Python & SQL Gold Badges (5★), Cisco Packet Tracer, IBM & Microsoft ML.
* **Target**: 1-Year Placement (May 2028 - May 2029) -> MS in CS/Data Science @ Arizona State University (Fall 2029).

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
