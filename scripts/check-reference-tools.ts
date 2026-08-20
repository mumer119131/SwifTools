#!/usr/bin/env node
/**
 * Checks the reference batch: Roman numerals, shoe sizes, HTTP codes,
 * roasting times and the HTML stripper.
 *
 * The Roman decoder is the one worth reading. Most converters accept anything
 * vaguely Roman-looking and return a number — IIII, IC and VV all parse under a
 * naive scan — and reporting 99 for IC is worse than refusing it, because the
 * reader has no reason to doubt it.
 *
 *   pnpm check:reference
 */

import process from "node:process";

import { EXAMPLES, MAX, MIN, fromRoman, toRoman } from "@/tools/roman-numeral-converter/logic";
import { TABLES, convert as shoeConvert } from "@/tools/shoe-size-converter/logic";
import { ALL_CODES, STATUS_CLASSES, classOf, findCode, search } from "@/tools/http-status-codes/logic";
import { MEATS, calculate as cookTime, donenessOptions, formatMinutes, startTime } from "@/tools/cooking-time-calculator/logic";
import { countWords, decodeEntities, stripHtml } from "@/tools/strip-html/logic";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

/* ====================================================== Roman numerals */

console.log("Roman numerals");

{
  for (const example of EXAMPLES) {
    assert(`${example.value} is ${example.roman}`, toRoman(example.value) === example.roman,
      String(toRoman(example.value)));
  }

  // Every number in range must survive a round trip. This is the assertion
  // that would catch a subtly wrong table.
  let broken = 0;
  for (let n = MIN; n <= MAX; n += 1) {
    const roman = toRoman(n);
    const back = roman === null ? null : fromRoman(roman);
    if (!roman || !back || "error" in back || back.value !== n) broken += 1;
  }
  assert(`all ${MAX} numbers round-trip`, broken === 0, `${broken} failed`);

  assert("zero is refused", toRoman(0) === null);
  assert("negatives are refused", toRoman(-5) === null);
  assert("4000 is refused", toRoman(4000) === null);
  assert("fractions are refused", toRoman(4.5) === null);

  // The malformed numerals a naive decoder accepts.
  const malformed: [string, string][] = [
    ["IIII", "4 is written IV"],
    ["VV", "10 is written X"],
    ["IC", "99 is written XCIX"],
    ["IL", "49"],
    ["XXXX", "40 is written XL"],
    ["VX", "5"],
    ["MMMM", "outside 1–3999"],
    ["IIX", "8"],
  ];
  for (const [input, why] of malformed) {
    const result = fromRoman(input);
    assert(`${input} is rejected (${why})`, "error" in result, JSON.stringify(result));
  }

  assert("lowercase is accepted", (fromRoman("mcmxcix") as { value: number }).value === 1999);
  assert("whitespace is trimmed", (fromRoman("  XIV  ") as { value: number }).value === 14);
  assert("letters outside the set are named", (fromRoman("ABC") as { error: string }).error.includes("A"));
  assert("empty input is refused", "error" in fromRoman(""));
}

/* =========================================================== shoe sizes */

console.log("\nShoe sizes");

{
  const men = shoeConvert(9, "uk", "men")!;
  assert("UK 9 men is US 10", men.row.us === 10 && men.exact);
  assert("and EU 43.5", men.row.eu === 43.5);
  assert("and 27.5cm", men.row.cm === 27.5);

  const women = shoeConvert(6, "uk", "women")!;
  assert("UK 6 women is US 8", women.row.us === 8);
  assert("and EU 39", women.row.eu === 39);

  // The gap between men's and women's sizing at the same UK number is the
  // thing people get wrong when buying across the divide.
  const menUk6 = shoeConvert(6, "uk", "men")!;
  const womenUk6 = shoeConvert(6, "uk", "women")!;
  assert(
    `UK 6 differs by fit (men US ${menUk6.row.us}, women US ${womenUk6.row.us})`,
    menUk6.row.us !== womenUk6.row.us,
  );

  // Going in from any column must land on the same row.
  for (const fit of ["men", "women", "kids"] as const) {
    let inconsistent = 0;
    for (const row of TABLES[fit]) {
      for (const region of ["uk", "us", "eu", "cm"] as const) {
        const found = shoeConvert(row[region], region, fit);
        if (!found || found.row.cm !== row.cm) inconsistent += 1;
      }
    }
    assert(`every ${fit} row is reachable from every column`, inconsistent === 0, `${inconsistent} off`);
  }

  // Foot length must rise with size — a table typo would show up here.
  for (const fit of ["men", "women"] as const) {
    const table = TABLES[fit];
    assert(`${fit} foot lengths ascend`, table.every((row, i) => i === 0 || row.cm > table[i - 1].cm));
    assert(`${fit} US sizes ascend`, table.every((row, i) => i === 0 || row.us > table[i - 1].us));
  }

  assert("a nearby size snaps to the closest row", shoeConvert(9.2, "uk", "men")?.exact === false);
  assert("something far outside returns nothing", shoeConvert(30, "uk", "men") === null);
  assert("zero returns nothing", shoeConvert(0, "uk", "men") === null);
}

/* ======================================================== HTTP statuses */

console.log("\nHTTP status codes");

{
  assert("404 is found", findCode(404)?.status.name === "Not Found");
  assert("and in the 4xx class", findCode(404)?.group.range === "4xx");
  assert("200 is OK", findCode(200)?.status.name === "OK");
  assert("418 survived", findCode(418)?.status.name === "I'm a Teapot");
  assert("an unlisted code returns nothing", findCode(499) === null);

  // An unlisted code should still resolve to its class.
  assert("499 is still a client error", classOf(499)?.range === "4xx");
  assert("599 is a server error", classOf(599)?.range === "5xx");
  assert("99 is not a status", classOf(99) === null);
  assert("600 is not a status", classOf(600) === null);

  assert("codes are unique", new Set(ALL_CODES.map((c) => c.code)).size === ALL_CODES.length);
  assert("every class has codes", STATUS_CLASSES.every((group) => group.codes.length > 0));
  assert("codes ascend within a class",
    STATUS_CLASSES.every((g) => g.codes.every((c, i) => i === 0 || c.code > g.codes[i - 1].code)));
  assert("every code falls in its class range",
    STATUS_CLASSES.every((g) => g.codes.every((c) => Math.floor(c.code / 100) === Number(g.range[0]))));

  assert("searching by number works", search("404").some((c) => c.code === 404));
  assert("searching by name works", search("teapot").some((c) => c.code === 418));
  assert("searching by meaning works", search("redirect").length > 0);
  assert("an empty search shows the common ones", search("").every((c) => c.common));
  assert("nonsense finds nothing", search("zzzz").length === 0);

  // The pairs that matter must actually carry the explanation.
  assert("301 explains the ranking consequence", findCode(301)?.status.detail?.includes("ranking") === true);
  assert("401 explains it means unauthenticated", findCode(401)?.status.detail?.includes("unauthenticated") === true);
}

/* ========================================================= cooking time */

console.log("\nRoasting");

{
  // Beef, 2kg, medium rare: 2 × 25 + 20 = 70 minutes.
  const beef = cookTime("beef", 2, "medium-rare")!;
  assert(`2kg beef medium rare is 70 min (${beef.minutes})`, beef.minutes === 70);
  assert("with 20 minutes resting", beef.restMinutes === 20);
  assert("totalling 90", beef.totalMinutes === 90);
  assert("at an internal 55°C", beef.internalCelsius === 55);
  assert("a fan oven is 20 lower", beef.fanCelsius === beef.celsius - 20);

  // Doneness must change the time in the right direction.
  const rare = cookTime("beef", 2, "rare")!;
  const well = cookTime("beef", 2, "well-done")!;
  assert("rare is quicker than well done", rare.minutes < well.minutes);
  assert("and cooler inside", rare.internalCelsius! < well.internalCelsius!);

  // Poultry has no doneness — it is cooked or it is unsafe.
  const chicken = cookTime("chicken", 1.8, "rare")!;
  assert("chicken ignores doneness", chicken.internalCelsius === 75);
  assert(`1.8kg chicken is 101 min (${chicken.minutes})`, chicken.minutes === 101);
  assert("chicken offers no doneness options", donenessOptions("chicken").length === 0);
  assert("beef offers five", donenessOptions("beef").length === 5);

  assert("every meat has a safe internal temperature",
    MEATS.every((meat) => Object.values(meat.internal).length > 0));
  assert("poultry is at least 75°C",
    MEATS.filter((m) => ["chicken", "turkey", "duck"].includes(m.id))
      .every((m) => Object.values(m.internal).every((t) => t >= 75)));

  assert("an unknown meat returns nothing", cookTime("unicorn", 2, "medium") === null);
  assert("zero weight returns nothing", cookTime("beef", 0, "medium") === null);
  assert("an absurd weight returns nothing", cookTime("beef", 100, "medium") === null);

  assert("times read naturally", formatMinutes(90) === "1h 30m" && formatMinutes(120) === "2h");
  assert("sub-hour times show minutes", formatMinutes(45) === "45 min");

  // Working backwards to a serving time, including across midnight.
  assert("serving at 13:00 after 90 min means 11:30", startTime(13 * 60, 90) === 11 * 60 + 30);
  assert("crossing midnight wraps", startTime(30, 90) === 23 * 60);
}

/* ========================================================= HTML stripper */

console.log("\nHTML stripper");

{
  const options = { keepStructure: true, decodeEntities: true, tidyWhitespace: true, keepLinks: false };

  assert("tags are removed", stripHtml("<p>Hello</p>", options).text === "Hello");
  assert("entities are decoded", decodeEntities("Tom &amp; Jerry") === "Tom & Jerry");
  assert("numeric entities decode", decodeEntities("&#65;&#66;") === "AB");
  assert("hex entities decode", decodeEntities("&#x41;") === "A");
  assert("unknown entities are left alone", decodeEntities("&zzz;") === "&zzz;");

  // The failure that makes naive strippers useless: block elements removed
  // without a break glue words together.
  const list = stripHtml("<li>One</li><li>Two</li>", options);
  assert(`list items do not run together (${JSON.stringify(list.text)})`, list.text === "One\nTwo");

  const paragraphs = stripHtml("<p>First</p><p>Second</p>", options);
  assert("paragraphs are separated", paragraphs.text.includes("\n"));

  // Script and style contents must not survive as text.
  const withScript = stripHtml("<p>Keep</p><script>var secret = 1;</script>", options);
  assert(`script contents are dropped (${JSON.stringify(withScript.text)})`, !withScript.text.includes("secret"));
  const withStyle = stripHtml("<style>.a{color:red}</style><p>Keep</p>", options);
  assert("style contents are dropped", !withStyle.text.includes("color"));
  assert("but the prose survives", withStyle.text.includes("Keep"));

  assert("comments are dropped", !stripHtml("<!-- hi -->Text", options).text.includes("hi"));
  assert("non-breaking spaces become spaces", !stripHtml("a&nbsp;b", options).text.includes(" "));

  const links = stripHtml('<a href="https://example.com">Example</a>', {
    ...options, keepLinks: true,
  });
  assert("link text is kept", links.text.includes("Example"));
  assert("and numbered", links.text.includes("[1]"));
  assert("with the target recorded", links.links[0]?.href === "https://example.com");

  assert("tags are counted", stripHtml("<p><b>a</b></p>", options).removedTags === 4);
  assert("empty input gives empty output", stripHtml("", options).text === "");
  assert("plain text passes through", stripHtml("Just words", options).text === "Just words");

  // Without structure, everything collapses to one line.
  const flat = stripHtml("<p>One</p><p>Two</p>", { ...options, keepStructure: false });
  assert("structure can be turned off", !flat.text.includes("\n"));

  assert("words are counted", countWords("one two three") === 3);
  assert("empty text counts zero", countWords("   ") === 0);
}

console.log(
  failures === 0
    ? "\nReference tool checks passed."
    : `\n${failures} checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);
