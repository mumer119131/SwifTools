export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface TreeNode {
  /** Dot/bracket path from the root, e.g. `data.users[0].name`. */
  path: string;
  key: string;
  value: JsonValue;
  kind: "object" | "array" | "string" | "number" | "boolean" | "null";
  depth: number;
  /** Child count for containers; undefined for leaves. */
  size?: number;
  children?: TreeNode[];
}

export function kindOf(value: JsonValue): TreeNode["kind"] {
  if (value === null) return "null";
  if (Array.isArray(value)) return "array";
  return typeof value as TreeNode["kind"];
}

/**
 * Builds the tree in one pass, carrying each node's path with it.
 *
 * Paths use bracket notation for array indices and for keys that aren't valid
 * identifiers, so a copied path is always something you can paste straight into
 * code — `data["odd key"][0]` rather than a dotted string that would not parse.
 */
export function buildTree(value: JsonValue, key = "$", path = "$", depth = 0): TreeNode {
  const kind = kindOf(value);

  if (kind === "object") {
    const entries = Object.entries(value as Record<string, JsonValue>);
    return {
      path,
      key,
      value,
      kind,
      depth,
      size: entries.length,
      children: entries.map(([childKey, childValue]) =>
        buildTree(childValue, childKey, `${path}${accessorFor(childKey)}`, depth + 1),
      ),
    };
  }

  if (kind === "array") {
    const items = value as JsonValue[];
    return {
      path,
      key,
      value,
      kind,
      depth,
      size: items.length,
      children: items.map((item, index) =>
        buildTree(item, String(index), `${path}[${index}]`, depth + 1),
      ),
    };
  }

  return { path, key, value, kind, depth };
}

const IDENTIFIER = /^[A-Za-z_$][A-Za-z0-9_$]*$/;

function accessorFor(key: string): string {
  return IDENTIFIER.test(key) ? `.${key}` : `[${JSON.stringify(key)}]`;
}

/** A one-line summary of a node, shown when it is collapsed. */
export function preview(node: TreeNode): string {
  if (node.kind === "array") return `[ ${node.size} ${node.size === 1 ? "item" : "items"} ]`;
  if (node.kind === "object") return `{ ${node.size} ${node.size === 1 ? "key" : "keys"} }`;
  if (node.kind === "string") {
    const text = node.value as string;
    return text.length > 60 ? `"${text.slice(0, 60)}…"` : `"${text}"`;
  }
  return String(node.value);
}

/**
 * Collects the paths of every node matching `query`, plus all their ancestors
 * so the matches are reachable when the tree is filtered.
 */
export function findMatches(root: TreeNode, query: string): Set<string> {
  const needle = query.trim().toLowerCase();
  const paths = new Set<string>();
  if (!needle) return paths;

  const walk = (node: TreeNode, ancestors: string[]): void => {
    const inKey = node.key.toLowerCase().includes(needle);
    const inValue =
      node.children === undefined && String(node.value).toLowerCase().includes(needle);

    if (inKey || inValue) {
      paths.add(node.path);
      for (const ancestor of ancestors) paths.add(ancestor);
    }

    for (const child of node.children ?? []) walk(child, [...ancestors, node.path]);
  };

  walk(root, []);
  return paths;
}

/** Every container path, for "expand all". */
export function allContainerPaths(root: TreeNode): string[] {
  const paths: string[] = [];
  const walk = (node: TreeNode) => {
    if (node.children) {
      paths.push(node.path);
      for (const child of node.children) walk(child);
    }
  };
  walk(root);
  return paths;
}

export interface TreeStats {
  nodes: number;
  maxDepth: number;
  objects: number;
  arrays: number;
}

export function statsFor(root: TreeNode): TreeStats {
  const stats: TreeStats = { nodes: 0, maxDepth: 0, objects: 0, arrays: 0 };

  const walk = (node: TreeNode) => {
    stats.nodes += 1;
    stats.maxDepth = Math.max(stats.maxDepth, node.depth);
    if (node.kind === "object") stats.objects += 1;
    if (node.kind === "array") stats.arrays += 1;
    for (const child of node.children ?? []) walk(child);
  };

  walk(root);
  return stats;
}
