import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

/**
 * iOS home-screen icon. Squared off with generous padding, because iOS applies
 * its own mask and clips anything that reaches the edges.
 */
export default function AppleIcon() {
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
        <svg width="104" height="104" viewBox="0 0 24 24" fill="none">
          <path
            d="M4 19.5 19.5 4v6.4a4 4 0 0 1-1.17 2.83l-5.1 5.1A4 4 0 0 1 10.4 19.5H4Z"
            fill="#f7f8f8"
          />
        </svg>
      </div>
    ),
    size,
  );
}
