/**
 * GET /og/home.png — OG image de la home
 */

import type { APIRoute } from "astro";
import { h, renderOGImage, pngResponse } from "../../lib/og";
import { identity, skills, talks } from "../../data/site";

export const GET: APIRoute = async () => {
  const topSkills = [...skills.frontend.slice(0, 3), ...skills.a11y.slice(0, 2)].join(" · ");
  const talk = talks[0];

  const image = h(
    "div",
    {
      display: "flex",
      flexDirection: "column",
      width: "100%",
      height: "100%",
      backgroundColor: "#020408",
      padding: "56px 64px",
      fontFamily: "Inter",
      position: "relative",
    },
    [
      // Borde izquierdo decorativo
      h("div", {
        position: "absolute",
        left: 0,
        top: 0,
        bottom: 0,
        width: 4,
        backgroundColor: "#3B82F6",
      }),

      // Label superior
      h(
        "div",
        {
          display: "flex",
          alignItems: "center",
          gap: 8,
          marginBottom: 40,
        },
        [
          h("div", {
            width: 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: "#3B82F6",
          }),
          h(
            "span",
            {
              fontFamily: "Inter",
              fontSize: 14,
              color: "#3B82F6",
              letterSpacing: 2,
            },
            identity.web,
          ),
        ],
      ),

      // Nombre
      h(
        "div",
        {
          fontSize: 56,
          fontWeight: 700,
          color: "#ffffff",
          lineHeight: 1.1,
          marginBottom: 12,
        },
        identity.name,
      ),

      // Rol
      h(
        "div",
        {
          fontSize: 26,
          fontWeight: 400,
          color: "#3B82F6",
          marginBottom: 32,
        },
        identity.role,
      ),

      // Skills
      h(
        "div",
        {
          fontSize: 18,
          color: "#9CA3AF",
          marginBottom: 20,
        },
        topSkills,
      ),

      // Localización y estado
      h(
        "div",
        {
          fontSize: 15,
          color: "#6B7280",
          fontFamily: "Inter",
          marginBottom: 40,
        },
        `${identity.location} · remoto · ${identity.status}`,
      ),

      // Spacer
      h("div", { flex: 1 }),

      // Footer: charla + URL
      h(
        "div",
        {
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderTop: "1px solid #1F2937",
          paddingTop: 24,
        },
        [
          h(
            "span",
            { fontSize: 14, color: "#4B5563" },
            talk ? `${talk.role} ${talk.event}` : "Frontend Engineer",
          ),
          h(
            "span",
            {
              fontSize: 14,
              color: "#3B82F6",
              fontFamily: "Inter",
            },
            identity.web,
          ),
        ],
      ),
    ],
  );

  const png = await renderOGImage(image);
  return pngResponse(png);
};
