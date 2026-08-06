export interface PasswordOptions {
  length: number;
  lowercase: boolean;
  uppercase: boolean;
  digits: boolean;
  symbols: boolean;
  /** Drops 0/O/1/l/I, which are routinely misread when typed from a screen. */
  avoidAmbiguous: boolean;
}

const SETS = {
  lowercase: "abcdefghijklmnopqrstuvwxyz",
  uppercase: "ABCDEFGHIJKLMNOPQRSTUVWXYZ",
  digits: "0123456789",
  symbols: "!@#$%^&*()-_=+[]{};:,.<>?/~",
};

const AMBIGUOUS = /[0O1lI|`']/g;

export function buildAlphabet(options: PasswordOptions): string {
  let alphabet = "";
  if (options.lowercase) alphabet += SETS.lowercase;
  if (options.uppercase) alphabet += SETS.uppercase;
  if (options.digits) alphabet += SETS.digits;
  if (options.symbols) alphabet += SETS.symbols;

  return options.avoidAmbiguous ? alphabet.replace(AMBIGUOUS, "") : alphabet;
}

/**
 * Draws indices from the CSPRNG with rejection sampling.
 *
 * The obvious `random % alphabet.length` is biased whenever the alphabet size
 * doesn't divide 256 evenly — early characters become slightly more likely.
 * Discarding values above the largest exact multiple removes that bias, which
 * matters here because the bias is exactly what an attacker would exploit.
 */
export function generatePassword(options: PasswordOptions): string {
  const alphabet = buildAlphabet(options);
  if (alphabet.length === 0) return "";

  const limit = Math.floor(256 / alphabet.length) * alphabet.length;
  const out: string[] = [];
  const buffer = new Uint8Array(options.length * 2);

  while (out.length < options.length) {
    crypto.getRandomValues(buffer);
    for (const byte of buffer) {
      if (out.length >= options.length) break;
      if (byte >= limit) continue; // Rejected — would skew the distribution.
      out.push(alphabet[byte % alphabet.length]);
    }
  }

  return out.join("");
}

/**
 * A short, deliberately plain word list for passphrases.
 *
 * Entropy comes from the number of words and the list size, not from the words
 * being obscure — 4 words from a 256-word list is 32 bits, which is why the UI
 * pushes toward 5 or 6.
 */
const WORDS = [
  "acorn", "amber", "anchor", "apple", "arrow", "autumn", "badger", "banjo", "basil", "beacon",
  "bison", "blossom", "boulder", "branch", "breeze", "bridge", "bronze", "butter", "cabin", "cactus",
  "candle", "canyon", "cedar", "chalk", "cherry", "cinder", "cliff", "clover", "cobalt", "comet",
  "copper", "coral", "cotton", "crater", "crimson", "crystal", "dahlia", "daisy", "dawn", "delta",
  "denim", "desert", "diamond", "dolphin", "donkey", "dragon", "dusk", "eagle", "ember", "emerald",
  "falcon", "fern", "fiddle", "flint", "forest", "fossil", "fox", "galaxy", "garden", "ginger",
  "glacier", "granite", "grove", "harbor", "harvest", "hazel", "heather", "hedge", "hollow", "honey",
  "hornet", "indigo", "iris", "island", "ivory", "jasmine", "jetty", "juniper", "kettle", "lagoon",
  "lantern", "lark", "laurel", "lemon", "lichen", "lilac", "linen", "lizard", "lotus", "lumber",
  "magnet", "mahogany", "maple", "marble", "marsh", "meadow", "mercury", "meteor", "mint", "mist",
  "moss", "mountain", "muffin", "nectar", "needle", "nettle", "nickel", "noodle", "oasis", "ocean",
  "olive", "onyx", "opal", "orchard", "orchid", "otter", "oyster", "paddle", "palm", "pantry",
  "parsley", "pebble", "pelican", "pepper", "petal", "pigeon", "pillow", "pine", "pistol", "planet",
  "plateau", "plum", "pollen", "poppy", "prairie", "puffin", "pumpkin", "quartz", "quiver", "rabbit",
  "raccoon", "radish", "rain", "raven", "reef", "ribbon", "ridge", "river", "robin", "rocket",
  "rosemary", "rubble", "ruby", "saffron", "sage", "salmon", "sandal", "sapphire", "satin", "scarlet",
  "seagull", "sequoia", "shadow", "shale", "shell", "shore", "silver", "sketch", "slate", "sloth",
  "smoke", "snapper", "socket", "solar", "sparrow", "spruce", "squash", "stable", "starling", "steam",
  "stone", "storm", "stream", "sugar", "summit", "sunset", "swallow", "sycamore", "syrup", "tangle",
  "teal", "temple", "thicket", "thistle", "thunder", "timber", "tinder", "topaz", "torch", "tortoise",
  "trellis", "tulip", "tundra", "turtle", "twilight", "umbrella", "valley", "vanilla", "velvet", "vine",
  "violet", "walnut", "walrus", "wander", "warbler", "wasp", "waterfall", "wax", "weasel", "wheat",
  "whisker", "willow", "window", "winter", "wolf", "wombat", "wonder", "wren", "yarrow", "yellow",
  "yonder", "zebra", "zenith", "zephyr", "zinc", "anvil", "attic", "beetle", "bramble", "cavern",
  "chimney", "cricket", "current", "cypress", "driftwood", "echo", "feather", "flannel", "gale", "gravel",
  "hammock", "kernel", "lattice", "marigold", "nutmeg", "orbit",
];

export interface PassphraseOptions {
  words: number;
  separator: string;
  capitalise: boolean;
  appendNumber: boolean;
}

export function generatePassphrase(options: PassphraseOptions): string {
  const limit = Math.floor(65536 / WORDS.length) * WORDS.length;
  const picked: string[] = [];
  const buffer = new Uint16Array(options.words * 2);

  while (picked.length < options.words) {
    crypto.getRandomValues(buffer);
    for (const value of buffer) {
      if (picked.length >= options.words) break;
      if (value >= limit) continue;
      const word = WORDS[value % WORDS.length];
      picked.push(options.capitalise ? word.charAt(0).toUpperCase() + word.slice(1) : word);
    }
  }

  const phrase = picked.join(options.separator);
  if (!options.appendNumber) return phrase;

  const digits = crypto.getRandomValues(new Uint16Array(1))[0] % 100;
  return `${phrase}${options.separator}${String(digits).padStart(2, "0")}`;
}

/** log2(alphabet^length) — the only honest way to measure a random password. */
export function entropyBits(alphabetSize: number, length: number): number {
  if (alphabetSize <= 1 || length <= 0) return 0;
  return Math.log2(alphabetSize) * length;
}

export function passphraseEntropyBits(words: number, appendNumber: boolean): number {
  return Math.log2(WORDS.length) * words + (appendNumber ? Math.log2(100) : 0);
}

export interface Strength {
  label: string;
  /** 0–4, for the meter. */
  score: number;
  crackTime: string;
}

/**
 * Crack time assumes an offline attack against a fast hash at 100 billion
 * guesses per second — the pessimistic-but-realistic assumption for a leaked
 * database, and the one worth designing against.
 */
export function rateStrength(bits: number): Strength {
  const seconds = 2 ** (bits - 1) / 1e11;

  const label =
    bits < 40 ? "Very weak" : bits < 60 ? "Weak" : bits < 80 ? "Reasonable" : bits < 100 ? "Strong" : "Very strong";
  const score = bits < 40 ? 0 : bits < 60 ? 1 : bits < 80 ? 2 : bits < 100 ? 3 : 4;

  return { label, score, crackTime: humaniseSeconds(seconds) };
}

function humaniseSeconds(seconds: number): string {
  if (!Number.isFinite(seconds)) return "longer than the universe has existed";
  if (seconds < 1) return "instantly";
  if (seconds < 60) return `${Math.round(seconds)} seconds`;

  const units: [number, string][] = [
    [60, "minutes"],
    [3600, "hours"],
    [86400, "days"],
    [2_592_000, "months"],
    [31_536_000, "years"],
  ];

  for (let index = units.length - 1; index >= 0; index -= 1) {
    const [size, name] = units[index];
    if (seconds >= size) {
      const value = seconds / size;
      if (name === "years" && value > 1e9) {
        return value > 1.4e10 ? "longer than the universe has existed" : "billions of years";
      }
      return `${formatLarge(value)} ${name}`;
    }
  }

  return "instantly";
}

function formatLarge(value: number): string {
  if (value >= 1e6) return `${(value / 1e6).toFixed(0)} million`;
  if (value >= 1000) return Math.round(value).toLocaleString("en-US");
  return String(Math.round(value));
}
