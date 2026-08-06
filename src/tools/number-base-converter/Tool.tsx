"use client";

import * as React from "react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/misc";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { analyseBits, groupDigits, parseInBase, presetBases, toBase } from "./logic";

export default function NumberBaseConverterTool() {
  // The parsed value is the single source of truth; each field renders from it,
  // except the one being typed in, which keeps the raw text so partial input
  // isn't reformatted mid-keystroke.
  const [value, setValue] = React.useState<bigint | null>(255n);
  const [editing, setEditing] = React.useState<number | null>(null);
  const [draft, setDraft] = React.useState("");
  const [customBase, setCustomBase] = React.useState("36");
  const [invalidBase, setInvalidBase] = React.useState<number | null>(null);

  function handleChange(base: number, text: string) {
    setEditing(base);
    setDraft(text);

    if (!text.trim()) {
      setValue(null);
      setInvalidBase(null);
      return;
    }

    const parsed = parseInBase(text, base);
    if (parsed === null) {
      setInvalidBase(base);
      return;
    }
    setInvalidBase(null);
    setValue(parsed);
  }

  const displayFor = (base: number) => {
    if (editing === base) return draft;
    return value === null ? "" : toBase(value, base);
  };

  const custom = Number(customBase);
  const bits = value === null ? null : analyseBits(value);

  return (
    <div className="space-y-5">
      <div className="space-y-4">
        {presetBases.map((preset) => {
          const text = displayFor(preset.base);
          const isInvalid = invalidBase === preset.base;
          return (
            <div key={preset.base} className="space-y-2">
              <div className="flex items-center justify-between gap-3">
                <Label htmlFor={`base-${preset.base}`}>
                  {preset.label}{" "}
                  <span className="font-mono text-xs text-subtle-foreground">
                    base {preset.base}
                  </span>
                </Label>
                <CopyButton value={text} iconOnly label={`Copy ${preset.label}`} />
              </div>
              <div className="flex items-center gap-2">
                {preset.prefix ? (
                  <span className="w-8 shrink-0 font-mono text-sm text-subtle-foreground">
                    {preset.prefix}
                  </span>
                ) : (
                  <span className="w-8 shrink-0" aria-hidden="true" />
                )}
                <Input
                  id={`base-${preset.base}`}
                  value={text}
                  onChange={(event) => handleChange(preset.base, event.target.value)}
                  onBlur={() => setEditing(null)}
                  className="font-mono"
                  spellCheck={false}
                  autoCapitalize="off"
                  autoCorrect="off"
                  inputMode={preset.base === 10 ? "numeric" : "text"}
                  aria-invalid={isInvalid}
                />
              </div>
              {isInvalid ? (
                <p role="alert" className="text-xs text-destructive">
                  Not a valid base-{preset.base} number.
                </p>
              ) : text && text.length > 4 ? (
                <p className="font-mono text-xs text-subtle-foreground" data-numeric>
                  {groupDigits(text, preset.base)}
                </p>
              ) : null}
            </div>
          );
        })}
      </div>

      <div className="surface-card space-y-3 p-5">
        <div className="flex flex-wrap items-end gap-3">
          <div className="space-y-2">
            <Label htmlFor="custom-base">Custom base</Label>
            <Select value={customBase} onValueChange={setCustomBase}>
              <SelectTrigger id="custom-base" className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Array.from({ length: 35 }, (_, index) => index + 2).map((base) => (
                  <SelectItem key={base} value={String(base)}>
                    Base {base}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="min-w-48 flex-1 space-y-2">
            <Label htmlFor="custom-value">Value in base {custom}</Label>
            <div className="flex items-center gap-2">
              <Input
                id="custom-value"
                value={displayFor(custom)}
                onChange={(event) => handleChange(custom, event.target.value)}
                onBlur={() => setEditing(null)}
                className="font-mono"
                spellCheck={false}
                autoCapitalize="off"
                aria-invalid={invalidBase === custom}
              />
              <CopyButton value={displayFor(custom)} iconOnly label="Copy custom base value" />
            </div>
          </div>
        </div>
        <FieldHint>
          Bases above 10 use letters as digits: base 16 goes 0–9 then a–f, base 36 runs all the way
          to z.
        </FieldHint>
      </div>

      {bits ? (
        <div className="flex flex-wrap items-center gap-2">
          <Badge variant="outline">
            <span data-numeric>{bits.bits}</span> bits
          </Badge>
          {bits.fitsIn ? <Badge>fits {bits.fitsIn}</Badge> : null}
          {bits.signedFitsIn ? <Badge>fits {bits.signedFitsIn}</Badge> : null}
          {value !== null && value < 0n ? <Badge variant="outline">negative</Badge> : null}
        </div>
      ) : null}

      <p className="text-sm text-muted-foreground">
        Conversion uses arbitrary-precision integers, so values beyond 2<sup>53</sup> stay exact —
        a 64-bit snowflake ID or a hash converts without losing its low digits, which is where
        naive converters quietly go wrong.
      </p>
    </div>
  );
}
