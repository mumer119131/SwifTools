"use client";

import * as React from "react";
import { Info } from "lucide-react";

import { DEFAULT_ROOM, RoomDimensions, type RoomState } from "@/components/shared/RoomDimensions";
import { CopyButton } from "@/components/shared/CopyButton";
import { metrics } from "./logic";

function number(value: number, digits = 1): string {
  return value.toLocaleString("en-US", { maximumFractionDigits: digits });
}

export default function RoomSizeCalculatorTool() {
  const [room, setRoom] = React.useState<RoomState>(DEFAULT_ROOM);

  const result = metrics(
    Number(room.length),
    Number(room.width),
    Number(room.height),
    room.unit,
  );

  return (
    <div className="space-y-5">
      <RoomDimensions
        value={room}
        onChange={setRoom}
        showHeight
        hint="Measure wall to wall at the widest point, floor to ceiling for the height."
      />

      {result ? (
        <>
          <div className="surface-card p-6 text-center">
            <p className="text-xs text-muted-foreground">Floor area</p>
            <p
              className="mt-2 flex items-baseline justify-center gap-3 font-mono text-4xl tracking-[-0.03em] text-foreground sm:text-5xl"
              data-numeric
              aria-live="polite"
            >
              {number(result.floorSqft)} sq ft
              <CopyButton
                value={`${number(result.floorSqft)} sq ft (${number(result.floorSqm, 2)} m²)`}
                iconOnly
                label="Copy floor area"
              />
            </p>
            <p className="mt-2 text-sm text-muted-foreground">
              {number(result.floorSqm, 2)} m² · {number(result.floorSqft / 9, 2)} sq yd
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {[
              { label: "Wall area", value: `${number(result.wallSqft)} sq ft`, detail: "All four walls, no deductions" },
              { label: "Ceiling area", value: `${number(result.ceilingSqft)} sq ft`, detail: "Same as the floor" },
              { label: "Perimeter", value: `${number(result.perimeterFt)} ft`, detail: "For skirting and trim" },
              { label: "Volume", value: `${number(result.volumeFt3)} ft³`, detail: `${number(result.volumeM3, 1)} m³` },
              { label: "Cooling load", value: `${number(result.coolingBtu, 0)} BTU/h`, detail: "20 BTU per sq ft" },
              { label: "Heating load", value: `${number(result.heatingBtu, 0)} BTU/h`, detail: "35 BTU per sq ft" },
            ].map((card) => (
              <div key={card.label} className="surface-card p-4">
                <dt className="text-xs text-muted-foreground">{card.label}</dt>
                <dd className="mt-1 font-mono text-base text-foreground" data-numeric>
                  {card.value}
                </dd>
                <dd className="mt-0.5 text-xs text-subtle-foreground">{card.detail}</dd>
              </div>
            ))}
          </dl>

          {result.rug ? (
            <p className="surface-card px-5 py-4 text-sm text-muted-foreground">
              A{" "}
              <span className="font-mono text-foreground">
                {result.rug.width}&prime; × {result.rug.length}&prime;
              </span>{" "}
              rug is the largest standard size that leaves a border of floor
              showing on every side.
            </p>
          ) : null}
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Enter all three dimensions to see the measurements.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          The heating and cooling figures are the square-footage rules of thumb
          contractors use for a first pass. They ignore insulation, window area,
          ceiling height, climate and which way the room faces — all of which
          matter enough that a real sizing calculation (a Manual J load) can land
          well either side of these numbers. Use them to sanity-check a quote,
          not to buy a unit.
        </span>
      </p>
    </div>
  );
}
