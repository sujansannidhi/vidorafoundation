/**
 * The motion engine.
 *
 * Backgrounds are deliberately NOT animated here. Each stage paints its own
 * colour in CSS and bleeds into its neighbours with a gradient, because
 * driving background colour from scroll while text colour is fixed by a class
 * produces an invisible page the moment the two disagree.
 *
 * One scrubbed timeline is the single source of truth. Figure position, road
 * dashoffset, background crossfade and object reveals all read from it, so
 * nothing can desync from anything else.
 *
 * Everything animated here is transform or opacity. The road is an SVG stroke,
 * not a canvas. Nothing that the reader is trying to read ever moves.
 */
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { MotionPathPlugin } from 'gsap/MotionPathPlugin';

gsap.registerPlugin(ScrollTrigger, MotionPathPlugin);

/** She is already walking when the page loads. Not at the start line. */
const START_PROGRESS = 0.06;

export function initJourney(): void {
  const journey = document.querySelector<HTMLElement>('[data-journey]');
  const figure = document.querySelector<SVGSVGElement>('[data-figure]');
  const walked = document.querySelector<SVGPathElement>('[data-road-walked]');
  if (!journey || !figure || !walked) return;

  document.documentElement.classList.remove('no-journey-js');

  const mm = gsap.matchMedia();

  // ---------------------------------------------------------------- //
  // Reduced motion. Not a checkbox: an unskippable scroll narrative is
  // hostile to anyone with vestibular sensitivity. Every stage renders at
  // its final state and the page reads as a complete static document.
  // ---------------------------------------------------------------- //
  mm.add('(prefers-reduced-motion: reduce)', () => {
    document.documentElement.classList.add('is-static-journey');
    // Road fully drawn, figure placed partway along it, everything at its
    // final state. The page must read as a complete static document, not as a
    // broken one: she is still on the road, she just is not travelling it.
    gsap.set(walked, { strokeDasharray: 'none', strokeDashoffset: 0 });
    gsap.set(figure, {
      opacity: 1,
      motionPath: { path: walked, align: walked, alignOrigin: [0.5, 0.95], start: 0.5, end: 0.5 },
    });
    gsap.set('[data-provided], [data-missing]', { opacity: 1, y: 0 });
    gsap.set('[data-impact-rule]', { scaleX: 1 });
  });

  // ---------------------------------------------------------------- //
  // The scrubbed journey. Desktop and mobile share one timeline and differ
  // only in road geometry and parallax, so there is one behaviour to reason
  // about rather than two.
  // ---------------------------------------------------------------- //
  mm.add(
    {
      isDesktop: '(min-width: 48.0625rem) and (prefers-reduced-motion: no-preference)',
      isMobile: '(max-width: 48rem) and (prefers-reduced-motion: no-preference)',
    },
    (context) => {
      const { isDesktop } = context.conditions as { isDesktop: boolean };

      const length = walked.getTotalLength();
      gsap.set(walked, {
        strokeDasharray: length,
        strokeDashoffset: length * (1 - START_PROGRESS),
      });
      gsap.set(figure, { opacity: 1 });

      const tl = gsap.timeline({
        defaults: { ease: 'none' },
        scrollTrigger: {
          trigger: journey,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      // The road draws in ahead of her as she advances. Legibility, not
      // illumination: nothing shines on her, the road simply becomes visible.
      tl.to(walked, { strokeDashoffset: 0, duration: 1 }, 0);

      // She travels the same geometry the road is drawn from, so the two can
      // never drift apart.
      tl.to(
        figure,
        {
          motionPath: {
            path: walked,
            align: walked,
            alignOrigin: [0.5, 0.95],
            start: START_PROGRESS,
            end: 1,
            autoRotate: false, // a person walking a hill does not tilt
          },
          duration: 1,
          // Timeline children default to immediateRender:false, which leaves
          // the figure stranded at the origin until the first scroll event.
          // She is already walking when the page loads, so this must render now.
          immediateRender: true,
        },
        0,
      );

      // Parallax on the road layer only, and only on desktop. Text never
      // parallaxes. Nothing moves that the reader is trying to read.
      if (isDesktop) {
        gsap.to('[data-road-group]', {
          yPercent: -2.5,
          ease: 'none',
          scrollTrigger: { trigger: journey, start: 'top top', end: 'bottom bottom', scrub: 1.2 },
        });
      }

      // Objects along the road enter as she reaches them, and the impact rule
      // draws rather than the digits counting up.
      revealOnPass('[data-provided]', 'is-in');
      revealOnPass('[data-missing]', 'is-in');
      drawRules();

      return () => {
        gsap.set(walked, { clearProps: 'all' });
        gsap.set(figure, { clearProps: 'all' });
      };
    },
  );

  // Road geometry swaps between breakpoints; recompute path length and offsets.
  document.addEventListener('road:geometry', () => ScrollTrigger.refresh());
  window.addEventListener('load', () => ScrollTrigger.refresh());
}

/** Reveals an element as the figure reaches it. Transform and opacity only. */
function revealOnPass(selector: string, cls: string): void {
  gsap.utils.toArray<HTMLElement>(selector).forEach((el, i) => {
    gsap.fromTo(
      el,
      { opacity: 0, y: 14 },
      {
        opacity: 1,
        y: 0,
        duration: 0.5,
        ease: 'power2.out',
        delay: (i % 8) * 0.04,
        scrollTrigger: { trigger: el, start: 'top 88%', once: true },
        onStart: () => el.classList.add(cls),
      },
    );
  });
}

/**
 * The copper rule beneath each impact figure draws.
 * The digits do NOT animate: they are correct on arrival. An animated counter
 * displays a wrong number on every frame but the last, which is exactly the
 * failure the no-fabrication rule exists to prevent.
 */
function drawRules(): void {
  gsap.utils.toArray<HTMLElement>('[data-impact-rule]').forEach((rule) => {
    gsap.fromTo(
      rule,
      { scaleX: 0 },
      {
        scaleX: 1,
        duration: 0.9,
        ease: 'power2.out',
        scrollTrigger: { trigger: rule, start: 'top 90%', once: true },
      },
    );
  });
}
