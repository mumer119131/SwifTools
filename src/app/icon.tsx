import { ImageResponse } from "next/og";

export const size = { width: 512, height: 512 };
export const contentType = "image/png";

/** Favicon and PWA icon, drawn from the same blade mark as the header logo. */
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
        <svg width="320" height="320" viewBox="0 0 24 24" fill="none">
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
