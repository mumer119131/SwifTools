"use client";

import * as React from "react";
import { RefreshCw } from "lucide-react";

import { CodeOutput } from "@/components/shared/CodeOutput";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useHydrated } from "@/lib/use-client-value";
import {
  fieldDefinitions,
  generateRows,
  serialise,
  type FieldId,
  type Format,
  type Row,
} from "./logic";

const DEFAULT_FIELDS: FieldId[] = ["id", "fullName", "email", "city", "date"];

export default function FakeDataGeneratorTool() {
  const [fields, setFields] = React.useState<FieldId[]>(DEFAULT_FIELDS);
  const [count, setCount] = React.useState(10);
  const [format, setFormat] = React.useState<Format>("json");
  const [tableName, setTableName] = React.useState("records");
  const [nonce, setNonce] = React.useState(0);
  const regenerate = React.useCallback(() => setNonce((value) => value + 1), []);

  // Gated on hydration: `crypto.randomUUID` and the RNG do not exist during
  // static rendering, and baked-in rows would be identical for every visitor.
  const hydrated = useHydrated();
  const rows: Row[] = React.useMemo(
    () => (hydrated && fields.length > 0 ? generateRows(fields, count) : []),
    // `nonce` is deliberately a dependency — it is the regenerate trigger.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [hydrated, nonce, fields, count],
  );

  const output = React.useMemo(
    () => serialise(rows, format, tableName),
    [rows, format, tableName],
  );

  const groups = React.useMemo(() => {
    const map = new Map<string, typeof fieldDefinitions>();
    for (const definition of fieldDefinitions) {
      map.set(definition.group, [...(map.get(definition.group) ?? []), definition]);
    }
    return [...map.entries()];
  }, []);

  function toggleField(id: FieldId) {
    setFields((current) =>
      current.includes(id) ? current.filter((field) => field !== id) : [...current, id],
    );
  }

  const extension = format === "json" ? "json" : format === "csv" ? "csv" : "sql";
  const mime =
    format === "json" ? "application/json" : format === "csv" ? "text/csv" : "text/plain";

  return (
    <div className="space-y-5">
      <fieldset className="space-y-4">
        <legend className="text-sm font-medium text-foreground">Fields</legend>
        {groups.map(([group, definitions]) => (
          <div key={group} className="space-y-2">
            <p className="text-xs text-subtle-foreground">{group}</p>
            <div className="flex flex-wrap gap-2">
              {definitions.map((definition) => {
                const active = fields.includes(definition.id);
                return (
                  <button
                    key={definition.id}
                    type="button"
                    role="switch"
                    aria-checked={active}
                    onClick={() => toggleField(definition.id)}
                    className={cn(
                      "inline-flex h-9 cursor-pointer items-center rounded-full border px-3.5 text-sm",
                      "transition-colors duration-[180ms] ease-out-expo",
                      "focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--ring)]",
                      active
                        ? "border-border-strong bg-surface-hover text-foreground"
                        : "border-border bg-surface text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {definition.label}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
        <FieldHint>
          Columns appear in the order you select them. {fields.length} selected.
        </FieldHint>
      </fieldset>

      <div className="surface-card grid gap-4 p-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="fake-count">Rows</Label>
          <Input
            id="fake-count"
            type="number"
            inputMode="numeric"
            min={1}
            max={1000}
            value={count}
            onChange={(event) =>
              setCount(Math.max(1, Math.min(1000, Number(event.target.value) || 1)))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="fake-format">Format</Label>
          <Select value={format} onValueChange={(value) => setFormat(value as Format)}>
            <SelectTrigger id="fake-format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="json">JSON</SelectItem>
              <SelectItem value="csv">CSV</SelectItem>
              <SelectItem value="sql">SQL inserts</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {format === "sql" ? (
          <div className="space-y-2">
            <Label htmlFor="fake-table">Table name</Label>
            <Input
              id="fake-table"
              value={tableName}
              onChange={(event) => setTableName(event.target.value)}
              className="font-mono"
              spellCheck={false}
            />
          </div>
        ) : null}
      </div>

      <CodeOutput
        value={output}
        label={`${rows.length} row${rows.length === 1 ? "" : "s"}`}
        fileName={`fake-data.${extension}`}
        mimeType={mime}
        placeholder="Select at least one field."
        actions={
          <Button variant="outline" size="sm" onClick={regenerate} disabled={fields.length === 0}>
            <RefreshCw strokeWidth={1.75} />
            Regenerate
          </Button>
        }
      />

      <p className="text-sm text-muted-foreground">
        Emails use <code className="font-mono">@example.com</code> and phone numbers use the{" "}
        <code className="font-mono">+1-555-01xx</code> range — both are reserved for fiction
        precisely so test fixtures can never reach a real inbox or ring a real person. Names and
        addresses are assembled from generic word lists and don&rsquo;t correspond to anyone.
      </p>
    </div>
  );
}
