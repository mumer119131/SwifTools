"use client";

import * as React from "react";
import { Lock, RefreshCw } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/use-client-value";
import {
  buildAlphabet,
  entropyBits,
  generatePassphrase,
  generatePassword,
  passphraseEntropyBits,
  rateStrength,
  type PasswordOptions,
} from "./logic";

type Mode = "random" | "passphrase";

export default function PasswordGeneratorTool() {
  const [mode, setMode] = React.useState<Mode>("random");
  const [length, setLength] = React.useState(20);
  const [options, setOptions] = React.useState<Omit<PasswordOptions, "length">>({
    lowercase: true,
    uppercase: true,
    digits: true,
    symbols: true,
    avoidAmbiguous: false,
  });

  const [words, setWords] = React.useState(5);
  const [separator, setSeparator] = React.useState("-");
  const [capitalise, setCapitalise] = React.useState(true);
  const [appendNumber, setAppendNumber] = React.useState(true);

  // A counter, not the password itself: the password is derived, and bumping
  // this is what asks for a fresh one.
  const [nonce, setNonce] = React.useState(0);
  const regenerate = React.useCallback(() => setNonce((value) => value + 1), []);

  // Gated on hydration because `crypto.getRandomValues` does not exist during
  // server rendering — and a password baked into static HTML would be identical
  // for every visitor, which would be a genuine security bug.
  const hydrated = useHydrated();
  const password = React.useMemo(
    () => {
      if (!hydrated) return "";
      return mode === "random"
        ? generatePassword({ ...options, length })
        : generatePassphrase({ words, separator, capitalise, appendNumber });
    },
    // `nonce` is deliberately a dependency — it is the regenerate trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hydrated, nonce, mode, options, length, words, separator, capitalise, appendNumber],
  );

  const alphabet = buildAlphabet({ ...options, length });
  const bits =
    mode === "random"
      ? entropyBits(alphabet.length, length)
      : passphraseEntropyBits(words, appendNumber);
  const strength = rateStrength(bits);

  const noCharsets = mode === "random" && alphabet.length === 0;

  const toggles = [
    { key: "lowercase" as const, label: "Lowercase a–z" },
    { key: "uppercase" as const, label: "Uppercase A–Z" },
    { key: "digits" as const, label: "Digits 0–9" },
    { key: "symbols" as const, label: "Symbols !@#$" },
    { key: "avoidAmbiguous" as const, label: "Avoid look-alike characters" },
  ];

  return (
    <div className="space-y-5">
      <Tabs value={mode} onValueChange={(value) => setMode(value as Mode)}>
        <TabsList>
          <TabsTrigger value="random">Random string</TabsTrigger>
          <TabsTrigger value="passphrase">Passphrase</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="surface-card space-y-4 p-5">
        <output
          className="block break-all rounded-md bg-surface-hover px-4 py-5 text-center font-mono text-lg text-foreground sm:text-xl"
          aria-live="polite"
          aria-label="Generated password"
        >
          {password || (noCharsets ? "Select at least one character set" : "…")}
        </output>

        <div className="flex flex-wrap items-center justify-center gap-2">
          <Button onClick={regenerate} disabled={noCharsets}>
            <RefreshCw strokeWidth={1.75} />
            Generate
          </Button>
          <CopyButton value={password} label="Copy password" size="default" disabled={!password} />
        </div>
      </div>

      {/* Strength meter — four segments plus a stated label and crack time, so
          the reading never depends on colour alone. */}
      <section className="space-y-2">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-sm font-medium text-foreground">{strength.label}</h2>
          <span className="font-mono text-sm text-muted-foreground" data-numeric>
            {bits.toFixed(0)} bits
          </span>
        </div>
        <div className="flex gap-1.5" role="img" aria-label={`Strength: ${strength.label}`}>
          {[0, 1, 2, 3].map((segment) => (
            <span
              key={segment}
              className={cn(
                "h-1.5 flex-1 rounded-full transition-colors duration-[180ms]",
                segment < strength.score
                  ? strength.score <= 1
                    ? "bg-destructive"
                    : strength.score === 2
                      ? "bg-[var(--accent-text)]"
                      : "bg-success"
                  : "bg-border",
              )}
            />
          ))}
        </div>
        <p className="text-sm text-muted-foreground">
          Around <span className="text-foreground">{strength.crackTime}</span> to crack offline at
          100 billion guesses per second.
        </p>
      </section>

      {mode === "random" ? (
        <div className="surface-card space-y-5 p-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="pw-length">Length</Label>
              <span className="font-mono text-sm text-muted-foreground" data-numeric>
                {length}
              </span>
            </div>
            <Slider
              id="pw-length"
              min={6}
              max={64}
              step={1}
              value={[length]}
              onValueChange={([value]) => setLength(value)}
              aria-label="Password length"
            />
            <FieldHint>
              16 or more is a sensible floor for anything that matters. Length buys far more
              security than exotic characters.
            </FieldHint>
          </div>

          <fieldset className="space-y-3">
            <legend className="text-sm font-medium text-foreground">Include</legend>
            {toggles.map((toggle) => (
              <div key={toggle.key} className="flex items-center gap-3">
                <Switch
                  id={`pw-${toggle.key}`}
                  checked={options[toggle.key]}
                  onCheckedChange={(value) =>
                    setOptions((current) => ({ ...current, [toggle.key]: value }))
                  }
                />
                <Label htmlFor={`pw-${toggle.key}`}>{toggle.label}</Label>
              </div>
            ))}
          </fieldset>
        </div>
      ) : (
        <div className="surface-card space-y-5 p-5">
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="pp-words">Words</Label>
              <span className="font-mono text-sm text-muted-foreground" data-numeric>
                {words}
              </span>
            </div>
            <Slider
              id="pp-words"
              min={3}
              max={10}
              step={1}
              value={[words]}
              onValueChange={([value]) => setWords(value)}
              aria-label="Number of words"
            />
            <FieldHint>
              Five words is roughly 40 bits before extras — use six or more for anything you
              can&rsquo;t afford to lose.
            </FieldHint>
          </div>

          <div className="space-y-2">
            <Label htmlFor="pp-separator">Separator</Label>
            <Input
              id="pp-separator"
              value={separator}
              onChange={(event) => setSeparator(event.target.value.slice(0, 3))}
              className="max-w-24 font-mono"
              maxLength={3}
            />
          </div>

          <div className="flex items-center gap-3">
            <Switch id="pp-capitalise" checked={capitalise} onCheckedChange={setCapitalise} />
            <Label htmlFor="pp-capitalise">Capitalise each word</Label>
          </div>
          <div className="flex items-center gap-3">
            <Switch id="pp-number" checked={appendNumber} onCheckedChange={setAppendNumber} />
            <Label htmlFor="pp-number">Append two digits</Label>
          </div>
        </div>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Lock className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Passwords are generated in your browser with <code className="font-mono">crypto.getRandomValues</code>{" "}
          and never transmitted or stored. Indices are drawn with rejection sampling rather than a
          modulo, so no character is more likely than any other. Reload the page and this one is
          gone — put it in a password manager now.
        </span>
      </p>
    </div>
  );
}
