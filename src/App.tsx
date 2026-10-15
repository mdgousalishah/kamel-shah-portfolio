import { useState, useEffect, useCallback } from 'react';
import { AnimatePresence } from 'motion/react';
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
import Showcase from './pages/Showcase';

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentPath, setCurrentPath] = useState(() => {
    if (typeof window !== 'undefined') {
      return window.location.pathname;
    }
    return '/';
  });

  const isProfileRoute = currentPath.toLowerCase().includes('kamel-shah');
  const isShowcaseRoute = currentPath.toLowerCase().startsWith('/showcase');

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

  const finishLoading = useCallback(() => setLoading(false), []);

  return (
    <div className="relative min-h-screen w-full bg-ivory font-sans text-ink">
      {!isShowcaseRoute && <a className="skip-link" href="#main-content">Skip to main content</a>}

      {/* Thin reading-progress hairline */}
      {!isShowcaseRoute && <ScrollProgress />}

      {/* Brief branded intro (logo) */}
      <AnimatePresence mode="wait">
        {loading && !isShowcaseRoute && <Preloader key="preloader" onComplete={finishLoading} />}
      </AnimatePresence>

      {isShowcaseRoute ? (
        /* Experimental museum + parallax landing page */
        <Showcase />
      ) : isProfileRoute ? (
        /* Dedicated Kamel Shah identity profile page */
        <KamelShahProfile onNavigateHome={navigateToHome} />
      ) : (
        /* Main portfolio page — natural document flow, no scroll-jacking */
        <>
          <Navigation />
          <main id="main-content" tabIndex={-1} className="relative w-full outline-none">
            <HeroAbout />
            <Skills />
            <Experience />
            <Projects />
            <Services />
            <Education />
            <Certifications />
            <Contact />
          </main>
          <Footer />
        </>
      )}

      {/* Portfolio assistant */}
      {!isShowcaseRoute && <Chatbot />}
    </div>
  );
}
