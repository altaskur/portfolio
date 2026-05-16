/**
 * GET /og/[slug].png — OG image dinámica por post de blog
 * Layout: texto izquierda + cover image derecha (si existe)
 */

import type { APIRoute, GetStaticPaths } from "astro";
import { getCollection } from "astro:content";
import { h, renderOGImage, pngResponse } from "../../lib/og";
import { identity } from "../../data/site";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getCollection("blog", ({ data }) => !data.draft);
  return posts.map((post) => ({
    params: { slug: post.id.replace(/\.(md|mdx)$/, "") },
    props: { post },
  }));
};

/**
 * Convierte cualquier URL de imagen en una URL wsrv.nl en formato PNG.
 * wsrv.nl convierte webp/avif/gif → PNG, que satori+resvg sí soportan.
 */
function toPngProxyURL(url: string): string {
  return `https://wsrv.nl/?url=${encodeURIComponent(url)}&output=png&w=600&h=450&fit=cover&we`;
}

export const GET: APIRoute = async ({ props }) => {
  const { post } = props as any;

  const title: string = post.data.title ?? "";
  const description: string = post.data.description ?? "";
  const typeLabels: Record<string, string> = {
    article: "artículo",
    experiment: "experimento",
  };
  const typeLabel: string = typeLabels[post.data.type] ?? post.data.type ?? "post";
  const dateStr: string = post.data.publishDate
    ? new Date(post.data.publishDate).toLocaleDateString("es-ES", {
        day: "numeric",
        month: "long",
        year: "numeric",
      })
    : "";

  // Convertir a URL absoluta y proxear por wsrv.nl → PNG (satori no soporta webp)
  let coverURL: string | null = null;
  if (post.data.coverImage) {
    const absURL = post.data.coverImage.startsWith("http")
      ? post.data.coverImage
      : `https://altaskur.dev${post.data.coverImage}`;
    coverURL = toPngProxyURL(absURL);
  }

  const hasCover = !!coverURL;

  // Con imagen abajo siempre tenemos el ancho completo para el texto
  const maxTitle = 80;
  const maxDesc = hasCover ? 100 : 130;
  const safeTitle = title.length > maxTitle ? title.slice(0, maxTitle) + "…" : title;
  const safeDesc = description.length > maxDesc ? description.slice(0, maxDesc) + "…" : description;
  const safeTitleFull = title.length > maxTitle ? title.slice(0, maxTitle) + "…" : title;

  // ─── Layout raíz: columna vertical (texto → imagen → footer) ───────────────
  const image = h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      backgroundColor: "#020408",
      padding: "48px 60px 36px",
      fontFamily: "Inter",
      position: "relative",
    },
    [
      // Borde izquierdo accent
      h("div", {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: "#3B82F6",
      }),

      // Label + badge en fila
      h(
        "div",
        { display: "flex", alignItems: "center", gap: 16, marginBottom: 20 },
        [
          h("div", { display: "flex", alignItems: "center", gap: 8 }, [
            h("div", { width: 8, height: 8, borderRadius: 4, backgroundColor: "#3B82F6" }),
            h("span", { fontSize: 14, color: "#3B82F6", letterSpacing: 2 }, `${identity.web}/blog`),
          ]),
          h(
            "span",
            {
              fontSize: 12,
              fontWeight: 700,
              color: "#3B82F6",
              backgroundColor: "#1E3A5F",
              padding: "3px 10px",
              borderRadius: 6,
              letterSpacing: 1,
            },
            typeLabel.toUpperCase(),
          ),
        ],
      ),

      // Título
      h(
        "div",
        {
          fontSize: 36,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.2,
          marginBottom: 14,
        },
        safeTitle,
      ),

      // Descripción
      h(
        "div",
        {
          fontSize: 16,
          color: "#9CA3AF",
          lineHeight: 1.6,
          marginBottom: hasCover ? 24 : 0,
        },
        safeDesc,
      ),

      // Imagen abajo (ancho completo, sin spacer flexible)
      ...(hasCover
        ? [
            h("div", {
              width: "100%",
              height: 240,
              borderRadius: 10,
              backgroundImage: `url(${coverURL})`,
              backgroundSize: "cover",
              backgroundPosition: "center center",
              marginBottom: 20,
            }),
          ]
        : [h("div", { flex: 1 })]),

      // Footer
      h(
        "div",
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #1F2937",
          paddingTop: 16,
        },
        [
          h("div", { display: "flex", alignItems: "center", gap: 12 }, [
            h("span", { fontSize: 14, color: "#E5E7EB", fontWeight: 700 }, identity.name),
            h("span", { fontSize: 14, color: "#374151" }, "·"),
            h("span", { fontSize: 14, color: "#6B7280" }, identity.role),
            ...(dateStr
              ? [
                  h("span", { fontSize: 14, color: "#374151" }, "·"),
                  h("span", { fontSize: 14, color: "#6B7280" }, dateStr),
                ]
              : []),
          ]),
          h("span", { fontSize: 14, color: "#3B82F6" }, identity.web),
        ],
      ),
    ],
  );

  const png = await renderOGImage(image);
  return pngResponse(png);
};
