import { ImageResponse } from "next/og";

export const dynamic = "force-static";

/**
 * The maskable variant of the app icon.
 *
 * Android crops a home-screen icon to whatever shape the launcher uses — a
 * circle, a squircle, a rounded square — and it crops hard: only the middle
 * 80% of the image is guaranteed to survive. An icon drawn to the edges loses
 * its corners.
 *
 * So this is the same mark on the same background, drawn small inside a
 * full-bleed field. The regular `/icon` keeps its own proportions for every
 * context that does not mask.
 */
export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#08090a",
        }}
      >
        {/* 55% of the canvas, comfortably inside the 80% safe zone. */}
        <svg width="282" height="282" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7.5" height="7.5" rx="2.2" fill="#f7f8f8" />
          <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.2" fill="#f7f8f8" />
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.2" fill="#f7f8f8" />
          <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="3.75" fill="#f7f8f8" opacity="0.55" />
        </svg>
      </div>
    ),
    { width: 512, height: 512 },
  );
}
