export { defaultFormatOptions, formatCode, type FormatOptions } from "@/lib/code-format";

export type JsParser = "babel" | "typescript";

export const SAMPLE = `const tools=[{slug:"js-formatter",live:!0},{slug:"css-formatter",live:!0}]
function activeTools(list){return list.filter(t=>t.live).map(t=>t.slug).sort()}
export default function App(){return <ul>{activeTools(tools).map(s=><li key={s}>{s}</li>)}</ul>}
`;
