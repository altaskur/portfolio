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

/** Verifica que una URL de imagen es accesible (satori la fetchea él solo) */
async function validateImageURL(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { method: "HEAD", signal: AbortSignal.timeout(5000) });
    return res.ok;
  } catch {
    return false;
  }
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

  // Convertir path relativo a absoluto (GitHub Pages = altaskur.dev)
  let coverURL: string | null = null;
  if (post.data.coverImage) {
    const absURL = post.data.coverImage.startsWith("http")
      ? post.data.coverImage
      : `https://altaskur.dev${post.data.coverImage}`;
    const ok = await validateImageURL(absURL);
    if (ok) coverURL = absURL;
  }

  const hasCover = !!coverURL;

  // Truncar según si hay imagen (menos espacio) o no
  const maxTitle = hasCover ? 55 : 72;
  const maxDesc = hasCover ? 110 : 140;
  const safeTitle = title.length > maxTitle ? title.slice(0, maxTitle) + "…" : title;
  const safeDesc = description.length > maxDesc ? description.slice(0, maxDesc) + "…" : description;

  // ─── Columna de texto ───────────────────────────────────────────────────────
  const textCol = h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      flex: hasCover ? "0 0 58%" : "1",
      paddingRight: hasCover ? 40 : 0,
    },
    [
      // Label superior
      h(
        "div",
        { display: "flex", alignItems: "center", gap: 8, marginBottom: 28 },
        [
          h("div", { width: 8, height: 8, borderRadius: 4, backgroundColor: "#3B82F6" }),
          h("span", { fontSize: 14, color: "#3B82F6", letterSpacing: 2 }, `${identity.web}/blog`),
        ],
      ),

      // Badge tipo
      h(
        "div",
        { display: "flex", marginBottom: 18 },
        h(
          "span",
          {
            fontSize: 12,
            fontWeight: 700,
            color: "#3B82F6",
            backgroundColor: "#1E3A5F",
            padding: "4px 12px",
            borderRadius: 6,
            letterSpacing: 1,
          },
          typeLabel.toUpperCase(),
        ),
      ),

      // Título
      h(
        "div",
        {
          fontSize: hasCover ? 38 : 44,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.2,
          marginBottom: 20,
        },
        safeTitle,
      ),

      // Descripción
      h(
        "div",
        {
          fontSize: 18,
          color: "#9CA3AF",
          lineHeight: 1.5,
        },
        safeDesc,
      ),

      // Spacer
      h("div", { flex: 1 }),
    ],
  );

  // ─── Columna imagen — URL absoluta, satori la fetcha directamente ────────────
  const imageCol = hasCover
    ? h("div", {
        flex: "0 0 42%",
        borderRadius: 12,
        backgroundImage: `url(${coverURL})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      })
    : null;

  // ─── Layout raíz ───────────────────────────────────────────────────────────
  const image = h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      backgroundColor: "#020408",
      padding: "52px 60px",
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

      // Fila principal: texto + imagen
      {
        type: "div",
        props: {
          style: {
            display: "flex",
            flexDirection: "row",
            flex: 1,
            gap: 0,
            marginBottom: 24,
          },
          children: hasCover ? [textCol, imageCol!] : [textCol],
        },
      },

      // Footer
      h(
        "div",
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #1F2937",
          paddingTop: 20,
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
