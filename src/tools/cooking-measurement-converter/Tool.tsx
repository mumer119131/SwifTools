"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { INGREDIENTS, VOLUME_MEASURES, formatKitchen } from "@/lib/home";
import { ALL_MEASURES, WEIGHT_MEASURES, convert } from "./logic";

export default function CookingConverterTool() {
  const [amount, setAmount] = React.useState("1");
  const [from, setFrom] = React.useState("cup");
  const [ingredientId, setIngredientId] = React.useState("flour-ap");

  const ingredient = INGREDIENTS.find((entry) => entry.id === ingredientId)!;
  const result = convert(Number(amount), from, ingredientId);

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="cook-amount">Amount</Label>
          <Input
            id="cook-amount"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.25}
            value={amount}
            onChange={(event) => setAmount(event.target.value)}
            className="text-lg"
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cook-from">Measured in</Label>
          <Select value={from} onValueChange={setFrom}>
            <SelectTrigger id="cook-from">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {ALL_MEASURES.map((measure) => (
                <SelectItem key={measure.id} value={measure.id}>
                  {measure.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cook-ingredient">Ingredient</Label>
          <Select value={ingredientId} onValueChange={setIngredientId}>
            <SelectTrigger id="cook-ingredient">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {INGREDIENTS.map((entry) => (
                <SelectItem key={entry.id} value={entry.id}>
                  {entry.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldHint>{ingredient.gramsPerCup} g per cup.</FieldHint>
        </div>
      </div>

      {result ? (
        <>
          <div className="surface-card p-6 text-center">
            <p className="text-xs text-muted-foreground">
              {amount} {ALL_MEASURES.find((measure) => measure.id === from)?.name} of{" "}
              {ingredient.name.toLowerCase()}
            </p>
            <p
              className="mt-2 flex items-baseline justify-center gap-3 font-mono text-4xl tracking-[-0.03em] text-foreground sm:text-5xl"
              data-numeric
              aria-live="polite"
            >
              {result.grams.toLocaleString("en-US", { maximumFractionDigits: 1 })} g
              <CopyButton
                value={`${result.grams.toFixed(1)} g`}
                iconOnly
                label="Copy weight in grams"
              />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {result.volumeMl.toLocaleString("en-US", { maximumFractionDigits: 1 })} ml ·{" "}
              {(result.grams / 28.349523125).toFixed(2)} oz
            </p>
          </div>

          <div className="grid gap-4 lg:grid-cols-2">
            <section className="surface-card overflow-hidden">
              <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
                By volume
              </h2>
              <dl className="divide-y divide-border">
                {VOLUME_MEASURES.map((measure) => {
                  const value = result.volumeMl / measure.ml;
                  return (
                    <div key={measure.id} className="flex items-center gap-4 px-5 py-2.5 text-sm">
                      <dt className="min-w-0 flex-1 text-muted-foreground">{measure.name}s</dt>
                      <dd className="shrink-0 font-mono text-foreground" data-numeric>
                        {value < 10 ? formatKitchen(value) : value.toLocaleString("en-US", { maximumFractionDigits: 1 })}
                      </dd>
                    </div>
                  );
                })}
              </dl>
            </section>

            <section className="surface-card overflow-hidden">
              <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
                By weight
              </h2>
              <dl className="divide-y divide-border">
                {WEIGHT_MEASURES.map((measure) => (
                  <div key={measure.id} className="flex items-center gap-4 px-5 py-2.5 text-sm">
                    <dt className="min-w-0 flex-1 text-muted-foreground">{measure.name}</dt>
                    <dd className="shrink-0 font-mono text-foreground" data-numeric>
                      {(result.grams / measure.grams).toLocaleString("en-US", {
                        maximumFractionDigits: 3,
                      })}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          </div>
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Enter an amount to convert.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          A cup is a volume, a gram is a weight, and nothing converts between
          them without knowing what is in the cup — flour is 120 g a cup, honey
          is 340 g. Flour is the worst offender even at fixed volume: scooped
          straight from the bag it packs to 150 g or more, against 120 g spooned
          in and levelled. If a recipe gives grams, weigh it; that is why the
          author wrote it that way.
        </span>
      </p>
    </div>
  );
}
