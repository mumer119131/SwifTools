"use client";

import * as React from "react";

import { MaterialResult } from "@/components/shared/MaterialResult";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { estimate } from "./logic";

export default function FenceCalculatorTool() {
  const [length, setLength] = React.useState("100");
  const [spacing, setSpacing] = React.useState("8");
  const [height, setHeight] = React.useState("6");
  const [rails, setRails] = React.useState("3");
  const [picketWidth, setPicketWidth] = React.useState("5.5");
  const [gap, setGap] = React.useState("0");
  const [postPrice, setPostPrice] = React.useState("18");
  const [railPrice, setRailPrice] = React.useState("9");
  const [picketPrice, setPicketPrice] = React.useState("4");

  const result = estimate(
    Number(length),
    Number(spacing),
    Number(height),
    Number(rails),
    Number(picketWidth),
    Number(gap),
    Number(postPrice),
    Number(railPrice),
    Number(picketPrice),
  );

  const fields: { id: string; label: string; value: string; set: (value: string) => void; hint?: string; step?: number }[] = [
    { id: "fence-length", label: "Fence length (ft)", value: length, set: setLength },
    { id: "fence-spacing", label: "Post spacing (ft)", value: spacing, set: setSpacing, hint: "6 to 8 ft. Closer in windy spots." },
    { id: "fence-height", label: "Fence height (ft)", value: height, set: setHeight, hint: "Sets how deep the posts go." },
    { id: "fence-rails", label: "Rails per section", value: rails, set: setRails, hint: "2 for a 4 ft fence, 3 for a 6 ft." },
    { id: "fence-picket-width", label: "Picket width (in)", value: picketWidth, set: setPicketWidth, step: 0.25, hint: '5.5" is a nominal 1×6 board.' },
    { id: "fence-gap", label: "Gap between pickets (in)", value: gap, set: setGap, step: 0.25, hint: "0 for a privacy fence." },
    { id: "fence-post-price", label: "Price per post", value: postPrice, set: setPostPrice },
    { id: "fence-rail-price", label: "Price per rail", value: railPrice, set: setRailPrice },
    { id: "fence-picket-price", label: "Price per picket", value: picketPrice, set: setPicketPrice },
  ];

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        {fields.map((field) => (
          <div key={field.id} className="space-y-2">
            <Label htmlFor={field.id}>{field.label}</Label>
            <Input
              id={field.id}
              type="number"
              inputMode="decimal"
              min={0}
              step={field.step}
              value={field.value}
              onChange={(event) => field.set(event.target.value)}
            />
            {field.hint ? <FieldHint>{field.hint}</FieldHint> : null}
          </div>
        ))}
      </div>

      <MaterialResult
        headlineLabel="Posts needed"
        headline={String(result.posts)}
        copyValue={`${result.posts} posts, ${result.rails} rails, ${result.pickets} pickets`}
        cost={result.cost}
        stats={[
          { label: "Sections", value: String(result.sections) },
          { label: "Rails", value: String(result.rails) },
          { label: "Pickets", value: String(result.pickets) },
          {
            label: "Post mix",
            value: `${result.concreteBags} bags`,
            detail: `${result.concreteBagsPerPost} per post, ${result.postHoleDepthFt.toFixed(1)} ft deep`,
          },
        ]}
        footnote={
          <>
            A run of {result.sections} sections needs {result.posts} posts, not{" "}
            {result.sections} — there is a post at both ends. That off-by-one is
            the most common fence estimating error, and it always leaves you
            short. Set posts a third of their height into the ground, or below
            the frost line if the ground freezes where you are, whichever is
            deeper. Gates need their own heavier posts on both sides.
          </>
        }
      />
    </div>
  );
}
