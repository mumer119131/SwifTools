"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { DownloadButton } from "@/components/shared/DownloadButton";
import { FieldHint, Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { EXTRACTORS, SEPARATORS, extract, type Kind } from "./logic";

const SAMPLE = `From: ada@example.com
To: grace@navy.mil, ada@example.com
Date: 2026-08-18

Please review https://example.com/report and the mirror at
http://backup.example.org/report.pdf before Friday.

Call me on +44 20 7946 0958 or 555-0142 if anything is unclear.
Server 192.168.1.24 is still down — @sysadmin is on it. #urgent`;

export default function ExtractFromTextTool() {
  const [input, setInput] = React.useState(SAMPLE);
  const [kind, setKind] = React.useState<Kind>("email");
  const [unique, setUnique] = React.useState(true);
  const [sort, setSort] = React.useState(false);
  const [lowercase, setLowercase] = React.useState(false);
  const [separator, setSeparator] = React.useState("\n");

  const result = extract(input, kind, { unique, sort, lowercase });
  const output = result.values.join(separator);
  const extractor = EXTRACTORS.find((entry) => entry.id === kind)!;

  return (
    <div className="space-y-5">
      <div className="surface-card space-y-4 p-5">
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">What to extract</span>
          <Tabs value={kind} onValueChange={(value) => setKind(value as Kind)}>
            <TabsList>
              {EXTRACTORS.map((entry) => (
                <TabsTrigger key={entry.id} value={entry.id}>
                  {entry.label.replace(" addresses", "").replace(" numbers", "")}
                </TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
          <FieldHint>{extractor.note}</FieldHint>
        </div>

        <div className="flex flex-wrap items-center gap-6">
          {[
            { id: "unique", label: "Remove duplicates", value: unique, set: setUnique },
            { id: "sort", label: "Sort", value: sort, set: setSort },
            { id: "lowercase", label: "Lowercase", value: lowercase, set: setLowercase },
          ].map((toggle) => (
            <div key={toggle.id} className="flex items-center gap-3">
              <Switch id={`ex-${toggle.id}`} checked={toggle.value} onCheckedChange={toggle.set} />
              <Label htmlFor={`ex-${toggle.id}`}>{toggle.label}</Label>
            </div>
          ))}

          <div className="space-y-2">
            <span className="text-sm font-medium text-foreground">Separate with</span>
            <Tabs value={separator} onValueChange={setSeparator}>
              <TabsList>
                {SEPARATORS.map((entry) => (
                  <TabsTrigger key={entry.label} value={entry.id}>
                    {entry.label}
                  </TabsTrigger>
                ))}
              </TabsList>
            </Tabs>
          </div>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="ex-input">Text</Label>
          <Textarea
            id="ex-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={18}
            spellCheck={false}
            className="font-mono text-sm"
          />
        </div>

        <div className="space-y-2">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Label htmlFor="ex-output">
              {result.values.length} {extractor.label.toLowerCase()}
            </Label>
            <div className="flex items-center gap-2">
              {result.duplicates > 0 ? (
                <span className="text-xs text-muted-foreground">
                  {result.duplicates} duplicate{result.duplicates === 1 ? "" : "s"} removed
                </span>
              ) : null}
              <CopyButton value={output} label="Copy" />
              <DownloadButton
                blob={() => new Blob([output], { type: "text/plain;charset=utf-8" })}
                fileName={`${kind}s.txt`}
                label="Download"
                size="sm"
                variant="outline"
              />
            </div>
          </div>
          <Textarea
            id="ex-output"
            value={output}
            readOnly
            rows={18}
            spellCheck={false}
            className="font-mono text-sm"
            placeholder={`No ${extractor.label.toLowerCase()} found in that text.`}
          />
        </div>
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The patterns aim at what a person would point at rather than at
          specification completeness — a fully RFC-compliant email pattern is
          hundreds of characters long, matches addresses nobody uses, and still
          cannot tell you whether one exists. IP addresses are range-checked,
          mentions exclude the local part of an email address, and URLs need a
          scheme. Phone numbers are the weakest of the set, because no single
          pattern covers every country without also catching order numbers.
        </span>
      </p>
    </div>
  );
}
