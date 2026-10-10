/** Reveal, счётчики, кольцо прогресса, полоски навыков */

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const easeInOutQuad = (t) =>
  t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

/** Reveal on scroll */
function initReveal() {
  const reveals = document.querySelectorAll('.reveal');

  const finishReveal = (el) => {
    el.classList.remove('reveal');
    el.classList.add('is-visible');
  };

  if (!('IntersectionObserver' in window) || prefersReducedMotion()) {
    reveals.forEach(finishReveal);
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      el.classList.add('is-visible');

      const onEnd = (ev) => {
        if (ev.target !== el) return;
        if (ev.propertyName === 'transform' || ev.propertyName === 'opacity') {
          finishReveal(el);
          el.removeEventListener('transitionend', onEnd);
        }
      };
      el.addEventListener('transitionend', onEnd);
      window.setTimeout(() => finishReveal(el), 1000);
      io.unobserve(el);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

  reveals.forEach((el) => io.observe(el));
}

/** Анимированные счётчики */
function formatCounter(value, el) {
  const suffix = el.dataset.suffix || '';
  const format = el.dataset.format || 'plain';
  const display = format === 'thousand-dot'
    ? value.toLocaleString('de-DE')
    : String(value);
  return display + suffix;
}

function animateCounter(el) {
  if (el.dataset.animated === '1') return;
  el.dataset.animated = '1';

  const target = parseFloat(el.dataset.counter || '');
  if (!Number.isFinite(target)) return;

  if (prefersReducedMotion()) {
    el.textContent = formatCounter(target, el);
    return;
  }

  const duration = target <= 10 ? 800 : target <= 100 ? 1100 : 1500;
  const start = performance.now();
  let lastText = '';

  const tick = (now) => {
    const t = Math.min((now - start) / duration, 1);
    const value = Math.round(target * easeInOutQuad(t));
    const text = formatCounter(value, el);
    if (text !== lastText) { el.textContent = text; lastText = text; }
    if (t < 1) requestAnimationFrame(tick);
    else el.textContent = formatCounter(target, el);
  };
  requestAnimationFrame(tick);
}

/** Кольцо прогресса */
function animateRing(ring) {
  if (ring.dataset.animated === '1') return;
  ring.dataset.animated = '1';
  const target = ring.dataset.ring || '0';

  if (prefersReducedMotion()) {
    ring.style.setProperty('--p', target);
    return;
  }
  ring.style.setProperty('--p', '0');
  requestAnimationFrame(() => {
    window.setTimeout(() => ring.style.setProperty('--p', target), 60);
  });
}

/** Полоски навыков */
export function animateSkillsPanel(panel) {
  if (!panel) return;
  panel.querySelectorAll('.skill').forEach((skill, i) => {
    const bar = skill.querySelector('.bar i');
    const num = skill.querySelector('b');
    if (!bar || !num) return;

    const target = parseInt(bar.dataset.value || '', 10);
    if (!Number.isFinite(target)) return;

    if (prefersReducedMotion()) {
      bar.style.width = target + '%';
      num.textContent = target + '%';
      return;
    }

    const duration = 1200;
    bar.style.width = '0%';
    num.textContent = '0%';

    window.setTimeout(() => {
      bar.style.width = target + '%';
      const start = performance.now();
      let lastValue = -1;

      const tick = (now) => {
        const t = Math.min((now - start) / duration, 1);
        const value = Math.round(target * easeInOutQuad(t));
        if (value !== lastValue) { num.textContent = value + '%'; lastValue = value; }
        if (t < 1) requestAnimationFrame(tick);
        else num.textContent = target + '%';
      };
      requestAnimationFrame(tick);
    }, i * 90);
  });
}

/** Общий обзервер для счётчиков / кольца / скиллов */
function initObservers() {
  if (!('IntersectionObserver' in window)) {
    document.querySelectorAll('[data-counter]').forEach(animateCounter);
    document.querySelectorAll('[data-ring]').forEach(animateRing);
    const panel = document.querySelector('.tabs__panel.is-active');
    if (panel) animateSkillsPanel(panel);
    return;
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;

      if (el.matches('[data-counter]')) animateCounter(el);
      if (el.matches('[data-ring]')) animateRing(el);
      if (el.matches('[data-skills-root]')) {
        const panel = el.querySelector('.tabs__panel.is-active');
        if (panel) animateSkillsPanel(panel);
      }
      io.unobserve(el);
    });
  }, { threshold: 0.2 });

  document.querySelectorAll('[data-counter]').forEach((el) => io.observe(el));
  document.querySelectorAll('[data-ring]').forEach((el) => io.observe(el));
  document.querySelectorAll('[data-skills-root]').forEach((el) => io.observe(el));
}

export function initAnimations() {
  initReveal();
  initObservers();
}