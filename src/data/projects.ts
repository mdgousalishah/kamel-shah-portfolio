export interface Project {
  id: string;
  number: string;
  title: string;
  category: string;
  /** One-line italic summary shown under the title. */
  tagline?: string;
  tech: string[];
  description: string | string[];
  link?: string;
  github?: string;
  featured?: boolean;
  image: string;
  /** Optimised copy served first; `image` remains the original fallback. */
  imageWebp?: string;
}

export const PROJECTS: Project[] = [
  {
    id: "campusone",
    number: "01",
    title: "CampusOne",
    category: "Multi-Tenant School ERP SaaS · In development",
    tagline: "One school ERP with three portals and strict tenant isolation.",
    tech: [
      "React 19", "TypeScript", "Vite", "Tailwind CSS v4", "React Router v7",
      "React Hook Form", "Zod", "Supabase", "PostgreSQL", "Row-Level Security",
      "Supabase Auth", "Edge Functions (Deno)", "jsPDF", "QR Code", "Vitest"
    ],
    description: [
      "Building a multi-tenant school ERP SaaS for Kamel Education Society, with separate portals for super admins, school staff, and parents.",
      "Enforced tenant isolation and role-based access for five roles using PostgreSQL Row-Level Security, covered by automated SQL security tests.",
      "Built student, guardian, staff, and academic-year management with CSV import/export, plus an audited school-approval workflow.",
      "Generates student ID cards with server-issued QR codes, a public verification page, and printable A4 PDF sheets."
    ],
    github: "https://github.com/mdgousalishah",
    featured: true,
    image: "/Photos/CampusOne.png",
    imageWebp: "/Photos/optimized/CampusOne.webp"
  },
  {
    id: "decent-apparels",
    number: "02",
    title: "Decent Apparels",
    category: "Full-Stack eCommerce Platform",
    tagline: "A full-stack storefront for a readymade garment retailer.",
    tech: ["React", "TypeScript", "Tailwind CSS", "Node.js", "Express", "MongoDB", "Zustand"],
    description: [
      "Engineered a full-stack apparel eCommerce platform with responsive catalog browsing and shopping cart interactions.",
      "Built client-side state management with Zustand and structured modular component hierarchy.",
      "Implemented RESTful backend endpoints in Node.js and Express with MongoDB database models for product and order management."
    ],
    link: "https://decent-apparels.vercel.app/",
    github: "https://github.com/mdgousalishah",
    featured: true,
    image: "/Photos/Decent.png",
    imageWebp: "/Photos/optimized/Decent.webp"
  },
  {
    id: "soap-soul",
    number: "03",
    title: "The Soap & Soul",
    category: "Handmade Skincare & Luxury eCommerce",
    tagline: "An online storefront for a handmade skincare brand.",
    tech: ["PHP", "Laravel", "JavaScript", "Bootstrap", "MySQL"],
    description: [
      "Designed and developed an eCommerce website for a handmade skincare brand featuring responsive, user-friendly layouts.",
      "Implemented product catalog browsing, cart functionality, and customer order inquiries.",
      "Structured server-side controllers in PHP and Laravel with MySQL database integration."
    ],
    link: "https://the-soap-soal.vercel.app/",
    github: "https://github.com/mdgousalishah",
    featured: true,
    image: "/Photos/Soap-and-Soul.png",
    imageWebp: "/Photos/optimized/Soap-and-Soul.webp"
  },
  {
    id: "masjid",
    number: "04",
    title: "Masjid Mehtab Ali Shah",
    category: "Community Trust & Institutional Portal",
    tagline: "A clear, fast home online for a community institution.",
    tech: ["HTML5", "CSS3", "JavaScript", "Bootstrap", "Responsive Layout"],
    description: [
      "Developed a responsive institutional portal for Masjid e Mehtab Ali Shah / Ashoorkhana Nale Hyder community organization.",
      "Built dynamic features including prayer time schedule displays, community announcements, and photographic gallery.",
      "Optimized for fast loading and clean readability across mobile and desktop devices."
    ],
    link: "https://anh-parbhani-git-fix-vercel-mohammed-gous-ali-shahs-projects.vercel.app/index.html",
    github: "https://github.com/mdgousalishah",
    image: "/Photos/Masjid.png",
    imageWebp: "/Photos/optimized/Masjid.webp"
  },
  {
    id: "shah-construction",
    number: "05",
    title: "Shah Construction",
    category: "Corporate EPC & Engineering Website",
    tagline: "A corporate web presence for an EPC firm.",
    tech: ["HTML5", "CSS3", "JavaScript", "Bootstrap"],
    description: [
      "Designed and developed a corporate web presence for an engineering, procurement, and construction (EPC) firm.",
      "Engineered company profile sections, service capabilities overview, project showcases, and client inquiry forms.",
      "Ensured cross-browser compatibility and responsive performance on all screen sizes."
    ],
    link: "https://shah-construction-ru5d.vercel.app/index.html",
    github: "https://github.com/mdgousalishah",
    image: "/Photos/Shah-Construction.png",
    imageWebp: "/Photos/optimized/Shah-Construction.webp"
  },
  {
    id: "who-will-pay",
    number: "06",
    title: "Who Will Pay?",
    category: "Interactive Decision & Utility Web App",
    tagline: "Settling the group bill fairly — with a little drama.",
    tech: ["HTML5", "CSS3", "JavaScript", "Tailwind CSS", "LocalStorage"],
    description: [
      "Engineered an interactive decision-making expense utility application for fair group expense allocation.",
      "Built an animated random selection algorithm with audio cues and customizable participant inputs.",
      "Implemented LocalStorage state persistence for bill history and participant lists."
    ],
    link: "https://who-will-pays.vercel.app/",
    github: "https://github.com/mdgousalishah/Who-will-Pays",
    image: "/Photos/Who-Will-Pay.png",
    imageWebp: "/Photos/optimized/Who-Will-Pay.webp"
  }
];
