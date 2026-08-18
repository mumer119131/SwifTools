#!/usr/bin/env node
/**
 * Guards the split between the tool registry and the tool prose.
 *
 * `src/config/tools.ts` is imported by client components, so anything on a
 * `Tool` ships to every visitor on every page. The long-form copy — notes, FAQ
 * and steps, about 26,000 words — used to live there, which put 440KB of text
 * into the client bundle that had already been rendered into the HTML and was
 * never read by any script. Moving it to `@/config/tool-content` cut first-load
 * JS from 401KB to 265KB.
 *
 * That saving quietly disappears the moment someone adds `notes` back to a meta
 * file, or imports the content module from a client component. Neither shows up
 * as a broken page, so both are asserted here.
 *
 *   pnpm check:content
 */

import { execSync } from "node:child_process";
import process from "node:process";

import { tools } from "@/config/tools";
import { contentBySlug, getToolContent } from "@/config/tool-content";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

const live = tools.filter((tool) => tool.status === "live");

/* ------------------------------------------------ the registry stays lean */

// The fields are gone from the type, so this catches an object that carries
// them anyway — a meta file written against a stale example, say.
const PROSE_FIELDS = ["notes", "faq", "steps"];
const carrying = tools.filter((tool) =>
  PROSE_FIELDS.some((field) => field in (tool as unknown as Record<string, unknown>)),
);
assert(
  "no registry entry carries prose",
  carrying.length === 0,
  carrying.map((tool) => tool.slug).join(", "),
);

/* ---------------------------------------------------- the content is there */

const missing = live.filter((tool) => {
  const content = getToolContent(tool.slug);
  return !content.steps?.length && !content.notes?.length && !content.faq?.length;
});
assert(
  "every live tool has content",
  missing.length === 0,
  `${missing.length}: ${missing.slice(0, 8).map((t) => t.slug).join(", ")}`,
);

const slugs = new Set(tools.map((tool) => tool.slug));
const orphaned = Object.keys(contentBySlug).filter((slug) => !slugs.has(slug));
assert(
  "no content belongs to a tool that no longer exists",
  orphaned.length === 0,
  orphaned.join(", "),
);

// Every tool page renders "How it works" from steps and emits HowTo JSON-LD, so
// a tool without them silently loses a structured-data block.
const noSteps = live.filter((tool) => !getToolContent(tool.slug).steps?.length);
assert(
  "every live tool has steps for its HowTo markup",
  noSteps.length === 0,
  `${noSteps.length}: ${noSteps.slice(0, 8).map((t) => t.slug).join(", ")}`,
);

/* ------------------------------------- nothing on the client may import it */

// The whole saving rests on this. A single client component importing the
// content barrel pulls all 440KB back into the browser bundle.
const clientFiles = execSync(
  `grep -rl '"use client"' src --include='*.tsx' --include='*.ts' || true`,
  { encoding: "utf8" },
)
  .split("\n")
  .filter(Boolean);

const offenders = clientFiles.filter((file) => {
  const source = execSync(`cat ${JSON.stringify(file)}`, { encoding: "utf8" });
  return /from ["']@\/config\/tool-content["']/.test(source);
});

assert(
  `no client component imports the content module (${clientFiles.length} client files checked)`,
  offenders.length === 0,
  offenders.join(", "),
);

// The same applies transitively through the tool bodies, which are the biggest
// client graph on the site.
const toolBodies = execSync(
  `grep -rl 'config/tool-content' src/tools --include='Tool.tsx' || true`,
  { encoding: "utf8" },
).split("\n").filter(Boolean);
assert("no tool body imports the content module", toolBodies.length === 0, toolBodies.join(", "));

/* --------------------------------------------------------- sanity on size */

let words = 0;
for (const content of Object.values(contentBySlug)) {
  const text = [
    ...(content.notes ?? []),
    ...(content.steps ?? []),
    ...(content.faq ?? []).flatMap((entry) => [entry.question, entry.answer]),
  ].join(" ");
  words += text.split(/\s+/).filter(Boolean).length;
}
assert(
  `the content module holds the prose (${words.toLocaleString()} words across ${Object.keys(contentBySlug).length} tools)`,
  words > 20_000,
);

console.log(
  failures === 0
    ? "\nContent split checks passed — prose is server-side only."
    : `\n${failures} content split checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);
