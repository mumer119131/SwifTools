import { algorithms, type HashAlgorithm } from "@/lib/hash";

/**
 * SHA-1 is one of six algorithms sharing a single implementation in
 * `@/lib/hash`, verified against published test vectors by `pnpm check:hashes`.
 * This module exists so each tool folder keeps the project's
 * meta / logic / Tool shape.
 */
export const algorithm: HashAlgorithm = "SHA-1";

export const info = algorithms[algorithm];
