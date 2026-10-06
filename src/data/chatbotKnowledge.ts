import { SITE_CONFIG } from './config';

export const CHATBOT_KNOWLEDGE = {
  profile: {
    name: "Kamel Shah",
    fullName: "Mohammed Gous Ali Shah",
    preferredName: "Kamel Shah",
    role: "Full-Stack Developer",
    positioning: "Electronics & Computer Engineer • Full-Stack Developer • Agentic AI Developer",
    specialties: ["Full-Stack Web Development", "React 19", "TypeScript", "Node.js", "Express.js", "PHP & Laravel", "MongoDB", "PostgreSQL", "Generative AI", "Agentic AI"],
    location: "Parbhani, Maharashtra, India",
    summary: "Kamel Shah, also known professionally as Mohammed Gous Ali Shah, is an Electronics & Computer Engineering student at PES College of Engineering, Aurangabad (Expected 2026) concurrently pursuing an Online MBA in Artificial Intelligence & Machine Learning at Dr. D. Y. Patil Vidyapeeth, Pune (2026–2028). He completed his B.A. from YCMOU (2026) and is enrolled in the Advanced Certificate in UI-UX Design with Agentic AI and GenAI from IIT Madras Pravartak. He completed a software engineering job simulation with Deloitte / Forage (September 2026), builds full-stack applications, secure REST APIs, and has hands-on IT operations experience across 5 schools for Kamel Education Society."
  },
  experience: [
    {
      company: "Kamel Education Society",
      role: "IT Support",
      duration: "June 2023 – Present",
      location: "Parbhani, Maharashtra",
      details: [
        "Administered IT infrastructure across 5 schools.",
        "Maintained and managed 10–20 workstation computers, network routing, and hardware.",
        "Resolved hardware, system software, and Wi-Fi/LAN connectivity issues for 100+ students and 10+ faculty members.",
        "Supported institutional digital systems and platforms including the rollout and operation of the CampusOne ERP system.",
        "Delivered technical staging and AV/IT support for educational events and workshops."
      ]
    },
    {
      company: "Bilim Technologies",
      role: "Developer Intern",
      duration: "September 2025 – November 2025",
      details: [
        "3-Month Internship focusing on modular frontend engineering (HTML, CSS, JavaScript, Bootstrap).",
        "Gained practical codebase exposure to PHP, Laravel, and MySQL database schemas.",
        "Applied REST API concepts for frontend/backend integration."
      ]
    }
  ],
  education: [
    {
      degree: "Bachelor of Technology (B.Tech)",
      institution: "PES College of Engineering, Aurangabad",
      field: "Electronics & Computer Engineering",
      duration: "Expected 2026"
    },
    {
      degree: "Online Master of Business Administration (MBA)",
      institution: "Dr. D. Y. Patil Vidyapeeth, Pune",
      field: "Artificial Intelligence & Machine Learning",
      duration: "2026 – 2028 (In Progress)"
    },
    {
      degree: "Bachelor of Arts (B.A.)",
      institution: "Yashwantrao Chavan Maharashtra Open University",
      field: "Humanities & Social Sciences",
      duration: "Completed 2026"
    },
    {
      degree: "Advanced Certificate in UI-UX Design with Agentic AI and GenAI",
      institution: "IIT Madras Pravartak Technologies Foundation",
      field: "UI/UX Design • User-Centered Design • Generative AI • Agentic AI",
      duration: "2026 – 2027 (In Progress)"
    }
  ],
  projects: [
    {
      name: "CampusOne",
      description: "School administration and ERP SaaS platform for Kamel Education Society featuring Institutional Badge ID Generator with QR codes, Touch Roster Attendance Register, fees ledger, and multi-tenant management.",
      technologies: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "QR Code Generation", "Multi-Tenant Architecture"]
    },
    {
      name: "Decent Apparels",
      description: "Full-stack apparel eCommerce platform with responsive interface, Zustand state management, product browsing, cart functionality, and Node/Express/MongoDB REST APIs.",
      technologies: ["React 19", "Vite 6", "Tailwind CSS", "TypeScript", "Node.js", "Express", "MongoDB", "Zustand", "Lucide React"],
      link: "https://decent-apparels.vercel.app/"
    },
    {
      name: "The Soap & Soul",
      description: "Luxury eCommerce website for a handmade skincare brand with product browsing, shopping cart, checkout/payment, and custom-order functionality.",
      technologies: ["PHP", "Laravel", "JavaScript", "Bootstrap", "MySQL"],
      link: "https://the-soap-soal.vercel.app/"
    },
    {
      name: "Masjid e Mehtab Ali Shah / Ashoorkhana Nale Hyder",
      description: "Responsive institutional portal with prayer timetable dashboard, donation guidance, gallery, and accessible design.",
      technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
      link: "https://anh-parbhani-git-fix-vercel-mohammed-gous-ali-shahs-projects.vercel.app/index.html"
    },
    {
      name: "Shah Construction",
      description: "Corporate EPC website showcasing company profile, construction project showcase, engineering capabilities, and client inquiries.",
      technologies: ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
      link: "https://shah-construction-ru5d.vercel.app/index.html"
    },
    {
      name: "Who Will Pay?",
      description: "Interactive decision-making and expense utility application featuring an animated roulette algorithm, LocalStorage persistence, and responsive UI.",
      technologies: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS", "LocalStorage"],
      link: "https://who-will-pays.vercel.app/"
    },
    {
      name: "Laravel & Lumen REST API Services",
      description: "Modular RESTful backend services built with PHP, Laravel, and Lumen micro-framework featuring SQLite databases, request validation, and Postman testing.",
      technologies: ["PHP", "Laravel", "Lumen", "REST APIs", "SQLite", "Postman"]
    }
  ],
  skills: {
    programming: ["Java", "Python", "JavaScript", "TypeScript", "C", "PHP"],
    frontend: ["React", "React 19", "Vite", "Tailwind CSS", "HTML", "CSS", "Bootstrap"],
    backend: ["Node.js", "Express.js", "Laravel", "Lumen", "REST APIs"],
    databases: ["MongoDB", "Mongoose", "MySQL", "SQLite", "PostgreSQL", "pgvector", "Vector Embeddings / Search Concepts"],
    ai: ["Artificial Intelligence", "Machine Learning", "Generative AI", "Agentic AI", "LLMs", "AI-Assisted Development"],
    uiux: ["UI/UX Design", "User-Centered Design", "Design Thinking"],
    iot: ["ESP8266 / NodeMCU", "Raspberry Pi", "MQTT", "BLE", "UART"],
    tools: ["Git", "GitHub", "Microsoft Excel", "Microsoft Office", "WordPress", "VS Code", "Postman"]
  },
  certifications: [
    {
      name: "Microsoft Azure Essentials",
      issuer: "Microsoft and LinkedIn Learning",
      year: "October 5, 2026",
      details: "Professional Certificate covering Cloud Computing, Microsoft Azure Architecture, and cloud services (Certificate ID: 1a101259252798a35f716c0fc58ef5208f49a78ba816eefa61a53830744c75a8)."
    },
    {
      name: "Visit Bharat Young Leaders Dialogue (VBYLD) 2027 Quiz",
      issuer: "Ministry of Youth Affairs and Sports / MyBharat / MyGov",
      details: "Certificate of Participation in national youth dialogue and leadership quiz."
    },
    {
      name: "Technology Job Simulation",
      issuer: "Deloitte / Forage",
      year: "September 26, 2026",
      details: "Completed practical tasks in Coding and Development."
    },
    {
      name: "Advanced Certificate in UI-UX Design with Agentic AI and GenAI",
      issuer: "IIT Madras Pravartak Technologies Foundation",
      year: "2026–2027 (In Progress)"
    },
    {
      name: "The AI Masterclass",
      issuer: "Dhruv Rathee Academy",
      year: "2025"
    },
    {
      name: "Search Engine Optimization (SEO) with Squarespace",
      issuer: "Coursera Project Network",
      year: "2026"
    },
    {
      name: "Build a Free Website with WordPress",
      issuer: "Coursera Project Network",
      year: "2024"
    },
    {
      name: "Business Analysis & Process Management",
      issuer: "Coursera Project Network",
      year: "2024"
    },
    {
      name: "Introduction to Data Analysis Using Microsoft Excel",
      issuer: "Coursera Project Network",
      year: "2024"
    },
    {
      name: "Electronic Product Design & Prototyping",
      issuer: "NIELIT, Aurangabad",
      year: "2024"
    },
    {
      name: "Adobe Illustrator & Graphic Design Training",
      issuer: "Design Academy",
      year: "2024"
    }
  ],
  services: [
    "Full-Stack Web Development",
    "Frontend Engineering & Modern UI",
    "Digital Visibility & Technical SEO"
  ],
  links: {
    github: "https://github.com/mdgousalishah",
    linkedin: "https://www.linkedin.com/in/mohammed-gous-ali-shah-mohammed-mushtaque-ahmed-988657214",
    x: "https://x.com/Kamelshah07",
    website: "https://kamelshah.ai.studio/",
    whatsapp: "https://wa.me/917588571899"
  }
};

const hasAny = (query: string, terms: string[]) => terms.some((term) => query.includes(term));

export function getChatbotResponse(query: string): string {
  const q = query.toLowerCase().replace(/[’']/g, "'").replace(/\s+/g, " ").trim();
  if (!q) return "Ask me about Kamel's projects, skills, experience, education, services, or how to get in touch.";

  if (/^(hello|hi|hey|good morning|good afternoon|good evening)\b/.test(q)) {
    return "Hi! I can help you explore Kamel's work, technical background, services, or contact details. What are you looking for?";
  }
  if (hasAny(q, ["thank", "thx", "thanks"])) return "You're welcome! If you'd like, I can also point you to a project or help you contact Kamel.";

  const projectAliases: Record<string, string[]> = {
    "CampusOne": ["campusone", "campus one", "school erp"],
    "Decent Apparels": ["decent apparels", "decent apparel", "ecommerce", "e-commerce", "online store"],
    "The Soap & Soul": ["soap & soul", "soap and soul", "skincare"],
    "Masjid e Mehtab Ali Shah / Ashoorkhana Nale Hyder": ["masjid", "ashoor", "community portal"],
    "Shah Construction": ["shah construction", "construction site", "epc"],
    "Who Will Pay?": ["who will pay", "roulette", "expense app", "bill app"],
    "Laravel & Lumen REST API Services": ["laravel & lumen", "laravel and lumen", "laravel/lumen", "lumen api project", "laravel lumen project"],
  };
  const specificProject = CHATBOT_KNOWLEDGE.projects.find((project) =>
    projectAliases[project.name]?.some((alias) => q.includes(alias))
  );
  if (specificProject) {
    const link = specificProject.link ? `\n\nLive project: ${specificProject.link}` : "";
    return `**${specificProject.name}**\n${specificProject.description}\n\n**Built with:** ${specificProject.technologies.join(", ")}${link}`;
  }

  if (hasAny(q, ["project", "projects", "portfolio", "what has he built", "show me his work", "featured work"])) {
    const projects = CHATBOT_KNOWLEDGE.projects.map((project) => `• **${project.name}** — ${project.description}`).join("\n\n");
    return `Here are Kamel's featured projects:\n\n${projects}\n\nThe project cards in the Selected Work section include available demos and source links.`;
  }

  const isGeneralAboutQuestion = hasAny(q, ["who is", "about kamel", "introduce", "bio", "background"])
    || (q.includes("tell me about") && !hasAny(q, ["project", "work", "skill", "experience", "education", "cert", "service", "technology"]));
  if (isGeneralAboutQuestion) {
    return `**${CHATBOT_KNOWLEDGE.profile.name}** is an Electronics & Computer Engineering professional focused on full-stack web development, Agentic AI, and IT support. He is based in ${CHATBOT_KNOWLEDGE.profile.location}.\n\nHe supports IT operations across five schools, builds practical web applications and APIs, and continues his studies in engineering, AI/ML, and UI/UX design.`;
  }

  if (hasAny(q, ["service", "services", "offer", "hire", "freelance", "what can he do", "what does he do for clients"])) {
    return `Kamel offers:\n\n${CHATBOT_KNOWLEDGE.services.map((service) => `• **${service}**`).join("\n")}\n\nFor a project inquiry, use ${CHATBOT_KNOWLEDGE.links.whatsapp} or email ${CHATBOT_KNOWLEDGE.profile.name} at ${SITE_CONFIG.email}.`;
  }

  if (hasAny(q, ["experience", "job", "intern", "career", "worked", "work history"])) {
    const relevant = q.includes("bilim")
      ? CHATBOT_KNOWLEDGE.experience.filter((item) => item.company.toLowerCase().includes("bilim"))
      : q.includes("school") || q.includes("kamel education")
        ? CHATBOT_KNOWLEDGE.experience.filter((item) => item.company.toLowerCase().includes("education"))
        : CHATBOT_KNOWLEDGE.experience;
    return `Kamel's practical experience:\n\n${relevant.map((item) => `**${item.role} — ${item.company}** (${item.duration})\n${item.details.join(" ")}`).join("\n\n")}`;
  }

  if (hasAny(q, ["education", "degree", "university", "college", "b.tech", "mba", "iit", "study", "studies"])) {
    const education = CHATBOT_KNOWLEDGE.education.map((item) => `• **${item.degree}** — ${item.institution} (${item.duration})`).join("\n");
    return `Kamel's education and current study:\n\n${education}`;
  }

  if (hasAny(q, ["cert", "certificate", "course", "credential", "training"])) {
    const certifications = CHATBOT_KNOWLEDGE.certifications.map((item) => {
      const year = item.year ? `, ${item.year}` : "";
      return `• **${item.name}** — ${item.issuer}${year}`;
    }).join("\n");
    return `Kamel's credentials include:\n\n${certifications}\n\nYou can view certificate details in the Credentials section.`;
  }

  if (hasAny(q, ["contact", "email", "phone", "reach", "resume", "whatsapp", "linkedin", "github", "social", "available"])) {
    return `You can contact Kamel here:\n\n• **Email:** ${SITE_CONFIG.email}\n• **Phone / WhatsApp:** ${SITE_CONFIG.phone}\n• **LinkedIn:** ${CHATBOT_KNOWLEDGE.links.linkedin}\n• **GitHub:** ${CHATBOT_KNOWLEDGE.links.github}\n• **Resume:** available from the Resume button in the hero.`;
  }

  if (hasAny(q, ["skill", "skills", "technology", "technologies", "tech stack", "programming", "language", "frontend", "backend", "database", "react", "node", "python", "php", "ai", "genai", "agentic", "rag"])) {
    if (hasAny(q, ["frontend", "react", "css", "ui", "design"])) return `**Frontend & UI:** ${CHATBOT_KNOWLEDGE.skills.frontend.join(", ")}\n\n**UI/UX:** ${CHATBOT_KNOWLEDGE.skills.uiux.join(", ")}`;
    if (hasAny(q, ["backend", "node", "php", "api", "server"])) return `**Backend:** ${CHATBOT_KNOWLEDGE.skills.backend.join(", ")}\n\n**Languages:** ${CHATBOT_KNOWLEDGE.skills.programming.join(", ")}`;
    if (hasAny(q, ["database", "mongo", "mysql", "postgres", "vector", "rag"])) return `**Databases & retrieval:** ${CHATBOT_KNOWLEDGE.skills.databases.join(", ")}`;
    if (hasAny(q, ["ai", "genai", "agentic", "rag", "llm", "machine learning"])) return `**AI focus:** ${CHATBOT_KNOWLEDGE.skills.ai.join(", ")}\n\nRelated skills include ${CHATBOT_KNOWLEDGE.skills.databases.filter((skill) => /vector|embedding/i.test(skill)).join(" and ")}.`;
    return `Kamel's strongest areas are **full-stack application development**, **responsive frontend engineering**, **REST API development**, and **institutional IT support**. His day-to-day stack includes React, TypeScript, Node.js, Express, PHP, Laravel, MongoDB, and MySQL. He is also building experience with Generative AI, Agentic AI, and RAG workflows.`;
  }

  return "I don't have a specific answer for that yet. I can help with Kamel's projects, skills, experience, education, certifications, services, or contact details. Try asking about one of those.";
}
