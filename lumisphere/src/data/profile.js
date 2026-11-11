// Single source of truth for every personal detail shown on the site.
// Portfolio sections, the résumé, the terminal, Lumi AI and the desk props all read from here,
// so an update in this file propagates everywhere.

export const profile = {
    name: "S. Varun Vaibhav",
    shortName: "Varun",
    initials: "VV",
    role: "AI & Data Analytics Engineer",
    tagline: "I build data pipelines, ML systems, and full-stack products.",
    headline: "I turn manual, repetitive work into systems that run on their own.",
    summary:
        "3rd-year B.Tech CSE (AI & Data Analytics) student at SRIHER, Chennai. At L&T Construction I shipped a document-extraction pipeline that cut a 3–4 day manual process to about 15 minutes per run. I prefer shipping working systems with real users over prototypes that only live in notebooks.",
    philosophy: "Ship working systems, not notebooks. Solve real problems, not hypothetical ones.",
    location: "Chennai, Tamil Nadu, India",
    timezone: "IST (UTC+5:30)",
    email: "Umasubramanian81@gmail.com",
    availability: "Open to data analytics, data engineering & applied AI roles",
    brand: "The Flight Tech Labs",
    portfolio: "https://lumisphere-nine.vercel.app",
    languages: ["English", "German (A2 → B2)"],
};

export const socials = [
    { id: "github", label: "GitHub", handle: "theflighttechofficial", url: "https://github.com/theflighttechofficial" },
    { id: "linkedin", label: "LinkedIn", handle: "varun-vaibhav-s", url: "https://linkedin.com/in/varun-vaibhav-s-11b69a2ba" },
    { id: "kaggle", label: "Kaggle", handle: "theflighttechofficial", url: "https://kaggle.com/theflighttechofficial" },
    { id: "hackerrank", label: "HackerRank", handle: "umasubramanian81", url: "https://hackerrank.com/profile/umasubramanian81" },
    { id: "hashnode", label: "Blog", handle: "theflighttechlabs", url: "https://theflighttechlabs.hashnode.dev" },
    { id: "labs", label: "Flight Tech Labs", handle: "theflighttechlabs", url: "https://theflighttechlabs.vercel.app" },
    { id: "instagram", label: "Instagram", handle: "varunwashere__", url: "https://www.instagram.com/varunwashere__/" },
];

export const education = {
    degree: "B.Tech, Computer Science & Engineering (AI & Data Analytics)",
    school: "Sri Ramachandra Institute of Higher Education and Research (SRIHER)",
    schoolShort: "SRIHER, Chennai",
    period: "2024 – 2028",
    cgpa: 7.8,
    cgpaNote: "Climbed every semester, up from 6.86 in year one",
    honours: ["Data Analytics", "Machine Learning", "DBMS", "Advanced C++", "Linux"],
    honoursLabel: "O grades in labs",
};

export const impactStats = [
    { value: "3–4 days → 15 min", label: "Tender-spec extraction at L&T, per run" },
    { value: "$22 → $2", label: "LLM cost per document run (~91% less)" },
    { value: "1,200+", label: "Pages processed per run in production" },
    { value: "0.648", label: "mAP50 on RDD2022 with Road-AI" },
];

export const experience = [
    {
        id: "lnt",
        role: "Data Analyst Intern",
        company: "Larsen & Toubro (L&T) Construction",
        team: "Data Analytics Department",
        period: "May 2026 – Jul 2026",
        location: "Chennai · On-site",
        summary:
            "Built two production tools that turned multi-day manual document work into automated pipelines, both still in use by the department.",
        points: [
            "Built a hybrid RAG pipeline (FAISS + BM25 merged with Reciprocal Rank Fusion) that extracts structured specs from 1,200+ page tender PDFs into Excel workbooks.",
            "GPT-4o handles extraction and GPT-4o-mini verifies it; ThreadPoolExecutor parallelism brought a 3–4 day manual process down to about 15 minutes per run.",
            "Cut cost per run from about $22 to $2 with offline SentenceTransformer embeddings, layered caching and rule-based check skipping.",
            "Built Scan2Sheet, a Tesseract OCR tool that pulls feeder and panel schedules out of AutoCAD single-line diagram PDFs that have no embedded text layer.",
        ],
        metrics: ["1,200+ pages / run", "~15 min / run", "$22 → $2 / run", "2 tools in production"],
        stack: ["Python", "FAISS", "BM25", "RRF", "GPT-4o", "SentenceTransformers", "Tesseract", "OpenCV", "openpyxl"],
        credential: "Letter of recommendation from the department. Source code is confidential to L&T; public repos carry documentation only.",
    },
    {
        id: "neoshaan",
        role: "Web Design & Development Intern",
        company: "Neoshaan Technologies (OPC) Pvt. Ltd.",
        team: "Web",
        period: "Jun 2025 – Aug 2025",
        location: "Remote",
        summary: "Rebuilt the company website and its lead-capture backend, and fixed mobile issues across client sites.",
        points: [
            "Rebuilt the company site in React, Vite and Tailwind CSS: home, services, course catalog, course detail pages, careers and contact.",
            "Built the contact and job-application backend with Node.js and Nodemailer, replacing a manual inbox workflow.",
            "Fixed mobile layout problems across three client sites and logged UX defects during a site-wide audit.",
        ],
        metrics: ["3 client sites", "Full site rebuild", "Form backend"],
        stack: ["React", "Vite", "Tailwind CSS", "Node.js", "Express", "Nodemailer"],
        link: "https://github.com/theflighttechofficial/Neoshaan_Technologies",
    },
];

export const leadership = [
    {
        title: "Team Lead · Smart India Hackathon 2026",
        detail: "Led a 6-person team on NAVIK (SIH26037, MathWorks): adaptive path planning for autonomous vehicles on unstructured Indian roads. Selected for the national round.",
    },
    {
        title: "Overleaf / LaTeX Seminar",
        detail: "Ran a seminar for junior students on writing and formatting research papers in LaTeX.",
    },
];

// category: ai | data | product | experience
// status: production | live | research | hackathon | building | archived
export const projects = [
    {
        id: "lnt-rag",
        title: "L&T Tender Spec Extractor",
        tagline: "Hybrid RAG that turns 1,200-page tender PDFs into Excel in minutes.",
        category: "ai",
        status: "production",
        year: 2026,
        featured: true,
        description:
            "Production document-intelligence pipeline built for L&T Construction's Data Analytics department. Dense FAISS retrieval and sparse BM25 are fused with Reciprocal Rank Fusion; GPT-4o extracts, GPT-4o-mini verifies, and the result lands in a structured workbook.",
        highlights: [
            "Hybrid retrieval: FAISS + BM25 merged with Reciprocal Rank Fusion",
            "Two-model loop: GPT-4o extraction, GPT-4o-mini verification",
            "Parallel page processing with ThreadPoolExecutor",
            "Offline embeddings, caching and rule-based skipping cut cost ~91%",
        ],
        metrics: ["3–4 days → ~15 min", "$22 → $2 / run", "1,200+ pages"],
        stack: ["Python", "FAISS", "BM25", "GPT-4o", "SentenceTransformers", "openpyxl"],
        links: { repo: "https://github.com/theflighttechofficial/Automated-PDF-to-excel-data-extraction", article: "https://theflighttechlabs.hashnode.dev" },
        note: "Source confidential to L&T. Repository contains documentation only.",
        snippet: "rag",
    },
    {
        id: "trustpulse",
        title: "TrustPulse AI",
        tagline: "Real-time, network-aware fraud scoring for instant payments on IBM LinuxONE.",
        category: "ai",
        status: "hackathon",
        year: 2026,
        featured: true,
        description:
            "IBM Z Datathon 2026 entry (Theme: Real-Time AI for Critical Decisions). Scores every payment as it arrives using what is known about both accounts and their connections, then returns APPROVE, VERIFY or REVIEW with a reason an analyst can read. Built and run entirely on an IBM LinuxONE (s390x) VM, including Telum II on-chip AI accelerator benchmarks and CPACF-encrypted engine state.",
        highlights: [
            "Streaming feature build over 5.08M transactions in 13.5 s",
            "Live engine p50 0.256 ms / p99 0.395 ms per payment, 3,456 payments/s",
            "Snap ML on CPU vs Telum II NNPA benchmarked with identical decisions",
            "Engine state and model encrypted at rest with AES-256-GCM on CPACF",
        ],
        metrics: ["0.256 ms p50", "3,456 payments/s", "5.08M txns"],
        stack: ["Python", "Snap ML", "scikit-learn", "pandas", "IBM LinuxONE", "zDNN"],
        links: { repo: "https://github.com/theflighttechofficial/TrustPulse-AI", video: "https://youtu.be/pyycgKfJAe8" },
    },
    {
        id: "navik",
        title: "NAVIK SIL Simulator",
        tagline: "Autonomous-vehicle path planning for chaotic, non-lane Indian roads.",
        category: "experience",
        status: "hackathon",
        year: 2026,
        featured: true,
        description:
            "Smart India Hackathon 2026 (SIH26037, MathWorks) — selected for the national round; I led the 6-person team. A web Software-in-the-Loop simulator with a physics engine, trajectory planner, spatial risk field heat map, traffic agents (livestock, auto-rickshaws, wrong-way traffic, potholes, monsoon friction), telemetry HUD, three camera views, six scenarios and Gemini-based reasoning.",
        highlights: [
            "Friction-aware braking from dry asphalt (μ 0.85) to monsoon slick (μ 0.35)",
            "Time-to-collision radar with automatic emergency braking under 2 s",
            "Potential-field risk map driving evasive path synthesis",
            "Planning maths validated in a Python prototype before MATLAB/Simulink",
        ],
        metrics: ["SIH 2026 · national round", "6 scenarios", "Team lead"],
        stack: ["JavaScript", "HTML5 Canvas", "SVG", "Web Audio", "Gemini API", "Python"],
        links: {
            live: "https://navik-simulator.vercel.app/",
            repo: "https://github.com/theflighttechofficial/NAVIK-Simulator",
            extra: { label: "Planning prototype", url: "https://github.com/theflighttechofficial/SIH-2026-Navik-autonomous-Roads" },
        },
    },
    {
        id: "road-ai",
        title: "Road-AI",
        tagline: "From dashcam or drone footage to costed road-repair tickets.",
        category: "ai",
        status: "research",
        year: 2026,
        featured: true,
        description:
            "Full pipeline for road-damage detection: raw images, video or drone footage in, repair tickets with QR codes out. Presented at SRIHER Research Day 2026 and submitted to an IIT Madras hackathon.",
        highlights: [
            "Ensemble of YOLOv8 models including a fine-tuned road-damage model",
            "Temporal fusion across frames plus Monte Carlo Dropout for low-confidence flags",
            "Depth from shadow gradients — no LiDAR required",
            "Repair costs from Tamil Nadu PWD and NHAI schedules of rates",
        ],
        metrics: ["mAP50 0.648", "−38% false positives", "RDD2022"],
        stack: ["Python", "YOLOv8", "OpenCV", "PyTorch"],
        links: { repo: "https://github.com/theflighttechofficial/RoadAi-Building-better-roads-for-India" },
        snippet: "roadai",
    },
    {
        id: "documind",
        title: "DocuMind AI",
        tagline: "Evidence-first document Q&A that cites its sources — or says it can't.",
        category: "ai",
        status: "building",
        year: 2026,
        featured: true,
        description:
            "Document intelligence for PDF, DOCX and TXT. Every answer is anchored to the exact page and passage with inline citations; if the document doesn't contain the answer, the system abstains instead of guessing. Runs privately on a local LLM that I QLoRA fine-tuned (Qwen3-4B) and serve through Ollama.",
        highlights: [
            "Semantic (FAISS), lexical (BM25) and hybrid retrieval side by side, with cross-encoder reranking",
            "QLoRA fine-tuned Qwen3-4B answer model served locally via Ollama",
            "In-app evaluation: Precision@K, Recall@K, MRR, Token F1, BERTScore, ROUGE",
            "NER, keyword extraction (TF-IDF / TextRank / KeyBERT), summaries and a knowledge graph",
        ],
        metrics: ["Cited answers", "Local LLM", "QLoRA fine-tune"],
        stack: ["FastAPI", "React", "FAISS", "sentence-transformers", "spaCy", "Ollama", "Qwen3"],
        links: { repo: "https://github.com/theflighttechofficial/DocuMind-Hybrid-RAG-based-Doc-analyzer" },
    },
    {
        id: "paws-care",
        title: "Paws & Care Clinic",
        tagline: "My family's vet clinic, now taking bookings and payments online.",
        category: "product",
        status: "live",
        year: 2026,
        featured: true,
        description:
            "Full-stack platform for my family's veterinary clinic, live in production. Pet owners book payment-gated appointment slots; doctors and admins manage pet health records and schedules.",
        highlights: [
            "JWT and Google sign-in, password recovery, pet profiles and health records",
            "Razorpay payment-gated booking with Google Calendar and Meet integration",
            "Transactional email through Resend; doctor and admin dashboards",
            "SEO, legal pages and accessibility built in; Playwright-generated screenshots",
        ],
        metrics: ["Live in production", "Payments", "3 user roles"],
        stack: ["React", "Tailwind CSS", "Node.js", "Express", "PostgreSQL", "Razorpay", "Resend"],
        links: { live: "https://deivayanaipetclinic.online", repo: "https://github.com/theflighttechofficial/Paws-Care-a-unit-of-deivayanai-pet-clinic" },
    },
    {
        id: "resumeforge",
        title: "ResumeForge AI",
        tagline: "Offline ATS resume engineering suite for Windows.",
        category: "product",
        status: "building",
        year: 2026,
        featured: true,
        description:
            "Reads a resume the way an ATS and a recruiter would, scores it against a job description and suggests edits. Scores come from a deterministic engine, never the LLM; a TruthGuard checker labels every AI edit as supported, inferred or unsupported. Runs 100% on-device with Ollama by default.",
        highlights: [
            "8-category transparent ATS scoring with fixes ranked by simulated score gain",
            "Local semantic evidence mapping with Qwen via Ollama — nothing leaves the PC",
            "Native-feeling Windows 11 app: Mica, Snap Assist, Ctrl+K command palette",
            "Local scrypt accounts, DPAPI-encrypted keys, PII redaction in online mode",
        ],
        metrics: ["100% offline mode", "8 scoring categories", "Windows app"],
        stack: ["Electron", "React", "TypeScript", "SQLite", "Ollama"],
        links: { repo: "https://github.com/theflighttechofficial/ResumeForge-AI", extra: { label: "Download hub", url: "https://theflighttechlabs.vercel.app" } },
    },
    {
        id: "trust-tab",
        title: "TRUST-TAB / TableAbstain",
        tagline: "Does an LLM know when a financial table can't answer the question?",
        category: "data",
        status: "research",
        year: 2026,
        featured: true,
        description:
            "Benchmark for LLM abstention on tabular QA, built from FinQA. Five controlled variants — answerable, missing evidence, contradictory, adversarial and underspecified — test whether a model answers or abstains. Paper in preparation (IEEE format), with a live React dashboard that replays runs.",
        highlights: [
            "5 perturbation types generated deterministically from FinQA",
            "4 confidence signals: verbalized, P(True), self-consistency, evidence coverage",
            "10 metrics incl. Abstention F1, AURC / E-AURC, ECE, Brier and risk-coverage",
            "Pilot run on Qwen2.5-7B-Instruct via Ollama",
        ],
        metrics: ["IEEE paper in prep", "5 variants", "10 metrics"],
        stack: ["Python", "Ollama", "Qwen2.5-7B", "React"],
        links: { repo: "https://github.com/theflighttechofficial/TRUST-TAB-AI-source-validity-checker" },
    },
    {
        id: "scan2sheet",
        title: "Scan2Sheet",
        tagline: "OCR for AutoCAD single-line diagrams that have no text layer.",
        category: "ai",
        status: "production",
        year: 2026,
        description:
            "Built during the L&T internship. Rasterizes electrical single-line diagram PDFs, preprocesses them with adaptive thresholding and runs Tesseract to extract feeder and panel schedules straight into Excel.",
        highlights: ["Works on PDFs with zero embedded text", "Adaptive thresholding and iterative OCR passes", "Exports clean schedules to Excel"],
        metrics: ["In production at L&T", "Zero-text PDFs"],
        stack: ["Python", "Tesseract", "OpenCV", "PyMuPDF"],
        links: { repo: "https://github.com/theflighttechofficial/Scan2Sheet" },
        note: "Source confidential to L&T. Repository contains documentation only.",
        snippet: "ocr",
    },
    {
        id: "ghost-patterns",
        title: "Ghost Patterns v2",
        tagline: "Telling real patterns from noise in data mining.",
        category: "data",
        status: "research",
        year: 2026,
        description:
            "k-means always returns k clusters and Apriori always finds rules — even on noise. Ghost Patterns runs your exact mining pipeline on structurally matched null models and calibrates real findings against them.",
        highlights: [
            "8 null models incl. Curveball swap randomization and conditional permutation",
            "Pre-mining leakage detection for functional dependencies and ordering artifacts",
            "Self-validating benchmarks: FWER, FDR, power curves and minimum detectable effect",
        ],
        metrics: ["8 null models", "FDR control"],
        stack: ["Python", "pandas", "NumPy", "scikit-learn"],
        links: { repo: "https://github.com/theflighttechofficial/Ghost-Patterns" },
    },
    {
        id: "buy-or-wait",
        title: "Buy or Wait",
        tagline: "AI financial-affordability agent with a deterministic core.",
        category: "ai",
        status: "hackathon",
        year: 2026,
        description:
            "HackerRank Orchestrate (Sep 2026). Forecasts a 90-day cash-flow timeline to decide whether a purchase is affordable. The arithmetic runs in deterministic code; LLMs only extract. Groq is primary with a local Ollama fallback, and messages/images are treated as untrusted input.",
        highlights: ["90-day balance forecasting", "LLM extraction only — maths stays deterministic", "Groq primary, Ollama fallback; 21 passing tests"],
        metrics: ["250 requests", "21 tests"],
        stack: ["Python", "Groq", "Ollama", "pandas", "pytest"],
        links: { repo: "https://github.com/theflighttechofficial/AI-Powered-Financial-Affordability-Agent" },
    },
    {
        id: "messagemind",
        title: "MessageMind",
        tagline: "WhatsApp notification router: notify now, digest later, or mute.",
        category: "ai",
        status: "hackathon",
        year: 2026,
        description:
            "HackerRank Orchestrate (Aug 2026). Routes incoming WhatsApp messages — text, poster images and voice notes — into one of three actions with Groq-hosted Llama 3.1.",
        highlights: ["Multimodal input: text, images, voice notes", "75% action accuracy, 83% type accuracy on 110 messages"],
        metrics: ["75% action acc.", "83% type acc."],
        stack: ["Python", "Groq", "Llama 3.1"],
        links: { repo: "https://github.com/theflighttechofficial/MessageMind" },
    },
    {
        id: "rigforge",
        title: "RigForge",
        tagline: "PC hardware intelligence: build, simulate and benchmark in 3D.",
        category: "product",
        status: "live",
        year: 2026,
        description:
            "PC build simulator with a real-time WebGL assembly view, Pareto price-to-performance analysis across 18 years of hardware, bottleneck analysis at 1080p–4K, thermal modelling for 45°C Indian summers and an AI Build Doctor. Priced in INR with GST.",
        highlights: ["3D exploded assembly with airflow simulation", "Pareto value matrix and head-to-head duels", "3-year electricity TCO by state DISCOM tariff"],
        metrics: ["Live", "WebGL", "INR pricing"],
        stack: ["React 19", "TypeScript", "Three.js", "Tailwind CSS", "Express", "Gemini API"],
        links: { live: "https://rigforge-livid.vercel.app", repo: "https://github.com/theflighttechofficial/RigForge" },
    },
    {
        id: "cooked",
        title: "cooked.",
        tagline: "Get roasted by your own public data from 34 platforms.",
        category: "product",
        status: "live",
        year: 2026,
        description:
            "Type a username and Cooked pulls real public stats from one of 34 platforms through official APIs, then an AI roasts you with them. Cross-platform roasts, roast battles, screenshot reading with Gemini and an offline roaster that works without any AI key.",
        highlights: ["34 connectors, all official public APIs — no scraping", "6 personas × 3 heat levels; PNG export and read-aloud", "Offline fallback roaster built from real numbers"],
        metrics: ["Live", "34 platforms"],
        stack: ["TypeScript", "React", "Gemini API"],
        links: { live: "https://cooked-the-profile-roaster.vercel.app", repo: "https://github.com/theflighttechofficial/Cooked-the-profile-roaster" },
    },
    {
        id: "fridgechef",
        title: "FridgeChef AI",
        tagline: "Snap your fridge, get zero-waste recipes and hands-free cooking.",
        category: "product",
        status: "building",
        year: 2026,
        description:
            "Smart fridge and culinary assistant: ingredient audit from a fridge photo, receipt-to-pantry scanning, zero-waste recipe generation, meal planning and voice-guided cooking, designed mobile-first.",
        highlights: ["Vision-based ingredient audit and receipt scanning", "Zero-waste recipe engine with substitutions", "Voice-guided step-by-step cooking"],
        metrics: ["Vision AI", "Mobile-first"],
        stack: ["React 19", "TypeScript", "Tailwind CSS v4", "Express", "Gemini API"],
        links: { repo: "https://github.com/theflighttechofficial/FridgeChef-AI" },
    },
    {
        id: "homefinder",
        title: "HomeFinder+",
        tagline: "Rent, buy and sell homes across India with direct owner contact.",
        category: "product",
        status: "live",
        year: 2026,
        description:
            "Responsive real-estate platform with filters for city, budget, property type, bedrooms, furnishing, parking and amenities. Filters live in the URL so searches can be shared.",
        highlights: ["Shareable URL-synced filters", "Favourites and detailed listings", "Indexed MongoDB queries"],
        metrics: ["Live", "Shareable search"],
        stack: ["JavaScript", "Tailwind CSS", "MongoDB", "Node.js"],
        links: { live: "https://home-finder-plus-rent-buy-sell.vercel.app", repo: "https://github.com/theflighttechofficial/Home-Finder-Plus-Rent-Buy-Sell-" },
    },
    {
        id: "agriyield",
        title: "AgriYield AI",
        tagline: "Explainable crop-yield prediction from soil and weather.",
        category: "data",
        status: "archived",
        year: 2026,
        description: "XGBoost yield prediction with SHAP explanations for every prediction, what-if analysis for fertilizer changes and downloadable PDF reports. Published on Kaggle.",
        highlights: ["Per-prediction SHAP explanations", "What-if fertilizer analysis", "PDF report export"],
        metrics: ["Published on Kaggle", "SHAP"],
        stack: ["Python", "XGBoost", "SHAP", "scikit-learn", "Streamlit"],
        links: { repo: "https://github.com/theflighttechofficial/AgriYield-Ai-Pro" },
    },
    {
        id: "anchora",
        title: "Anchora",
        tagline: "Freelancer workspace meets startup ecosystem.",
        category: "product",
        status: "building",
        year: 2026,
        description:
            "SaaS combining a freelancer project workspace with a startup ecosystem layer. About 60 routes, 30 database migrations and 5 user roles. AI features — co-founder matching, investor matching, proposal generation, contract summaries — run through Supabase Edge Functions.",
        highlights: ["~60 routes, ~30 migrations, 5 roles", "AI matching via Supabase Edge Functions + GPT-4o-mini"],
        metrics: ["60 routes", "5 roles"],
        stack: ["React", "TypeScript", "Zustand", "Supabase", "PostgreSQL", "GPT-4o-mini"],
        links: {},
        note: "Private repository.",
    },
    {
        id: "lumisphere",
        title: "Lumisphere",
        tagline: "This site — a pull-chain lamp that lights up a portfolio.",
        category: "experience",
        status: "live",
        year: 2026,
        description:
            "Interactive WebGL portfolio with a spring-physics pull-chain lamp, volumetric light shaders, a GPU particle simulation, weather and day/night cycles, and procedural Web Audio synthesis with zero audio files.",
        highlights: ["Custom GLSL volumetric light and FBM backdrop", "Procedural Web Audio — no audio assets", "Three.js hologram that morphs per section"],
        metrics: ["Live", "Zero audio files"],
        stack: ["React", "Vite", "Three.js", "GLSL", "Framer Motion", "Web Audio"],
        links: { live: "https://lumisphere-nine.vercel.app", repo: "https://github.com/theflighttechofficial/Lumisphere" },
        snippet: "hologram",
    },
    {
        id: "oru-payanam",
        title: "Oru Payanam Aayiram Kathaigal",
        tagline: "A night bus journey through Tamil culture, cinema and food.",
        category: "experience",
        status: "live",
        year: 2026,
        description:
            "Retro-futuristic cinematic web experience inspired by Tamil Nadu's vintage TNSTC buses: six routes covering heritage, music, cinema, literature and food, with retro hardware UI, audio and keyboard shortcuts.",
        highlights: ["Six themed routes", "Retro hardware UI with audio", "Keyboard-driven navigation"],
        metrics: ["Live", "6 routes"],
        stack: ["React", "Node.js", "PostgreSQL"],
        links: { live: "https://oru-payanam-aayiram-kathaigal-xe6d-omega.vercel.app", repo: "https://github.com/theflighttechofficial/Oru-Payanam-Aayiram-Kathaigal" },
    },
    {
        id: "kumarikandam",
        title: "Lemuria & Kumari Kandam Explorer",
        tagline: "Three histories of a continent that never sank — a research paper and web explorer.",
        category: "data",
        status: "research",
        year: 2026,
        description: "Companion web app to my research paper tracing three histories of the lost-continent idea — Sclater's Lemuria, Blavatsky's theosophy and the Tamil Kumari Kandam tradition — with historical map exploration and a side-by-side comparison of myth against oceanographic evidence.",
        highlights: ["Research paper: Sclater, Blavatsky and Kumari Kandam", "Interactive historical maps", "Myth vs. oceanographic evidence"],
        metrics: ["Research paper", "Live explorer"],
        stack: ["TypeScript", "React"],
        links: { live: "https://kumarikandam-the-lost-mythology.vercel.app", repo: "https://github.com/theflighttechofficial/Kumarikandam-the-lost-mythology" },
    },
    {
        id: "skoda",
        title: "Škoda & VW Group India Showcase",
        tagline: "Buyer's guide across nine group brands, built for the love of German engineering.",
        category: "experience",
        status: "live",
        year: 2026,
        description: "Single-page buyer's guide with dynamic brand themes, powertrain analytics, a variant matrix, 360° colour visualizer, configurator, engine-sound gallery and crash-safety deep dive.",
        highlights: ["360° colour visualizer and configurator", "Powertrain analytics and variant matrix"],
        metrics: ["Live", "9 brands"],
        stack: ["TypeScript", "React"],
        links: { live: "https://skoda-auto-volkswagen-india-pvt-ltd.vercel.app", repo: "https://github.com/theflighttechofficial/Skoda-Auto-Volkswagen-India-Pvt-Ltd" },
        note: "Fan project, not affiliated with Škoda or Volkswagen.",
    },
    {
        id: "wedding",
        title: "The Wedding Company",
        tagline: "A scroll-driven wedding invitation that feels like home.",
        category: "experience",
        status: "archived",
        year: 2026,
        description: "Five-layer parallax, canvas particle systems, a synthesized Web Audio temple bell, RSVP via WhatsApp or email and a downloadable .ics calendar file — no backend.",
        highlights: ["5-layer parallax", "Synthesized temple bell", "RSVP + .ics export"],
        metrics: ["No backend"],
        stack: ["React 19", "Vite", "Framer Motion"],
        links: { repo: "https://github.com/theflighttechofficial/The-Wedding-Company" },
    },
    {
        id: "invisible-cloak",
        title: "Invisible Cloak",
        tagline: "Real-time OpenCV invisibility effect at ~30 fps.",
        category: "ai",
        status: "archived",
        year: 2026,
        description: "HSV colour segmentation replaces a chosen cloak colour with a captured background frame in real time.",
        highlights: ["HSV segmentation and morphology", "~30 fps on a laptop webcam"],
        metrics: ["~30 fps"],
        stack: ["Python", "OpenCV", "NumPy"],
        links: { repo: "https://github.com/theflighttechofficial/Invisible-cloak" },
    },
    {
        id: "titanic",
        title: "Titanic Survival Model",
        tagline: "Kaggle classic, done properly.",
        category: "data",
        status: "archived",
        year: 2026,
        description: "Feature engineering (titles, family size) and Random Forest classification for the Kaggle Titanic benchmark.",
        highlights: ["Title and family-size features", "78.71% Kaggle score"],
        metrics: ["78.71%"],
        stack: ["Python", "pandas", "scikit-learn"],
        links: { repo: "https://github.com/theflighttechofficial/Titanic-ML-Project", extra: { label: "Kaggle", url: "https://kaggle.com/theflighttechofficial" } },
    },
];

export const projectCategories = [
    { id: "all", label: "All" },
    { id: "ai", label: "AI & ML" },
    { id: "data", label: "Data & Research" },
    { id: "product", label: "Products" },
    { id: "experience", label: "Interactive" },
];

export const projectStatus = {
    production: { label: "In production", tone: "emerald" },
    live: { label: "Live", tone: "emerald" },
    research: { label: "Research", tone: "violet" },
    hackathon: { label: "Hackathon", tone: "sky" },
    building: { label: "Building", tone: "amber" },
    archived: { label: "Shipped", tone: "zinc" },
};

export const skillGroups = [
    { id: "languages", label: "Languages", items: ["Python", "SQL", "TypeScript", "JavaScript", "C", "C++", "Java"], core: ["Python", "SQL", "TypeScript"] },
    { id: "ml", label: "Data & ML", items: ["pandas", "NumPy", "scikit-learn", "XGBoost", "SHAP", "PyMuPDF", "openpyxl", "Jupyter"], core: ["pandas", "scikit-learn", "XGBoost"] },
    { id: "llm", label: "NLP & LLMs", items: ["RAG", "FAISS", "BM25", "Reciprocal Rank Fusion", "SentenceTransformers", "QLoRA fine-tuning", "GPT-4o", "Gemini", "Groq", "Ollama"], core: ["RAG", "FAISS", "Ollama"] },
    { id: "cv", label: "Computer Vision & OCR", items: ["YOLOv8", "OpenCV", "Tesseract OCR"], core: ["YOLOv8", "OpenCV"] },
    { id: "frontend", label: "Frontend", items: ["React", "Vite", "Tailwind CSS", "Zustand", "Framer Motion", "Three.js", "WebGL / GLSL"], core: ["React", "Tailwind CSS"] },
    { id: "backend", label: "Backend & Data Stores", items: ["Node.js", "Express", "FastAPI", "PostgreSQL", "MySQL", "MongoDB", "Supabase", "SQLite", "Firebase"], core: ["FastAPI", "PostgreSQL"] },
    { id: "tools", label: "Services & Tools", items: ["Git", "GitHub", "Linux", "Vercel", "Electron", "Razorpay", "Resend", "Google Calendar API", "Overleaf / LaTeX"], core: ["Git", "Linux"] },
];

export const certifications = [
    { title: "Machine Learning Specialization", issuer: "Stanford University & DeepLearning.AI", date: "Jul 2026", platform: "Coursera" },
    { title: "Google Data Analytics Professional Certificate", issuer: "Google", date: "Aug 2026", platform: "Coursera" },
    { title: "Google Prompting Essentials Specialization", issuer: "Google", date: "Jul 2026", platform: "Coursera" },
    { title: "SQL Gold · SQL Intermediate · Python Gold · Python Basic", issuer: "HackerRank", date: "Jul 2026", platform: "HackerRank" },
    { title: "Getting Started with Cisco Packet Tracer", issuer: "Cisco Networking Academy", date: "Aug 2026", platform: "Cisco" },
    { title: "Creation of ML Models (Build 2026)", issuer: "Microsoft Learn", date: "Jan 2026", platform: "Microsoft" },
    { title: "Python 101 for Data Science", issuer: "IBM / Cognitive Class", date: "Dec 2025", platform: "IBM" },
    { title: "IBM Z Day 2025: AI & Data, Z Skills, Modernization, Security", issuer: "IBM", date: "Dec 2025", platform: "IBM" },
];

export const achievements = [
    { title: "Smart India Hackathon 2026 — National Round", org: "SIH26037 · MathWorks", date: "Sep 2026", detail: "Team lead for NAVIK, autonomous path planning for Indian roads.", kind: "hackathon" },
    { title: "IBM Z Datathon 2026", org: "IBM · Team Project HailMary", date: "Oct 2026", detail: "TrustPulse AI: sub-millisecond fraud scoring on LinuxONE and Telum II.", kind: "hackathon" },
    { title: "HackerRank Orchestrate", org: "HackerRank · Aug & Sep 2026", date: "2026", detail: "MessageMind (75% action / 83% type accuracy) and Buy or Wait affordability agent.", kind: "hackathon" },
    { title: "SRIHER Research Day 2026", org: "SRIHER", date: "2026", detail: "Presented Road-AI: YOLOv8 ensemble with depth-from-shadow and repair costing.", kind: "research" },
    { title: "Kaggle Competitions", org: "Kaggle", date: "2026", detail: "ROGII Wellbore Geology Prediction — public RMSE 136.002. Titanic — 78.71%. AgriYield AI published.", kind: "data" },
    { title: "SRIHER Innovation Day", org: "SRIHER", date: "2025", detail: "Showcased cybercrime-prevention and active-monitoring software.", kind: "research" },
];

export const research = [
    {
        title: "Three Histories of a Continent That Never Sank",
        venue: "Research paper · with interactive explorer",
        detail: "Traces the lost-continent idea through Sclater's Lemuria, Blavatsky's theosophy and the Tamil Kumari Kandam tradition, set against oceanographic evidence.",
        link: "https://kumarikandam-the-lost-mythology.vercel.app",
    },
    {
        title: "TRUST-TAB: When Should an LLM Refuse to Read a Table?",
        venue: "In preparation · IEEE format",
        detail: "Abstention and confidence-calibration benchmark for tabular QA built from FinQA, with 5 perturbation types, 4 confidence signals and 10 metrics.",
        link: "https://github.com/theflighttechofficial/TRUST-TAB-AI-source-validity-checker",
    },
];

export const writing = [
    {
        title: "How I Automated 3–4 Days of Manual Work at L&T Construction Using Python",
        venue: "Hashnode",
        url: "https://theflighttechlabs.hashnode.dev",
        note: "1,300+ impressions",
    },
];

export const nowBuilding = [
    { title: "DocuMind AI", detail: "Fine-tuning and evaluating a local Qwen3-4B answer model." },
    { title: "ResumeForge AI", detail: "Windows release of the offline ATS suite." },
    { title: "TRUST-TAB paper", detail: "Writing up the abstention benchmark results." },
    { title: "FocusBuddy", detail: "Windows companion that detects distracting apps and sites." },
];

// status: done | now | next
export const journey = [
    { date: "2024", title: "Started B.Tech CSE (AI & Data Analytics)", detail: "SRIHER, Chennai.", status: "done" },
    { date: "Jun – Aug 2025", title: "Web Design & Development Intern", detail: "Neoshaan Technologies — rebuilt the company site and its form backend.", status: "done" },
    { date: "Dec 2025 – Jan 2026", title: "IBM and Microsoft certifications", detail: "IBM Python 101, IBM Z Day, Microsoft Build ML models.", status: "done" },
    { date: "May – Jul 2026", title: "Data Analyst Intern at L&T Construction", detail: "Shipped the tender spec extractor and Scan2Sheet to production.", status: "done" },
    { date: "Jul – Aug 2026", title: "Stanford ML, Google Data Analytics, HackerRank Gold", detail: "Plus Google Prompting Essentials and Cisco Packet Tracer.", status: "done" },
    { date: "Aug – Oct 2026", title: "Hackathon season", detail: "HackerRank Orchestrate ×2, SIH 2026 (selected, team lead), IBM Z Datathon.", status: "done" },
    { date: "Now", title: "Building & writing", detail: "DocuMind, ResumeForge, the TRUST-TAB paper. German A2 → B2.", status: "now" },
    { date: "2027", title: "Second internship & GRE / IELTS", detail: "Looking for a data or applied-AI internship.", status: "next" },
    { date: "2028", title: "Graduate from SRIHER", detail: "Then a year in industry as a data analyst / engineer.", status: "next" },
    { date: "Fall 2029", title: "MS in Computer Science / Data Science", detail: "Target: Arizona State University.", status: "next" },
];

export const goals = {
    shortTerm: "A data analytics, data engineering or applied-AI internship in 2027.",
    longTerm: "MS in Computer Science / Data Science (target: Arizona State University, Fall 2029).",
};

// Illustrative sketches only — simplified re-creations, never the confidential production source.
export const codeSnippets = {
    rag: {
        title: "Hybrid retrieval with Reciprocal Rank Fusion",
        lang: "Python",
        code: `def hybrid_retrieve(query: str, k: int = 5) -> list[Chunk]:
    # Dense: semantic neighbours from FAISS
    q_vec = encoder.encode([query], normalize_embeddings=True)
    _, dense_ids = faiss_index.search(q_vec, k * 4)

    # Sparse: exact spec terms ("IP65", "11 kV") from BM25
    bm25_scores = bm25.get_scores(tokenize(query))
    sparse_ids = np.argsort(bm25_scores)[::-1][: k * 4]

    # Reciprocal Rank Fusion — rank-based, so no score calibration needed
    fused = defaultdict(float)
    for ranking in (dense_ids[0], sparse_ids):
        for rank, idx in enumerate(ranking):
            fused[idx] += 1.0 / (60 + rank)

    top = sorted(fused, key=fused.get, reverse=True)[:k]
    return [chunks[i] for i in top]`,
    },
    ocr: {
        title: "Preprocessing zero-text SLD scans for OCR",
        lang: "Python",
        code: `def extract_schedule(page_img: np.ndarray) -> list[dict]:
    gray = cv2.cvtColor(page_img, cv2.COLOR_BGR2GRAY)
    # Drawings have uneven toner — adaptive beats a global threshold
    binary = cv2.adaptiveThreshold(
        gray, 255, cv2.ADAPTIVE_THRESH_GAUSSIAN_C, cv2.THRESH_BINARY, 31, 9
    )
    data = pytesseract.image_to_data(
        binary, config="--psm 6", output_type=Output.DICT
    )
    rows = group_tokens_into_rows(data, y_tolerance=8)
    return [parse_feeder_row(r) for r in rows if looks_like_feeder(r)]`,
    },
    roadai: {
        title: "Road-AI: ensemble detection with uncertainty",
        lang: "Python",
        code: `def detect(frame, models, mc_passes=5, conf_floor=0.35):
    preds = []
    for m in models:                      # YOLOv8 ensemble
        for _ in range(mc_passes):        # Monte Carlo Dropout passes
            preds.extend(m(frame, augment=True)[0].boxes)

    boxes = weighted_box_fusion(preds, iou_thr=0.55)
    for b in boxes:
        b.uncertain = b.std_conf > 0.12   # flag for human review
    return [b for b in boxes if b.conf >= conf_floor]`,
    },
    hologram: {
        title: "Lumisphere: morphing the hologram per section",
        lang: "JavaScript · Three.js",
        code: `useFrame((_, delta) => {
  const target = shapes[activeSection];
  const pos = points.current.geometry.attributes.position.array;

  for (let i = 0; i < pos.length; i++) {
    pos[i] += (target[i] - pos[i]) * 0.08;   // ease toward next topology
  }
  points.current.geometry.attributes.position.needsUpdate = true;
  points.current.rotation.y += delta * speed;
});`,
    },
};

export const featuredProjects = projects.filter((p) => p.featured);

export const findProject = (query) => {
    const q = query.toLowerCase().trim();
    if (!q) return null;
    return (
        projects.find((p) => p.id === q) ||
        projects.find((p) => p.title.toLowerCase().includes(q)) ||
        projects.find((p) => q.includes(p.id.replace(/-/g, " ")) || q.includes(p.title.toLowerCase().split(" ")[0])) ||
        null
    );
};

export const plainTextResume = () => {
    const line = (s = "") => s + "\n";
    let out = "";
    out += line(profile.name.toUpperCase());
    out += line(`${profile.role} · ${profile.location}`);
    out += line(`${profile.email} · ${socials.find((s) => s.id === "linkedin").url} · ${socials.find((s) => s.id === "github").url}`);
    out += line();
    out += line("SUMMARY");
    out += line(profile.summary);
    out += line();
    out += line("EXPERIENCE");
    experience.forEach((e) => {
        out += line(`${e.role} — ${e.company} (${e.period}, ${e.location})`);
        e.points.forEach((p) => (out += line(`  • ${p}`)));
    });
    out += line();
    out += line("EDUCATION");
    out += line(`${education.degree} — ${education.school}, ${education.period}. CGPA ${education.cgpa}/10.`);
    out += line();
    out += line("SELECTED PROJECTS");
    featuredProjects.forEach((p) => (out += line(`  • ${p.title}: ${p.tagline} [${p.metrics.join(", ")}]`)));
    out += line();
    out += line("SKILLS");
    skillGroups.forEach((g) => (out += line(`  ${g.label}: ${g.items.join(", ")}`)));
    out += line();
    out += line("CERTIFICATIONS");
    certifications.forEach((c) => (out += line(`  • ${c.title} — ${c.issuer} (${c.date})`)));
    out += line();
    out += line("ACHIEVEMENTS");
    achievements.forEach((a) => (out += line(`  • ${a.title}: ${a.detail}`)));
    return out;
};
