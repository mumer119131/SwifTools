"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { generate, type Options } from "./logic";

const SAMPLE = `[
  { "id": 1, "name": "Ada", "email": "ada@example.com", "verified": true },
  { "id": 2, "name": "Alan", "verified": false, "team": { "id": 9, "name": "Core" } }
]`;

/**
 * Renders the backticked field paths in a warning as real elements.
 *
 * Building the markup as an HTML string and injecting it would work, but a
 * field path comes from user-supplied JSON keys — so that route needs escaping
 * to be correct rather than merely present. Splitting into nodes cannot be got
 * wrong.
 */
function renderTicks(text: string): React.ReactNode[] {
  return text.split(/`([^`]+)`/).map((part, index) =>
    index % 2 === 1 ? (
      <code key={index} className="font-mono">
        {part}
      </code>
    ) : (
      <React.Fragment key={index}>{part}</React.Fragment>
    ),
  );
}

export default function JsonToTypescriptTool() {
  const [input, setInput] = React.useState(SAMPLE);
  const [options, setOptions] = React.useState<Options>({
    rootName: "User",
    style: "interface",
    allOptional: false,
    readonly: false,
  });

  const result = React.useMemo(() => generate(input, options), [input, options]);
  const failed = "error" in result;

  function set<K extends keyof Options>(key: K, value: Options[K]) {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-4">
        <div className="space-y-1.5">
          <Label htmlFor="root-name">Root type name</Label>
          <Input
            id="root-name"
            value={options.rootName}
            onChange={(event) => set("rootName", event.target.value)}
            className="w-44 font-mono"
            spellCheck={false}
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="style">Output</Label>
          <Select
            value={options.style}
            onValueChange={(value) => set("style", value as Options["style"])}
          >
            <SelectTrigger id="style" className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="interface">Interfaces</SelectItem>
              <SelectItem value="type">One nested type</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <label className="flex items-center gap-2.5 pb-2 text-sm text-foreground">
          <Switch
            checked={options.allOptional}
            onCheckedChange={(value) => set("allOptional", value)}
          />
          All optional
        </label>

        <label className="flex items-center gap-2.5 pb-2 text-sm text-foreground">
          <Switch checked={options.readonly} onCheckedChange={(value) => set("readonly", value)} />
          Readonly
        </label>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="json-input">JSON</Label>
          <Textarea
            id="json-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={20}
            spellCheck={false}
            className="font-mono text-sm"
            aria-invalid={failed}
          />
          <p className="pt-0.5 text-xs text-muted-foreground">
            Paste a whole array where you can — comparing records is how optional fields are
            worked out.
          </p>
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="ts-output">TypeScript</Label>
            {!failed && result.code !== "" ? <CopyButton value={result.code} /> : null}
          </div>
          <Textarea
            id="ts-output"
            value={failed ? "" : result.code}
            readOnly
            rows={20}
            spellCheck={false}
            className="font-mono text-sm"
          />
        </div>
      </div>

      {failed ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 font-mono text-sm text-foreground">
          {result.error}
        </p>
      ) : null}

      {!failed && result.warnings.length > 0 ? (
        <ul className="space-y-2 rounded-md border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3 text-sm text-foreground">
          {result.warnings.map((warning) => (
            <li key={warning} className="flex items-start gap-2">
              <Info className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
              <span>{renderTicks(warning)}</span>
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
