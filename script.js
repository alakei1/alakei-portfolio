// ---------- Year ----------
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// ---------- Helpers ----------
const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// easeInOutQuad — плавный старт и плавный финиш
function easeInOutQuad(t) {
  return t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// ---------- Reveal on scroll ----------
const reveals = document.querySelectorAll('.reveal');

if ('IntersectionObserver' in window && !prefersReducedMotion()) {
  const revealIO = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        el.classList.add('is-visible');
        el.addEventListener('transitionend', function handler(ev) {
          if (ev.propertyName === 'transform' || ev.propertyName === 'opacity') {
            el.classList.add('is-done');
            el.removeEventListener('transitionend', handler);
          }
        });

        revealIO.unobserve(el);
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  reveals.forEach((el) => revealIO.observe(el));
} else {
  reveals.forEach((el) => el.classList.add('is-visible', 'is-done'));
}

// ---------- Counter animation ----------
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

  const target = parseFloat(el.dataset.counter);
  if (!Number.isFinite(target)) return;

  if (prefersReducedMotion()) {
    el.textContent = formatCounter(target, el);
    return;
  }

  // Адаптивная длительность: маленькие числа — быстрее,
  // чтобы не «зависали» на 0 → 1 → 2, большие — чуть дольше.
  const duration =
    target <= 10  ? 800  :
    target <= 100 ? 1100 :
                    1500;

  const start = performance.now();
  let lastText = '';

  function tick(now) {
    const t = Math.min((now - start) / duration, 1);
    const eased = easeInOutQuad(t);
    const value = Math.round(target * eased);
    const text = formatCounter(value, el);

    if (text !== lastText) {
      el.textContent = text;
      lastText = text;
    }

    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      el.textContent = formatCounter(target, el);
    }
  }

  requestAnimationFrame(tick);
}

// ---------- Progress ring ----------
function animateRing(ring) {
  if (ring.dataset.animated === '1') return;
  ring.dataset.animated = '1';
  const target = ring.dataset.ring;

  if (prefersReducedMotion()) {
    ring.style.setProperty('--p', target);
    return;
  }

  ring.style.setProperty('--p', 0);
  requestAnimationFrame(() => {
    setTimeout(() => ring.style.setProperty('--p', target), 60);
  });
}

// ---------- Skill bars ----------
function animateSkill(skill, delay = 0) {
  const bar = skill.querySelector('.bar i');
  const num = skill.querySelector('b');
  if (!bar || !num) return;

  const target = parseInt(bar.dataset.value, 10);
  if (!Number.isFinite(target)) return;

  if (prefersReducedMotion()) {
    bar.style.width = target + '%';
    num.textContent = target + '%';
    return;
  }

  const duration = 1200;
  bar.style.width = '0';
  num.textContent = '0%';

  setTimeout(() => {
    bar.style.width = target + '%';
    const start = performance.now();
    let lastValue = -1;

    function tick(now) {
      const t = Math.min((now - start) / duration, 1);
      const eased = easeInOutQuad(t);
      const value = Math.round(target * eased);

      if (value !== lastValue) {
        num.textContent = value + '%';
        lastValue = value;
      }
      if (t < 1) requestAnimationFrame(tick);
      else num.textContent = target + '%';
    }
    requestAnimationFrame(tick);
  }, delay);
}

function animateSkillsPanel(panel) {
  if (!panel) return;
  panel.querySelectorAll('.skill').forEach((skill, i) => {
    animateSkill(skill, i * 90);
  });
}

// ---------- IntersectionObserver для счётчиков / кольца / баров ----------
if ('IntersectionObserver' in window) {
  const animTargets = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;

        if (el.matches('[data-counter]')) animateCounter(el);
        if (el.matches('[data-ring]')) animateRing(el);
        if (el.matches('[data-skills-root]')) {
          animateSkillsPanel(el.querySelector('.tabs__panel.is-active'));
        }

        animTargets.unobserve(el);
      });
    },
    { threshold: 0.3 }
  );

  document.querySelectorAll('[data-counter]').forEach((el) => animTargets.observe(el));
  document.querySelectorAll('[data-ring]').forEach((el) => animTargets.observe(el));
  document.querySelectorAll('[data-skills-root]').forEach((el) => animTargets.observe(el));
} else {
  document.querySelectorAll('[data-counter]').forEach(animateCounter);
  document.querySelectorAll('[data-ring]').forEach(animateRing);
  document.querySelectorAll('[data-skills-root]').forEach((el) => {
    animateSkillsPanel(el.querySelector('.tabs__panel.is-active'));
  });
}

// ---------- Skills tabs ----------
const tabsRoot = document.querySelector('[data-skills-root]');
if (tabsRoot) {
  const tabs = tabsRoot.querySelectorAll('.tab');
  const panels = tabsRoot.querySelectorAll('.tabs__panel');

  function activateTab(tab) {
    const id = tab.dataset.tab;

    tabs.forEach((t) => {
      const isActive = t === tab;
      t.classList.toggle('is-active', isActive);
      t.setAttribute('aria-selected', String(isActive));
      t.tabIndex = isActive ? 0 : -1;
    });

    panels.forEach((p) => {
      const isActive = p.dataset.panel === id;
      p.classList.toggle('is-active', isActive);
      if (isActive) {
        p.querySelectorAll('.bar i').forEach((b) => { b.style.width = '0'; });
        p.querySelectorAll('.skill b').forEach((n) => { n.textContent = '0%'; });
        animateSkillsPanel(p);
      }
    });
  }

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => activateTab(tab));
  });

  // Клавиатурная навигация
  tabsRoot.querySelector('.tabs').addEventListener('keydown', (e) => {
    const current = document.activeElement;
    const idx = [...tabs].indexOf(current);
    if (idx === -1) return;

    let next = null;
    if (e.key === 'ArrowRight') next = tabs[(idx + 1) % tabs.length];
    else if (e.key === 'ArrowLeft') next = tabs[(idx - 1 + tabs.length) % tabs.length];
    else if (e.key === 'Home') next = tabs[0];
    else if (e.key === 'End') next = tabs[tabs.length - 1];
    else return;

    e.preventDefault();
    next.focus();
    activateTab(next);
  });
}

// ---------- Projects filter ----------
const chips = document.querySelectorAll('.chip');
const projects = document.querySelectorAll('.project');
chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => {
      const isActive = c === chip;
      c.classList.toggle('is-active', isActive);
      c.setAttribute('aria-pressed', String(isActive));
    });
    projects.forEach((p) => {
      const show = f === 'all' || p.dataset.cat === f;
      p.classList.toggle('is-hidden', !show);
    });
  });
});

// ---------- Toast ----------
const toast = document.getElementById('toast');
let toastTimer = null;
function showToast(text, ms = 2000) {
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('is-visible');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('is-visible'), ms);
}

// ---------- Copy email ----------
const copyBtn = document.querySelector('.copy-btn');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    const value = copyBtn.dataset.copy;
    try {
      if (!navigator.clipboard) throw new Error('no clipboard');
      await navigator.clipboard.writeText(value);
      showToast('Скопировано');
    } catch {
      const ta = document.createElement('textarea');
      ta.value = value;
      ta.style.position = 'fixed';
      ta.style.opacity = '0';
      document.body.appendChild(ta);
      ta.select();
      try {
        document.execCommand('copy');
        showToast('Скопировано');
      } catch {
        showToast('Скопируйте вручную: ' + value, 3000);
      }
      ta.remove();
    }
  });
}

// ---------- Contact form ----------
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (form.action.includes('ВАШ_ID')) {
      showToast('Замените ВАШ_ID на Formspree ID в index.html', 3500);
      return;
    }

    const btn = form.querySelector('button[type=submit]');
    const original = btn.textContent;
    btn.textContent = 'Отправляю…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        showToast('Заявка отправлена ✓', 2200);
        form.reset();
      } else {
        showToast('Ошибка. Попробуйте позже', 2500);
      }
    } catch {
      showToast('Сеть недоступна', 2500);
    } finally {
      btn.textContent = original;
      btn.disabled = false;
    }
  });
}

// ---------- 3D-tilt + cursor glow ----------
(function () {
  if (prefersReducedMotion()) return;
  if (!window.matchMedia('(hover: hover) and (pointer: fine)').matches) return;

  document.querySelectorAll('.card').forEach((card) => {
    const glow = document.createElement('div');
    glow.className = 'card__cursor-glow';
    glow.setAttribute('aria-hidden', 'true');
    card.appendChild(glow);

    let raf = null;
    let targetX = 0, targetY = 0, targetRX = 0, targetRY = 0;
    let currentX = 0, currentY = 0, currentRX = 0, currentRY = 0;

    function animate() {
      currentX  += (targetX  - currentX)  * 0.15;
      currentY  += (targetY  - currentY)  * 0.15;
      currentRX += (targetRX - currentRX) * 0.15;
      currentRY += (targetRY - currentRY) * 0.15;

      card.style.setProperty('--mx', currentX + 'px');
      card.style.setProperty('--my', currentY + 'px');
      card.style.setProperty('--rx', currentRX + 'deg');
      card.style.setProperty('--ry', currentRY + 'deg');

      if (
        Math.abs(targetRX - currentRX) > 0.05 ||
        Math.abs(targetRY - currentRY) > 0.05 ||
        Math.abs(targetX - currentX) > 0.5 ||
        Math.abs(targetY - currentY) > 0.5
      ) {
        raf = requestAnimationFrame(animate);
      } else {
        raf = null;
      }
    }

    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      targetX = x;
      targetY = y;

      const cx = rect.width / 2;
      const cy = rect.height / 2;
      const max = 6;
      targetRY = ((x - cx) / cx) * max;
      targetRX = -((y - cy) / cy) * max;

      if (!raf) raf = requestAnimationFrame(animate);
    });

    card.addEventListener('mouseleave', () => {
      targetRX = 0;
      targetRY = 0;
      if (!raf) raf = requestAnimationFrame(animate);
    });
  });
})();
