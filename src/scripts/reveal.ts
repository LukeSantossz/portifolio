/**
 * Scroll reveal — the single motion implementation on the site.
 *
 * Every element marked `data-reveal` fades up once as it enters the viewport.
 * Elements sharing a `data-reveal-group` are staggered in source order.
 *
 * Fail-safe by construction, in two parts:
 *   1. A tiny inline script in `Layout.astro` arms the hidden state (adding
 *      `reveal-ready` to <html>) only when motion is allowed and the browser
 *      has IntersectionObserver, and disarms it again on a timer unless this
 *      module has taken over. So a module that never loads, or throws, cannot
 *      leave content hidden.
 *   2. The hidden state is one CSS rule behind one class, so removing the class
 *      always restores the page. The only inline style written is a
 *      `transition-delay` for the stagger, which never hides anything, unlike a
 *      library that stamps `opacity: 0` onto the element itself.
 */

/** Delay between siblings in the same group. Small enough to read as one move. */
const STAGGER_MS = 70;

export function initReveal(): void {
  const root = document.documentElement;
  const targets = Array.from(document.querySelectorAll<HTMLElement>('[data-reveal]'));

  if (targets.length === 0) return;

  // Reduced motion, or no observer support. The inline script does not arm the
  // class under either condition, so this is belt to that brace: it also covers
  // the visitor who flips the OS setting after the page has loaded.
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (prefersReducedMotion || !('IntersectionObserver' in window)) {
    root.classList.remove('reveal-ready');
    targets.forEach((el) => el.classList.add('is-revealed'));
    return;
  }

  // Position within its group, so a group staggers without the observer having
  // to know anything about source order at reveal time.
  const groupCounts = new Map<string, number>();
  const delays = new WeakMap<HTMLElement, number>();

  for (const el of targets) {
    const group = el.dataset.revealGroup;

    if (!group) continue;

    const position = groupCounts.get(group) ?? 0;
    groupCounts.set(group, position + 1);
    delays.set(el, position * STAGGER_MS);
  }

  const observer = new IntersectionObserver(
    (entries) => {
      for (const entry of entries) {
        if (!entry.isIntersecting) continue;

        const el = entry.target as HTMLElement;
        const delay = delays.get(el) ?? 0;

        el.style.transitionDelay = `${delay}ms`;
        el.classList.add('is-revealed');
        observer.unobserve(el);
      }
    },
    // threshold 0: an element taller than the viewport can never reach a
    // fractional threshold, and would otherwise stay hidden forever.
    { rootMargin: '0px 0px -10% 0px', threshold: 0 },
  );

  targets.forEach((el) => observer.observe(el));

  // Tell the inline script's failsafe that the reveal is live, so it leaves the
  // armed state alone. Set last: before this line, disarming is still correct.
  root.dataset.revealActive = '1';
}
