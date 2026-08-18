import { parse as parseYaml, stringify as stringifyYaml } from "yaml";

export type Direction = "yaml-to-json" | "json-to-yaml";

export interface Converted {
  output: string;
  /** Things that survived the trip but changed shape, worth saying out loud. */
  notes: string[];
}

/**
 * Converts between YAML and JSON.
 *
 * The two are not quite interchangeable, and the notes returned here name the
 * places they part company rather than letting a conversion look lossless when
 * it was not: YAML dates become strings in JSON, comments are dropped in both
 * directions, and anchors are expanded.
 */
export function convert(
  input: string,
  direction: Direction,
  indent: number,
): Converted | { error: string } {
  if (input.trim() === "") return { output: "", notes: [] };

  try {
    if (direction === "yaml-to-json") {
      const notes: string[] = [];
      if (/^\s*#|\s#\s/m.test(input)) notes.push("Comments are dropped — JSON has no syntax for them.");
      if (/(^|\s)[&*][A-Za-z0-9_-]+/.test(input)) {
        notes.push("Anchors and aliases are expanded into full copies, since JSON cannot reference a value defined elsewhere.");
      }
      if (/^---/m.test(input.trim().slice(3))) {
        notes.push("This looks like a multi-document YAML file. Only the first document is converted — JSON has no equivalent of the `---` separator.");
      }

      const value = parseYaml(input);
      if (value === undefined) return { output: "", notes };
      return { output: JSON.stringify(value, null, indent), notes };
    }

    const value = JSON.parse(input) as unknown;
    return {
      output: stringifyYaml(value, { indent: Math.max(1, indent) }),
      notes: [],
    };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    return { error: message.split("\n")[0] };
  }
}
