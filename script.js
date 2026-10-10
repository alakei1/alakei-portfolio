// ---------- Year ----------
document.getElementById('year').textContent = new Date().getFullYear();

// ---------- Reveal on scroll ----------
const reveals = document.querySelectorAll('.reveal');
const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('is-visible'), i * 60);
        io.unobserve(e.target);
      }
    });
  },
  { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
);
reveals.forEach((el) => io.observe(el));

// ---------- Skills tabs ----------
const tabs = document.querySelectorAll('.tab');
const panels = document.querySelectorAll('.tabs__panel');
tabs.forEach((tab) => {
  tab.addEventListener('click', () => {
    const id = tab.dataset.tab;
    tabs.forEach((t) => t.classList.toggle('is-active', t === tab));
    panels.forEach((p) => p.classList.toggle('is-active', p.dataset.panel === id));
  });
});

// ---------- Projects filter ----------
const chips = document.querySelectorAll('.chip');
const projects = document.querySelectorAll('.project');
chips.forEach((chip) => {
  chip.addEventListener('click', () => {
    const f = chip.dataset.filter;
    chips.forEach((c) => c.classList.toggle('is-active', c === chip));
    projects.forEach((p) => {
      const show = f === 'all' || p.dataset.cat === f;
      p.classList.toggle('is-hidden', !show);
    });
  });
});

// ---------- Copy email ----------
const copyBtn = document.querySelector('.copy-btn');
const toast = document.getElementById('toast');
if (copyBtn) {
  copyBtn.addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText(copyBtn.dataset.copy);
      toast.textContent = 'Скопировано';
      toast.classList.add('is-visible');
      setTimeout(() => toast.classList.remove('is-visible'), 1800);
    } catch {
      alert('Скопируйте вручную: ' + copyBtn.dataset.copy);
    }
  });
}

// ---------- Contact form (Formspree AJAX) ----------
const form = document.getElementById('contactForm');
if (form) {
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
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
        toast.textContent = 'Заявка отправлена ✓';
        toast.classList.add('is-visible');
        form.reset();
        setTimeout(() => toast.classList.remove('is-visible'), 2200);
      } else {
        toast.textContent = 'Ошибка. Попробуйте позже';
        toast.classList.add('is-visible');
        setTimeout(() => toast.classList.remove('is-visible'), 2200);
      }
    } catch {
      toast.textContent = 'Сеть недоступна';
      toast.classList.add('is-visible');
      setTimeout(() => toast.classList.remove('is-visible'), 2200);
    }
    btn.textContent = original;
    btn.disabled = false;
  });
}
