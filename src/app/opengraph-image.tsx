import { ImageResponse } from "next/og";

import { siteConfig } from "@/config/site";
import { browsableTools } from "@/config/tools";

export const alt = `${siteConfig.name} — ${siteConfig.tagline}`;
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

/**
 * The social card, rendered at build time from `siteConfig` — renaming the app
 * regenerates it. Deliberately monochrome-on-near-black to match the site
 * chrome, with one indigo wash standing in for the ambient hero gradient.
 */
export default function OpenGraphImage() {
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
            top: -320,
            left: 300,
            width: 900,
            height: 900,
            borderRadius: 9999,
            background: "radial-gradient(circle, rgba(94,106,210,0.35) 0%, rgba(8,9,10,0) 62%)",
            display: "flex",
          }}
        />

        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
            <path
              d="M4 19.5 19.5 4v6.4a4 4 0 0 1-1.17 2.83l-5.1 5.1A4 4 0 0 1 10.4 19.5H4Z"
              fill="#f7f8f8"
            />
          </svg>
          <span style={{ fontSize: 38, fontWeight: 600, color: "#f7f8f8", letterSpacing: -1 }}>
            {siteConfig.name}
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 24 }}>
          <span
            style={{
              fontSize: 82,
              fontWeight: 600,
              color: "#f7f8f8",
              letterSpacing: -3.5,
              lineHeight: 1.05,
              maxWidth: 900,
            }}
          >
            {siteConfig.tagline}
          </span>
          <span style={{ fontSize: 30, color: "#8a8f98", letterSpacing: -0.5 }}>
            {/*
              Browsable, not the full registry. `tools` includes the 82
              search-only unit pair pages, so counting it advertised 246 while
              the homepage said 164 — a number the visitor cannot find on arrival.
            */}
            {browsableTools.length} free tools · No signup · Runs in your browser
          </span>
        </div>
      </div>
    ),
    size,
  );
}
