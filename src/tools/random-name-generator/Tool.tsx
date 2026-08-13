"use client";

import * as React from "react";
import { Info, RefreshCw } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { generate, type Parts, type Style } from "./logic";

export default function RandomNameGeneratorTool() {
  const [style, setStyle] = React.useState<Style>("any");
  const [parts, setParts] = React.useState<Parts>("full");
  const [count, setCount] = React.useState("12");
  const [names, setNames] = React.useState<string[]>(() => generate("any", "full", 12));

  function run(nextStyle = style, nextParts = parts) {
    setNames(generate(nextStyle, nextParts, Number(count) || 1));
  }

  return (
    <div className="space-y-5">
      <div className="surface-card flex flex-wrap items-end gap-4 p-5">
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Style</span>
          <Tabs
            value={style}
            onValueChange={(value) => {
              setStyle(value as Style);
              run(value as Style);
            }}
          >
            <TabsList>
              <TabsTrigger value="any">Any</TabsTrigger>
              <TabsTrigger value="feminine">Feminine</TabsTrigger>
              <TabsTrigger value="masculine">Masculine</TabsTrigger>
              <TabsTrigger value="neutral">Neutral</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Parts</span>
          <Tabs
            value={parts}
            onValueChange={(value) => {
              setParts(value as Parts);
              run(style, value as Parts);
            }}
          >
            <TabsList>
              <TabsTrigger value="full">Full name</TabsTrigger>
              <TabsTrigger value="first">First only</TabsTrigger>
              <TabsTrigger value="last">Surname only</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        <div className="space-y-2">
          <Label htmlFor="name-count">How many</Label>
          <Input
            id="name-count"
            type="number"
            inputMode="numeric"
            min={1}
            max={200}
            value={count}
            onChange={(event) => setCount(event.target.value)}
            className="w-24"
          />
        </div>

        <Button size="lg" onClick={() => run()}>
          <RefreshCw className="size-4" strokeWidth={1.75} />
          Generate
        </Button>
      </div>

      <div className="surface-card overflow-hidden">
        <header className="flex items-center justify-between gap-3 border-b border-border px-5 py-3">
          <h2 className="text-sm font-medium text-foreground">
            {names.length} name{names.length === 1 ? "" : "s"}
          </h2>
          <CopyButton value={names.join("\n")} label="Copy all" />
        </header>
        <ul className="grid gap-px bg-border sm:grid-cols-2 lg:grid-cols-3">
          {names.map((name, index) => (
            <li key={`${name}-${index}`} className="bg-surface px-5 py-2.5 text-sm text-foreground">
              {name}
            </li>
          ))}
        </ul>
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Names are combined from curated lists of given names and surnames from
          several regions — nothing is scraped from real people. Duplicates are
          avoided within a batch, because the same name twice in a list of twenty
          reads as a bug whether or not it is one. If you need addresses, emails
          and phone numbers alongside these, the fake data generator produces a
          whole record at once.
        </span>
      </p>
    </div>
  );
}
