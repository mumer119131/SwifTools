"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
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
import { cn } from "@/lib/utils";
import { useClientValue } from "@/lib/use-client-value";
import {
  commonZones,
  dayKeyIn,
  detectZone,
  nowFields,
  isWorkingHour,
  readZone,
  zoneLabel,
  zonedTimeToInstant,
} from "./logic";

const DEFAULT_ZONES = ["America/New_York", "Europe/London", "Asia/Kolkata", "Asia/Tokyo"];

export default function TimezoneConverterTool() {
  // Read on the client so the statically rendered HTML never bakes in a
  // build-time "now" or the server's timezone.
  const detectedZone = useClientValue(detectZone, "UTC");
  const now = useClientValue(nowFields, { date: "", time: "" });

  const [baseOverride, setBaseOverride] = React.useState<string | null>(null);
  const [extraZones, setExtraZones] = React.useState<string[]>(DEFAULT_ZONES);
  const [dateOverride, setDateOverride] = React.useState<string | null>(null);
  const [timeOverride, setTimeOverride] = React.useState<string | null>(null);
  const [addZone, setAddZone] = React.useState("");

  const baseZone = baseOverride ?? detectedZone;
  const setBaseZone = setBaseOverride;
  const date = dateOverride ?? now.date;
  const setDate = setDateOverride;
  const time = timeOverride ?? now.time;
  const setTime = setTimeOverride;

  // The detected zone always leads the list without being stored separately.
  const zones = React.useMemo(
    () => (extraZones.includes(detectedZone) ? extraZones : [detectedZone, ...extraZones]),
    [extraZones, detectedZone],
  );

  const instant = React.useMemo(
    () => (date && time ? zonedTimeToInstant(date, time, baseZone) : null),
    [date, time, baseZone],
  );

  const referenceDay = instant ? dayKeyIn(instant, baseZone) : "";

  const readings = React.useMemo(
    () => (instant ? zones.map((zone) => readZone(instant, zone, referenceDay)) : []),
    [instant, zones, referenceDay],
  );

  /** Hour-by-hour strip: each column is one hour offset from the chosen time. */
  const strip = React.useMemo(() => {
    if (!instant) return [];
    return Array.from({ length: 24 }, (_, index) => {
      const shifted = new Date(instant.getTime() + (index - 12) * 3600_000);
      return {
        offsetHours: index - 12,
        cells: zones.map((zone) => readZone(shifted, zone, referenceDay)),
      };
    });
  }, [instant, zones, referenceDay]);

  const available = commonZones.filter((zone) => !zones.includes(zone));

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="tz-date">Date</Label>
          <Input
            id="tz-date"
            type="date"
            value={date}
            onChange={(event) => setDate(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tz-time">Time</Label>
          <Input
            id="tz-time"
            type="time"
            value={time}
            onChange={(event) => setTime(event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="tz-base">In this zone</Label>
          <Select value={baseZone} onValueChange={setBaseZone}>
            <SelectTrigger id="tz-base">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {[...new Set([baseZone, ...commonZones])].map((zone) => (
                <SelectItem key={zone} value={zone}>
                  {zoneLabel(zone)} — {zone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <FieldHint className="sm:col-span-3">
          Your own timezone is detected automatically. Daylight saving is applied from the system
          timezone database, so a date in June and one in December give different offsets.
        </FieldHint>
      </div>

      <div className="flex flex-wrap items-end gap-3">
        <div className="min-w-56 flex-1 space-y-2">
          <Label htmlFor="tz-add">Add a zone</Label>
          <Select value={addZone} onValueChange={setAddZone}>
            <SelectTrigger id="tz-add">
              <SelectValue placeholder="Choose a city…" />
            </SelectTrigger>
            <SelectContent>
              {available.map((zone) => (
                <SelectItem key={zone} value={zone}>
                  {zoneLabel(zone)} — {zone}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <Button
          variant="outline"
          onClick={() => {
            if (!addZone) return;
            setExtraZones((current) => [...current, addZone]);
            setAddZone("");
          }}
          disabled={!addZone}
        >
          <Plus strokeWidth={1.75} />
          Add
        </Button>
      </div>

      {readings.length > 0 ? (
        <section className="surface-card overflow-hidden">
          <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
            Local times
          </h2>
          <ul className="divide-y divide-border">
            {readings.map((reading) => (
              <li key={reading.zone} className="flex items-center gap-4 px-5 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm text-foreground">
                    {reading.label}
                    {reading.zone === baseZone ? (
                      <span className="ml-2 text-xs text-subtle-foreground">reference</span>
                    ) : null}
                  </p>
                  <p className="truncate text-xs text-muted-foreground">
                    {reading.zone} · {reading.offset}
                  </p>
                </div>

                <div className="shrink-0 text-right">
                  <p className="font-mono text-lg text-foreground" data-numeric>
                    {reading.time}
                  </p>
                  <p className="text-xs text-muted-foreground" data-numeric>
                    {reading.weekday} {reading.date}
                  </p>
                </div>

                {reading.dayShift !== 0 ? (
                  <Badge variant="outline" className="shrink-0">
                    {reading.dayShift > 0 ? "+1 day" : "−1 day"}
                  </Badge>
                ) : null}

                <Button
                  variant="ghost"
                  size="icon"
                  className="size-9 shrink-0"
                  onClick={() => setExtraZones((current) => current.filter((zone) => zone !== reading.zone))}
                  aria-label={`Remove ${reading.label}`}
                  disabled={zones.length <= 1}
                >
                  <X strokeWidth={1.75} />
                </Button>
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {strip.length > 0 ? (
        <section className="surface-card overflow-hidden">
          <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
            Find an overlapping hour
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse text-xs">
              <caption className="sr-only">
                Local hour in each zone, from twelve hours before to eleven hours after the selected
                time. Shaded cells fall within 09:00–18:00 local time.
              </caption>
              <thead>
                <tr>
                  <th scope="col" className="sticky left-0 z-10 bg-surface px-3 py-2 text-left font-medium text-muted-foreground">
                    Zone
                  </th>
                  {strip.map((column) => (
                    <th
                      key={column.offsetHours}
                      scope="col"
                      className={cn(
                        "px-1 py-2 text-center font-mono font-normal text-subtle-foreground",
                        column.offsetHours === 0 && "text-foreground",
                      )}
                    >
                      {column.offsetHours === 0 ? "now" : column.offsetHours > 0 ? `+${column.offsetHours}` : column.offsetHours}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {zones.map((zone, rowIndex) => (
                  <tr key={zone} className="border-t border-border">
                    <th
                      scope="row"
                      className="sticky left-0 z-10 whitespace-nowrap bg-surface px-3 py-2 text-left font-normal text-foreground"
                    >
                      {zoneLabel(zone)}
                    </th>
                    {strip.map((column) => {
                      const cell = column.cells[rowIndex];
                      const working = isWorkingHour(cell.hour);
                      return (
                        <td
                          key={column.offsetHours}
                          className={cn(
                            "px-1 py-2 text-center font-mono",
                            working
                              ? "bg-[color-mix(in_oklab,var(--success)_16%,transparent)] text-foreground"
                              : "text-subtle-foreground",
                            column.offsetHours === 0 && "ring-1 ring-inset ring-border-strong",
                          )}
                          data-numeric
                        >
                          {String(cell.hour).padStart(2, "0")}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <p className="border-t border-border px-5 py-3 text-xs text-muted-foreground">
            Shaded cells are 09:00–18:00 local. A column shaded all the way down is a slot that
            works for everyone.
          </p>
        </section>
      ) : null}
    </div>
  );
}
