"use client";

import * as React from "react";

import { GeneratorShell } from "@/components/shared/GeneratorShell";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { pick } from "@/lib/random";
import { FIRST_NAMES_N, NICKNAME_PREFIXES, NICKNAME_SUFFIXES } from "@/lib/wordlists";

type Style = "gamertag" | "short" | "prefixed";

export default function NicknameGeneratorTool() {
  const [style, setStyle] = React.useState<Style>("gamertag");

  function generate(count: number): string[] {
    const results = new Set<string>();

    // Bounded: the pools are finite, so an impossible count must still finish.
    for (let attempt = 0; attempt < count * 30 && results.size < count; attempt += 1) {
      if (style === "gamertag") {
        results.add(`${pick(NICKNAME_PREFIXES)}${pick(NICKNAME_SUFFIXES)}`);
      } else if (style === "short") {
        const suffix = pick(NICKNAME_SUFFIXES) ?? "";
        results.add(suffix.charAt(0).toUpperCase() + suffix.slice(1));
      } else {
        results.add(`${pick(NICKNAME_PREFIXES)} ${pick(FIRST_NAMES_N)}`);
      }
    }

    return [...results];
  }

  return (
    <GeneratorShell
      generate={generate}
      countLabel="How many"
      defaultCount={18}
      refreshKey={style}
      controls={
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Style</span>
          <Tabs value={style} onValueChange={(value) => setStyle(value as Style)}>
            <TabsList>
              <TabsTrigger value="gamertag">Gamertag</TabsTrigger>
              <TabsTrigger value="short">Short</TabsTrigger>
              <TabsTrigger value="prefixed">Prefix + name</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      }
      footnote={
        <>
          Prefixes and suffixes are chosen so the joins read cleanly — the reason
          most generators produce unpronounceable output is that they concatenate
          random syllables rather than parts picked to sit together. Check
          availability before committing to one; a good handle is usually taken.
        </>
      }
    />
  );
}
