#!/usr/bin/env node
/**
 * Checks the blog.
 *
 * The blog is the part of the site most likely to rot, because posts are added
 * by hand and never revisited. The failure modes are all quiet: a post whose
 * `meta` is registered but whose body never got imported, a slug that does not
 * match its filename, a keyword that competes with a guide or a tool, a draft
 * accidentally left visible.
 *
 * The keyword divide is the one that matters for search. Guides own evergreen
 * comparative queries, tools own specific actionable ones, and a post should
 * own neither — a dated changelog ranking for "png vs jpg" would be a worse
 * answer than the guide written for it.
 *
 *   pnpm check:blog
 */

import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import process from "node:process";

import { guides } from "@/config/guides";
import { categories } from "@/config/categories";
import { toolHref, tools } from "@/config/tools";

let failures = 0;

function assert(label: string, condition: boolean, detail = ""): void {
  if (condition) console.log(`  ok    ${label}`);
  else {
    failures += 1;
    console.error(`  FAIL  ${label}${detail ? ` — ${detail}` : ""}`);
  }
}

/*
 * Posts are read from source rather than imported: `src/posts/index.ts` pulls
 * in `.mdx`, which Node's type stripping cannot parse. Reading the files also
 * catches the thing importing would hide — a post on disk that nothing
 * registers.
 */
const files = readdirSync("src/posts").filter((name) => name.endsWith(".mdx"));
const index = readFileSync("src/posts/index.ts", "utf8");

assert("there is at least one post", files.length > 0);

interface Parsed {
  file: string;
  slug: string;
  title: string;
  date: string;
  keywords: string[];
  tools: string[];
  draft: boolean;
}

const posts: Parsed[] = [];

for (const file of files) {
  const source = readFileSync(`src/posts/${file}`, "utf8");
  const expectedSlug = file.replace(/\.mdx$/, "");

  const value = (key: string): string | null => {
    const match = source.match(new RegExp(`${key}:\\s*"([^"]*)"`));
    return match ? match[1] : null;
  };
  const list = (key: string): string[] => {
    const match = source.match(new RegExp(`${key}:\\s*\\[([^\\]]*)\\]`, "s"));
    return match ? [...match[1].matchAll(/"([^"]*)"/g)].map((m) => m[1]) : [];
  };

  assert(`${file} exports a meta block`, source.includes("export const meta"));

  const slug = value("slug");
  assert(`${file} declares a slug`, Boolean(slug));
  assert(
    `${file} slug matches its filename`,
    slug === expectedSlug,
    `slug "${slug}" vs file "${expectedSlug}"`,
  );

  const title = value("title") ?? "";
  const summary = value("summary") ?? "";
  const date = value("date") ?? "";

  assert(`${file} has a title`, title.length > 10);
  assert(
    `${file} has a usable summary (${summary.length} chars)`,
    summary.length > 50 && summary.length <= 250,
  );
  assert(`${file} has a valid date`, !Number.isNaN(Date.parse(date)));
  assert(`${file} is not dated in the future`, Date.parse(date) <= Date.now() + 86_400_000);

  // TypeScript syntax in an .mdx file fails at build time with an acorn parse
  // error that does not name the cause, so it is worth catching here.
  // Anchored to statements rather than words: a post may perfectly well
  // mention `satisfies` in its prose, and the file comment explaining this
  // rule contains both terms.
  assert(
    `${file} uses no TypeScript syntax in its exports`,
    !/^import type\b/m.test(source) && !/^\s*\}\s*satisfies\b/m.test(source),
  );

  const registered = index.includes(`"./${file}"`) || index.includes(`from "./${expectedSlug}.mdx"`);
  assert(`${file} is imported by the index`, registered);

  posts.push({
    file,
    slug: slug ?? expectedSlug,
    title,
    date,
    keywords: list("keywords"),
    tools: list("tools"),
    draft: /draft:\s*true/.test(source),
  });
}

/* ------------------------------------------------------------ uniqueness */

const slugs = posts.map((post) => post.slug);
assert("post slugs are unique", new Set(slugs).size === slugs.length);

const titles = posts.map((post) => post.title.toLowerCase());
assert("post titles are unique", new Set(titles).size === titles.length);

/* ------------------------------------------------------ tools referenced */

const toolSlugs = new Set(tools.filter((tool) => tool.status === "live").map((tool) => tool.slug));
for (const post of posts) {
  const missing = post.tools.filter((slug) => !toolSlugs.has(slug));
  assert(
    `${post.slug} references only live tools`,
    missing.length === 0,
    `unknown: ${missing.join(", ")}`,
  );
}

/* --------------------------------------------- posts must not fight guides */

const owned = new Map<string, string>();
for (const tool of tools) {
  for (const keyword of tool.keywords) owned.set(keyword.toLowerCase(), `tool ${tool.slug}`);
}
for (const guide of guides) {
  for (const keyword of guide.keywords) owned.set(keyword.toLowerCase(), `guide ${guide.slug}`);
}

const collisions: string[] = [];
for (const post of posts) {
  for (const keyword of post.keywords) {
    const holder = owned.get(keyword.toLowerCase());
    if (holder) collisions.push(`"${keyword}" — post ${post.slug} vs ${holder}`);
  }
}
assert(
  "no post targets a keyword a tool or guide already owns",
  collisions.length === 0,
  collisions.join("; "),
);

/* ------------------------------------- every link in a post resolves */

/**
 * Markdown links inside posts, validated against the registry.
 *
 * The same gap as the guides had: a post's `tools` array is checked, but the
 * links inside the writing are typed from memory. A 404 mid-paragraph is
 * invisible until a reader clicks it.
 */
const routes = new Set<string>([
  "/",
  "/tools",
  "/guides",
  "/blog",
  "/about",
  "/contact",
  "/privacy",
  "/terms",
  ...categories.map((category) => `/${category.slug}`),
  ...tools.map((tool) => toolHref(tool)),
  ...guides.map((guide) => `/guides/${guide.slug}`),
  ...posts.map((post) => `/blog/${post.slug}`),
]);

let linkCount = 0;
const broken: string[] = [];

for (const file of files) {
  const source = readFileSync(`src/posts/${file}`, "utf8");
  const hrefs = [
    ...[...source.matchAll(/\]\((\/[^)#?]*)\)/g)].map((match) => match[1]),
    ...[...source.matchAll(/href="(\/[^"#?]*)"/g)].map((match) => match[1]),
  ];
  for (const href of hrefs) {
    linkCount += 1;
    if (!routes.has(href)) broken.push(`${href} in ${file}`);
  }
}

assert(
  `every internal link in the posts resolves (${linkCount} links)`,
  broken.length === 0,
  broken.join("; "),
);

/* ------------------------------------------------------------- plumbing */

for (const path of [
  "src/mdx-components.tsx",
  "src/types/mdx.d.ts",
  "src/app/blog/page.tsx",
  "src/app/blog/[slug]/page.tsx",
  "src/app/blog/rss.xml/route.ts",
]) {
  assert(`${path} exists`, existsSync(path));
}

const config = readFileSync("next.config.ts", "utf8");
assert("next.config registers mdx as a page extension", /pageExtensions[^;]*mdx/s.test(config));
assert("next.config wraps the config with createMDX", config.includes("withMDX("));

// Prose in a client component would ship the whole post as JavaScript.
const clientPosts = execSync(`grep -rl '"use client"' src/posts src/app/blog || true`, {
  encoding: "utf8",
}).split("\n").filter(Boolean);
assert("no post or blog route is a client component", clientPosts.length === 0, clientPosts.join(", "));

const visible = posts.filter((post) => !post.draft);
console.log(
  failures === 0
    ? `\nBlog checks passed — ${visible.length} published post${visible.length === 1 ? "" : "s"}, ${posts.length - visible.length} draft(s), no keyword collisions.`
    : `\n${failures} blog checks FAILED.`,
);

process.exit(failures === 0 ? 0 : 1);
