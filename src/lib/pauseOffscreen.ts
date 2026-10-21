/**
 * Pauses looping CSS animations while their element is off-screen.
 * Mark an element with `data-pause-offscreen`; it gets `is-offscreen` when out of view,
 * and the CSS rule `.is-offscreen *` pauses its animations — so a robot blinking at the
 * bottom of the page doesn't cost every frame while you read the hero.
 */
export function startPauseOffscreen() {
  if (typeof IntersectionObserver === 'undefined') return () => {};
  const io = new IntersectionObserver(
    (entries) => entries.forEach((e) => e.target.classList.toggle('is-offscreen', !e.isIntersecting)),
    { rootMargin: '100px 0px' },
  );
  const seen = new WeakSet<Element>();
  const scan = () =>
    document.querySelectorAll('[data-pause-offscreen]').forEach((el) => {
      if (seen.has(el)) return;
      seen.add(el);
      el.classList.add('is-offscreen'); // start paused until the observer reports
      io.observe(el);
    });
  scan();
  // Sections mount progressively, so keep picking up new elements.
  const mo = new MutationObserver(scan);
  mo.observe(document.body, { childList: true, subtree: true });
  return () => {
    mo.disconnect();
    io.disconnect();
  };
}
