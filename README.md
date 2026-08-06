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
* **Interactive Navigation Tabs**:
  * **Overview / Diagnostics**: Real-time halogen telemetry logs and live metrics (CGPA 7.7/10, 6+ major projects, 2 industry internships).
  * **Experience**: Detailed summaries of internships at **Larsen & Toubro Ltd. (L&T)** and **Neoshaan Technologies**.
  * **Skills Matrix**: Categorized skill tags across AI/ML (YOLOv8, RAG, PyTorch, scikit-learn), Web Development (React, Vite, Tailwind CSS, Node.js), Languages (Python, C/C++, SQL, JS), and Tools/Databases (MongoDB, Git, Linux).
  * **Projects Gallery**: Interactive cards with links to live repositories (Road-AI, HomeFinder, Invisibility Cloak, AgriYield AI, Smart File Organiser).
  * **Career Roadmap**: Interactive multi-stage timeline detailing education, technical certifications (IBM, Microsoft), research presentations, and graduate goals.

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
│   │   │   └── Header.jsx      # Top brand header banner
│   │   └── UI/
│   │       ├── AudioToggle.jsx # Ambient audio toggle control button
│   │       ├── Drone.jsx       # Floating helper drone companion
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

**Varun Vaibhav**  
*B.Tech in Computer Science Engineering (AI & Data Analytics)*  
*Sri Ramachandra Institute of Higher Education and Research (SRIHER), Chennai*

* **GitHub**: [@theflighttechofficial](https://github.com/theflighttechofficial)
* **Specializations**: Machine Learning, Computer Vision (YOLOv8, OpenCV), RAG & LLM Architectures, WebGL & Interactive Web Engineering.

---

## 📄 License

This project is open-source and available under the [MIT License](LICENSE).
