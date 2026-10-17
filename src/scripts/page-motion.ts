/**
 * Motion for every page: the page title arriving word by word, and content
 * rising into place as it is reached. CSS transitions only; the browser's
 * own scrolling is left alone.
 *
 * Everything here is gated on the `rv` class, which
 * the inline script in Layout.astro adds only when the reader has not asked
 * for reduced motion. Without it, or without JavaScript, every element is
 * simply visible.
 */
const root = document.documentElement;
const main = document.querySelector<HTMLElement>('main');

if (root.classList.contains('rv') && main) {
  /* ---- The page title, word by word ---- */
  const title = main.querySelector<HTMLElement>('.page-header h1, h1');
  if (title && !title.querySelector('*')) {
    const words = (title.textContent ?? '').trim().split(/\s+/);
    title.setAttribute('aria-label', title.textContent?.trim() ?? '');
    title.textContent = '';
    words.forEach((word, i) => {
      const span = document.createElement('span');
      span.className = 'rv-word';
      span.setAttribute('aria-hidden', 'true');
      span.style.setProperty('--rv-i', String(i));
      span.textContent = word;
      title.append(span, document.createTextNode(' '));
    });
    requestAnimationFrame(() => title.classList.add('rv-words-in'));
  }

  /* ---- Blocks that rise into place ----
     A block is a direct child of a page's .shell. When a block is itself a
     row or grid of several items (a list of cards, a set of figures), the
     items rise one after another instead of the block moving as one. */
  const blocks: HTMLElement[] = [];
  const isRow = (el: HTMLElement) => {
    const display = getComputedStyle(el).display;
    return (display.includes('grid') || display.includes('flex')) && el.children.length > 1;
  };
  main.querySelectorAll<HTMLElement>('.shell > *').forEach((el) => {
    if (el.matches('h1, .page-header *')) return;
    if (el.closest('.page-header')) {
      if (!el.querySelector('h1')) blocks.push(el);
      return;
    }
    if (isRow(el) || el.matches('ul, ol')) {
      Array.from(el.children).forEach((child, i) => {
        if (child instanceof HTMLElement) {
          child.style.setProperty('--rv-i', String(i));
          blocks.push(child);
        }
      });
    } else {
      blocks.push(el);
    }
  });
  const visual = (el: HTMLElement) => !el.matches('script, style, template') && getComputedStyle(el).display !== 'none';
  blocks.filter(visual).forEach((el) => el.classList.add('rv-block'));

  /* Photographs get their own reveal: a wipe up out of the frame while the
     picture settles from a slight zoom. */
  main.querySelectorAll<HTMLElement>('.slot').forEach((el) => el.classList.add('rv-photo'));

  const seen = new IntersectionObserver((entries) => {
    for (const entry of entries) {
      if (!entry.isIntersecting) continue;
      entry.target.classList.add('is-in');
      seen.unobserve(entry.target);
    }
  }, { rootMargin: '0px 0px -8% 0px', threshold: 0.08 });
  main.querySelectorAll('.rv-block, .rv-photo').forEach((el) => seen.observe(el));
}
