#!/usr/bin/env node
/**
 * Checks the Markdown to Medium warnings.
 *
 * The warnings are the tool's whole value — anyone can render Markdown, but
 * telling someone their tables will not survive is the part that saves the
 * trip. So the risk is a warning that fires on something harmless, because a
 * list nobody trusts is worse than no list.
 *
 * The load-bearing case is fenced code: a fence may legitimately contain a
 * table, a heading or an HTML tag as its subject matter, and warning about
 * those would be wrong every time.
 *
 *   pnpm check:markdown-medium
 */
import process from "node:process";

import { analyze, countWords, findWarnings, readMinutes } from "@/tools/markdown-to-medium/logic";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const ids = (markdown: string) => findWarnings(markdown).map((warning) => warning.id);
const count = (markdown: string, id: string) =>
  findWarnings(markdown).find((warning) => warning.id === id)?.count ?? 0;

/* --------------------------------------------------------- each warning */

console.log("\nWhat Medium will not keep");
assert("a table is flagged", ids("| a | b |\n|---|---|\n| 1 | 2 |").includes("tables"));
assert("an image is flagged", ids("![alt](https://example.com/a.png)").includes("images"));
assert("a nested list item is flagged", ids("- one\n  - nested").includes("nested-lists"));
assert("a footnote is flagged", ids("Text[^1]\n\n[^1]: note").includes("footnotes"));
assert("an H3 is flagged", ids("### Deep").includes("deep-headings"));
assert("raw HTML is flagged", ids('<div class="x">y</div>').includes("raw-html"));

/* ------------------------------------------------ and what it does keep */

console.log("\nSupported Markdown raises nothing");
const clean = `# Title

Prose with **bold**, *italic*, \`code\` and a [link](https://example.com).

## Section

> A quote

- one
- two

1. first
2. second
`;
assert("a clean document has no warnings", findWarnings(clean).length === 0, ids(clean).join(", "));
assert("H1 and H2 are fine", findWarnings("# One\n\n## Two").length === 0);
assert("emphasis and links are fine", findWarnings("**b** *i* [l](https://x.com)").length === 0);
// These are the tags Medium does preserve, so flagging them would be noise.
assert("basic inline tags are not flagged", findWarnings("<strong>a</strong> <em>b</em>").length === 0);

/* ------------------------------------------- fenced code is not content */

console.log("\nFenced code is subject matter, not markup");
const fenced = "```md\n| a | b |\n### heading\n<div>x</div>\n```\n";
assert("a table inside a fence is not flagged", !ids(fenced).includes("tables"), ids(fenced).join(", "));
assert("a heading inside a fence is not flagged", !ids(fenced).includes("deep-headings"));
assert("HTML inside a fence is not flagged", !ids(fenced).includes("raw-html"));
assert(
  "a real table outside a fence is still caught alongside one inside",
  count(`${fenced}\n| x | y |\n|---|---|\n`, "tables") === 2,
  String(count(`${fenced}\n| x | y |\n|---|---|\n`, "tables")),
);

/* --------------------------------------------------------- counting */

console.log("\nWord count and read time");
assert("words are counted", countWords("one two three") === 3, String(countWords("one two three")));
// "see [the docs](url)" is three words once the URL is dropped: see, the, docs.
assert(
  "a link's URL is not counted as words",
  countWords("see [the docs](https://example.com/a/b/c)") === 3,
  String(countWords("see [the docs](https://example.com/a/b/c)")),
);
assert(
  "code inside a fence is not counted as prose",
  countWords("hello\n\n```\nconst a = 1; const b = 2;\n```\n") === 1,
  String(countWords("hello\n\n```\nconst a = 1; const b = 2;\n```\n")),
);
assert("read time is never zero", readMinutes(1) === 1);
assert("read time scales", readMinutes(2650) === 10, String(readMinutes(2650)));

console.log("\nEmpty input");
const empty = analyze("");
assert("empty markdown is safe", empty.words === 0 && empty.warnings.length === 0);
assert("empty markdown still reports a minute", empty.readMinutes === 1);

console.log(
  failures === 0
    ? "\nMarkdown-to-Medium checks passed."
    : `\n${failures} Markdown-to-Medium checks FAILED.`,
);
process.exit(failures === 0 ? 0 : 1);
