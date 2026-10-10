/**
 * ╔══════════════════════════════════════════════════════╗
 * ║  ПРОЕКТЫ                                             ║
 * ║  Чтобы добавить — скопируй объект {...} и заполни.  ║
 * ╚══════════════════════════════════════════════════════╝
 */
export const projects = [
  {
    title: 'Sova — ИИ-платформа для инженеров',
    description: 'Мультиагентная платформа для анализа корпоративных данных. Сокращает издержки индустрии на 25–40%. Отвечаю за ML-часть и инфраструктуру.',
    category: 'ml',                    // "ml" или "backend"
    tags: ['Python', 'Go', 'RAG'],
    cover: { c1: '#125446', c2: '#1B6B5A' },  // цвета градиента обложки
    links: [
      { text: 'Презентация →', url: 'https://port-twenty-three.github.io/sova-pitch-deck/', muted: false },
      { text: 'GitHub', url: 'https://github.com/alakei1', muted: true },
    ],
  },
  {
    title: 'Telegram-бот для учёта расходов',
    description: 'Бот с автоматической категоризацией трат, экспортом в Excel и напоминаниями. Бэкенд на FastAPI, хранение в PostgreSQL.',
    category: 'backend',
    tags: ['Python', 'FastAPI', 'PostgreSQL'],
    cover: { c1: '#C96F5A', c2: '#E8A79B' },
    links: [
      { text: 'GitHub', url: 'https://github.com/alakei1', muted: true },
    ],
  },
];

/**
 * Категории проектов для фильтра.
 * key — это значение поля "category" выше.
 */
export const projectCategories = [
  { key: 'all', label: 'Все' },
  { key: 'ml', label: 'ML / ИИ' },
  { key: 'backend', label: 'Backend' },
];