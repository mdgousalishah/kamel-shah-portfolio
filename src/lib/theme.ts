/**
 * Light / dark theme for the main portfolio page.
 * The choice is stored per browser; the first visit follows the light design.
 * The /kamel-shah and /showcase pages have their own fixed styling and always stay light.
 */
export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'ks-theme';
const THEME_COLORS: Record<Theme, string> = { light: '#F3F0E8', dark: '#151413' };

const themedRoute = () => {
  const path = window.location.pathname.toLowerCase();
  return !path.includes('kamel-shah') && !path.startsWith('/showcase');
};

export function getStoredTheme(): Theme {
  try {
    return localStorage.getItem(STORAGE_KEY) === 'dark' ? 'dark' : 'light';
  } catch {
    return 'light';
  }
}

/** Applies the theme to <html> (or clears it on routes that stay light). */
export function applyTheme(theme: Theme) {
  const root = document.documentElement;
  const effective: Theme = themedRoute() ? theme : 'light';
  if (effective === 'dark') root.setAttribute('data-theme', 'dark');
  else root.removeAttribute('data-theme');
  document.querySelector('meta[name="theme-color"]')?.setAttribute('content', THEME_COLORS[effective]);
}

export function setTheme(theme: Theme) {
  try {
    localStorage.setItem(STORAGE_KEY, theme);
  } catch {
    /* Storage unavailable (private mode): the theme still applies for this visit. */
  }
  const root = document.documentElement;
  root.classList.add('theme-switching');
  applyTheme(theme);
  window.setTimeout(() => root.classList.remove('theme-switching'), 400);
  window.dispatchEvent(new CustomEvent<Theme>('ks-theme-change', { detail: theme }));
}
