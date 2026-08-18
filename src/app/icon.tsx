import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Favicon and PWA icon, the same four-cell grid mark as the header logo. */
export default function Icon() {
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
          borderRadius: 96,
        }}
      >
        <svg width="300" height="300" viewBox="0 0 24 24" fill="none">
          <rect x="3" y="3" width="7.5" height="7.5" rx="2.2" fill="#f7f8f8" />
          <rect x="13.5" y="3" width="7.5" height="7.5" rx="2.2" fill="#f7f8f8" />
          <rect x="3" y="13.5" width="7.5" height="7.5" rx="2.2" fill="#f7f8f8" />
          <rect x="13.5" y="13.5" width="7.5" height="7.5" rx="3.75" fill="#f7f8f8" opacity="0.55" />
        </svg>
      </div>
    ),
    size,
  );
}
