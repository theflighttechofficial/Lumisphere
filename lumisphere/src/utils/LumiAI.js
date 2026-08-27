// Lumi AI Response Engine & Knowledge Graph
export const LumiAIKnowledge = {
    profile: {
        name: "S. Varun Vaibhav",
        brand: "The Flight Tech Labs | Data Engineer • AI/ML Builder • Full-Stack Developer",
        education: "3rd-year B.Tech CSE (AI & Data Analytics) @ Sri Ramachandra Faculty of Engineering and Technology (SRIHER), Chennai (2024-2028), CGPA 7.7/10 (Upward Trajectory: 6.86 -> 7.00 -> 7.39 -> 7.68 -> 7.7)",
        philosophy: "Ship working code, not prototypes. Solve real problems, not hypothetical ones.",
        target: "MS in Computer Science / Data Science @ Arizona State University (ASU) (Fall 2029), with a 1-year work placement (2028-2029) at a top analytics firm (Target ₹8-12 LPA).",
        contact: "Email: Umasubramanian81@gmail.com | Phone: +91 9384000748 | Location: Chennai, India",
        socials: {
            github: "github.com/theflighttechofficial",
            linkedin: "linkedin.com/in/varun-vaibhav-s-11b69a2ba",
            kaggle: "kaggle.com/theflighttechofficial",
            hackerrank: "hackerrank.com/umasubramanian81",
            hashnode: "theflighttechlabs.hashnode.dev",
            leetcode: "leetcode.com/theflighttechofficial",
            portfolio: "lumisphere-nine.vercel.app"
        }
    },

    recruiterQA: [
        {
            q: "Why hire Varun?",
            a: "Varun doesn't just write code—he ships production automation systems that save actual enterprise money. During his internship at L&T Construction Analytics, he engineered a Hybrid RAG spec extractor processing 1,200+ pages daily, cutting turnaround time from 3-4 days to minutes and reducing token costs from $22 to $2 (91% reduction). He holds an upward 7.7 CGPA (cleared all 2 arrears in 1st attempt), 8 verified certifications (Stanford ML, Google Prompting, HackerRank Gold in Python & SQL, Cisco Packet Tracer), and ranked #1006/1983 globally in HackerRank Orchestrate August 2026."
        },
        {
            q: "Explain his L&T Construction internship experience",
            a: "At L&T Construction (Buildings & Factories IC, May-Jul 2026), Varun built two active production systems processing 1,200+ pages daily: 1) A Hybrid RAG PDF-to-Excel Extractor combining FAISS dense vector search, BM25 sparse keyword search, and RRF reranking with ThreadPoolExecutor parallelism & 3-layer pickle caching (65-70% accuracy, 91% cost reduction). 2) An OCR SLD Extractor using Tesseract OCR for AutoCAD zero-text electrical PDFs (70%+ accuracy). He received a signed Letter of Recommendation (LOR) from Sr. Data Scientist Naveen Raj B and HR Manager."
        },
        {
            q: "What are his key projects?",
            a: "Varun's portfolio includes: 1) Anchora: Full-Stack SaaS platform (React, TS, Zustand, Supabase, ~30 migrations, 27 tables, 5 user roles, GPT-4o-mini AI cofounder/investor matching). 2) DocFlow Systems (SIH 2026 Problem SIH25057): Legal Metrology compliance checker for 50M+ e-commerce product listings using EfficientDet, Tesseract OCR, spaCy NER, FastAPI, and React. 3) Road-AI (VidMarg): Ensemble YOLOv8 + MC Dropout + MiDaS depth estimation + PWD cost engine + SHA256 blockchain tracking (mAP50 0.648, presented at SRIHER Research Day 2026). 4) Paws & Care Clinic Website: React + Node.js + Express + PostgreSQL + Google Calendar API appointment engine."
        },
        {
            q: "What is his CGPA and academic standing?",
            a: "Varun is a 3rd-year B.Tech student in CSE (AI & Data Analytics) at SRIHER Chennai (2024-2028). His current CGPA is 7.7/10, showing a steady upward trajectory (6.86 -> 7.00 -> 7.39 -> 7.68 -> 7.7), having cleared both arrears (Data Structures & DSD) in Sem 3 supplementary. Achieved O grades in DBMS, Data Analytics, Machine Learning, Advanced C++, and Linux Labs."
        },
        {
            q: "What are his future career and higher education plans?",
            a: "Varun plans to graduate from SRIHER in May 2028, complete a 1-year placement at a top analytics firm (target ₹8-12 LPA, target firms: Mu Sigma, Fractal, LatentView, Tiger Analytics), and enroll in the MS in CS / Data Science program at Arizona State University (ASU) in Fall 2029."
        }
    ],

    projects: [
        {
            name: "Anchora (Anchorpoint) SaaS Platform",
            tech: "React, TypeScript, Zustand, Supabase, PostgreSQL, Edge Functions, GPT-4o-mini API, Tailwind CSS",
            impact: "Dual-layer SaaS (freelancer workspace + startup ecosystem) with 60+ routes, ~30 migrations, 27 normalized tables, 5 user roles.",
            desc: "Pitched SaaS platform with AI cofounder matching, pitch analyzer, investor matchmaking, proposal generator, and contract summarizer."
        },
        {
            name: "DocFlow Systems (SIH 2026)",
            tech: "Python, React, FastAPI, PostgreSQL, FAISS, EfficientDet, Tesseract OCR, spaCy NER, TensorFlow Lite",
            impact: "Legal Metrology Compliance Checker (Problem SIH25057) for 50M+ e-commerce product listings (360x faster, 3-5 days -> 15 mins).",
            desc: "Automated compliance verification engine for Legal Metrology Rules 2011 + 2026 amendments across Amazon, Flipkart, Meesho."
        },
        {
            name: "L&T Hybrid RAG Spec Extractor",
            tech: "Python, FAISS, BM25, Reciprocal Rank Fusion (RRF), GPT-4o, ThreadPoolExecutor, SentenceTransformers",
            impact: "Processed 1,200+ page blueprints daily, cutting review time from 3-4 days to minutes and token cost from $22 to $2 (91% reduction).",
            desc: "First-of-its-kind production tool in L&T Analytics Division with 3-layer pickle caching and 65-70% extraction accuracy."
        },
        {
            name: "L&T AutoCAD SLD OCR Parser",
            tech: "Tesseract OCR, OpenCV, PyMuPDF, Python",
            impact: "Automated electrical single-line diagram data extraction for zero-text layer AutoCAD PDFs with 70%+ accuracy.",
            desc: "Custom rasterization preprocessing, BUS label detection, and rotated-text parsing deployed in production."
        },
        {
            name: "Road-AI (VidMarg) Damage Detection",
            tech: "YOLOv8, MiDaS Monocular Depth Estimation, PyTorch, OpenCV, SHA256 Blockchain, gTTS",
            impact: "mAP50 0.648 on RDD2022 benchmark, 38% false positive reduction. Presented at SRIHER Research Day 2026.",
            desc: "Ensemble YOLOv8 with Monte Carlo Dropout uncertainty, physics-based depth estimation, PWD rate cost estimation, and blockchain audit logs."
        },
        {
            name: "Paws & Care Clinic Web App",
            tech: "React, Tailwind CSS, Node.js, Express, PostgreSQL, Google Calendar API",
            impact: "Full-stack veterinary clinic management & online booking platform for Paws & Care Clinic.",
            desc: "Online appointment booking system, service directory, pet health blog, doctor profiles, and admin dashboard."
        }
    ]
};

export class LumiAIEngine {
    static query(userInput, context = {}) {
        const input = userInput.toLowerCase().trim();

        // 1. Recruiter Q&A matching
        if (input.includes("why hire") || input.includes("why should we hire")) {
            return LumiAIKnowledge.recruiterQA[0].a;
        }
        if (input.includes("l&t") || input.includes("internship") || input.includes("experience") || input.includes("lor")) {
            return LumiAIKnowledge.recruiterQA[1].a;
        }
        if (input.includes("projects") || input.includes("anchora") || input.includes("docflow") || input.includes("sih")) {
            return LumiAIKnowledge.recruiterQA[2].a;
        }
        if (input.includes("cgpa") || input.includes("grade") || input.includes("academic") || input.includes("sriher")) {
            return LumiAIKnowledge.recruiterQA[3].a;
        }
        if (input.includes("future") || input.includes("asu") || input.includes("master") || input.includes("goals")) {
            return LumiAIKnowledge.recruiterQA[4].a;
        }

        // 2. Project Explanations
        if (input.includes("anchora") || input.includes("saas")) {
            const p = LumiAIKnowledge.projects[0];
            return `🚀 ${p.name}:\n• Tech Stack: ${p.tech}\n• Impact: ${p.impact}\n• Description: ${p.desc}`;
        }
        if (input.includes("docflow") || input.includes("compliance") || input.includes("metrology")) {
            const p = LumiAIKnowledge.projects[1];
            return `📜 ${p.name}:\n• Tech Stack: ${p.tech}\n• Impact: ${p.impact}\n• Description: ${p.desc}`;
        }
        if (input.includes("rag") || input.includes("spec extractor")) {
            const p = LumiAIKnowledge.projects[2];
            return `⚡ ${p.name}:\n• Tech Stack: ${p.tech}\n• Impact: ${p.impact}\n• Description: ${p.desc}`;
        }
        if (input.includes("ocr") || input.includes("autocad") || input.includes("sld")) {
            const p = LumiAIKnowledge.projects[3];
            return `📐 ${p.name}:\n• Tech Stack: ${p.tech}\n• Impact: ${p.impact}\n• Description: ${p.desc}`;
        }
        if (input.includes("road") || input.includes("yolo") || input.includes("hazard")) {
            const p = LumiAIKnowledge.projects[4];
            return `🛣️ ${p.name}:\n• Tech Stack: ${p.tech}\n• Impact: ${p.impact}\n• Description: ${p.desc}`;
        }

        // 3. Resume Pitch & Elevator Summary
        if (input.includes("pitch") || input.includes("summarize") || input.includes("summary") || input.includes("who is varun")) {
            return `📜 EXECUTIVE PITCH (30-SEC):\nS. Varun Vaibhav is a 3rd-year B.Tech CSE (AI & Data Analytics) student at SRIHER Chennai (CGPA 7.7/10) and former Data Analyst Intern at L&T Construction. He builds production-ready AI & Data systems—including L&T's Hybrid RAG Spec Extractor ($22->$2 cost opt, 1,200+ pgs/day), Anchora SaaS, DocFlow Systems (SIH 2026), and Road-AI (SRIHER Research Day 2026). Holds 8 verified certs (Stanford ML, Google Prompting, HackerRank Gold Python & SQL, Cisco) and ranked #1006/1983 in HackerRank Orchestrate 2026. Target: 1-yr placement (₹8-12 LPA) -> MS in CS/DS @ Arizona State University (Fall 2029).`;
        }

        // 4. Skill Recommendations
        if (input.includes("skills") || input.includes("recommend") || input.includes("stack")) {
            return `💡 TOP RECOMMENDED SKILLS FOR VARUN:\n1. GenAI / Hybrid RAG: FAISS, BM25, RRF, GPT-4o API, SentenceTransformers\n2. Data Engineering: Python, SQL (HackerRank Gold 5-Star), pandas, NumPy, PostgreSQL, Supabase\n3. Machine Learning & CV: YOLOv8, scikit-learn, XGBoost, SHAP, Tesseract OCR, spaCy NER\n4. Full-Stack Web: React, TypeScript, Zustand, Node.js, Express, Tailwind CSS, WebGL (Three.js)`;
        }

        // 5. Context Awareness Response
        if (context.weather || context.timeOfDay) {
            return `🤖 Lumi AI Online! Context Aware: [Time: ${context.timeOfDay || "Night"} | Weather: ${context.weather || "Clear"}]. S. Varun Vaibhav — 3rd-Year B.Tech CSE (AI & DA) @ SRIHER. Former L&T Data Analyst Intern ($22->$2 cost opt). Type 'pitch', 'l&t', 'rag', 'anchora', 'docflow', or 'skills' for quick answers!`;
        }

        return `🤖 Lumi AI Assistant: S. Varun Vaibhav is an AI & Data Engineer specializing in Hybrid RAG, Computer Vision, and Full-Stack SaaS. Try asking: "Why hire Varun?", "Explain Anchora SaaS", "Explain DocFlow Systems", "Explain L&T RAG", "Summarize resume", or "Recommend skills".`;
    }
}
