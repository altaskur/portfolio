/**
 * src/lib/og.ts — helper compartido para generación de OG images con satori + resvg
 */

import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

// Tipado mínimo compatible con satori sin necesitar React
type SatoriNode = {
  type: string;
  props: {
    style?: Record<string, string | number>;
    children?: SatoriNode | SatoriNode[] | string | number | null;
    [key: string]: unknown;
  };
};

/** Pequeño helper para construir nodos sin JSX */
export function h(
  type: string,
  style: Record<string, string | number> = {},
  children?: SatoriNode | SatoriNode[] | string | number | null,
): SatoriNode {
  return { type, props: { style, children: children ?? null } };
}

let _fonts: { name: string; data: ArrayBuffer; weight: number; style: string }[] | null = null;

async function loadFonts() {
  if (_fonts) return _fonts;
  const [regular, bold] = await Promise.all([
    fetch("https://fonts.bunny.net/inter/files/inter-latin-400-normal.woff").then((r) =>
      r.arrayBuffer(),
    ),
    fetch("https://fonts.bunny.net/inter/files/inter-latin-700-normal.woff").then((r) =>
      r.arrayBuffer(),
    ),
  ]);
  _fonts = [
    { name: "Inter", data: regular, weight: 400, style: "normal" },
    { name: "Inter", data: bold, weight: 700, style: "normal" },
  ];
  return _fonts;
}

export async function renderOGImage(element: SatoriNode): Promise<Uint8Array> {
  const fonts = await loadFonts();
  const svg = await satori(element as any, { width: 1200, height: 630, fonts });
  const resvg = new Resvg(svg, { fitTo: { mode: "width", value: 1200 } });
  return resvg.render().asPng();
}

/** Respuesta HTTP lista para usar en endpoints Astro */
export function pngResponse(png: Uint8Array): Response {
  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=86400, s-maxage=86400",
    },
  });
}
