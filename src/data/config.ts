export const SITE_CONFIG = {
  primaryName: "Kamel Shah",
  fullName: "Mohammed Gous Ali Shah",
  name: "Kamel Shah",
  alias: "Kamel Shah",
  legalName: "Mohammed Gous Ali Shah",
  roles: [
    "Full-Stack Developer",
    "Agentic AI Developer",
    "IT & Technical Support"
  ],
  tagline: "Full-Stack Developer · Agentic AI Developer · IT & Technical Support",
  descriptor: "Software Developer · Full-Stack Web Development",
  email: "kamelshah2003@gmail.com",
  phone: "+91 7588571899",
  whatsapp: "+917588571899",
  whatsappMessage: "Hello Kamel, I visited your portfolio and would like to connect.",
  location: "Parbhani, Maharashtra, India",
  description: "Electronics & Computer Engineering professional focused on full-stack web development, practical technology solutions, and institutional IT operations.",
  resume: "/Photos/MOHAMMED%20GOUS%20ALI%20SHAH%20RESUME.pdf",
  logo: "/Photos/optimized/logo.webp",
  images: {
    hero: "/Photos/hero-portrait.jpg",
    heroWebp: "/Photos/optimized/hero-portrait.webp",
    heroWebpSmall: "/Photos/optimized/hero-portrait-600.webp",
    about: "/Photos/about-illustration.jpg",
    aboutWebp: "/Photos/optimized/about-illustration.webp"
  },
  socials: {
    github: "https://github.com/mdgousalishah",
    linkedin: "https://www.linkedin.com/in/mohammed-gous-ali-shah-988657214/",
    x: "https://x.com/Kamelshah07",
    website: "https://kamelshah.ai.studio",
    portfolio: "https://kamel-shah-portfolio.vercel.app/",
    // Bluesky intentionally left empty until a real profile URL is supplied.
    bluesky: ""
  },
  navLinks: [
    { label: "Home", href: "#home" },
    { label: "About", href: "#about" },
    { label: "Skills", href: "#skills" },
    { label: "Experience", href: "#experience" },
    { label: "Work", href: "#projects" },
    { label: "Services", href: "#services" },
    { label: "Education", href: "#education" },
    { label: "Certificates", href: "#certifications" },
    { label: "Contact", href: "#contact" }
  ]
};

/** WhatsApp deep link with a properly URL-encoded greeting. */
export const whatsappHref = (message: string = SITE_CONFIG.whatsappMessage) =>
  `https://wa.me/${SITE_CONFIG.whatsapp.replace(/\D/g, '')}?text=${encodeURIComponent(message)}`;

/** Social links that actually have a URL (keeps unspecified profiles hidden). */
export const SOCIAL_LINKS = [
  { key: 'github', label: 'GitHub', href: SITE_CONFIG.socials.github },
  { key: 'linkedin', label: 'LinkedIn', href: SITE_CONFIG.socials.linkedin },
  { key: 'x', label: 'X', href: SITE_CONFIG.socials.x },
  { key: 'website', label: 'Website', href: SITE_CONFIG.socials.website },
  { key: 'bluesky', label: 'Bluesky', href: SITE_CONFIG.socials.bluesky }
].filter((s) => s.href.trim().length > 0);
