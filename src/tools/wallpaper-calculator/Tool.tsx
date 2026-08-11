"use client";

import * as React from "react";

import { MaterialResult } from "@/components/shared/MaterialResult";
import { DEFAULT_ROOM, RoomDimensions, type RoomState } from "@/components/shared/RoomDimensions";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MATCH_TYPES, estimate, type MatchType } from "./logic";

const FEET_PER_METRE = 3.280839895013123;

export default function WallpaperCalculatorTool() {
  const [room, setRoom] = React.useState<RoomState>(DEFAULT_ROOM);
  const [rollWidth, setRollWidth] = React.useState("20.5");
  const [rollLength, setRollLength] = React.useState("33");
  const [repeat, setRepeat] = React.useState("21");
  const [match, setMatch] = React.useState<MatchType>("straight");
  const [doors, setDoors] = React.useState("1");
  const [windows, setWindows] = React.useState("1");
  const [price, setPrice] = React.useState("55");

  // Everything downstream works in feet, whichever unit the room was typed in.
  const scale = room.unit === "ft" ? 1 : FEET_PER_METRE;
  const perimeterFt = (2 * (Number(room.length) + Number(room.width)) || 0) * scale;
  const heightFt = (Number(room.height) || 0) * scale;

  const result = estimate(
    perimeterFt,
    heightFt,
    Number(doors),
    Number(windows),
    Number(rollWidth),
    Number(rollLength),
    Number(repeat),
    match,
    Number(price),
  );

  return (
    <div className="space-y-5">
      <RoomDimensions
        value={room}
        onChange={setRoom}
        showHeight
        hint="Only the perimeter and height are used — wallpaper hangs in strips, not by floor area."
      />

      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="wp-width">Roll width (in)</Label>
          <Input
            id="wp-width"
            type="number"
            inputMode="decimal"
            min={0}
            value={rollWidth}
            onChange={(event) => setRollWidth(event.target.value)}
          />
          <FieldHint>20.5&Prime; American, 21&Prime; (53 cm) European.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="wp-length">Roll length (ft)</Label>
          <Input
            id="wp-length"
            type="number"
            inputMode="decimal"
            min={0}
            value={rollLength}
            onChange={(event) => setRollLength(event.target.value)}
          />
          <FieldHint>33 ft (10 m) is the standard European roll.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="wp-repeat">Pattern repeat (in)</Label>
          <Input
            id="wp-repeat"
            type="number"
            inputMode="decimal"
            min={0}
            value={repeat}
            onChange={(event) => setRepeat(event.target.value)}
          />
          <FieldHint>0 for a plain paper. Printed on the label.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="wp-match">Pattern match</Label>
          <Select value={match} onValueChange={(value) => setMatch(value as MatchType)}>
            <SelectTrigger id="wp-match">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MATCH_TYPES.map((entry) => (
                <SelectItem key={entry.id} value={entry.id}>
                  {entry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldHint>{MATCH_TYPES.find((entry) => entry.id === match)?.note}</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="wp-doors">Doors</Label>
          <Input
            id="wp-doors"
            type="number"
            inputMode="numeric"
            min={0}
            value={doors}
            onChange={(event) => setDoors(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="wp-windows">Windows</Label>
          <Input
            id="wp-windows"
            type="number"
            inputMode="numeric"
            min={0}
            value={windows}
            onChange={(event) => setWindows(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="wp-price">Price per roll</Label>
          <Input
            id="wp-price"
            type="number"
            inputMode="decimal"
            min={0}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </div>
      </div>

      <MaterialResult
        headlineLabel="Rolls to buy"
        headline={String(result.rolls)}
        copyValue={`${result.rolls} rolls`}
        cost={result.cost}
        stats={[
          {
            label: "Drops needed",
            value: String(result.dropsNeeded),
            detail: `${result.perimeterFt.toFixed(1)} ft of wall`,
          },
          {
            label: "Length per drop",
            value: `${result.dropLengthFt.toFixed(2)} ft`,
            detail: "Rounded to a whole repeat",
          },
          { label: "Drops per roll", value: String(result.dropsPerRoll) },
          {
            label: "Offcut per roll",
            value: `${result.wastePerRollFt.toFixed(2)} ft`,
            detail: "Unusable remainder",
          },
        ]}
        footnote={
          <>
            The pattern repeat is what decides the answer. Every drop has to
            start at the same point in the pattern, so each is cut to the next
            whole repeat above the wall height — a tall repeat on a short wall
            can waste a third of every roll. Buy all rolls in one batch number,
            and buy one spare: a discontinued paper cannot be topped up later.
          </>
        }
      />
    </div>
  );
}
