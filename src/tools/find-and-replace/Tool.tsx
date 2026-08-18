"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { PRESETS, replace, type Options } from "./logic";

const SAMPLE = `The quick brown fox jumps over the lazy dog.
The dog barks.  The fox runs.

Contact:  hello@example.com   or   support@example.com`;

export default function FindAndReplaceTool() {
  const [input, setInput] = React.useState(SAMPLE);
  const [options, setOptions] = React.useState<Options>({
    find: "the",
    replace: "a",
    regex: false,
    caseSensitive: false,
    wholeWord: true,
    multiline: false,
  });

  const outcome = replace(input, options);

  function set<K extends keyof Options>(key: K, value: Options[K]) {
    setOptions((current) => ({ ...current, [key]: value }));
  }

  const toggles: { key: keyof Options; label: string; hint: string }[] = [
    { key: "regex", label: "Regular expression", hint: "Off means your term is matched literally." },
    { key: "caseSensitive", label: "Case sensitive", hint: "Off matches THE, The and the." },
    { key: "wholeWord", label: "Whole word", hint: "\"cat\" will not match \"category\"." },
    { key: "multiline", label: "Multiline", hint: "^ and $ anchor to each line." },
  ];

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fr-find">Find</Label>
          <Input
            id="fr-find"
            value={options.find}
            onChange={(event) => set("find", event.target.value)}
            className="font-mono"
            spellCheck={false}
            aria-invalid={!outcome.ok}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="fr-replace">Replace with</Label>
          <Input
            id="fr-replace"
            value={options.replace}
            onChange={(event) => set("replace", event.target.value)}
            className="font-mono"
            spellCheck={false}
            placeholder="Leave empty to delete"
          />
        </div>

        <div className="grid gap-3 sm:col-span-2 sm:grid-cols-2 lg:grid-cols-4">
          {toggles.map((toggle) => (
            <div key={toggle.key} className="space-y-1">
              <div className="flex items-center gap-3">
                <Switch
                  id={`fr-${toggle.key}`}
                  checked={options[toggle.key] as boolean}
                  onCheckedChange={(value) => set(toggle.key, value as never)}
                />
                <Label htmlFor={`fr-${toggle.key}`}>{toggle.label}</Label>
              </div>
              <FieldHint>{toggle.hint}</FieldHint>
            </div>
          ))}
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {PRESETS.map((preset) => (
          <Button
            key={preset.label}
            variant="outline"
            size="sm"
            onClick={() =>
              setOptions((current) => ({
                ...current,
                find: preset.find,
                replace: preset.replace,
                regex: preset.regex,
                wholeWord: false,
                multiline: preset.find.includes("$") || preset.find.includes("^"),
              }))
            }
          >
            {preset.label}
          </Button>
        ))}
      </div>

      {!outcome.ok ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {outcome.error}
        </p>
      ) : (
        <div className="flex flex-wrap items-center gap-3 text-sm">
          <span className="text-muted-foreground">
            <span className="font-mono text-foreground" data-numeric>
              {outcome.count}
            </span>{" "}
            {outcome.count === 1 ? "match" : "matches"}
          </span>
          {outcome.matches.length > 0 ? (
            <span className="flex flex-wrap gap-1.5">
              {outcome.matches.map((match) => (
                <code
                  key={match}
                  className="rounded bg-surface-hover px-1.5 py-0.5 font-mono text-xs text-muted-foreground"
                >
                  {match === "" ? "(empty)" : match}
                </code>
              ))}
            </span>
          ) : null}
        </div>
      )}

      <div className="grid gap-4 lg:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="fr-input">Input</Label>
          <Textarea
            id="fr-input"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            rows={16}
            spellCheck={false}
            className="font-mono text-sm"
          />
        </div>
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <Label htmlFor="fr-output">Result</Label>
            <CopyButton value={outcome.ok ? outcome.output : ""} label="Copy" />
          </div>
          <Textarea
            id="fr-output"
            value={outcome.ok ? outcome.output : ""}
            readOnly
            rows={16}
            spellCheck={false}
            className="font-mono text-sm"
          />
        </div>
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          With regex off, both your search term and the replacement are escaped
          — so searching for <code className="font-mono">a.b</code> finds
          exactly that, and replacing with <code className="font-mono">$5</code>{" "}
          inserts $5 rather than being read as a backreference. A pattern that
          can match nothing is refused rather than performed, because replacing
          it would insert your text between every character.
        </span>
      </p>
    </div>
  );
}
