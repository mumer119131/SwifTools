"use client";

import * as React from "react";
import { ArrowLeftRight, Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { convert, type Direction } from "./logic";

const SAMPLE = `# A service definition
name: web
replicas: 3
ports:
  - 8080
  - 8443
env:
  NODE_ENV: production
  DEBUG: false
`;

export default function YamlToJsonTool() {
  const [input, setInput] = React.useState(SAMPLE);
  const [direction, setDirection] = React.useState<Direction>("yaml-to-json");
  const [indent, setIndent] = React.useState("2");

  const result = React.useMemo(
    () => convert(input, direction, Number(indent)),
    [input, direction, indent],
  );

  const failed = "error" in result;
  const sourceLabel = direction === "yaml-to-json" ? "YAML" : "JSON";
  const targetLabel = direction === "yaml-to-json" ? "JSON" : "YAML";

  function swap() {
    const next: Direction = direction === "yaml-to-json" ? "json-to-yaml" : "yaml-to-json";
    // Feed the output back in, so swapping continues the work rather than
    // discarding it.
    if (!failed && result.output.trim() !== "") setInput(result.output);
    setDirection(next);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3">
        <Button variant="outline" onClick={swap}>
          <ArrowLeftRight strokeWidth={1.75} />
          {sourceLabel} → {targetLabel}
        </Button>

        <div className="space-y-1.5">
          <Label htmlFor="indent">Indent</Label>
          <Select value={indent} onValueChange={setIndent}>
            <SelectTrigger id="indent" className="w-28">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {["2", "4", "8"].map((value) => (
                <SelectItem key={value} value={value}>
                  {value} spaces
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="yaml-input">{sourceLabel}</Label>
          <Textarea
            id="yaml-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={18}
            spellCheck={false}
            className="font-mono text-sm"
            aria-invalid={failed}
          />
        </div>

        <div className="space-y-1.5">
          <div className="flex items-center justify-between gap-3">
            <Label htmlFor="yaml-output">{targetLabel}</Label>
            {!failed && result.output !== "" ? <CopyButton value={result.output} /> : null}
          </div>
          <Textarea
            id="yaml-output"
            value={failed ? "" : result.output}
            readOnly
            rows={18}
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

      {!failed && result.notes.length > 0 ? (
        <ul className="space-y-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
          {result.notes.map((note) => (
            <li key={note} className="flex items-start gap-2">
              <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
              {note}
            </li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
