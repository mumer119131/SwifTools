"use client";

import * as React from "react";
import { Search, TriangleAlert } from "lucide-react";

import type { DnsType } from "@/app/api/dns/route";
import { CopyButton } from "@/components/shared/CopyButton";
import { Spinner } from "@/components/shared/Progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { RECORD_TYPES, fetchDns } from "./logic";

export default function DnsLookupTool() {
  const [name, setName] = React.useState("");
  const [type, setType] = React.useState<DnsType>("A");
  const [records, setRecords] = React.useState<string[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [loading, setLoading] = React.useState(false);

  const blurb = RECORD_TYPES.find((entry) => entry.id === type)?.blurb ?? "";

  async function run(nextType: DnsType = type) {
    const trimmed = name.trim();
    if (trimmed === "") return;

    setLoading(true);
    setError(null);

    try {
      const result = await fetchDns(trimmed, nextType);
      setRecords(result.records);
    } catch (cause) {
      setError(cause instanceof Error ? cause.message : "The lookup failed.");
      setRecords(null);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="space-y-5">
      <form
        className="space-y-2"
        onSubmit={(event) => {
          event.preventDefault();
          void run();
        }}
      >
        <Label htmlFor="dns-name">Domain name</Label>
        <div className="flex gap-2">
          <Input
            id="dns-name"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="example.com"
            autoCapitalize="off"
            autoCorrect="off"
            spellCheck={false}
          />
          <Button type="submit" disabled={loading || name.trim() === ""}>
            {loading ? <Spinner className="text-current" /> : <Search strokeWidth={1.75} />}
            Look up
          </Button>
        </div>
        <FieldHint>A full domain such as example.com, without http:// or a path.</FieldHint>
      </form>

      <div className="space-y-2">
        <Label>Record type</Label>
        <div className="flex flex-wrap gap-2">
          {RECORD_TYPES.map((entry) => (
            <button
              key={entry.id}
              type="button"
              onClick={() => {
                setType(entry.id);
                if (name.trim() !== "") void run(entry.id);
              }}
              className={cn(
                "inline-flex h-9 items-center rounded-full border px-4 text-sm transition-colors duration-[180ms]",
                "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                entry.id === type
                  ? "border-border-strong bg-foreground text-background"
                  : "border-border bg-surface text-muted-foreground hover:text-foreground",
              )}
              aria-pressed={entry.id === type}
            >
              {entry.label}
            </button>
          ))}
        </div>
        <FieldHint>{blurb}</FieldHint>
      </div>

      {error !== null ? (
        <p className="flex items-start gap-2 rounded-lg border border-border bg-surface p-4 text-sm text-muted-foreground">
          <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          {error}
        </p>
      ) : null}

      {records !== null && error === null ? (
        records.length === 0 ? (
          <p className="rounded-lg border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
            No {type} records — the domain exists but publishes nothing of this type.
          </p>
        ) : (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h2 className="text-[0.9375rem] font-medium text-foreground">
                {records.length} {type} {records.length === 1 ? "record" : "records"}
              </h2>
              <CopyButton value={records.join("\n")} label="Copy all" />
            </div>
            <ul className="divide-y divide-border overflow-hidden rounded-lg border border-border bg-surface">
              {records.map((record, index) => (
                <li
                  key={`${record}-${index}`}
                  className="flex items-start gap-3 px-4 py-3 font-mono text-sm text-foreground"
                >
                  <span className="break-all">{record}</span>
                </li>
              ))}
            </ul>
          </div>
        )
      ) : null}
    </div>
  );
}
