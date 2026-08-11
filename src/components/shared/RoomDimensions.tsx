"use client";

import * as React from "react";

import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LengthUnit } from "@/lib/home";

export interface RoomState {
  length: string;
  width: string;
  height: string;
  unit: LengthUnit;
}

export const DEFAULT_ROOM: RoomState = { length: "12", width: "10", height: "8", unit: "ft" };

interface RoomDimensionsProps {
  value: RoomState;
  onChange: (next: RoomState) => void;
  /** Wall tools need the ceiling height; floor tools don't. */
  showHeight?: boolean;
  hint?: React.ReactNode;
}

/**
 * Length, width and optional height with a feet/metres toggle.
 *
 * Six of the home calculators start here, and the unit toggle only relabels —
 * switching it does not convert the numbers you already typed, because someone
 * flipping to metres is about to type metres, not asking to see 12 ft as 3.66.
 */
export function RoomDimensions({
  value,
  onChange,
  showHeight = false,
  hint,
}: RoomDimensionsProps) {
  const suffix = value.unit === "ft" ? "ft" : "m";

  function set(field: keyof RoomState, next: string) {
    onChange({ ...value, [field]: next });
  }

  return (
    <div className="surface-card space-y-4 p-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-foreground">Room</h2>
        <Tabs
          value={value.unit}
          onValueChange={(next) => onChange({ ...value, unit: next as LengthUnit })}
        >
          <TabsList>
            <TabsTrigger value="ft">Feet</TabsTrigger>
            <TabsTrigger value="m">Metres</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="grid gap-4 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="room-length">Length ({suffix})</Label>
          <Input
            id="room-length"
            type="number"
            inputMode="decimal"
            min={0}
            value={value.length}
            onChange={(event) => set("length", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="room-width">Width ({suffix})</Label>
          <Input
            id="room-width"
            type="number"
            inputMode="decimal"
            min={0}
            value={value.width}
            onChange={(event) => set("width", event.target.value)}
          />
        </div>
        {showHeight ? (
          <div className="space-y-2">
            <Label htmlFor="room-height">Wall height ({suffix})</Label>
            <Input
              id="room-height"
              type="number"
              inputMode="decimal"
              min={0}
              value={value.height}
              onChange={(event) => set("height", event.target.value)}
            />
          </div>
        ) : null}
      </div>

      {hint ? <FieldHint>{hint}</FieldHint> : null}
    </div>
  );
}

/** Floor area in square feet, whatever unit was typed. */
export function floorArea(room: RoomState): number {
  const length = Number(room.length);
  const width = Number(room.width);
  if (!(length > 0) || !(width > 0)) return 0;

  const area = length * width;
  // Both sides scale, so the conversion is the square of the length ratio.
  return room.unit === "ft" ? area : area * 10.763910416709722;
}

/** Total wall area in square feet — the perimeter times the height. */
export function wallArea(room: RoomState): number {
  const length = Number(room.length);
  const width = Number(room.width);
  const height = Number(room.height);
  if (!(length > 0) || !(width > 0) || !(height > 0)) return 0;

  const area = 2 * (length + width) * height;
  return room.unit === "ft" ? area : area * 10.763910416709722;
}
