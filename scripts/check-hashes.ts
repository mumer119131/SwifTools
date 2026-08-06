#!/usr/bin/env node
/**
 * Verifies the hash implementations against published test vectors.
 *
 * SHA-1/256/384/512 come from Web Crypto and are the platform's own audited
 * code. MD5 and SHA-224 are implemented by hand — Web Crypto deliberately
 * omits MD5 because it is broken, and never offered SHA-224 — so those two are
 * the ones that actually need checking. A hash tool that returns a wrong digest
 * is worse than no tool at all, because the output looks equally plausible.
 *
 *   pnpm check:hashes
 */

import process from "node:process";

import { hashText, type HashAlgorithm } from "../src/lib/hash.ts";

/** Vectors from RFC 1321 (MD5) and NIST FIPS 180-4 / RFC 3874 (SHA family). */
const vectors: [HashAlgorithm, string, string][] = [
  ["MD5", "", "d41d8cd98f00b204e9800998ecf8427e"],
  ["MD5", "a", "0cc175b9c0f1b6a831c399e269772661"],
  ["MD5", "abc", "900150983cd24fb0d6963f7d28e17f72"],
  ["MD5", "message digest", "f96b697d7cb7938d525a2f31aaf161d0"],
  ["MD5", "abcdefghijklmnopqrstuvwxyz", "c3fcd3d76192e4007dfb496cca67e13b"],
  [
    "MD5",
    "12345678901234567890123456789012345678901234567890123456789012345678901234567890",
    "57edf4a22be3c955ac49da2e2107b67a",
  ],
  ["MD5", "The quick brown fox jumps over the lazy dog", "9e107d9d372bb6826bd81d3542a419d6"],

  ["SHA-1", "abc", "a9993e364706816aba3e25717850c26c9cd0d89d"],
  ["SHA-1", "", "da39a3ee5e6b4b0d3255bfef95601890afd80709"],

  ["SHA-224", "", "d14a028c2a3a2bc9476102bb288234c415a2b01f828ea62ac5b3e42f"],
  ["SHA-224", "abc", "23097d223405d8228642a477bda255b32aadbce4bda0b3f7e36c9da7"],
  [
    "SHA-224",
    "abcdbcdecdefdefgefghfghighijhijkijkljklmklmnlmnomnopnopq",
    "75388b16512776cc5dba5da1fd890150b0c6455cb4f58b1952522525",
  ],
  [
    "SHA-224",
    "The quick brown fox jumps over the lazy dog",
    "730e109bd7a8a32b1cb9d9a09aa2325d2430587ddbc0c38bad911525",
  ],

  ["SHA-256", "abc", "ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad"],
  [
    "SHA-384",
    "abc",
    "cb00753f45a35e8bb5a03d699ac65007272c32ab0eded1631a8b605a43ff5bed8086072ba1e7cc2358baeca134c825a7",
  ],
  [
    "SHA-512",
    "abc",
    "ddaf35a193617abacc417349ae20413112e6fa4e89a97ea20a9eeee64b55d39a2192992a274fc1a836ba3c23a3feebbd454d4423643ce80e2a9ac94fa54ca49f",
  ],
];

let failures = 0;

for (const [algorithm, input, expected] of vectors) {
  const actual = await hashText(input, algorithm);
  const label = input.length > 28 ? `${input.slice(0, 28)}…` : `"${input}"`;

  if (actual === expected) {
    console.log(`  ok    ${algorithm.padEnd(8)} ${label}`);
  } else {
    failures += 1;
    console.error(`  FAIL  ${algorithm.padEnd(8)} ${label}`);
    console.error(`          expected ${expected}`);
    console.error(`          actual   ${actual}`);
  }
}

console.log(
  failures === 0
    ? `\n${vectors.length} hash vectors match.`
    : `\n${failures} of ${vectors.length} vectors FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);
