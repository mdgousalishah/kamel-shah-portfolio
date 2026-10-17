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
    id: "cert-sdn-work-productivity",
    title: "Work Productivity Tools",
    issuer: "Skills Development Network (SDN) · Wadhwani Foundation",
    type: "Microcertificate of Completion",
    date: "October 18, 2026",
    datetime: "2026-10-18",
    category: "Workplace Productivity",
    recipient: "Mohammad Gous Ali Shah",
    verificationAvailable: true,
    certificateFile: "/certificates/SDN Work Productivity Tools Certificate.pdf",
    image: "/Photos/sdn-work-productivity-tools.jpg",
    skills: ["Productivity Tools", "Digital Workplace Skills", "Office Software", "Workflow Efficiency"]
  },
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
    certificateFile: "/certificates/CertificateOfCompletion_Microsoft Azure Essentials Professional Certificate by Microsoft and LinkedIn.pdf",
    image: "/Photos/microsoft-azure-essentials.jpg",
    skills: ["Microsoft Azure", "Cloud Computing", "Identity & Access Management", "Cloud Architecture"]
  },
  {
    id: "cert-agentic-ai",
    title: "Agentic AI: Build Your First Agentic AI System",
    issuer: "LinkedIn Learning",
    type: "Certificate of Completion",
    date: "October 2026",
    category: "Agentic AI & Autonomous Systems",
    recipient: "Mohammed Gous Ali Shah",
    verificationAvailable: true,
    certificateFile: "/certificates/CertificateOfCompletion_Agentic AI Build Your First Agentic AI System.pdf",
    image: "/Photos/agentic-ai-first-system.jpg",
    skills: ["Agentic AI", "Autonomous Agents", "LLM Workflows", "Prompt Orchestration"]
  },
  {
    id: "cert-deloitte-tech",
    title: "Technology Job Simulation",
    issuer: "Deloitte / Forage",
    type: "Certificate of Completion",
    date: "September 26, 2026",
    datetime: "2026-09-26",
    category: "Software Development & Architecture",
    recipient: "Mohammed Gous Ali Shah Mohammed Mushtaque Ahmed",
    verificationAvailable: true,
    image: "/Photos/deloitte-technology-simulation.jpg",
    certificateFile: "/certificates/Deloitte Certificate.pdf",
    skills: ["Software Engineering", "System Design", "Technical Communication", "Code Review"]
  },
  {
    id: "cert-ai-masterclass",
    title: "The AI Masterclass",
    issuer: "Dhruv Rathee Academy",
    type: "Course Certificate",
    date: "2025",
    category: "Artificial Intelligence & Automation",
    image: "/Photos/certificate-ai-masterclass.jpg",
    certificateFile: "/certificates/certificate ai master class.pdf",
    skills: ["Generative AI", "Prompt Engineering", "AI Workflows", "Productivity Automation"]
  },
  {
    id: "cert-seo",
    title: "Search Engine Optimization (SEO) with Squarespace",
    issuer: "Coursera Project Network",
    type: "Guided Project Certificate",
    date: "2026",
    category: "Digital Growth & SEO",
    image: "/Photos/coursera-seo-squarespace.jpg",
    certificateFile: "/certificates/Coursera (SEO).pdf",
    skills: ["Technical SEO", "Keyword Research", "On-Page Optimization", "Website Visibility"]
  },
  {
    id: "cert-wordpress",
    title: "Build a Free Website with WordPress",
    issuer: "Coursera Project Network",
    type: "Guided Project Certificate",
    date: "2024",
    category: "CMS & Web Development",
    image: "/Photos/coursera-wordpress.jpg",
    certificateFile: "/certificates/Coursera Build a Free Websit with WordPress.pdf",
    skills: ["WordPress Architecture", "Content Management", "Responsive UI", "Web Deployment"]
  },
  {
    id: "cert-business-analysis",
    title: "Business Analysis & Process Management",
    issuer: "Coursera Project Network",
    type: "Guided Project Certificate",
    date: "2024",
    category: "Analytics & Strategy",
    image: "/Photos/coursera-business-analysis.jpg",
    certificateFile: "/certificates/Coursera Business Analysis & Process Management.pdf",
    skills: ["Process Mapping", "Requirement Gathering", "Workflow Analysis", "System Optimization"]
  },
  {
    id: "cert-data-analysis",
    title: "Introduction to Data Analysis Using Microsoft Excel",
    issuer: "Coursera Project Network",
    type: "Guided Project Certificate",
    date: "2024",
    category: "Data Analytics",
    image: "/Photos/coursera-data-analysis-excel.jpg",
    certificateFile: "/certificates/Coursera Introduction to Data Analysis Using Microsoft Excel..pdf",
    skills: ["Data Modeling", "Pivot Tables", "Formulas & Functions", "Data Visualization"]
  },
  {
    id: "cert-nielit",
    title: "Bootcamp on Unmanned Aerial Systems (UAS)",
    issuer: "NIELIT Aurangabad",
    type: "Bootcamp Certificate",
    date: "2024",
    category: "Hardware & Robotics",
    image: "/Photos/nielit-uas-bootcamp.jpg",
    skills: ["Unmanned Aerial Systems", "Embedded Hardware", "Drone Architectures", "Sensors & Flight Control"]
  },
  {
    id: "cert-vbyld-2027",
    title: "Viksit Bharat Young Leaders Dialogue (VBYLD) 2027 Quiz",
    issuer: "Ministry of Youth Affairs and Sports / MyBharat",
    type: "Certificate of Participation",
    date: "2026",
    category: "National Leadership & Governance",
    recipient: "Mohammed Gous Ali Shah Mohammed Mushtaque Ahmed",
    verificationAvailable: true,
    image: "/Photos/vbyld-2027-quiz.jpg",
    certificateFile: "/certificates/certificate_b19f34856065c6e2f50583b888211f7e_2445_bfeca96b3dbd.pdf",
    skills: ["Youth Leadership", "National Governance", "Innovation Awareness"]
  },
  {
    id: "cert-nasha-mukt",
    title: "Nasha Mukt Bharat Abhiyaan–Yuva Sashaktikaran Quiz",
    issuer: "Ministry of Social Justice and Empowerment / MyBharat",
    type: "Certificate of Participation",
    date: "2026",
    category: "National Youth Empowerment",
    recipient: "Mohammed Gous Ali Shah",
    verificationAvailable: true,
    image: "/Photos/nasha-mukt-bharat-quiz.png",
    skills: ["Social Welfare", "Youth Empowerment", "Community Advocacy"]
  }
];
