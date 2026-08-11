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
import { TILE_SIZES, estimate } from "./logic";

export default function TileCalculatorTool() {
  const [room, setRoom] = React.useState<RoomState>(DEFAULT_ROOM);
  const [sizeId, setSizeId] = React.useState("12x24");
  const [customWidth, setCustomWidth] = React.useState("12");
  const [customHeight, setCustomHeight] = React.useState("12");
  const [grout, setGrout] = React.useState("3");
  const [waste, setWaste] = React.useState("10");
  const [perBox, setPerBox] = React.useState("8");
  const [price, setPrice] = React.useState("38");

  const size = TILE_SIZES.find((entry) => entry.id === sizeId) ?? TILE_SIZES[0];
  const width = sizeId === "custom" ? Number(customWidth) : size.width;
  const height = sizeId === "custom" ? Number(customHeight) : size.height;

  const result = estimate(
    floorArea(room),
    width,
    height,
    Number(grout),
    Number(waste),
    Number(perBox),
    Number(price),
  );

  return (
    <div className="space-y-5">
      <RoomDimensions
        value={room}
        onChange={setRoom}
        hint="For a wall, enter its width and height here instead."
      />

      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2">
          <Label htmlFor="tile-size">Tile size</Label>
          <Select value={sizeId} onValueChange={setSizeId}>
            <SelectTrigger id="tile-size">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {TILE_SIZES.map((entry) => (
                <SelectItem key={entry.id} value={entry.id}>
                  {entry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        {sizeId === "custom" ? (
          <>
            <div className="space-y-2">
              <Label htmlFor="tile-width">Tile width (in)</Label>
              <Input
                id="tile-width"
                type="number"
                inputMode="decimal"
                min={0}
                value={customWidth}
                onChange={(event) => setCustomWidth(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="tile-height">Tile height (in)</Label>
              <Input
                id="tile-height"
                type="number"
                inputMode="decimal"
                min={0}
                value={customHeight}
                onChange={(event) => setCustomHeight(event.target.value)}
              />
            </div>
          </>
        ) : null}

        <div className="space-y-2">
          <Label htmlFor="tile-grout">Grout gap (mm)</Label>
          <Input
            id="tile-grout"
            type="number"
            inputMode="decimal"
            min={0}
            step={0.5}
            value={grout}
            onChange={(event) => setGrout(event.target.value)}
          />
          <FieldHint>2–3 mm for rectified tile, 5 mm for rustic.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tile-waste">Waste allowance (%)</Label>
          <Input
            id="tile-waste"
            type="number"
            inputMode="numeric"
            min={0}
            value={waste}
            onChange={(event) => setWaste(event.target.value)}
          />
          <FieldHint>10% straight, 15–20% diagonal.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="tile-per-box">Tiles per box</Label>
          <Input
            id="tile-per-box"
            type="number"
            inputMode="numeric"
            min={1}
            value={perBox}
            onChange={(event) => setPerBox(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="tile-price">Price per box</Label>
          <Input
            id="tile-price"
            type="number"
            inputMode="decimal"
            min={0}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </div>
      </div>

      <MaterialResult
        headlineLabel="Tiles to buy"
        headline={String(result.tilesWithWaste)}
        copyValue={`${result.tilesWithWaste} tiles (${result.boxes} boxes)`}
        cost={result.cost}
        stats={[
          { label: "Boxes", value: String(result.boxes) },
          {
            label: "Bare minimum",
            value: `${Math.ceil(result.tilesNeeded)} tiles`,
            detail: "Before waste",
          },
          {
            label: "Coverage per tile",
            value: `${result.tileAreaSqft.toFixed(3)} sq ft`,
            detail: "Grout gap included",
          },
          {
            label: "Grout",
            value: `${result.groutKg.toLocaleString("en-US", { maximumFractionDigits: 1 })} kg`,
            detail: "Approximate",
          },
        ]}
        footnote={
          <>
            The grout gap is counted in the coverage, which is why the tile count
            is slightly higher than area ÷ tile size. Buy a full box more than
            the number above if the pattern is anything other than a straight
            grid, and keep a few whole tiles back — a cracked tile is trivial to
            swap and impossible to match once the line is discontinued.
          </>
        }
      />
    </div>
  );
}
