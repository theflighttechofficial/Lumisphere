import { motion, AnimatePresence } from "framer-motion";
import { 
    GitBranch, Briefcase, Mail, FileText, ArrowLeft, ExternalLink, 
    Cpu, Layout, Sparkles, ListTodo, LineChart, BookOpen, 
    Monitor, Compass, Terminal, CheckCircle2, ChevronRight, Zap, 
    Activity, Shield, RefreshCw, Globe, Phone, MapPin, Target,
    LogOut, Download, Search, Copy, Check, X, Award, Layers, Eye,
    GraduationCap, Trophy, Code2, Flame, Star, Palette, Play, HelpCircle,
    Database, Brain, Server, TerminalSquare, User, Calendar, Share2
} from "lucide-react";
import { useState, useRef, useEffect, useMemo } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls } from "@react-three/drei";
import * as THREE from "three";
import { useLight } from "../../context/LightContext";
import { AudioEngine } from "../../utils/AudioEngine";
import NoiseLayer from "../UI/NoiseLayer";
import HolographicSkillsNetwork from "./HolographicSkillsNetwork";
import ResumeRoom from "./ResumeRoom";

// Custom SVG Icons for GitHub, LinkedIn, Kaggle, Hashnode
function GithubIcon({ size = 14, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.53 1.032 1.53 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.113-4.555-4.951 0-1.093.39-1.988 1.029-2.688-.103-.253-.446-1.272.098-2.65 0 0 .84-.27 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.92.678 1.855 0 1.338-.012 2.419-.012 2.747 0 .268.18.58.688.482A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z" />
        </svg>
    );
}

function LinkedinIcon({ size = 14, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.88 8.56a1.68 1.68 0 0 0 1.68-1.68c0-.93-.75-1.69-1.68-1.69a1.69 1.69 0 0 0-1.69 1.69c0 .93.76 1.68 1.69 1.68m1.39 9.94v-8.37H5.5v8.37h2.77z" />
        </svg>
    );
}

function KaggleIcon({ size = 14, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M18.825 23.859h-3.26l-6.425-9.458-3.033 2.946v6.512H3.14V.141h2.967v12.242l8.847-12.242h3.585l-7.46 9.873 7.746 13.845z"/>
        </svg>
    );
}

function HashnodeIcon({ size = 14, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" className={className}>
            <path d="M22.351 8.019l-6.37-6.37a5.63 5.63 0 0 0-7.962 0l-6.37 6.37a5.63 5.63 0 0 0 0 7.962l6.37 6.37a5.63 5.63 0 0 0 7.962 0l6.37-6.37a5.63 5.63 0 0 0 0-7.962zm-10.351 7.981a4 4 0 1 1 4-4 4.005 4.005 0 0 1-4 4z"/>
        </svg>
    );
}

function InstagramIcon({ size = 14, className = "" }) {
    return (
        <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
            <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
            <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
        </svg>
    );
}

// --- Dynamic Color Theme Palettes ---
const themePalettes = {
    amber: {
        points: "#fbbf24", lines: "#fef08a", core: "#f59e0b",
        accent: "text-yellow-400", border: "border-yellow-400/40", bg: "bg-yellow-400", glow: "shadow-yellow-400/30"
    },
    green: {
        points: "#34d399", lines: "#a7f3d0", core: "#10b981",
        accent: "text-emerald-400", border: "border-emerald-400/40", bg: "bg-emerald-400", glow: "shadow-emerald-400/30"
    },
    cyan: {
        points: "#38bdf8", lines: "#bae6fd", core: "#0284c7",
        accent: "text-sky-400", border: "border-sky-400/40", bg: "bg-sky-400", glow: "shadow-sky-400/30"
    },
    purple: {
        points: "#c084fc", lines: "#f5d0fe", core: "#9333ea",
        accent: "text-purple-400", border: "border-purple-400/40", bg: "bg-purple-400", glow: "shadow-purple-400/30"
    },
    red: {
        points: "#f87171", lines: "#fecdd3", core: "#dc2626",
        accent: "text-red-400", border: "border-red-400/40", bg: "bg-red-400", glow: "shadow-red-400/30"
    }
};

// --- Real Code Snippets Database ---
const codeSnippets = {
    rag: {
        title: "L&T Hybrid RAG Spec Extractor (FAISS + BM25 + RRF)",
        lang: "Python",
        code: `def retrieve_hybrid_context(query: str, pdf_docs: list, top_k: int = 5):
    # 1. Dense Vector Retrieval via FAISS
    query_vector = sentence_encoder.encode([query])
    faiss_distances, faiss_indices = vector_index.search(query_vector, top_k * 2)
    
    # 2. Sparse Keyword Retrieval via BM25
    bm25_scores = bm25_index.get_scores(tokenize(query))
    bm25_top_indices = np.argsort(bm25_scores)[::-1][:top_k * 2]
    
    # 3. Reciprocal Rank Fusion (RRF) algorithm
    rrf_scores = defaultdict(float)
    for rank, idx in enumerate(faiss_indices[0]):
        rrf_scores[idx] += 1.0 / (60 + rank)
    for rank, idx in enumerate(bm25_top_indices):
        rrf_scores[idx] += 1.0 / (60 + rank)
        
    reranked = sorted(rrf_scores.items(), key=lambda x: x[1], reverse=True)[:top_k]
    # Token Cost Optimization ($22 -> $2 per 1,200+ page document run)
    return [pdf_docs[idx] for idx, _ in reranked]`
    },
    ocr_sld: {
        title: "L&T OCR-Based SLD Data Extractor (Tesseract + AutoCAD PDF)",
        lang: "Python / Tesseract OCR",
        code: `class SLDDiagramParser:
    def __init__(self, pdf_path: str):
        self.pages = convert_pdf_to_images(pdf_path, dpi=300)
        self.ocr_engine = pyTesseractEngine(lang='eng', config='--psm 6')

    def extract_electrical_nodes(self, image):
        # Image Preprocessing for Zero-Text Layer AutoCAD Scans
        gray = cv2.cvtColor(image, cv2.COLOR_BGR2GRAY)
        thresh = cv2.adaptiveThreshold(gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 11, 2)
        
        # Iterative Diagram Symbol & Label Extractor
        data = self.ocr_engine.image_to_data(thresh, output_type=Output.DICT)
        electrical_specs = parse_voltage_ratings_and_breakers(data)
        return electrical_specs`
    },
    roadai: {
        title: "Road-AI YOLOv8 Uncertainty & Depth Fusion Engine",
        lang: "Python / PyTorch / OpenCV",
        code: `class RoadAIDetector:
    def __init__(self, model_weights="yolov8m-rdd2022.pt"):
        self.model = YOLO(model_weights)
        self.depth_estimator = MiDaS_Small()
        
    def detect_with_uncertainty(self, frame_bgr, mc_samples=5):
        # Monte-Carlo Dropout Sampling for 38% False Positive Reduction
        predictions = [self.model(frame_bgr, augment=True) for _ in range(mc_samples)]
        boxes, confs = self.merge_ensemble(predictions)
        
        # Physics-based Depth Estimation for NHAI Repair Costing
        depth_map = self.depth_estimator.infer(frame_bgr)
        damage_volume = self.calculate_damage_volume(boxes, depth_map)
        
        return { "boxes": boxes, "mAP50": 0.648, "est_cost_inr": damage_volume * 450 }`
    },
    hologram: {
        title: "LumiSphere 3D Particle Morphing Shader Engine",
        lang: "JavaScript / Three.js",
        code: `useFrame((state, delta) => {
    const elapsed = state.clock.elapsedTime;
    const target = shapes[activeTab] || shapes.dashboard;
    const positions = pointsRef.current.geometry.attributes.position.array;
    
    // Interpolated Morphing between 3D volumetric geometric topologies
    for (let i = 0; i < count * 3; i++) {
        positions[i] = THREE.MathUtils.lerp(positions[i], target[i], 0.08);
    }
    pointsRef.current.geometry.attributes.position.needsUpdate = true;
    
    // Halogen Orbiting Motion & Core Pulsing
    pointsRef.current.rotation.y += delta * speed;
    coreRef.current.material.opacity = 0.4 + 0.2 * Math.sin(elapsed * 4.5);
});`
    },
    homefinder: {
        title: "HomeFinder Sub-100ms MongoDB Multi-Attribute Search",
        lang: "Node.js / Express / MongoDB",
        code: `router.get("/properties/search", async (req, res) => {
    const { city, minPrice, maxPrice, amenities, type } = req.query;
    const filterQuery = {};
    if (city) filterQuery.city = new RegExp(city, "i");
    if (type) filterQuery.propertyType = type;
    if (minPrice || maxPrice) {
        filterQuery.price = {};
        if (minPrice) filterQuery.price.$gte = Number(minPrice);
        if (maxPrice) filterQuery.price.$lte = Number(maxPrice);
    }
    if (amenities) filterQuery.amenities = { $all: amenities.split(",") };
    
    // Sub-100ms Query Performance using Compound Indexing
    const results = await Property.find(filterQuery).limit(50).lean();
    res.json({ success: true, count: results.length, data: results });
});`
    }
};

// --- Count-up numeric animation component ---
function CountUp({ to, duration = 1.2, decimals = 1 }) {
    const [count, setCount] = useState(0);
    useEffect(() => {
        let startTime = null;
        const animate = (timestamp) => {
            if (!startTime) startTime = timestamp;
            const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
            setCount(progress * to);
            if (progress < 1) requestAnimationFrame(animate);
        };
        requestAnimationFrame(animate);
    }, [to, duration]);
    return <span>{count.toFixed(decimals)}</span>;
}

// --- Live System Diagnostics ---
function LiveSystemDiagnosticLog({ intensity }) {
    const [logs, setLogs] = useState([]);
    useEffect(() => {
        const rawLogs = [
            "SYS_STAT: HALOGEN CORE OPTIMAL",
            `POWER DRAW: ${(intensity * 0.5).toFixed(1)}W AT 12.0V`,
            "SRIHER CSE AI & DATA MATRIX: VERIFIED",
            "L&T PRODUCTION PIPELINE: ACTIVE",
            "STANFORD ML SPECIALIZATION: SIGNED",
            "GOOGLE PROMPTING ESSENTIALS: SIGNED",
            "HACKERRANK GOLD BADGES: PYTHON & SQL",
            "TARGET 2029: ARIZONA STATE UNIVERSITY MS"
        ];
        setLogs([]);
        let logIdx = 0;
        const interval = setInterval(() => {
            if (logIdx < rawLogs.length) {
                setLogs(prev => [...prev, rawLogs[logIdx]]);
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
                <div key={idx} className={log && (log.includes("VERIFIED") || log.includes("ACTIVE") || log.includes("OPTIMAL") || log.includes("SIGNED")) ? "text-emerald-400/90 font-bold" : "text-zinc-400/70"}>
                    &gt; {log}
                </div>
            ))}
        </div>
    );
}

// --- Hologram Scene Component ---
function HologramScene({ activeTab, speed, shapeOverride, theme }) {
    const pointsRef = useRef();
    const lineRef = useRef();
    const coreRef = useRef();
    const count = 216;
    
    const shapes = useMemo(() => {
        const reactor = new Float32Array(count * 3);
        const brain = new Float32Array(count * 3);
        const matrix = new Float32Array(count * 3);
        const helix = new Float32Array(count * 3);
        const phi = Math.PI * (3 - Math.sqrt(5));
        
        for (let i = 0; i < count; i++) {
            const isStrandB = i % 2 === 0;
            const angle = (i / count) * Math.PI * 12 + (isStrandB ? Math.PI : 0);
            const radius = 1.0;
            const h = (i / count) * 3.0 - 1.5;
            reactor[i * 3] = Math.sin(angle) * radius;
            reactor[i * 3 + 1] = h;
            reactor[i * 3 + 2] = Math.cos(angle) * radius;
            
            const y = 1 - (i / (count - 1)) * 2;
            const rad = Math.sqrt(1 - y * y) * 1.5;
            const theta = i * phi;
            brain[i * 3] = Math.cos(theta) * rad;
            brain[i * 3 + 1] = y * 1.5;
            brain[i * 3 + 2] = Math.sin(theta) * rad;
            
            const ix = i % 6;
            const iy = Math.floor((i % 36) / 6);
            const iz = Math.floor(i / 36);
            matrix[i * 3] = (ix - 2.5) * 0.52;
            matrix[i * 3 + 1] = (iy - 2.5) * 0.52;
            matrix[i * 3 + 2] = (iz - 2.5) * 0.52;
            
            const helixAngle = (i / count) * Math.PI * 10;
            const helixRadius = 1.2 - 0.5 * (i / count);
            const helixH = (i / count) * 3.2 - 1.6;
            helix[i * 3] = Math.sin(helixAngle) * helixRadius;
            helix[i * 3 + 1] = helixH;
            helix[i * 3 + 2] = Math.cos(helixAngle) * helixRadius;
        }
        return { dashboard: reactor, skills: brain, projects: matrix, roadmap: helix, experience: reactor, reactor, neural: brain, matrix, helix };
    }, []);

    const currentPositions = useMemo(() => new Float32Array(count * 3), []);

    useFrame((state, delta) => {
        const elapsed = state.clock.elapsedTime;
        const shapeKey = shapeOverride || activeTab;
        const target = shapes[shapeKey] || shapes.dashboard;
        
        if (pointsRef.current) {
            const positions = pointsRef.current.geometry.attributes.position.array;
            for (let i = 0; i < count * 3; i++) {
                positions[i] = THREE.MathUtils.lerp(positions[i], target[i], 0.08);
            }
            pointsRef.current.geometry.attributes.position.needsUpdate = true;
            pointsRef.current.rotation.y += delta * speed;
            
            if (lineRef.current) {
                lineRef.current.rotation.copy(pointsRef.current.rotation);
                const linePositions = lineRef.current.geometry.attributes.position.array;
                let lineIdx = 0;
                let connectionCount = 0;
                for (let i = 0; i < linePositions.length; i++) linePositions[i] = 0;
                for (let i = 0; i < count; i++) {
                    if (connectionCount >= 120) break;
                    const px = positions[i * 3], py = positions[i * 3 + 1], pz = positions[i * 3 + 2];
                    for (let j = i + 1; j < count; j++) {
                        const qx = positions[j * 3], qy = positions[j * 3 + 1], qz = positions[j * 3 + 2];
                        const distSq = (px-qx)*(px-qx) + (py-qy)*(py-qy) + (pz-qz)*(pz-qz);
                        if (distSq < (shapeKey === "projects" ? 0.35 : 0.65) ** 2) {
                            linePositions[lineIdx++] = px; linePositions[lineIdx++] = py; linePositions[lineIdx++] = pz;
                            linePositions[lineIdx++] = qx; linePositions[lineIdx++] = qy; linePositions[lineIdx++] = qz;
                            connectionCount++;
                            if (connectionCount >= 120) break;
                        }
                    }
                }
                lineRef.current.geometry.attributes.position.needsUpdate = true;
            }

            const palette = themePalettes[theme] || themePalettes.amber;
            pointsRef.current.material.color.lerp(new THREE.Color(palette.points), 0.08);
            if (lineRef.current) lineRef.current.material.color.lerp(new THREE.Color(palette.lines), 0.08);
            if (coreRef.current) {
                coreRef.current.material.color.lerp(new THREE.Color(palette.core), 0.08);
                coreRef.current.material.opacity = 0.4 + 0.2 * Math.sin(elapsed * 4.5);
            }
        }
    });

    return (
        <group>
            <points ref={pointsRef}>
                <bufferGeometry><bufferAttribute attach="attributes-position" args={[currentPositions, 3]} /></bufferGeometry>
                <pointsMaterial color="#ffffff" size={0.065} transparent opacity={0.95} depthWrite={false} />
            </points>
            <lineSegments ref={lineRef}>
                <bufferGeometry><bufferAttribute attach="attributes-position" args={[new Float32Array(150 * 2 * 3), 3]} /></bufferGeometry>
                <lineBasicMaterial color="#fff2cc" transparent opacity={0.35} depthWrite={false} />
            </lineSegments>
            <mesh ref={coreRef}>
                <sphereGeometry args={[0.26, 16, 16]} />
                <meshBasicMaterial color="#fbbf24" transparent opacity={0.45} />
            </mesh>
        </group>
    );
}

function HologramCanvas({ activeTab, speed, shapeOverride, onSelectShape, theme }) {
    return (
        <div className="w-full h-[220px] select-none pointer-events-auto cursor-grab active:cursor-grabbing relative overflow-hidden border border-yellow-500/20 bg-gradient-to-b from-zinc-950/80 to-black/90 rounded-2xl shadow-[0_0_25px_rgba(251,191,36,0.08)] my-3">
            <div className="absolute inset-0 pointer-events-none border border-yellow-400/20 rounded-2xl z-10" />
            <div className="absolute inset-x-0 top-0 h-[2px] bg-gradient-to-r from-transparent via-yellow-400 to-transparent animate-[bounce_4s_infinite_ease-in-out] z-10 shadow-[0_0_10px_#facc15]" />
            <div className="absolute bottom-2.5 left-3.5 font-mono text-[7.5px] tracking-widest text-yellow-400 uppercase z-10 flex items-center gap-1.5 font-bold">
                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 animate-ping shadow-[0_0_8px_#facc15]" />
                EMITTER // TOPOLOGY: {shapeOverride || activeTab}
            </div>

            <div className="absolute top-2 right-2.5 z-20 flex gap-1 bg-zinc-950/80 p-1 rounded-lg border border-white/10 backdrop-blur-md shadow-lg">
                {[
                    { id: null, label: "AUTO" },
                    { id: "reactor", label: "CORE" },
                    { id: "neural", label: "NEURAL" },
                    { id: "matrix", label: "GRID" },
                    { id: "helix", label: "HELIX" }
                ].map(item => (
                    <button
                        key={item.label}
                        onClick={() => { AudioEngine.playUISelect(); onSelectShape(item.id); }}
                        className={`px-1.5 py-0.5 text-[7px] font-mono font-bold rounded cursor-pointer transition-colors ${shapeOverride === item.id || (!shapeOverride && item.id === null) ? "bg-yellow-400 text-zinc-950" : "text-zinc-400 hover:text-white"}`}
                    >
                        {item.label}
                    </button>
                ))}
            </div>

            <Canvas gl={{ antialias: true, alpha: true }} camera={{ position: [0, 0, 4.0], fov: 45 }} style={{ width: "100%", height: "100%" }}>
                <ambientLight intensity={0.6} />
                <HologramScene activeTab={activeTab} speed={speed} shapeOverride={shapeOverride} theme={theme} />
                <OrbitControls enableZoom={false} enablePan={false} enableDamping dampingFactor={0.06} />
            </Canvas>
        </div>
    );
}

const roadmapSteps = [
    {
        title: "B.Tech CSE (AI & Data Analytics) — SRIHER",
        desc: "2024 – May 2028 | 3rd-Year B.Tech CSE (AI & DA) @ Sri Ramachandra Faculty of Eng & Tech, Chennai. CGPA: 7.7/10 (6.86 → 7.00 → 7.39 → 7.68 → 7.7). Cleared 2 arrears in Sem 3. O grades in DBMS, Data Analytics, ML, Advanced C++, Linux Labs.",
        active: true,
        checkpoints: [
            "Current CGPA maintained at 7.7 / 10 with strong upward momentum",
            "O Grades achieved in Data Analytics, ML, DBMS, Advanced C++, & Linux Labs",
            "Demonstrated Road-AI vision model at SRIHER Research Day 2026",
            "Innovation Day Cybercrime Prevention Showcase & Tech Expo 2025"
        ]
    },
    {
        title: "Data Analyst Intern — Larsen & Toubro (L&T Construction)",
        desc: "May 2026 – Jul 2026 | Built 2 active production systems processing 1,200+ pages daily, manual work cut from 3-4 days to minutes, token cost $22 -> $2 (91% reduction).",
        active: false,
        checkpoints: [
            "Hybrid RAG (FAISS + BM25 + Reciprocal Rank Fusion) processing 1,200+ pages in minutes (down from 3-4 days)",
            "Token cost optimized from $22 to $2 per run (91% reduction) with 65-70% accuracy",
            "OCR-based SLD extractor for AutoCAD PDFs with zero embedded text using Tesseract OCR",
            "Signed LOR from Sr. Data Scientist Naveen Raj B & Official HR Internship Completion Letter"
        ]
    },
    {
        title: "Web Developer Intern — Neoshaan Technologies",
        desc: "Jun 2025 – Aug 2025 | Production Web Applications & Lead Generation Backends.",
        active: false,
        checkpoints: [
            "Built 3 client websites using React.js + Tailwind CSS with mobile responsiveness",
            "Audited and resolved 20+ navigation and UX layout defects across live client properties",
            "Engineered Node.js / Nodemailer lead capture backend API for conversion tracking"
        ]
    },
    {
        title: "SIH 2026, Anchora SaaS, & Hackathon Sprint (Aug 2026 - Jun 2027)",
        desc: "Building Anchora SaaS, DocFlow Systems (SIH 2026 Problem SIH25057), Google Data Analytics Professional Certificate (Completed Sep 2026), 120+ StrataScratch SQL problems, & 2nd Internship (Jan-May 2027).",
        active: false,
        checkpoints: [
            "Ranked #1006/1983 globally in HackerRank Orchestrate August 2026 (WhatsApp Router)",
            "Completed Stanford Machine Learning (Andrew Ng signed) & Google Prompting Essentials",
            "Earned HackerRank Python & SQL Gold Badges + Cisco Packet Tracer Certification",
            "Preparing for GRE & IELTS (Feb-Mar 2027) & Mock Technical Interviews (Apr-Jun 2027)"
        ]
    },
    {
        title: "1-Year Work Placement & MS in CS/DS @ ASU Target (Fall 2029)",
        desc: "May 2028 – 2029+ | 1-year work placement (May 2028 - May 2029) at a top analytics firm (target ₹8-12 LPA), leading to MS in Computer Science / Data Science at Arizona State University (Fall 2029).",
        active: false,
        checkpoints: [
            "1-Year Industry Work Placement (May 2028 - May 2029): Target ₹8 - 12 LPA",
            "MS Enrollment (Fall 2029): Arizona State University (MS in CS / Data Science)",
            "Post-MS Target: US-based Data Science / ML Engineering role ($95K - $130K+)"
        ]
    }
];

export default function AboutPage() {
    const { isLightOn, setIsLightOn, setIsLoggedIn, lampIntensity, setLampIntensity, viewerName, college } = useLight();
    const [activeTab, setActiveTab] = useState("dashboard");
    const [skillsFilter, setSkillsFilter] = useState("all");
    const [skillsSearch, setSkillsSearch] = useState("");
    const [isGlitching, setIsGlitching] = useState(false);
    const [hologramSpeed, setHologramSpeed] = useState(0.25);
    const [shapeOverride, setShapeOverride] = useState(null);
    const [currentTheme, setCurrentTheme] = useState("amber");

    // Interactive Modals & Snippets
    const [selectedProject, setSelectedProject] = useState(null);
    const [selectedSnippet, setSelectedSnippet] = useState(null);
    const [isResumeOpen, setIsResumeOpen] = useState(false);

    // Notification Toast State
    const [toastMessage, setToastMessage] = useState(null);
    const triggerToast = (msg) => {
        setToastMessage(msg);
        setTimeout(() => setToastMessage(null), 3000);
    };

    // CLI Interactive Console States
    const [cmdInput, setCmdInput] = useState("");
    const [history, setHistory] = useState([
        { text: "LUMISPHERE OS v5.0 (S. VARUN VAIBHAV PROFILE MATRIX)", type: "system" },
        { text: `Welcome, ${viewerName || "Guest Reviewer"} from ${college || "SRIHER / Partner Institution"}!`, type: "system" },
        { text: "Target: MS in Data Science @ Arizona State University (2029)", type: "output" },
        { text: "Type '/help', '/contact', '/profile', '/exp', '/skills', '/certs', or '/goals'. Try '/code'!", type: "output" }
    ]);

    const terminalEndRef = useRef(null);

    useEffect(() => {
        const parentContainer = document.querySelector(".w-screen.h-screen.overflow-hidden");
        if (parentContainer) parentContainer.scrollTop = 0;
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        if (terminalEndRef.current) {
            const container = terminalEndRef.current.parentNode;
            if (container) container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
        }
    }, [history]);

    const [checklist, setChecklist] = useState([
        { id: 1, text: "Deploy L&T PDF RAG Spec Extractor & SLD OCR Tools", completed: true },
        { id: 2, text: "Stanford Machine Learning Specialization (Andrew Ng)", completed: true },
        { id: 3, text: "Google Prompting Essentials Specialization", completed: true },
        { id: 4, text: "HackerRank Python & SQL 5-Star Gold Badges", completed: true },
        { id: 5, text: "Publish Hashnode Blog on L&T Automation & Host LumiSphere on Vercel", completed: true },
        { id: 6, text: "Google Data Analytics Professional Certificate (Completed Sep 2026)", completed: true },
        { id: 7, text: "HackerRank Orchestrate Hackathon 2026 (Aug 1)", completed: false },
        { id: 8, text: "Complete 120+ StrataScratch SQL problems & Secure 2nd Internship", completed: false }
    ]);

    const [expandedStage, setExpandedStage] = useState(0);
    const [showVirtualRoom, setShowVirtualRoom] = useState(true);

    const completedTasks = checklist.filter(t => t.completed).length;
    const totalTasks = checklist.length;
    const taskPercent = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

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

    const executeCommand = (cmdStr) => {
        setCmdInput(cmdStr);
        runCommandLogic(cmdStr);
    };

    const runCommandLogic = (rawCommand) => {
        const raw = rawCommand.trim();
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
                output = "System Commands:\n  /profile    Show Executive Profile Brief\n  /contact    View Phone, Email, & Location\n  /exp        View Internship Experience (L&T, Neoshaan)\n  /projects   Switch to Projects Matrix\n  /skills     Switch to Technical Skills\n  /certs      List 10+ Verified Certifications\n  /goals      View 2027-2029 Career Roadmap\n  /code       Inspect Production RAG / OCR / YOLO Code\n  /quiz       Launch Interactive Technical Quiz\n  /dim <val>  Calibrate Spotlight Output (0-100)\n  /theme <n>  Switch Palette (amber, green, cyan, purple, red)\n  /clear      Clear Console History";
                break;
            case "/resumeroom":
            case "resumeroom":
                setShowVirtualRoom(true);
                output = "🏛️ RESUME ROOM INITIALIZED: Launched Virtual Resume Exhibition Chamber.";
                break;
            case "/profile":
            case "profile":
                output = "S. VARUN VAIBHAV — PROFILE\n• Status: 3rd-year B.Tech (AI & Data Analytics) @ SRIHER Chennai\n• CGPA: 7.7/10 (Upward Trajectory: 6.86 -> 7.68, 2 arrears cleared)\n• Focus: Production Data Systems, Hybrid RAG, CV, & Full-Stack AI\n• Target: MS in Data Science @ Arizona State University (2029)";
                break;
            case "/contact":
            case "contact":
                output = "CONTACT DIRECTORY:\n• Email: Umasubramanian81@gmail.com\n• Phone: +91 9384000748\n• Location: Chennai, India\n• GitHub: github.com/theflighttechofficial\n• LinkedIn: linkedin.com/in/varun-vaibhav-s-11b69a2ba\n• Instagram: instagram.com/varunwashere__\n• Kaggle: kaggle.com/theflighttechofficial\n• Blog: theflighttechlabs.hashnode.dev";
                break;
            case "/exp":
            case "exp":
                output = "PROFESSIONAL INTERNSHIPS:\n1. L&T Construction — Data Analyst Intern (May-Jul 2026)\n   - PDF Spec Extractor: Hybrid RAG (FAISS + BM25 + RRF), 1200+ pgs (3-4 days -> mins), $22->$2 token cost.\n   - OCR SLD Extractor: Tesseract OCR for AutoCAD zero-text electrical PDFs.\n   - LOR from Sr. Data Scientist Naveen Raj (NAVEEN-RAJ-B@LNTECC.COM).\n2. Neoshaan Technologies — Web Developer (May-Jul 2025)\n   - Built 3 client sites (React + Tailwind) & Node.js/Nodemailer backend.";
                break;
            case "/certs":
            case "certs":
                output = "10+ VERIFIED CERTIFICATIONS:\n• Stanford Machine Learning Specialization (3 courses, Andrew Ng signed)\n• Google Prompting Essentials (4 courses, Amanda Brophy signed)\n• Google Data Analytics Professional Certificate (9 courses, Sep 2026, Google / Coursera Verified)\n• HackerRank Python Gold Badge (5 Stars) & SQL Gold Badge (5 Stars)\n• HackerRank SQL Intermediate Certificate\n• IBM Python 101 for Data Science & IBM Z Day AI & Data\n• Microsoft ML Models (Build 2026)";
                break;
            case "/goals":
            case "goals":
                output = "CAREER ROADMAP & GOALS:\n• 2027: Certifications, 2nd Internship, Master SQL, GRE & IELTS\n• 2028: Graduate SRIHER, Secure Data Analyst Role (₹8-12 LPA)\n• 2029: Join MS in Data Science @ Arizona State University (ASU)\n• Post-MS: US Data Science / ML Engineering Role ($95K - $130K+)";
                break;
            case "/code":
            case "code":
                setSelectedSnippet(codeSnippets.rag);
                output = "INSPECTOR INITIALIZED: Loaded L&T Hybrid RAG Pipeline Code.";
                break;
            case "/quiz":
            case "quiz":
                output = "QUIZ STARTED: [Q1] What vector search engine is combined with BM25 in Varun's L&T Hybrid RAG?\nAnswer options: A) ChromaDB  B) FAISS  C) Pinecone\nType '/ans B' to submit answer!";
                break;
            case "/ans":
            case "ans":
                if (arg && arg.toUpperCase() === "B") {
                    output = "CORRECT ANSWER! (+100 XP)\nUnlocked Terminal Badge: [RAG_SYSTEMS_EXPERT]";
                } else {
                    output = "Incorrect answer! Hint: Facebook AI Similarity Search (FAISS).";
                    isErr = true;
                }
                break;
            case "/theme":
            case "theme":
                if (arg && themePalettes[arg.toLowerCase()]) {
                    setCurrentTheme(arg.toLowerCase());
                    output = `THEME UPDATED: Switched color palette to ${arg.toUpperCase()}.`;
                } else {
                    output = "Error: Available themes: amber, green, cyan, purple, red.";
                    isErr = true;
                }
                break;
            case "/projects":
            case "projects":
                setActiveTab("projects");
                output = "SYSTEM COMMAND: Navigation to MISSION_LOGS successful.";
                break;
            case "/skills":
            case "skills":
                setActiveTab("skills");
                output = "SYSTEM COMMAND: Navigation to TECH_MATRIX successful.";
                break;
            case "/dim":
            case "dim":
                const val = parseInt(arg, 10);
                if (!isNaN(val) && val >= 0 && val <= 100) {
                    setLampIntensity(val);
                    output = `CALIBRATION SUCCESS: Halogen intensity set to ${val}%.`;
                } else {
                    output = "Error: Intensity must be a number 0 - 100. Example: /dim 60";
                    isErr = true;
                }
                break;
            case "/clear":
            case "clear":
                setHistory([]);
                setCmdInput("");
                return;
            default:
                output = `Command not recognized: '${cmd}'. Type '/help' for options.`;
                isErr = true;
        }

        setHistory([...newHistory, { text: output, type: isErr ? "error" : "output" }]);
        setCmdInput("");
    };

    const handleCommandSubmit = (e) => {
        e.preventDefault();
        runCommandLogic(cmdInput);
    };

    const handleCopyEmail = () => {
        AudioEngine.playUISelect();
        navigator.clipboard.writeText("Umasubramanian81@gmail.com");
        triggerToast("Email copied: Umasubramanian81@gmail.com");
    };

    const handleCopyPhone = () => {
        AudioEngine.playUISelect();
        navigator.clipboard.writeText("+91 9384000748");
        triggerToast("Phone number copied: +91 9384000748");
    };

    const handleCopySnippet = (snippetText) => {
        AudioEngine.playUISelect();
        navigator.clipboard.writeText(snippetText);
        triggerToast("Code snippet copied to clipboard!");
    };

    const engineeringPillars = [
        { title: "Hybrid RAG & Doc AI", desc: "FAISS vector search, BM25 keyword matching, RRF reranking, 1200+ pg spec extractions ($22 -> $2 cost optimization)", icon: Brain },
        { title: "Computer Vision & Edge AI", desc: "YOLOv8, MiDaS depth estimation, Tesseract OCR for AutoCAD SLD electrical PDFs, OpenCV 30 FPS", icon: Eye },
        { title: "High-FPS WebGL Systems", desc: "React, Three.js 3D shaders, Framer Motion, LumiSphere Vercel portfolio, sub-second load times", icon: Layout },
        { title: "Data Analytics & SQL", desc: "pandas, NumPy, MySQL, MongoDB schema indexing (<100ms queries), HackerRank 5-Star Gold Badges", icon: Database }
    ];

    const skills = [
        // Languages
        { name: "Python", category: "languages", level: "Expert" },
        { name: "SQL", category: "languages", level: "Expert" },
        { name: "JavaScript / React", category: "languages", level: "Advanced" },
        { name: "C / C++", category: "languages", level: "Advanced" },
        { name: "Java", category: "languages", level: "Intermediate" },
        // AI & ML
        { name: "scikit-learn & XGBoost", category: "aiml", level: "Specialist" },
        { name: "YOLOv8 & Computer Vision", category: "aiml", level: "Specialist" },
        { name: "FAISS & BM25 Vector Search", category: "aiml", level: "Expert" },
        { name: "Reciprocal Rank Fusion (RRF)", category: "aiml", level: "Expert" },
        { name: "SHAP Explainability", category: "aiml", level: "Advanced" },
        { name: "NLP & SentenceTransformers", category: "aiml", level: "Advanced" },
        // Data
        { name: "pandas & NumPy", category: "data", level: "Expert" },
        { name: "Tesseract OCR & PyMuPDF", category: "data", level: "Expert" },
        { name: "Statistical Data Analysis", category: "data", level: "Advanced" },
        { name: "Data Engineering Pipelines", category: "data", level: "Advanced" },
        // Web Dev
        { name: "React.js & Vite", category: "webdev", level: "Expert" },
        { name: "Tailwind CSS", category: "webdev", level: "Expert" },
        { name: "Node.js & Express", category: "webdev", level: "Advanced" },
        { name: "MongoDB & MySQL", category: "webdev", level: "Advanced" },
        { name: "Nodemailer & REST APIs", category: "webdev", level: "Advanced" },
        // Tools
        { name: "Git & GitHub", category: "tools", level: "Expert" },
        { name: "Linux Shell & CLI", category: "tools", level: "Expert" },
        { name: "VS Code & Jupyter", category: "tools", level: "Expert" },
        { name: "Vercel Deployment", category: "tools", level: "Advanced" }
    ];

    const projects = [
        {
            title: "Anchora (Anchorpoint) SaaS Platform",
            category: "webdev",
            desc: "Production-ready dual-layer SaaS (freelancer workspace + startup ecosystem). React + TS + Zustand + Supabase, 60+ routes, ~30 migrations, 27 tables, 5 user roles, GPT-4o-mini AI matching.",
            fullDesc: "Anchora is a comprehensive dual-layer SaaS platform combining a freelancer project workspace with a startup ecosystem layer for cofounder matching, investor recommendations, AI proposal generation, and contract summarization. Features custom warm design system (#F7F4EF canvas, #B86F22 accent, #4A7250 sage).",
            metrics: "60+ Routes • ~30 Migrations • 27 Normalized Tables • 5 User Roles • GPT-4o-mini AI Engine",
            tags: ["React", "TypeScript", "Zustand", "Supabase", "PostgreSQL", "GPT-4o-mini", "Tailwind CSS"],
            link: "https://github.com/theflighttechofficial"
        },
        {
            title: "DocFlow Systems (SIH 2026)",
            category: "aiml",
            desc: "Legal Metrology Compliance Checker (Problem SIH25057) for 50M+ e-commerce product listings. 360x faster verification (3-5 days → 15 mins).",
            fullDesc: "Automated compliance verification platform enforcing Legal Metrology Rules 2011 + 2026 amendments across Amazon, Flipkart, Meesho, and CSV uploads. Combines EfficientDet packaging photo extraction, Tesseract OCR, spaCy NER, 25+ regulatory validation rules, and real-time seller/regulator dashboards.",
            metrics: "50M+ Product Coverage • 360x Speedup (3-5 Days → 15 Mins) • 25+ Metrology Rules • ₹49 Cr Est. Platform Savings",
            tags: ["Python", "FastAPI", "React", "PostgreSQL", "FAISS", "EfficientDet", "Tesseract OCR", "spaCy NER"],
            link: "https://github.com/theflighttechofficial"
        },
        {
            title: "Road-AI (VidMarg)",
            category: "aiml",
            desc: "YOLOv8 + depth estimation + NHAI cost analysis. mAP50: 0.648 on RDD2022, 38% false positive reduction. Physics-based depth & blockchain tracking.",
            fullDesc: "Road-AI is an ensemble YOLOv8 computer vision system integrated with MiDaS physics-based depth estimation, an automated NHAI repair cost estimation engine, text-to-speech alerts, and an immutable SHA256 blockchain inspection audit log. Presented at SRIHER Research Day 2026 & submitted to IIT Madras Hackathon 2026.",
            metrics: "mAP50: 0.648 • 38% FP Reduction • 30 FPS OpenCV • SHA256 Blockchain Audit Logs",
            tags: ["YOLOv8", "Computer Vision", "Depth Estimation", "Blockchain", "Python"],
            snippetKey: "roadai",
            link: "https://github.com/theflighttechofficial/RoadAi-Building-better-roads-for-India"
        },
        {
            title: "Paws & Care Clinic Web App",
            category: "webdev",
            desc: "Professional veterinary clinic platform with online appointment booking, doctor profiles, service directory, and pet health blog.",
            fullDesc: "Full-stack web platform built for Paws & Care Veterinary Clinic. Features online appointment scheduling with Google Calendar API integration, pet health articles, interactive service directory, and an admin management dashboard.",
            metrics: "Full-Stack Node/React • Google Calendar API • Admin Booking Suite • PostgreSQL DB",
            tags: ["React", "Tailwind CSS", "Node.js", "Express", "PostgreSQL", "Google Calendar API"],
            link: "https://github.com/theflighttechofficial"
        },
        {
            title: "L&T Hybrid RAG Spec Extractor",
            category: "aiml",
            desc: "Hybrid RAG pipeline (FAISS + BM25 + RRF) processing 1,200+ pages daily in minutes (down from 3-4 days). Optimized token costs from $22 to $2 per run (91% reduction).",
            fullDesc: "Production-grade document intelligence tool deployed in L&T Construction Analytics. Combines FAISS dense vector search, BM25 sparse keyword search, and Reciprocal Rank Fusion with GPT-4o to extract technical specifications into structured Excel sheets at 65-70% accuracy with 3-layer pickle caching.",
            metrics: "1,200+ Pages Daily • 3-4 Days → Minutes • Token Cost: $22 → $2 (91% Reduction) • 65-70% Accuracy",
            tags: ["Python", "FAISS", "BM25", "Reciprocal Rank Fusion", "RAG", "SentenceTransformers"],
            snippetKey: "rag",
            link: "https://theflighttechlabs.hashnode.dev"
        },
        {
            title: "L&T OCR SLD Extractor",
            category: "aiml",
            desc: "First-of-its-kind Tesseract OCR tool extracting electrical data from AutoCAD PDF single line diagrams with zero embedded text.",
            fullDesc: "Production OCR pipeline built for L&T Construction Analytics. Preprocesses rasterized electrical single-line diagrams (SLDs) with adaptive thresholding and iterative Tesseract parsing to extract circuit breaker ratings and BUS node topology at 70%+ accuracy.",
            metrics: "Zero-Text Layer PDF OCR • 70%+ Accuracy • Deployed in L&T Analytics",
            tags: ["Python", "Tesseract OCR", "OpenCV", "AutoCAD PDF"],
            snippetKey: "ocr_sld",
            link: "https://github.com/theflighttechofficial"
        },
        {
            title: "HackerRank Orchestrate WhatsApp Router",
            category: "aiml",
            desc: "NLU WhatsApp Notification Router using Groq API (llama-3.1-8b-instant). Ranked #1006 out of 1,983 globally.",
            fullDesc: "Intelligent messaging router built for HackerRank Orchestrate August 2026 competition. Classifies real WhatsApp messages by action type, urgency, and category using Groq Llama-3.1-8b NLU with 75% action accuracy and 83% type accuracy on 110+ test messages.",
            metrics: "Rank #1006 / 1,983 Globally • 75% Action Accuracy • 83% Type Accuracy • Groq API Llama-3.1",
            tags: ["Python", "Groq API", "Llama-3.1", "NLU", "HackerRank"],
            link: "https://github.com/theflighttechofficial"
        },
        {
            title: "AgriYield AI",
            category: "aiml",
            desc: "XGBoost crop yield prediction platform with SHAP explainability analysis. Published on Kaggle.",
            fullDesc: "Agricultural machine learning system integrating weather, soil chemistry, and historical regional yield data. Uses XGBoost regressors and SHAP (SHapley Additive exPlanations) values for interpretable yield projections.",
            metrics: "XGBoost Ensemble • SHAP Interpretability • Published on Kaggle",
            tags: ["XGBoost", "scikit-learn", "SHAP", "pandas", "Kaggle"],
            link: "https://github.com/theflighttechofficial"
        },
        {
            title: "LumiSphere Portfolio",
            category: "webdev",
            desc: "Cinematic interactive WebGL portfolio hosted live on Vercel. React + Vite, Three.js shaders, halogen dimmer controls, & glassmorphism.",
            fullDesc: "State-of-the-art developer portfolio platform featuring real-time WebGL particle shaders, Three.js 3D hologram morphing, custom Web Audio API synthesis, dynamic halogen dimmer controls, and responsive UI.",
            metrics: "Live on Vercel • 60 FPS WebGL Shaders • Custom AudioEngine FX",
            tags: ["React", "Vite", "Three.js", "WebGL", "Framer Motion"],
            snippetKey: "hologram",
            link: "https://lumisphere-nine.vercel.app"
        },
        {
            title: "ROGII Wellbore Competition",
            category: "aiml",
            desc: "Active Kaggle competitive data science track predicting wellbore geological parameters (LightGBM regression, ranked 1006/1983 globally).",
            fullDesc: "Ongoing Kaggle competition notebook developing spatial regression algorithms for oil & gas wellbore spatial orientation with LightGBM.",
            metrics: "Rank #1006 / 1,983 Globally • LightGBM Model • Spatial Data Science",
            tags: ["Kaggle", "LightGBM", "Python", "Data Science"],
            link: "https://kaggle.com/theflighttechofficial"
        },
        {
            title: "HomeFinder Rental Platform",
            category: "webdev",
            desc: "Full-stack real estate rental platform built with React, Node.js, and MongoDB featuring sub-100ms multi-attribute queries.",
            fullDesc: "Full-stack rental listing engine supporting city-level structured search, price range filtering, amenity matching, and property type classification with compound MongoDB indexing.",
            metrics: "<100ms Query Latency • Compound Indexing • Clean Glass UI",
            tags: ["React", "Node.js", "Express", "MongoDB", "Tailwind CSS"],
            snippetKey: "homefinder",
            link: "https://github.com/theflighttechofficial"
        },
        {
            title: "Titanic ML Competition",
            category: "aiml",
            desc: "Classification pipeline achieving 78.71% accuracy on Kaggle Titanic benchmark with feature engineering.",
            fullDesc: "Machine learning submission notebook incorporating family size grouping, title extraction, and Random Forest / XGBoost ensembling. Published on Kaggle.",
            metrics: "78.71% Accuracy • Published Kaggle Notebook • Feature Engineering",
            tags: ["Machine Learning", "Kaggle", "scikit-learn", "Python"],
            link: "https://kaggle.com/theflighttechofficial"
        },
        {
            title: "Invisibility Cloak",
            category: "aiml",
            desc: "Real-time OpenCV computer vision pipeline operating at 30 FPS for HSV color segmentation and background compositing.",
            fullDesc: "Augmented video processing script isolating specific color spectrum bands in HSV space and dynamically blending stored background frames to render target objects invisible in real-time.",
            metrics: "30 FPS Real-time Stream • Zero Latency Blending • HSV Filtering",
            tags: ["Python", "OpenCV", "NumPy"],
            link: "https://github.com/theflighttechofficial"
        },
        {
            title: "Smart File Organiser",
            category: "tools",
            desc: "C++ desktop application built with Qt GUI for automated directory sorting and file type organization.",
            fullDesc: "Native high-performance desktop utility engineered in C++ and Qt, providing automated rule-based file organization, metadata indexing, and directory cleanup.",
            metrics: "Native C++ Speed • Qt Desktop GUI • Instant Multi-threaded Sorting",
            tags: ["C++", "Qt Framework", "Desktop App"],
            link: "https://github.com/theflighttechofficial"
        }
    ];

    const certifications = [
        { title: "Stanford Machine Learning Specialization", issuer: "Stanford Online / Coursera (Jul 20, 2026)", desc: "Supervised ML, Advanced Learning Algorithms, Unsupervised Learning. Signed by Andrew Ng.", badge: "STANFORD / ANDREW NG" },
        { title: "Google Prompting Essentials", issuer: "Google / Coursera (Jul 5, 2026)", desc: "4-course specialization in prompt engineering, context framing, & LLM workflows. Signed by Amanda Brophy, Google.", badge: "GOOGLE VERIFIED" },
        { title: "Cisco Networking Academy: Packet Tracer", issuer: "Cisco Networking Academy (Aug 26, 2026)", desc: "Foundational network topology configuration, packet routing, and network simulation.", badge: "CISCO VERIFIED" },
        { title: "HackerRank Python Gold Badge", issuer: "HackerRank (Jul 8, 2026)", desc: "5-Star Gold Badge in Python algorithmic problem solving + Basic Certificate.", badge: "GOLD BADGE (5★)" },
        { title: "HackerRank SQL Gold Badge & Intermediate", issuer: "HackerRank (Jul 18-22, 2026)", desc: "5-Star Gold Badge in SQL + Verified SQL Intermediate Certification.", badge: "GOLD BADGE (5★)" },
        { title: "Google Data Analytics Professional", issuer: "Google / Coursera", desc: "Completed all 9 courses: data cleaning, SQL query optimization, R programming, & Tableau data visualization.", badge: "VERIFIED" },
        { title: "IBM Python 101 for Data Science", issuer: "IBM / Cognitive Class (May 2026)", desc: "Data structures, pandas, NumPy, and REST API data scraping.", badge: "IBM VERIFIED" },
        { title: "Creation of ML Models 2026", issuer: "Microsoft Learn (Build 2026 - Jun 2026)", desc: "Scikit-Learn, Automated ML, and Azure ML model creation.", badge: "MICROSOFT" },
        { title: "IBM Z Day AI & Data", issuer: "IBM Z Systems (2026)", desc: "Enterprise AI, Mainframe Data Security & Modernization.", badge: "ENTERPRISE AI" }
    ];

    const researchHighlights = [
        { title: "Hashnode Technical Publication", role: "Author (1,300+ Impressions)", desc: "Published 'How I Automated 3-4 Days of Manual Work at L&T Using Python' on Hashnode (theflighttechlabs.hashnode.dev)." },
        { title: "SRIHER Research Day 2026", role: "Key Demonstrator", desc: "Presented Road-AI YOLOv8 ensemble vision model with physics depth calculation, NHAI cost engine, & SHA256 blockchain tracking." },
        { title: "SIH 2026 Legal Metrology Lead", role: "Project Lead (Problem SIH25057)", desc: "Leading DocFlow Systems automated compliance checker for 50M+ e-commerce product listings." },
        { title: "L&T Analytics Production First", role: "Lead Analyst Intern", desc: "Pioneered Hybrid RAG PDF Spec Extractor & SLD Diagram OCR, cutting token costs by 91% ($22 → $2)." }
    ];

    const filteredSkills = skills.filter(s => {
        const matchesCategory = skillsFilter === "all" || s.category === skillsFilter;
        const matchesSearch = s.name.toLowerCase().includes(skillsSearch.toLowerCase()) || 
                              s.level.toLowerCase().includes(skillsSearch.toLowerCase());
        return matchesCategory && matchesSearch;
    });

    const getBulbStatusText = () => {
        if (lampIntensity === 0) return "OFF / DISCHARGED";
        if (lampIntensity <= 20) return "WARN / UNDERVOLT";
        return "STABLE / NOMINAL";
    };

    return (
        <div className="absolute inset-0 z-50 flex flex-col lg:flex-row overflow-y-auto lg:overflow-hidden pointer-events-none p-2 sm:p-4 lg:p-6 bg-black/70 lg:bg-black/40 backdrop-blur-md lg:backdrop-blur-[5px] scrollbar-thin">
            
            {/* Ambient background glows */}
            <div className="absolute -top-32 -left-32 w-[500px] h-[500px] bg-yellow-500/10 rounded-full blur-[160px] pointer-events-none animate-pulse" />
            <div className="absolute -bottom-32 -right-32 w-[600px] h-[600px] bg-purple-500/10 rounded-full blur-[180px] pointer-events-none animate-pulse" />

            {/* Notification Toast */}
            <AnimatePresence>
                {toastMessage && (
                    <motion.div
                        initial={{ opacity: 0, y: -20, scale: 0.9 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -20, scale: 0.9 }}
                        className="absolute top-6 left-1/2 -translate-x-1/2 z-[200] px-4.5 py-2.5 rounded-2xl bg-zinc-900/95 border border-yellow-400/40 text-yellow-300 font-mono text-[9.5px] font-bold shadow-[0_10px_35px_rgba(251,191,36,0.25)] flex items-center gap-2 backdrop-blur-md pointer-events-auto"
                    >
                        <CheckCircle2 size={13} className="text-yellow-400" />
                        <span>{toastMessage}</span>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Interactive Executive Resume Modal */}
            <AnimatePresence>
                {isResumeOpen && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setIsResumeOpen(false)}
                        className="absolute inset-0 z-[170] bg-black/90 backdrop-blur-2xl flex items-center justify-center p-2 sm:p-4 md:p-8 pointer-events-auto overflow-y-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.92, y: 25 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.92, y: 25 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-4xl max-h-[92vh] bg-gradient-to-b from-zinc-950 via-zinc-900 to-black border border-yellow-400/40 rounded-2xl sm:rounded-3xl p-4 sm:p-6 md:p-8 shadow-[0_25px_90px_rgba(251,191,36,0.2)] relative flex flex-col justify-between overflow-y-auto scrollbar-thin select-text text-zinc-200 font-sans"
                        >
                            <button
                                onClick={() => setIsResumeOpen(false)}
                                className="absolute top-6 right-6 w-9 h-9 rounded-full bg-white/10 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors z-20"
                            >
                                <X size={16} />
                            </button>

                            {/* Resume Header */}
                            <div className="border-b border-white/15 pb-6">
                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                    <div>
                                        <h1 className="text-3xl font-black text-white tracking-tight">S. VARUN VAIBHAV</h1>
                                        <p className="text-xs font-bold font-mono text-yellow-400 uppercase tracking-widest mt-1">
                                            3rd-Year B.Tech CSE (AI & Data Analytics) · SRIHER Chennai · The Flight Tech Labs
                                        </p>
                                        <p className="text-xs text-zinc-400 mt-1 font-medium">
                                            Targeting MS in Computer Science / Data Science @ Arizona State University (Fall 2029)
                                        </p>
                                    </div>
                                    <div className="flex flex-col gap-1 text-[11px] font-mono text-zinc-300">
                                        <div className="flex items-center gap-2">
                                            <Mail size={12} className="text-emerald-400" />
                                            <a href="mailto:Umasubramanian81@gmail.com" className="hover:text-yellow-400 transition-colors">Umasubramanian81@gmail.com</a>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Phone size={12} className="text-yellow-400" />
                                            <span>+91 9384000748</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <MapPin size={12} className="text-red-400" />
                                            <span>Chennai, India</span>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex flex-wrap gap-2.5 mt-4 pt-3 border-t border-white/10 font-mono text-[9px]">
                                    <a href="https://github.com/theflighttechofficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-yellow-400 text-zinc-300 hover:text-white">
                                        <GithubIcon size={12} className="text-yellow-400" /> github.com/theflighttechofficial (10+ Repos)
                                    </a>
                                    <a href="https://linkedin.com/in/varun-vaibhav-s-11b69a2ba" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-blue-400 text-zinc-300 hover:text-white">
                                        <LinkedinIcon size={12} className="text-blue-400" /> LinkedIn (119+ followers)
                                    </a>
                                    <a href="https://kaggle.com/theflighttechofficial" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-sky-400 text-zinc-300 hover:text-white">
                                        <KaggleIcon size={12} className="text-sky-400" /> Kaggle (3 Notebooks)
                                    </a>
                                    <a href="https://theflighttechlabs.hashnode.dev" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-purple-400 text-zinc-300 hover:text-white">
                                        <HashnodeIcon size={12} className="text-purple-400" /> Hashnode Blog
                                    </a>
                                    <a href="https://www.instagram.com/varunwashere__/" target="_blank" rel="noopener noreferrer" className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 border border-white/10 hover:border-pink-400 text-zinc-300 hover:text-white">
                                        <InstagramIcon size={12} className="text-pink-400" /> Instagram (@varunwashere__)
                                    </a>
                                    <button
                                        onClick={() => {
                                            AudioEngine.playHoloProject();
                                            window.dispatchEvent(new CustomEvent("lumisphere_open_lumi_ai"));
                                        }}
                                        className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-cyan-500/20 border border-cyan-400/50 hover:bg-cyan-500/30 text-cyan-300 font-bold transition shadow-[0_0_15px_rgba(34,211,238,0.3)] cursor-pointer"
                                    >
                                        <Brain size={13} className="text-cyan-400 animate-pulse" />
                                        <span>🤖 Ask Lumi AI Assistant</span>
                                    </button>
                                </div>
                            </div>

                            {/* Resume View Mode Toggle */}
                            <div className="my-4 flex items-center justify-between p-3 rounded-2xl bg-neutral-900 border border-amber-500/30">
                                <div className="flex items-center gap-2 font-mono text-xs text-amber-300 font-bold">
                                    <Sparkles className="w-4 h-4 text-amber-400" />
                                    <span>EXHIBITION MODE: {showVirtualRoom ? "VIRTUAL RESUME ROOM" : "CLASSIC DOCUMENT VIEW"}</span>
                                </div>

                                <button
                                    onClick={() => {
                                        AudioEngine.playUISelect();
                                        setShowVirtualRoom(!showVirtualRoom);
                                    }}
                                    className="px-4 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-mono font-bold text-xs shadow-md transition"
                                >
                                    Switch to {showVirtualRoom ? "Classic Document View" : "🏛️ Virtual Resume Room"}
                                </button>
                            </div>

                            {/* Resume Content Body */}
                            {showVirtualRoom ? (
                                <ResumeRoom />
                            ) : (
                            <div className="space-y-6 py-6">
                                {/* Summary */}
                                <div>
                                    <h3 className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest border-b border-white/10 pb-1 mb-2 flex items-center gap-2">
                                        <User size={13} /> Professional Summary
                                    </h3>
                                    <p className="text-xs text-zinc-300 leading-relaxed">
                                        I build production-grade data systems and AI tools. Currently learning ML, Data Engineering, and Full Stack Development while shipping actual products. Targeting MS in Data Science at Arizona State University (2029).
                                    </p>
                                </div>

                                {/* Experience */}
                                <div>
                                    <h3 className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest border-b border-white/10 pb-1 mb-3 flex items-center gap-2">
                                        <Briefcase size={13} /> Professional Experience
                                    </h3>
                                    
                                    <div className="space-y-4">
                                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                                                <div>
                                                    <h4 className="text-sm font-bold text-white uppercase">Data Analyst Intern — L&T Construction</h4>
                                                    <p className="text-xs text-yellow-400 font-semibold">May 2026 – Jul 2026 | Chennai, India</p>
                                                </div>
                                                <span className="text-[9px] font-mono bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 px-2 py-0.5 rounded self-start sm:self-center font-bold">PRODUCTION TOOLS</span>
                                            </div>
                                            <ul className="space-y-1.5 text-xs text-zinc-300">
                                                <li className="flex gap-2">
                                                    <span className="text-yellow-400 font-bold">•</span>
                                                    <span><strong>PDF-to-Excel Spec Extractor (Production Tool):</strong> Engineered a Hybrid RAG pipeline combining FAISS dense vector search, BM25 keyword matching, and Reciprocal Rank Fusion (RRF). Automated 1,200+ pages per run (reducing turnaround from 3-4 days to minutes) at 65-70% accuracy. First-of-its-kind tool in L&T Analytics Division.</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="text-yellow-400 font-bold">•</span>
                                                    <span><strong>Token Optimization:</strong> Reduced API token costs from $22 to $2 per document run (90%+ cost optimization) using rule-based skipping and sentence embeddings.</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="text-yellow-400 font-bold">•</span>
                                                    <span><strong>OCR-Based SLD Data Extractor (Production Tool):</strong> Built a custom Tesseract OCR pipeline for processing AutoCAD electrical single-line diagrams (SLDs) with zero embedded text layer. Deployed and actively used.</span>
                                                </li>
                                                <li className="flex gap-2 text-zinc-400 font-mono text-[10px] pt-1">
                                                    <span>📄 Credentials: Signed LOR from Naveen Raj (Sr. Data Scientist, NAVEEN-RAJ-B@LNTECC.COM) & Official Experience Letter.</span>
                                                </li>
                                            </ul>
                                        </div>

                                        <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4">
                                            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 mb-2">
                                                <div>
                                                    <h4 className="text-sm font-bold text-white uppercase">Web Developer Intern — Neoshaan Technologies</h4>
                                                    <p className="text-xs text-yellow-400 font-semibold">May 2025 – Jul 2025</p>
                                                </div>
                                                <span className="text-[9px] font-mono bg-white/10 text-zinc-300 px-2 py-0.5 rounded self-start sm:self-center">CLIENT DEV</span>
                                            </div>
                                            <ul className="space-y-1.5 text-xs text-zinc-300">
                                                <li className="flex gap-2">
                                                    <span className="text-yellow-400 font-bold">•</span>
                                                    <span>Built 3 client websites in React.js + Tailwind CSS, improving mobile responsiveness and Lighthouse scores.</span>
                                                </li>
                                                <li className="flex gap-2">
                                                    <span className="text-yellow-400 font-bold">•</span>
                                                    <span>Engineered Node.js / Nodemailer lead capture backend APIs for conversion tracking. Audited and resolved 20+ UX navigation defects.</span>
                                                </li>
                                            </ul>
                                        </div>
                                    </div>
                                </div>

                                {/* Education */}
                                <div>
                                    <h3 className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest border-b border-white/10 pb-1 mb-3 flex items-center gap-2">
                                        <GraduationCap size={13} /> Education & Academic Credentials
                                    </h3>
                                    <div className="bg-white/[0.02] border border-white/10 rounded-2xl p-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-3">
                                        <div>
                                            <h4 className="text-sm font-bold text-white uppercase">B.Tech — CSE (AI & Data Analytics)</h4>
                                            <p className="text-xs text-yellow-400 font-semibold">SRIHER, Chennai | Expected Graduation: May 2028</p>
                                            <p className="text-xs text-zinc-300 mt-1">
                                                <strong>Lab Excellence:</strong> O Grades in Data Analytics, ML, DBMS, Advanced C++, & Linux.
                                            </p>
                                            <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                                                Upward CGPA trajectory (6.86 → 7.68 → 7.7/10). All Sem 2 arrears cleared in Sem 3 (No standing impact).
                                            </p>
                                        </div>
                                        <div className="px-3 py-2 rounded-xl bg-yellow-400/10 border border-yellow-400/30 text-center font-mono self-stretch md:self-auto flex flex-col justify-center">
                                            <span className="text-[9px] text-zinc-400 uppercase">CGPA</span>
                                            <span className="text-xl font-black text-yellow-400">7.7 / 10</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Certifications */}
                                <div>
                                    <h3 className="text-xs font-mono font-bold text-yellow-400 uppercase tracking-widest border-b border-white/10 pb-1 mb-3 flex items-center gap-2">
                                        <Award size={13} /> 10+ Verified Certifications & Badges
                                    </h3>
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                                        <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                                            <div className="flex justify-between items-center text-xs font-bold text-white">
                                                <span>Stanford ML Specialization (3 Courses)</span>
                                                <span className="text-[8px] font-mono text-yellow-300 bg-yellow-500/10 px-1.5 py-0.5 rounded">ANDREW NG</span>
                                            </div>
                                            <p className="text-[10px] text-zinc-400 mt-1">Supervised ML, Advanced Learning Algorithms, Unsupervised Learning (Jul 20, 2026).</p>
                                        </div>
                                        <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                                            <div className="flex justify-between items-center text-xs font-bold text-white">
                                                <span>Google Prompting Essentials (4 Courses)</span>
                                                <span className="text-[8px] font-mono text-emerald-300 bg-emerald-500/10 px-1.5 py-0.5 rounded">GOOGLE</span>
                                            </div>
                                            <p className="text-[10px] text-zinc-400 mt-1">Signed by Amanda Brophy, Google (Jul 5, 2026).</p>
                                        </div>
                                        <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                                            <div className="flex justify-between items-center text-xs font-bold text-white">
                                                <span>HackerRank Python & SQL Gold Badges</span>
                                                <span className="text-[8px] font-mono text-amber-300 bg-amber-500/10 px-1.5 py-0.5 rounded">5 STARS</span>
                                            </div>
                                            <p className="text-[10px] text-zinc-400 mt-1">Python Gold (Jul 8), SQL Gold (Jul 18), SQL Intermediate Cert (Jul 22).</p>
                                        </div>
                                        <div className="p-3 bg-white/[0.02] border border-white/10 rounded-xl">
                                            <div className="flex justify-between items-center text-xs font-bold text-white">
                                                <span>Google Data Analytics Professional</span>
                                                <span className="text-[8px] font-mono text-sky-300 bg-sky-500/10 px-1.5 py-0.5 rounded">IN PROGRESS</span>
                                            </div>
                                            <p className="text-[10px] text-zinc-400 mt-1">Target Completion: Oct 2026. IBM Python 101, Microsoft ML Models, IBM Z Day AI.</p>
                                        </div>
                                    </div>
                                </div>

                                {/* Holographic Skills Neural Network */}
                                <HolographicSkillsNetwork />
                            </div>
                            )}

                            {/* Resume Footer Controls */}
                            <div className="border-t border-white/15 pt-4 flex items-center justify-between font-mono text-xs">
                                <span className="text-[10px] text-zinc-500">S. Varun Vaibhav — Complete Executive CV</span>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => {
                                            AudioEngine.playUISelect();
                                            window.print();
                                        }}
                                        className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-bold flex items-center gap-1.5 transition-colors cursor-pointer text-xs"
                                    >
                                        <Download size={13} />
                                        <span>Print / PDF</span>
                                    </button>
                                    <button
                                        onClick={() => {
                                            AudioEngine.playUISelect();
                                            navigator.clipboard.writeText(`S. VARUN VAIBHAV
Status: 3rd-year B.Tech (AI & Data Analytics) | SRIHER Chennai
Contact: Umasubramanian81@gmail.com | +91 9384000748 | Chennai, India
Target: MS in Data Science at Arizona State University (2029)

EXPERIENCE:
- Data Analyst Intern at L&T Construction (May-Jul 2026): Hybrid RAG (FAISS+BM25+RRF) Spec Extractor, 1200+ pgs, $22->$2 cost opt, OCR SLD Extractor. LOR: Naveen Raj (NAVEEN-RAJ-B@LNTECC.COM).
- Web Developer at Neoshaan Technologies (May-Jul 2025): React + Tailwind, Node.js/Nodemailer backend.

EDUCATION: B.Tech CSE (AI & Data Analytics) SRIHER Chennai (2028), CGPA 7.7/10.

CERTIFICATIONS: Stanford Machine Learning Specialization (Andrew Ng), Google Prompting Essentials, HackerRank Python & SQL 5-Star Gold Badges.

PROJECTS: Road-AI (YOLOv8 + Depth), L&T Hybrid RAG, OCR SLD Extractor, AgriYield AI, LumiSphere (Vercel), HomeFinder, Titanic ML, ROGII Wellbore, Invisibility Cloak, Smart File Organiser.

GITHUB: github.com/theflighttechofficial`);
                                            triggerToast("Full plain-text resume copied to clipboard!");
                                        }}
                                        className="px-4 py-2 rounded-xl bg-yellow-400 text-zinc-950 font-bold flex items-center gap-1.5 hover:bg-yellow-300 transition-colors cursor-pointer text-xs"
                                    >
                                        <Copy size={13} />
                                        <span>Copy Full Text</span>
                                    </button>
                                </div>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Interactive Code Inspector Modal */}
            <AnimatePresence>
                {selectedSnippet && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedSnippet(null)}
                        className="absolute inset-0 z-[160] bg-black/85 backdrop-blur-xl flex items-center justify-center p-6 pointer-events-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-2xl bg-zinc-950 border border-yellow-400/40 rounded-3xl p-6 shadow-[0_20px_70px_rgba(251,191,36,0.15)] relative space-y-4 font-mono"
                        >
                            <button
                                onClick={() => setSelectedSnippet(null)}
                                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                            >
                                <X size={14} />
                            </button>

                            <div className="flex items-center justify-between border-b border-white/10 pb-3">
                                <div className="flex items-center gap-2">
                                    <Code2 className="text-yellow-400" size={18} />
                                    <h3 className="text-sm font-bold text-white">{selectedSnippet.title}</h3>
                                </div>
                                <span className="text-[8px] font-bold text-yellow-300 bg-yellow-500/10 border border-yellow-500/20 px-2 py-0.5 rounded-full uppercase">
                                    {selectedSnippet.lang}
                                </span>
                            </div>

                            <div className="p-4 bg-black/80 border border-white/10 rounded-2xl overflow-x-auto text-[10px] text-zinc-300 leading-relaxed max-h-[360px] scrollbar-thin select-text">
                                <pre><code>{selectedSnippet.code}</code></pre>
                            </div>

                            <div className="flex items-center justify-between pt-2">
                                <span className="text-[8.5px] text-zinc-500">Live production code algorithm snippet</span>
                                <button
                                    onClick={() => handleCopySnippet(selectedSnippet.code)}
                                    className="px-4 py-2 rounded-xl bg-yellow-400 text-zinc-950 font-bold text-xs flex items-center gap-2 hover:bg-yellow-300 transition-colors cursor-pointer"
                                >
                                    <Copy size={13} />
                                    <span>Copy Snippet</span>
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Interactive Project Details Modal */}
            <AnimatePresence>
                {selectedProject && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={() => setSelectedProject(null)}
                        className="absolute inset-0 z-[150] bg-black/85 backdrop-blur-xl flex items-center justify-center p-6 pointer-events-auto"
                    >
                        <motion.div
                            initial={{ scale: 0.9, y: 20 }}
                            animate={{ scale: 1, y: 0 }}
                            exit={{ scale: 0.9, y: 20 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-xl bg-gradient-to-b from-zinc-900 to-zinc-950 border border-yellow-400/40 rounded-3xl p-6 shadow-[0_20px_70px_rgba(251,191,36,0.15)] relative space-y-4"
                        >
                            <button
                                onClick={() => setSelectedProject(null)}
                                className="absolute top-5 right-5 w-8 h-8 rounded-full bg-white/10 border border-white/10 text-zinc-400 hover:text-white flex items-center justify-center cursor-pointer transition-colors"
                            >
                                <X size={14} />
                            </button>

                            <div className="flex items-center gap-2">
                                <span className="px-2.5 py-0.5 rounded-full border border-yellow-500/40 bg-yellow-500/10 text-yellow-300 font-mono text-[8px] font-bold uppercase tracking-wider">
                                    {selectedProject.category}
                                </span>
                                <h3 className="text-xl font-black text-white">{selectedProject.title}</h3>
                            </div>

                            <p className="text-xs text-zinc-300 leading-relaxed font-medium">
                                {selectedProject.fullDesc || selectedProject.desc}
                            </p>

                            <div className="p-3 bg-yellow-500/5 border border-yellow-500/20 rounded-xl font-mono text-[9px] text-yellow-300 space-y-1">
                                <div className="text-[7.5px] uppercase tracking-widest text-yellow-400/80 font-bold">Key Performance Specs & Impact</div>
                                <div>{selectedProject.metrics}</div>
                            </div>

                            <div className="flex flex-wrap gap-1.5 pt-1">
                                {selectedProject.tags.map((tag, tIdx) => (
                                    <span key={tIdx} className="text-[8px] font-bold text-zinc-300 bg-white/5 border border-white/10 rounded-md px-2 py-0.5 uppercase tracking-wider font-mono">
                                        {tag}
                                    </span>
                                ))}
                            </div>

                            <div className="flex items-center justify-between pt-3 border-t border-white/10">
                                {selectedProject.snippetKey && codeSnippets[selectedProject.snippetKey] ? (
                                    <button
                                        onClick={() => {
                                            const snip = codeSnippets[selectedProject.snippetKey];
                                            setSelectedProject(null);
                                            setSelectedSnippet(snip);
                                        }}
                                        className="px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-white font-mono text-[10px] font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                                    >
                                        <Code2 size={12} className="text-yellow-400" />
                                        <span>Inspect Code</span>
                                    </button>
                                ) : <div />}

                                <a
                                    href={selectedProject.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    onClick={() => AudioEngine.playUISelect()}
                                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-yellow-400 to-amber-400 text-zinc-950 text-xs font-bold flex items-center gap-2 hover:brightness-110 transition-all cursor-pointer shadow-lg shadow-yellow-400/20"
                                >
                                    <GithubIcon size={14} />
                                    <span>GitHub Repository</span>
                                    <ExternalLink size={12} />
                                </a>
                            </div>
                        </motion.div>
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
                    w-full
                    lg:w-[38%]
                    min-h-fit
                    lg:h-full
                    mr-0
                    lg:mr-3
                    mb-4
                    lg:mb-0
                    rounded-[24px]
                    lg:rounded-[30px]
                    border
                    border-white/15
                    bg-gradient-to-b
                    from-zinc-950/80
                    via-zinc-900/60
                    to-zinc-950/90
                    backdrop-blur-2xl
                    p-4
                    sm:p-7
                    pb-6
                    sm:pb-9
                    flex
                    flex-col
                    justify-between
                    pointer-events-auto
                    select-none
                    relative
                    shadow-2xl
                "
            >
                <NoiseLayer />

                {/* Brand Logo & Ambiance Theme Switcher Header */}
                <div className="flex items-center justify-between relative z-10 mb-1">
                    <div className="flex items-center gap-2">
                        <span className="text-[10px] font-black tracking-[0.4em] text-yellow-400 uppercase">LUMISPHERE OS</span>
                        <span className="w-1.5 h-1.5 rounded-full bg-yellow-400 shadow-[0_0_10px_#facc15] animate-pulse" />
                    </div>

                    {/* Interactive Palette Picker */}
                    <div className="flex items-center gap-1 bg-black/60 border border-white/10 p-1 rounded-lg backdrop-blur-md">
                        <Palette size={10} className="text-zinc-400 ml-1" />
                        {Object.keys(themePalettes).map(tKey => (
                            <button
                                key={tKey}
                                onClick={() => {
                                    AudioEngine.playUISelect();
                                    setCurrentTheme(tKey);
                                    triggerToast(`Theme palette switched to ${tKey.toUpperCase()}`);
                                }}
                                className={`w-3.5 h-3.5 rounded-full cursor-pointer transition-transform ${currentTheme === tKey ? 'scale-125 ring-2 ring-white' : 'opacity-70 hover:opacity-100'}`}
                                style={{ backgroundColor: themePalettes[tKey].points }}
                                title={`Switch to ${tKey} theme`}
                            />
                        ))}
                    </div>
                </div>

                {/* 3D Hologram Visualizer Display */}
                <div className="relative z-10">
                    <HologramCanvas 
                        activeTab={activeTab} 
                        speed={hologramSpeed} 
                        shapeOverride={shapeOverride}
                        onSelectShape={(shape) => setShapeOverride(shape)}
                        theme={currentTheme}
                    />
                </div>

                {/* Emitter Settings Panel */}
                <div className="space-y-3.5 relative z-10 border border-white/10 bg-black/40 p-4 rounded-2xl backdrop-blur-md shadow-inner">
                    <div className="space-y-2">
                        <div className="flex justify-between items-center">
                            <span className="text-[9px] font-bold text-zinc-300 uppercase tracking-widest flex items-center gap-1.5">
                                <Zap size={11} className="text-yellow-400" />
                                HALOGEN CALIBRATION
                            </span>
                            <span className="font-mono text-xs font-black text-yellow-300">{lampIntensity}%</span>
                        </div>
                        <input 
                            type="range" min="0" max="100" value={lampIntensity}
                            onChange={(e) => {
                                setLampIntensity(Number(e.target.value));
                                if (Number(e.target.value) % 5 === 0) AudioEngine.playUIHover();
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

                    <div className="flex items-center justify-between pt-2 border-t border-white/5">
                        <span className="text-[9px] font-bold text-zinc-400 uppercase tracking-wider flex items-center gap-1">
                            <RefreshCw size={10} className="animate-[spin_8s_linear_infinite] text-yellow-400" />
                            ROTOR FREQ:
                        </span>
                        <div className="flex gap-1.5">
                            {[ { label: "SLOW", val: 0.05 }, { label: "NORM", val: 0.25 }, { label: "HYPER", val: 0.75 } ].map(opt => (
                                <button
                                    key={opt.label}
                                    onClick={() => { AudioEngine.playUISelect(); setHologramSpeed(opt.val); }}
                                    className={`px-2 py-0.5 rounded text-[8px] font-mono font-bold cursor-pointer transition-colors ${hologramSpeed === opt.val ? 'bg-yellow-400 text-zinc-950' : 'bg-white/5 text-zinc-400'}`}
                                >
                                    {opt.label}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* System Diagnostics */}
                <div className="relative z-10 border border-white/10 bg-zinc-950/60 rounded-2xl p-4 backdrop-blur-md mt-2">
                    <div className="text-zinc-400 font-bold font-mono text-[9px] tracking-widest flex items-center justify-between mb-2">
                        <span className="flex items-center gap-1.5">
                            <span className={`w-1.5 h-1.5 rounded-full ${lampIntensity > 0 ? "bg-emerald-400 animate-ping shadow-[0_0_8px_#34d399]" : "bg-red-400 animate-pulse"}`} />
                            RIG DIAGNOSTICS:
                        </span>
                        <span className={`text-[8px] px-1.5 py-0.5 rounded border border-white/10 bg-white/5 font-bold ${lampIntensity === 0 ? "text-red-400" : lampIntensity <= 20 ? "text-yellow-400 animate-pulse" : "text-emerald-400"}`}>
                            {getBulbStatusText()}
                        </span>
                    </div>
                    <LiveSystemDiagnosticLog intensity={lampIntensity} />
                </div>
            </motion.div>

            {/* Right Command Center Panel */}
            <motion.div
                initial={{ x: "100%", opacity: 0.95 }}
                animate={{ x: 0, opacity: isLightOn ? 1 : 0.08, pointerEvents: isLightOn ? "auto" : "none" }}
                exit={{ x: "100%", opacity: 0.95 }}
                transition={{ type: "spring", stiffness: 85, damping: 17 }}
                className="
                    w-full
                    lg:flex-1
                    min-h-fit
                    lg:h-full
                    ml-0
                    lg:ml-3
                    rounded-[24px]
                    lg:rounded-[30px]
                    border
                    border-white/15
                    bg-gradient-to-b
                    from-zinc-950/85
                    via-zinc-900/70
                    to-zinc-950/90
                    backdrop-blur-3xl
                    p-4
                    sm:p-6
                    lg:p-8
                    pb-6
                    lg:pb-9
                    flex
                    flex-col
                    overflow-hidden
                    pointer-events-auto
                    shadow-2xl
                    relative
                "
            >
                <NoiseLayer />

                {/* Navigation Header */}
                <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between mb-4 sm:mb-5 gap-3">
                    <button
                        onClick={handleSignOut}
                        onMouseEnter={() => AudioEngine.playUIHover()}
                        className="flex items-center gap-2 text-xs font-bold tracking-[0.15em] sm:tracking-[0.2em] text-zinc-400 hover:text-white uppercase transition-colors cursor-pointer"
                    >
                        <ArrowLeft size={14} className="text-yellow-400" />
                        Disconnect RIG
                    </button>
                    
                    <div className="w-full sm:w-auto flex gap-1 bg-black/40 border border-white/10 rounded-2xl p-1 backdrop-blur-md shadow-lg overflow-x-auto scrollbar-none max-w-full">
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
                                className={`relative flex items-center gap-1.5 px-2.5 sm:px-3.5 py-1.5 rounded-xl text-[8px] sm:text-[9px] font-bold uppercase tracking-wider transition-colors duration-300 relative z-10 cursor-pointer whitespace-nowrap ${activeTab === tab.id ? "text-zinc-950" : "text-zinc-400 hover:text-white"}`}
                            >
                                <tab.icon size={11} />
                                <span>{tab.label}</span>
                                {activeTab === tab.id && (
                                    <motion.div
                                        layoutId="activeTabPill"
                                        className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-amber-400 rounded-xl -z-10 shadow-lg shadow-yellow-400/30"
                                        transition={{ type: "spring", stiffness: 380, damping: 30 }}
                                    />
                                )}
                            </button>
                        ))}
                    </div>
                </div>

                {/* Main Profile Info Section */}
                <div className="relative z-10 flex-1 flex flex-col min-h-0">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-5 mb-4 sm:mb-5 border-b border-white/10 pb-4">
                        <motion.div
                            whileHover={{ scale: 1.05, rotate: 3 }}
                            className="relative w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-zinc-800 via-zinc-900 to-black flex items-center justify-center border border-yellow-400/40 shadow-[0_0_25px_rgba(251,191,36,0.25)] flex-shrink-0 cursor-pointer"
                            onClick={() => setIsResumeOpen(true)}
                            title="Click to open Executive CV"
                        >
                            <svg width="34" height="34" viewBox="0 0 40 40" fill="none" className="text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.8)]">
                                <circle cx="20" cy="20" r="16" stroke="currentColor" strokeWidth="1.5" strokeDasharray="3 3" className="animate-[spin_40s_linear_infinite]" />
                                <circle cx="20" cy="20" r="10" stroke="currentColor" strokeWidth="1" />
                                <path d="M20 4V36M4 20H36" stroke="currentColor" strokeWidth="0.8" opacity="0.4" />
                                <circle cx="20" cy="10" r="2.5" fill="#ffffff" />
                                <circle cx="20" cy="30" r="2.5" fill="#fef08a" />
                                <circle cx="10" cy="20" r="2.5" fill="#a1a1aa" />
                                <circle cx="30" cy="20" r="2.5" fill="#fbbf24" />
                            </svg>
                            <span className="absolute -bottom-1 -right-1 w-4.5 h-4.5 rounded-full bg-emerald-400 border-4 border-zinc-950 flex items-center justify-center shadow-lg animate-pulse" />
                        </motion.div>

                        <div>
                            <div className="flex items-center gap-2 flex-wrap">
                                <h2 className="text-xl font-black tracking-tight text-white">S. Varun Vaibhav</h2>
                                <span className="px-2 py-0.5 border border-yellow-400/30 bg-yellow-400/10 text-[7px] font-bold text-yellow-300 rounded-full font-mono uppercase tracking-widest flex items-center gap-1 shadow-sm">
                                    <Shield size={8} /> AI & DATA SYSTEMS ENGINEER
                                </span>
                                {viewerName && (
                                    <span className="px-2 py-0.5 border border-zinc-700 bg-zinc-800/60 text-[7px] font-bold text-zinc-300 rounded-full font-mono uppercase tracking-widest">
                                        Viewer: {viewerName} ({college})
                                    </span>
                                )}
                            </div>
                            <p className="text-[9.5px] text-yellow-300 font-bold uppercase tracking-[0.2em] mt-0.5 flex items-center gap-1.5">
                                <GraduationCap size={12} className="text-yellow-400" />
                                3rd-Year B.Tech CSE (AI & Data Analytics) · SRIHER Chennai
                            </p>
                            <p className="text-[11px] text-zinc-300 font-medium mt-1 leading-relaxed max-w-xl">
                                Building production-grade data systems & AI tools. Currently learning ML, Data Engineering, and Full Stack Development while shipping actual products. Targeting MS in Data Science at Arizona State University (2029).
                            </p>
                        </div>
                    </div>

                    {/* Tab Panels */}
                    <div className="flex-1 min-h-0 flex flex-col">
                        <div className="flex-1 min-h-0 flex flex-col">
                        <AnimatePresence mode="wait">
                            
                            {/* Panel 1: Dashboard (CLI Terminal & Pillars) */}
                            {activeTab === "dashboard" && (
                                <motion.div key="dashboard-tab" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }} className="grid grid-cols-1 lg:grid-cols-12 gap-4 h-auto lg:h-full">
                                    <div className="col-span-1 lg:col-span-7 flex flex-col h-[340px] sm:h-[450px] border border-white/10 bg-zinc-950/70 rounded-2xl overflow-hidden backdrop-blur-md shadow-2xl">
                                        <div className="flex items-center justify-between px-4 py-2 bg-white/[0.03] border-b border-white/5 font-mono text-[8px] text-zinc-400 uppercase tracking-widest">
                                            <div className="flex items-center gap-1.5">
                                                <span className="w-1.5 h-1.5 rounded-full bg-red-500/80" />
                                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-500/80" />
                                                <span className="w-1.5 h-1.5 rounded-full bg-green-500/80" />
                                                <span className="ml-1 text-zinc-300 font-bold">Interactive CLI Shell</span>
                                            </div>
                                            <span>SH-5.0</span>
                                        </div>
                                        <div className="flex-1 p-3.5 overflow-y-auto font-mono text-[9.5px] space-y-1.5 scrollbar-thin select-text">
                                            {history.map((line, idx) => (
                                                <div key={idx} className={line.type === "system" ? "text-yellow-400 font-bold" : line.type === "input" ? "text-white" : line.type === "error" ? "text-red-400" : "text-zinc-400"} style={{ whiteSpace: "pre-wrap" }}>
                                                    {line.text}
                                                </div>
                                            ))}
                                            <div ref={terminalEndRef} />
                                        </div>

                                        {/* Interactive Quick Command Chips */}
                                        <div className="px-3 py-1.5 bg-black/40 border-t border-white/5 flex flex-wrap gap-1 items-center font-mono text-[7.5px]">
                                            <span className="text-zinc-500 font-bold uppercase mr-1">CHIPS:</span>
                                            {["/help", "/profile", "/exp", "/certs", "/goals", "/code", "/quiz", "/clear"].map(chip => (
                                                <button
                                                    key={chip} type="button" onClick={() => executeCommand(chip)}
                                                    className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 hover:bg-yellow-400 hover:text-zinc-950 text-zinc-400 transition-colors cursor-pointer font-bold"
                                                >
                                                    {chip}
                                                </button>
                                            ))}
                                        </div>

                                        <form onSubmit={handleCommandSubmit} className="flex border-t border-white/5 bg-black/60">
                                            <span className="pl-3.5 py-2 font-mono text-[10px] text-zinc-400 flex items-center">&gt;</span>
                                            <input 
                                                type="text" value={cmdInput} onChange={(e) => setCmdInput(e.target.value)}
                                                placeholder="Type command (e.g. /profile, /exp, /code, /certs)..."
                                                className="flex-1 bg-transparent border-none outline-none font-mono text-[9.5px] text-white px-2 py-2 placeholder-zinc-700 caret-yellow-400"
                                            />
                                        </form>
                                    </div>

                                    {/* Right: Academic Widget & Targets */}
                                    <div className="col-span-1 lg:col-span-5 flex flex-col justify-between h-auto lg:h-[450px] space-y-3">
                                        <div className="border border-yellow-500/20 bg-gradient-to-b from-yellow-500/5 via-zinc-950/40 to-black/60 rounded-2xl p-4 flex flex-col justify-between flex-1 relative overflow-hidden">
                                            <div className="flex items-center justify-between border-b border-white/5 pb-2">
                                                <h3 className="text-[8.5px] font-black tracking-[0.2em] text-yellow-400 uppercase flex items-center gap-1.5">
                                                    <GraduationCap size={13} className="text-yellow-400" />
                                                    ACADEMIC & TARGET MATRIX
                                                </h3>
                                                <span className="text-[7.5px] font-mono text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2 py-0.5 rounded-full font-bold">
                                                    SRIHER CSE (AI & Data)
                                                </span>
                                            </div>

                                            <div className="my-2 flex items-center justify-between">
                                                <div>
                                                    <div className="text-[8px] font-mono uppercase tracking-widest text-zinc-400 font-bold">CURRENT CGPA</div>
                                                    <div className="text-2xl font-black text-white font-mono flex items-baseline gap-1 mt-0.5">
                                                        <span className="text-yellow-400 drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]">
                                                            <CountUp to={7.7} />
                                                        </span>
                                                        <span className="text-xs text-zinc-500 font-normal">/ 10</span>
                                                    </div>
                                                    <div className="text-[8px] text-emerald-400 font-medium font-mono mt-0.5">Upward: 6.86 → 7.68 → 7.7</div>
                                                </div>
                                                <div className="relative w-11 h-11 flex items-center justify-center bg-zinc-900 border border-yellow-400/30 rounded-2xl shadow-inner">
                                                    <Award size={20} className="text-yellow-400 animate-pulse" />
                                                </div>
                                            </div>

                                            {/* Target Destination Box */}
                                            <div className="p-2 bg-yellow-500/10 border border-yellow-500/30 rounded-xl space-y-1 my-1">
                                                <div className="flex items-center justify-between text-[7.5px] font-mono font-bold text-yellow-300">
                                                    <span className="flex items-center gap-1"><Target size={10} /> TARGET DEGREE (2029)</span>
                                                    <span className="bg-yellow-400 text-zinc-950 px-1 rounded">MS DATA SCIENCE</span>
                                                </div>
                                                <p className="text-[8.5px] font-bold text-white leading-tight">
                                                    Arizona State University (ASU)
                                                </p>
                                                <div className="text-[7.5px] text-zinc-400 font-mono">
                                                    Placement Target: ₹8 – 12 LPA (2028)
                                                </div>
                                            </div>

                                            {/* Technical Focus Pillars */}
                                            <div className="border-t border-white/5 pt-2 space-y-1">
                                                <div className="text-[7.5px] font-mono uppercase tracking-widest text-zinc-400 font-bold">LAB EXCELLENCE (O GRADES)</div>
                                                <div className="grid grid-cols-2 gap-1 text-[7.5px]">
                                                    {["Data Analytics", "Machine Learning", "DBMS", "Advanced C++ & Linux"].map((lab, lI) => (
                                                        <div key={lI} className="p-1 rounded bg-white/5 border border-white/5 flex items-center gap-1">
                                                            <CheckCircle2 size={9} className="text-emerald-400 flex-shrink-0" />
                                                            <span className="font-bold text-zinc-200 line-clamp-1">{lab}</span>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Portfolio Objectives Ring */}
                                        <div className="border border-white/10 bg-black/40 rounded-2xl p-4 flex items-center justify-between">
                                            <div className="space-y-1">
                                                <h4 className="text-[8.5px] font-black tracking-[0.2em] text-zinc-300 uppercase">MILESTONE CHECKLIST</h4>
                                                <p className="text-[10px] text-zinc-400 font-medium font-mono uppercase">{completedTasks} of {totalTasks} Completed</p>
                                            </div>
                                            <div className="relative flex items-center justify-center w-11 h-11 flex-shrink-0">
                                                <svg className="w-full h-full transform -rotate-90">
                                                    <circle cx="22" cy="22" r={18} className="stroke-zinc-800" strokeWidth="2.5" fill="transparent" />
                                                    <motion.circle cx="22" cy="22" r={18} className="stroke-yellow-400" strokeWidth="2.5" fill="transparent" strokeDasharray={2 * Math.PI * 18} animate={{ strokeDashoffset: (2 * Math.PI * 18) - (taskPercent / 100) * (2 * Math.PI * 18) }} transition={{ type: "spring", stiffness: 70, damping: 13 }} />
                                                </svg>
                                                <span className="absolute text-[8px] font-mono font-bold text-yellow-300">{taskPercent.toFixed(0)}%</span>
                                            </div>
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                            {/* Panel: Experience */}
                            {activeTab === "experience" && (
                                <motion.div key="experience-tab" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }} className="space-y-4 h-full overflow-y-auto pr-1 scrollbar-thin">
                                    {[
                                        {
                                            role: "Data Analyst Intern", company: "Larsen & Toubro (L&T Construction)", period: "May 2026 – Jul 2026", location: "Chennai, India",
                                            points: [
                                                "PDF-to-Excel Spec Extractor (Production Tool): Developed a Hybrid RAG system (FAISS dense search + BM25 keyword matching + Reciprocal Rank Fusion) with GPT-4o extractions.",
                                                "Automated 1,200+ pages per run, slashing turnaround time from 3-4 days to minutes at 65-70% extraction accuracy. First-of-its-kind tool in L&T Analytics Division.",
                                                "Token Optimization: Reduced API token costs from $22 to $2 per document run (90%+ cost savings) via rule-based skipping and sentence embeddings.",
                                                "OCR-Based SLD Data Extractor (Production Tool): Engineered a custom Tesseract OCR pipeline for electrical single-line diagrams (SLDs) and AutoCAD PDFs with zero embedded text layer.",
                                                "Production Status: Deployed, validated, and actively used across L&T Construction Analytics Division.",
                                                "Official Credentials: Signed LOR from Naveen Raj (Sr. Data Scientist, NAVEEN-RAJ-B@LNTECC.COM) and official Experience Letter."
                                            ]
                                        },
                                        {
                                            role: "Web Developer Intern", company: "Neoshaan Technologies (OPC) Pvt. Ltd.", period: "May 2025 – Jul 2025", location: "Chennai, India",
                                            points: [
                                                "Built 3 client production websites using React.js and Tailwind CSS with responsive layout architecture.",
                                                "Engineered a Node.js/Nodemailer backend for lead-capture form tracking, replacing manual processes.",
                                                "Audited UX/UI across live client properties, resolving 20+ navigation and layout defects to reduce user drop-off."
                                            ]
                                        }
                                    ].map((job, idx) => (
                                        <div key={idx} className="border border-white/10 bg-gradient-to-r from-white/[0.01] to-white/[0.03] hover:border-yellow-400/30 rounded-xl p-4 transition-all duration-300 space-y-2">
                                            <div className="flex items-center justify-between flex-wrap gap-2">
                                                <div>
                                                    <h4 className="text-[11px] font-bold text-white uppercase tracking-wider">{job.role}</h4>
                                                    <p className="text-[9.5px] text-yellow-400 font-semibold mt-0.5">{job.company}</p>
                                                </div>
                                                <div className="flex items-center gap-2">
                                                    <span className="text-[8px] font-mono text-zinc-400 bg-white/5 border border-white/10 rounded-md px-2 py-0.5">{job.location}</span>
                                                    <span className="text-[8.5px] font-mono text-yellow-300 bg-yellow-500/10 border border-yellow-500/30 rounded-md px-2 py-0.5 font-bold">{job.period}</span>
                                                </div>
                                            </div>
                                            <ul className="space-y-1.5">
                                                {job.points.map((pt, pIdx) => (
                                                    <li key={pIdx} className="flex gap-2 text-[9.5px] text-zinc-300 font-medium leading-relaxed">
                                                        <ChevronRight size={10} className="text-yellow-400 flex-shrink-0 mt-0.5" />
                                                        <span>{pt}</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </motion.div>
                            )}

                            {/* Panel 2: Skills */}
                            {activeTab === "skills" && (
                                <motion.div key="skills-tab" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }} className="flex-1 min-h-0 flex flex-col space-y-4">
                                    <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
                                        <div className="flex gap-1.5 flex-wrap">
                                            {[ { id: "all", label: "All" }, { id: "aiml", label: "AI & ML" }, { id: "data", label: "Data" }, { id: "languages", label: "Languages" }, { id: "webdev", label: "Web Dev" }, { id: "tools", label: "Tools" } ].map(category => (
                                                <button
                                                    key={category.id} onClick={() => { AudioEngine.playUISelect(); setSkillsFilter(category.id); }}
                                                    className={`px-2.5 py-1 rounded-full text-[8px] font-bold tracking-wider uppercase border transition-all cursor-pointer ${skillsFilter === category.id ? "bg-yellow-400 text-zinc-950 border-yellow-400 shadow-md" : "border-white/10 bg-white/[0.02] text-zinc-400 hover:text-white"}`}
                                                >
                                                    {category.label}
                                                </button>
                                            ))}
                                        </div>
                                        <div className="relative flex items-center">
                                            <Search size={12} className="absolute left-2.5 text-zinc-500" />
                                            <input type="text" placeholder="Search skill..." value={skillsSearch} onChange={(e) => setSkillsSearch(e.target.value)} className="w-full sm:w-36 pl-7 pr-2 py-1 rounded-lg bg-black/50 border border-white/10 text-[9px] font-mono text-white outline-none focus:border-yellow-400/50" />
                                        </div>
                                    </div>

                                    <motion.div variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.03 } } }} initial="hidden" animate="visible" className="flex-1 min-h-0 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 overflow-y-auto pr-1 scrollbar-thin content-start">
                                        {filteredSkills.map((skill) => (
                                            <motion.div key={skill.name} variants={{ hidden: { opacity: 0, scale: 0.95, y: 8 }, visible: { opacity: 1, scale: 1, y: 0 } }} whileHover={{ scale: 1.02, y: -1 }} className="p-3 rounded-xl border border-white/10 bg-gradient-to-b from-white/[0.02] to-white/[0.005] backdrop-blur-md flex flex-col justify-between gap-1.5 shadow-sm">
                                                <div className="flex items-center justify-between">
                                                    <span className="text-[10px] font-black text-white">{skill.name}</span>
                                                    <span className="text-[6.5px] font-bold px-1.5 py-0.5 rounded border border-yellow-500/20 bg-yellow-500/10 text-yellow-300 uppercase tracking-wider font-mono">{skill.level}</span>
                                                </div>
                                                <div className="w-full h-[3px] bg-white/5 rounded-full overflow-hidden mt-0.5">
                                                    <motion.div initial={{ width: 0 }} animate={{ width: skill.level === "Expert" ? "95%" : skill.level === "Specialist" ? "85%" : skill.level === "Advanced" ? "75%" : "60%" }} transition={{ duration: 1.0, ease: "easeOut", delay: 0.1 }} className="h-full bg-gradient-to-r from-yellow-400 to-amber-500" />
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* Panel 3: Major Projects */}
                            {activeTab === "projects" && (
                                <motion.div key="projects-tab" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }} className="flex-1 min-h-0 flex flex-col space-y-4">
                                    <motion.div variants={{ hidden: {}, visible: { transition: { staggerChildren: 0.04 } } }} initial="hidden" animate="visible" className="grid grid-cols-1 sm:grid-cols-2 gap-3 overflow-y-auto pr-1 scrollbar-thin">
                                        {projects.map((project, i) => (
                                            <motion.div key={i} onClick={() => { AudioEngine.playUISelect(); setSelectedProject(project); }} variants={{ hidden: { opacity: 0, y: 10, scale: 0.98 }, visible: { opacity: 1, y: 0, scale: 1 } }} whileHover={{ scale: 1.02, y: -2 }} onMouseEnter={() => AudioEngine.playUIHover()} className="block p-4 rounded-xl bg-white/[0.015] border border-white/10 transition-all duration-300 relative group cursor-pointer">
                                                <div className="absolute inset-0 rounded-xl bg-gradient-to-r from-yellow-500 via-amber-400 to-yellow-300 opacity-0 group-hover:opacity-50 blur-[1.5px] -z-10 transition-opacity duration-300 pointer-events-none" style={{ margin: "-1px" }} />
                                                <div className="absolute inset-0 rounded-xl bg-zinc-950 -z-5 pointer-events-none" />

                                                <div className="flex items-center justify-between mb-1 relative z-10">
                                                    <span className="text-[11px] font-black text-white group-hover:text-yellow-300 transition-colors flex items-center gap-1.5">
                                                        {project.category === "aiml" && <Zap size={10} className="text-yellow-400 animate-pulse" />}
                                                        {project.title}
                                                    </span>
                                                    <span className="text-[7px] font-mono text-yellow-400/90 bg-yellow-500/10 border border-yellow-500/20 px-1.5 py-0.5 rounded flex items-center gap-1 group-hover:bg-yellow-400 group-hover:text-zinc-950 transition-colors font-bold">
                                                        <span>VIEW</span>
                                                        <Eye size={10} />
                                                    </span>
                                                </div>
                                                <p className="text-[9.5px] text-zinc-300 font-medium leading-relaxed mb-3.5 relative z-10 line-clamp-2">{project.desc}</p>
                                                <div className="flex flex-wrap gap-1 relative z-10">
                                                    {project.tags.map((tag, tIndex) => (
                                                        <span key={tIndex} className="text-[7.5px] font-bold text-zinc-300 bg-white/5 border border-white/10 rounded px-1.5 py-0.5 uppercase tracking-wider font-mono">{tag}</span>
                                                    ))}
                                                </div>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                </motion.div>
                            )}

                            {/* Panel 4: Certifications & Research Showcase */}
                            {activeTab === "roadmap" && (
                                <motion.div key="roadmap-tab" initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.22 }} className="space-y-4 h-full overflow-y-auto pr-1 scrollbar-thin">
                                    
                                    {/* Research & Presentation Honors */}
                                    <div className="space-y-2">
                                        <h4 className="text-[9px] font-mono font-bold uppercase tracking-widest text-yellow-400 flex items-center gap-1.5">
                                            <Trophy size={12} /> Research & Presentation Honors
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {researchHighlights.map((res, rIdx) => (
                                                <div key={rIdx} className="p-3 rounded-xl border border-yellow-500/20 bg-yellow-500/5 hover:bg-yellow-500/10 transition-all space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-white">{res.title}</span>
                                                        <span className="text-[6.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-yellow-400 text-zinc-950 uppercase">{res.role}</span>
                                                    </div>
                                                    <p className="text-[8.5px] text-zinc-300 leading-tight mt-0.5">{res.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Certifications Grid */}
                                    <div className="space-y-2 pt-2">
                                        <h4 className="text-[9px] font-mono font-bold uppercase tracking-widest text-yellow-400 flex items-center gap-1.5">
                                            <Award size={12} /> Verified Certifications (10+)
                                        </h4>
                                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                            {certifications.map((cert, cIdx) => (
                                                <div key={cIdx} className="p-3 rounded-xl border border-white/10 bg-white/[0.02] hover:bg-white/[0.04] transition-all space-y-1">
                                                    <div className="flex items-center justify-between">
                                                        <span className="text-[10px] font-bold text-white">{cert.title}</span>
                                                        <span className="text-[6.5px] font-mono font-bold px-1.5 py-0.5 rounded bg-yellow-500/10 border border-yellow-500/30 text-yellow-300 uppercase">{cert.badge}</span>
                                                    </div>
                                                    <p className="text-[8.5px] text-yellow-400 font-semibold">{cert.issuer}</p>
                                                    <p className="text-[8px] text-zinc-400 leading-tight">{cert.desc}</p>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Career Timeline */}
                                    <div className="space-y-2 pt-2">
                                        <h4 className="text-[9px] font-mono font-bold uppercase tracking-widest text-yellow-400 flex items-center gap-1.5">
                                            <Compass size={12} /> Academic & Career Pipeline
                                        </h4>
                                        <div className="relative pl-6 space-y-3">
                                            <div className="absolute left-2.5 top-2 bottom-2 w-[1px] bg-zinc-800 overflow-hidden">
                                                <motion.div animate={{ y: ["-100%", "200%"] }} transition={{ repeat: Infinity, duration: 4, ease: "linear" }} className="w-full h-12 bg-gradient-to-b from-transparent via-yellow-400 to-transparent shadow-[0_0_10px_#facc15]" />
                                            </div>

                                            {roadmapSteps.map((step, index) => (
                                                <div key={index} className="relative group">
                                                    <div className={`absolute -left-[22px] top-2.5 w-2.5 h-2.5 rounded-full border border-zinc-950 transition-all z-10 ${step.active ? "bg-yellow-400 shadow-[0_0_10px_#facc15] scale-125" : "bg-zinc-800"}`} />
                                                    <div onClick={() => { AudioEngine.playUISelect(); setExpandedStage(expandedStage === index ? -1 : index); }} className={`border rounded-xl p-3 cursor-pointer ${expandedStage === index ? "border-yellow-500/30 bg-white/[0.02]" : "border-white/5 bg-white/[0.005]"}`}>
                                                        <h4 className="text-[10px] font-bold text-white flex items-center justify-between">
                                                            <span className="flex items-center gap-1.5">{step.title} {step.active && <span className="text-[6.5px] bg-yellow-950 border border-yellow-800 text-yellow-300 font-bold px-1.5 py-0.5 rounded-full uppercase">ACTIVE</span>}</span>
                                                            <ChevronRight size={12} className={`text-zinc-500 transition-transform ${expandedStage === index ? "rotate-90 text-yellow-400" : ""}`} />
                                                        </h4>
                                                        <p className="text-[9.5px] text-zinc-400 font-medium mt-1">{step.desc}</p>
                                                        <AnimatePresence>
                                                            {expandedStage === index && (
                                                                <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.25 }} className="mt-3 space-y-2 border-t border-white/5 pt-3">
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
                                        </div>
                                    </div>
                                </motion.div>
                            )}

                        </AnimatePresence>
                        </div>
                    </div>
                </div>

                {/* Footer Link Docks with Rich Icons */}
                <div className="relative z-10 border-t border-white/10 pt-3 sm:pt-4 mt-auto flex flex-col sm:flex-row items-center justify-between gap-3">
                    <div className="flex gap-1.5 items-center flex-wrap justify-center sm:justify-start w-full sm:w-auto">
                        <motion.a
                            href="https://github.com/theflighttechofficial" target="_blank" rel="noopener noreferrer"
                            whileHover={{ scale: 1.06, y: -2 }} onMouseEnter={() => AudioEngine.playUIHover()} onClick={() => AudioEngine.playUISelect()}
                            title="GitHub Profile & Repositories"
                            className="px-2.5 h-8.5 rounded-xl border border-yellow-500/20 bg-white/[0.03] text-zinc-300 hover:text-white hover:border-yellow-400 hover:bg-yellow-400/10 flex items-center gap-1.5 transition-all cursor-pointer font-mono text-[9px] font-bold shadow-sm"
                        >
                            <GithubIcon size={13} className="text-yellow-400" /> <span>GitHub</span>
                        </motion.a>

                        <motion.a
                            href="https://linkedin.com/in/varun-vaibhav-s-11b69a2ba" target="_blank" rel="noopener noreferrer"
                            whileHover={{ scale: 1.06, y: -2 }} onMouseEnter={() => AudioEngine.playUIHover()} onClick={() => AudioEngine.playUISelect()}
                            title="LinkedIn Professional Profile (119+ Followers)"
                            className="px-2.5 h-8.5 rounded-xl border border-blue-500/20 bg-white/[0.03] text-zinc-300 hover:text-white hover:border-blue-400 hover:bg-blue-500/10 flex items-center gap-1.5 transition-all cursor-pointer font-mono text-[9px] font-bold shadow-sm"
                        >
                            <LinkedinIcon size={13} className="text-blue-400" /> <span>LinkedIn</span>
                        </motion.a>

                        <motion.a
                            href="https://kaggle.com/theflighttechofficial" target="_blank" rel="noopener noreferrer"
                            whileHover={{ scale: 1.06, y: -2 }} onMouseEnter={() => AudioEngine.playUIHover()} onClick={() => AudioEngine.playUISelect()}
                            title="Kaggle Profile (3 Notebooks)"
                            className="px-2.5 h-8.5 rounded-xl border border-sky-500/20 bg-white/[0.03] text-zinc-300 hover:text-white hover:border-sky-400 hover:bg-sky-500/10 flex items-center gap-1.5 transition-all cursor-pointer font-mono text-[9px] font-bold shadow-sm"
                        >
                            <KaggleIcon size={13} className="text-sky-400" /> <span>Kaggle</span>
                        </motion.a>

                        <motion.a
                            href="https://theflighttechlabs.hashnode.dev" target="_blank" rel="noopener noreferrer"
                            whileHover={{ scale: 1.06, y: -2 }} onMouseEnter={() => AudioEngine.playUIHover()} onClick={() => AudioEngine.playUISelect()}
                            title="Hashnode Blog: How I Automated 3-4 Days at L&T"
                            className="px-2.5 h-8.5 rounded-xl border border-purple-500/20 bg-white/[0.03] text-zinc-300 hover:text-white hover:border-purple-400 hover:bg-purple-500/10 flex items-center gap-1.5 transition-all cursor-pointer font-mono text-[9px] font-bold shadow-sm"
                        >
                            <HashnodeIcon size={13} className="text-purple-400" /> <span>Blog</span>
                        </motion.a>

                        <motion.a
                            href="https://www.instagram.com/varunwashere__/" target="_blank" rel="noopener noreferrer"
                            whileHover={{ scale: 1.06, y: -2 }} onMouseEnter={() => AudioEngine.playUIHover()} onClick={() => AudioEngine.playUISelect()}
                            title="Instagram Profile (@varunwashere__)"
                            className="px-2.5 h-8.5 rounded-xl border border-pink-500/20 bg-white/[0.03] text-zinc-300 hover:text-white hover:border-pink-400 hover:bg-pink-500/10 flex items-center gap-1.5 transition-all cursor-pointer font-mono text-[9px] font-bold shadow-sm"
                        >
                            <InstagramIcon size={13} className="text-pink-400" /> <span>Instagram</span>
                        </motion.a>

                        <motion.button
                            onClick={handleCopyEmail} whileHover={{ scale: 1.06, y: -2 }} onMouseEnter={() => AudioEngine.playUIHover()}
                            title="Click to copy email address: Umasubramanian81@gmail.com"
                            className="px-2.5 h-8.5 rounded-xl border border-emerald-500/20 bg-white/[0.03] text-zinc-300 hover:text-white hover:border-emerald-400 hover:bg-emerald-500/10 flex items-center gap-1.5 transition-all cursor-pointer font-mono text-[9px] font-bold shadow-sm"
                        >
                            <Mail size={13} className="text-emerald-400" /> <span>Email</span>
                        </motion.button>

                        <motion.button
                            onClick={handleCopyPhone} whileHover={{ scale: 1.06, y: -2 }} onMouseEnter={() => AudioEngine.playUIHover()}
                            title="Click to copy phone number: +91 9384000748"
                            className="px-2.5 h-8.5 rounded-xl border border-yellow-500/20 bg-white/[0.03] text-zinc-300 hover:text-white hover:border-yellow-400 hover:bg-yellow-500/10 flex items-center gap-1.5 transition-all cursor-pointer font-mono text-[9px] font-bold shadow-sm"
                        >
                            <Phone size={13} className="text-yellow-400" /> <span>Phone</span>
                        </motion.button>

                        <motion.button
                            onClick={() => { AudioEngine.playUISelect(); setIsResumeOpen(true); }} whileHover={{ scale: 1.06, y: -2 }} onMouseEnter={() => AudioEngine.playUIHover()}
                            title="Open Interactive Executive CV / Resume"
                            className="px-2.5 h-8.5 rounded-xl border border-amber-500/20 bg-yellow-400/10 text-yellow-300 hover:text-white hover:border-amber-400 hover:bg-amber-500/20 flex items-center gap-1.5 transition-all cursor-pointer font-mono text-[9px] font-bold shadow-sm"
                        >
                            <FileText size={13} className="text-amber-400" /> <span>Resume</span>
                        </motion.button>
                    </div>

                    <motion.button
                        onClick={handleSignOut} onMouseEnter={() => AudioEngine.playUIHover()} whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 rounded-xl bg-gradient-to-r from-zinc-800 to-zinc-900 hover:from-yellow-400 hover:to-amber-400 hover:text-zinc-950 border border-white/10 text-[8.5px] font-bold tracking-widest text-white cursor-pointer shadow-lg flex items-center gap-1.5 transition-all uppercase w-full sm:w-auto justify-center"
                    >
                        <LogOut size={12} /> <span>Disconnect Rig</span>
                    </motion.button>
                </div>
            </motion.div>
        </div>
    );
}
