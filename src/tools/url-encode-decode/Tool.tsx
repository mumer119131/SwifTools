"use client";

import * as React from "react";
import { ArrowUpDown } from "lucide-react";

import { CodeOutput } from "@/components/shared/CodeOutput";
import { Button } from "@/components/ui/button";
import { FieldHint, Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { decodeUrl, encodeUrl, parseUrl, type EncodeScope } from "./logic";

type Direction = "encode" | "decode";

export default function UrlEncodeDecodeTool() {
  const [direction, setDirection] = React.useState<Direction>("encode");
  const [scope, setScope] = React.useState<EncodeScope>("component");
  const [input, setInput] = React.useState("");

  const { output, error } = React.useMemo(() => {
    if (!input.trim()) return { output: "", error: null as string | null };
    try {
      return {
        output: direction === "encode" ? encodeUrl(input, scope) : decodeUrl(input, scope),
        error: null as string | null,
      };
    } catch {
      return {
        output: "",
        error:
          "That string contains a malformed percent-escape (for example a lone % or %ZZ) and can't be decoded.",
      };
    }
  }, [input, direction, scope]);

  const parsed = React.useMemo(() => parseUrl(direction === "decode" ? output : input), [
    direction,
    input,
    output,
  ]);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <Tabs value={direction} onValueChange={(value) => setDirection(value as Direction)}>
          <TabsList>
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>
        </Tabs>

        <div className="flex items-center gap-3">
          <Label htmlFor="encode-scope">Scope</Label>
          <Select value={scope} onValueChange={(value) => setScope(value as EncodeScope)}>
            <SelectTrigger id="encode-scope" className="w-56">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="component">Component — a single value</SelectItem>
              <SelectItem value="full">Full URL — keep the structure</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <Label htmlFor="url-input">{direction === "encode" ? "Plain text" : "Encoded text"}</Label>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => {
                setInput(output);
                setDirection(direction === "encode" ? "decode" : "encode");
              }}
              disabled={!output}
            >
              <ArrowUpDown strokeWidth={1.75} />
              Swap
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setInput("")} disabled={!input}>
              Clear
            </Button>
          </div>
        </div>
        <Textarea
          id="url-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={
            direction === "encode"
              ? "https://example.com/search?q=hello world&lang=en"
              : "https%3A%2F%2Fexample.com%2Fsearch%3Fq%3Dhello%20world"
          }
          className="min-h-32 font-mono text-sm"
          spellCheck={false}
        />
        <FieldHint>
          {scope === "component"
            ? "Component mode escapes / ? & = : too — correct for one query value, wrong for a whole URL."
            : "Full-URL mode leaves separators like / ? & = alone and only escapes spaces and unsafe characters."}
        </FieldHint>
      </div>

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <CodeOutput
        value={output}
        label={direction === "encode" ? "Encoded" : "Decoded"}
        fileName="url.txt"
        className="whitespace-pre-wrap break-all"
      />

      {parsed ? (
        <section className="surface-card overflow-hidden">
          <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
            URL breakdown
          </h2>
          <dl className="divide-y divide-border text-sm">
            {[
              { label: "Protocol", value: parsed.protocol },
              { label: "Host", value: parsed.host },
              { label: "Path", value: parsed.path },
              ...(parsed.hash ? [{ label: "Fragment", value: parsed.hash }] : []),
            ].map((row) => (
              <div key={row.label} className="flex gap-4 px-5 py-2.5">
                <dt className="w-24 shrink-0 text-muted-foreground">{row.label}</dt>
                <dd className="min-w-0 break-all font-mono text-foreground">{row.value}</dd>
              </div>
            ))}
          </dl>

          {parsed.params.length > 0 ? (
            <>
              <h3 className="border-y border-border px-5 py-2.5 text-xs font-medium text-subtle-foreground">
                Query parameters (decoded)
              </h3>
              <dl className="divide-y divide-border text-sm">
                {parsed.params.map((param, index) => (
                  <div key={`${param.key}-${index}`} className="flex gap-4 px-5 py-2.5">
                    <dt className="w-24 shrink-0 break-all font-mono text-muted-foreground">
                      {param.key}
                    </dt>
                    <dd className="min-w-0 break-all font-mono text-foreground">{param.value}</dd>
                  </div>
                ))}
              </dl>
            </>
          ) : null}
        </section>
      ) : null}
    </div>
  );
}
