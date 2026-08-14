"use client";

import * as React from "react";

import { GeneratorShell } from "@/components/shared/GeneratorShell";
import { shuffle } from "@/lib/random";
import { COMPLIMENTS } from "@/lib/wordlists";

export default function ComplimentGeneratorTool() {
  function generate(count: number): string[] {
    return shuffle(COMPLIMENTS).slice(0, count);
  }

  return (
    <GeneratorShell
      generate={generate}
      countLabel="How many"
      defaultCount={5}
      maxCount={COMPLIMENTS.length}
      spacious
      footnote={
        <>
          These are about what someone does rather than how they look, which is
          the difference between a compliment that lands and one that gets a
          polite nod. Pick the one that happens to be true — a specific
          observation from a real person is worth more than any generated line,
          and this is only meant to help you notice which one fits.
        </>
      }
    />
  );
}
