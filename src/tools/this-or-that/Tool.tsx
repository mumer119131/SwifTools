"use client";

import * as React from "react";

import { GeneratorShell } from "@/components/shared/GeneratorShell";
import { shuffle } from "@/lib/random";
import { THIS_OR_THAT } from "@/lib/wordlists";

export default function ThisOrThatTool() {
  function generate(count: number): string[] {
    return shuffle(THIS_OR_THAT)
      .slice(0, count)
      .map(([left, right]) => `${left}  or  ${right}?`);
  }

  return (
    <GeneratorShell
      generate={generate}
      countLabel="How many pairs"
      defaultCount={10}
      maxCount={THIS_OR_THAT.length}
      footnote={
        <>
          Every pair is one where both answers are genuinely defensible. That is
          the whole design: a pair with an obvious right answer produces
          agreement, and agreement is not a game. The interesting part is never
          which side someone picks — it is the reason they give.
        </>
      }
    />
  );
}
