/**
 * src/data/terminal.ts — datos exclusivos de la terminal interactiva.
 *
 * El grueso del contenido (skills, experience, socials, about, identity)
 * viene de src/data/site.ts. Aquí solo vive lo específico de la terminal:
 * el git log narrativo y las taglines del banner de bienvenida.
 */

import { identity, aboutParagraphs, skills, logros, socials } from "./site";

export const terminalData = {
  identity: {
    handle:   identity.handle,
    name:     identity.name,
    location: identity.location,
    // Taglines del banner de boot — específicas de la terminal
    taglines: [
      "Angular · WCAG · open source",
      "developer · speaker · remoto",
      "local-first · a11y · enterprise",
      "accesibilidad · IA aplicada · remoto",
    ],
  },

  // about.txt — los mismos párrafos que AboutSection, adaptados a ancho de terminal
  about: [
    `${identity.name} — ${identity.handle}`,
    `${identity.role} · ${identity.location} · remoto`,
    "",
    ...aboutParagraphs.flatMap((p) => {
      // Dividir en líneas de ~55 chars en espacios
      const words = p.split(" ");
      const lines: string[] = [];
      let line = "";
      for (const word of words) {
        if ((line + " " + word).trimStart().length > 55 && line) {
          lines.push(line.trimStart());
          line = word;
        } else {
          line = line ? line + " " + word : word;
        }
      }
      if (line) lines.push(line.trimStart());
      lines.push(""); // línea en blanco entre párrafos
      return lines;
    }),
    `Ponente DevFest Alicante 2025.`,
    `${identity.status}.`,
  ],

  // skills.json — mismas categorías que AboutSection
  skills,

  // contact.txt — derivado de socials + identity
  contact: {
    github:   socials.find((s) => s.name === "GitHub")!.url.replace("https://", ""),
    linkedin: socials.find((s) => s.name === "LinkedIn")!.url.replace("https://", ""),
    devto:    socials.find((s) => s.name === "Dev.to")!.url.replace("https://", ""),
    bluesky:  socials.find((s) => s.name === "BlueSky")!.url.replace("https://", ""),
    email:    identity.email,
    web:      identity.web,
  },

  // experience/cv.txt — los logros del site, agrupados por categoría
  experience: logros.map((g) => ({
    role:    g.categoria,
    period:  "2024 → hoy",
    bullets: g.items,
  })),

  /**
   * git log — trayectoria profesional en formato commit.
   * Añade arriba (más reciente primero) cuando ocurra algo relevante.
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
