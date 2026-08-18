"use client";

import * as React from "react";
import { AlertTriangle, Check, Eye, EyeOff, Info, ShieldAlert } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { assess, formatCrackTime } from "./logic";

const BAR_COLOURS = [
  "bg-destructive",
  "bg-destructive",
  "bg-[var(--warning)]",
  "bg-[var(--success)]",
  "bg-[var(--success)]",
];

const EXAMPLES = ["P@ssw0rd1", "correct horse battery staple", "qwerty123", "Tr0ub4dor&3"];

export default function PasswordStrengthCheckerTool() {
  const [password, setPassword] = React.useState("");
  const [visible, setVisible] = React.useState(false);

  const result = assess(password);

  return (
    <div className="space-y-5">
      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Everything is checked in your browser — nothing is transmitted, stored
          or logged, and there is no request to watch for. Even so, the sensible
          habit is not to type a password you are actually using into any web
          page. Try a variation of it instead.
        </span>
      </p>

      <div className="space-y-1.5">
        <Label htmlFor="password">Password</Label>
        <div className="relative">
          <Input
            id="password"
            type={visible ? "text" : "password"}
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            placeholder="Type or paste a password"
            className="pr-11 font-mono"
            autoComplete="off"
            spellCheck={false}
          />
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-1 top-1/2 size-8 -translate-y-1/2"
            onClick={() => setVisible((value) => !value)}
            aria-label={visible ? "Hide password" : "Show password"}
          >
            {visible ? <EyeOff className="size-4" strokeWidth={1.75} /> : <Eye className="size-4" strokeWidth={1.75} />}
          </Button>
        </div>
      </div>

      {result ? (
        <>
          <div className="space-y-2">
            <div className="flex items-baseline justify-between gap-3">
              <span
                className={cn(
                  "text-sm font-medium",
                  result.score <= 1
                    ? "text-destructive"
                    : result.score === 2
                      ? "text-[var(--warning)]"
                      : "text-[var(--success)]",
                )}
              >
                {result.label}
              </span>
              <span className="text-xs text-muted-foreground" data-numeric>
                {result.bits.toFixed(0)} bits of entropy
              </span>
            </div>
            <div className="flex gap-1.5" role="img" aria-label={`Strength: ${result.label}`}>
              {[0, 1, 2, 3].map((segment) => (
                <div
                  key={segment}
                  className={cn(
                    "h-1.5 flex-1 rounded-full transition-colors",
                    segment < result.score ? BAR_COLOURS[result.score] : "bg-border",
                  )}
                />
              ))}
            </div>
          </div>

          <div className="surface-card px-5 py-4">
            <div className="text-xs text-muted-foreground">
              Time to crack, guessed offline at 100 billion attempts a second
            </div>
            <div
              className={cn(
                "mt-1 font-mono text-xl",
                result.score <= 1 ? "text-destructive" : "text-foreground",
              )}
            >
              {formatCrackTime(result.crackSeconds)}
            </div>
          </div>

          {result.findings.length > 0 ? (
            <ul className="space-y-2">
              {result.findings.map((finding) => (
                <li
                  key={finding.message}
                  className={cn(
                    "flex items-start gap-2 rounded-md border px-4 py-3 text-sm",
                    finding.kind === "critical"
                      ? "border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] text-foreground"
                      : finding.kind === "warning"
                        ? "border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] text-foreground"
                        : "border-border bg-surface text-muted-foreground",
                  )}
                >
                  {finding.kind === "critical" ? (
                    <ShieldAlert className="mt-0.5 size-4 shrink-0 text-destructive" strokeWidth={1.75} />
                  ) : finding.kind === "warning" ? (
                    <AlertTriangle className="mt-0.5 size-4 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
                  ) : (
                    <Check className="mt-0.5 size-4 shrink-0 text-[var(--success)]" strokeWidth={2} />
                  )}
                  {finding.message}
                </li>
              ))}
            </ul>
          ) : null}
        </>
      ) : (
        <div className="space-y-3">
          <p className="text-sm text-muted-foreground">Try one of these to see the difference:</p>
          <div className="flex flex-wrap gap-2">
            {EXAMPLES.map((example) => (
              <button
                key={example}
                type="button"
                onClick={() => {
                  setPassword(example);
                  setVisible(true);
                }}
                className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
              >
                {example}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
