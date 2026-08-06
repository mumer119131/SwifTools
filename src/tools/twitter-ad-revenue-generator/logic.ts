import { SANS, drawAvatar, formatCount, roundedRect } from "@/lib/mockup";
import { palettes, type Palette } from "@/lib/social-mockup";

export interface PayoutOptions {
  handle: string;
  name: string;
  amount: number;
  currency: string;
  period: string;
  impressions: number;
  engagements: number;
  followers: number;
  avatar: CanvasImageSource | null;
  palette: Palette;
  width: number;
  scale: number;
}

function formatMoney(value: number, currency: string): string {
  try {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency,
      maximumFractionDigits: 2,
    }).format(value);
  } catch {
    return `${value.toFixed(2)} ${currency}`;
  }
}

/** A payout summary card: header, headline figure, then a stat row. */
export function renderPayout(canvas: HTMLCanvasElement, options: PayoutOptions): void {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not get a 2D canvas context.");

  const { palette, width } = options;
  const height = 300;

  canvas.width = Math.round(width * options.scale);
  canvas.height = Math.round(height * options.scale);
  context.scale(options.scale, options.scale);

  context.fillStyle = palette.background;
  context.fillRect(0, 0, width, height);

  // Header
  drawAvatar(context, options.avatar, options.name, 24, 24, 44);
  context.textBaseline = "alphabetic";
  context.font = `700 16px ${SANS}`;
  context.fillStyle = palette.text;
  context.fillText(options.name || "Name", 80, 45);
  context.font = `14px ${SANS}`;
  context.fillStyle = palette.muted;
  context.fillText(`@${options.handle.replace(/^@/, "") || "handle"}`, 80, 64);

  context.font = `13px ${SANS}`;
  context.textAlign = "right";
  context.fillText(options.period, width - 24, 45);
  context.textAlign = "left";

  // Divider
  context.strokeStyle = palette.border;
  context.lineWidth = 1;
  context.beginPath();
  context.moveTo(24, 88);
  context.lineTo(width - 24, 88);
  context.stroke();

  // Headline figure
  context.font = `14px ${SANS}`;
  context.fillStyle = palette.muted;
  context.fillText("Estimated payout", 24, 122);

  context.font = `700 46px ${SANS}`;
  context.fillStyle = palette.text;
  context.fillText(formatMoney(options.amount, options.currency), 24, 172);

  // Stats
  const stats: [string, string][] = [
    ["Impressions", formatCount(options.impressions)],
    ["Engagements", formatCount(options.engagements)],
    ["Followers", formatCount(options.followers)],
  ];

  const boxWidth = (width - 48 - 16) / 3;
  stats.forEach(([label, value], index) => {
    const x = 24 + index * (boxWidth + 8);
    context.fillStyle = palette.border;
    roundedRect(context, x, 200, boxWidth, 72, 12);
    context.fill();

    context.font = `12px ${SANS}`;
    context.fillStyle = palette.muted;
    context.fillText(label, x + 14, 224);

    context.font = `700 22px ${SANS}`;
    context.fillStyle = palette.text;
    context.fillText(value, x + 14, 254);
  });
}

export { palettes };
