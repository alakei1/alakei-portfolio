/**
 * ╔══════════════════════════════════════════════════════╗
 * ║  НАВЫКИ                                              ║
 * ║  value — процент от 0 до 100.                       ║
 * ╚══════════════════════════════════════════════════════╝
 */
export const skills = [
  {
    id: 'backend',
    label: 'Backend',
    active: true,           // активный таб по умолчанию
    items: [
      { name: 'Python / FastAPI', value: 80 },
      { name: 'PostgreSQL / SQL', value: 75 },
      { name: 'Docker / Compose', value: 70 },
      { name: 'REST API / Swagger', value: 75 },
    ],
  },
  {
    id: 'devops',
    label: 'DevOps',
    items: [
      { name: 'Linux / Bash', value: 65 },
      { name: 'Git / GitHub Actions', value: 75 },
      { name: 'Nginx', value: 60 },
      { name: 'Prometheus / Grafana', value: 50 },
    ],
  },
  {
    id: 'ml',
    label: 'ML / Data',
    items: [
      { name: 'Python (pandas, numpy)', value: 70 },
      { name: 'scikit-learn', value: 60 },
      { name: 'Jupyter / Google Colab', value: 75 },
      { name: 'RAG / Векторный поиск', value: 50 },
    ],
  },
  {
    id: 'tools',
    label: 'Tools',
    items: [
      { name: 'Git / GitHub', value: 85 },
      { name: 'VS Code / PyCharm', value: 90 },
      { name: 'Postman / Swagger', value: 70 },
      { name: 'Notion / Linear', value: 80 },
    ],
  },
];