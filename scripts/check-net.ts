#!/usr/bin/env node
/**
 * Verifies the SSRF guards in src/lib/net.ts.
 *
 * These decide whether the server will fetch a user-supplied URL, so the
 * boundaries matter more than the obvious cases: 172.16/12 and 100.64/10 are
 * the two masks that are easy to write one bit wrong, and a wrong mask either
 * exposes the private network or blocks real public addresses.
 *
 *   pnpm check:net
 */
import process from "node:process";

import { clientIp, ipVersion, isPrivateAddress, isValidHostname } from "@/lib/net";
import { auditSecurityHeaders } from "@/tools/http-header-checker/logic";
import { describeBrowser, describeOs } from "@/tools/what-is-my-ip/logic";

let failures = 0;

function check(label: string, actual: unknown, expected: unknown): void {
  if (actual === expected) {
    console.log(`  ok    ${label}`);
  } else {
    failures += 1;
    console.error(`  FAIL  ${label}: got ${String(actual)}, expected ${String(expected)}`);
  }
}

console.log("\nBlocked addresses");
for (const address of [
  "127.0.0.1", "127.1.2.3", "10.0.0.1", "10.255.255.255",
  "172.16.0.1", "172.31.255.255", "192.168.1.1", "192.168.0.0",
  "100.64.0.1", "100.127.255.255", "0.0.0.0", "224.0.0.1", "255.255.255.255",
  // The one that leaks cloud credentials if it gets through.
  "169.254.169.254", "169.254.0.1",
  "::1", "::", "fc00::1", "fd12:3456::1", "fe80::1", "::ffff:127.0.0.1",
  "::ffff:169.254.169.254", "64:ff9b::7f00:1", "2002:7f00:1::1",
  // Ambiguous or malformed input must fail closed.
  "010.0.0.1", "0177.0.0.1", "1.1.1.1.1", "999.1.1.1", "", "not-an-ip", "1.1.1",
]) {
  check(`${address || "(empty)"} is private`, isPrivateAddress(address), true);
}

console.log("\nPublic addresses (a wrong mask blocks these)");
for (const address of [
  "8.8.8.8", "1.1.1.1", "93.184.216.34",
  // Immediately outside each blocked range.
  "172.15.255.255", "172.32.0.0", "100.63.255.255", "100.128.0.0",
  "11.0.0.0", "9.255.255.255", "169.253.255.255", "169.255.0.0",
  "192.167.255.255", "192.169.0.0", "126.255.255.255", "128.0.0.0",
  "223.255.255.255", "2606:4700:4700::1111", "2001:4860:4860::8888",
]) {
  check(`${address} is public`, isPrivateAddress(address), false);
}

console.log("\nHostnames");
for (const [host, expected] of [
  ["example.com", true], ["sub.example.co.uk", true], ["a.io", true],
  ["xn--bcher-kva.example", true],
  // No dot means an internal name, which must not be queryable.
  ["localhost", false], ["metadata", false], ["", false],
  ["example.com.", false], ["-bad.com", false], ["bad-.com", false],
  ["under_score.com", false], ["8.8.8.8", false],
  [`${"a".repeat(64)}.com`, false], [`${"a".repeat(250)}.example.com`, false],
] as const) {
  check(`${host || "(empty)"} → ${expected}`, isValidHostname(host), expected);
}

console.log("\nClient IP from proxy headers");
const forwarded = new Headers({ "x-forwarded-for": "203.0.113.9, 70.41.3.18, 150.172.238.178" });
check("x-forwarded-for takes the leftmost entry", clientIp(forwarded), "203.0.113.9");
check("x-real-ip is a fallback", clientIp(new Headers({ "x-real-ip": "8.8.8.8" })), "8.8.8.8");
check("no proxy headers yields null", clientIp(new Headers()), null);
check("zone index is stripped", clientIp(new Headers({ "x-real-ip": "fe80::1%eth0" })), "fe80::1");

console.log("\nVersion labelling");
check("8.8.8.8 is v4", ipVersion("8.8.8.8"), 4);
check("2606:4700::1 is v6", ipVersion("2606:4700::1"), 6);
check("nonsense has no version", ipVersion("nope"), null);

/* ------------------------------------------------------- user-agent parsing */

/*
 * Every Chromium browser still claims to be Safari and Chrome, and Edge and
 * Opera claim to be Chrome on top of that, so these cases exist to pin the
 * matching order. Get it wrong and everything reports as Chrome.
 */
const CHROME_WIN =
  "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36";
const AGENTS: [string, string, string | null, string | null][] = [
  ["Chrome on Windows", CHROME_WIN, "Chrome 120", "Windows 10 or 11"],
  ["Edge is not Chrome", `${CHROME_WIN} Edg/120.0.0.0`, "Edge 120", "Windows 10 or 11"],
  ["Opera is not Chrome", `${CHROME_WIN} OPR/105.0.0.0`, "Opera 105", "Windows 10 or 11"],
  [
    "Safari on macOS",
    "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Safari/605.1.15",
    "Safari 17",
    "macOS",
  ],
  [
    "Firefox on Windows",
    "Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0",
    "Firefox 121",
    "Windows 10 or 11",
  ],
  [
    "Safari on iPhone",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    "Safari 17",
    "iOS",
  ],
  [
    "Chrome on iOS reports as Chrome",
    "Mozilla/5.0 (iPhone; CPU iPhone OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) CriOS/120.0.0.0 Mobile/15E148 Safari/604.1",
    "Chrome 120",
    "iOS",
  ],
  [
    "iPad is not macOS",
    "Mozilla/5.0 (iPad; CPU OS 17_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.0 Mobile/15E148 Safari/604.1",
    "Safari 17",
    "iPadOS",
  ],
  [
    "Chrome on Android",
    "Mozilla/5.0 (Linux; Android 13; Pixel 7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Mobile Safari/537.36",
    "Chrome 120",
    "Android 13",
  ],
  ["an unrecognised agent reports nothing", "SomeBot/1.0", null, null],
];

console.log("\nUser-agent parsing");
for (const [label, ua, browser, os] of AGENTS) {
  check(`${label} → browser`, describeBrowser(ua), browser);
  check(`${label} → OS`, describeOs(ua), os);
}

/* ---------------------------------------------------------- header auditing */

console.log("\nSecurity header audit");
const found = (headers: [string, string][], name: string) =>
  auditSecurityHeaders(headers).find((entry) => entry.header === name)!;

check(
  "HSTS is detected",
  found([["strict-transport-security", "max-age=63072000"]], "Strict-Transport-Security").present,
  true,
);
check("a bare response reports HSTS missing", found([], "Strict-Transport-Security").present, false);

// The case worth pinning: frame-ancestors supersedes X-Frame-Options, so a site
// setting only the CSP directive is protected and must not be flagged.
check(
  "CSP frame-ancestors counts as clickjacking protection",
  found(
    [["content-security-policy", "default-src 'self'; frame-ancestors 'none'"]],
    "X-Frame-Options",
  ).present,
  true,
);
check(
  "a CSP without frame-ancestors does not",
  found([["content-security-policy", "default-src 'self'"]], "X-Frame-Options").present,
  false,
);
check(
  "X-Frame-Options alone still counts",
  found([["x-frame-options", "DENY"]], "X-Frame-Options").present,
  true,
);

// nosniff is the only value that does anything; anything else is not protection.
check(
  "nosniff is accepted",
  found([["x-content-type-options", "nosniff"]], "X-Content-Type-Options").present,
  true,
);
check(
  "a wrong X-Content-Type-Options value is not accepted",
  found([["x-content-type-options", "text/html"]], "X-Content-Type-Options").present,
  false,
);
check(
  "header names are matched case-insensitively",
  found([["Strict-Transport-Security", "max-age=1"]], "Strict-Transport-Security").present,
  true,
);

console.log(failures === 0 ? "\nAll network guards verified." : `\n${failures} network checks FAILED.`);
process.exit(failures === 0 ? 0 : 1);
