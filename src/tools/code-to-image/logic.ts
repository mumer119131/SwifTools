export type Language = "javascript" | "typescript" | "html" | "css" | "json" | "python" | "plain";

export type TokenKind = "plain" | "keyword" | "string" | "comment" | "number" | "function" | "punctuation";

export interface Token {
  text: string;
  kind: TokenKind;
}

const KEYWORDS: Record<Exclude<Language, "plain" | "json">, string[]> = {
  javascript: "const let var function return if else for while class extends new this import from export default async await try catch finally throw typeof instanceof null undefined true false switch case break continue do yield delete void in of static get set".split(" "),
  typescript: "const let var function return if else for while class extends implements interface type enum new this import from export default async await try catch finally throw typeof instanceof keyof readonly as satisfies null undefined true false switch case break continue public private protected static abstract declare namespace".split(" "),
  html: "DOCTYPE html head body div span a p ul ol li table thead tbody tr td th form input button script style link meta title img section header footer nav main article".split(" "),
  css: "important media supports keyframes import charset font-face from to and not only screen print".split(" "),
  python: "def class return if elif else for while import from as try except finally raise with lambda None True False and or not in is pass break continue global nonlocal yield async await del assert".split(" "),
};

/**
 * A compact regex tokenizer, not a parser.
 *
 * Enough to colour strings, comments, numbers, keywords and call sites — which
 * is all a code screenshot needs. It will mis-highlight genuinely ambiguous
 * cases like a regex literal containing a quote; that costs a wrong colour in
 * an image, not a wrong result.
 */
export function tokenize(line: string, language: Language): Token[] {
  if (language === "plain") return [{ text: line, kind: "plain" }];

  const keywords = new Set(language === "json" ? ["true", "false", "null"] : KEYWORDS[language]);
  const tokens: Token[] = [];

  const pattern = new RegExp(
    [
      // Comments — line and block, plus Python and CSS forms.
      language === "python" ? "#[^\\n]*" : "//[^\\n]*|/\\*[\\s\\S]*?\\*/|<!--[\\s\\S]*?-->",
      // Strings, including template literals.
      "`(?:[^`\\\\]|\\\\.)*`|\"(?:[^\"\\\\]|\\\\.)*\"|'(?:[^'\\\\]|\\\\.)*'",
      // Numbers, including hex and decimals with units.
      "\\b0[xX][0-9a-fA-F]+\\b|\\b\\d+(?:\\.\\d+)?(?:px|rem|em|%|s|ms)?\\b",
      // Identifiers.
      "[A-Za-z_$][\\w$]*",
      // Everything else, one character at a time.
      "[^\\s]",
      "\\s+",
    ].join("|"),
    "g",
  );

  for (const match of line.matchAll(pattern)) {
    const text = match[0];

    if (/^\s+$/.test(text)) {
      tokens.push({ text, kind: "plain" });
      continue;
    }
    if (/^(\/\/|\/\*|<!--|#)/.test(text)) {
      tokens.push({ text, kind: "comment" });
      continue;
    }
    if (/^["'`]/.test(text)) {
      tokens.push({ text, kind: "string" });
      continue;
    }
    if (/^[\d.]/.test(text) && /\d/.test(text)) {
      tokens.push({ text, kind: "number" });
      continue;
    }
    if (keywords.has(text)) {
      tokens.push({ text, kind: "keyword" });
      continue;
    }
    if (/^[A-Za-z_$][\w$]*$/.test(text)) {
      // A following "(" makes it a call or definition.
      const rest = line.slice((match.index ?? 0) + text.length);
      tokens.push({ text, kind: /^\s*\(/.test(rest) ? "function" : "plain" });
      continue;
    }
    tokens.push({ text, kind: "punctuation" });
  }

  return tokens;
}

export interface Theme {
  id: string;
  label: string;
  background: string;
  window: string;
  text: string;
  lineNumber: string;
  colors: Record<TokenKind, string>;
}

export const themes: readonly Theme[] = [
  {
    id: "midnight",
    label: "Midnight",
    background: "#0d1117",
    window: "#161b22",
    text: "#e6edf3",
    lineNumber: "#484f58",
    colors: {
      plain: "#e6edf3",
      keyword: "#ff7b72",
      string: "#a5d6ff",
      comment: "#8b949e",
      number: "#79c0ff",
      function: "#d2a8ff",
      punctuation: "#8b949e",
    },
  },
  {
    id: "paper",
    label: "Paper",
    background: "#ffffff",
    window: "#f6f8fa",
    text: "#1f2328",
    lineNumber: "#8c959f",
    colors: {
      plain: "#1f2328",
      keyword: "#cf222e",
      string: "#0a3069",
      comment: "#6e7781",
      number: "#0550ae",
      function: "#8250df",
      punctuation: "#6e7781",
    },
  },
  {
    id: "ocean",
    label: "Ocean",
    background: "#1b2b34",
    window: "#243b46",
    text: "#d8dee9",
    lineNumber: "#4f5b66",
    colors: {
      plain: "#d8dee9",
      keyword: "#c594c5",
      string: "#99c794",
      comment: "#65737e",
      number: "#f99157",
      function: "#6699cc",
      punctuation: "#a7adba",
    },
  },
];

export const gradients: { id: string; label: string; stops: [string, string] | null }[] = [
  { id: "none", label: "None", stops: null },
  { id: "indigo", label: "Indigo", stops: ["#5e6ad2", "#8e4ec6"] },
  { id: "sunset", label: "Sunset", stops: ["#f76b15", "#d6409f"] },
  { id: "mint", label: "Mint", stops: ["#30a46c", "#00a2c7"] },
  { id: "slate", label: "Slate", stops: ["#334155", "#0f172a"] },
];

export interface RenderOptions {
  code: string;
  language: Language;
  theme: Theme;
  gradientId: string;
  padding: number;
  fontSize: number;
  showLineNumbers: boolean;
  showWindowChrome: boolean;
  fileName: string;
  scale: number;
}

const FONT_STACK = "ui-monospace, SFMono-Regular, Menlo, Consolas, monospace";

/**
 * Draws straight onto a canvas rather than rasterising HTML.
 *
 * The usual trick — an SVG `foreignObject` wrapping styled HTML — is fragile:
 * fonts must be inlined as data URIs or the text silently falls back, and
 * Safari renders it inconsistently. Measuring and painting each token directly
 * costs more code but produces the same image in every browser.
 */
export function renderToCanvas(canvas: HTMLCanvasElement, options: RenderOptions): void {
  const context = canvas.getContext("2d");
  if (!context) throw new Error("Could not get a 2D canvas context.");

  const lines = options.code.replace(/\t/g, "  ").split("\n");
  const lineHeight = Math.round(options.fontSize * 1.6);
  const chrome = options.showWindowChrome ? 44 : 0;
  const gutter = options.showLineNumbers ? Math.round(options.fontSize * 3) : 0;

  // Measure with the real font before sizing the canvas.
  context.font = `${options.fontSize}px ${FONT_STACK}`;
  const widest = lines.reduce(
    (max, line) => Math.max(max, context.measureText(line).width),
    0,
  );

  const innerWidth = Math.ceil(widest) + gutter + 48;
  const innerHeight = lines.length * lineHeight + chrome + 32;
  const width = innerWidth + options.padding * 2;
  const height = innerHeight + options.padding * 2;

  const scale = options.scale;
  canvas.width = Math.round(width * scale);
  canvas.height = Math.round(height * scale);
  context.scale(scale, scale);

  // Backdrop
  const gradient = gradients.find((entry) => entry.id === options.gradientId);
  if (gradient?.stops) {
    const fill = context.createLinearGradient(0, 0, width, height);
    fill.addColorStop(0, gradient.stops[0]);
    fill.addColorStop(1, gradient.stops[1]);
    context.fillStyle = fill;
  } else {
    context.fillStyle = options.theme.background;
  }
  context.fillRect(0, 0, width, height);

  // Window
  const x = options.padding;
  const y = options.padding;
  context.save();
  context.shadowColor = "rgba(0,0,0,0.35)";
  context.shadowBlur = 40;
  context.shadowOffsetY = 16;
  context.fillStyle = options.theme.background;
  roundedRect(context, x, y, innerWidth, innerHeight, 12);
  context.fill();
  context.restore();

  if (options.showWindowChrome) {
    context.fillStyle = options.theme.window;
    roundedRectTop(context, x, y, innerWidth, chrome, 12);
    context.fill();

    const dots = ["#ff5f57", "#febc2e", "#28c840"];
    dots.forEach((color, index) => {
      context.beginPath();
      context.arc(x + 20 + index * 20, y + chrome / 2, 6, 0, Math.PI * 2);
      context.fillStyle = color;
      context.fill();
    });

    if (options.fileName) {
      context.font = `${Math.round(options.fontSize * 0.85)}px ${FONT_STACK}`;
      context.fillStyle = options.theme.lineNumber;
      context.textAlign = "center";
      context.fillText(options.fileName, x + innerWidth / 2, y + chrome / 2 + 4);
      context.textAlign = "left";
    }
  }

  // Code
  context.font = `${options.fontSize}px ${FONT_STACK}`;
  context.textBaseline = "middle";

  lines.forEach((line, index) => {
    const lineY = y + chrome + 16 + index * lineHeight + lineHeight / 2;

    if (options.showLineNumbers) {
      context.fillStyle = options.theme.lineNumber;
      context.textAlign = "right";
      context.fillText(String(index + 1), x + gutter - 12, lineY);
      context.textAlign = "left";
    }

    let cursorX = x + gutter + 24;
    for (const token of tokenize(line, options.language)) {
      context.fillStyle = options.theme.colors[token.kind];
      context.fillText(token.text, cursorX, lineY);
      cursorX += context.measureText(token.text).width;
    }
  });
}

function roundedRect(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  context.beginPath();
  context.roundRect(x, y, width, height, radius);
}

function roundedRectTop(
  context: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  context.beginPath();
  context.roundRect(x, y, width, height, [radius, radius, 0, 0]);
}

export function canvasToPngBlob(canvas: HTMLCanvasElement): Promise<Blob> {
  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => (blob ? resolve(blob) : reject(new Error("The image could not be encoded."))),
      "image/png",
    );
  });
}
