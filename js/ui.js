/** Табы навыков, фильтр проектов, копирование email, форма, тост */

import { animateSkillsPanel } from './animations.js';

const prefersReducedMotion = () =>
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/** ── Toast ── */
const toast = document.getElementById('toast');
let toastTimer;

export function showToast(text, ms = 2500) {
  if (!toast) return;
  toast.textContent = text;
  toast.classList.add('is-visible');
  if (toastTimer !== undefined) window.clearTimeout(toastTimer);
  toastTimer = window.setTimeout(() => toast.classList.remove('is-visible'), ms);
}

/** ── Табы навыков ── */
function initTabs() {
  const root = document.querySelector('[data-skills-root]');
  if (!root) return;

  const tabs = Array.from(root.querySelectorAll('.tab'));
  const panels = Array.from(root.querySelectorAll('.tabs__panel'));

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
        p.querySelectorAll('.bar i').forEach((b) => { b.style.width = '0%'; });
        p.querySelectorAll('.skill b').forEach((n) => { n.textContent = '0%'; });
        animateSkillsPanel(p);
      }
    });
  }

  tabs.forEach((tab) => tab.addEventListener('click', () => activateTab(tab)));

  const tabsContainer = root.querySelector('.tabs');
  if (tabsContainer) {
    tabsContainer.addEventListener('keydown', (e) => {
      const idx = tabs.indexOf(document.activeElement);
      if (idx === -1) return;

      let next = null;
      if (e.key === 'ArrowRight') next = tabs[(idx + 1) % tabs.length];
      else if (e.key === 'ArrowLeft') next = tabs[(idx - 1 + tabs.length) % tabs.length];
      else if (e.key === 'Home') next = tabs[0];
      else if (e.key === 'End') next = tabs[tabs.length - 1];
      else return;

      e.preventDefault();
      if (next) { next.focus(); activateTab(next); }
    });
  }
}

/** ── Фильтр проектов ── */
function initFilter() {
  const chips = document.querySelectorAll('.chip');
  const projects = document.querySelectorAll('.project');
  if (!chips.length) return;

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
}

/** ── Копирование email ── */
function initCopy() {
  const copyBtn = document.querySelector('.copy-btn');
  if (!copyBtn) return;

  copyBtn.addEventListener('click', async () => {
    const value = copyBtn.dataset.copy || '';

    if (navigator.clipboard && window.isSecureContext) {
      try {
        await navigator.clipboard.writeText(value);
        showToast('Скопировано ✓');
        return;
      } catch (_) { /* fallthrough */ }
    }
    showToast('Скопируйте вручную: ' + value, 4000);
  });
}

/** ── Форма Formspree ── */
function initForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    if (!/^https:\/\/formspree\.io\/f\/[a-zA-Z0-9]+$/.test(form.action)) {
      showToast('Проверь formspreeId в js/data/config.js', 4000);
      return;
    }

    const btn = form.querySelector('button[type=submit]');
    if (!btn) return;

    const original = btn.textContent || '';
    btn.textContent = 'Отправляю…';
    btn.disabled = true;

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        body: new FormData(form),
        headers: { Accept: 'application/json' },
      });

      if (res.ok) {
        showToast('Заявка отправлена ✓', 2500);
        form.reset();
      } else {
        showToast('Ошибка при отправке. Попробуйте позже', 3000);
      }
    } catch {
      showToast('Проблема с сетью', 3000);
    } finally {
      btn.textContent = original;
      btn.disabled = false;
    }
  });
}

export function initUI() {
  initTabs();
  initFilter();
  initCopy();
  initForm();
}