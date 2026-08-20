"use client";

import * as React from "react";
import { ArrowLeftRight, Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { EXAMPLES, MAX, RULES, fromRoman, toRoman } from "./logic";

export default function RomanNumeralConverterTool() {
  const [direction, setDirection] = React.useState<"toRoman" | "toNumber">("toRoman");
  const [number, setNumber] = React.useState("2026");
  const [roman, setRoman] = React.useState("MMXXVI");

  const encoded = toRoman(Number(number));
  const decoded = fromRoman(roman);

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-end gap-3">
        <Button
          variant="outline"
          onClick={() => setDirection((d) => (d === "toRoman" ? "toNumber" : "toRoman"))}
        >
          <ArrowLeftRight strokeWidth={1.75} />
          {direction === "toRoman" ? "Number → Roman" : "Roman → Number"}
        </Button>

        <div className="space-y-1.5">
          <Label htmlFor="value">{direction === "toRoman" ? "Number" : "Roman numeral"}</Label>
          <Input
            id="value"
            value={direction === "toRoman" ? number : roman}
            onChange={(event) =>
              direction === "toRoman"
                ? setNumber(event.target.value)
                : setRoman(event.target.value.toUpperCase())
            }
            className="w-48 font-mono text-lg"
            spellCheck={false}
            aria-invalid={direction === "toRoman" ? encoded === null : "error" in decoded}
          />
        </div>
      </div>

      {direction === "toRoman" ? (
        encoded ? (
          <div className="surface-card px-6 py-5">
            <div className="text-xs text-muted-foreground">{number} in Roman numerals</div>
            <div className="mt-1 flex flex-wrap items-center gap-3">
              <span
                className="font-display tracking-[0.08em] text-foreground"
                style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)" }}
              >
                {encoded}
              </span>
              <CopyButton value={encoded} />
            </div>
          </div>
        ) : (
          <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
            Enter a whole number between 1 and {MAX}. Roman numerals have no zero,
            no negatives and no way to write beyond {MAX} without an overbar.
          </p>
        )
      ) : "error" in decoded ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {decoded.error}
        </p>
      ) : (
        <div className="surface-card px-6 py-5">
          <div className="text-xs text-muted-foreground">{decoded.canonical} in numbers</div>
          <div className="mt-1 flex flex-wrap items-center gap-3">
            <span
              className="font-display text-foreground"
              style={{ fontSize: "clamp(2rem, 8vw, 3.5rem)" }}
              data-numeric
            >
              {decoded.value.toLocaleString()}
            </span>
            <CopyButton value={String(decoded.value)} />
          </div>
        </div>
      )}

      <section>
        <h2 className="text-sm font-medium text-foreground">The ones people look up</h2>
        <ul className="mt-3 grid gap-2 sm:grid-cols-2 lg:grid-cols-4">
          {EXAMPLES.map((example) => (
            <li key={example.value}>
              <button
                type="button"
                onClick={() => {
                  setNumber(String(example.value));
                  setRoman(example.roman);
                }}
                className="w-full rounded-md border border-border px-3 py-2 text-left transition-colors hover:border-border-strong"
              >
                <span className="font-mono text-sm text-foreground">{example.roman}</span>
                <span className="ml-2 text-xs text-muted-foreground" data-numeric>
                  {example.value}
                </span>
                {example.note ? (
                  <span className="mt-0.5 block text-xs text-subtle-foreground">{example.note}</span>
                ) : null}
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section>
        <h2 className="text-sm font-medium text-foreground">The rules</h2>
        <dl className="mt-3 space-y-3">
          {RULES.map((entry) => (
            <div key={entry.rule} className="border-l-2 border-border pl-4">
              <dt className="text-sm text-foreground">{entry.rule}</dt>
              <dd className="mt-0.5 text-sm text-muted-foreground">{entry.detail}</dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Malformed numerals are refused rather than guessed at. Most converters
          happily read <code className="font-mono">IC</code> as 99 and{" "}
          <code className="font-mono">IIII</code> as 4 — both are wrong, and an
          answer you have no reason to doubt is worse than no answer.
        </span>
      </p>
    </div>
  );
}
