import { motion, AnimatePresence } from "framer-motion";
import { 
    GitBranch, Briefcase, Mail, FileText, ArrowLeft, ExternalLink, 
    Cpu, Layout, Sparkles, ListTodo, LineChart, BookOpen, 
    Monitor, Compass, Terminal, CheckCircle2, ChevronRight, Zap, 
    Activity, Shield, RefreshCw
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useLight } from "../../context/LightContext";
import { AudioEngine } from "../../utils/AudioEngine";
import NoiseLayer from "../UI/NoiseLayer";

// --- Tab-specific color palette for Hologram and visualizer themes ---
const tabColors = {
    dashboard: { points: "#ffffff", lines: "#fff2cc", core: "#fbbf24" },
    experience: { points: "#60a5fa", lines: "#3b82f6", core: "#2563eb" },
    skills: { points: "#34d399", lines: "#22d3ee", core: "#10b981" },
    projects: { points: "#a78bfa", lines: "#ec4899", core: "#8b5cf6" },
    roadmap: { points: "#fbbf24", lines: "#fbbf24", core: "#d97706" }
};

// --- Count-up numeric animation component for CGPA statistics ---
function CountUp({ to, duration = 1.2, decimals = 1 }) {
    const [count, setCount] = useState(0);

    useEffect(() => {
        let startTime = null;
        const startValue = 0;

        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            const currentValue = progress * (to - startValue) + startValue;
            setCount(currentValue);

            if (progress < 1) {
                requestAnimationFrame(animate);
            }
        };

        requestAnimationFrame(animate);
    }, [to, duration]);

    return <span>{count.toFixed(decimals)}</span>;
}

// --- Live diagnostics logs typist reader ---
function LiveSystemDiagnosticLog({ intensity }) {
    const [logs, setLogs] = useState([]);
    
    useEffect(() => {
        const rawLogs = [
            "SYS_STAT: HALOGEN CORE STABLE",
            `POWER DRAW: ${(intensity * 0.5).toFixed(1)}W AT 12.0V`,
            "THERMAL SHELL TEMP: NOMINAL",
            "VOLUMETRIC RAYTRACER: ONLINE",
            "SHOCKWAVE WAVEFRONT: ARMED",
            "PARTICLE BUFFER: 2200 FLOATS",
            "REFLECTOR FACTOR: 98.4% REFL",
            "COOLING JOINT: PASSIVE VENT"
        ];
        
        setLogs([]);
        let logIdx = 0;
        const interval = setInterval(() => {
            if (logIdx < rawLogs.length) {
                const nextLog = rawLogs[logIdx];
                setLogs(prev => [...prev, nextLog]);
                logIdx++;
            } else {
                clearInterval(interval);
            }
        }, 160);
        return () => clearInterval(interval);
    }, [intensity]);

    return (
        <div className="font-mono text-[8px] text-zinc-500 tracking-[0.18em] uppercase space-y-1">
            {logs.map((log, idx) => (
                <div key={idx} className={log && (log.includes("ONLINE") || log.includes("STABLE")) ? "text-emerald-400/80" : "text-zinc-400/70"}>
                    &gt; {log}
                </div>
            ))}
        </div>
    );
}

// --- Hologram 3D Visualizer Scene ---
function HologramScene({ activeTab, speed }) {
    const pointsRef = useRef();
    const lineRef = useRef();
    const coreRef = useRef();
    const count = 216;
    
    // Precompute target shape coordinates
    const shapes = useMemo(() => {
        const reactor = new Float32Array(count * 3);
        const brain = new Float32Array(count * 3);
        const matrix = new Float32Array(count * 3);
        const helix = new Float32Array(count * 3);
        
        const phi = Math.PI * (3 - Math.sqrt(5)); // Golden ratio
        
        for (let i = 0; i < count; i++) {
            // 1. Reactor Core (Double Helix)
            const isStrandB = i % 2 === 0;
            const angle = (i / count) * Math.PI * 12 + (isStrandB ? Math.PI : 0);
            const radius = 1.0;
            const h = (i / count) * 3.0 - 1.5;
            reactor[i * 3] = Math.sin(angle) * radius;
            reactor[i * 3 + 1] = h;
            reactor[i * 3 + 2] = Math.cos(angle) * radius;
            
            // 2. Neural Constellation (Brain Network)
            const y = 1 - (i / (count - 1)) * 2;
            const rad = Math.sqrt(1 - y * y) * 1.5;
            const theta = i * phi;
            brain[i * 3] = Math.cos(theta) * rad;
            brain[i * 3 + 1] = y * 1.5;
            brain[i * 3 + 2] = Math.sin(theta) * rad;
            
            // 3. Digital Grid Matrix (6x6x6 Cube Grid)
            const ix = i % 6;
            const iy = Math.floor((i % 36) / 6);
            const iz = Math.floor(i / 36);
            matrix[i * 3] = (ix - 2.5) * 0.52;
            matrix[i * 3 + 1] = (iy - 2.5) * 0.52;
            matrix[i * 3 + 2] = (iz - 2.5) * 0.52;
            
            // 4. Roadmap Ring Winding Helix
            const helixAngle = (i / count) * Math.PI * 10;
            const helixRadius = 1.2 - 0.5 * (i / count);
            const helixH = (i / count) * 3.2 - 1.6;
            helix[i * 3] = Math.sin(helixAngle) * helixRadius;
            helix[i * 3 + 1] = helixH;
            helix[i * 3 + 2] = Math.cos(helixAngle) * helixRadius;
        }
        
        return { dashboard: reactor, skills: brain, projects: matrix, roadmap: helix, experience: reactor };
    }, []);

    const currentPositions = useMemo(() => new Float32Array(count * 3), []);
    
    useEffect(() => {
        const source = shapes[activeTab] || shapes.dashboard;
        for (let i = 0; i < count * 3; i++) {
            currentPositions[i] = source[i];
        }
    }, []);

    useFrame((state, delta) => {
        const elapsed = state.clock.elapsedTime;
        const target = shapes[activeTab] || shapes.dashboard;
        
        // Morph shapes
        const positionAttr = pointsRef.current.geometry.attributes.position;
        const positions = positionAttr.array;
        
        for (let i = 0; i < count * 3; i++) {
            positions[i] = THREE.MathUtils.lerp(positions[i], target[i], 0.08);
        }
        positionAttr.needsUpdate = true;
        
        // Dynamic rotation using speed factor
        pointsRef.current.rotation.y += delta * speed;
        pointsRef.current.rotation.x = Math.sin(elapsed * 0.1) * 0.06;
        
        // Connect wire lines
        if (lineRef.current) {
            lineRef.current.rotation.copy(pointsRef.current.rotation);
            const linePositionAttr = lineRef.current.geometry.attributes.position;
            const linePositions = linePositionAttr.array;
            let lineIdx = 0;
            
            const maxConnections = 120;
            let connectionCount = 0;
            
            for (let i = 0; i < linePositions.length; i++) {
                linePositions[i] = 0;
            }
            
            for (let i = 0; i < count; i++) {
                if (connectionCount >= maxConnections) break;
                
                const px = positions[i * 3];
                const py = positions[i * 3 + 1];
                const pz = positions[i * 3 + 2];
                
                for (let j = i + 1; j < count; j++) {
                    const qx = positions[j * 3];
                    const qy = positions[j * 3 + 1];
                    const qz = positions[j * 3 + 2];
                    
                    const distSq = (px-qx)*(px-qx) + (py-qy)*(py-qy) + (pz-qz)*(pz-qz);
                    const maxDist = activeTab === "projects" ? 0.35 : 0.65;
                    
                    if (distSq < maxDist * maxDist) {
                        linePositions[lineIdx++] = px;
                        linePositions[lineIdx++] = py;
                        linePositions[lineIdx++] = pz;
                        linePositions[lineIdx++] = qx;
                        linePositions[lineIdx++] = qy;
                        linePositions[lineIdx++] = qz;
                        
                        connectionCount++;
                        if (connectionCount >= maxConnections) break;
                    }
                }
            }
            linePositionAttr.needsUpdate = true;
        }

        // Color & Pulse morphing
        const colors = tabColors[activeTab] || tabColors.dashboard;
        const targetPointsCol = new THREE.Color(colors.points);
        const targetLinesCol = new THREE.Color(colors.lines);
        const targetCoreCol = new THREE.Color(colors.core);
        
        pointsRef.current.material.color.lerp(targetPointsCol, 0.08);
        if (lineRef.current) {
            lineRef.current.material.color.lerp(targetLinesCol, 0.08);
        }
        if (coreRef.current) {
            coreRef.current.material.color.lerp(targetCoreCol, 0.08);
            coreRef.current.material.opacity = 0.35 + 0.15 * Math.sin(elapsed * 4.5);
            coreRef.current.scale.setScalar(1.0 + 0.08 * Math.sin(elapsed * 4.5));
        }
    });

    return (
        <group>
            {/* Holographic Nodes */}
            <points ref={pointsRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[currentPositions, 3]}
                    />
                </bufferGeometry>
                <pointsMaterial
                    color="#ffffff"
                    size={0.06}
                    transparent={true}
                    opacity={0.8}
                    depthWrite={false}
                />
            </points>

            {/* Connecting grid lines */}
            <lineSegments ref={lineRef}>
                <bufferGeometry>
                    <bufferAttribute
                        attach="attributes-position"
                        args={[new Float32Array(150 * 2 * 3), 3]}
                    />
                </bufferGeometry>
                <lineBasicMaterial
                    color="#fff2cc"
                    transparent={true}
                    opacity={0.25}
                    depthWrite={false}
                />
            </lineSegments>

            {/* Center Pulsing Power Core */}
            <mesh ref={coreRef}>
                <sphereGeometry args={[0.24, 16, 16]} />
                <meshBasicMaterial
                    color="#fbbf24"
                    transparent={true}
                    opacity={0.35}
                />
            </mesh>
            <mesh>
                <sphereGeometry args={[0.06, 16, 16]} />
                <meshBasicMaterial
                    color="#ffffff"
                    transparent={true}
                    opacity={0.8}
                />
            </mesh>
        </group>
    );
}

function HologramCanvas({ activeTab, speed }) {
    return (
        <div className="w-full h-[220px] select-none pointer-events-auto cursor-grab active:cursor-grabbing relative overflow-hidden border border-white/5 bg-zinc-950/40 rounded-2xl shadow-inner my-3">
            {/* Sci-fi scanner overlay lines */}
            <div className="absolute inset-0 pointer-events-none border border-yellow-500/5 rounded-2xl z-10" />
            <div className="absolute inset-x-0 top-0 h-[1.5px] bg-yellow-400/25 animate-[bounce_4s_infinite_ease-in-out] z-10" />
            <div className="absolute bottom-2.5 left-3.5 font-mono text-[7px] tracking-widest text-yellow-400/70 uppercase z-10 flex items-center gap-1.5">
                <span className="w-1 h-1 rounded-full bg-yellow-400 animate-ping" />
                HOLOGRAPHIC EMITTER // SHAPE: {activeTab}
            </div>

            <Canvas
                gl={{ antialias: true, alpha: true }}
                camera={{ position: [0, 0, 4.0], fov: 45 }}
                style={{ width: "100%", height: "100%" }}
            >
                <ambientLight intensity={0.5} />
                <HologramScene activeTab={activeTab} speed={speed} />
                <OrbitControls 
                    enableZoom={false} 
                    enablePan={false} 
                    enableDamping={true}
                    dampingFactor={0.06}
                />
            </Canvas>
        </div>
    );
}

export default function AboutPage() {
    const { isLightOn, setIsLightOn, setIsLoggedIn, lampIntensity, setLampIntensity, viewerName, college } = useLight();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [skillsFilter, setSkillsFilter] = useState("all");
    const [isGlitching, setIsGlitching] = useState(false);
    const [hologramSpeed, setHologramSpeed] = useState(0.25);
    
    // CLI Interactive Console States
    const [cmdInput, setCmdInput] = useState("");
    const [history, setHistory] = useState([
        { text: "LUMISPHERE OS v4.1 (BOOT_SEQUENCE_STABLE)", type: "system" },
        { text: `Welcome, ${viewerName || "GuestViewer"} from ${college || "Unknown College"}!`, type: "system" },
        { text: "Device identified: Quartz Halogen spotlight rig [50W].", type: "output" },
        { text: "Type '/help' to display list of interactive command guidelines.", type: "output" }
    ]);

    const terminalEndRef = useRef(null);

    useEffect(() => {
        // Reset scroll position of parent container on mount to fix layout misalignment caused by focusing input fields during login
        const parentContainer = document.querySelector(".w-screen.h-screen.overflow-hidden");
        if (parentContainer) {
            parentContainer.scrollTop = 0;
        }
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (terminalEndRef.current) {
            const container = terminalEndRef.current.parentNode;
            if (container) {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: "smooth"
                });
            }
        }
    }, [history]);

    const [checklist, setChecklist] = useState([
        { id: 1, text: "Build impressive L&T PDF extractor RAG pipelines", completed: true },
        { id: 2, text: "Complete Google Data Analytics Professional Certificate", completed: false },
        { id: 3, text: "Strengthen GitHub profile README & clean commits", completed: true },
        { id: 4, text: "Practice Python and SQL algorithms on HackerRank", completed: false },
        { id: 5, text: "Improve B.E. CGPA from 7.7 towards 8.5 target", completed: false },
        { id: 6, text: "Prepare for placement mock interviews and DSA", completed: false }
    ]);

    const [expandedStage, setExpandedStage] = useState(0);

    const completedTasks = checklist.filter(t => t.completed).length;
    const totalTasks = checklist.length;
    const taskPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

    // SVG Circular Ring Math
    const radius = 24;
    const circumference = 2 * Math.PI * radius;
    const strokeDashoffset = circumference - (taskPercent / 100) * circumference;

    const handleSignOut = () => {
        setIsGlitching(true);
        AudioEngine.playChainRelease();
        setTimeout(() => {
            setIsLoggedIn(false);
            setIsLightOn(false);
            setIsGlitching(false);
        }, 1100);
    };

    const handleTabChange = (tabId) => {
        AudioEngine.playUIHover();
        setActiveTab(tabId);
    };

    const toggleChecklist = (id) => {
        AudioEngine.playUISelect();
        setChecklist(prev => prev.map(item => 
            item.id === id ? { ...item, completed: !item.completed } : item
        ));
    };

    // Command parser for CLI terminal
    const handleCommandSubmit = (e) => {
        e.preventDefault();
        const raw = cmdInput.trim();
        if (!raw) return;

        const newHistory = [...history, { text: `> ${raw}`, type: "input" }];
        const parts = raw.split(" ");
        const cmd = parts[0].toLowerCase();
        const arg = parts[1];

        let output = "";
        let isErr = false;

        AudioEngine.playUISelect();

        switch (cmd) {
            case "/help":
            case "help":
                output = "System Console Commands:\n  /experience Switch workspace to Experience Tab\n  /skills     Switch workspace to Skills Tab\n  /projects   Switch workspace to Projects Tab\n  /roadmap    Switch workspace to Roadmap Tab\n  /dashboard  Switch workspace to Dashboard Tab\n  /dim <val>  Scale Halogen Dimmer output (0 - 100)\n  /glitch     Trigger visual terminal glitch diagnostic\n  /clear      Clear CLI terminal console buffer";
                break;
            case "/experience":
            case "experience":
                setActiveTab("experience");
                output = "SYSTEM COMMAND: Navigation to WORK_EXPERIENCE successful.";
                break;
            case "/skills":
            case "skills":
                setActiveTab("skills");
                output = "SYSTEM COMMAND: Navigation to TECH_MATRIX successful.";
                break;
            case "/projects":
            case "projects":
                setActiveTab("projects");
                output = "SYSTEM COMMAND: Navigation to MISSION_LOGS successful.";
                break;
            case "/roadmap":
            case "roadmap":
                setActiveTab("roadmap");
                output = "SYSTEM COMMAND: Navigation to MILESTONE_PIPELINE successful.";
                break;
            case "/dashboard":
            case "dashboard":
                setActiveTab("dashboard");
                output = "SYSTEM COMMAND: Navigation to SYSTEM_METRICS successful.";
                break;
            case "/dim":
            case "dim":
                const val = parseInt(arg, 10);
                if (!isNaN(val) && val >= 0 && val <= 100) {
                    setLampIntensity(val);
                    output = `CALIBRATION SUCCESS: Halogen intensity set to ${val}% output.`;
                } else {
                    output = "Error: Invalid parameter. Intensity must be a number from 0 to 100. Example: /dim 60";
                    isErr = true;
                }
                break;
            case "/glitch":
            case "glitch":
                setIsGlitching(true);
                setTimeout(() => setIsGlitching(false), 750);
                output = "CORRUPTING DISPLAY SHADERS... RETURNING STABLE STATE.";
                break;
            case "/clear":
            case "clear":
                setHistory([]);
                setCmdInput("");
                return;
            default:
                output = `Command not recognized: '${cmd}'. Type '/help' for command directory.`;
                isErr = true;
        }

        setHistory([...newHistory, { text: output, type: isErr ? "error" : "output" }]);
        setCmdInput("");
    };

    const skills = [
        // Languages
        { name: "Python", category: "languages", level: "Expert" },
        { name: "SQL", category: "languages", level: "Expert" },
        { name: "JavaScript", category: "languages", level: "Advanced" },
        { name: "C / C++", category: "languages", level: "Advanced" },
        { name: "Java", category: "languages", level: "Intermediate" },
        
        // AI / ML & Data
        { name: "Machine Learning / scikit-learn", category: "aiml", level: "Specialist" },
        { name: "YOLOv8 & Computer Vision", category: "aiml", level: "Specialist" },
        { name: "RAG & LLM (GPT-4o)", category: "aiml", level: "Expert" },
        { name: "SentenceTransformers & FAISS", category: "aiml", level: "Advanced" },
        { name: "Tesseract OCR & OpenCV", category: "aiml", level: "Advanced" },
        { name: "pandas & NumPy", category: "aiml", level: "Expert" },
        
        // Web & Backend
        { name: "React.js / Vite", category: "webdev", level: "Advanced" },
        { name: "Tailwind CSS", category: "webdev", level: "Expert" },
        { name: "Node.js / Express", category: "webdev", level: "Advanced" },
        { name: "HTML / CSS", category: "webdev", level: "Expert" },
        { name: "Nodemailer & REST APIs", category: "webdev", level: "Advanced" },
        
        // Databases & Tools
        { name: "MongoDB & MySQL", category: "tools", level: "Advanced" },
        { name: "Git & GitHub", category: "tools", level: "Advanced" },
        { name: "PyMuPDF & openpyxl", category: "tools", level: "Advanced" },
        { name: "Linux & VS Code", category: "tools", level: "Expert" },
        { name: "Data Analytics", category: "tools", level: "Expert" }
    ];

    const projects = [
        {
            title: "LumiSphere",
            category: "webdev",
            desc: "Highly interactive web experience featuring cinematic particle simulations, glassmorphism design, WebGL-inspired visuals, and fluid animation systems with sub-second load times.",
            tags: ["React", "Vite", "Three.js", "WebGL", "Framer Motion"],
            link: "https://github.com/theflighttechofficial/lumisphere"
        },
        {
            title: "Road-AI",
            category: "aiml",
            desc: "Ensemble YOLOv8 detection system with temporal fusion and Monte Carlo Dropout uncertainty quantification. Achieved mAP50 of 0.648 on RDD2022. Integrated depth estimation, NHAI cost estimation, multilingual TTS, and blockchain tracking.",
            tags: ["YOLOv8", "Computer Vision", "Depth Estimation", "Blockchain"],
            link: "https://github.com/theflighttechofficial"
        },
        {
            title: "HomeFinder",
            category: "webdev",
            desc: "Full-stack rental listing discovery platform supporting multi-attribute filtering (city, price, amenities) enabling city-level filtered search across India. Sub-100 ms query latency.",
            tags: ["JavaScript", "HTML/CSS", "Tailwind CSS", "MongoDB"],
            link: "https://github.com/theflighttechofficial"
        },
        {
            title: "Invisibility Cloak",
            category: "aiml",
            desc: "Live video processing pipeline performing real-time colour-segmentation and background compositing on a 30 fps camera feed using OpenCV HSV masking logic.",
            tags: ["Python", "OpenCV", "Numpy"],
            link: "https://github.com/theflighttechofficial"
        },
        {
            title: "AgriYield AI",
            category: "aiml",
            desc: "Crop yield prediction platform using ensemble regression models trained on weather, soil, and historical harvest data with a prediction dashboard built with pandas/scikit-learn.",
            tags: ["Machine Learning", "Pandas", "Scikit-Learn", "Python"],
            link: "https://github.com/theflighttechofficial"
        },
        {
            title: "Smart File Organiser",
            category: "tools",
            desc: "Desktop C++ application built with Qt Creator GUI that automates file classification and relocation to category folders, reducing manual management time to near-zero.",
            tags: ["C++", "Qt Creator", "GUI", "Desktop"],
            link: "https://github.com/theflighttechofficial"
        }
    ];

    const roadmapSteps = [
        { 
            title: "Stage 1: B.Tech CSE (AI & Data Analytics) · SRIHER (Current)", 
            desc: "Currently pursuing B.Tech in Computer Science at SRIHER, Chennai (Expected 2028). Strong focus on Data Analytics and AI models.", 
            active: true,
            checkpoints: [
                "Maintain GPA (currently 7.7/10) and aim for graduation targets",
                "Continue building ML and CV projects like Road-AI and Invisibility Cloak",
                "Expand skills in RAG pipelines, NLP, and deep learning models"
            ]
        },
        { 
            title: "Stage 2: Technical Certifications & IBM Z Skills", 
            desc: "Complete specialized courses and earn certifications from leading tech giants.", 
            active: false,
            checkpoints: [
                "IBM / Cognitive Class: Python 101 for Data Science",
                "Microsoft Learn: Creation of ML Models (Build 2026)",
                "IBM Z Day 2025: AI & Data, IBM Z Skills, Modernization, Security"
            ]
        },
        { 
            title: "Stage 3: Hackathons & Presentations", 
            desc: "Present research projects and compete in top hackathons.", 
            active: false,
            checkpoints: [
                "Showcase Road-AI (Intelligent Road Damage Analyser) at SRIHER Research Day 2026 and IIT Madras Hackathon",
                "Showcase real-time cybercrime prevention & active monitoring software at Innovation Day"
            ]
        },
        { 
            title: "Stage 4: Professional Career & Post-grad Goals", 
            desc: "Leverage internship experiences at L&T and Neoshaan Technologies to transition into enterprise AI / Full-stack roles, or pursue MS abroad.", 
            active: false,
            checkpoints: [
                "Scale L&T's PDF-to-Excel Spec Extractor using hybrid RAG pipelines",
                "Maintain and deploy high-performance web systems utilizing React and Node.js",
                "Target graduate studies in advanced CV and NLP"
            ]
        }
    ];

    const filteredSkills = skillsFilter === "all" 
        ? skills 
        : skills.filter(s => s.category === skillsFilter);

    // Dynamic bulb diagnostic string helper
    const getBulbStatusText = () => {
        if (lampIntensity === 0) return "OFF / DISCHARGED";
        if (lampIntensity <= 20) return "WARN / UNDERVOLT";
        return "STABLE / NOMINAL";
    };

    return (
        <div className="absolute inset-0 z-50 flex flex-row overflow-hidden pointer-events-none p-6 bg-black/45 backdrop-blur-[6px]">
            
            {/* Ambient visual overlays */}
            <AnimatePresence>
                {isGlitching && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ 
                            opacity: [0, 0.9, 0.4, 0.95, 0],
                            clipPath: [
                                "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                                "polygon(0 14%, 100% 4%, 100% 92%, 0 78%)",
                                "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                                "polygon(0 42%, 100% 32%, 100% 64%, 0 68%)",
                                "polygon(0 0, 100% 0, 100% 100%, 0 100%)"
                            ]
                        }}
                        exit={{ opacity: 0 }}
                        transition={{ duration: 0.75, ease: "easeInOut" }}
                        className="absolute inset-0 bg-zinc-950 z-[100] flex flex-col items-center justify-center font-mono text-[13px] text-red-500 uppercase tracking-widest pointer-events-auto"
                    >
                        <div className="text-center space-y-2.5">
                            <div className="font-bold animate-pulse text-[16px]">DISCONNECTING GATEWAY...</div>
                            <div className="text-[10px] text-zinc-500">CORRUPTING BUFFER DATA / DISCHARGING CIRCUIT SYSTEM</div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Left Column (Stats & Visual Display - Floating Glass Card) */}
            <motion.div
                initial={{ opacity: 0, x: -50 }}
                animate={{
                    opacity: isLightOn ? 1 : 0.05,
                    x: 0,
                }}
                exit={{ opacity: 0, x: -50 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="
                    w-[38%]
                    h-full
                    mr-3
                    rounded-[30px]
                    border
                    border-white/10
                    bg-zinc-950/45
                    backdrop-blur-2xl
                    p-8
                    pb-10
                    flex
                    flex-col
                    justify-between
                    pointer-events-auto
                    select-none
                    relative
                    shadow-[0_20px_50px_rgba(0,0,0,0.6)]
                "
            >
                <NoiseLayer />

                {/* Brand Logo Header */}
                <div className="flex items-center justify-between relative z-10 mb-2">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black tracking-[0.4em] text-zinc-500 uppercase">LUMISPHERE OS</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse" />
                    </div>
                    <div className="flex items-center gap-1 bg-white/5 border border-white/5 rounded-md px-2 py-0.5 font-mono text-[7px] text-zinc-400">
                        <Activity size={9} className="text-yellow-400 animate-pulse" />
                        <span>HALOGEN RIG</span>
                    </div>
                </div>

                {/* 3D Hologram Visualizer Display */}
                <div className="relative z-10">
                    <HologramCanvas activeTab={activeTab} speed={hologramSpeed} />
                </div>

                {/* Emitter Settings Panel */}
                <div className="space-y-4 relative z-10 border border-white/5 bg-black/20 p-4 rounded-2xl">
                    
                    {/* Dimmer Slider */}
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-widest flex items-center gap-1.5">
                                <Zap size={11} className="text-yellow-400" />
                                HALOGEN CALIBRATION
                            </span>
                            <span className="font-mono text-xs font-black text-yellow-300">{lampIntensity}%</span>
                        </div>
                        <input 
                            type="range"
                            min="0"
                            max="100"
                            value={lampIntensity}
                            onChange={(e) => {
                                setLampIntensity(Number(e.target.value));
                                if (Number(e.target.value) % 5 === 0) {
                                    AudioEngine.playUIHover();
                                }
                            }}
                            className="w-full h-1 bg-zinc-800 rounded-lg appearance-none cursor-pointer accent-yellow-400"
                        />
                        <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 pt-1.5 border-t border-white/5 font-mono text-[8px] text-zinc-500 uppercase">
                            <div>POWER: <span className="text-zinc-300 font-bold">{(lampIntensity * 0.5).toFixed(1)} W</span></div>
                            <div>VOLTAGE: <span className="text-zinc-300 font-bold">{(isLightOn && lampIntensity > 0) ? "12.0 V" : "0.0 V"}</span></div>
                            <div>CCT TEMP: <span className="text-zinc-300 font-bold">{(isLightOn && lampIntensity > 0) ? (2200 + lampIntensity * 10) + " K" : "0 K"}</span></div>
                            <div>FLUX: <span className="text-zinc-300 font-bold">{(lampIntensity * 12).toFixed(0)} LM</span></div>
                        </div>
                    </div>

                    {/* Hologram Speed Controls */}
                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-[9px] font-bold text-zinc-500 uppercase tracking-wider flex items-center gap-1">
                            <RefreshCw size={10} className="animate-[spin_8s_linear_infinite]" />
                            ROTOR FREQ:
                        </span>
                        <div className="flex gap-1.5">
                            {[
                                { label: "SLOW", val: 0.05 },
                                { label: "NORM", val: 0.25 },
                                { label: "HYPER", val: 0.75 }
                            ].map(opt => (
                                <button
                                    key={opt.label}
                                    onClick={() => {
                                        AudioEngine.playUISelect();
                                        setHologramSpeed(opt.val);
                                    }}
                                    className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold cursor-pointer transition-colors ${hologramSpeed === opt.val ? 'bg-yellow-400 text-zinc-950 shadow-md shadow-yellow-400/20' : 'bg-white/5 hover:bg-white/10 text-zinc-400'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* System Diagnostics Terminal Readout */}
                <div className="relative z-10 border border-white/5 bg-zinc-950/40 rounded-2xl p-4 backdrop-blur-md mt-3">
                    <div className="text-zinc-400 font-bold font-mono text-[9px] tracking-widest flex items-center justify-between mb-2">
                        <span className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${lampIntensity > 0 ? "bg-emerald-400 animate-ping" : "bg-red-400 animate-pulse"}`} />
                            RIG DIAGNOSTICS:
                        </span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded border border-white/5 bg-white/5 ${lampIntensity === 0 ? "text-red-400" : lampIntensity <= 20 ? "text-yellow-400 animate-pulse" : "text-emerald-400"}`}>
                            {getBulbStatusText()}
                        </span>
                    </div>
                    <LiveSystemDiagnosticLog intensity={lampIntensity} />
                </div>
            </motion.div>
 
            {/* Right Command Center Panel - Floating Glass Card */}
            <motion.div
                initial={{ x: "100%", opacity: 0.95 }}
                animate={{
                    x: 0,
                    opacity: isLightOn ? 1 : 0.08,
                    pointerEvents: isLightOn ? "auto" : "none",
                }}
                exit={{ x: "100%", opacity: 0.95 }}
                transition={{ type: "spring", stiffness: 85, damping: 17 }}
                className="
                    w-[62%]
                    h-full
                    ml-3
                    rounded-[30px]
                    border
                    border-white/10
                    bg-zinc-950/45
                    backdrop-blur-3xl
                    p-8
                    pb-9
                    flex
                    flex-col
                    justify-between
                    overflow-hidden
                    pointer-events-auto
                    shadow-[-30px_0_80px_rgba(0,0,0,0.8)]
                    relative
                "
            >
                <NoiseLayer />
                <div className="absolute top-0 right-0 w-96 h-96 bg-yellow-500/5 blur-[130px] pointer-events-none" />
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-amber-500/5 blur-[130px] pointer-events-none" />

                {/* Navigation Header */}
                <div className="relative z-10 flex items-center justify-between mb-5">
                    <button
                        onClick={handleSignOut}
                        onMouseEnter={() => AudioEngine.playUIHover()}
                        className="flex items-center gap-2 text-xs font-bold tracking-[0.2em] text-zinc-400 hover:text-white uppercase transition-colors"
                    >
                        <ArrowLeft size={14} className="text-yellow-400" />
                        Disconnect RIG
                    </button>
                    
                    {/* Glowing Tab Bar */}
                    <div className="relative flex gap-1 bg-white/[0.02] border border-white/5 rounded-xl p-1 backdrop-blur-md">
                        {[
                            { id: "dashboard", label: "Console", icon: Terminal },
                            { id: "experience", label: "Experience", icon: Briefcase },
                            { id: "skills", label: "Skills Matrix", icon: Cpu },
                            { id: "projects", label: "Mission Logs", icon: Layout },
                            { id: "roadmap", label: "Milestones", icon: Compass }
                        ].map(tab => (
                            <button
                                key={tab.id}
                                onClick={() => handleTabChange(tab.id)}
                                className={`
                                    relative flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[9px] font-bold uppercase tracking-wider transition-colors duration-300 relative z-10
                                    ${activeTab === tab.id ? "text-zinc-950" : "text-zinc-400 hover:text-white"}
                                `}
                            >
                                <tab.icon size={11} />
                                <span>{tab.label}</span>
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTabPill"
                                        className="absolute inset-0 bg-yellow-400 rounded-lg -z-10 shadow-lg shadow-yellow-400/25"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Profile Info Section */}
                <div className="relative z-10 flex-1 flex flex-col justify-start">
                    
                    {/* Header Banner */}
                    <div className="flex items-center gap-5 mb-5 border-b border-white/5 pb-4">
                        {/* Interactive Tech Avatar */}
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 3 }}
                            className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-zinc-800 to-zinc-950 flex items-center justify-center border border-yellow-500/20 shadow-[0_0_20px_rgba(251,191,36,0.12)] flex-shrink-0 cursor-pointer"
                        >
                            <svg width="34" height="34" viewBox="0 0 40 40" fill="none" className="text-yellow-400 drop-shadow-[0_0_6px_rgba(251,191,36,0.6)]">
                                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="animate-[spin_40s_linear_infinite]" />
                                <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1" />
                                <path d="M20 4V36M4 20H36" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                                <circle cx="20" cy="10" r="2.5" fill="#ffffff" />
                                <circle cx="20" cy="30" r="2.5" fill="#fef08a" />
                                <circle cx="10" cy="20" r="2.5" fill="#a1a1aa" />
                                <circle cx="30" cy="20" r="2.5" fill="#fbbf24" />
                            </svg>
                            <span className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-emerald-500 border-4 border-zinc-950 flex items-center justify-center shadow-lg animate-pulse" />
                        </motion.div>

                        <div>
                            <div className="flex items-center gap-2">
                                <h2 className="text-xl font-black tracking-tight text-white">
                                    S. Varun Vaibhav
                                </h2>
                                <span className="px-2 py-0.5 border border-yellow-500/20 bg-yellow-500/5 text-[7px] font-bold text-yellow-300 rounded-full font-mono uppercase tracking-widest flex items-center gap-1">
                                    <Shield size={8} />
                                    ROOT_DEV
                                </span>
                                {viewerName && (
                                    <span className="px-2 py-0.5 border border-zinc-700 bg-zinc-800/40 text-[7px] font-bold text-zinc-300 rounded-full font-mono uppercase tracking-widest">
                                        Viewer: {viewerName} ({college})
                                    </span>
                                )}
                            </div>
                            <p className="text-[9px] text-yellow-300 font-bold uppercase tracking-[0.25em] mt-0.5">
                                AI & Data Analytics Engineer
                            </p>
                            <p className="text-[11px] text-zinc-400 font-medium mt-1 leading-relaxed max-w-xl">
                                AI & Data Analytics engineer who builds things that work — from hybrid RAG pipelines at L&T to computer vision systems and interactive web UIs. Fluent across the full stack: Python, ML, React, and SQL. Driven by turning complex, messy problems into clean, scalable solutions.
                            </p>
                        </div>
                    </div>

                    {/* Tab Panels with AnimatePresence */}
                    <div className="flex-1 min-h-[460px]">
                        <AnimatePresence mode="wait">
                            
                            {/* Panel 1: Dashboard (CLI Terminal & Gauge Controls) */}
                            {activeTab === "dashboard" && (
                                <motion.div
                                    key="dashboard-tab"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.22 }}
                                    className="grid grid-cols-12 gap-4 h-full"
                                >
                                    {/* Left: CLI Interactive Console */}
                                    <div className="col-span-7 flex flex-col h-[450px] border border-white/5 bg-zinc-950/60 rounded-2xl overflow-hidden backdrop-blur-md shadow-inner">
                                        {/* Terminal Header Bar */}
                                        <div className="flex items-center justify-between px-4 py-2 bg-white/[0.02] border-b border-white/5 font-mono text-[8px] text-zinc-500 uppercase tracking-widest">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
                                                <span className="ml-1 text-zinc-400 font-bold">Interactive CLI Shell</span>
                                            </div>
                                            <span>SH-4.1</span>
                                        </div>
                                        {/* History Display */}
                                        <div className="flex-1 p-3.5 overflow-y-auto font-mono text-[9.5px] space-y-1.5 scrollbar-thin select-text">
                                            {history.map((line, idx) => (
                                                <div key={idx} className={
                                                    line.type === "system" ? "text-yellow-400 font-bold" :
                                                    line.type === "input" ? "text-white" :
                                                    line.type === "error" ? "text-red-400" : "text-zinc-400"
                                                } style={{ whiteSpace: "pre-wrap" }}>
                                                    {line.text}
                                                </div>
                                            ))}
                                            <div ref={terminalEndRef} />
                                        </div>
                                        {/* Form Input */}
                                        <form onSubmit={handleCommandSubmit} className="flex border-t border-white/5 bg-black/40">
                                            <span className="pl-3.5 py-2 font-mono text-[10px] text-zinc-400 flex items-center">&gt;</span>
                                            <input 
                                                type="text"
                                                value={cmdInput}
                                                onChange={(e) => setCmdInput(e.target.value)}
                                                placeholder="Type command (e.g. /help, /skills)..."
                                                className="flex-1 bg-transparent border-none outline-none font-mono text-[9.5px] text-white px-2 py-2 placeholder-zinc-700 caret-yellow-400"
                                            />
                                        </form>
                                    </div>

                                    {/* Right: CGPA and Task Summaries */}
                                    <div className="col-span-5 flex flex-col justify-between h-[450px] space-y-3">
                                        
                                        {/* Academics CGPA Progress Widget */}
                                        <div className="border border-white/5 bg-white/[0.01] rounded-2xl p-4 flex flex-col justify-between flex-1">
                                            <h3 className="text-[8.5px] font-black tracking-[0.2em] text-zinc-400 uppercase flex items-center gap-1.5">
                                                <LineChart size={11} className="text-yellow-400" />
                                                CGPA PROJECTION
                                            </h3>
                                            <div className="space-y-3 my-2">
                                                <div className="relative">
                                                    <div className="flex justify-between items-center text-[9.5px] mb-1 font-mono">
                                                        <span className="text-zinc-500 font-medium">CURRENT CGPA</span>
                                                        <span className="text-yellow-400 font-bold"><CountUp to={7.7} /> / 10</span>
                                                    </div>
                                                    <div className="overflow-hidden h-1.5 flex rounded bg-white/5 shadow-inner">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: "77%" }}
                                                            transition={{ duration: 1.2, ease: "easeOut" }}
                                                            className="h-full bg-gradient-to-r from-yellow-400 to-amber-500 shadow-md"
                                                        />
                                                    </div>
                                                </div>
                                                <div className="relative">
                                                    <div className="flex justify-between items-center text-[9.5px] mb-1 font-mono">
                                                        <span className="text-zinc-500 font-medium">TARGET GRADS</span>
                                                        <span className="text-zinc-300 font-bold"><CountUp to={8.5} /> / 10</span>
                                                    </div>
                                                    <div className="overflow-hidden h-1.5 flex rounded bg-white/5 shadow-inner">
                                                        <motion.div 
                                                            initial={{ width: 0 }}
                                                            animate={{ width: "85%" }}
                                                            transition={{ duration: 1.5, ease: "easeOut" }}
                                                            className="h-full bg-gradient-to-r from-zinc-700 to-zinc-500 opacity-60"
                                                        />
                                                    </div>
                                                </div>
                                            </div>
                                            <div className="border-t border-white/5 pt-2 flex items-center justify-between text-[8px] text-zinc-500 font-mono">
                                                <span>SEM 3: 7.4</span>
                                                <span className="text-emerald-400">ARREARS CLEARED</span>
                                            </div>
                                        </div>

                                        {/* Mini Checklist Ring */}
                                        <div className="border border-white/5 bg-white/[0.01] rounded-2xl p-4 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <h4 className="text-[8.5px] font-black tracking-[0.2em] text-zinc-400 uppercase">MISSION OBJECTIVES</h4>
                                                <p className="text-[10px] text-zinc-500 font-medium font-mono uppercase">{completedTasks} of {totalTasks} Completed</p>
                                            </div>
                                            <div className="relative flex items-center justify-center w-11 h-11 flex-shrink-0">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle
                                                        cx="22"
                                                        cy="22"
                                                        r={18}
                                                        className="stroke-zinc-800"
                                                        strokeWidth="2.5"
                                                        fill="transparent"
                                                    />
                                                    <motion.circle
                                                        cx="22"
                                                        cy="22"
                                                        r={18}
                                                        className="stroke-yellow-400"
                                                        strokeWidth="2.5"
                                                        fill="transparent"
                                                        strokeDasharray={2 * Math.PI * 18}
                                                        animate={{ strokeDashoffset: (2 * Math.PI * 18) - (taskPercent / 100) * (2 * Math.PI * 18) }}
                                                        transition={{ type: "spring", stiffness: 70, damping: 13 }}
                                                    />
                                                </svg>
                                                <span className="absolute text-[8px] font-mono font-bold text-yellow-300">
                                                    {taskPercent.toFixed(0)}%
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Panel: Experience */}
                            {activeTab === "experience" && (
                                <motion.div
                                    key="experience-tab"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.22 }}
                                    className="space-y-4 max-h-[380px] overflow-y-auto pr-1"
                                >
                                    {[
                                        {
                                            role: "Data Analyst Intern",
                                            company: "Larsen & Toubro (L&T)",
                                            period: "Jun 2026 – Aug 2026",
                                            points: [
                                                "Built a PDF-to-Excel Spec Extractor using a hybrid RAG pipeline (FAISS + BM25 + Reciprocal Rank Fusion) with GPT-4o extraction and GPT-4o-mini verification, auto-populating structured checklists.",
                                                "Developed an OCR-based SLD data extraction tool for electrical single-line diagrams using iterative Tesseract OCR and custom parsing logic.",
                                                "Optimised end-to-end token cost from ~$22 to ~$2 per run using rule-based verification skipping, model downgrading, and SentenceTransformer offline embeddings.",
                                                "Engineered concurrent extraction with ThreadPoolExecutor across sheet types, cutting multi-page processing time significantly."
                                            ]
                                        },
                                        {
                                            role: "Web Design & Development Intern",
                                            company: "Neoshaan Technologies (OPC) Pvt. Ltd.",
                                            period: "May 2025 – Jul 2025",
                                            points: [
                                                "Rebuilt company website in React.js + Tailwind CSS, improving Lighthouse performance score and eliminating mobile responsiveness failures across 3 client sites.",
                                                "Audited UX across 3 live client properties, cataloguing 20+ navigation and layout defects, reducing user drop-off.",
                                                "Engineered a Node.js/Nodemailer backend for lead-capture forms, replacing manual processes and enabling trackable conversion data."
                                            ]
                                        }
                                    ].map((job, idx) => (
                                        <div key={idx} className="border border-white/5 bg-white/[0.005] hover:bg-white/[0.015] rounded-xl p-4 transition-colors">
                                            <div className="flex items-center justify-between mb-2">
                                                <div>
                                                    <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">{job.role}</h4>
                                                    <p className="text-[9.5px] text-yellow-400 font-semibold mt-0.5">{job.company}</p>
                                                </div>
                                                <span className="text-[8.5px] font-mono text-zinc-500 bg-white/5 border border-white/5 rounded-md px-2 py-0.5">{job.period}</span>
                                            </div>
                                            <ul className="space-y-1.5">
                                                {job.points.map((pt, pIdx) => (
                                                    <li key={pIdx} className="flex gap-2 text-[9.5px] text-zinc-400 font-medium leading-relaxed">
                                                        <ChevronRight size={10} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                                                        <span>{pt}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* Panel 2: Skills & Focus Area */}
                            {activeTab === "skills" && (
                                <motion.div
                                    key="skills-tab"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.22 }}
                                    className="space-y-4"
                                >
                                    {/* Sub Category Filter Selector */}
                                    <div className="flex gap-2">
                                        {[
                                            { id: "all", label: "All Technologies" },
                                            { id: "aiml", label: "AI & Machine Learning" },
                                            { id: "languages", label: "Core Languages" },
                                            { id: "webdev", label: "Web Development" },
                                            { id: "tools", label: "Tools & Analytics" }
                                        ].map(category => (
                                            <button
                                                key={category.id}
                                                onClick={() => {
                                                    AudioEngine.playUISelect();
                                                    setSkillsFilter(category.id);
                                                }}
                                                className={`
                                                    px-3 py-1 rounded-full text-[8.5px] font-bold tracking-wider uppercase border transition-all duration-300 cursor-pointer
                                                    ${skillsFilter === category.id 
                                                        ? "bg-yellow-400 text-zinc-950 border-yellow-400 shadow-md shadow-yellow-400/10" 
                                                        : "border-white/5 bg-white/[0.01] text-zinc-400 hover:text-white hover:border-white/15"}
                                                `}
                                            >
                                                {category.label}
                                            </button>
                                        ))}
                                    </div>

                                    {/* Skills Grid */}
                                    <motion.div 
                                        variants={{
                                            hidden: {},
                                            visible: { transition: { staggerChildren: 0.03 } }
                                        }}
                                        initial="hidden"
                                        animate="visible"
                                        className="grid grid-cols-3 gap-2.5 max-h-[380px] overflow-y-auto pr-1"
                                    >
                                        {filteredSkills.map((skill) => (
                                            <motion.div
                                                key={skill.name}
                                                variants={{
                                                    hidden: { opacity: 0, scale: 0.95, y: 8 },
                                                    visible: { opacity: 1, scale: 1, y: 0 }
                                                }}
                                                whileHover={{ scale: 1.02, y: -1 }}
                                                className="
                                                    p-3
                                                    rounded-xl
                                                    border
                                                    border-white/5
                                                    bg-white/[0.01]
                                                    backdrop-blur-md
                                                    flex
                                                    flex-col
                                                    justify-between
                                                    gap-1.5
                                                    shadow-sm
                                                "
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className={`text-[10px] font-black text-white`}>
                                                        {skill.name}
                                                    </span>
                                                    <span className="text-[6.5px] font-bold px-1.5 py-0.5 rounded border border-white/5 bg-white/5 text-zinc-400 uppercase tracking-wider">
                                                        {skill.level}
                                                    </span>
                                                </div>
                                                <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden mt-0.5">
                                                    <motion.div 
                                                        initial={{ width: 0 }}
                                                        animate={{ 
                                                            width: skill.level === "Expert" ? "95%" : skill.level === "Specialist" ? "85%" : skill.level === "Advanced" ? "75%" : "55%" 
                                                        }}
                                                        transition={{ duration: 1.0, ease: "easeOut", delay: 0.1 }}
                                                        className="h-full bg-yellow-400/90" 
                                                    />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* Panel 3: Major Projects */}
                            {activeTab === "projects" && (
                                <motion.div
                                    key="projects-tab"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.22 }}
                                    className="space-y-4"
                                >
                                    <motion.div 
                                        variants={{
                                            hidden: {},
                                            visible: { transition: { staggerChildren: 0.04 } }
                                        }}
                                        initial="hidden"
                                        animate="visible"
                                        className="grid grid-cols-2 gap-3 max-h-[380px] overflow-y-auto pr-1"
                                    >
                                        {projects.map((project, i) => (
                                            <motion.a
                                                key={i}
                                                href={project.link}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                variants={{
                                                    hidden: { opacity: 0, y: 10, scale: 0.98 },
                                                    visible: { opacity: 1, y: 0, scale: 1 }
                                                }}
                                                whileHover={{ scale: 1.02, y: -2 }}
                                                onMouseEnter={() => AudioEngine.playUIHover()}
                                                className="
                                                    block
                                                    p-4
                                                    rounded-xl
                                                    bg-white/[0.01]
                                                    border
                                                    border-white/5
                                                    transition-all
                                                    duration-300
                                                    relative
                                                    group
                                                "
                                            >
                                                {/* Neon Border Glow */}
                                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 opacity-0 group-hover:opacity-40 blur-[1px] -z-10 transition-opacity duration-300 pointer-events-none" style={{ margin: "-1px" }} />
                                                <div className="absolute inset-0 rounded-xl bg-zinc-950 -z-5 pointer-events-none" />

                                                <div className="flex items-center justify-between mb-1 relative z-10">
                                                    <span className="text-[11px] font-black text-white group-hover:text-yellow-300 transition-colors flex items-center gap-1.5">
                                                        {project.category === "aiml" && <Zap size={10} className="text-yellow-400 animate-pulse" />}
                                                        {project.title}
                                                    </span>
                                                    <ExternalLink size={11} className="text-zinc-500 group-hover:text-zinc-300 transition-colors" />
                                                </div>
                                                <p className="text-[9.5px] text-zinc-400 font-medium leading-relaxed mb-3.5 relative z-10">
                                                    {project.desc}
                                                </p>
                                                <div className="flex flex-wrap gap-1 relative z-10">
                                                    {project.tags.map((tag, tIndex) => (
                                                        <span key={tIndex} className="text-[7.5px] font-bold text-zinc-400 bg-white/5 border border-white/5 rounded px-1.5 py-0.5 uppercase tracking-wider">
                                                            {tag}
                                                        </span>
                                                    ))}
                                                </div>
                                            </motion.a>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* Panel 4: Career & Study Roadmap */}
                            {activeTab === "roadmap" && (
                                <motion.div
                                    key="roadmap-tab"
                                    initial={{ opacity: 0, y: 12 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -12 }}
                                    transition={{ duration: 0.22 }}
                                    className="relative pl-6 space-y-3 max-h-[380px] overflow-y-auto pr-1"
                                >
                                    {/* Timeline glowing pipeline wire */}
                                    <div className="absolute left-2.5 top-2 bottom-2 w-[1px] bg-zinc-800 overflow-hidden">
                                        <motion.div
                                            animate={{ y: ["-100%", "200%"] }}
                                            transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
                                            className="w-full h-12 bg-gradient-to-b from-transparent via-yellow-400 to-transparent shadow-[0_0_10px_#facc15]"
                                        />
                                    </div>

                                    {roadmapSteps.map((step, index) => (
                                        <div key={index} className="relative group">
                                            {/* Timeline Node dot */}
                                            <div className={`
                                                absolute -left-[22px] top-2.5 w-2.5 h-2.5 rounded-full border border-zinc-950 transition-all duration-300 z-10
                                                ${step.active 
                                                    ? "bg-yellow-400 shadow-[0_0_10px_#facc15] scale-125" 
                                                    : "bg-zinc-800 group-hover:bg-zinc-600"}
                                            `} />

                                            {/* Radial pulse ring around active timelines */}
                                            {step.active && (
                                                <motion.div 
                                                    animate={{ scale: [1, 1.45, 1], opacity: [0.7, 0, 0.7] }} 
                                                    transition={{ repeat: Infinity, duration: 2.2 }} 
                                                    className="absolute -left-[26px] top-[6px] w-[18px] h-[18px] border border-yellow-400/40 rounded-full blur-[2.5px] pointer-events-none" 
                                                />
                                            )}
                                            
                                            <div 
                                                onClick={() => {
                                                    AudioEngine.playUISelect();
                                                    setExpandedStage(expandedStage === index ? -1 : index);
                                                }}
                                                className={`
                                                    border rounded-xl p-3.5 transition-colors cursor-pointer select-none
                                                    ${expandedStage === index 
                                                        ? "border-yellow-500/20 bg-white/[0.015]" 
                                                        : "border-white/5 bg-white/[0.005] hover:bg-white/[0.015]"}
                                                `}
                                            >
                                                <h4 className="text-[10px] font-bold text-white flex items-center justify-between">
                                                    <span className="flex items-center gap-1.5">
                                                        {step.title}
                                                        {step.active && <span className="text-[6.5px] bg-yellow-950 border border-yellow-800 text-yellow-300 font-bold px-1.5 py-0.5 rounded-full uppercase tracking-wider">ACTIVE</span>}
                                                    </span>
                                                    <ChevronRight size={12} className={`text-zinc-500 transition-transform ${expandedStage === index ? "rotate-90 text-yellow-400" : ""}`} />
                                                </h4>
                                                <p className="text-[9.5px] text-zinc-400 font-medium mt-1 leading-relaxed">
                                                    {step.desc}
                                                </p>

                                                <AnimatePresence>
                                                    {expandedStage === index && (
                                                        <motion.div
                                                            initial={{ height: 0, opacity: 0 }}
                                                            animate={{ height: "auto", opacity: 1 }}
                                                            exit={{ height: 0, opacity: 0 }}
                                                            transition={{ duration: 0.25 }}
                                                            className="mt-3 space-y-2 border-t border-white/5 pt-3"
                                                        >
                                                            {step.checkpoints.map((cp, cpi) => (
                                                                <div key={cpi} className="flex items-center gap-2 text-[8.5px] text-zinc-300 font-mono">
                                                                    <CheckCircle2 size={10} className="text-emerald-400 flex-shrink-0" />
                                                                    <span>{cp}</span>
                                                                </div>
                                                            ))}
                                                        </motion.div>
                                                    )}
                                                </AnimatePresence>
                                            </div>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                        </AnimatePresence>
                    </div>
                </div>

                {/* Footer Docks */}
                <div className="relative z-10 border-t border-white/5 pt-4.5 mt-4 flex items-center justify-between">
                    
                    {/* Social icons */}
                    <div className="flex gap-2">
                        {[
                            { icon: GitBranch, link: "https://github.com/theflighttechofficial" },
                            { icon: Briefcase, link: "https://linkedin.com/in/varun-vaibhav-s-11b69a2ba" },
                            { icon: Mail, link: "mailto:Umasubramanian81@gmail.com" },
                            { icon: FileText, link: "#resume" }
                        ].map((item, i) => (
                            <motion.a
                                key={i}
                                href={item.link}
                                target="_blank"
                                rel="noopener noreferrer"
                                whileHover={{ scale: 1.08, y: -2 }}
                                onMouseEnter={() => AudioEngine.playUIHover()}
                                className="
                                    w-8.5
                                    h-8.5
                                    rounded-xl
                                    border
                                    border-white/5
                                    bg-white/[0.02]
                                    text-zinc-400
                                    hover:text-white
                                    hover:border-yellow-500/20
                                    flex
                                    items-center
                                    justify-center
                                    transition-all
                                    duration-300
                                    shadow-[inset_0_1px_rgba(255,255,255,0.03)]
                                    cursor-pointer
                                "
                            >
                                <item.icon size={14} />
                            </motion.a>
                        ))}
                    </div>

                    {/* Disconnect Button */}
                    <motion.button
                        onClick={handleSignOut}
                        onMouseEnter={() => AudioEngine.playUIHover()}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="
                            px-4.5
                            py-2
                            rounded-xl
                            bg-gradient-to-r
                            from-zinc-800/80
                            to-zinc-900/80
                            hover:from-yellow-400
                            hover:to-amber-400
                            hover:text-zinc-950
                            border
                            border-white/5
                            text-[8.5px]
                            font-bold
                            tracking-widest
                            text-white
                            cursor-pointer
                            shadow-md
                            flex
                            items-center
                            gap-1.5
                            transition-all
                            duration-300
                            uppercase
                        "
                    >
                        Disconnect Rig
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
