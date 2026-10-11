/**
 * Motion for the homepage: smooth scrolling, and the GSAP timelines that the
 * hero, the work columns and the film register here.
 *
 * Everything is gated twice. The inline script in Hero.astro adds `motion`
 * to <html> only when the reader has not asked for reduced motion, and the
 * CSS that hides anything before it animates is scoped to that class. This
 * file runs only under the same condition. A reader with reduced motion, or
 * with no JavaScript, gets every section in its finished, readable state.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import 'lenis/dist/lenis.css';

gsap.registerPlugin(ScrollTrigger);

declare global {
  interface Window {
    __vidoraMotion?: boolean;
  }
}

export const motionAllowed = (): boolean =>
  document.documentElement.classList.contains('motion');

let lenis: Lenis | null = null;

/** Idempotent: every component calls it, the first call does the work. */
export function startSmoothScroll(): Lenis | null {
  if (lenis || !motionAllowed()) return lenis;
  window.__vidoraMotion = true;

  lenis = new Lenis({
    // Close to the reference's weight: the page glides, but stops where the
    // wheel stops rather than drifting on for a second.
    lerp: 0.1,
    wheelMultiplier: 1,
    // Touch keeps the platform's own scrolling. Re-implementing momentum on
    // a phone feels wrong to everyone who has one.
    syncTouch: false,
    anchors: true,
  });

  lenis.on('scroll', ScrollTrigger.update);
  gsap.ticker.add((time) => lenis?.raf(time * 1000));
  gsap.ticker.lagSmoothing(0);

  // Pinned sections measure the page. Fonts and the hero photograph change
  // those measurements after first layout, so measure again once they land.
  ScrollTrigger.config({ ignoreMobileResize: true });
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh(), { once: true });

  return lenis;
}

export { gsap, ScrollTrigger };
