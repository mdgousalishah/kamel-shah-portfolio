import { useState, useEffect } from 'react';
import { AnimatePresence } from 'motion/react';
import CustomCursor from './components/CustomCursor';
import ScrollProgress from './components/ScrollProgress';
import Navigation from './components/Navigation';
import Preloader from './components/Preloader';
import HeroAbout from './sections/HeroAbout';
import Experience from './sections/Experience';
import Skills from './sections/Skills';
import Projects from './sections/Projects';
import Services from './sections/Services';
import Education from './sections/Education';
import Certifications from './sections/Certifications';
import Contact from './sections/Contact';
import Footer from './components/Footer';
import Chatbot from './components/Chatbot';
import ScrollReveal from './components/ScrollReveal';
import KamelShahProfile from './pages/KamelShahProfile';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  const isProfileRoute = currentPath.toLowerCase().includes('kamel-shah');

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname);
    };
    window.addEventListener('popstate', handlePopState);

    // Global intercept for internal links to /kamel-shah or /
    const handleLinkClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest('a');
      if (!target) return;
      const href = target.getAttribute('href');
      if (!href) return;

      if (href === '/kamel-shah' || href === '/kamel-shah/') {
        e.preventDefault();
        window.history.pushState({}, '', '/kamel-shah');
        setCurrentPath('/kamel-shah');
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else if (href === '/' || (href.startsWith('/#') && isProfileRoute)) {
        e.preventDefault();
        const hash = href.includes('#') ? href.substring(href.indexOf('#')) : '';
        window.history.pushState({}, '', '/' + hash);
        setCurrentPath('/');
        if (hash) {
          setTimeout(() => {
            const el = document.querySelector(hash);
            if (el) el.scrollIntoView({ behavior: 'smooth' });
          }, 100);
        } else {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }
      }
    };

    document.addEventListener('click', handleLinkClick);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      document.removeEventListener('click', handleLinkClick);
    };
  }, [isProfileRoute]);

  const navigateToHome = () => {
    window.history.pushState({}, '', '/');
    setCurrentPath('/');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="relative w-full min-h-screen bg-[#08080A] text-[#F3F4F6] font-sans selection:bg-indigo-500/30 selection:text-white">
      <a className="skip-link" href="#main-content">Skip to main content</a>
      {/* Interactive Custom Mouse Cursor */}
      <CustomCursor />

      {/* Reading Depth Progress Indicator */}
      <ScrollProgress />

      {/* Soft color fields and a low contrast grid add depth without competing with content. */}
      <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-0 overflow-hidden">
        <div className="absolute -top-64 left-[8%] h-[34rem] w-[34rem] rounded-full bg-indigo-600/[0.08] blur-[130px]" />
        <div className="absolute top-[38%] -right-64 h-[32rem] w-[32rem] rounded-full bg-cyan-500/[0.045] blur-[140px]" />
        <div className="absolute inset-0 opacity-[0.12] bg-[linear-gradient(rgba(255,255,255,0.025)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.025)_1px,transparent_1px)] bg-[size:5rem_5rem] [mask-image:radial-gradient(ellipse_75%_70%_at_50%_35%,#000_30%,transparent_100%)]" />
      </div>

      {/* Cinematic Fast Preloader */}
      <AnimatePresence mode="wait">
        {loading && <Preloader key="preloader" onComplete={() => setLoading(false)} />}
      </AnimatePresence>

      {isProfileRoute ? (
        /* Dedicated Kamel Shah Identity Profile Page */
        <KamelShahProfile onNavigateHome={navigateToHome} />
      ) : (
        /* Full Main Portfolio Page */
        <>
          <Navigation />
          <main id="main-content" tabIndex={-1} className="relative z-10 w-full flex flex-col">
            <HeroAbout />
            <ScrollReveal><Experience /></ScrollReveal>
            <ScrollReveal><Skills /></ScrollReveal>
            <ScrollReveal><Projects /></ScrollReveal>
            <ScrollReveal><Services /></ScrollReveal>
            <ScrollReveal><Education /></ScrollReveal>
            <ScrollReveal><Certifications /></ScrollReveal>
            <ScrollReveal><Contact /></ScrollReveal>
          </main>
          <Footer />
        </>
      )}

      {/* Interactive Assistant Chatbot */}
      <Chatbot />
    </div>
  );
}
