"use client";

import * as React from "react";
import { ArrowUpDown, Info } from "lucide-react";

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
import { formatNumber } from "@/lib/utils";
import { countEncoded, decodeHtml, encodeHtml, type EncodeScope } from "./logic";

type Direction = "encode" | "decode";

const SAMPLE = `<a href="/docs?a=1&b=2">Ada's "guide" — £5 & up</a>`;

export default function HtmlEncodeDecodeTool() {
  const [direction, setDirection] = React.useState<Direction>("encode");
  const [scope, setScope] = React.useState<EncodeScope>("minimal");
  const [input, setInput] = React.useState("");

  const output = React.useMemo(
    () => (direction === "encode" ? encodeHtml(input, scope) : decodeHtml(input)),
    [input, direction, scope],
  );

  const entityCount = direction === "encode" ? countEncoded(input, output) : 0;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-4">
        <Tabs value={direction} onValueChange={(value) => setDirection(value as Direction)}>
          <TabsList>
            <TabsTrigger value="encode">Encode</TabsTrigger>
            <TabsTrigger value="decode">Decode</TabsTrigger>
          </TabsList>
        </Tabs>

        {direction === "encode" ? (
          <div className="flex items-center gap-3">
            <Label htmlFor="html-scope">Escape</Label>
            <Select value={scope} onValueChange={(value) => setScope(value as EncodeScope)}>
              <SelectTrigger id="html-scope" className="w-60">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="minimal">Minimal — the 5 markup characters</SelectItem>
                <SelectItem value="named">Named entities where they exist</SelectItem>
                <SelectItem value="all">Everything non-ASCII</SelectItem>
              </SelectContent>
            </Select>
          </div>
        ) : null}
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="html-input">{direction === "encode" ? "Text" : "Encoded HTML"}</Label>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setInput(SAMPLE)} disabled={!!input}>
              Use sample
            </Button>
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
          id="html-input"
          value={input}
          onChange={(event) => setInput(event.target.value)}
          placeholder={direction === "encode" ? '<p>5 > 3 & "quoted"</p>' : "&lt;p&gt;5 &gt; 3&lt;/p&gt;"}
          className="min-h-40 font-mono text-sm"
          spellCheck={false}
        />
        <FieldHint>
          {direction === "encode"
            ? scope === "minimal"
              ? "Escapes only & < > \" ' — the characters that would otherwise be parsed as markup."
              : scope === "named"
                ? "Uses readable named entities like &copy; and &mdash; where one exists."
                : "Every character above ASCII becomes a numeric reference. Verbose, but survives a file saved in the wrong encoding."
            : "Resolves named entities and both decimal and hexadecimal numeric references."}
        </FieldHint>
      </div>

      <CodeOutput
        value={output}
        label={direction === "encode" ? "Encoded" : "Decoded"}
        fileName={direction === "encode" ? "encoded.txt" : "decoded.html"}
        className="whitespace-pre-wrap break-all"
      />

      {entityCount > 0 ? (
        <p className="text-sm text-muted-foreground">
          <span data-numeric>{formatNumber(entityCount)}</span>{" "}
          {entityCount === 1 ? "entity" : "entities"} written.
        </p>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Escaping these five characters is what stops markup being <em>parsed</em>, which is why
          it prevents the most basic form of XSS. It is not a general sanitiser: content going into
          an attribute, a URL, inline CSS or a <code className="font-mono">script</code> block each
          need their own escaping rules. Use your framework&rsquo;s templating, which does this
          correctly by default.
        </span>
      </p>
    </div>
  );
}
