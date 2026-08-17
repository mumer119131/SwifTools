import { ImageResponse } from "next/og";

import { getCategory } from "@/config/categories";
import { siteConfig } from "@/config/site";
import { getTool, publishedTools, toolHref } from "@/config/tools";

export const alt = "Tool preview";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * A social card per tool, generated at build time.
 *
 * One shared image across 237 pages means every link looks identical in a
 * message or a tweet, which wastes the one piece of context a preview gives
 * you. This puts the tool's own name, description and category on the card.
 *
 * `generateStaticParams` is required here or the route becomes dynamic and
 * every card is rendered on demand.
 */
export function generateStaticParams() {
  return publishedTools.map((tool) => ({
    category: tool.category,
    tool: tool.slug,
  }));
}

const ACCENTS: Record<string, string> = {
  pdf: "rgba(224,90,74,0.35)",
  image: "rgba(63,168,138,0.35)",
  text: "rgba(217,185,60,0.32)",
  developer: "rgba(94,106,210,0.35)",
  color: "rgba(196,95,158,0.35)",
  converter: "rgba(63,143,196,0.35)",
  units: "rgba(63,143,196,0.35)",
  calculator: "rgba(127,174,67,0.32)",
  seo: "rgba(224,145,63,0.35)",
  generator: "rgba(138,95,196,0.35)",
  social: "rgba(196,101,95,0.35)",
  science: "rgba(74,158,127,0.35)",
  home: "rgba(224,145,63,0.32)",
  fun: "rgba(138,95,196,0.35)",
};

export default async function ToolOpenGraphImage({
  params,
}: {
  params: Promise<{ category: string; tool: string }>;
}) {
  const { category: categorySlug, tool: toolSlug } = await params;
  const tool = getTool(categorySlug, toolSlug);
  const category = getCategory(categorySlug);

  // A missing tool still has to return an image, or the build fails on a route
  // that should simply 404.
  const name = tool?.name ?? siteConfig.name;
  const description = tool?.description ?? siteConfig.tagline;
  const path = tool ? toolHref(tool) : "/";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#08090a",
          padding: 80,
          position: "relative",
        }}
      >
        <div
          style={{
            position: "absolute",
            top: -340,
            right: 180,
            width: 900,
            height: 900,
            borderRadius: 9999,
            background: `radial-gradient(circle, ${ACCENTS[categorySlug] ?? ACCENTS.developer} 0%, rgba(8,9,10,0) 62%)`,
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <svg width="36" height="36" viewBox="0 0 24 24" fill="none">
            <rect x="2" y="3" width="20" height="4" rx="2" fill="#f7f8f8" />
            <rect x="4.5" y="10" width="15" height="4" rx="2" fill="#f7f8f8" />
            <rect x="7" y="17" width="10" height="4" rx="2" fill="#f7f8f8" />
          </svg>
          <span style={{ fontSize: 30, fontWeight: 600, color: "#f7f8f8", letterSpacing: -0.5 }}>
            {siteConfig.name}
          </span>
          {category ? (
            <span
              style={{
                fontSize: 20,
                color: "#8a8f98",
                border: "1px solid #26282c",
                borderRadius: 9999,
                padding: "6px 16px",
                marginLeft: 8,
              }}
            >
              {category.label}
            </span>
          ) : null}
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <span
            style={{
              fontSize: name.length > 28 ? 68 : 84,
              fontWeight: 600,
              color: "#f7f8f8",
              letterSpacing: -2.5,
              lineHeight: 1.05,
            }}
          >
            {name}
          </span>
          <span style={{ fontSize: 30, color: "#8a8f98", lineHeight: 1.35, maxWidth: 940 }}>
            {description}
          </span>
        </div>

        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
          <span style={{ fontSize: 24, color: "#62666d" }}>
            {siteConfig.url.replace(/^https?:\/\//, "")}
            {path}
          </span>
          <span style={{ fontSize: 24, color: "#62666d" }}>Free · No signup</span>
        </div>
      </div>
    ),
    size,
  );
}
