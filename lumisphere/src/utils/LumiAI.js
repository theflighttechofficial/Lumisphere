// Lumi AI Response Engine & Knowledge Graph
export const LumiAIKnowledge = {
    profile: {
        name: "S. Varun Vaibhav",
        role: "Production Data Systems & AI Engineer",
        education: "B.Tech CSE (AI & Data Analytics) @ SRIHER Chennai (2028), CGPA 7.7/10 (Upward Trajectory: 6.86 -> 7.68)",
        target: "MS in Data Science @ Arizona State University (ASU) in 2029",
        contact: "Email: Umasubramanian81@gmail.com | Phone: +91 9384000748 | Chennai, India"
    },

    recruiterQA: [
        {
            q: "Why hire Varun?",
            a: "Varun doesn't just write code—he ships production automation tools that save actual company money. During his internship at L&T Construction, he engineered a Hybrid RAG spec extractor that cut document turnaround time from 3-4 days to minutes, and reduced token costs from $22 to $2 (90%+ savings). He also possesses a strong upward CGPA trajectory (6.86 -> 7.68) and holds verified Stanford ML & Google Prompting credentials."
        },
        {
            q: "Explain his L&T Construction internship experience",
            a: "At L&T Construction (Buildings & Factories IC, May-Jul 2026), Varun engineered two production tools: 1) A Hybrid RAG Spec Extractor combining FAISS dense vector search, BM25 keyword matching, and RRF reranking for 1,200+ page blueprints. 2) An OCR SLD Extractor using Tesseract OCR for AutoCAD zero-text electrical PDFs. He received an official Letter of Recommendation (LOR) from Sr. Data Scientist Naveen Raj (NAVEEN-RAJ-B@LNTECC.COM)."
        },
        {
            q: "What is his CGPA and academic standing?",
            a: "Varun is a 2nd-year B.Tech student in AI & Data Analytics at SRIHER Chennai (2024-2028). His current CGPA is 7.7/10, reflecting a steep upward trajectory (6.86 -> 7.68), having cleared all 2 arrears in his very 1st attempt."
        },
        {
            q: "What are his future career plans?",
            a: "Varun plans to graduate from SRIHER in 2028, work as a Data Analyst / AI Engineer (target ₹8-12 LPA), and enroll in the MS in Data Science program at Arizona State University (ASU) in 2029 to pursue a career in US Data Engineering / ML Systems ($95K - $130K+)."
        }
    ],

    projects: [
        {
            name: "L&T Hybrid RAG Spec Extractor",
            tech: "Python, FAISS, BM25, Reciprocal Rank Fusion (RRF), PyMuPDF, OpenAI / LLMs",
            impact: "Processed 1,200+ page industrial blueprints, reducing review time from 3-4 days to minutes and token cost from $22 to $2.",
            desc: "A first-of-its-kind production tool in L&T Analytics Division. Combines dense semantic vector search with sparse keyword search to extract specs at 65-70% accuracy."
        },
        {
            name: "AutoCAD SLD OCR Diagram Parser",
            tech: "Tesseract OCR, PyMuPDF, Python, OpenCV",
            impact: "Automated electrical single-line diagram data extraction for PDFs with zero embedded text layer.",
            desc: "Created custom image preprocessing and OCR bounding-box parsers deployed in L&T analytics workflow."
        },
        {
            name: "Road-AI Hazard & Depth Detection",
            tech: "YOLOv8, MiDaS Monocular Depth Estimation, PyTorch, OpenCV",
            impact: "Real-time pothole and crack detection with estimated distance mapping presented at SRIHER Research Day 2026.",
            desc: "Combines object detection bounding boxes with pixel-level depth maps to estimate road hazard severity."
        },
        {
            name: "Lumisphere 3D Scene Engine",
            tech: "React 19, Vite, Three.js, WebGL GLSL Shaders, Web Audio API",
            impact: "Interactive 3D developer workspace hosted on Vercel with zero-asset real-time sound synthesis.",
            desc: "Features atmospheric volumetric lighting, physics-based desk items, and procedural Web Audio synthesizers."
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
        if (input.includes("cgpa") || input.includes("grade") || input.includes("academic") || input.includes("sriher")) {
            return LumiAIKnowledge.recruiterQA[2].a;
        }
        if (input.includes("future") || input.includes("asu") || input.includes("master") || input.includes("goals")) {
            return LumiAIKnowledge.recruiterQA[3].a;
        }

        // 2. Project Explanations
        if (input.includes("rag") || input.includes("spec extractor")) {
            const p = LumiAIKnowledge.projects[0];
            return `🚀 ${p.name}:\n• Tech Stack: ${p.tech}\n• Impact: ${p.impact}\n• Description: ${p.desc}`;
        }
        if (input.includes("ocr") || input.includes("autocad") || input.includes("sld")) {
            const p = LumiAIKnowledge.projects[1];
            return `📐 ${p.name}:\n• Tech Stack: ${p.tech}\n• Impact: ${p.impact}\n• Description: ${p.desc}`;
        }
        if (input.includes("road") || input.includes("yolo") || input.includes("hazard")) {
            const p = LumiAIKnowledge.projects[2];
            return `🛣️ ${p.name}:\n• Tech Stack: ${p.tech}\n• Impact: ${p.impact}\n• Description: ${p.desc}`;
        }

        // 3. Resume Pitch & Elevator Summary
        if (input.includes("pitch") || input.includes("summarize") || input.includes("summary") || input.includes("who is varun")) {
            return `📜 EXECUTIVE PITCH (30-SEC):\nS. Varun Vaibhav is a 2nd-year B.Tech (AI & Data Analytics) student at SRIHER Chennai (CGPA 7.7/10) and former Data Analyst Intern at L&T Construction. He specializes in Hybrid RAG vector search pipelines, OpenCV/OCR automation, and WebGL full-stack systems. Holds Stanford ML & Google Prompting credentials, targeting MS in Data Science at Arizona State University (2029).`;
        }

        // 4. Skill Recommendations
        if (input.includes("skills") || input.includes("recommend") || input.includes("stack")) {
            return `💡 TOP RECOMMENDED SKILLS FOR VARUN:\n1. GenAI / Hybrid RAG: FAISS, BM25, RRF, Prompt Engineering\n2. Data Engineering: Python, SQL (5-Star Gold Badge), pandas, NumPy\n3. Machine Learning: scikit-learn, XGBoost, YOLOv8, PyTorch\n4. Full-Stack Web: React 19, Vite, Tailwind CSS, WebGL, Web Audio API`;
        }

        // 5. Context Awareness Response
        if (context.weather || context.timeOfDay) {
            return `🤖 Lumi AI Online! Context Aware: [Time: ${context.timeOfDay || "Night"} | Weather: ${context.weather || "Clear"}]. Varun is an AI & Data Analytics engineer with production RAG experience at L&T Construction ($22->$2 cost opt). Type 'pitch', 'l&t', 'rag', 'why hire', or 'skills' for quick answers!`;
        }

        return `🤖 Lumi AI Assistant: Varun is a Data Analyst Intern (L&T Construction) specializing in Hybrid RAG, Computer Vision, and Full-Stack AI. Try asking: "Why hire Varun?", "Explain the RAG project", "Summarize resume", or "Recommend skills".`;
    }
}
