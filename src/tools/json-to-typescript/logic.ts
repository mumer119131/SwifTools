/**
 * Infers TypeScript interfaces from a JSON sample.
 *
 * Everything here is inference from one example, which has limits worth being
 * honest about in the UI: a field that happens to be null in the sample could
 * be a string in every other record, and an empty array says nothing about what
 * it holds. The generator marks those cases rather than guessing quietly.
 */

export interface Options {
  rootName: string;
  /** Emit `interface` declarations, or a single nested `type`. */
  style: "interface" | "type";
  /** Mark every property optional, for API responses with inconsistent fields. */
  allOptional: boolean;
  /** Prefer `readonly` properties. */
  readonly: boolean;
}

type Shape =
  | { kind: "primitive"; name: string }
  | { kind: "array"; of: Shape }
  | { kind: "object"; fields: Map<string, Shape>; optional: Set<string> }
  | { kind: "union"; of: Shape[] };

function shapeOf(value: unknown): Shape {
  if (value === null) return { kind: "primitive", name: "null" };
  if (Array.isArray(value)) {
    if (value.length === 0) return { kind: "array", of: { kind: "primitive", name: "unknown" } };
    return { kind: "array", of: value.map(shapeOf).reduce(merge) };
  }
  if (typeof value === "object") {
    const fields = new Map<string, Shape>();
    for (const [key, item] of Object.entries(value as Record<string, unknown>)) {
      fields.set(key, shapeOf(item));
    }
    return { kind: "object", fields, optional: new Set() };
  }
  return { kind: "primitive", name: typeof value };
}

/**
 * Combines two shapes seen at the same position.
 *
 * Across an array of records this is what turns twenty samples into one
 * accurate type: a key present in some elements and missing from others becomes
 * optional rather than required, which is the difference between a type that
 * compiles against real data and one that lies.
 */
function merge(a: Shape, b: Shape): Shape {
  if (a.kind === "primitive" && b.kind === "primitive") {
    if (a.name === b.name) return a;
    // A value that is sometimes null is nullable, not a union with a junk member.
    if (a.name === "null") return { kind: "union", of: [b, a] };
    if (b.name === "null") return { kind: "union", of: [a, b] };
    return { kind: "union", of: [a, b] };
  }

  if (a.kind === "array" && b.kind === "array") {
    return { kind: "array", of: merge(a.of, b.of) };
  }

  if (a.kind === "object" && b.kind === "object") {
    const fields = new Map(a.fields);
    const optional = new Set([...a.optional, ...b.optional]);

    for (const [key, shape] of b.fields) {
      const existing = fields.get(key);
      fields.set(key, existing ? merge(existing, shape) : shape);
      // Present here, absent there.
      if (!a.fields.has(key)) optional.add(key);
    }
    for (const key of a.fields.keys()) {
      if (!b.fields.has(key)) optional.add(key);
    }

    return { kind: "object", fields, optional };
  }

  const members = [...(a.kind === "union" ? a.of : [a]), ...(b.kind === "union" ? b.of : [b])];
  const seen = new Map<string, Shape>();
  for (const member of members) seen.set(render(member, () => "", 0), member);
  const unique = [...seen.values()];
  return unique.length === 1 ? unique[0] : { kind: "union", of: unique };
}

/** A valid TypeScript identifier, or a quoted key when it cannot be one. */
function propertyName(key: string): string {
  return /^[A-Za-z_$][A-Za-z0-9_$]*$/.test(key) ? key : JSON.stringify(key);
}

function pascal(name: string): string {
  const cleaned = name.replace(/[^A-Za-z0-9]+(.)?/g, (_, c: string | undefined) =>
    c ? c.toUpperCase() : "",
  );
  const head = cleaned.charAt(0).toUpperCase() + cleaned.slice(1);
  return /^[A-Za-z_$]/.test(head) ? head || "Root" : `Type${head}`;
}

/** Singularises a plural key, so `users: User[]` rather than `users: Users[]`. */
function singular(name: string): string {
  if (/ies$/i.test(name)) return `${name.slice(0, -3)}y`;
  if (/(s|ch|sh|x|z)es$/i.test(name)) return name.slice(0, -2);
  if (/[^s]s$/i.test(name)) return name.slice(0, -1);
  return name;
}

function render(shape: Shape, declare: (name: string, body: string) => string, depth: number, hint = "Item"): string {
  switch (shape.kind) {
    case "primitive":
      return shape.name === "object" ? "Record<string, unknown>" : shape.name;

    case "array":
      return `${wrap(render(shape.of, declare, depth, singular(hint)))}[]`;

    case "union":
      return shape.of.map((member) => render(member, declare, depth, hint)).join(" | ");

    case "object": {
      const lines: string[] = [];
      for (const [key, field] of shape.fields) {
        const optional = shape.optional.has(key) ? "?" : "";
        lines.push(`  ${propertyName(key)}${optional}: ${render(field, declare, depth + 1, pascal(key))};`);
      }
      const body = lines.length > 0 ? `{\n${lines.join("\n")}\n}` : "Record<string, never>";
      return declare(pascal(hint), body);
    }
  }
}

/** Parenthesises a union used as an array element, so `(A | B)[]` not `A | B[]`. */
function wrap(rendered: string): string {
  return rendered.includes(" | ") ? `(${rendered})` : rendered;
}

export interface Generated {
  code: string;
  /** Places where one sample could not determine the type. */
  warnings: string[];
}

export function generate(json: string, options: Options): Generated | { error: string } {
  let value: unknown;
  try {
    value = JSON.parse(json);
  } catch (cause) {
    return { error: cause instanceof Error ? cause.message : "That is not valid JSON." };
  }

  let shape = shapeOf(value);

  // A top-level array of records describes one record type, not an array type.
  let rootIsArray = false;
  if (shape.kind === "array" && Array.isArray(value) && value.length > 0) {
    rootIsArray = true;
    shape = shape.of;
  }

  const warnings: string[] = [];
  collectWarnings(shape, options.rootName, warnings);

  const declarations: string[] = [];
  const used = new Set<string>();

  function declare(name: string, body: string): string {
    if (options.style === "type") return body;

    // Two different shapes wanting the same name must not collide silently.
    let unique = name;
    let n = 2;
    while (used.has(unique) && !declarations.some((d) => d.includes(`${unique} ${body}`))) {
      unique = `${name}${n}`;
      n += 1;
    }
    used.add(unique);

    const modifier = options.readonly ? "readonly " : "";
    const withModifiers = body
      .replace(/^ {2}(\S)/gm, (_, c: string) => `  ${modifier}${c}`)
      .replace(/^( {2}(?:readonly )?[^:]+?)\?:/gm, "$1?:");

    const finalBody = options.allOptional
      ? withModifiers.replace(/^( {2}(?:readonly )?(?:[A-Za-z0-9_$]+|"[^"]*"))(\??):/gm, "$1?:")
      : withModifiers;

    declarations.push(`export interface ${unique} ${finalBody}`);
    return unique;
  }

  const rootName = pascal(options.rootName || "Root");
  const rendered = render(shape, declare, 0, rootName);

  if (options.style === "type") {
    const body = options.allOptional
      ? rendered.replace(/^( {2}(?:[A-Za-z0-9_$]+|"[^"]*"))(\??):/gm, "$1?:")
      : rendered;
    return {
      code: `export type ${rootName} = ${rootIsArray ? `${wrap(body)}[]` : body};\n`,
      warnings,
    };
  }

  // Declarations come out innermost-first; reversing puts the root at the top,
  // which is where anyone reading the output looks.
  const code = declarations.reverse().join("\n\n");
  const suffix = rootIsArray ? `\n\nexport type ${rootName}List = ${rendered}[];\n` : "\n";

  return { code: `${code}${suffix}`, warnings };
}

function collectWarnings(shape: Shape, path: string, out: string[]): void {
  if (shape.kind === "primitive" && shape.name === "null") {
    out.push(`\`${path}\` is null in this sample, so its real type cannot be known. It is typed \`null\` — widen it by hand.`);
  } else if (shape.kind === "primitive" && shape.name === "unknown") {
    out.push(`\`${path}\` is an empty array here, so the element type is \`unknown\`.`);
  } else if (shape.kind === "array") {
    collectWarnings(shape.of, `${path}[]`, out);
  } else if (shape.kind === "object") {
    for (const [key, field] of shape.fields) collectWarnings(field, `${path}.${key}`, out);
  } else if (shape.kind === "union") {
    for (const member of shape.of) collectWarnings(member, path, out);
  }
}
