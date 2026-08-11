"use client";

import * as React from "react";

import { MaterialResult } from "@/components/shared/MaterialResult";
import { DEFAULT_ROOM, RoomDimensions, floorArea, wallArea, type RoomState } from "@/components/shared/RoomDimensions";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PAINT_COVERAGE, formatMoney } from "@/lib/home";
import { estimate } from "./logic";

export default function PaintCalculatorTool() {
  const [room, setRoom] = React.useState<RoomState>(DEFAULT_ROOM);
  const [doors, setDoors] = React.useState("1");
  const [windows, setWindows] = React.useState("2");
  const [coats, setCoats] = React.useState("2");
  const [surface, setSurface] = React.useState("primed");
  const [includeCeiling, setIncludeCeiling] = React.useState(false);
  const [price, setPrice] = React.useState("45");

  const coverage = PAINT_COVERAGE.find((entry) => entry.id === surface) ?? PAINT_COVERAGE[1];

  const result = estimate(
    wallArea(room),
    Number(doors),
    Number(windows),
    Number(coats),
    coverage.sqftPerUnit,
    includeCeiling ? floorArea(room) : 0,
    Number(price),
  );

  return (
    <div className="space-y-5">
      <RoomDimensions
        value={room}
        onChange={setRoom}
        showHeight
        hint="Wall height is floor to ceiling — 8 ft in most homes, 9 or 10 in newer ones."
      />

      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="paint-doors">Doors</Label>
          <Input
            id="paint-doors"
            type="number"
            inputMode="numeric"
            min={0}
            value={doors}
            onChange={(event) => setDoors(event.target.value)}
          />
          <FieldHint>21 sq ft each comes off.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paint-windows">Windows</Label>
          <Input
            id="paint-windows"
            type="number"
            inputMode="numeric"
            min={0}
            value={windows}
            onChange={(event) => setWindows(event.target.value)}
          />
          <FieldHint>15 sq ft each comes off.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paint-coats">Coats</Label>
          <Input
            id="paint-coats"
            type="number"
            inputMode="numeric"
            min={1}
            max={5}
            value={coats}
            onChange={(event) => setCoats(event.target.value)}
          />
          <FieldHint>Two, unless you are painting the same colour again.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paint-surface">Surface</Label>
          <Select value={surface} onValueChange={setSurface}>
            <SelectTrigger id="paint-surface">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {PAINT_COVERAGE.map((entry) => (
                <SelectItem key={entry.id} value={entry.id}>
                  {entry.label} — {entry.sqftPerUnit} sq ft/gal
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="paint-price">Price per gallon</Label>
          <Input
            id="paint-price"
            type="number"
            inputMode="decimal"
            min={0}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </div>

        <div className="flex items-center gap-3 pt-7">
          <Switch id="paint-ceiling" checked={includeCeiling} onCheckedChange={setIncludeCeiling} />
          <Label htmlFor="paint-ceiling">Paint the ceiling too</Label>
        </div>
      </div>

      <MaterialResult
        headlineLabel={`Paint needed for ${coats} coat${Number(coats) === 1 ? "" : "s"}`}
        headline={`${result.gallonsToBuy.toLocaleString("en-US", { maximumFractionDigits: 2 })} gal`}
        copyValue={`${result.gallonsToBuy} gallons (${result.litres.toFixed(1)} L)`}
        cost={result.cost}
        stats={[
          {
            label: "Paintable area",
            value: `${result.paintableArea.toLocaleString("en-US", { maximumFractionDigits: 0 })} sq ft`,
            detail: `${result.deducted} sq ft deducted`,
          },
          {
            label: "Total to cover",
            value: `${result.totalCoverage.toLocaleString("en-US", { maximumFractionDigits: 0 })} sq ft`,
            detail: `${coats} × the wall area`,
          },
          {
            label: "In litres",
            value: `${result.litres.toLocaleString("en-US", { maximumFractionDigits: 1 })} L`,
          },
          {
            label: "Cans to buy",
            value: `${Math.ceil(result.gallons)} × 1 gal`,
            detail: result.cost ? `at ${formatMoney(Number(price))} each` : undefined,
          },
        ]}
        footnote={
          <>
            Coverage is per coat and assumes a roller on a prepared surface.
            Spraying uses noticeably more, deep colours over light ones often
            need three coats, and bare drywall should be primed first — primer
            is cheaper than a third coat of colour. Check the tin: the number
            printed on it beats the estimate here.
          </>
        }
      />
    </div>
  );
}
