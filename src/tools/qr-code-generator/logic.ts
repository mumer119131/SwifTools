export type ContentKind = "url" | "text" | "wifi" | "vcard" | "email" | "sms";

/**
 * Error-correction levels. Higher recovery means a denser code for the same
 * data — worth it for anything printed, where a scuff or a logo overlay would
 * otherwise break the scan.
 */
export const errorLevels = [
  { value: "L", label: "Low — 7% recoverable" },
  { value: "M", label: "Medium — 15% recoverable" },
  { value: "Q", label: "Quartile — 25% recoverable" },
  { value: "H", label: "High — 30% recoverable" },
] as const;

export type ErrorLevel = (typeof errorLevels)[number]["value"];

export interface WifiFields {
  ssid: string;
  password: string;
  encryption: "WPA" | "WEP" | "nopass";
  hidden: boolean;
}

export interface VcardFields {
  firstName: string;
  lastName: string;
  organisation: string;
  title: string;
  phone: string;
  email: string;
  url: string;
}

/**
 * Wi-Fi payloads use a `WIFI:` scheme where `\ ; , :` are meta-characters, so a
 * password containing any of them must be escaped or the network silently
 * fails to join.
 */
function escapeWifi(value: string): string {
  return value.replace(/([\\;,:"])/g, "\\$1");
}

export function buildPayload(
  kind: ContentKind,
  text: string,
  wifi: WifiFields,
  vcard: VcardFields,
): string {
  switch (kind) {
    case "url": {
      const trimmed = text.trim();
      if (!trimmed) return "";
      // A bare domain scans as a search on most phones without a scheme.
      return /^[a-z][a-z0-9+.-]*:/i.test(trimmed) ? trimmed : `https://${trimmed}`;
    }

    case "wifi": {
      if (!wifi.ssid.trim()) return "";
      const parts = [
        `T:${wifi.encryption}`,
        `S:${escapeWifi(wifi.ssid)}`,
        wifi.encryption !== "nopass" ? `P:${escapeWifi(wifi.password)}` : "",
        wifi.hidden ? "H:true" : "",
      ].filter(Boolean);
      return `WIFI:${parts.join(";")};;`;
    }

    case "vcard": {
      if (!vcard.firstName.trim() && !vcard.lastName.trim()) return "";
      const lines = [
        "BEGIN:VCARD",
        "VERSION:3.0",
        `N:${vcard.lastName};${vcard.firstName};;;`,
        `FN:${[vcard.firstName, vcard.lastName].filter(Boolean).join(" ")}`,
        vcard.organisation ? `ORG:${vcard.organisation}` : "",
        vcard.title ? `TITLE:${vcard.title}` : "",
        vcard.phone ? `TEL;TYPE=CELL:${vcard.phone}` : "",
        vcard.email ? `EMAIL:${vcard.email}` : "",
        vcard.url ? `URL:${vcard.url}` : "",
        "END:VCARD",
      ].filter(Boolean);
      return lines.join("\n");
    }

    case "email": {
      const trimmed = text.trim();
      return trimmed ? `mailto:${trimmed}` : "";
    }

    case "sms": {
      const trimmed = text.trim();
      return trimmed ? `sms:${trimmed}` : "";
    }

    default:
      return text;
  }
}

export interface RenderOptions {
  size: number;
  margin: number;
  darkColor: string;
  lightColor: string;
  errorLevel: ErrorLevel;
}

/** `qrcode` is imported lazily — it never needs to reach any other page. */
export async function renderToCanvas(
  canvas: HTMLCanvasElement,
  payload: string,
  options: RenderOptions,
): Promise<void> {
  const QRCode = (await import("qrcode")).default;
  await QRCode.toCanvas(canvas, payload, {
    width: options.size,
    margin: options.margin,
    errorCorrectionLevel: options.errorLevel,
    color: { dark: options.darkColor, light: options.lightColor },
  });
}

export async function renderToSvg(payload: string, options: RenderOptions): Promise<string> {
  const QRCode = (await import("qrcode")).default;
  return QRCode.toString(payload, {
    type: "svg",
    width: options.size,
    margin: options.margin,
    errorCorrectionLevel: options.errorLevel,
    color: { dark: options.darkColor, light: options.lightColor },
  });
}

export async function renderToPngBlob(
  payload: string,
  options: RenderOptions,
): Promise<Blob> {
  const canvas = document.createElement("canvas");
  await renderToCanvas(canvas, payload, options);

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("The QR code could not be encoded."))),
      "image/png",
    );
  });
}

/**
 * Contrast between the two colours, used to warn before someone prints a code
 * that scanners cannot read.
 */
export function contrastRatio(a: string, b: string): number {
  const luminance = (hex: string) => {
    const value = hex.replace("#", "");
    const full = value.length === 3 ? value.split("").map((c) => c + c).join("") : value;
    const channels = [0, 2, 4].map((offset) => {
      const channel = parseInt(full.slice(offset, offset + 2), 16) / 255;
      return channel <= 0.04045 ? channel / 12.92 : ((channel + 0.055) / 1.055) ** 2.4;
    });
    return 0.2126 * channels[0] + 0.7152 * channels[1] + 0.0722 * channels[2];
  };

  try {
    const la = luminance(a);
    const lb = luminance(b);
    return (Math.max(la, lb) + 0.05) / (Math.min(la, lb) + 0.05);
  } catch {
    return 21;
  }
}
