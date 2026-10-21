import { useState, useEffect, useCallback, lazy, Suspense } from 'react';
import { AnimatePresence } from 'motion/react';
import ScrollProgress from './components/ScrollProgress';
import Navigation from './components/Navigation';
import Preloader from './components/Preloader';
import HeroAbout from './sections/HeroAbout';
import SmoothScroll from './components/SmoothScroll';
import { applyTheme, getStoredTheme } from './lib/theme';
import { startPauseOffscreen } from './lib/pauseOffscreen';
// Loaded on demand so the home page ships less JavaScript up front.
const Chatbot = lazy(() => import('./components/Chatbot'));
// Sections below the hero/About load in their own chunk, right after the first paint.
const BelowFold = lazy(() => import('./sections/BelowFold'));
const LazyFooter = lazy(() => import('./sections/BelowFold').then((m) => ({ default: m.Footer })));

/** Shows the footer only once every section above it has mounted. */
function FooterWhenReady() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const on = () => setReady(true);
    window.addEventListener('ks-sections-ready', on);
    return () => window.removeEventListener('ks-sections-ready', on);
  }, []);
  return ready ? <LazyFooter /> : null;
}
const KamelShahProfile = lazy(() => import('./pages/KamelShahProfile'));
const Showcase = lazy(() => import('./pages/Showcase'));
const CampusOneCaseStudy = lazy(() => import('./pages/CampusOneCaseStudy'));

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
  const isCaseStudyRoute = currentPath.toLowerCase().replace(/\/+$/, '') === '/work/campusone';

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

  // Looping decorative animations pause while off-screen.
  useEffect(() => startPauseOffscreen(), []);

  // Profile and showcase pages always stay light; the main page uses the saved theme.
  useEffect(() => {
    applyTheme(getStoredTheme());
  }, [currentPath]);

  const finishLoading = useCallback(() => setLoading(false), []);

  return (
    <div className="relative min-h-screen w-full bg-ivory font-sans text-ink">
      {!isShowcaseRoute && <a className="skip-link" href="#main-content">Skip to main content</a>}

      {/* Thin reading-progress hairline */}
      {!isShowcaseRoute && <ScrollProgress />}

      {/* Brief branded intro (logo) */}
      <AnimatePresence mode="wait">
        {loading && !isShowcaseRoute && !isCaseStudyRoute && <Preloader key="preloader" onComplete={finishLoading} />}
      </AnimatePresence>

      {isCaseStudyRoute ? (
        /* Project case study page */
        <>
          <SmoothScroll />
          <Suspense fallback={<div className="min-h-screen" />}><CampusOneCaseStudy /></Suspense>
        </>
      ) : isShowcaseRoute ? (
        /* Experimental museum + parallax landing page */
        <Suspense fallback={<div className="min-h-screen" />}><Showcase /></Suspense>
      ) : isProfileRoute ? (
        /* Dedicated Kamel Shah identity profile page */
        <Suspense fallback={<div className="min-h-screen" />}><KamelShahProfile onNavigateHome={navigateToHome} /></Suspense>
      ) : (
        /* Main portfolio page — natural document flow, no scroll-jacking */
        <>
          <SmoothScroll />
          <Navigation />
          <main id="main-content" tabIndex={-1} className="relative w-full outline-none">
            <HeroAbout />
            <Suspense fallback={<div className="min-h-screen" aria-hidden="true" />}>
              <BelowFold />
            </Suspense>
          </main>
          <Suspense fallback={null}>
            <FooterWhenReady />
          </Suspense>
        </>
      )}

      {/* Portfolio assistant */}
      {!isShowcaseRoute && <Suspense fallback={null}><Chatbot /></Suspense>}
    </div>
  );
}
