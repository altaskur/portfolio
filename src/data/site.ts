/**
 * src/data/site.ts -- fuente de verdad unica del portfolio.
 * Si algo cambia (skills, experiencia, redes, copy...) se toca UN solo fichero.
 */

export const identity = {
  handle:   "altaskur",
  name:     "Isaac Julian Pavon Ruiz",
  role:     "Frontend Engineer",
  location: "Elda, Alicante, ES",
  email:    "altaskur@gmail.com",
  web:      "altaskur.dev",
  status:   "abierto a ofertas",
};

export const aboutParagraphs = [
  "Trabajo con Angular en proyectos de largo recorrido: arquitectura inicial, evolucion de versiones (18-21), SSR, accesibilidad no cosmetica. Lo que me gusta de ese tipo de proyectos es que te obligan a operar lo que construyes.",
  "Fuera del trabajo mantengo un homelab pequeno: reverse proxy, CI/CD propio, Home Assistant, modelos locales. No para anyadirlo al CV, sino porque es la forma mas directa de entender como funciona la infraestructura que normalmente das por sentada.",
  "La IA la uso como herramienta: copiloto para lo rutinario, revision manual para lo que importa. Hasta ahora el balance es positivo.",
];

export const skills = {
  frontend:   ["Angular 18-21", "TypeScript", "JavaScript", "HTML5", "CSS3/SCSS", "PrimeNG", "Ionic", "Astro", "SSR"],
  a11y:       ["WCAG 2.1/2.2", "Lighthouse", "WAVE", "IBM Equal Access", "ARIA", "i18n"],
  ia:         ["Ollama", "LLMs locales", "Claude Code", "GitHub Copilot"],
  backend:    ["Node.js", "Express", "Docker"],
  tooling:    ["ESLint", "Prettier", "Husky", "CommitLint", "Stylelint", "Storybook", "SonarQube", "GitHub Actions", "Azure DevOps"],
  explorando: ["React", "Vue", "FastAPI", "PostgreSQL"],
};

export const logros: { categoria: string; items: string[] }[] = [
  {
    categoria: "Angular enterprise",
    items: [
      "Referente tecnico en proyecto de largo recorrido del sector agrotech: fases sucesivas con Angular 18, 19, 20 y 21 (+ SSR), levantando la arquitectura frontend inicial y manteniendola a lo largo de cada evolucion.",
      "Lighthouse > 90% en Performance, Accesibilidad, Best Practices y SEO en aplicacion publica tras refactor completo en Angular 21 con SSR.",
      "Continuidad tecnica y conocimiento de dominio en proyecto micro-frontend de ~9 meses con equipo muy cambiante.",
    ],
  },
  {
    categoria: "Accesibilidad",
    items: [
      "Impulso por iniciativa propia de la accesibilidad web: auditorias multi-herramienta (Lighthouse, WAVE, IBM Equal Access) y negociacion con diseno para corregir violaciones WCAG.",
    ],
  },
  {
    categoria: "Gestion y transversalidad",
    items: [
      "Gestion de hasta 5 proyectos en paralelo durante Q2 2025 sin romper entregas.",
      "Mentoring cross-equipo en Angular 19/20 a companeros de otros proyectos.",
      "Auditoria cross-equipo con deteccion y escalado de problemas de backend en un proyecto externo.",
    ],
  },
  {
    categoria: "Iniciativa tecnica",
    items: [
      "Refactor completo del frontend de una aplicacion interna con alta deuda tecnica: analisis, planificacion y ejecucion autonoma desde cero.",
      "Investigacion y resolucion autonoma de un problema persistente de autoplay de video en tablets: analisis de causa raiz, solucion aplicada y documentada.",
      "App movil multi-idioma para tablets con Ionic + Angular, desarrollada con fidelidad al diseno y soporte completo de i18n.",
      "Investigacion tecnica sobre seleccion de stack CSS y setup de calidad de codigo (Husky/ESLint/Prettier), publicada en Dev.to.",
    ],
  },
];

export const talks = [
  {
    event: "DevFest Alicante 2025",
    title: "Accesibilidad en dos tiempos",
    date:  "nov 2025",
    role:  "Ponente",
  },
];

export const taglines = [
  "Angular · WCAG · open source",
  "developer · speaker · remoto",
  "local-first · a11y · enterprise",
  "accesibilidad · IA aplicada · remoto",
];

export const socials = [
  { name: "GitHub",   url: "https://github.com/altaskur",               username: "@altaskur",      description: "Codigo, proyectos y contribuciones",   color: "#ffffff" },
  { name: "LinkedIn", url: "https://www.linkedin.com/in/isaac-julian/", username: "isaac-julian",   description: "Networking y experiencia profesional",  color: "#0077b5" },
  { name: "Twitch",   url: "https://www.twitch.tv/altaskur",            username: "@altaskur",      description: "Streaming de programacion en directo",  color: "#9147ff" },
  { name: "Dev.to",   url: "https://dev.to/altaskur",                   username: "@altaskur",      description: "Articulos tecnicos y tutoriales",       color: "#ffffff" },
  { name: "BlueSky",  url: "https://bsky.app/profile/altaskur.live",    username: "@altaskur.live", description: "Pensamientos y comunidad dev",          color: "#1185fe" },
  { name: "YouTube",  url: "https://www.youtube.com/@altaskur",         username: "@altaskur",      description: "Charlas, talleres y tutoriales",        color: "#ff0000" },
];
