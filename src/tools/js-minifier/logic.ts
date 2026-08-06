export {
  defaultMinifyJsOptions,
  minifyJs,
  type MinifyJsOptions,
} from "@/lib/code-format";

export const SAMPLE = `/*! my-lib v1.0.0 | MIT */
export function greet(name) {
  const greeting = "Hello";
  const unused = "this is never referenced";
  console.debug("about to greet", name);

  if (false) {
    return "unreachable";
  }

  return \`\${greeting}, \${name}!\`;
}
`;
