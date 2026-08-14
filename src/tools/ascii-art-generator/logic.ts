/**
 * ASCII banner fonts, defined inline.
 *
 * Each glyph is an array of rows, all the same height within a font. Bundling
 * the letterforms rather than reaching for figlet keeps this at a few kilobytes
 * and means it works with no network at all — figlet's font files are larger
 * than this whole tool.
 */
interface Font {
  id: string;
  label: string;
  height: number;
  glyphs: Record<string, string[]>;
  space: number;
}

const BLOCK: Record<string, string[]> = {
  A: ["  ██  ", " ████ ", "██  ██", "██████", "██  ██"],
  B: ["█████ ", "██  ██", "█████ ", "██  ██", "█████ "],
  C: [" █████", "██    ", "██    ", "██    ", " █████"],
  D: ["█████ ", "██  ██", "██  ██", "██  ██", "█████ "],
  E: ["██████", "██    ", "█████ ", "██    ", "██████"],
  F: ["██████", "██    ", "█████ ", "██    ", "██    "],
  G: [" █████", "██    ", "██ ███", "██  ██", " █████"],
  H: ["██  ██", "██  ██", "██████", "██  ██", "██  ██"],
  I: ["██████", "  ██  ", "  ██  ", "  ██  ", "██████"],
  J: ["██████", "    ██", "    ██", "██  ██", " ████ "],
  K: ["██  ██", "██ ██ ", "████  ", "██ ██ ", "██  ██"],
  L: ["██    ", "██    ", "██    ", "██    ", "██████"],
  M: ["██  ██", "██████", "██████", "██  ██", "██  ██"],
  N: ["██  ██", "███ ██", "██████", "██ ███", "██  ██"],
  O: [" ████ ", "██  ██", "██  ██", "██  ██", " ████ "],
  P: ["█████ ", "██  ██", "█████ ", "██    ", "██    "],
  Q: [" ████ ", "██  ██", "██  ██", "██ ███", " █████"],
  R: ["█████ ", "██  ██", "█████ ", "██ ██ ", "██  ██"],
  S: [" █████", "██    ", " ████ ", "    ██", "█████ "],
  T: ["██████", "  ██  ", "  ██  ", "  ██  ", "  ██  "],
  U: ["██  ██", "██  ██", "██  ██", "██  ██", " ████ "],
  V: ["██  ██", "██  ██", "██  ██", " ████ ", "  ██  "],
  W: ["██  ██", "██  ██", "██████", "██████", "██  ██"],
  X: ["██  ██", " ████ ", "  ██  ", " ████ ", "██  ██"],
  Y: ["██  ██", " ████ ", "  ██  ", "  ██  ", "  ██  "],
  Z: ["██████", "   ██ ", "  ██  ", " ██   ", "██████"],
  "0": [" ████ ", "██  ██", "██  ██", "██  ██", " ████ "],
  "1": ["  ██  ", " ███  ", "  ██  ", "  ██  ", "██████"],
  "2": [" ████ ", "██  ██", "   ██ ", "  ██  ", "██████"],
  "3": ["█████ ", "    ██", " ████ ", "    ██", "█████ "],
  "4": ["██  ██", "██  ██", "██████", "    ██", "    ██"],
  "5": ["██████", "██    ", "█████ ", "    ██", "█████ "],
  "6": [" ████ ", "██    ", "█████ ", "██  ██", " ████ "],
  "7": ["██████", "    ██", "   ██ ", "  ██  ", " ██   "],
  "8": [" ████ ", "██  ██", " ████ ", "██  ██", " ████ "],
  "9": [" ████ ", "██  ██", " █████", "    ██", " ████ "],
  "!": ["  ██  ", "  ██  ", "  ██  ", "      ", "  ██  "],
  "?": [" ████ ", "██  ██", "   ██ ", "      ", "  ██  "],
  ".": ["      ", "      ", "      ", "      ", "  ██  "],
  ",": ["      ", "      ", "      ", "  ██  ", " ██   "],
  "-": ["      ", "      ", "██████", "      ", "      "],
  "'": ["  ██  ", "  ██  ", "      ", "      ", "      "],
  ":": ["      ", "  ██  ", "      ", "  ██  ", "      "],
  "+": ["      ", "  ██  ", "██████", "  ██  ", "      "],
  "*": ["██  ██", " ████ ", "██████", " ████ ", "██  ██"],
  "/": ["    ██", "   ██ ", "  ██  ", " ██   ", "██    "],
  "<": ["   ██ ", "  ██  ", " ██   ", "  ██  ", "   ██ "],
  ">": [" ██   ", "  ██  ", "   ██ ", "  ██  ", " ██   "],
  "=": ["      ", "██████", "      ", "██████", "      "],
  "#": [" ██ ██", "██████", " ██ ██", "██████", " ██ ██"],
  "@": [" ████ ", "██  ██", "██ ███", "██    ", " ████ "],
  "&": [" ███  ", "██ ██ ", " ███  ", "██ ██ ", " ██ ██"],
  "(": ["   ██ ", "  ██  ", "  ██  ", "  ██  ", "   ██ "],
  ")": [" ██   ", "  ██  ", "  ██  ", "  ██  ", " ██   "],
  "_": ["      ", "      ", "      ", "      ", "██████"],
};

/** The same letterforms in outline, drawn with box-drawing characters. */
function toOutline(glyph: string[]): string[] {
  return glyph.map((row) =>
    row
      .split("")
      .map((character) => (character === "█" ? "▒" : character))
      .join(""),
  );
}

/** Shadowed: a solid glyph with a light offset copy behind it. */
function toShadow(glyph: string[]): string[] {
  return glyph.map((row, index) =>
    row
      .split("")
      .map((character, column) => {
        if (character === "█") return "█";
        const above = glyph[index - 1]?.[column - 1];
        return above === "█" ? "░" : " ";
      })
      .join(""),
  );
}

const SMALL: Record<string, string[]> = Object.fromEntries(
  Object.entries(BLOCK).map(([key, rows]) => [
    key,
    // Halve the height by folding pairs of rows into half-block characters.
    [
      foldRows(rows[0], rows[1]),
      foldRows(rows[2], rows[3]),
      foldRows(rows[4], undefined),
    ],
  ]),
);

function foldRows(top: string, bottom: string | undefined): string {
  const width = Math.max(top.length, bottom?.length ?? 0);
  let result = "";

  for (let index = 0; index < width; index += 1) {
    const upper = top[index] === "█";
    const lower = bottom?.[index] === "█";

    if (upper && lower) result += "█";
    else if (upper) result += "▀";
    else if (lower) result += "▄";
    else result += " ";
  }

  return result;
}

export const FONTS: Font[] = [
  { id: "block", label: "Block", height: 5, glyphs: BLOCK, space: 4 },
  {
    id: "outline",
    label: "Outline",
    height: 5,
    glyphs: Object.fromEntries(Object.entries(BLOCK).map(([key, rows]) => [key, toOutline(rows)])),
    space: 4,
  },
  {
    id: "shadow",
    label: "Shadow",
    height: 5,
    glyphs: Object.fromEntries(Object.entries(BLOCK).map(([key, rows]) => [key, toShadow(rows)])),
    space: 4,
  },
  { id: "small", label: "Compact", height: 3, glyphs: SMALL, space: 3 },
];

/** Renders text in a font, one output line per glyph row. */
export function render(text: string, fontId: string, spacing: number): string {
  const font = FONTS.find((entry) => entry.id === fontId) ?? FONTS[0];
  const characters = [...text.toUpperCase()];

  const lines = new Array(font.height).fill("");
  const gap = " ".repeat(Math.max(0, spacing));

  for (const character of characters) {
    if (character === " ") {
      for (let row = 0; row < font.height; row += 1) {
        lines[row] += " ".repeat(font.space) + gap;
      }
      continue;
    }

    const glyph = font.glyphs[character];
    // Unknown characters are skipped rather than drawn as a box, which would
    // make a stray emoji ruin the whole banner.
    if (!glyph) continue;

    for (let row = 0; row < font.height; row += 1) {
      lines[row] += (glyph[row] ?? "") + gap;
    }
  }

  // Trim the trailing gap, but keep the leading structure intact.
  return lines.map((line) => line.replace(/\s+$/, "")).join("\n");
}

/** Wraps the banner in a comment block for a source file. */
export function wrapAsComment(banner: string, style: "block" | "hash" | "slash"): string {
  const lines = banner.split("\n");

  if (style === "hash") return lines.map((line) => `# ${line}`).join("\n");
  if (style === "slash") return lines.map((line) => `// ${line}`).join("\n");

  return ["/*", ...lines.map((line) => ` * ${line}`), " */"].join("\n");
}
