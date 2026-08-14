"use client";

import * as React from "react";

import { GeneratorShell } from "@/components/shared/GeneratorShell";
import { shuffle } from "@/lib/random";
import { ICEBREAKERS } from "@/lib/wordlists";

export default function IcebreakerQuestionsTool() {
  // A fresh shuffle each time, sliced — so a set never repeats a question.
  function generate(count: number): string[] {
    return shuffle(ICEBREAKERS).slice(0, count);
  }

  return (
    <GeneratorShell
      generate={generate}
      countLabel="How many questions"
      defaultCount={6}
      maxCount={ICEBREAKERS.length}
      spacious
      footnote={
        <>
          These are chosen to be answerable by someone who does not want to be
          there. The usual icebreakers fail because they demand a performance —
          &ldquo;tell us a fun fact about yourself&rdquo; puts the burden of being
          interesting on the person least comfortable in the room. A question
          with a concrete answer gets a real one.
        </>
      }
    />
  );
}
