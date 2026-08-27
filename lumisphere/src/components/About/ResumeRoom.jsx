import React, { useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
    Award,
    Trophy,
    BookOpen,
    Calendar,
    Briefcase,
    GraduationCap,
    Download,
    Copy,
    Check,
    X,
    ExternalLink,
    Sparkles,
    Search,
    ChevronRight,
    Code2,
    FileText,
    Printer,
    Layers,
    Shield,
    Star
} from "lucide-react";
import { AudioEngine } from "../../utils/AudioEngine";

// Wall Certificates Dataset (8 Verified + 1 In Progress)
const WALL_CERTIFICATES = [
    {
        id: "stanford",
        title: "Stanford Machine Learning Specialization",
        issuer: "Coursera & DeepLearning.AI",
        signatory: "Andrew Ng Signed",
        date: "Jul 20, 2026",
        badgeColor: "from-amber-500/20 to-yellow-600/20 border-amber-400 text-amber-300",
        details: "3-course series covering Supervised Machine Learning (Regression & Classification), Advanced Learning Algorithms (Neural Networks, Decision Trees), and Unsupervised Learning (Clustering, Anomaly Detection, Recommender Systems)."
    },
    {
        id: "google",
        title: "Google Prompting Essentials",
        issuer: "Google",
        signatory: "Amanda Brophy, VP Google",
        date: "Jul 5, 2026",
        badgeColor: "from-emerald-500/20 to-teal-600/20 border-emerald-400 text-emerald-300",
        details: "4-course specialization on prompt engineering frameworks, chain-of-thought prompting, LLM system instruction design, and AI workflow automation."
    },
    {
        id: "cisco",
        title: "Cisco Networking Academy: Packet Tracer",
        issuer: "Cisco Networking Academy",
        signatory: "Cisco Verified",
        date: "Aug 26, 2026",
        badgeColor: "from-sky-500/20 to-blue-600/20 border-sky-400 text-sky-300",
        details: "Foundational network topology configuration, packet routing, and network simulation using Cisco Packet Tracer."
    },
    {
        id: "python_gold",
        title: "HackerRank Python Gold Badge (5 Stars)",
        issuer: "HackerRank",
        signatory: "Verified Gold Skill Badge",
        date: "Jul 8, 2026",
        badgeColor: "from-yellow-500/20 to-amber-600/20 border-yellow-400 text-yellow-300",
        details: "Top percentile score in Python algorithms, data structures, list comprehensions, decorators, generators, and object-oriented programming."
    },
    {
        id: "sql_gold",
        title: "HackerRank SQL Gold Badge (5 Stars)",
        issuer: "HackerRank",
        signatory: "Verified Gold Skill Badge",
        date: "Jul 18, 2026",
        badgeColor: "from-cyan-500/20 to-blue-600/20 border-cyan-400 text-cyan-300",
        details: "Mastered complex relational joins, window functions (ROW_NUMBER, DENSE_RANK), CTEs, subqueries, and database performance tuning."
    },
    {
        id: "google_da",
        title: "Google Data Analytics Professional Certificate",
        issuer: "Google / Coursera",
        signatory: "In Progress (6/9 Courses)",
        date: "Target Oct 2026",
        badgeColor: "from-purple-500/20 to-indigo-600/20 border-purple-400 text-purple-300",
        details: "7-week active streak across 6/9 courses covering data cleaning, SQL query optimization, R programming, and Tableau data visualization."
    },
    {
        id: "ibm_python",
        title: "IBM Python 101 for Data Science",
        issuer: "IBM & Cognitive Class",
        signatory: "IBM Certified",
        date: "May 2026",
        badgeColor: "from-blue-500/20 to-indigo-600/20 border-blue-400 text-blue-300",
        details: "Data analysis fundamentals with Python, pandas DataFrames, NumPy arrays, and HTTP REST API data scraping."
    },
    {
        id: "ms_ml",
        title: "Microsoft ML Models Certification",
        issuer: "Microsoft Learn",
        signatory: "Build 2026 Verified",
        date: "Jun 2026",
        badgeColor: "from-purple-500/20 to-violet-600/20 border-purple-400 text-purple-300",
        details: "Building & deploying automated machine learning models using Azure ML Studio & scikit-learn pipelines."
    }
];

// Trophy Cabinet Awards
const AWARDS = [
    {
        title: "L&T Intern Excellence Recognition",
        org: "L&T Construction (Buildings & Factories IC)",
        date: "Jul 2026",
        desc: "Engineered Hybrid RAG Spec Extractor reducing token costs from $22 to $2 and processing 1,200+ page PDFs in minutes. LOR awarded by Sr. Data Scientist Naveen Raj."
    },
    {
        title: "HackerRank Orchestrate August 2026",
        org: "HackerRank Global Competition",
        date: "Aug 2026",
        desc: "Ranked #1006 out of 1,983 globally. Built WhatsApp Notification Router using Groq API (llama-3.1-8b-instant NLU) achieving 75% action accuracy on 110+ real messages."
    },
    {
        title: "SIH 2026 DocFlow Systems Project Lead",
        org: "Smart India Hackathon 2026 (Ministry of Consumer Affairs)",
        date: "2026",
        desc: "Leading automated Legal Metrology compliance verification engine for 50M+ e-commerce product listings (Problem SIH25057)."
    },
    {
        title: "SRIHER Research Day 2026 Presentation",
        org: "Sri Ramachandra Institute of Higher Education",
        date: "Feb 2026",
        desc: "Presented research paper on YOLOv8 Computer Vision & MiDaS Monocular Depth Estimation for automated road hazard detection."
    },
    {
        title: "Upward CGPA Trajectory Award",
        org: "SRIHER Dept of CSE (AI & DA)",
        date: "2024 - 2026",
        desc: "Demonstrated academic resilience climbing from 6.86 to 7.70 CGPA (cleared all 2 arrears in 1st attempt)."
    }
];

// Interactive Bookshelf Books
const BOOKS = [
    {
        title: "Designing Data-Intensive Applications",
        author: "Martin Kleppmann",
        takeaway: "Mastered reliable, scalable, and maintainable data systems architectures, log-structured storage (LSM-trees), and distributed consensus."
    },
    {
        title: "Hands-On Machine Learning with Scikit-Learn",
        author: "Aurélien Géron",
        takeaway: "Deep dive into end-to-end ML projects, ensemble learning (Random Forests, XGBoost), dimensionality reduction, and SHAP explainability."
    },
    {
        title: "Python Data Science Handbook",
        author: "Jake VanderPlas",
        takeaway: "Essential techniques for pandas DataFrame manipulation, NumPy vectorization, and Matplotlib data visualization."
    },
    {
        title: "Building LLM Applications & RAG",
        author: "O'Reilly Media",
        takeaway: "Vector database indexing (FAISS, ChromaDB), sparse BM25 keyword search, and Reciprocal Rank Fusion (RRF) reranking."
    }
];

// Career & Education Timeline
const TIMELINE = [
    { year: "2024", title: "B.Tech CSE (AI & Data Analytics)", subtitle: "SRIHER Chennai", desc: "Started B.Tech journey. Built foundation in Python, C++, Data Structures, and Discrete Math." },
    { year: "2025", title: "Web Developer Intern", subtitle: "Neoshaan Technologies", desc: "Built 3 client production sites using React, TailwindCSS, and Node.js backend." },
    { year: "2026", title: "Data Analyst Intern", subtitle: "L&T Construction", desc: "Built PDF Spec Extractor (FAISS + BM25 RAG) & AutoCAD OCR Parser. Earned LOR from Sr. Data Scientist Naveen Raj." },
    { year: "2028", title: "B.Tech Graduation Target", subtitle: "Target CGPA 8.0+", desc: "Complete B.Tech thesis in AI/ML & secure 2nd Data Science internship." },
    { year: "2029", title: "MS in Data Science Target", subtitle: "Arizona State University (ASU)", desc: "Enroll in MS in Data Science @ ASU to pursue US Data Science / ML Engineering career." }
];

export default function ResumeRoom() {
    const [selectedCert, setSelectedCert] = useState(null);
    const [selectedBook, setSelectedBook] = useState(null);
    const [copiedText, setCopiedText] = useState(false);
    const [activeTab, setActiveTab] = useState("all"); // 'all' | 'experience' | 'certs' | 'timeline' | 'books'

    const handleCopyResume = () => {
        AudioEngine.playUISelect();
        navigator.clipboard.writeText(`S. VARUN VAIBHAV — EXECUTIVE CV
Status: 2nd-year B.Tech (AI & Data Analytics) | SRIHER Chennai
Contact: Umasubramanian81@gmail.com | +91 9384000748 | Chennai, India
Target: MS in Data Science at Arizona State University (2029)

EXPERIENCE:
- Data Analyst Intern at L&T Construction (May-Jul 2026): Hybrid RAG (FAISS+BM25+RRF) Spec Extractor, 1200+ pgs, $22->$2 cost opt, OCR SLD Extractor. LOR: Naveen Raj (NAVEEN-RAJ-B@LNTECC.COM).
- Web Developer at Neoshaan Technologies (May-Jul 2025): React + Tailwind, Node.js/Nodemailer backend.

EDUCATION: B.Tech CSE (AI & Data Analytics) SRIHER Chennai (2028), CGPA 7.7/10.

CERTIFICATIONS: Stanford Machine Learning Specialization (Andrew Ng), Google Prompting Essentials, HackerRank Python & SQL 5-Star Gold Badges.

PROJECTS: Road-AI (YOLOv8 + Depth), L&T Hybrid RAG, OCR SLD Extractor, AgriYield AI, LumiSphere (Vercel), HomeFinder, Titanic ML.`);
        setCopiedText(true);
        setTimeout(() => setCopiedText(false), 2500);
    };

    return (
        <div className="relative w-full rounded-2xl bg-neutral-950/95 border border-amber-500/30 p-6 shadow-[0_0_60px_rgba(251,191,36,0.15)] backdrop-blur-xl my-6 font-mono select-none">
            {/* Room Header Banner */}
            <div className="flex flex-wrap items-center justify-between gap-3 pb-4 mb-6 border-b border-amber-500/20">
                <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 animate-pulse">
                        <GraduationCap className="w-6 h-6" />
                    </div>
                    <div>
                        <h2 className="text-base font-bold text-amber-300 uppercase tracking-widest flex items-center gap-2">
                            <span>VIRTUAL RESUME ROOM & EXHIBITION CHAMBER</span>
                            <Sparkles className="w-4 h-4 text-amber-400" />
                        </h2>
                        <p className="text-xs text-neutral-400">
                            Interactive 3D Virtual Gallery • Wall Certificates, Trophies, Bookshelf & Download Station
                        </p>
                    </div>
                </div>

                {/* Filter Tabs */}
                <div className="flex flex-wrap items-center gap-2">
                    {[
                        { id: "all", label: "Full Gallery" },
                        { id: "certs", label: "Wall Certificates" },
                        { id: "trophies", label: "Trophy Cabinet" },
                        { id: "timeline", label: "Timeline Wall" },
                        { id: "books", label: "Bookshelf" },
                    ].map((tab) => (
                        <button
                            key={tab.id}
                            onClick={() => {
                                AudioEngine.playUISelect();
                                setActiveTab(tab.id);
                            }}
                            className={`px-3 py-1.5 rounded-xl text-xs border transition ${
                                activeTab === tab.id
                                    ? "bg-amber-500 text-neutral-950 font-bold border-amber-400 shadow-md"
                                    : "text-neutral-400 border-neutral-800 hover:bg-neutral-800"
                            }`}
                        >
                            {tab.label}
                        </button>
                    ))}
                </div>
            </div>

            {/* Room Exhibition Sections Grid */}
            <div className="space-y-8">
                {/* Section 1: Wall Certificates (Framed Interactive Gallery) */}
                {(activeTab === "all" || activeTab === "certs") && (
                    <div>
                        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-neutral-800 pb-1">
                            <Award className="w-4 h-4" />
                            <span>Framed Wall Certificates (Click to Zoom & Verify)</span>
                        </h3>
                        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                            {WALL_CERTIFICATES.map((cert) => (
                                <motion.div
                                    key={cert.id}
                                    whileHover={{ scale: 1.03, y: -4 }}
                                    onClick={() => {
                                        AudioEngine.playUISelect();
                                        setSelectedCert(cert);
                                    }}
                                    className={`p-4 rounded-xl border bg-gradient-to-br ${cert.badgeColor} cursor-pointer transition shadow-lg relative group`}
                                >
                                    <div className="flex items-center justify-between mb-2">
                                        <Award className="w-5 h-5" />
                                        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-black/40 border border-white/10">
                                            {cert.date}
                                        </span>
                                    </div>
                                    <h4 className="text-xs font-bold text-white mb-1 group-hover:text-amber-300 transition">
                                        {cert.title}
                                    </h4>
                                    <p className="text-[10px] text-neutral-300">
                                        Issuer: {cert.issuer}
                                    </p>
                                    <p className="text-[9px] text-amber-400 mt-2 flex items-center gap-1 font-bold">
                                        <span>Signed by {cert.signatory}</span>
                                        <ExternalLink className="w-3 h-3" />
                                    </p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Section 2: Awards Trophy Cabinet */}
                {(activeTab === "all" || activeTab === "trophies") && (
                    <div>
                        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-neutral-800 pb-1">
                            <Trophy className="w-4 h-4" />
                            <span>Glowing Trophy & Honors Cabinet</span>
                        </h3>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            {AWARDS.map((award, idx) => (
                                <div
                                    key={idx}
                                    className="p-4 rounded-xl bg-neutral-900/90 border border-amber-500/30 hover:border-amber-400 transition flex items-start gap-3 shadow-inner"
                                >
                                    <div className="p-2.5 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40 shrink-0">
                                        <Trophy className="w-6 h-6 animate-bounce" />
                                    </div>
                                    <div>
                                        <span className="text-[10px] text-amber-400 font-bold">{award.date}</span>
                                        <h4 className="text-xs font-bold text-white mb-1">{award.title}</h4>
                                        <p className="text-[10px] text-neutral-400 mb-1">{award.org}</p>
                                        <p className="text-[11px] text-neutral-300 leading-relaxed font-sans">{award.desc}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Section 3: Interactive Technical Bookshelf */}
                {(activeTab === "all" || activeTab === "books") && (
                    <div>
                        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-neutral-800 pb-1">
                            <BookOpen className="w-4 h-4" />
                            <span>Interactive Technical Bookshelf (Click Spine to Read Notes)</span>
                        </h3>
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                            {BOOKS.map((book, idx) => (
                                <motion.div
                                    key={idx}
                                    whileHover={{ scale: 1.05, rotateZ: -1 }}
                                    onClick={() => {
                                        AudioEngine.playUISelect();
                                        setSelectedBook(book);
                                    }}
                                    className="p-4 rounded-xl bg-neutral-900 border-l-4 border-l-amber-500 border-y border-r border-neutral-800 cursor-pointer hover:border-amber-400 transition shadow-md"
                                >
                                    <BookOpen className="w-5 h-5 text-amber-400 mb-2" />
                                    <h4 className="text-xs font-bold text-white line-clamp-2 mb-1">{book.title}</h4>
                                    <p className="text-[10px] text-neutral-400">{book.author}</p>
                                </motion.div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Section 4: Career & Education Timeline Wall */}
                {(activeTab === "all" || activeTab === "timeline") && (
                    <div>
                        <h3 className="text-xs font-bold text-amber-400 uppercase tracking-widest mb-3 flex items-center gap-2 border-b border-neutral-800 pb-1">
                            <Calendar className="w-4 h-4" />
                            <span>Career & Education Timeline Wall (2024 — 2029)</span>
                        </h3>
                        <div className="relative pl-6 border-l-2 border-amber-500/40 space-y-6">
                            {TIMELINE.map((item, idx) => (
                                <div key={idx} className="relative">
                                    <div className="absolute -left-[31px] top-1 w-4 h-4 rounded-full bg-amber-400 border-2 border-neutral-950 shadow-[0_0_10px_#f59e0b]" />
                                    <div className="flex items-center gap-2">
                                        <span className="text-xs font-bold text-amber-400">{item.year}</span>
                                        <span className="text-xs font-bold text-white">• {item.title}</span>
                                        <span className="text-[10px] text-neutral-400">({item.subtitle})</span>
                                    </div>
                                    <p className="text-xs text-neutral-300 mt-1 font-sans leading-relaxed">{item.desc}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                {/* Section 5: Download Station Terminal */}
                <div className="p-6 rounded-2xl bg-neutral-900 border border-amber-500/40 shadow-inner flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h3 className="text-sm font-bold text-amber-300 flex items-center gap-2 mb-1">
                            <Download className="w-4 h-4" />
                            <span>RESUME DOWNLOAD & EXPORT STATION</span>
                        </h3>
                        <p className="text-xs text-neutral-400">
                            Download PDF, Print format, or copy raw executive CV markdown directly to clipboard.
                        </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-3">
                        <button
                            onClick={() => {
                                AudioEngine.playUISelect();
                                window.print();
                            }}
                            className="px-4 py-2.5 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white font-bold text-xs flex items-center gap-2 transition"
                        >
                            <Printer className="w-4 h-4" />
                            <span>Print / Save PDF</span>
                        </button>

                        <button
                            onClick={handleCopyResume}
                            className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs flex items-center gap-2 transition shadow-lg shadow-amber-500/20"
                        >
                            {copiedText ? <Check className="w-4 h-4 text-neutral-950" /> : <Copy className="w-4 h-4" />}
                            <span>{copiedText ? "Copied to Clipboard!" : "Copy Full Executive CV"}</span>
                        </button>
                    </div>
                </div>
            </div>

            {/* Certificate Zoom Modal */}
            {selectedCert &&
                typeof document !== "undefined" &&
                createPortal(
                    <AnimatePresence>
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.88 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.88 }}
                                className="relative w-full max-w-xl rounded-2xl bg-neutral-950 border-4 border-amber-500/50 p-6 shadow-[0_0_60px_rgba(251,191,36,0.3)] font-mono text-left select-none"
                            >
                                <button
                                    onClick={() => setSelectedCert(null)}
                                    className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="flex items-center gap-3 mb-4">
                                    <div className="p-3 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/40">
                                        <Award className="w-8 h-8" />
                                    </div>
                                    <div>
                                        <h3 className="text-base font-bold text-amber-300">{selectedCert.title}</h3>
                                        <p className="text-xs text-neutral-400">Issuer: {selectedCert.issuer}</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 mb-4 space-y-2 text-xs">
                                    <div><span className="text-amber-400 font-bold">Signatory:</span> {selectedCert.signatory}</div>
                                    <div><span className="text-amber-400 font-bold">Date Issued:</span> {selectedCert.date}</div>
                                    <div className="pt-2 border-t border-neutral-800 text-neutral-300 font-sans leading-relaxed">
                                        {selectedCert.details}
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setSelectedCert(null)}
                                        className="px-5 py-2 bg-amber-500 text-neutral-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition"
                                    >
                                        Close Inspector
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </AnimatePresence>,
                    document.body
                )}

            {/* Book Detail Modal */}
            {selectedBook &&
                typeof document !== "undefined" &&
                createPortal(
                    <AnimatePresence>
                        <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
                            <motion.div
                                initial={{ opacity: 0, scale: 0.88 }}
                                animate={{ opacity: 1, scale: 1 }}
                                exit={{ opacity: 0, scale: 0.88 }}
                                className="relative w-full max-w-md rounded-2xl bg-neutral-950 border-4 border-amber-500/50 p-6 shadow-[0_0_60px_rgba(251,191,36,0.3)] font-mono text-left select-none"
                            >
                                <button
                                    onClick={() => setSelectedBook(null)}
                                    className="absolute top-4 right-4 p-1.5 rounded-lg text-neutral-400 hover:text-white hover:bg-neutral-800 transition"
                                >
                                    <X className="w-5 h-5" />
                                </button>

                                <div className="flex items-center gap-3 mb-4">
                                    <BookOpen className="w-8 h-8 text-amber-400" />
                                    <div>
                                        <h3 className="text-base font-bold text-amber-300">{selectedBook.title}</h3>
                                        <p className="text-xs text-neutral-400">By {selectedBook.author}</p>
                                    </div>
                                </div>

                                <div className="p-4 rounded-xl bg-neutral-900 border border-neutral-800 text-xs font-sans text-neutral-300 leading-relaxed mb-4">
                                    <span className="text-amber-400 font-bold font-mono block mb-1">Key Takeaways & Notes:</span>
                                    "{selectedBook.takeaway}"
                                </div>

                                <div className="flex justify-end">
                                    <button
                                        onClick={() => setSelectedBook(null)}
                                        className="px-5 py-2 bg-amber-500 text-neutral-950 font-bold text-xs rounded-xl hover:bg-amber-400 transition"
                                    >
                                        Close Book
                                    </button>
                                </div>
                            </motion.div>
                        </div>
                    </AnimatePresence>,
                    document.body
                )}
        </div>
    );
}
