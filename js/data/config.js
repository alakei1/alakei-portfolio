/**
 * ╔══════════════════════════════════════════════════════╗
 * ║  ЛИЧНЫЕ ДАННЫЕ                                       ║
 * ║  Меняешь здесь — обновляется на всём сайте.         ║
 * ╚══════════════════════════════════════════════════════╝
 */
export const config = {
  // ── Имя и ник ──
  firstName: 'Алексей',
  fullName: 'Алексей Лугачев',
  nick: 'alakei1',
  location: 'РФ',
  partnersCount: 2,

  // ── Партнёры (показываются в hero) ──
  // Добавляй/убирай — ссылки станут кликабельными автоматически.
  partners: [
    {
      name: 'Кирилл Лугачев',
      url: 'https://github.com/kvest1997',
      role: 'Fullstack',
    },
    {
      name: 'Фёдор Червак',
      url: 'https://github.com/moon1ight11',
      role: 'Go Backend',
    },
  ],

  // ── Контакты ──
  email: 'lugachev70@gmail.com',
  emailLink: 'mailto:lugachev70@gmail.com',
  telegram: '@alakei4',
  telegramLink: 'https://t.me/alakei4',
  github: 'github.com/alakei1',
  githubLink: 'https://github.com/alakei1',

  // ── Formspree ──
  formspreeId: 'moejwekj',

  // ── Цифры в hero ──
  experience: {
    years: 1,
    backendPercent: 60,
    activeProjects: 2,
    jointProjects: 1,
  },
};