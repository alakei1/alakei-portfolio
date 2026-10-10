/**
 * Рендер данных из js/data/ в HTML.
 */

/** Прочитать вложенное свойство по пути "a.b.c" */
function getNested(obj, path) {
  return path.split('.').reduce((o, k) => (o == null ? undefined : o[k]), obj);
}

/** Подставляет значения из config в элементы с data-config* */
export function applyConfig(config) {
  document.querySelectorAll('[data-config]').forEach((el) => {
    const key = el.dataset.config;
    const value = getNested(config, key);
    if (value == null) return;
    const prefix = el.dataset.configPrefix || '';
    el.textContent = prefix + value;
  });

  document.querySelectorAll('[data-config-href]').forEach((el) => {
    const key = el.dataset.configHref;
    const value = getNested(config, key);
    if (value) el.setAttribute('href', value);
  });

  document.querySelectorAll('[data-config-copy]').forEach((el) => {
    const key = el.dataset.configCopy;
    const value = getNested(config, key);
    if (value) el.setAttribute('data-copy', value);
  });

  document.querySelectorAll('[data-config-counter]').forEach((el) => {
    const key = el.dataset.configCounter;
    const value = getNested(config, key);
    if (value == null) return;
    el.dataset.counter = String(value);
    el.textContent = value + (el.dataset.suffix || '');
  });

  document.querySelectorAll('[data-config-ring]').forEach((el) => {
    const key = el.dataset.configRing;
    const value = getNested(config, key);
    if (value == null) return;
    el.dataset.ring = String(value);
    el.style.setProperty('--p', String(value));
  });

  const form = document.getElementById('contactForm');
  if (form && config.formspreeId) {
    form.action = `https://formspree.io/f/${config.formspreeId}`;
  }
}

/** ⭐ Рендер списка партнёров — ссылки кликабельны */
export function renderPartners(container, partners) {
  if (!container || !Array.isArray(partners)) return;

  const html = partners
    .map((p) => `<a href="${p.url}" target="_blank" rel="noopener noreferrer"
                    class="partner-link">${p.name}</a>`)
    .join(', ');

  container.innerHTML = `${html} — инженеры, с которыми я работаю`;
}

/** Рендер секции «Навыки» */
export function renderSkills(container, skills) {
  if (!container) return;

  const tabsHtml = skills.map((s) => `
    <button class="tab${s.active ? ' is-active' : ''}"
            id="tab-${s.id}"
            data-tab="${s.id}"
            role="tab"
            aria-selected="${s.active ? 'true' : 'false'}"
            aria-controls="panel-${s.id}"
            tabindex="${s.active ? '0' : '-1'}">
      ${s.label}
    </button>
  `).join('');

  const panelsHtml = skills.map((s) => `
    <div class="tabs__panel${s.active ? ' is-active' : ''}"
         id="panel-${s.id}"
         role="tabpanel"
         aria-labelledby="tab-${s.id}"
         data-panel="${s.id}"
         tabindex="0">
      ${s.items.map((item) => `
        <div class="skill">
          <span>${item.name}</span>
          <div class="bar"><i data-value="${item.value}"></i></div>
          <b data-value="${item.value}">${item.value}%</b>
        </div>
      `).join('')}
    </div>
  `).join('');

  container.innerHTML = `
    <div class="tabs" role="tablist" aria-label="Категории навыков">
      ${tabsHtml}
    </div>
    ${panelsHtml}
  `;
}

/** Рендер проектов + фильтров */
export function renderProjects(gridEl, filtersEl, projects, categories) {
  if (!gridEl) return;

  gridEl.innerHTML = projects.map((p) => {
    const linksHtml = p.links.map((l) =>
      `<a href="${l.url}" target="_blank" rel="noopener noreferrer"
          class="link${l.muted ? ' link--muted' : ''}">${l.text}</a>`
    ).join('');

    const tagsHtml = p.tags.map((t) =>
      `<span class="tag">${t}</span>`
    ).join('');

    return `
      <article class="card project reveal" data-cat="${p.category}">
        <div class="project__cover"
             style="--c1:${p.cover.c1};--c2:${p.cover.c2}"
             aria-hidden="true"></div>
        <div class="project__body">
          <h3>${p.title}</h3>
          <p>${p.description}</p>
          <div class="tags">${tagsHtml}</div>
          <div class="project__links">${linksHtml}</div>
        </div>
      </article>
    `;
  }).join('');

  if (!filtersEl) return;

  filtersEl.innerHTML = categories.map((c, i) => `
    <button class="chip${i === 0 ? ' is-active' : ''}"
            data-filter="${c.key}"
            aria-pressed="${i === 0 ? 'true' : 'false'}">
      ${c.label}
    </button>
  `).join('');
}