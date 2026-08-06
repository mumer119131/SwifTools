/**
 * Teaches Node the `@/*` path alias that tsconfig and the bundler already know.
 *
 * The check scripts import real application modules so they test the code that
 * actually ships, rather than a copy. Those modules import each other through
 * `@/`, which Node has no concept of — this maps it to `src/` and fills in the
 * extension, the two things a bundler does for free.
 *
 * Used as: node --experimental-strip-types --import ./scripts/alias-hook.mjs …
 */
import { registerHooks } from "node:module";
import { existsSync } from "node:fs";
import { fileURLToPath } from "node:url";

const SRC = new URL("../src/", import.meta.url);

/** Imports are written without an extension, so try the ones we use. */
const CANDIDATES = [".ts", ".tsx", "/index.ts", "/index.tsx", ""];

registerHooks({
  resolve(specifier, context, nextResolve) {
    if (!specifier.startsWith("@/")) return nextResolve(specifier, context);

    const base = new URL(specifier.slice(2), SRC);

    for (const suffix of CANDIDATES) {
      const candidate = new URL(base.href + suffix);
      if (existsSync(fileURLToPath(candidate))) {
        return { url: candidate.href, shortCircuit: true };
      }
    }

    throw new Error(`Could not resolve "${specifier}" under src/`);
  },
});
