import {
  SANS,
  drawAvatar,
  drawStatusBar,
  measureWrapped,
  roundedRect,
  wrapText,
} from "@/lib/mockup";

export type Side = "in" | "out";
export type DeliveryStatus = "sent" | "delivered" | "read";

export interface Message {
  id: string;
  side: Side;
  text: string;
  time: string;
  status: DeliveryStatus;
}

export interface ChatTheme {
  id: "whatsapp" | "imessage" | "instagram";
  label: string;
  /** Chat area background. */
  background: string;
  headerBackground: string;
  headerText: string;
  headerSubText: string;
  outgoing: string;
  outgoingText: string;
  incoming: string;
  incomingText: string;
  timeText: string;
  /** Tick colour once a message is read. */
  readTick: string;
  tickText: string;
  bubbleRadius: number;
  /** WhatsApp puts the timestamp inside the bubble; iMessage does not. */
  timeInsideBubble: boolean;
  showTails: boolean;
  inputBackground: string;
  inputText: string;
}

export const themes: Record<ChatTheme["id"], { light: ChatTheme; dark: ChatTheme }> = {
  instagram: {
    light: {
      id: "instagram",
      label: "Instagram",
      background: "#ffffff",
      headerBackground: "#ffffff",
      headerText: "#000000",
      headerSubText: "#8e8e8e",
      // Instagram's outgoing bubbles use a purple gradient; a canvas fill takes
      // a single colour, so this is its midpoint.
      outgoing: "#9b52d4",
      outgoingText: "#ffffff",
      incoming: "#efefef",
      incomingText: "#000000",
      timeText: "#8e8e8e",
      readTick: "#8e8e8e",
      tickText: "#8e8e8e",
      bubbleRadius: 20,
      timeInsideBubble: false,
      showTails: false,
      inputBackground: "#ffffff",
      inputText: "#8e8e8e",
    },
    dark: {
      id: "instagram",
      label: "Instagram",
      background: "#000000",
      headerBackground: "#000000",
      headerText: "#ffffff",
      headerSubText: "#a8a8a8",
      outgoing: "#9b52d4",
      outgoingText: "#ffffff",
      incoming: "#262626",
      incomingText: "#ffffff",
      timeText: "#a8a8a8",
      readTick: "#a8a8a8",
      tickText: "#a8a8a8",
      bubbleRadius: 20,
      timeInsideBubble: false,
      showTails: false,
      inputBackground: "#262626",
      inputText: "#a8a8a8",
    },
  },
  whatsapp: {
    light: {
      id: "whatsapp",
      label: "WhatsApp",
      background: "#efe7de",
      headerBackground: "#f6f6f6",
      headerText: "#111b21",
      headerSubText: "#667781",
      outgoing: "#d9fdd3",
      outgoingText: "#111b21",
      incoming: "#ffffff",
      incomingText: "#111b21",
      timeText: "#667781",
      readTick: "#53bdeb",
      tickText: "#8696a0",
      bubbleRadius: 8,
      timeInsideBubble: true,
      showTails: true,
      inputBackground: "#ffffff",
      inputText: "#8696a0",
    },
    dark: {
      id: "whatsapp",
      label: "WhatsApp",
      background: "#0b141a",
      headerBackground: "#202c33",
      headerText: "#e9edef",
      headerSubText: "#8696a0",
      outgoing: "#005c4b",
      outgoingText: "#e9edef",
      incoming: "#202c33",
      incomingText: "#e9edef",
      timeText: "#8696a0",
      readTick: "#53bdeb",
      tickText: "#8696a0",
      bubbleRadius: 8,
      timeInsideBubble: true,
      showTails: true,
      inputBackground: "#2a3942",
      inputText: "#8696a0",
    },
  },
  imessage: {
    light: {
      id: "imessage",
      label: "iMessage",
      background: "#ffffff",
      headerBackground: "#f7f7f7",
      headerText: "#000000",
      headerSubText: "#8e8e93",
      outgoing: "#248bf5",
      outgoingText: "#ffffff",
      incoming: "#e9e9eb",
      incomingText: "#000000",
      timeText: "#8e8e93",
      readTick: "#8e8e93",
      tickText: "#8e8e93",
      bubbleRadius: 18,
      timeInsideBubble: false,
      showTails: true,
      inputBackground: "#ffffff",
      inputText: "#b0b0b5",
    },
    dark: {
      id: "imessage",
      label: "iMessage",
      background: "#000000",
      headerBackground: "#1c1c1e",
      headerText: "#ffffff",
      headerSubText: "#8e8e93",
      outgoing: "#248bf5",
      outgoingText: "#ffffff",
      incoming: "#26262a",
      incomingText: "#ffffff",
      timeText: "#8e8e93",
      readTick: "#8e8e93",
      tickText: "#8e8e93",
      bubbleRadius: 18,
      timeInsideBubble: false,
      showTails: true,
      inputBackground: "#1c1c1e",
      inputText: "#8e8e93",
    },
  },
};

export interface ChatOptions {
  theme: ChatTheme;
  contactName: string;
  contactStatus: string;
  statusBarTime: string;
  messages: Message[];
  avatar: CanvasImageSource | null;
  showStatusBar: boolean;
  showInputBar: boolean;
  width: number;
  scale: number;
}

const HEADER_HEIGHT = 64;
const STATUS_HEIGHT = 44;
const INPUT_HEIGHT = 64;

/**
 * Lays the conversation out twice: once to measure every bubble so the canvas
 * can be sized exactly, then once to paint. Sizing first avoids either a
 * clipped last message or a slab of empty space under a short chat.
 */
export function renderChat(canvas: HTMLCanvasElement, options: ChatOptions): void {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not get a 2D canvas context.");

  const { theme, width } = options;
  const maxBubbleWidth = width * 0.72;
  const gap = 4;
  const groupGap = 10;
  const fontSize = 15.5;
  const lineHeight = 21;

  context.font = `${fontSize}px ${SANS}`;

  // --- measure ---
  const laid = options.messages.map((message, index) => {
    const timeWidth = theme.timeInsideBubble
      ? context.measureText(`${message.time}  `).width + (message.side === "out" ? 18 : 0)
      : 0;

    const lines = wrapText(context, message.text, maxBubbleWidth - 26 - timeWidth);
    const textWidth = measureWrapped(context, lines);

    const bubbleWidth = Math.min(
      maxBubbleWidth,
      Math.max(48, textWidth + 26 + timeWidth),
    );
    const bubbleHeight = lines.length * lineHeight + 18;

    const previous = options.messages[index - 1];
    const startsGroup = !previous || previous.side !== message.side;

    return { message, lines, bubbleWidth, bubbleHeight, startsGroup };
  });

  const chatHeight = laid.reduce(
    (total, entry) => total + entry.bubbleHeight + (entry.startsGroup ? groupGap : gap),
    16,
  );

  const statusHeight = options.showStatusBar ? STATUS_HEIGHT : 0;
  const inputHeight = options.showInputBar ? INPUT_HEIGHT : 0;
  const height = statusHeight + HEADER_HEIGHT + chatHeight + inputHeight + 16;

  canvas.width = Math.round(width * options.scale);
  canvas.height = Math.round(height * options.scale);
  context.scale(options.scale, options.scale);

  // --- paint ---
  context.fillStyle = theme.background;
  context.fillRect(0, 0, width, height);

  context.fillStyle = theme.headerBackground;
  context.fillRect(0, 0, width, statusHeight + HEADER_HEIGHT);

  if (options.showStatusBar) {
    drawStatusBar(context, width, options.statusBarTime, theme.headerText);
  }

  drawHeader(context, options, statusHeight);

  let y = statusHeight + HEADER_HEIGHT + 12;
  context.font = `${fontSize}px ${SANS}`;

  for (const entry of laid) {
    y += entry.startsGroup ? groupGap - gap : 0;
    const isOut = entry.message.side === "out";
    const x = isOut ? width - 14 - entry.bubbleWidth : 14;

    drawBubble(context, theme, x, y, entry.bubbleWidth, entry.bubbleHeight, isOut, entry.startsGroup);

    context.fillStyle = isOut ? theme.outgoingText : theme.incomingText;
    context.textBaseline = "alphabetic";
    entry.lines.forEach((line, index) => {
      context.fillText(line, x + 13, y + 22 + index * lineHeight);
    });

    if (theme.timeInsideBubble) {
      context.font = `11px ${SANS}`;
      context.fillStyle = theme.timeText;
      context.textAlign = "right";
      const timeX = x + entry.bubbleWidth - (isOut ? 24 : 10);
      context.fillText(entry.message.time, timeX, y + entry.bubbleHeight - 8);
      if (isOut) drawTicks(context, theme, x + entry.bubbleWidth - 20, y + entry.bubbleHeight - 13, entry.message.status);
      context.textAlign = "left";
      context.font = `${fontSize}px ${SANS}`;
    }

    y += entry.bubbleHeight + gap;
  }

  // iMessage shows one delivery label under the final outgoing message.
  if (!theme.timeInsideBubble) {
    const lastOut = [...laid].reverse().find((entry) => entry.message.side === "out");
    if (lastOut) {
      context.font = `11px ${SANS}`;
      context.fillStyle = theme.timeText;
      context.textAlign = "right";
      const label =
        lastOut.message.status === "read"
          ? "Read"
          : lastOut.message.status === "delivered"
            ? "Delivered"
            : "Sent";
      context.fillText(label, width - 16, y + 4);
      context.textAlign = "left";
      y += 14;
    }
  }

  if (options.showInputBar) drawInputBar(context, theme, width, height);
}

function drawHeader(
  context: CanvasRenderingContext2D,
  options: ChatOptions,
  offsetY: number,
): void {
  const { theme } = options;

  // Back chevron
  context.strokeStyle = theme.id === "imessage" ? "#248bf5" : theme.headerText;
  context.lineWidth = 2;
  context.lineCap = "round";
  context.beginPath();
  context.moveTo(24, offsetY + 26);
  context.lineTo(16, offsetY + 32);
  context.lineTo(24, offsetY + 38);
  context.stroke();

  drawAvatar(context, options.avatar, options.contactName, 36, offsetY + 16, 34);

  context.fillStyle = theme.headerText;
  context.font = `600 16px ${SANS}`;
  context.textBaseline = "alphabetic";
  context.fillText(options.contactName || "Contact", 80, offsetY + 31);

  if (options.contactStatus) {
    context.fillStyle = theme.headerSubText;
    context.font = `13px ${SANS}`;
    context.fillText(options.contactStatus, 80, offsetY + 48);
  }
}

function drawBubble(
  context: CanvasRenderingContext2D,
  theme: ChatTheme,
  x: number,
  y: number,
  width: number,
  height: number,
  isOut: boolean,
  startsGroup: boolean,
): void {
  const r = theme.bubbleRadius;
  context.fillStyle = isOut ? theme.outgoing : theme.incoming;

  // Only the first bubble of a run gets a tail, which is how both apps group
  // consecutive messages from the same sender.
  const tail = theme.showTails && startsGroup;
  const radii = tail
    ? isOut
      ? [r, r, r, 2]
      : [r, r, r, r].map((value, index) => (index === 3 ? value : value))
    : [r, r, r, r];

  roundedRect(context, x, y, width, height, isOut && tail ? [r, r, 2, r] : radii);
  context.fill();

  if (theme.id === "whatsapp" && !isOut) {
    // WhatsApp's incoming bubbles carry a soft edge on the light background.
    context.strokeStyle = "rgba(0,0,0,0.04)";
    context.lineWidth = 1;
    context.stroke();
  }

  if (tail) {
    context.beginPath();
    if (isOut) {
      context.moveTo(x + width - 2, y + height - 10);
      context.lineTo(x + width + 6, y + height);
      context.lineTo(x + width - 2, y + height);
    } else {
      context.moveTo(x + 2, y + height - 10);
      context.lineTo(x - 6, y + height);
      context.lineTo(x + 2, y + height);
    }
    context.closePath();
    context.fill();
  }
}

/** WhatsApp's one/two ticks, blue once read. */
function drawTicks(
  context: CanvasRenderingContext2D,
  theme: ChatTheme,
  x: number,
  y: number,
  status: DeliveryStatus,
): void {
  context.save();
  context.strokeStyle = status === "read" ? theme.readTick : theme.tickText;
  context.lineWidth = 1.4;
  context.lineCap = "round";
  context.lineJoin = "round";

  const tick = (offsetX: number) => {
    context.beginPath();
    context.moveTo(x + offsetX, y + 5);
    context.lineTo(x + offsetX + 3, y + 8);
    context.lineTo(x + offsetX + 8, y + 1);
    context.stroke();
  };

  tick(0);
  if (status !== "sent") tick(4);
  context.restore();
}

function drawInputBar(
  context: CanvasRenderingContext2D,
  theme: ChatTheme,
  width: number,
  height: number,
): void {
  const y = height - INPUT_HEIGHT;
  context.fillStyle = theme.headerBackground;
  context.fillRect(0, y, width, INPUT_HEIGHT);

  context.fillStyle = theme.inputBackground;
  roundedRect(context, 48, y + 14, width - 96, 36, 18);
  context.fill();

  if (theme.id === "imessage") {
    context.strokeStyle = "rgba(128,128,128,0.35)";
    context.lineWidth = 1;
    context.stroke();
  }

  context.fillStyle = theme.inputText;
  context.font = `15px ${SANS}`;
  context.fillText(theme.id === "imessage" ? "iMessage" : "Message", 64, y + 37);

  // Plus / camera affordance on the left.
  context.strokeStyle = theme.inputText;
  context.lineWidth = 1.8;
  context.beginPath();
  context.moveTo(24, y + 32);
  context.lineTo(36, y + 32);
  context.moveTo(30, y + 26);
  context.lineTo(30, y + 38);
  context.stroke();
}

export function blankMessage(side: Side, time: string): Message {
  return {
    id: `m${Math.random().toString(36).slice(2, 9)}`,
    side,
    text: "",
    time,
    status: "read",
  };
}
