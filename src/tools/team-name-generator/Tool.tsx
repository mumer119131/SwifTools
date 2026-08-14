"use client";

import * as React from "react";

import { GeneratorShell } from "@/components/shared/GeneratorShell";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { pick } from "@/lib/random";
import { ADJECTIVES, NOUNS } from "@/lib/wordlists";

export default function TeamNameGeneratorTool() {
  const [prefix, setPrefix] = React.useState("");

  function generate(count: number): string[] {
    const results = new Set<string>();
    const lead = prefix.trim();

    for (let attempt = 0; attempt < count * 30 && results.size < count; attempt += 1) {
      const name = `${pick(ADJECTIVES)} ${pick(NOUNS)}`;
      results.add(lead ? `${lead} ${name}` : name);
    }

    return [...results];
  }

  return (
    <GeneratorShell
      generate={generate}
      countLabel="How many"
      defaultCount={18}
      refreshKey={prefix}
      controls={
        <div className="space-y-2">
          <Label htmlFor="team-prefix">Prefix (optional)</Label>
          <Input
            id="team-prefix"
            value={prefix}
            onChange={(event) => setPrefix(event.target.value)}
            placeholder="Camden, Finance, Year 9…"
            className="w-52"
          />
          <FieldHint>Put your town, department or class in front.</FieldHint>
        </div>
      }
      footnote={
        <>
          Forty adjectives against forty nouns is sixteen hundred combinations,
          so a batch of twenty rarely repeats. Names are built adjective-plus-plural-noun
          because that is the shape almost every real team name takes — it scans
          when shouted, which is the only test that matters.
        </>
      }
    />
  );
}
