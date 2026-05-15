/**
 * src/data/site.ts — fuente de verdad única del portfolio.
 *
 * Todos los componentes del site y la terminal leen de aquí.
 * Si algo cambia (skills, experiencia, redes, copy...) se toca UN solo fichero.
 */

// ─── Identidad ────────────────────────────────────────────────────────────────
export const identity = {
  handle:   "altaskur",
  name:     "Isaac Julián Pavón Ruiz",
  role:     "Frontend Engineer",
  location: "Elda, Alicante, ES",
  email:    "altaskur@gmail.com",
  web:      "altaskur.dev",
  status:   "abierto a ofertas",
};

// ─── Sobre mí — párrafos de AboutSection ─────────────────────────────────────
export const aboutParagraphs = [
  "Trabajo con Angular en proyectos de largo recorrido: arquitectura inicial, evolución de versiones (18–21), SSR, accesibilidad no cosmética. Lo que me gusta de ese tipo de proyectos es que te obligan a operar lo que construyes — y eso incluye mantener el flujo Figma → implementación → Storybook funcionando a lo largo del tiempo, no solo al arrancar.",
  "Fuera del trabajo mantengo un homelab pequeño — reverse proxy, CI/CD propio, Home Assistant, modelos locales. No para añadirlo al CV, sino porque es la forma más directa de entender cómo funciona la infraestructura que normalmente das por sentada.",
  "La IA la uso como herramienta: copiloto para lo rutinario, revisión manual para lo que importa. Hasta ahora el balance es positivo.",
];

// ─── Skills — secciones de AboutSection + skills.json en terminal ─────────────
export const skills = {
  frontend:   ["Angular 18–21", "TypeScript", "JavaScript", "HTML5", "CSS3/SCSS", "PrimeNG", "Ionic", "Astro", "SSR"],
  a11y:       ["WCAG 2.1/2.2", "Lighthouse", "WAVE", "IBM Equal Access", "ARIA", "i18n"],
  ia:         ["Ollama", "LLMs locales", "Claude Code", "GitHub Copilot"],
  backend:    ["Node.js", "Express", "Docker"],
  tooling:    ["ESLint", "Prettier", "Husky", "CommitLint", "Stylelint", "Storybook", "SonarQube", "GitHub Actions", "Azure DevOps"],
  explorando: ["React", "Vue", "FastAPI", "PostgreSQL"],
};

// ─── Experiencia — logros de ExperienceSection + cv.txt en terminal ───────────
export const logros: { categoria: string; items: string[] }[] = [
  {
    categoria: "Angular enterprise",
    items: [
      "Referente técnico en proyecto de largo recorrido del sector agrotech: fases sucesivas con Angular 18, 19, 20 y 21 (+ SSR), levantando la arquitectura frontend inicial y manteniéndola a lo largo de cada evolución.",
      "Lighthouse > 90% en Performance, Accesibilidad, Best Practices y SEO en aplicación pública tras refactor completo en Angular 21 con SSR.",
      "Continuidad técnica y conocimiento de dominio en proyecto micro-frontend de ~9 meses con equipo muy cambiante.",
    ],
  },
  {
    categoria: "Accesibilidad",
    items: [
      "Impulso por iniciativa propia de la accesibilidad web: auditorías multi-herramienta (Lighthouse, WAVE, IBM Equal Access) y negociación con diseño para corregir violaciones WCAG.",
    ],
  },
  {
    categoria: "Gestión y transversalidad",
    items: [
      "Gestión de hasta 5 proyectos en paralelo durante Q2 2025 sin romper entregas.",
      "Mentoring cross-equipo en Angular 19/20 a compañeros de otros proyectos.",
      "Auditoría cross-equipo con detección y escalado de problemas de backend en un proyecto externo.",
    ],
  },
  {
    categoria: "Iniciativa técnica",
    items: [
      "Refactor completo del frontend de una aplicación interna con alta deuda técnica: análisis, planificación y ejecución autónoma desde cero.",
      "Investigación y resolución autónoma de un problema persistente de autoplay de vídeo en tablets: análisis de causa raíz, solución aplicada y documentada.",
      "App móvil multi-idioma para tablets con Ionic + Angular, desarrollada con fidelidad al diseño y soporte completo de i18n.",
      "Investigación técnica sobre selección de stack CSS y setup de calidad de código (Husky/ESLint/Prettier), publicada en Dev.to.",
    ],
  },
];

// ─── Redes sociales — SocialSection + contact.txt en terminal ─────────────────
// SVG icons los añade SocialSection.astro localmente; aquí solo el dato estructural.
export const socials = [
  { name: "GitHub",   url: "https://github.com/altaskur",               username: "@altaskur",      description: "Código, proyectos y contribuciones",   color: "#ffffff" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/isaac-julián/",  username: "isaac-julián",   description: "Networking y experiencia profesional",  color: "#0077b5" },
  { name: "Twitch",   url: "https://www.twitch.tv/altaskur",             username: "@altaskur",      description: "Streaming de programación en directo",  color: "#9147ff" },
  { name: "Dev.to",   url: "https://dev.to/altaskur",                    username: "@altaskur",      description: "Artículos técnicos y tutoriales",       color: "#ffffff" },
  { name: "BlueSky",  url: "https://bsky.app/profile/altaskur.live",     username: "@altaskur.live", description: "Pensamientos y comunidad dev",          color: "#1185fe" },
  { name: "YouTube",  url: "https://www.youtube.com/@altaskur",          username: "@altaskur",      description: "Charlas, talleres y tutoriales",        color: "#ff0000" },
];
