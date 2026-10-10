import { config } from './data/config.js';
import { projects, projectCategories } from './data/projects.js';
import { skills } from './data/skills.js';

import { applyConfig, renderSkills, renderProjects, renderPartners } from './render.js';
import { initAnimations } from './animations.js';
import { initUI } from './ui.js';
import { initTilt } from './tilt.js';

/** Год */
const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

/** Проверка фото */
document.querySelectorAll('.hero__photo img').forEach((img) => {
  const handleError = () => {
    const parent = img.closest('.hero__photo');
    img.remove();
    if (parent) parent.classList.add('hero__photo--fallback');
  };
  if (img.complete && img.naturalWidth === 0) handleError();
  else img.addEventListener('error', handleError, { once: true });
});

/** 1. Подстановка личных данных */
applyConfig(config);

/** 2. ⭐ Партнёры — кликабельные ссылки */
renderPartners(document.getElementById('partnersList'), config.partners);

/** 3. Проекты и навыки */
renderProjects(
  document.getElementById('projectsGrid'),
  document.getElementById('projectsFilters'),
  projects,
  projectCategories
);
renderSkills(document.getElementById('skillsRoot'), skills);

/** 4. Оживляем интерфейс */
initAnimations();
initUI();
initTilt();