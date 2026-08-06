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
import { formatUuids, generateUuids, timestampFromV7, type UuidFormat, type UuidVersion } from "./logic";

export default function UuidGeneratorTool() {
  const [version, setVersion] = React.useState<UuidVersion>("v4");
  const [count, setCount] = React.useState(5);
  const [format, setFormat] = React.useState<UuidFormat>("plain");
  // A counter is the regenerate trigger; the list itself is derived.
  const [seed, setSeed] = React.useState(0);

  const uuids = React.useMemo(
    () => generateUuids(version, count),
    // `seed` is intentionally part of the dependency list: bumping it is what
    // produces a fresh batch on demand.
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [version, count, seed],
  );

  const output = formatUuids(uuids, format);
  const firstTimestamp = version === "v7" ? timestampFromV7(uuids[0]) : null;

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="uuid-version">Version</Label>
          <Select value={version} onValueChange={(value) => setVersion(value as UuidVersion)}>
            <SelectTrigger id="uuid-version">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="v4">v4 — random</SelectItem>
              <SelectItem value="v7">v7 — time-ordered</SelectItem>
              <SelectItem value="nil">Nil UUID</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="uuid-count">How many</Label>
          <Input
            id="uuid-count"
            type="number"
            min={1}
            max={1000}
            value={count}
            onChange={(event) =>
              setCount(Math.max(1, Math.min(1000, Number(event.target.value) || 1)))
            }
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="uuid-format">Format</Label>
          <Select value={format} onValueChange={(value) => setFormat(value as UuidFormat)}>
            <SelectTrigger id="uuid-format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="plain">Plain</SelectItem>
              <SelectItem value="uppercase">UPPERCASE</SelectItem>
              <SelectItem value="braced">{"{braced}"}</SelectItem>
              <SelectItem value="no-dashes">No dashes</SelectItem>
              <SelectItem value="json-array">JSON array</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <FieldHint className="sm:col-span-3">
          {version === "v7"
            ? "v7 starts with a millisecond timestamp, so IDs sort by creation time. Better than v4 as a database primary key — sequential inserts instead of scattered ones."
            : version === "v4"
              ? "v4 is 122 bits of cryptographic randomness. The safe default when you just need a unique identifier."
              : "The nil UUID is all zeroes — used as a null placeholder where the column can't be nullable."}
        </FieldHint>
      </div>

      <CodeOutput
        value={output}
        label={`${uuids.length} UUID${uuids.length === 1 ? "" : "s"}`}
        fileName="uuids.txt"
        actions={
          <Button variant="outline" size="sm" onClick={() => setSeed((value) => value + 1)}>
            <RefreshCw strokeWidth={1.75} />
            Regenerate
          </Button>
        }
      />

      {firstTimestamp ? (
        <p className="text-sm text-muted-foreground">
          Timestamp decoded from the first v7 UUID:{" "}
          <span className="font-mono text-foreground" data-numeric>
            {firstTimestamp.toISOString()}
          </span>
        </p>
      ) : null}
    </div>
  );
}
