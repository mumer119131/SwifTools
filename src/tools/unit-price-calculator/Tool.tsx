"use client";

import * as React from "react";
import { Info, Plus, Trophy, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { UNITS, compare, type Item } from "./logic";

let nextId = 0;

export default function UnitPriceTool() {
  const [items, setItems] = React.useState<Item[]>([
    { id: "item-a", label: "Option A", price: "4.99", size: "750", unit: "g" },
    { id: "item-b", label: "Option B", price: "3.29", size: "16", unit: "oz" },
  ]);

  const rows = compare(items);

  function update(id: string, field: keyof Item, value: string) {
    setItems((current) =>
      current.map((item) => (item.id === id ? { ...item, [field]: value } : item)),
    );
  }

  return (
    <div className="space-y-5">
      <div className="space-y-3">
        {items.map((item, index) => {
          const row = rows[index];
          return (
            <div
              key={item.id}
              className={cn(
                "surface-card grid gap-4 p-5 sm:grid-cols-[1fr_1fr_1fr_1.2fr_auto]",
                row.best && "border-[color-mix(in_oklab,var(--accent-home)_45%,var(--border))]",
              )}
            >
              <div className="space-y-2">
                <Label htmlFor={`${item.id}-label`}>Name</Label>
                <Input
                  id={`${item.id}-label`}
                  value={item.label}
                  onChange={(event) => update(item.id, "label", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${item.id}-price`}>Price</Label>
                <Input
                  id={`${item.id}-price`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step={0.01}
                  value={item.price}
                  onChange={(event) => update(item.id, "price", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${item.id}-size`}>Size</Label>
                <Input
                  id={`${item.id}-size`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  value={item.size}
                  onChange={(event) => update(item.id, "size", event.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor={`${item.id}-unit`}>Unit</Label>
                <Select value={item.unit} onValueChange={(value) => update(item.id, "unit", value)}>
                  <SelectTrigger id={`${item.id}-unit`}>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {UNITS.map((unit) => (
                      <SelectItem key={unit.id} value={unit.id}>
                        {unit.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end pb-1">
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Remove ${item.label}`}
                  disabled={items.length <= 2}
                  onClick={() =>
                    setItems((current) => current.filter((entry) => entry.id !== item.id))
                  }
                >
                  <X className="size-4" strokeWidth={1.75} />
                </Button>
              </div>

              <p className="flex flex-wrap items-center gap-2 text-sm sm:col-span-5">
                <span className="font-mono text-foreground" data-numeric>
                  {row.display}
                </span>
                {row.best ? (
                  <span className="inline-flex items-center gap-1 rounded-full bg-[color-mix(in_oklab,var(--accent-home)_18%,transparent)] px-2 py-0.5 text-xs text-foreground">
                    <Trophy className="size-3" strokeWidth={1.75} />
                    Best value
                  </span>
                ) : row.valid ? (
                  <span className="text-xs text-muted-foreground">
                    {row.premium.toFixed(1)}% more than the best
                  </span>
                ) : (
                  <span className="text-xs text-subtle-foreground">
                    Enter a price and a size
                  </span>
                )}
              </p>
            </div>
          );
        })}
      </div>

      <Button
        variant="outline"
        onClick={() => {
          nextId += 1;
          setItems((current) => [
            ...current,
            {
              id: `item-${nextId}`,
              label: `Option ${String.fromCharCode(65 + current.length)}`,
              price: "",
              size: "",
              unit: current[current.length - 1]?.unit ?? "g",
            },
          ]);
        }}
      >
        <Plus className="size-4" strokeWidth={1.75} />
        Add another
      </Button>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Units can be mixed freely — grams against ounces, litres against
          fluid ounces — because everything is converted to a common base before
          comparing. Mass and volume are still different things, though: a
          bottle sold by volume and a box sold by weight cannot be compared
          honestly, whatever number comes out.
        </span>
      </p>
    </div>
  );
}
