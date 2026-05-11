/**
 * Fuente de verdad para la terminal interactiva del portfolio.
 * Edita este fichero cuando cambie tu situación profesional.
 * El componente AITerminal.astro lo lee en build time.
 */

export const terminalData = {
  identity: {
    handle: "altaskur",
    name: "Isaac Julián Pavón Ruiz",
    location: "Alicante, España",
    // Se muestra en el banner al abrir la terminal — rota aleatoriamente
    taglines: [
      "Angular · WCAG · open source",
      "developer · speaker · remoto",
      "local-first · a11y · enterprise",
      "accesibilidad · IA aplicada · remoto",
    ],
  },

  about: [
    "Isaac Julián Pavón Ruiz — altaskur",
    "Angular Developer · Alicante, España",
    "",
    "Dos años llevando apps Angular a producción",
    "en entornos enterprise, versiones 18 a 21.",
    "Accesibilidad web WCAG 2.1/2.2 e IA aplicada",
    "como parte estable del flujo, no como extras.",
    "Ponente DevFest Alicante 2025.",
    "Disponible 100% remoto.",
  ],

  skills: {
    core:    ["Angular 18-21", "TypeScript", "RxJS", "NgRx"],
    "a11y":  ["WCAG 2.1", "WCAG 2.2", "ARIA semántico"],
    testing: ["Jest", "Testing Library"],
    tools:   ["Git", "Docker", "Figma", "Vite"],
    homelab: ["Forgejo", "Home Assistant", "Ollama"],
    ahora:   ["Signals", "SSR", "IA aplicada"],
  },

  contact: {
    github:   "github.com/altaskur",
    linkedin: "linkedin.com/in/isaac-julián/",
    devto:    "dev.to/altaskur",
    email:    "altaskur@gmail.com",
    web:      "altaskur.dev",
  },

  experience: [
    {
      role:    "Angular Developer",
      period:  "2024 → hoy",
      bullets: [
        "Angular 18-21, SSR, Signals, NgRx, RxJS",
        "Accesibilidad WCAG 2.1/2.2 en producción",
        "Code reviews · Pair programming · Agile",
      ],
    },
    {
      role:    "Ponente",
      period:  "2025",
      bullets: [
        "DevFest Alicante 2025",
        '"IA aplicada al flujo de desarrollo"',
      ],
    },
  ],

  /**
   * Tu trayectoria como commits de git.
   * Añade entradas arriba (más reciente primero) cuando ocurra algo relevante.
   * hash: cualquier string corto, ref: rama/tag o vacío, date: texto libre.
   */
  gitLog: [
    {
      hash: "a4f8c12",
      ref:  "(HEAD → main)",
      date: "may 2026",
      msg:  "feat: angular dev en producción · SSR · Signals · a11y",
      sub:  "Angular 18-21 · WCAG 2.1/2.2 · enterprise",
    },
    {
      hash: "7dc14e0",
      ref:  "",
      date: "nov 2025",
      msg:  "talk: DevFest Alicante 2025",
      sub:  "IA aplicada al flujo de desarrollo",
    },
    {
      hash: "3b92f11",
      ref:  "",
      date: "2024",
      msg:  "chore: primer deploy angular en enterprise",
      sub:  "Angular 18 · primeras PRs en producción",
    },
    {
      hash: "0000001",
      ref:  "(origin/vida)",
      date: "Alicante",
      msg:  "init: empezando esto del código",
      sub:  "curiosidad · café · html en notepad++",
    },
  ],
};
