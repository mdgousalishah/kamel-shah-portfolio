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
      {/* Interactive Custom Mouse Cursor */}
      <CustomCursor />

      {/* Reading Depth Progress Indicator */}
      <ScrollProgress />

      {/* Background Ambient Grid Layer */}
      <div className="pointer-events-none fixed inset-0 z-0 opacity-15">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_70%_70%_at_50%_50%,#000_60%,transparent_100%)]" />
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
          <main className="relative z-10 w-full flex flex-col">
            <HeroAbout />
            <Experience />
            <Skills />
            <Projects />
            <Services />
            <Education />
            <Certifications />
            <Contact />
          </main>
          <Footer />
        </>
      )}

      {/* Interactive Assistant Chatbot */}
      <Chatbot />
    </div>
  );
}
