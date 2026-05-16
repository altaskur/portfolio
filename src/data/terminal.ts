/**
 * src/data/terminal.ts -- logica de presentacion de la terminal interactiva.
 * NO contiene datos propios. Todo viene de site.ts.
 * El gitLog se genera dinamicamente en Terminal.astro desde blog + talks.
 */

import { identity, aboutParagraphs, skills, logros, socials, taglines, talks } from "./site";

export const terminalData = {
  identity: {
    handle:   identity.handle,
    name:     identity.name,
    location: identity.location,
    taglines,
  },

  about: [
    `${identity.name} -- ${identity.handle}`,
    `${identity.role} · ${identity.location} · remoto`,
    "",
    ...aboutParagraphs.flatMap((p) => {
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
      lines.push("");
      return lines;
    }),
    ...talks.map((t) => `${t.role} ${t.event} -- "${t.title}".`),
    `${identity.status}.`,
  ],

  skills,

  contact: {
    github:   socials.find((s) => s.name === "GitHub")!.url.replace("https://", ""),
    linkedin: socials.find((s) => s.name === "LinkedIn")!.url.replace("https://", ""),
    devto:    socials.find((s) => s.name === "Dev.to")!.url.replace("https://", ""),
    bluesky:  socials.find((s) => s.name === "BlueSky")!.url.replace("https://", ""),
    email:    identity.email,
    web:      identity.web,
  },

  experience: logros.map((g) => ({
    role:    g.categoria,
    period:  "2024 -> hoy",
    bullets: g.items,
  })),
};
