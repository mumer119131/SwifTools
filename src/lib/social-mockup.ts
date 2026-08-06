import {
  SANS,
  drawAvatar,
  drawStatusBar,
  drawVerifiedBadge,
  formatCount,
  measureWrapped,
  roundedRect,
  wrapText,
} from "@/lib/mockup";

export interface Palette {
  background: string;
  text: string;
  muted: string;
  border: string;
  accent: string;
}

export const palettes: Record<"light" | "dark", Palette> = {
  light: {
    background: "#ffffff",
    text: "#0f1419",
    muted: "#536471",
    border: "#eff3f4",
    accent: "#1d9bf0",
  },
  dark: {
    background: "#000000",
    text: "#e7e9ea",
    muted: "#71767b",
    border: "#2f3336",
    accent: "#1d9bf0",
  },
};

/* ------------------------------------------------------------------- Tweet */

export interface TweetOptions {
  name: string;
  handle: string;
  text: string;
  time: string;
  verified: boolean;
  replies: number;
  reposts: number;
  likes: number;
  views: number;
  avatar: CanvasImageSource | null;
  attachment: CanvasImageSource | null;
  palette: Palette;
  width: number;
  scale: number;
  showMetrics: boolean;
}

/**
 * Draws a single post card.
 *
 * Measured first, then painted, so the canvas height matches the content — a
 * fixed height would either clip a long post or leave dead space under a short
 * one.
 */
export function renderTweet(canvas: HTMLCanvasElement, options: TweetOptions): void {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not get a 2D canvas context.");

  const { palette, width } = options;
  const padding = 20;
  const avatarSize = 48;
  const contentX = padding + avatarSize + 12;
  const contentWidth = width - contentX - padding;

  const bodySize = 17;
  const lineHeight = 24;

  context.font = `${bodySize}px ${SANS}`;
  const lines = wrapText(context, options.text, contentWidth);

  const attachmentHeight = options.attachment ? Math.round(contentWidth * 0.56) : 0;
  const metricsHeight = options.showMetrics ? 34 : 0;

  const height =
    padding + Math.max(avatarSize, 22) + 6 + lines.length * lineHeight + 12 +
    (attachmentHeight ? attachmentHeight + 12 : 0) +
    metricsHeight + padding;

  canvas.width = Math.round(width * options.scale);
  canvas.height = Math.round(height * options.scale);
  context.scale(options.scale, options.scale);

  context.fillStyle = palette.background;
  context.fillRect(0, 0, width, height);

  drawAvatar(context, options.avatar, options.name, padding, padding, avatarSize);

  // Name, badge, handle
  context.textBaseline = "alphabetic";
  context.font = `700 15px ${SANS}`;
  context.fillStyle = palette.text;
  const displayName = options.name || "Name";
  context.fillText(displayName, contentX, padding + 17);

  let cursorX = contentX + context.measureText(displayName).width + 5;
  if (options.verified) {
    drawVerifiedBadge(context, cursorX, padding + 4, 16, palette.accent);
    cursorX += 20;
  }

  context.font = `15px ${SANS}`;
  context.fillStyle = palette.muted;
  const handle = options.handle ? `@${options.handle.replace(/^@/, "")}` : "@handle";
  context.fillText(`${handle} · ${options.time}`, cursorX, padding + 17);

  // Body
  context.font = `${bodySize}px ${SANS}`;
  context.fillStyle = palette.text;
  let y = padding + 44;
  for (const line of lines) {
    context.fillText(line, contentX, y);
    y += lineHeight;
  }

  // Attachment
  if (options.attachment) {
    y += 4;
    context.save();
    roundedRect(context, contentX, y, contentWidth, attachmentHeight, 16);
    context.clip();
    context.drawImage(options.attachment, contentX, y, contentWidth, attachmentHeight);
    context.restore();
    context.strokeStyle = palette.border;
    context.lineWidth = 1;
    roundedRect(context, contentX, y, contentWidth, attachmentHeight, 16);
    context.stroke();
    y += attachmentHeight + 12;
  }

  if (options.showMetrics) {
    drawMetrics(context, options, contentX, y + 14, contentWidth);
  }
}

function drawMetrics(
  context: CanvasRenderingContext2D,
  options: TweetOptions,
  x: number,
  y: number,
  width: number,
): void {
  const { palette } = options;
  const entries: [string, number][] = [
    ["reply", options.replies],
    ["repost", options.reposts],
    ["like", options.likes],
    ["view", options.views],
  ];

  const step = width / entries.length;
  context.font = `13px ${SANS}`;

  entries.forEach(([kind, value], index) => {
    const iconX = x + index * step;
    context.strokeStyle = palette.muted;
    context.fillStyle = palette.muted;
    context.lineWidth = 1.5;
    drawMetricIcon(context, kind, iconX, y - 6);
    context.fillText(formatCount(value), iconX + 24, y);
  });
}

function drawMetricIcon(
  context: CanvasRenderingContext2D,
  kind: string,
  x: number,
  y: number,
): void {
  context.save();
  context.beginPath();

  if (kind === "reply") {
    context.roundRect(x, y - 6, 15, 12, 3);
    context.moveTo(x + 4, y + 6);
    context.lineTo(x + 4, y + 10);
    context.lineTo(x + 8, y + 6);
  } else if (kind === "repost") {
    context.moveTo(x + 1, y - 2);
    context.lineTo(x + 1, y + 4);
    context.lineTo(x + 13, y + 4);
    context.moveTo(x + 10, y + 1);
    context.lineTo(x + 13, y + 4);
    context.lineTo(x + 10, y + 7);
  } else if (kind === "like") {
    // Simple heart from two arcs and a point.
    context.moveTo(x + 7, y + 6);
    context.bezierCurveTo(x - 2, y, x + 1, y - 7, x + 7, y - 2);
    context.bezierCurveTo(x + 13, y - 7, x + 16, y, x + 7, y + 6);
  } else {
    // Bar chart for views.
    context.moveTo(x + 1, y + 5);
    context.lineTo(x + 1, y + 1);
    context.moveTo(x + 6, y + 5);
    context.lineTo(x + 6, y - 3);
    context.moveTo(x + 11, y + 5);
    context.lineTo(x + 11, y - 6);
  }

  context.stroke();
  context.restore();
}

/* --------------------------------------------------------------- Instagram */

export interface InstagramPostOptions {
  username: string;
  location: string;
  caption: string;
  likes: number;
  comments: number;
  timeAgo: string;
  verified: boolean;
  avatar: CanvasImageSource | null;
  photo: CanvasImageSource | null;
  palette: Palette;
  width: number;
  scale: number;
  /** 1:1, 4:5 or 1.91:1 — Instagram's three supported ratios. */
  aspect: number;
}

export function renderInstagramPost(
  canvas: HTMLCanvasElement,
  options: InstagramPostOptions,
): void {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not get a 2D canvas context.");

  const { palette, width } = options;
  const headerHeight = 58;
  const photoHeight = Math.round(width / options.aspect);
  const actionsHeight = 46;

  context.font = `14px ${SANS}`;
  const captionLines = wrapText(
    context,
    `${options.username}  ${options.caption}`,
    width - 28,
  );

  const captionHeight = options.caption ? captionLines.length * 19 + 8 : 0;
  const height = headerHeight + photoHeight + actionsHeight + 24 + captionHeight + 26;

  canvas.width = Math.round(width * options.scale);
  canvas.height = Math.round(height * options.scale);
  context.scale(options.scale, options.scale);

  context.fillStyle = palette.background;
  context.fillRect(0, 0, width, height);

  // Header
  drawAvatar(context, options.avatar, options.username, 14, 11, 36);
  context.textBaseline = "alphabetic";
  context.font = `600 14px ${SANS}`;
  context.fillStyle = palette.text;
  const name = options.username || "username";
  context.fillText(name, 60, options.location ? 26 : 33);

  if (options.verified) {
    drawVerifiedBadge(context, 62 + context.measureText(name).width, options.location ? 15 : 22, 14, palette.accent);
  }

  if (options.location) {
    context.font = `12px ${SANS}`;
    context.fillStyle = palette.muted;
    context.fillText(options.location, 60, 41);
  }

  // Overflow dots
  context.fillStyle = palette.text;
  for (let i = 0; i < 3; i += 1) {
    context.beginPath();
    context.arc(width - 32 + i * 8, 29, 1.7, 0, Math.PI * 2);
    context.fill();
  }

  // Photo
  const photoY = headerHeight;
  if (options.photo) {
    context.save();
    context.beginPath();
    context.rect(0, photoY, width, photoHeight);
    context.clip();
    // Cover-fit so the image fills the frame without distortion.
    const source = options.photo as { width: number; height: number };
    const sourceRatio = source.width / source.height;
    const targetRatio = width / photoHeight;
    let drawWidth = width;
    let drawHeight = photoHeight;
    if (sourceRatio > targetRatio) drawWidth = photoHeight * sourceRatio;
    else drawHeight = width / sourceRatio;
    context.drawImage(
      options.photo,
      (width - drawWidth) / 2,
      photoY + (photoHeight - drawHeight) / 2,
      drawWidth,
      drawHeight,
    );
    context.restore();
  } else {
    context.fillStyle = palette.border;
    context.fillRect(0, photoY, width, photoHeight);
    context.fillStyle = palette.muted;
    context.font = `13px ${SANS}`;
    context.textAlign = "center";
    context.fillText("Add a photo", width / 2, photoY + photoHeight / 2);
    context.textAlign = "left";
  }

  // Actions
  let y = photoY + photoHeight + 28;
  context.strokeStyle = palette.text;
  context.lineWidth = 1.8;
  drawMetricIcon(context, "like", 14, y);
  drawMetricIcon(context, "reply", 52, y);
  drawMetricIcon(context, "repost", 92, y);

  // Bookmark, right-aligned
  context.beginPath();
  context.moveTo(width - 28, y - 7);
  context.lineTo(width - 28, y + 7);
  context.lineTo(width - 22, y + 2);
  context.lineTo(width - 16, y + 7);
  context.lineTo(width - 16, y - 7);
  context.closePath();
  context.stroke();

  y += 24;
  context.font = `600 14px ${SANS}`;
  context.fillStyle = palette.text;
  context.fillText(`${formatCount(options.likes)} likes`, 14, y);

  if (options.caption) {
    y += 20;
    context.font = `14px ${SANS}`;
    captionLines.forEach((line, index) => {
      // The username is bold only on the first line, as Instagram renders it.
      if (index === 0) {
        context.font = `600 14px ${SANS}`;
        context.fillStyle = palette.text;
        context.fillText(name, 14, y);
        const offset = context.measureText(name).width + 6;
        context.font = `14px ${SANS}`;
        context.fillText(line.slice(name.length).trimStart(), 14 + offset, y);
      } else {
        context.fillText(line, 14, y);
      }
      y += 19;
    });
  }

  y += 6;
  context.font = `12px ${SANS}`;
  context.fillStyle = palette.muted;
  if (options.comments > 0) {
    context.fillText(`View all ${formatCount(options.comments)} comments`, 14, y);
    y += 17;
  }
  context.fillText(options.timeAgo, 14, y);
}

/* ------------------------------------------------------------- Story frame */

export interface StoryOptions {
  username: string;
  text: string;
  timeAgo: string;
  avatar: CanvasImageSource | null;
  photo: CanvasImageSource | null;
  gradient: [string, string];
  textColor: string;
  scale: number;
}

/** 1080×1920 — Instagram's story canvas, exported at that exact size. */
export function renderStory(canvas: HTMLCanvasElement, options: StoryOptions): void {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not get a 2D canvas context.");

  const width = 405;
  const height = 720;

  canvas.width = Math.round(width * options.scale);
  canvas.height = Math.round(height * options.scale);
  context.scale(options.scale, options.scale);

  if (options.photo) {
    const source = options.photo as { width: number; height: number };
    const ratio = Math.max(width / source.width, height / source.height);
    const drawWidth = source.width * ratio;
    const drawHeight = source.height * ratio;
    context.drawImage(
      options.photo,
      (width - drawWidth) / 2,
      (height - drawHeight) / 2,
      drawWidth,
      drawHeight,
    );
  } else {
    const gradient = context.createLinearGradient(0, 0, width, height);
    gradient.addColorStop(0, options.gradient[0]);
    gradient.addColorStop(1, options.gradient[1]);
    context.fillStyle = gradient;
    context.fillRect(0, 0, width, height);
  }

  // Progress bar
  context.fillStyle = "rgba(255,255,255,0.35)";
  roundedRect(context, 12, 14, width - 24, 3, 2);
  context.fill();
  context.fillStyle = "#ffffff";
  roundedRect(context, 12, 14, (width - 24) * 0.4, 3, 2);
  context.fill();

  // Header
  drawAvatar(context, options.avatar, options.username, 14, 28, 32);
  context.font = `600 13px ${SANS}`;
  context.fillStyle = "#ffffff";
  context.textBaseline = "alphabetic";
  context.fillText(options.username || "username", 54, 48);
  context.font = `13px ${SANS}`;
  context.fillStyle = "rgba(255,255,255,0.75)";
  context.fillText(options.timeAgo, 54 + context.measureText(options.username || "username").width + 8, 48);

  // Centred caption
  if (options.text) {
    context.font = `600 28px ${SANS}`;
    const lines = wrapText(context, options.text, width - 72);
    const blockHeight = lines.length * 38;
    let y = height / 2 - blockHeight / 2;

    context.textAlign = "center";
    for (const line of lines) {
      const textWidth = context.measureText(line).width;
      // A translucent plate keeps the text readable over any photo.
      context.fillStyle = "rgba(0,0,0,0.28)";
      roundedRect(context, width / 2 - textWidth / 2 - 12, y - 28, textWidth + 24, 38, 8);
      context.fill();
      context.fillStyle = options.textColor;
      context.fillText(line, width / 2, y);
      y += 38;
    }
    context.textAlign = "left";
  }

  // Reply bar
  context.strokeStyle = "rgba(255,255,255,0.7)";
  context.lineWidth = 1.4;
  roundedRect(context, 14, height - 52, width - 100, 38, 19);
  context.stroke();
  context.fillStyle = "rgba(255,255,255,0.8)";
  context.font = `13px ${SANS}`;
  context.fillText("Send message", 30, height - 27);
}

export { drawStatusBar, measureWrapped, formatCount };
