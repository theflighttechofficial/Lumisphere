# 💡 LumiSphere

> **An immersive, interactive WebGL developer experience and portfolio powered by React, Three.js, custom shader physics, procedural Web Audio API synthesis, and glassmorphic UI.**

---

## 🌟 Overview

**LumiSphere** is a high-performance web experience built by **Varun Vaibhav**. Designed as an interactive fusion between art, physics, and software engineering, LumiSphere centers around an overhead retro-futuristic halogen desk lamp with drag-and-pull physics.

Toggling the lamp ignites a dynamic WebGL volumetric lighting engine with atmospheric dust particles, GLSL shaders, procedural audio hums, and unlocks an interactive portfolio dashboard detailing Varun's engineering projects, industry experience, machine learning background, skills matrix, career roadmap, and an embedded terminal system.

---

## ✨ Key Features & Mechanics

### 1. 🪢 Physics-Driven Overhead Halogen Lamp & Pull Chain
* **Spring Physics Pull Chain**: Realistic drag-and-release chain physics built using `framer-motion` springs (`stiffness: 300`, `damping: 18`) with beaded chain links and sound feedback.
* **Realistic Halogen Flicker & Dimming**: Multi-stage electrical sputter animation on ignition with variable brightness control (0% to 100% dimmer).
* **Parallax Lamp Motion**: Smooth tilt response tracking mouse coordinates across the screen.

### 2. 🌌 Volumetric WebGL Shaders & Physics Canvas
* **Volumetric Light Cone (God Rays)**: Custom GLSL Fragment & Vertex Shaders rendering light scatter, density fading, and dynamic volumetric cones.
* **Atmospheric Dust Simulation**: Over 200 light-reactive particles floating with continuous noise vectors and mouse repulsion physics.
* **FBM Background Shader**: Fractional Brownian Motion (FBM) shader rendering slow nebula clouds behind the lamp.
* **Surface Reflections**: Dynamic lighting reflections across floor elements and glassmorphic cards.

### 3. 🔊 Procedural Web Audio Engine (Pure Synthesizer)
* Zero external audio files — 100% synthesized in real time using the **Web Audio API**:
  * **Relay Clicks**: Crisp dual-frequency impulse clicks for lamp toggles.
  * **Bulb Hum**: Low-pass filtered 60Hz AC mains hum with subtle frequency modulation.
  * **Chain Pull Sound**: Metallic multi-bead collision sound sequence on chain pull.
  * **Ambient Drone**: Deep binaural synth drone atmosphere.
  * **Terminal Sounds**: Mechanical key click sound feedback and glitch sound sweeps.
* Mute/Unmute audio control with state persistence in `localStorage`.

### 4. 🔮 Interactive Hologram 3D Particle Visualizer
* **React Three Fiber (R3F) & Three.js**: Real-time 3D particle visualizer in the portfolio view.
* **Dynamic Geometry Morphing**: Morphing particle point cloud that dynamically transitions shapes based on the active tab:
  * **Dashboard**: Double-Helix Reactor Core
  * **Skills**: Neural Constellation Network (Brain Sphere)
  * **Projects**: 6x6x6 Digital Matrix Grid
  * **Roadmap**: Winding Spiral Helix
* **Interactive Orbit Controls & Speed Calibration**: Interactive rotation, zoom, and animation speed adjustments.

### 5. 💻 Built-in Interactive Terminal CLI
* Integrated command-line interface supporting interactive commands:
  * `/help` – View available commands
  * `/dim <0-100>` – Calibrate halogen light intensity directly from the terminal
  * `/glitch` – Trigger video buffer glitch matrix animation
  * `/status` – Display live halogen core telemetry and diagnostic data
  * `/whoami` – Display user session state
  * `/clear` – Clear terminal history log

### 6. 📊 Developer Portfolio & Career Showcase
* **Interactive Navigation Tabs**:
  * **Overview / Diagnostics**: Real-time halogen telemetry logs, live count-up stats (CGPA 7.7/10, 6+ major projects, 2 industry internships).
  * **Experience**: Detailed summaries of internships at **Larsen & Toubro Ltd. (L&T)** and **Neoshaan Technologies**.
  * **Skills Matrix**: Categorized skill tags across AI/ML (YOLOv8, RAG, PyTorch, scikit-learn), Web Development (React, Vite, Tailwind CSS, Node.js), Languages (Python, C/C++, SQL, JS), and Tools/Databases (MongoDB, Git, Linux).
  * **Projects Gallery**: Interactive cards with links to live repositories (Road-AI, HomeFinder, Invisibility Cloak, AgriYield AI, Smart File Organiser).
  * **Career Roadmap**: Interactive multi-stage timeline detailing education, technical certifications (IBM, Microsoft), research presentations, and graduate goals.

---

## 🛠️ Tech Stack & Technologies

| Domain | Technologies Used |
| :--- | :--- |
| **Frontend Core** | React 19, Vite, JavaScript (ES6+) |
| **Styling & UI** | Tailwind CSS v4, Lucide React Icons, Glassmorphism CSS |
| **Animation Engine** | Framer Motion, Motion |
| **3D & WebGL Graphics** | Three.js, `@react-three/fiber`, `@react-three/drei`, GLSL Shaders |
| **Audio Processing** | Web Audio API (Custom `AudioEngine.js`) |
| **State & Smooth Scroll** | React Context API, Lenis Smooth Scroll |
| **Form Validation** | React Hook Form, Zod |

---

## 📂 Project Architecture

```
lumisphere/
├── public/                     # Static assets and icons
├── src/
│   ├── assets/                 # SVGs and static media
│   ├── components/
│   │   ├── About/
│   │   │   └── AboutPage.jsx   # Portfolio dashboard, tabs, terminal, hologram
│   │   ├── Effects/
│   │   │   ├── SimulationCanvas.jsx # WebGL canvas, dust particles, FBM shaders
│   │   │   └── GodRays.jsx     # Volumetric light ray calculations
│   │   ├── Lamp/
│   │   │   ├── Lamp.jsx        # Lamp housing, tilt physics, flicker controller
│   │   │   ├── PullChain.jsx   # Spring-physics pull chain mechanism
│   │   │   └── BulbGlow.jsx    # SVG & CSS radial halogen glow layers
│   │   ├── Login/
│   │   │   ├── LoginCard.jsx   # Interactive authentication / welcome form
│   │   │   └── Header.jsx      # Top brand banner
│   │   └── UI/
│   │       ├── AudioToggle.jsx # Ambient audio toggle control button
│   │       ├── Drone.jsx       # Floating helper drone companion
│   │       ├── FloorReflection.jsx # Lighting reflection on floor surface
│   │       ├── LampReflection.jsx  # Light reflection on glass cards
│   │       ├── InputField.jsx   # Custom glowing input components
│   │       ├── PremiumButton.jsx# Dynamic glowing action button
│   │       └── PremiumInput.jsx # Multi-style input field
│   ├── context/
│   │   ├── LightContext.jsx    # Central global state (Light state, audio, dimmer, auth)
│   │   └── SceneContext.jsx    # 3D canvas viewport & startup state
│   ├── hooks/
│   │   ├── UseCamera.js        # Camera position control
│   │   ├── useMousePosition.js # Screen-wide normalized mouse tracker
│   │   └── useSceneStartup.js  # Startup fade-in orchestrator
│   ├── utils/
│   │   └── AudioEngine.js      # Procedural Web Audio API sound synthesizer
│   ├── App.jsx                 # Application root component
│   ├── global.css              # Custom utility classes & scrollbar styles
│   └── main.jsx                # React DOM entry point
├── package.json
├── vite.config.js
└── README.md
```

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js** (v18.0.0 or higher) and **npm** installed on your machine.

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

3. **Launch the development server**:
   ```bash
   npm run dev
   ```

4. **Open in Browser**:
   Navigate to `http://localhost:5173` to explore LumiSphere!

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
