#!/usr/bin/env node
/**
 * Checks the logic behind the developer batch.
 *
 * Three of these are the kind of thing that cannot be eyeballed. Subnet
 * arithmetic breaks on the top half of the address space because JavaScript's
 * bitwise operators are signed; cron's two day fields combine with OR rather
 * than AND, which almost everyone gets wrong; and an HMAC that is subtly wrong
 * still produces a confident-looking hex string. The HMAC cases are the
 * published RFC 4231 vectors, so passing means matching the standard rather
 * than merely matching itself.
 *
 *   pnpm check:developer
 */

import process from "node:process";

import { calculate, parseAddress, formatAddress, prefixFromMask, divide, divisionCount } from "@/tools/subnet-calculator/logic";
import { parse, describe, nextRuns, expandAlias } from "@/tools/cron-expression-builder/logic";
import { generate, type Options } from "@/tools/json-to-typescript/logic";
import { hmac, encode, decodeKey, timingSafeEqual } from "@/tools/hmac-generator/logic";
import { convert } from "@/tools/yaml-to-json/logic";
import { formatSql, minifySql } from "@/tools/sql-formatter/logic";

let f = 0;

function t(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok   ${label}`);
  else {
    f += 1;
    console.error(`  FAIL ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

console.log("\nIPv4 subnet arithmetic");
{
  // The classic sign-extension trap: anything at or above 128.0.0.0 sets bit 31.
  for (const a of ["128.0.0.1","192.168.1.1","255.255.255.255","224.0.0.1","10.0.0.1","0.0.0.0"]) {
    const v = parseAddress(a);
    t(`${a} round-trips`, v !== null && formatAddress(v) === a, `got ${v===null?"null":formatAddress(v)}`);
    t(`${a} is unsigned`, v !== null && v >= 0, `got ${v}`);
  }

  const s = calculate("192.168.1.130/26")!;
  t("192.168.1.130/26 network is .128", s.network === "192.168.1.128", s.network);
  t("  broadcast is .191", s.broadcast === "192.168.1.191", s.broadcast);
  t("  netmask is 255.255.255.192", s.netmask === "255.255.255.192", s.netmask);
  t("  wildcard is 0.0.0.63", s.wildcard === "0.0.0.63", s.wildcard);
  t("  first host .129", s.firstHost === "192.168.1.129", s.firstHost!);
  t("  last host .190", s.lastHost === "192.168.1.190", s.lastHost!);
  t("  62 usable hosts", s.usableHosts === 62, String(s.usableHosts));
  t("  is private", s.isPrivate);

  // The high half of the address space, where signed arithmetic breaks.
  const h = calculate("200.100.50.25/28")!;
  t("200.100.50.25/28 network .16", h.network === "200.100.50.16", h.network);
  t("  broadcast .31", h.broadcast === "200.100.50.31", h.broadcast);
  t("  14 usable", h.usableHosts === 14, String(h.usableHosts));
  t("  is public", !h.isPrivate);

  const zero = calculate("0.0.0.0/0")!;
  t("/0 total is 2^32", zero.totalAddresses === 4294967296, String(zero.totalAddresses));
  t("/0 netmask is 0.0.0.0", zero.netmask === "0.0.0.0", zero.netmask);
  t("/0 broadcast is 255.255.255.255", zero.broadcast === "255.255.255.255", zero.broadcast);

  const p31 = calculate("10.0.0.0/31")!;
  t("/31 has 2 usable (RFC 3021)", p31.usableHosts === 2, String(p31.usableHosts));
  t("/31 explains itself", (p31.note??"").includes("3021"));
  const p32 = calculate("10.0.0.5/32")!;
  t("/32 has 1 usable", p32.usableHosts === 1, String(p32.usableHosts));
  t("/32 first==last==itself", p32.firstHost === "10.0.0.5" && p32.lastHost === "10.0.0.5");

  const big = calculate("10.0.0.1/8")!;
  t("/8 has 16777214 usable", big.usableHosts === 16777214, String(big.usableHosts));

  // Dotted-mask input must agree with the CIDR form.
  const dotted = calculate("192.168.1.130 255.255.255.192")!;
  t("dotted mask matches /26", dotted.network === s.network && dotted.prefix === 26);

  t("non-contiguous mask rejected", prefixFromMask(parseAddress("255.255.0.255")!) === null);
  t("255.255.255.192 is /26", prefixFromMask(parseAddress("255.255.255.192")!) === 26);
  t("0.0.0.0 is /0", prefixFromMask(0) === 0);
  t("255.255.255.255 is /32", prefixFromMask(0xffffffff) === 32);

  for (const bad of ["256.0.0.1","1.2.3","1.2.3.4.5","01.2.3.4","","abc","1.2.3.-1","1e2.0.0.1","192.168.1.1/33"]) {
    t(`rejects ${JSON.stringify(bad)}`, calculate(bad) === null);
  }

  const parts = divide("192.168.1.0/24", 26);
  t("a /24 splits into four /26s", parts.length === 4, String(parts.length));
  t("  they are contiguous", parts.map(p=>p.network).join(",") === "192.168.1.0,192.168.1.64,192.168.1.128,192.168.1.192", parts.map(p=>p.network).join(","));
  t("  last broadcast closes the block", parts[3].broadcast === "192.168.1.255");
  t("count is uncapped", divisionCount("10.0.0.0/8", 24) === 65536, String(divisionCount("10.0.0.0/8",24)));
  t("display is capped at 256", divide("10.0.0.0/8", 24).length === 256);
  t("dividing to a shorter prefix yields nothing", divide("10.0.0.0/24", 16).length === 0);
}

console.log("\nCron parsing, description and next runs");
{
  const P=(e:string)=>parse(e).parsed!;
  // Cron schedules run in local time, so the assertions must read local time.
  // Formatting via toISOString() shifted everything by the machine's offset and
  // made three correct results look wrong.
  const iso=(d:Date)=>`${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,"0")}-${String(d.getDate()).padStart(2,"0")} ${String(d.getHours()).padStart(2,"0")}:${String(d.getMinutes()).padStart(2,"0")}`;
  // A fixed Monday so weekday assertions are stable.
  const base = new Date(2026, 0, 5, 10, 30, 0); // Mon 5 Jan 2026 10:30 local

  t("every minute parses", P("* * * * *") !== undefined);
  t("  described", describe(P("* * * * *")) === "Every minute, every day.", describe(P("* * * * *")));

  t("daily midnight", describe(P("0 0 * * *")) === "At 00:00, every day.", describe(P("0 0 * * *")));
  t("@daily expands", expandAlias("@daily") === "0 0 * * *");
  t("@weekly is Sunday", describe(P("@weekly")).includes("Sunday"), describe(P("@weekly")));

  // Steps.
  const q = P("*/15 * * * *");
  t("*/15 gives 4 minutes", q.values[0].join(",") === "0,15,30,45", q.values[0].join(","));
  const biz = P("0 9-17 * * 1-5");
  t("9-17 gives 9 hours", biz.values[1].length === 9, String(biz.values[1].length));
  t("1-5 gives Mon-Fri", biz.values[4].join(",") === "1,2,3,4,5", biz.values[4].join(","));
  t("  described as weekdays", describe(biz).includes("Monday, Tuesday, Wednesday, Thursday and Friday"), describe(biz));

  // Names.
  t("JAN-MAR parses", P("0 0 1 jan-mar *").values[3].join(",") === "1,2,3", P("0 0 1 jan-mar *").values[3].join(","));
  t("MON,FRI parses", P("0 0 * * mon,fri").values[4].join(",") === "1,5", P("0 0 * * mon,fri").values[4].join(","));
  t("7 normalises to Sunday", P("0 0 * * 7").values[4].join(",") === "0", P("0 0 * * 7").values[4].join(","));

  // The OR rule — the single most misunderstood part of cron.
  const both = P("0 0 1 * 1");
  t("both day fields → OR is stated", describe(both).includes("OR"), describe(both));
  const runs = nextRuns(both, new Date(2026,0,1,0,1), 6).map(iso);
  // Jan 2026: Mondays are 5,12,19,26. Plus the 1st of each month.
  t("  OR fires on Mondays and the 1st", runs.slice(0,5).join(" | ").includes("2026-01-05") && runs.slice(0,5).join(" | ").includes("2026-02-01"), runs.join(" | "));

  // 5/10 is open-ended, not a single value.
  t("5/10 is open-ended", P("5/10 * * * *").values[0].join(",") === "5,15,25,35,45,55", P("5/10 * * * *").values[0].join(","));

  // Next runs.
  const daily = nextRuns(P("0 0 * * *"), base, 3).map(iso);
  t("daily next 3 are consecutive midnights", daily.join(",").includes("2026-01-06 00:00"), daily.join(","));
  const bizRuns = nextRuns(biz, new Date(2026,0,2,18,0), 3).map(iso); // Fri 2 Jan 18:00
  t("business hours skip the weekend", bizRuns[0].startsWith("2026-01-05"), bizRuns.join(" | "));

  // 29 February — needs the four-year scan window.
  const leap = nextRuns(P("0 0 29 2 *"), new Date(2026,0,1), 1).map(iso);
  t("29 Feb resolves to 2028", leap[0]?.startsWith("2028-02-29"), leap.join(","));

  // A schedule that can never fire must not hang.
  const never = nextRuns(P("0 0 30 2 *"), new Date(2026,0,1), 1);
  t("30 February returns nothing rather than hanging", never.length === 0, String(never.length));

  // Errors.
  for (const bad of ["* * * *", "60 * * * *", "* 24 * * *", "0 0 32 * *", "0 0 * 13 *", "* * * * 8", "a b c d e", "*/0 * * * *", "5-1 * * * *", "", "0 0 * * mon-xyz"]) {
    const r = parse(bad);
    t(`rejects ${JSON.stringify(bad)}`, r.parsed === null && r.errors.length > 0, JSON.stringify(r.errors));
  }
}

console.log("\nTypeScript inference from JSON");
{
  const O=(o:Partial<Options>={}):Options=>({rootName:"Root",style:"interface",allOptional:false,readonly:false,...o});
  const G=(j:string,o:Partial<Options>={})=>{const r=generate(j,O(o)); if("error" in r) throw new Error(r.error); return r;};

  let r = G('{"id":1,"name":"Ada","active":true}');
  t("primitives infer", r.code.includes("id: number") && r.code.includes("name: string") && r.code.includes("active: boolean"), r.code);
  t("exports an interface", r.code.startsWith("export interface Root {"), r.code);

  r = G('{"user":{"id":1,"tags":["a","b"]}}');
  t("nested object gets its own interface", r.code.includes("export interface User"), r.code);
  t("  and is referenced", r.code.includes("user: User"), r.code);
  t("  string array", r.code.includes("tags: string[]"), r.code);

  // The merge across array elements — the feature that makes this worth using.
  r = G('[{"id":1,"name":"a"},{"id":2},{"id":3,"name":"c","extra":true}]');
  t("a key missing from some records is optional", r.code.includes("name?: string"), r.code);
  t("a key present in one record is optional", r.code.includes("extra?: boolean"), r.code);
  t("a key in every record is required", /\n  id: number;/.test(r.code), r.code);
  t("root array yields a List alias", r.code.includes("export type RootList = Root[]"), r.code);

  // Nullable.
  r = G('[{"a":null},{"a":"x"}]');
  t("null + string unions", r.code.includes("a: string | null") || r.code.includes("a?: string | null"), r.code);

  r = G('{"a":null}');
  t("always-null is flagged", r.warnings.some(w=>w.includes("null in this sample")), r.warnings.join("|"));
  r = G('{"items":[]}');
  t("empty array is flagged", r.warnings.some(w=>w.includes("empty array")), r.warnings.join("|"));
  t("  and typed unknown", r.code.includes("items: unknown[]"), r.code);

  // Naming.
  r = G('{"users":[{"id":1}]}');
  t("plural key singularises the element type", r.code.includes("export interface User") && r.code.includes("users: User[]"), r.code);
  r = G('{"companies":[{"id":1}]}');
  t("-ies singularises to -y", r.code.includes("interface Company"), r.code);

  // Awkward keys.
  r = G('{"first-name":"a","2fa":true,"ok":1}');
  t("hyphenated key is quoted", r.code.includes('"first-name": string'), r.code);
  t("digit-leading key is quoted", r.code.includes('"2fa": boolean'), r.code);

  // Union inside an array must be parenthesised.
  r = G('{"mixed":[1,"a"]}');
  t("mixed array parenthesises the union", /mixed: \((number \| string|string \| number)\)\[\]/.test(r.code), r.code);

  // Options.
  r = G('{"a":1,"b":"x"}', {allOptional:true});
  t("allOptional marks every field", r.code.includes("a?: number") && r.code.includes("b?: string"), r.code);
  r = G('{"a":1}', {readonly:true});
  t("readonly is applied", r.code.includes("readonly a: number"), r.code);
  r = G('{"a":{"b":1}}', {style:"type"});
  t("type style nests inline", r.code.startsWith("export type Root = {") && r.code.includes("b: number"), r.code);
  t("  and declares no interfaces", !r.code.includes("interface"), r.code);
  r = G('{"a":1}', {rootName:"api response"});
  t("root name is pascal-cased", r.code.includes("interface ApiResponse"), r.code);

  const bad = generate("{not json}", O());
  t("invalid JSON returns an error", "error" in bad, JSON.stringify(bad));
  const empty = generate("[]", O());
  t("empty root array does not crash", !("error" in empty), JSON.stringify(empty));
}

console.log("\nHMAC (RFC 4231 vectors), YAML and SQL");
{
  // ---- HMAC against RFC 4231 test vectors. These are the published answers, so
  // a pass means the implementation matches the standard, not just itself.
  const key1 = "0b".repeat(20);
  const h1 = await hmac("Hi There", key1, "SHA-256", "hex");
  t("RFC 4231 case 1 SHA-256",
    encode(h1,"hex") === "b0344c61d8db38535ca8afceaf0bf12b881dc200c9833da726e9376c2e32cff7",
    encode(h1,"hex"));
  const h2 = await hmac("what do ya want for nothing?", "Jefe", "SHA-256", "text");
  t("RFC 4231 case 2 SHA-256",
    encode(h2,"hex") === "5bdcc146bf60754e6a042426089575c75a003f089d2739839dec58b964ec3843",
    encode(h2,"hex"));
  const h2b = await hmac("what do ya want for nothing?", "Jefe", "SHA-512", "text");
  t("RFC 4231 case 2 SHA-512",
    encode(h2b,"hex").startsWith("164b7a7bfcf819e2e395fbe73b56e0a387bd64222e831fd610270cd7ea250554"),
    encode(h2b,"hex").slice(0,64));

  t("hex encoding is 64 chars for SHA-256", encode(h1,"hex").length === 64);
  t("base64 and base64url differ in alphabet only",
    encode(h1,"base64").replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"") === encode(h1,"base64url"),
    encode(h1,"base64")+" / "+encode(h1,"base64url"));
  t("base64url has no padding", !encode(h1,"base64url").includes("="));

  t("bad hex key rejected", decodeKey("zz","hex") === null);
  t("odd-length hex rejected", decodeKey("abc","hex") === null);
  t("valid hex key decodes", decodeKey("00ff","hex")?.length === 2);
  t("text key decodes as UTF-8", decodeKey("é","text")?.length === 2);

  t("timing-safe equal matches", timingSafeEqual("abc","ABC"));
  t("timing-safe equal rejects", !timingSafeEqual("abc","abd"));
  t("timing-safe equal rejects length mismatch", !timingSafeEqual("abc","abcd"));

  // ---- YAML
  let y = convert("name: Ada\nage: 36\ntags:\n  - a\n  - b\n", "yaml-to-json", 2);
  t("YAML → JSON", !("error" in y) && JSON.parse(y.output).name === "Ada", JSON.stringify(y));
  y = convert("# a comment\nname: Ada\n", "yaml-to-json", 2);
  t("comments are flagged as dropped", !("error" in y) && y.notes.some(n=>n.includes("Comments")), JSON.stringify(y));
  y = convert("base: &a\n  x: 1\nchild:\n  <<: *a\n", "yaml-to-json", 2);
  t("anchors are flagged as expanded", !("error" in y) && y.notes.some(n=>n.includes("Anchors")), JSON.stringify(y));
  y = convert('{"a":1,"b":[1,2]}', "json-to-yaml", 2);
  t("JSON → YAML", !("error" in y) && y.output.includes("a: 1") && y.output.includes("- 1"), JSON.stringify(y));
  y = convert("a: [unclosed\n", "yaml-to-json", 2);
  t("broken YAML reports an error", "error" in y, JSON.stringify(y));
  y = convert("{bad json}", "json-to-yaml", 2);
  t("broken JSON reports an error", "error" in y, JSON.stringify(y));
  const blank = convert("", "yaml-to-json", 2);
  t("empty input is empty output", !("error" in blank) && blank.output === "");

  // Round trip must preserve the data.
  const original = { name: "Ada", nested: { list: [1, 2, 3], flag: true }, nil: null };
  const asYaml = convert(JSON.stringify(original), "json-to-yaml", 2);
  if ("error" in asYaml) {
    t("JSON → YAML → JSON round-trips", false, asYaml.error);
  } else {
    const back = convert(asYaml.output, "yaml-to-json", 2);
    t(
      "JSON → YAML → JSON round-trips",
      !("error" in back) && JSON.stringify(JSON.parse(back.output)) === JSON.stringify(original),
      JSON.stringify(back),
    );
  }

  // ---- SQL
  let s = formatSql("select a,b from t where x=1 and y=2", {dialect:"sql",indent:2,keywordCase:"upper",expandLists:false});
  t("SQL formats", !("error" in s) && s.output.includes("SELECT") && s.output.includes("FROM"), JSON.stringify(s));
  t("  keywords uppercased", !("error" in s) && s.output.includes("WHERE"), JSON.stringify(s));
  s = formatSql("SELECT A FROM T", {dialect:"sql",indent:2,keywordCase:"lower",expandLists:false});
  t("keywords lowercased", !("error" in s) && s.output.includes("select"), JSON.stringify(s));

  // A string literal must never be touched — the one thing a formatter must not break.
  s = formatSql("select 'SELECT from where' as x from t", {dialect:"sql",indent:2,keywordCase:"upper",expandLists:false});
  t("string literals are left alone", !("error" in s) && s.output.includes("'SELECT from where'"), JSON.stringify(s));

  s = minifySql("SELECT\n  a,\n  b\nFROM t", "sql");
  t("minify returns one line", !("error" in s) && !s.output.includes("\n"), JSON.stringify(s));
  const blankSql = formatSql("", { dialect: "sql", indent: 2, keywordCase: "upper", expandLists: false });
  t("empty SQL is empty", !("error" in blankSql) && blankSql.output === "");
}

console.log(
  f === 0
    ? "\nAll developer checks passed."
    : `\n${f} developer checks FAILED.`,
);

process.exit(f === 0 ? 0 : 1);
