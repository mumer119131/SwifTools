"use client";

import * as React from "react";

import { MaterialResult } from "@/components/shared/MaterialResult";
import { DEFAULT_ROOM, RoomDimensions, floorArea, type RoomState } from "@/components/shared/RoomDimensions";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { formatMoney } from "@/lib/home";
import { WASTE_PRESETS, estimate } from "./logic";

export default function FlooringCalculatorTool() {
  const [room, setRoom] = React.useState<RoomState>(DEFAULT_ROOM);
  const [sqftPerBox, setSqftPerBox] = React.useState("20");
  const [waste, setWaste] = React.useState("10");
  const [price, setPrice] = React.useState("55");

  const result = estimate(floorArea(room), Number(sqftPerBox), Number(waste), Number(price));

  return (
    <div className="space-y-5">
      <RoomDimensions value={room} onChange={setRoom} />

      <div className="surface-card grid gap-4 p-5 sm:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="floor-box">Coverage per box (sq ft)</Label>
          <Input
            id="floor-box"
            type="number"
            inputMode="decimal"
            min={0}
            value={sqftPerBox}
            onChange={(event) => setSqftPerBox(event.target.value)}
          />
          <FieldHint>Printed on the box — usually 18 to 24 sq ft.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="floor-waste">Waste allowance</Label>
          <Select value={waste} onValueChange={setWaste}>
            <SelectTrigger id="floor-waste">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {WASTE_PRESETS.map((preset) => (
                <SelectItem key={preset.value} value={String(preset.value)}>
                  {preset.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label htmlFor="floor-price">Price per box</Label>
          <Input
            id="floor-price"
            type="number"
            inputMode="decimal"
            min={0}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </div>
      </div>

      <MaterialResult
        headlineLabel="Boxes to buy"
        headline={String(result.boxes)}
        copyValue={`${result.boxes} boxes (${result.covered.toFixed(0)} sq ft)`}
        cost={result.cost}
        stats={[
          {
            label: "Floor area",
            value: `${result.area.toLocaleString("en-US", { maximumFractionDigits: 1 })} sq ft`,
          },
          {
            label: "With waste",
            value: `${result.areaWithWaste.toLocaleString("en-US", { maximumFractionDigits: 1 })} sq ft`,
            detail: `${waste}% allowance`,
          },
          {
            label: "Actually covered",
            value: `${result.covered.toLocaleString("en-US", { maximumFractionDigits: 1 })} sq ft`,
          },
          {
            label: "Spare left over",
            value: `${result.spare.toLocaleString("en-US", { maximumFractionDigits: 1 })} sq ft`,
            detail: "Keep it for repairs",
          },
        ]}
        footnote={
          <>
            Buy it all in one order. Flooring is made in batches and two orders
            of the same product can differ slightly in shade — noticeable across
            a finished floor, invisible in the shop. Keep the spare boxes: a
            damaged plank three years from now is much easier to replace from
            stock than to match.{" "}
            {result.cost ? `At ${formatMoney(Number(price))} a box, that is ${formatMoney(result.cost)}.` : null}
          </>
        }
      />
    </div>
  );
}
