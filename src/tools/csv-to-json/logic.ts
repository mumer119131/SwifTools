/**
 * CSV parsing to RFC 4180, in both directions.
 *
 * Splitting on commas is the wrong answer and it is what most quick converters
 * do. A CSV field may be quoted, a quoted field may contain commas, newlines
 * and doubled quotes, and any of those breaks a naive split — usually silently,
 * producing rows with the wrong number of columns rather than an error.
 */

export type Row = Record<string, string>;

export interface ParseResult {
  headers: string[];
  rows: string[][];
  /** Rows whose column count does not match the header. */
  ragged: number[];
}

/**
 * A character-by-character parser, which is the only approach that handles
 * quoting correctly. Inside quotes, a doubled quote is a literal quote and
 * everything else — including commas and newlines — is data.
 */
export function parseCsv(text: string, delimiter: string): ParseResult {
  const rows: string[][] = [];
  let row: string[] = [];
  let field = "";
  let inQuotes = false;

  // Normalise line endings first so CRLF, LF and lone CR all behave.
  const input = text.replace(/\r\n?/g, "\n");

  for (let index = 0; index < input.length; index += 1) {
    const character = input[index];

    if (inQuotes) {
      if (character === '"') {
        if (input[index + 1] === '"') {
          field += '"';
          index += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += character;
      }
      continue;
    }

    if (character === '"' && field === "") {
      inQuotes = true;
    } else if (character === delimiter) {
      row.push(field);
      field = "";
    } else if (character === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else {
      field += character;
    }
  }

  // A file with no trailing newline still has a final row to flush.
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  const [headers = [], ...body] = rows;

  const ragged: number[] = [];
  body.forEach((entry, index) => {
    if (entry.length !== headers.length) ragged.push(index + 2);
  });

  return { headers: headers.map((header) => header.trim()), rows: body, ragged };
}

export interface ConvertOptions {
  delimiter: string;
  /** Turn "42" into 42 and "true" into true rather than leaving strings. */
  inferTypes: boolean;
  /** Drop rows where every field is empty. */
  skipEmpty: boolean;
}

/** Best-effort typing of a CSV value, which is always a string on disk. */
export function inferValue(raw: string): string | number | boolean | null {
  const value = raw.trim();

  if (value === "") return null;
  if (value === "true") return true;
  if (value === "false") return false;
  if (value === "null") return null;

  /*
   * Only convert numbers that survive a round trip. "007" and "1e5" and
   * "+1 555 0100" all parse as numbers and none of them should be converted —
   * a leading zero is significant in a product code, and mangling it silently
   * corrupts the data.
   */
  if (/^-?\d+(\.\d+)?$/.test(value)) {
    const parsed = Number(value);
    if (String(parsed) === value) return parsed;
  }

  return raw;
}

export function csvToJson(text: string, options: ConvertOptions): {
  json: unknown[];
  result: ParseResult;
} {
  const result = parseCsv(text, options.delimiter);

  const json = result.rows
    .filter((row) => !options.skipEmpty || row.some((cell) => cell.trim() !== ""))
    .map((row) => {
      const object: Record<string, unknown> = {};
      result.headers.forEach((header, index) => {
        const raw = row[index] ?? "";
        object[header || `column_${index + 1}`] = options.inferTypes ? inferValue(raw) : raw;
      });
      return object;
    });

  return { json, result };
}

/** Quotes a field only when it needs it, which keeps the output readable. */
function escapeField(value: unknown, delimiter: string): string {
  const text = value === null || value === undefined ? "" : String(value);
  const needsQuotes = text.includes(delimiter) || text.includes('"') || /[\n\r]/.test(text);
  return needsQuotes ? `"${text.replace(/"/g, '""')}"` : text;
}

/**
 * JSON back to CSV.
 *
 * The header is the union of every object's keys rather than the first
 * object's, because a sparse array — where later records carry fields the
 * first one lacks — would otherwise lose those columns entirely.
 */
export function jsonToCsv(input: unknown, delimiter: string): string {
  if (!Array.isArray(input)) throw new Error("CSV needs an array of objects at the top level.");
  if (input.length === 0) return "";

  const headers: string[] = [];
  for (const entry of input) {
    if (entry && typeof entry === "object" && !Array.isArray(entry)) {
      for (const key of Object.keys(entry)) {
        if (!headers.includes(key)) headers.push(key);
      }
    }
  }

  if (headers.length === 0) throw new Error("No object keys found to use as columns.");

  const lines = [headers.map((header) => escapeField(header, delimiter)).join(delimiter)];

  for (const entry of input) {
    const record = (entry ?? {}) as Record<string, unknown>;
    lines.push(
      headers
        .map((header) => {
          const value = record[header];
          // A nested object or array has no CSV representation, so it is
          // serialised rather than stringified to "[object Object]".
          return escapeField(
            value !== null && typeof value === "object" ? JSON.stringify(value) : value,
            delimiter,
          );
        })
        .join(delimiter),
    );
  }

  return lines.join("\n");
}

export const DELIMITERS = [
  { id: ",", label: "Comma" },
  { id: ";", label: "Semicolon" },
  { id: "\t", label: "Tab" },
  { id: "|", label: "Pipe" },
];

export const SAMPLE_CSV = `name,role,years,remote
Ada Lovelace,Engineer,7,true
"Hopper, Grace",Admiral,42,false
Alan Turing,Researcher,12,true
"Katherine ""Kat"" Johnson",Mathematician,33,false`;
