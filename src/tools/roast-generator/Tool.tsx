"use client";

import * as React from "react";

import { GeneratorShell } from "@/components/shared/GeneratorShell";
import { shuffle } from "@/lib/random";
import { ROASTS } from "@/lib/wordlists";

export default function RoastGeneratorTool() {
  function generate(count: number): string[] {
    return shuffle(ROASTS).slice(0, count);
  }

  return (
    <GeneratorShell
      generate={generate}
      countLabel="How many"
      defaultCount={5}
      maxCount={ROASTS.length}
      spacious
      footnote={
        <>
          These are the leaving-do kind: about habits a person would happily
          admit to, never about appearance, background or anything they cannot
          change. That line is what separates a roast from an insult, and it is
          the reason a good roast is a form of affection. Read the room — the
          same line lands very differently depending on who says it.
        </>
      }
    />
  );
}
