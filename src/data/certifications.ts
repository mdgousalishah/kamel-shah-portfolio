export interface Certification {
  id: string;
  title: string;
  issuer: string;
  date?: string;
  datetime?: string;
  type?: string;
  image?: string;
  category?: string;
  skills?: string[];
  recipient?: string;
  verificationAvailable?: boolean;
  certificateFile?: string;
}

export const CERTIFICATIONS: Certification[] = [
  {
    id: "cert-azure-essentials",
    title: "Microsoft Azure Essentials",
    issuer: "Microsoft and LinkedIn Learning",
    type: "Professional Certificate",
    date: "October 5, 2026",
    datetime: "2026-10-05",
    category: "Cloud Computing & Infrastructure",
    recipient: "Mohammed Gous Ali Shah",
    verificationAvailable: true,
    certificateFile: "/certificates/microsoft-azure-essentials.pdf",
    image: "/certificates/microsoft-azure-essentials.jpg",
    skills: ["Microsoft Azure", "Cloud Computing"]
  },
  {
    id: "cert-vbyld-2027",
    title: "Visit Bharat Young Leaders Dialogue (VBYLD) 2027 Quiz",
    issuer: "Ministry of Youth Affairs and Sports / MyBharat / MyGov",
    type: "Certificate of Participation",
    category: "National Leadership & Youth Dialogue",
    recipient: "Mohammed Gous Ali Shah Mohammed Mushtaque Ahmed",
    verificationAvailable: true,
    image: "/certificates/vbyld-2027-quiz.jpg",
    skills: ["Youth Leadership", "National Governance", "Innovation Awareness"]
  },
  {
    id: "cert-deloitte-tech",
    title: "Technology Job Simulation",
    issuer: "Deloitte / Forage",
    type: "Certificate of Completion",
    date: "September 26, 2026",
    datetime: "2026-09-26",
    category: "Software Development & Architecture",
    skills: ["Coding", "Development"],
    recipient: "Mohammed Gous Ali Shah Mohammed Mushtaque Ahmed",
    verificationAvailable: true,
    image: "/Photos/Deloitte Certificate.jpg",
    certificateFile: "/certificates/deloitte-technology-job-simulation.pdf"
  },
  {
    id: "cert-iitm-pravartak",
    title: "Advanced Certificate in UI-UX Design with Agentic AI and GenAI",
    issuer: "IIT Madras Pravartak Technologies Foundation",
    date: "2026–2027 (In Progress)",
    category: "AI & UI/UX Product Design",
    skills: ["UI/UX Design", "User-Centered Design", "Generative AI", "Agentic AI", "Design Thinking", "AI-Assisted Development"]
  },
  {
    id: "cert-ai",
    title: "The AI Masterclass",
    issuer: "Dhruv Rathee Academy",
    date: "2025",
    category: "Artificial Intelligence",
    image: "/Photos/certificate ai master class_page-0001.jpg",
    skills: ["Generative AI", "Prompt Engineering", "AI Workflows", "Productivity Automation"]
  },
  {
    id: "cert-seo",
    title: "Search Engine Optimization (SEO) with Squarespace",
    issuer: "Coursera Project Network",
    date: "2026",
    category: "Digital Growth & SEO",
    image: "/Photos/Coursera (SEO).jpg",
    skills: ["Technical SEO", "Keyword Research", "On-Page Optimization", "Website Visibility"]
  },
  {
    id: "cert-wordpress",
    title: "Build a Free Website with WordPress",
    issuer: "Coursera Project Network",
    date: "2024",
    category: "CMS & Web Development",
    image: "/Photos/Coursera Build a Free Websit with WordPress_page-0001.jpg",
    skills: ["WordPress Architecture", "Content Management", "Responsive UI", "Web Deployment"]
  },
  {
    id: "cert-business-analysis",
    title: "Business Analysis & Process Management",
    issuer: "Coursera Project Network",
    date: "2024",
    category: "Analytics & Strategy",
    image: "/Photos/Coursera Business Analysis & Process Management_page-0001.jpg",
    skills: ["Process Mapping", "Requirement Gathering", "Workflow Analysis", "System Optimization"]
  },
  {
    id: "cert-data-analysis",
    title: "Introduction to Data Analysis Using Microsoft Excel",
    issuer: "Coursera Project Network",
    date: "2024",
    category: "Data Analytics",
    image: "/Photos/Coursera Introduction to Data Analysis Using Microsoft Excel._page-0001.jpg",
    skills: ["Data Modeling", "Pivot Tables", "Formulas & Functions", "Data Visualization"]
  },
  {
    id: "cert-nielit",
    title: "Electronic Product Design & Prototyping",
    issuer: "NIELIT, Aurangabad",
    date: "2024",
    category: "Hardware & Computing",
    image: "/Photos/National Institute of Electronics & Information Technology, Aurangabad.jpg",
    skills: ["Electronic Hardware", "PCB Prototyping", "Embedded Systems", "Hardware-Software Integration"]
  },
  {
    id: "cert-design",
    title: "Adobe Illustrator & Graphic Design Training",
    issuer: "Design Academy",
    date: "2024",
    category: "Design & Creative Tools",
    skills: ["Vector Graphics", "UI Design Assets", "Brand Identity", "Visual Composition"]
  }
];
