#!/usr/bin/env node
/**
 * Verifies the password manager's encryption.
 *
 * This is the one tool where a silent bug means a user loses data or believes
 * something is protected when it is not, so every property that matters is
 * asserted: that a wrong password fails rather than returning rubbish, that
 * tampering is detected, and that no two saves produce the same ciphertext.
 *
 *   pnpm check:vault
 */

import process from "node:process";

import { decryptVault, encryptVault, assessMaster, ITERATIONS, type Entry } from "@/tools/password-manager/logic";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const entries: Entry[] = [
  { id: "1", site: "example.com", username: "ada", password: "correct horse battery staple", notes: "test" },
  { id: "2", site: "another.test", username: "grace", password: "hunter2", notes: "" },
];

const MASTER = "a reasonably long master password";

const vault = await encryptVault(entries, MASTER);

assert("iterations recorded", vault.iterations === ITERATIONS);
assert("salt is present", vault.salt.length > 0);
assert("iv is present", vault.iv.length > 0);

// The stored blob must not contain any plaintext.
const blob = JSON.stringify(vault);
for (const secret of ["example.com", "ada", "correct horse", "hunter2"]) {
  assert(`"${secret}" does not appear in the stored vault`, !blob.includes(secret));
}

const decrypted = await decryptVault(vault, MASTER);
assert("round-trips with the right password", JSON.stringify(decrypted) === JSON.stringify(entries));

// A wrong password must fail outright, not return garbage.
assert("wrong password returns null", (await decryptVault(vault, "wrong password")) === null);
assert("empty password returns null", (await decryptVault(vault, "")) === null);
assert(
  "one character off returns null",
  (await decryptVault(vault, `${MASTER}x`)) === null,
);

// AES-GCM authenticates, so a flipped byte must be detected.
const tampered = { ...vault, ciphertext: `${vault.ciphertext.slice(0, -4)}AAAA` };
assert("tampered ciphertext is rejected", (await decryptVault(tampered, MASTER)) === null);

const wrongSalt = { ...vault, salt: Buffer.from(new Uint8Array(16).fill(7)).toString("base64") };
assert("wrong salt is rejected", (await decryptVault(wrongSalt, MASTER)) === null);

// A fresh salt and IV per save means identical data encrypts differently.
const again = await encryptVault(entries, MASTER);
assert("salt differs between saves", again.salt !== vault.salt);
assert("iv differs between saves", again.iv !== vault.iv);
assert("ciphertext differs between saves", again.ciphertext !== vault.ciphertext);
assert(
  "both still decrypt",
  JSON.stringify(await decryptVault(again, MASTER)) === JSON.stringify(entries),
);

// An empty vault must round-trip too — that is the state right after creation.
const empty = await encryptVault([], MASTER);
assert("empty vault round-trips", JSON.stringify(await decryptVault(empty, MASTER)) === "[]");

// Strength feedback should not call a short password strong.
assert("short password flagged", assessMaster("abc").score === 1);
assert("12 characters is not yet strong", assessMaster("abcdefghijkl").score < 4);
assert("long mixed password is strong", assessMaster("Correct-Horse-Battery-9").score === 4);
assert("empty password scores zero", assessMaster("").score === 0);

console.log(failures === 0 ? "\nAll vault checks passed." : `\n${failures} vault checks FAILED.`);
process.exit(failures === 0 ? 0 : 1);
