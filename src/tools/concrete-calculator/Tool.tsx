"use client";

import * as React from "react";

import { MaterialResult } from "@/components/shared/MaterialResult";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { SHAPES, estimate, type Shape } from "./logic";

export default function ConcreteCalculatorTool() {
  const [shape, setShape] = React.useState<Shape>("slab");
  const [length, setLength] = React.useState("10");
  const [width, setWidth] = React.useState("10");
  const [thickness, setThickness] = React.useState("4");
  const [diameter, setDiameter] = React.useState("1");
  const [height, setHeight] = React.useState("4");
  const [quantity, setQuantity] = React.useState("1");
  const [waste, setWaste] = React.useState("10");
  const [price, setPrice] = React.useState("140");

  const result = estimate(
    shape,
    Number(length),
    Number(width),
    Number(thickness),
    Number(diameter),
    Number(height),
    Number(quantity),
    Number(waste),
    Number(price),
  );

  const isRound = shape === "column" || shape === "round";
  const activeShape = SHAPES.find((entry) => entry.id === shape)!;

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-3">
        <div className="space-y-2 sm:col-span-2 lg:col-span-3">
          <Label htmlFor="concrete-shape">Shape</Label>
          <Select value={shape} onValueChange={(value) => setShape(value as Shape)}>
            <SelectTrigger id="concrete-shape" className="sm:max-w-sm">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {SHAPES.map((entry) => (
                <SelectItem key={entry.id} value={entry.id}>
                  {entry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <FieldHint>{activeShape.note}</FieldHint>
        </div>

        {isRound ? (
          <div className="space-y-2">
            <Label htmlFor="concrete-diameter">Diameter (ft)</Label>
            <Input
              id="concrete-diameter"
              type="number"
              inputMode="decimal"
              min={0}
              value={diameter}
              onChange={(event) => setDiameter(event.target.value)}
            />
          </div>
        ) : (
          <>
            <div className="space-y-2">
              <Label htmlFor="concrete-length">Length (ft)</Label>
              <Input
                id="concrete-length"
                type="number"
                inputMode="decimal"
                min={0}
                value={length}
                onChange={(event) => setLength(event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="concrete-width">Width (ft)</Label>
              <Input
                id="concrete-width"
                type="number"
                inputMode="decimal"
                min={0}
                value={width}
                onChange={(event) => setWidth(event.target.value)}
              />
            </div>
          </>
        )}

        {shape === "column" ? (
          <div className="space-y-2">
            <Label htmlFor="concrete-height">Height (ft)</Label>
            <Input
              id="concrete-height"
              type="number"
              inputMode="decimal"
              min={0}
              value={height}
              onChange={(event) => setHeight(event.target.value)}
            />
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor="concrete-thickness">Thickness (in)</Label>
            <Input
              id="concrete-thickness"
              type="number"
              inputMode="decimal"
              min={0}
              value={thickness}
              onChange={(event) => setThickness(event.target.value)}
            />
            <FieldHint>4&Prime; for a patio, 6&Prime; if a vehicle will sit on it.</FieldHint>
          </div>
        )}

        <div className="space-y-2">
          <Label htmlFor="concrete-quantity">How many</Label>
          <Input
            id="concrete-quantity"
            type="number"
            inputMode="numeric"
            min={1}
            value={quantity}
            onChange={(event) => setQuantity(event.target.value)}
          />
          <FieldHint>Identical pours — six deck footings, say.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="concrete-waste">Waste allowance (%)</Label>
          <Input
            id="concrete-waste"
            type="number"
            inputMode="numeric"
            min={0}
            value={waste}
            onChange={(event) => setWaste(event.target.value)}
          />
          <FieldHint>10% covers spillage and an uneven subgrade.</FieldHint>
        </div>

        <div className="space-y-2">
          <Label htmlFor="concrete-price">Price per cubic yard</Label>
          <Input
            id="concrete-price"
            type="number"
            inputMode="decimal"
            min={0}
            value={price}
            onChange={(event) => setPrice(event.target.value)}
          />
        </div>
      </div>

      <MaterialResult
        headlineLabel="Concrete to order"
        headline={`${result.yardsToOrder.toLocaleString("en-US", { maximumFractionDigits: 2 })} yd³`}
        copyValue={`${result.yardsToOrder} cubic yards (${result.cubicMetres.toFixed(2)} m³)`}
        cost={result.cost}
        stats={[
          {
            label: "Cubic feet",
            value: result.cubicFeet.toLocaleString("en-US", { maximumFractionDigits: 1 }),
            detail: `${waste}% waste included`,
          },
          {
            label: "Cubic metres",
            value: result.cubicMetres.toLocaleString("en-US", { maximumFractionDigits: 2 }),
          },
          { label: "60 lb bags", value: String(result.bags60), detail: "If mixing by hand" },
          { label: "80 lb bags", value: String(result.bags80), detail: "If mixing by hand" },
        ]}
        footnote={
          <>
            Past about a cubic yard, hand-mixing stops being sensible — that is
            forty-five 80 lb bags, and concrete sets while you are still opening
            them. Ready-mix is ordered in quarter-yard steps with a minimum load
            and a short-load fee below it. Order slightly over: a pour that runs
            out halfway leaves a cold joint you cannot undo.
          </>
        }
      />
    </div>
  );
}
