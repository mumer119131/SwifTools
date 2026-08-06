export { palettes, renderTweet, type Palette, type TweetOptions } from "@/lib/social-mockup";
export { canvasToPng, loadImage } from "@/lib/mockup";

export const backdrops: { id: string; label: string; stops: [string, string] }[] = [
  { id: "indigo", label: "Indigo", stops: ["#5e6ad2", "#8e4ec6"] },
  { id: "sunset", label: "Sunset", stops: ["#f76b15", "#d6409f"] },
  { id: "mint", label: "Mint", stops: ["#30a46c", "#00a2c7"] },
  { id: "slate", label: "Slate", stops: ["#334155", "#0f172a"] },
  { id: "paper", label: "Paper", stops: ["#f4f4f5", "#e4e4e7"] },
];

export type Ratio = "square" | "landscape" | "auto";

/**
 * Composites the rendered card onto a gradient backdrop.
 *
 * The card is drawn on its own canvas first so its height can be measured, then
 * centred — which is what lets the output be a fixed 1:1 or 16:9 frame while
 * the card itself stays whatever height its text needs.
 */
export function compose(
  target: HTMLCanvasElement,
  card: HTMLCanvasElement,
  stops: [string, string],
  padding: number,
  ratio: Ratio,
  scale: number,
): void {
  const context = target.getContext("2d");
  if (!context) throw new Error("Could not get a 2D canvas context.");

  const cardWidth = card.width / scale;
  const cardHeight = card.height / scale;

  let width = cardWidth + padding * 2;
  let height = cardHeight + padding * 2;

  if (ratio === "square") {
    const side = Math.max(width, height);
    width = side;
    height = side;
  } else if (ratio === "landscape") {
    height = Math.max(height, Math.round(width * (9 / 16)));
    width = Math.max(width, Math.round(height * (16 / 9)));
  }

  target.width = Math.round(width * scale);
  target.height = Math.round(height * scale);
  context.scale(scale, scale);

  const gradient = context.createLinearGradient(0, 0, width, height);
  gradient.addColorStop(0, stops[0]);
  gradient.addColorStop(1, stops[1]);
  context.fillStyle = gradient;
  context.fillRect(0, 0, width, height);

  const x = (width - cardWidth) / 2;
  const y = (height - cardHeight) / 2;

  context.save();
  context.shadowColor = "rgba(0,0,0,0.28)";
  context.shadowBlur = 44;
  context.shadowOffsetY = 18;
  context.beginPath();
  context.roundRect(x, y, cardWidth, cardHeight, 18);
  context.fillStyle = "#ffffff";
  context.fill();
  context.restore();

  context.save();
  context.beginPath();
  context.roundRect(x, y, cardWidth, cardHeight, 18);
  context.clip();
  context.drawImage(card, x, y, cardWidth, cardHeight);
  context.restore();
}
