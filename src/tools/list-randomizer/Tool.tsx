"use client";

import * as React from "react";
import { Info, Shuffle } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { toLines } from "@/lib/random";
import { bySize, intoGroups, shuffleLines } from "./logic";

type Mode = "order" | "groups" | "size";

const SAMPLE = `Amara\nBen\nChen\nDiego\nElena\nFarid\nGrace\nHugo\nIsla\nJonas\nKiera`;

export default function ListRandomizerTool() {
  const [text, setText] = React.useState(SAMPLE);
  const [mode, setMode] = React.useState<Mode>("order");
  const [groupCount, setGroupCount] = React.useState("3");
  const [groupSize, setGroupSize] = React.useState("4");
  const [result, setResult] = React.useState<string[][] | null>(null);

  const itemCount = toLines(text).length;

  function run() {
    const shuffled = shuffleLines(text);
    if (shuffled.length === 0) {
      setResult(null);
      return;
    }

    if (mode === "order") setResult([shuffled]);
    else if (mode === "groups") setResult(intoGroups(shuffled, Number(groupCount)));
    else setResult(bySize(shuffled, Number(groupSize)));
  }

  const plainText =
    result
      ?.map((group, index) =>
        result.length === 1
          ? group.map((item, i) => `${i + 1}. ${item}`).join("\n")
          : `Group ${index + 1}\n${group.map((item) => `  ${item}`).join("\n")}`,
      )
      .join("\n\n") ?? "";

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="list-input">Your list</Label>
            <span className="text-xs text-muted-foreground">{itemCount} items</span>
          </div>
          <Textarea
            id="list-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={14}
            spellCheck={false}
            placeholder="One item per line"
            className="font-mono text-sm"
          />
          <FieldHint>Blank lines are ignored.</FieldHint>
        </div>

        <div className="space-y-4">
          <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
            <TabsList>
              <TabsTrigger value="order">Shuffle order</TabsTrigger>
              <TabsTrigger value="groups">Into N groups</TabsTrigger>
              <TabsTrigger value="size">Groups of N</TabsTrigger>
            </TabsList>
          </Tabs>

          {mode === "groups" ? (
            <div className="space-y-2">
              <Label htmlFor="list-groups">Number of groups</Label>
              <Input
                id="list-groups"
                type="number"
                inputMode="numeric"
                min={1}
                value={groupCount}
                onChange={(event) => setGroupCount(event.target.value)}
                className="max-w-32"
              />
              <FieldHint>Dealt round-robin, so sizes stay within one of each other.</FieldHint>
            </div>
          ) : mode === "size" ? (
            <div className="space-y-2">
              <Label htmlFor="list-size">People per group</Label>
              <Input
                id="list-size"
                type="number"
                inputMode="numeric"
                min={1}
                value={groupSize}
                onChange={(event) => setGroupSize(event.target.value)}
                className="max-w-32"
              />
              <FieldHint>The last group takes the remainder.</FieldHint>
            </div>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Button size="lg" onClick={run} disabled={itemCount === 0}>
              <Shuffle className="size-4" strokeWidth={1.75} />
              {mode === "order" ? "Shuffle" : "Make groups"}
            </Button>
            {result ? <CopyButton value={plainText} label="Copy result" /> : null}
          </div>

          {result ? (
            <div className="space-y-3" aria-live="polite">
              {result.map((group, index) => (
                <section key={index} className="surface-card overflow-hidden">
                  {result.length > 1 ? (
                    <h2 className="border-b border-border px-5 py-2.5 text-sm font-medium text-foreground">
                      Group {index + 1}
                      <span className="ml-2 text-xs text-subtle-foreground">
                        {group.length}
                      </span>
                    </h2>
                  ) : null}
                  <ol className="divide-y divide-border">
                    {group.map((item, itemIndex) => (
                      <li key={itemIndex} className="flex gap-3 px-5 py-2 text-sm">
                        <span className="w-6 shrink-0 text-right font-mono text-subtle-foreground">
                          {itemIndex + 1}
                        </span>
                        <span className="min-w-0 flex-1 text-foreground">{item}</span>
                      </li>
                    ))}
                  </ol>
                </section>
              ))}
            </div>
          ) : null}
        </div>
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The shuffle is Fisher–Yates driven by the browser&rsquo;s
          cryptographic random source, which is the only method that makes every
          possible ordering equally likely. The common shortcut —
          <code className="mx-1 rounded bg-surface-hover px-1 font-mono text-xs">
            sort(() =&gt; Math.random() - 0.5)
          </code>
          — is measurably biased and gives different results in different
          browsers, which matters if anyone is going to argue about the outcome.
        </span>
      </p>
    </div>
  );
}
