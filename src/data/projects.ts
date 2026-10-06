export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  tech: string[];
  description: string | string[];
  link?: string;
  github?: string;
  featured?: boolean;
  image: string;
}

export const PROJECTS: Project[] = [
  {
    id: "campusone",
    number: "01",
    title: "CAMPUSONE",
    category: "Education Technology & School ERP SaaS",
    tech: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "QR Code Generation", "Multi-Tenant Architecture"],
    description: [
      "Architected a centralized school administration and ERP SaaS platform for Kamel Education Society to streamline operations across educational institutions.",
      "Engineered an automated Institutional Badge ID Generator with dynamic QR code generation for student identification and credential verification.",
      "Built a Touch Roster Attendance Register for classroom attendance management, streamlining daily student tracking for staff.",
      "Implemented integrated accounting, bill & fees ledgers, and multi-tenant institutional record management for multi-school administration."
    ],
    github: "https://github.com/mdgousalishah",
    featured: true,
    image: "/Photos/CampusOne.png"
  },
  {
    id: "decent-apparels",
    number: "02",
    title: "DECENT APPARELS",
    category: "Full-Stack eCommerce Platform",
    tech: ["React 19", "Vite 6", "Tailwind CSS", "TypeScript", "Node.js", "Express", "MongoDB", "Zustand", "Lucide React"],
    description: [
      "Developed a full-stack apparel eCommerce platform with a responsive, modern interface using React 19, Vite 6, Tailwind CSS, and TypeScript.",
      "Architected modular TSX components and client-side state management with Zustand for seamless product browsing, shopping cart, and customer interactions.",
      "Designed Node.js/Express REST APIs and structured MongoDB/Mongoose data models for catalog management, customer reviews, order pipelines, and admin dashboards.",
      "Enhanced the shopping experience with smooth micro-interactions and modern visual styling powered by Lucide React and fluid transitions."
    ],
    link: "https://decent-apparels.vercel.app/",
    github: "https://github.com/mdgousalishah",
    featured: true,
    image: "/Photos/Decent.png"
  },
  {
    id: "soap-soul",
    number: "03",
    title: "THE SOAP & SOUL",
    category: "Handmade Skincare & Luxury eCommerce",
    tech: ["PHP", "Laravel", "JavaScript", "Bootstrap", "MySQL"],
    description: [
      "Designed and developed a premium eCommerce website for a handmade skincare brand featuring responsive, user-focused layouts.",
      "Implemented product browsing, interactive cart, checkout flow, payment coordination, and custom order options.",
      "Structured server-side workflows in PHP and Laravel with MySQL database integration for product management."
    ],
    link: "https://the-soap-soal.vercel.app/",
    github: "https://github.com/mdgousalishah",
    image: "/Photos/Soap & Soul.png"
  },
  {
    id: "masjid",
    number: "04",
    title: "MASJID E MEHTAB ALI SHAH / ASHOORKHANA NALE HYDER",
    category: "Community Trust & Institutional Portal",
    tech: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "Responsive Design"],
    description: [
      "Developed a responsive institutional portal for Masjid e Mehtab Ali Shah / Ashoorkhana Nale Hyder community trust and waqf organization.",
      "Created dynamic community features including a prayer time schedule dashboard, donation guidance, and photographic gallery.",
      "Engineered clean, accessible UI optimized for readability and fast performance across mobile and desktop devices."
    ],
    link: "https://anh-parbhani-git-fix-vercel-mohammed-gous-ali-shahs-projects.vercel.app/index.html",
    github: "https://github.com/mdgousalishah",
    image: "/Photos/Masjid.png"
  },
  {
    id: "shah-construction",
    number: "05",
    title: "SHAH CONSTRUCTION",
    category: "Corporate EPC & Engineering Website",
    tech: ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
    description: [
      "Designed and developed a corporate web presence for an engineering, procurement, and construction (EPC) firm.",
      "Engineered company profile, project showcase portfolio, technical service capabilities, and client inquiry forms.",
      "Structured clean, responsive layouts adhering to corporate branding and cross-device usability."
    ],
    link: "https://shah-construction-ru5d.vercel.app/index.html",
    github: "https://github.com/mdgousalishah",
    image: "/Photos/Shah Construction.png"
  },
  {
    id: "who-will-pay",
    number: "06",
    title: "WHO WILL PAY?",
    category: "Interactive Decision & Utility Web App",
    tech: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS", "LocalStorage", "Roulette Algorithm"],
    description: [
      "Engineered an interactive decision-making and expense utility application for fair group expense allocation.",
      "Built an animated roulette picker algorithm with dynamic sound effects and weighted random selection.",
      "Implemented LocalStorage state persistence for bill history, past payers, and custom participant presets with instant recall."
    ],
    link: "https://who-will-pays.vercel.app/",
    github: "https://github.com/mdgousalishah/Who-will-Pays",
    image: "/Photos/Who Will Pay.png"
  },
  {
    id: "lumen-apis",
    number: "07",
    title: "LARAVEL & LUMEN REST API SERVICES",
    category: "Modular Backend & API Development",
    tech: ["PHP", "Laravel", "Lumen", "REST APIs", "SQLite", "Postman"],
    description: [
      "Developed modular RESTful backend services using PHP, Laravel, and the lightweight Lumen micro-framework.",
      "Configured SQLite and relational databases with structured migrations, seeders, and model relationships.",
      "Implemented structured REST API routing, controller logic, CRUD endpoints, request validation, and comprehensive Postman API testing."
    ],
    github: "https://github.com/mdgousalishah",
    image: "/Photos/LumenAPIs.png"
  }
];
