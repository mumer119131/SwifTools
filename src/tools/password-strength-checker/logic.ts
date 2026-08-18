/**
 * Estimating how hard a password is to guess.
 *
 * The usual strength meter counts character classes — one uppercase, one digit,
 * one symbol — and rates `P@ssw0rd1` as strong. It is one of the worst
 * passwords in existence, because the substitutions it makes are the first
 * thing every cracking tool tries. Rules about classes measure whether a
 * password annoyed its author, not whether it resists guessing.
 *
 * What matters is how many guesses an attacker needs, so this estimates that
 * directly: how large is the space the password was drawn from, and does it
 * contain a pattern that collapses the space to almost nothing.
 */

export interface Finding {
  kind: "critical" | "warning" | "good";
  message: string;
}

export interface Strength {
  /** Bits of entropy, after penalties for detected patterns. */
  bits: number;
  /** 0–4, for the bar. */
  score: 0 | 1 | 2 | 3 | 4;
  label: string;
  findings: Finding[];
  /** Seconds to exhaust the space at an offline rate. Infinity when absurd. */
  crackSeconds: number;
}

/**
 * Passwords that are always tried first.
 *
 * A short list rather than a database — a real checker would use a corpus of
 * millions, and shipping one to the browser is not sensible. These cover the
 * cases people genuinely still choose, and the tool says plainly that a pass
 * here is not proof of anything.
 */
const COMMON = new Set([
  "password", "123456", "123456789", "12345678", "12345", "qwerty", "abc123",
  "111111", "1234567", "monkey", "letmein", "dragon", "baseball", "iloveyou",
  "trustno1", "sunshine", "master", "welcome", "shadow", "ashley", "football",
  "jesus", "michael", "ninja", "mustang", "password1", "admin", "login",
  "princess", "starwars", "qwertyuiop", "solo", "passw0rd", "whatever",
  "hello", "freedom", "test", "guest", "root", "changeme", "secret",
]);

const KEYBOARD_RUNS = [
  "qwertyuiop", "asdfghjkl", "zxcvbnm", "1234567890",
  "qwerty", "asdfgh", "zxcvbn",
];

/** Reverses the usual letter-for-symbol substitutions before matching. */
function unleet(input: string): string {
  return input
    .toLowerCase()
    .replace(/[@4]/g, "a")
    .replace(/[3]/g, "e")
    .replace(/[1!|]/g, "i")
    .replace(/[0]/g, "o")
    .replace(/[$5]/g, "s")
    .replace(/[7]/g, "t")
    .replace(/[8]/g, "b");
}

/** The size of the alphabet the password appears to be drawn from. */
function poolSize(password: string): number {
  let pool = 0;
  if (/[a-z]/.test(password)) pool += 26;
  if (/[A-Z]/.test(password)) pool += 26;
  if (/\d/.test(password)) pool += 10;
  if (/[^A-Za-z0-9]/.test(password)) pool += 33;
  return pool;
}

/** True when the password is one character repeated, or a short cycle of them. */
function isRepetition(password: string): boolean {
  if (password.length < 4) return false;
  for (let size = 1; size <= password.length / 2; size += 1) {
    if (password.length % size !== 0) continue;
    const unit = password.slice(0, size);
    if (unit.repeat(password.length / size) === password) return true;
  }
  return false;
}

/** A run of adjacent keyboard characters, forwards or backwards. */
function hasKeyboardRun(password: string, minimum = 4): boolean {
  const lower = password.toLowerCase();
  for (const row of KEYBOARD_RUNS) {
    const reversed = [...row].reverse().join("");
    for (let i = 0; i + minimum <= row.length; i += 1) {
      if (lower.includes(row.slice(i, i + minimum))) return true;
      if (lower.includes(reversed.slice(i, i + minimum))) return true;
    }
  }
  return false;
}

/** A sequence like abcd or 1234. */
function hasSequence(password: string, minimum = 4): boolean {
  let run = 1;
  for (let i = 1; i < password.length; i += 1) {
    const step = password.charCodeAt(i) - password.charCodeAt(i - 1);
    if (step === 1 || step === -1) {
      run += 1;
      if (run >= minimum) return true;
    } else {
      run = 1;
    }
  }
  return false;
}

/** A four-digit run that looks like a year someone would pick. */
function hasYear(password: string): boolean {
  return /(19[5-9]\d|20[0-4]\d)/.test(password);
}

/**
 * Tries the forms an attacker would try.
 *
 * The order matters and is easy to get wrong. `unleet` turns digits into
 * letters, so running it first on `P@ssw0rd1` produces `passwordi` — the
 * trailing `1`, which is an appended digit rather than a substitution, gets
 * eaten and the match fails. Every candidate is therefore built with the
 * trailing run stripped as well as intact, and both are checked.
 */
function matchCommon(password: string): { form: string; plain: string; suffixed: boolean } | null {
  const lower = password.toLowerCase();

  // Anything appended to the end: digits, punctuation, or both.
  const trimmed = lower.replace(/[^a-z]+$/, "");

  const candidates: { form: string; plain: string; suffixed: boolean }[] = [
    { form: lower, plain: lower, suffixed: false },
    { form: unleet(lower), plain: lower, suffixed: false },
    { form: trimmed, plain: trimmed, suffixed: trimmed !== lower },
    { form: unleet(trimmed), plain: trimmed, suffixed: trimmed !== lower },
    // Letters only, which catches a word with symbols scattered through it.
    { form: unleet(lower).replace(/[^a-z]/g, ""), plain: lower, suffixed: false },
  ];

  for (const candidate of candidates) {
    if (candidate.form !== "" && COMMON.has(candidate.form)) return candidate;
  }
  return null;
}

const SCORE_LABELS = ["Very weak", "Weak", "Fair", "Strong", "Very strong"] as const;

export function assess(password: string): Strength | null {
  if (password === "") return null;

  const findings: Finding[] = [];
  const pool = poolSize(password);

  // The baseline: how many guesses to exhaust this alphabet at this length.
  let bits = password.length * Math.log2(Math.max(2, pool));

  const lower = password.toLowerCase();
  const match = matchCommon(password);

  // Patterns collapse the search space, so each caps or cuts the estimate
  // rather than merely subtracting a token amount.
  if (match) {
    bits = Math.min(bits, match.suffixed ? 14 : 8);
    findings.push({
      kind: "critical",
      message:
        match.form === lower
          ? "This is one of the most commonly used passwords. It is tried within the first few guesses."
          : match.suffixed && match.form === match.plain
            ? "This is a common word with characters added on the end, which is the second thing tried after the word alone."
            : "This is a common password with letters swapped for lookalike symbols. Cracking tools try those substitutions first — it adds nothing.",
    });
  }

  if (isRepetition(password)) {
    bits = Math.min(bits, 10);
    findings.push({ kind: "critical", message: "This is a short pattern repeated, which is guessed almost immediately." });
  }

  if (hasKeyboardRun(password)) {
    bits = Math.min(bits, Math.max(12, bits * 0.5));
    findings.push({ kind: "warning", message: "It contains a run of adjacent keyboard keys, which cracking tools enumerate directly." });
  }

  if (hasSequence(password)) {
    bits = Math.min(bits, Math.max(12, bits * 0.6));
    findings.push({ kind: "warning", message: "It contains a sequence like 1234 or abcd." });
  }

  if (hasYear(password)) {
    bits -= 6;
    findings.push({ kind: "warning", message: "It contains something that looks like a year, which narrows the guesses considerably." });
  }

  if (password.length < 8) {
    findings.push({ kind: "critical", message: "Under eight characters is brute-forceable regardless of what it contains." });
  } else if (password.length < 12) {
    findings.push({ kind: "warning", message: "Length does more for you than any other single factor. Twelve characters is a sensible floor; sixteen is better." });
  } else if (password.length >= 16) {
    findings.push({ kind: "good", message: "Long enough that length alone carries most of the strength." });
  }

  if (pool <= 26 && password.length >= 16) {
    findings.push({
      kind: "good",
      message: "All lowercase, but long — a passphrase of several unrelated words beats a short scrambled password and is far easier to remember.",
    });
  }

  bits = Math.max(0, bits);

  // An offline attack against a fast hash. Deliberately pessimistic: a good
  // password should survive the worst realistic case, not the average one.
  const guessesPerSecond = 1e11;
  const crackSeconds = bits > 200 ? Infinity : 2 ** (bits - 1) / guessesPerSecond;

  const score: Strength["score"] =
    bits < 28 ? 0 : bits < 40 ? 1 : bits < 60 ? 2 : bits < 80 ? 3 : 4;

  return { bits, score, label: SCORE_LABELS[score], findings, crackSeconds };
}

/** Human duration for the crack estimate. */
export function formatCrackTime(seconds: number): string {
  if (!Number.isFinite(seconds)) return "longer than the universe has existed";
  if (seconds < 1) return "instantly";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;
  if (seconds < 3600) return `${Math.round(seconds / 60)} minutes`;
  if (seconds < 86400) return `${Math.round(seconds / 3600)} hours`;
  if (seconds < 2_592_000) return `${Math.round(seconds / 86400)} days`;
  if (seconds < 31_536_000) return `${Math.round(seconds / 2_592_000)} months`;

  const years = seconds / 31_536_000;
  if (years < 1000) return `${Math.round(years)} years`;
  if (years < 1e6) return `${Math.round(years / 1000)} thousand years`;
  if (years < 1e9) return `${Math.round(years / 1e6)} million years`;
  if (years < 1e12) return `${Math.round(years / 1e9)} billion years`;
  return "longer than the universe has existed";
}
