import { useEffect, useState } from 'react';
import { Moon, Sun } from 'lucide-react';
import { getStoredTheme, setTheme, type Theme } from '../lib/theme';

/** Round sun/moon button that switches the site between light and dark. */
export default function ThemeToggle({ className = '' }: { className?: string }) {
  const [theme, setLocal] = useState<Theme>(() => (typeof window === 'undefined' ? 'light' : getStoredTheme()));

  // Keep every toggle on the page (desktop + mobile) in sync.
  useEffect(() => {
    const onChange = (e: Event) => setLocal((e as CustomEvent<Theme>).detail);
    window.addEventListener('ks-theme-change', onChange);
    return () => window.removeEventListener('ks-theme-change', onChange);
  }, []);

  const dark = theme === 'dark';

  return (
    <button
      type="button"
      onClick={() => setTheme(dark ? 'light' : 'dark')}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      aria-pressed={dark}
      title={dark ? 'Light mode' : 'Dark mode'}
      className={`relative inline-flex h-11 w-11 items-center justify-center overflow-hidden rounded-full border border-line text-ink transition-colors hover:border-ink ${className}`}
    >
      <Sun
        size={17}
        aria-hidden="true"
        className={`absolute transition-all duration-500 ${dark ? 'rotate-0 scale-100 opacity-100' : '-rotate-90 scale-50 opacity-0'}`}
      />
      <Moon
        size={17}
        aria-hidden="true"
        className={`absolute transition-all duration-500 ${dark ? 'rotate-90 scale-50 opacity-0' : 'rotate-0 scale-100 opacity-100'}`}
      />
    </button>
  );
}
