#!/usr/bin/env node
/**
 * `pnpm new:tool` — scaffolds a tool folder and wires it into the registry.
 *
 * Adding a tool is meant to cost one folder and one registry entry. This does
 * both, plus the lazy-import line, so the only thing left to write is the
 * actual logic.
 *
 *   pnpm new:tool --slug compress-svg --name "Compress SVG" --category image \
 *     --description "Strip bloat from SVG files." --icon Shrink
 *
 * Run with no flags for an interactive prompt.
 */

import { existsSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createInterface } from "node:readline/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import process from "node:process";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const TOOLS_DIR = join(ROOT, "src", "tools");
const REGISTRY = join(ROOT, "src", "config", "tools.ts");
const LOADERS = join(ROOT, "src", "tools", "loaders.tsx");

const CATEGORIES = [
  "pdf",
  "image",
  "text",
  "developer",
  "converter",
  "calculator",
  "seo",
  "generator",
] as const;

type Category = (typeof CATEGORIES)[number];

interface Answers {
  slug: string;
  name: string;
  category: Category;
  description: string;
  icon: string;
}

/* ----------------------------------------------------------------- helpers */

function parseFlags(argv: string[]): Partial<Record<string, string>> {
  const flags: Record<string, string> = {};
  for (let i = 0; i < argv.length; i += 1) {
    if (!argv[i].startsWith("--")) continue;
    const key = argv[i].slice(2);
    const value = argv[i + 1];
    if (value && !value.startsWith("--")) {
      flags[key] = value;
      i += 1;
    }
  }
  return flags;
}

const toKebab = (value: string) =>
  value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");

/** "compress-svg" -> "compressSvg", used for the exported meta binding. */
const toCamel = (slug: string) =>
  slug.replace(/-([a-z0-9])/g, (_, character: string) => character.toUpperCase());

/** "compress-svg" -> "CompressSvg", used for the component name. */
const toPascal = (slug: string) => {
  const camel = toCamel(slug);
  return camel.charAt(0).toUpperCase() + camel.slice(1);
};

function fail(message: string): never {
  console.error(`\n  ✗ ${message}\n`);
  process.exit(1);
}

/* ------------------------------------------------------------------ inputs */

async function collectAnswers(): Promise<Answers> {
  const flags = parseFlags(process.argv.slice(2));

  const needsPrompt = !flags.slug || !flags.name || !flags.category;
  let answers = flags;

  if (needsPrompt) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    try {
      const name = flags.name ?? (await rl.question("  Tool name (e.g. Compress SVG): "));
      const slugAnswer = flags.slug ?? (await rl.question(`  Slug [${toKebab(name)}]: `));
      const slug = slugAnswer || toKebab(name);
      const category =
        flags.category ?? (await rl.question(`  Category (${CATEGORIES.join(" | ")}): `));
      const description = flags.description ?? (await rl.question("  One-line description: "));
      const iconAnswer = flags.icon ?? (await rl.question("  Lucide icon name [Wrench]: "));
      const icon = iconAnswer || "Wrench";
      answers = { name, slug, category, description, icon };
    } finally {
      rl.close();
    }
  }

  const slug = toKebab(answers.slug ?? "");
  const name = (answers.name ?? "").trim();
  const category = (answers.category ?? "").trim() as Category;
  const description = (answers.description ?? "").trim() || `${name} — a free online tool.`;
  const icon = (answers.icon ?? "Wrench").trim();

  if (!slug) fail("A slug is required.");
  if (!name) fail("A name is required.");
  if (!CATEGORIES.includes(category)) {
    fail(`Category must be one of: ${CATEGORIES.join(", ")}`);
  }
  if (!/^[A-Z][A-Za-z0-9]*$/.test(icon)) {
    fail(`"${icon}" is not a valid lucide-react export name (PascalCase, e.g. Shrink).`);
  }

  return { slug, name, category, description, icon };
}

/* ---------------------------------------------------------------- template */

const metaTemplate = ({ slug, name, category, description, icon }: Answers) => `import { ${icon} } from "lucide-react";

import type { Tool } from "@/config/tools";

export const ${toCamel(slug)}: Tool = {
  slug: "${slug}",
  name: "${name}",
  category: "${category}",
  description: "${description.replace(/"/g, '\\"')}",
  keywords: [
    "${name.toLowerCase()}",
    "${name.toLowerCase()} online",
    "free ${name.toLowerCase()}",
  ],
  icon: ${icon},
  // Client wherever the work can happen in-browser — see §4.4 of the brief.
  processing: "client",
  status: "live",
  steps: [
    "TODO: describe step one.",
    "TODO: describe step two.",
    "TODO: describe step three.",
  ],
};
`;

const logicTemplate = ({ name }: Answers) => `/**
 * Pure processing functions for ${name}.
 *
 * Keep everything here free of React and DOM-layout concerns so it stays
 * unit-testable and can be moved into a Web Worker without changes.
 */

export interface ${"Result"} {
  // TODO: describe the shape of the result.
  placeholder: string;
}

export function process(input: string): ${"Result"} {
  // TODO: implement.
  return { placeholder: input };
}
`;

const toolTemplate = (answers: Answers) => `"use client";

import * as React from "react";
import { ${answers.icon} } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { CopyButton } from "@/components/shared/CopyButton";
import { process } from "./logic";

export default function ${toPascal(answers.slug)}Tool() {
  const [input, setInput] = React.useState("");

  const result = React.useMemo(() => process(input), [input]);

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="${answers.slug}-input">Input</Label>
          <Button variant="ghost" size="sm" onClick={() => setInput("")} disabled={!input}>
            Clear
          </Button>
        </div>
        <Textarea
          id="${answers.slug}-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder="TODO: replace this scaffold with the real tool."
          className="min-h-40"
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="${answers.slug}-output">Output</Label>
          <CopyButton value={result.placeholder} label="Copy" />
        </div>
        <Textarea
          id="${answers.slug}-output"
          value={result.placeholder}
          readOnly
          className="min-h-40 bg-surface-hover"
        />
      </div>

      <Button size="lg" disabled={!input}>
        <${answers.icon} strokeWidth={1.75} />
        Run
      </Button>
    </div>
  );
}
`;

/* ------------------------------------------------------------------ wiring */

/** Adds the meta import and the registry entry, keeping imports alphabetical. */
async function wireRegistry(answers: Answers): Promise<void> {
  let source = await readFile(REGISTRY, "utf8");
  const binding = toCamel(answers.slug);

  if (source.includes(`@/tools/${answers.slug}/meta`)) {
    console.log(`  · ${answers.slug} is already in the registry — skipping.`);
    return;
  }

  const importLine = `import { ${binding} } from "@/tools/${answers.slug}/meta";`;
  const imports = [...source.matchAll(/^import \{ \w+ } from "@\/tools\/[\w-]+\/meta";$/gm)];

  if (imports.length === 0) fail("Could not find the tool imports block in tools.ts.");

  const lastImport = imports.at(-1)!;
  const insertAt = lastImport.index! + lastImport[0].length;
  source = `${source.slice(0, insertAt)}\n${importLine}${source.slice(insertAt)}`;

  // Append to the liveTools array, just before its closing bracket.
  const liveToolsMatch = source.match(/const liveTools: readonly Tool\[] = \[[\s\S]*?\n\];/);
  if (!liveToolsMatch) fail("Could not find the liveTools array in tools.ts.");

  const block = liveToolsMatch[0];
  source = source.replace(block, block.replace(/\n\];$/, `\n  ${binding},\n];`));

  await writeFile(REGISTRY, source, "utf8");
}

/** Adds the lazy import so the tool page can load the implementation. */
async function wireLoaders(answers: Answers): Promise<void> {
  let source = await readFile(LOADERS, "utf8");

  if (source.includes(`"${answers.slug}": lazyTool`)) {
    console.log(`  · ${answers.slug} is already wired into the loaders — skipping.`);
    return;
  }

  const entry = `  "${answers.slug}": lazyTool(() => import("@/tools/${answers.slug}/Tool")),`;
  const registryMatch = source.match(
    /const registry: Record<string, React\.ComponentType> = \{[\s\S]*?\n\};/,
  );
  if (!registryMatch) fail("Could not find the registry map in loaders.tsx.");

  const block = registryMatch[0];
  source = source.replace(block, block.replace(/\n\};$/, `\n${entry}\n};`));

  await writeFile(LOADERS, source, "utf8");
}

/* -------------------------------------------------------------------- main */

async function main(): Promise<void> {
  const answers = await collectAnswers();
  const folder = join(TOOLS_DIR, answers.slug);

  if (existsSync(folder)) fail(`src/tools/${answers.slug}/ already exists.`);

  await mkdir(folder, { recursive: true });
  await Promise.all([
    writeFile(join(folder, "meta.ts"), metaTemplate(answers), "utf8"),
    writeFile(join(folder, "logic.ts"), logicTemplate(answers), "utf8"),
    writeFile(join(folder, "Tool.tsx"), toolTemplate(answers), "utf8"),
  ]);

  await wireRegistry(answers);
  await wireLoaders(answers);

  console.log(`
  ✓ Created ${answers.name}

    src/tools/${answers.slug}/meta.ts     registry entry
    src/tools/${answers.slug}/logic.ts    pure functions
    src/tools/${answers.slug}/Tool.tsx    the UI

    Registered in src/config/tools.ts and src/tools/loaders.tsx.

  Next:
    1. Fill in the keywords and steps in meta.ts (steps become HowTo JSON-LD).
    2. Write the real logic in logic.ts.
    3. Build the UI in Tool.tsx from the shared components.
    4. Visit /${answers.category}/${answers.slug}
`);
}

main().catch((error: unknown) => {
  fail(error instanceof Error ? error.message : String(error));
});
