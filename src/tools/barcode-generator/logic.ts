/**
 * Barcode encoding.
 *
 * Each encoder returns a run of bars as a binary string — "1" is a bar, "0" is
 * a space, every module one unit wide. Rendering is then just drawing
 * rectangles, which keeps the symbology and the drawing entirely separate and
 * makes the encoders testable against published values.
 *
 * The check digits are the part worth care: a barcode with the wrong check
 * digit scans as nothing at all, and looks perfectly convincing on screen.
 */

export type Format = "code128" | "ean13" | "ean8" | "upca" | "code39";

export const FORMATS: { id: Format; label: string; hint: string }[] = [
  { id: "code128", label: "Code 128", hint: "Any text or digits. The usual choice for shipping and internal labels." },
  { id: "ean13", label: "EAN-13", hint: "13 digits. Retail products outside North America." },
  { id: "upca", label: "UPC-A", hint: "12 digits. Retail products in North America." },
  { id: "ean8", label: "EAN-8", hint: "8 digits. Small retail packaging." },
  { id: "code39", label: "Code 39", hint: "A–Z, 0–9 and a few symbols. Older industrial systems." },
];

export interface Encoded {
  /** "1" for a bar, "0" for a space. */
  bars: string;
  /** The value as it should be printed, including any computed check digit. */
  text: string;
  /** Where the guard bars fall, for the taller-bar convention on EAN and UPC. */
  guards: number[];
}

/* --------------------------------------------------------------- EAN / UPC */

const EAN_L = ["0001101","0011001","0010011","0111101","0100011","0110001","0101111","0111011","0110111","0001011"];
const EAN_G = ["0100111","0110011","0011011","0100001","0011101","0111001","0000101","0010001","0001001","0010111"];
const EAN_R = ["1110010","1100110","1101100","1000010","1011100","1001110","1010000","1000100","1001000","1110100"];

/** Parity of the left six digits encodes the first digit, which is not barred. */
const EAN_PARITY = ["LLLLLL","LLGLGG","LLGGLG","LLGGGL","LGLLGG","LGGLLG","LGGGLL","LGLGLG","LGLGGL","LGGLGL"];

/**
 * The EAN/UPC check digit: alternating weights of 1 and 3 from the right,
 * summed, then whatever takes it to the next multiple of ten.
 */
export function eanCheckDigit(digits: string): number {
  let sum = 0;
  // Weighting runs right to left, so the rightmost body digit always gets 3.
  for (let i = digits.length - 1, weight = 3; i >= 0; i -= 1, weight = weight === 3 ? 1 : 3) {
    sum += Number(digits[i]) * weight;
  }
  return (10 - (sum % 10)) % 10;
}

function encodeEan13(value: string): Encoded {
  const body = value.slice(0, 12);
  const check = eanCheckDigit(body);
  const full = body + check;

  const parity = EAN_PARITY[Number(full[0])];
  let bars = "101"; // start guard

  for (let i = 1; i <= 6; i += 1) {
    const digit = Number(full[i]);
    bars += parity[i - 1] === "L" ? EAN_L[digit] : EAN_G[digit];
  }

  const centreAt = bars.length;
  bars += "01010"; // centre guard

  for (let i = 7; i <= 12; i += 1) bars += EAN_R[Number(full[i])];

  const endAt = bars.length;
  bars += "101"; // end guard

  return { bars, text: full, guards: [0, centreAt, endAt] };
}

function encodeEan8(value: string): Encoded {
  const body = value.slice(0, 7);
  const check = eanCheckDigit(body);
  const full = body + check;

  let bars = "101";
  for (let i = 0; i < 4; i += 1) bars += EAN_L[Number(full[i])];
  const centreAt = bars.length;
  bars += "01010";
  for (let i = 4; i < 8; i += 1) bars += EAN_R[Number(full[i])];
  const endAt = bars.length;
  bars += "101";

  return { bars, text: full, guards: [0, centreAt, endAt] };
}

/** UPC-A is EAN-13 with a leading zero, so it shares the encoder. */
function encodeUpcA(value: string): Encoded {
  const body = value.slice(0, 11);
  const check = eanCheckDigit(body);
  const result = encodeEan13(`0${body}${check}`.slice(0, 12));
  return { ...result, text: body + check };
}

/* -------------------------------------------------------------- Code 128 */

/** 107 patterns, index 0–106. Values 103–105 are the start codes, 106 is stop. */
const CODE128 = [
  "11011001100","11001101100","11001100110","10010011000","10010001100","10001001100","10011001000","10011000100",
  "10001100100","11001001000","11001000100","11000100100","10110011100","10011011100","10011001110","10111001100",
  "10011101100","10011100110","11001110010","11001011100","11001001110","11011100100","11001110100","11101101110",
  "11101001100","11100101100","11100100110","11101100100","11100110100","11100110010","11011011000","11011000110",
  "11000110110","10100011000","10001011000","10001000110","10110001000","10001101000","10001100010","11010001000",
  "11000101000","11000100010","10110111000","10110001110","10001101110","10111011000","10111000110","10001110110",
  "11101110110","11010001110","11000101110","11011101000","11011100010","11011101110","11101011000","11101000110",
  "11100010110","11101101000","11101100010","11100011010","11101111010","11001000010","11110001010","10100110000",
  "10100001100","10010110000","10010000110","10000101100","10000100110","10110010000","10110000100","10011010000",
  "10011000010","10000110100","10000110010","11000010010","11001010000","11110111010","11000010100","10001111010",
  "10100111100","10010111100","10010011110","10111100100","10011110100","10011110010","11110100100","11110010100",
  "11110010010","11011011110","11011110110","11110110110","10101111000","10100011110","10001011110","10111101000",
  "10111100010","11110101000","11110100010","10111011110","10111101110","11101011110","11110101110","11010000100",
  "11010010000","11010011100","11000111010",
];

/**
 * Encodes with subset B, switching to C for long runs of digits.
 *
 * Subset C packs two digits into one symbol, which shortens a numeric barcode
 * by nearly half. Switching is only worth it for four or more digits, since the
 * switch itself costs a symbol.
 */
function encodeCode128(value: string): Encoded {
  const values: number[] = [];
  let index = 0;
  let mode: "B" | "C" = "B";

  const digitsAhead = (from: number): number => {
    let count = 0;
    while (from + count < value.length && /\d/.test(value[from + count])) count += 1;
    return count;
  };

  // Start code: C if the whole thing opens with an even run of at least four.
  const opening = digitsAhead(0);
  if (opening >= 4 && opening % 2 === 0) {
    values.push(105);
    mode = "C";
  } else {
    values.push(104);
  }

  while (index < value.length) {
    if (mode === "C") {
      const run = digitsAhead(index);
      if (run >= 2) {
        values.push(Number(value.slice(index, index + 2)));
        index += 2;
        continue;
      }
      values.push(100); // switch to B
      mode = "B";
      continue;
    }

    const run = digitsAhead(index);
    if (run >= 4 && run % 2 === 0) {
      values.push(99); // switch to C
      mode = "C";
      continue;
    }

    const code = value.charCodeAt(index);
    if (code < 32 || code > 126) {
      throw new Error("Code 128 here supports printable ASCII only.");
    }
    values.push(code - 32);
    index += 1;
  }

  // Modulo-103 checksum, weighted by position, start code weighted 1.
  let sum = values[0];
  for (let i = 1; i < values.length; i += 1) sum += values[i] * i;
  values.push(sum % 103);
  values.push(106); // stop

  return {
    bars: values.map((code) => CODE128[code]).join("") + "11",
    text: value,
    guards: [],
  };
}

/* --------------------------------------------------------------- Code 39 */

const CODE39: Record<string, string> = {
  "0":"101001101101","1":"110100101011","2":"101100101011","3":"110110010101","4":"101001101011",
  "5":"110100110101","6":"101100110101","7":"101001011011","8":"110100101101","9":"101100101101",
  A:"110101001011",B:"101101001011",C:"110110100101",D:"101011001011",E:"110101100101",F:"101101100101",
  G:"101010011011",H:"110101001101",I:"101101001101",J:"101011001101",K:"110101010011",L:"101101010011",
  M:"110110101001",N:"101011010011",O:"110101101001",P:"101101101001",Q:"101010110011",R:"110101011001",
  S:"101101011001",T:"101011011001",U:"110010101011",V:"100110101011",W:"110011010101",X:"100101101011",
  Y:"110010110101",Z:"100110110101","-":"100101011011",".":"110010101101"," ":"100110101101",
  $:"100100100101","/":"100100101001","+":"100101001001","%":"101001001001","*":"100101101101",
};

function encodeCode39(value: string): Encoded {
  const text = value.toUpperCase();
  const parts: string[] = [CODE39["*"]];

  for (const character of text) {
    const pattern = CODE39[character];
    if (!pattern) throw new Error(`Code 39 cannot encode "${character}".`);
    parts.push(pattern);
  }

  parts.push(CODE39["*"]);
  // Characters are separated by a one-module space.
  return { bars: parts.join("0"), text, guards: [] };
}

/* ------------------------------------------------------------ validation */

export function validate(value: string, format: Format): string | null {
  const trimmed = value.trim();
  if (trimmed === "") return "Enter a value.";

  const digitsOnly = /^\d+$/.test(trimmed);

  switch (format) {
    case "ean13":
      if (!digitsOnly) return "EAN-13 is digits only.";
      // 13 is accepted: the last digit is treated as the check digit and
      // recomputed, so a full code pasted from a product still works.
      if (trimmed.length !== 12 && trimmed.length !== 13) return "EAN-13 needs 12 digits, or 13 including the check digit.";
      return null;
    case "upca":
      if (!digitsOnly) return "UPC-A is digits only.";
      if (trimmed.length !== 11 && trimmed.length !== 12) return "UPC-A needs 11 digits, or 12 including the check digit.";
      return null;
    case "ean8":
      if (!digitsOnly) return "EAN-8 is digits only.";
      if (trimmed.length !== 7 && trimmed.length !== 8) return "EAN-8 needs 7 digits, or 8 including the check digit.";
      return null;
    case "code39":
      if (!/^[0-9A-Za-z\-. $/+%]+$/.test(trimmed)) return "Code 39 allows A–Z, 0–9, space and - . $ / + % only.";
      return null;
    default:
      if ([...trimmed].some((c) => c.charCodeAt(0) < 32 || c.charCodeAt(0) > 126)) {
        return "Code 128 here supports printable ASCII only.";
      }
      return null;
  }
}

export function encode(value: string, format: Format): Encoded {
  const trimmed = value.trim();
  const problem = validate(trimmed, format);
  if (problem) throw new Error(problem);

  switch (format) {
    case "ean13":
      return encodeEan13(trimmed);
    case "ean8":
      return encodeEan8(trimmed);
    case "upca":
      return encodeUpcA(trimmed);
    case "code39":
      return encodeCode39(trimmed);
    default:
      return encodeCode128(trimmed);
  }
}

/** Renders an encoded symbol as a standalone SVG. */
export function toSvg(
  encoded: Encoded,
  options: { moduleWidth: number; height: number; showText: boolean },
): string {
  const { moduleWidth, height, showText } = options;
  const quiet = moduleWidth * 10;
  const textHeight = showText ? 20 : 0;
  const width = encoded.bars.length * moduleWidth + quiet * 2;
  const total = height + textHeight + 8;

  let rects = "";
  let run = 0;

  for (let i = 0; i <= encoded.bars.length; i += 1) {
    if (encoded.bars[i] === "1") {
      run += 1;
      continue;
    }
    if (run > 0) {
      const start = i - run;
      // Guard bars run longer, which is the convention that lets a scanner and
      // a human both find the edges of an EAN symbol.
      const isGuard = encoded.guards.some((guard) => start >= guard && start < guard + 5);
      const barHeight = isGuard && showText ? height + 8 : height;
      rects += `<rect x="${quiet + start * moduleWidth}" y="0" width="${run * moduleWidth}" height="${barHeight}"/>`;
      run = 0;
    }
  }

  const label = showText
    ? `<text x="${width / 2}" y="${total - 4}" text-anchor="middle" font-family="monospace" font-size="14" letter-spacing="2">${encoded.text}</text>`
    : "";

  return `<svg xmlns="http://www.w3.org/2000/svg" width="${width}" height="${total}" viewBox="0 0 ${width} ${total}"><rect width="${width}" height="${total}" fill="#ffffff"/><g fill="#000000">${rects}</g>${label}</svg>`;
}
