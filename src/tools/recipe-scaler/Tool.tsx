"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils";
import { SAMPLE, scaleRecipe } from "./logic";

const PRESETS = [
  { label: "Half", factor: 0.5 },
  { label: "⅔", factor: 2 / 3 },
  { label: "1½×", factor: 1.5 },
  { label: "Double", factor: 2 },
  { label: "Triple", factor: 3 },
];

export default function RecipeScalerTool() {
  const [text, setText] = React.useState(SAMPLE);
  const [from, setFrom] = React.useState("4");
  const [to, setTo] = React.useState("6");

  const fromServings = Number(from);
  const toServings = Number(to);
  const factor = fromServings > 0 && toServings > 0 ? toServings / fromServings : 1;

  const lines = scaleRecipe(text, factor);
  const output = lines.map((line) => line.scaled).join("\n");

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-[1fr_1fr_2fr]">
        <div className="space-y-2">
          <Label htmlFor="recipe-from">Recipe serves</Label>
          <Input
            id="recipe-from"
            type="number"
            inputMode="decimal"
            min={0.5}
            step={0.5}
            value={from}
            onChange={(event) => setFrom(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="recipe-to">You want to serve</Label>
          <Input
            id="recipe-to"
            type="number"
            inputMode="decimal"
            min={0.5}
            step={0.5}
            value={to}
            onChange={(event) => setTo(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <span className="text-sm font-medium text-foreground">Or scale by</span>
          <div className="flex flex-wrap gap-2">
            {PRESETS.map((preset) => (
              <Button
                key={preset.label}
                variant="outline"
                size="sm"
                onClick={() => {
                  setFrom("1");
                  setTo(String(preset.factor));
                }}
              >
                {preset.label}
              </Button>
            ))}
          </div>
          <FieldHint>
            Scaling by <span className="font-mono text-foreground">{factor.toFixed(3)}×</span>
          </FieldHint>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="recipe-input">Ingredients</Label>
            <Button variant="ghost" size="sm" onClick={() => setText(SAMPLE)}>
              Load example
            </Button>
          </div>
          <Textarea
            id="recipe-input"
            value={text}
            onChange={(event) => setText(event.target.value)}
            rows={14}
            spellCheck={false}
            placeholder={"2 cups flour\n1 1/2 tsp baking powder\n115 g butter"}
            className="font-mono text-sm"
          />
          <FieldHint>One ingredient per line, quantity first.</FieldHint>
        </div>

        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-foreground">
              Scaled for {to} {Number(to) === 1 ? "serving" : "servings"}
            </span>
            <CopyButton value={output} label="Copy scaled recipe" />
          </div>
          <div className="surface-card min-h-80 overflow-hidden">
            <ul className="divide-y divide-border">
              {lines.map((line, index) =>
                line.original.trim() === "" ? null : (
                  <li key={index} className="px-5 py-2.5 font-mono text-sm">
                    <span className={cn(line.changed ? "text-foreground" : "text-muted-foreground")}>
                      {line.scaled}
                    </span>
                    {line.changed ? (
                      <span className="ml-2 text-xs text-subtle-foreground">
                        was {line.original.trim()}
                      </span>
                    ) : null}
                  </li>
                ),
              )}
            </ul>
          </div>
        </div>
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Quantities in cups and spoons are rounded to fractions a measuring set
          actually has; grams and millilitres stay decimal. Lines with no number
          — &ldquo;salt to taste&rdquo; — are left alone, which is right, because
          they never scaled linearly. Two things else never scale: cooking times
          barely move, and leavening and salt in baking should be increased more
          gently than the flour. Pan size matters too — doubling a cake into the
          same tin gives you a raw middle.
        </span>
      </p>
    </div>
  );
}
