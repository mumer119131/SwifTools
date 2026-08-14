"use client";

import * as React from "react";

import { GeneratorShell } from "@/components/shared/GeneratorShell";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { pick } from "@/lib/random";
import {
  STORY_OBSTACLES,
  STORY_PROTAGONISTS,
  STORY_SETTINGS,
  STORY_TWISTS,
  STORY_WANTS,
} from "@/lib/wordlists";

export default function StoryPlotGeneratorTool() {
  const [includeTwist, setIncludeTwist] = React.useState(true);
  const [includeSetting, setIncludeSetting] = React.useState(true);

  function generate(count: number): string[] {
    return Array.from({ length: count }, () => {
      const parts = [
        `${capitalise(pick(STORY_PROTAGONISTS) ?? "")} wants ${pick(STORY_WANTS)}`,
        `but ${pick(STORY_OBSTACLES)}`,
      ];

      if (includeSetting) parts.push(`It plays out in ${pick(STORY_SETTINGS)}`);
      if (includeTwist) parts.push(`Then: ${pick(STORY_TWISTS)}`);

      return `${parts.join(". ")}.`;
    });
  }

  return (
    <GeneratorShell
      generate={generate}
      countLabel="How many premises"
      defaultCount={4}
      maxCount={30}
      spacious
      refreshKey={`${includeTwist}-${includeSetting}`}
      controls={
        <div className="flex flex-wrap gap-6">
          <div className="flex items-center gap-3">
            <Switch id="plot-setting" checked={includeSetting} onCheckedChange={setIncludeSetting} />
            <Label htmlFor="plot-setting">Include a setting</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="plot-twist" checked={includeTwist} onCheckedChange={setIncludeTwist} />
            <Label htmlFor="plot-twist">Include a twist</Label>
          </div>
        </div>
      }
      footnote={
        <>
          Each premise is built from the four pieces a story actually needs:
          someone specific, something they want, something concrete in the way,
          and a turn that changes what the want was really about. Generators that
          shuffle nouns and genres give you a setting, not a story — the want and
          the obstacle are what make a premise writable.
        </>
      }
    />
  );
}

function capitalise(text: string): string {
  return text.charAt(0).toUpperCase() + text.slice(1);
}
