"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

import { MaterialResult } from "@/components/shared/MaterialResult";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import type { LengthUnit } from "@/lib/home";
import { totalArea, type Section } from "./logic";

let nextId = 0;

export default function SquareFootageTool() {
  const [unit, setUnit] = React.useState<LengthUnit>("ft");
  const [sections, setSections] = React.useState<Section[]>([
    { id: "section-a", label: "Main area", length: "12", width: "10" },
  ]);

  const suffix = unit === "ft" ? "ft" : "m";
  const totals = totalArea(sections, unit);

  function addSection() {
    nextId += 1;
    setSections((current) => [
      ...current,
      { id: `section-${nextId}`, label: `Section ${current.length + 1}`, length: "", width: "" },
    ]);
  }

  function update(id: string, field: "length" | "width" | "label", value: string) {
    setSections((current) =>
      current.map((section) => (section.id === id ? { ...section, [field]: value } : section)),
    );
  }

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h2 className="text-sm font-medium text-foreground">Measurements</h2>
        <Tabs value={unit} onValueChange={(value) => setUnit(value as LengthUnit)}>
          <TabsList>
            <TabsTrigger value="ft">Feet</TabsTrigger>
            <TabsTrigger value="m">Metres</TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      <div className="space-y-3">
        {sections.map((section, index) => (
          <div key={section.id} className="surface-card grid gap-4 p-5 sm:grid-cols-[1fr_1fr_1fr_auto]">
            <div className="space-y-2">
              <Label htmlFor={`${section.id}-label`}>Name</Label>
              <Input
                id={`${section.id}-label`}
                value={section.label}
                onChange={(event) => update(section.id, "label", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${section.id}-length`}>Length ({suffix})</Label>
              <Input
                id={`${section.id}-length`}
                type="number"
                inputMode="decimal"
                min={0}
                value={section.length}
                onChange={(event) => update(section.id, "length", event.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor={`${section.id}-width`}>Width ({suffix})</Label>
              <Input
                id={`${section.id}-width`}
                type="number"
                inputMode="decimal"
                min={0}
                value={section.width}
                onChange={(event) => update(section.id, "width", event.target.value)}
              />
            </div>
            <div className="flex items-end pb-1">
              <Button
                variant="ghost"
                size="icon"
                aria-label={`Remove ${section.label}`}
                disabled={sections.length === 1}
                onClick={() =>
                  setSections((current) => current.filter((entry) => entry.id !== section.id))
                }
              >
                <X className="size-4" strokeWidth={1.75} />
              </Button>
            </div>
            <p className="text-xs text-subtle-foreground sm:col-span-4">
              {totals.perSection[index].squareFeet > 0
                ? `${totals.perSection[index].squareFeet.toLocaleString("en-US", { maximumFractionDigits: 1 })} sq ft`
                : "Enter both dimensions"}
            </p>
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <Button variant="outline" onClick={addSection}>
          <Plus className="size-4" strokeWidth={1.75} />
          Add a section
        </Button>
        <FieldHint>
          An L-shaped room is two rectangles. Split it at the corner and add both.
        </FieldHint>
      </div>

      <MaterialResult
        headlineLabel="Total area"
        headline={`${totals.squareFeet.toLocaleString("en-US", { maximumFractionDigits: 1 })} sq ft`}
        copyValue={`${totals.squareFeet.toFixed(1)} sq ft`}
        stats={[
          {
            label: "Square metres",
            value: totals.squareMetres.toLocaleString("en-US", { maximumFractionDigits: 2 }),
          },
          {
            label: "Square yards",
            value: totals.squareYards.toLocaleString("en-US", { maximumFractionDigits: 2 }),
            detail: "How carpet is sold",
          },
          { label: "Sections", value: String(sections.length) },
          {
            label: "Perimeter of first section",
            value:
              Number(sections[0].length) > 0 && Number(sections[0].width) > 0
                ? `${(2 * (Number(sections[0].length) + Number(sections[0].width))).toLocaleString("en-US", { maximumFractionDigits: 1 })} ${suffix}`
                : "—",
          },
        ]}
        footnote={
          <>
            Measure at the widest point of each section and round up to the
            nearest inch. Closets, alcoves and bay windows are separate
            rectangles — leaving them out is the usual reason an estimate comes
            in short.
          </>
        }
      />
    </div>
  );
}
