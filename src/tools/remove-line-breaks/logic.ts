export type Mode = "all" | "paragraphs" | "unwrap";

export interface Options {
  mode: Mode;
  separator: string;
  collapseSpaces: boolean;
  trimLines: boolean;
}

export const MODES: { id: Mode; label: string; note: string }[] = [
  { id: "all", label: "Every break", note: "One continuous line. Nothing survives." },
  { id: "paragraphs", label: "Keep paragraphs", note: "Blank lines stay; single breaks are joined." },
  { id: "unwrap", label: "Unwrap only", note: "Joins a line to the next only when it was clearly wrapped mid-sentence." },
];

/**
 * Removes line breaks.
 *
 * "Unwrap" is the mode that does the job people actually want. Text copied out
 * of a PDF or an email has a break at the end of every visual line, but the
 * paragraph breaks matter — so joining everything destroys the structure and
 * joining nothing leaves it unreadable. Unwrap joins a line to the next only
 * where the break looks like wrapping rather than a deliberate ending.
 */
export function removeBreaks(input: string, options: Options): string {
  // Normalise first, so CRLF and lone CR behave like LF throughout.
  let text = input.replace(/\r\n?/g, "\n");

  if (options.trimLines) {
    text = text
      .split("\n")
      .map((line) => line.trim())
      .join("\n");
  }

  if (options.mode === "all") {
    text = text.split("\n").filter((line) => line !== "").join(options.separator);
  } else if (options.mode === "paragraphs") {
    // Split on blank lines, flatten inside each block, then restore the blanks.
    text = text
      .split(/\n{2,}/)
      .map((block) => block.split("\n").filter(Boolean).join(options.separator))
      .filter(Boolean)
      .join("\n\n");
  } else {
    text = unwrap(text, options.separator);
  }

  if (options.collapseSpaces) text = text.replace(/[ \t]{2,}/g, " ");

  return text;
}

/**
 * Joins only the breaks that look like soft wrapping.
 *
 * A break is treated as wrapping when the line before it does not end a
 * sentence and the line after it does not begin something new — a bullet, a
 * number, a heading. That heuristic is wrong occasionally, which is why the
 * other two modes exist, but it is right often enough to save a lot of manual
 * repair on text pulled out of a PDF.
 */
function unwrap(text: string, separator: string): string {
  const lines = text.split("\n");
  const output: string[] = [];

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const next = lines[index + 1];

    output.push(line);

    if (next === undefined) continue;

    const blankFollows = next.trim() === "";
    const endsSentence = /[.!?:;"'’”)\]]\s*$/.test(line);
    const isEmpty = line.trim() === "";
    // A list marker, a heading or an indented block starts something new.
    const nextStartsBlock = /^\s*([-*•–—]|\d+[.)]|#{1,6}\s|>|\||\t)/.test(next);
    const nextIsCapitalised = /^\s*[A-Z]/.test(next) && endsSentence;

    const isSoftWrap =
      !blankFollows && !isEmpty && !endsSentence && !nextStartsBlock && !nextIsCapitalised;

    output.push(isSoftWrap ? separator : "\n");
  }

  return output.join("").replace(/\n{3,}/g, "\n\n");
}

export const SEPARATORS = [
  { id: " ", label: "Space" },
  { id: "", label: "Nothing" },
  { id: ", ", label: "Comma" },
  { id: " | ", label: "Pipe" },
  { id: "\t", label: "Tab" },
];
