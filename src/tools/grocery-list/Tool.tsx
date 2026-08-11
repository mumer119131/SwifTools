"use client";

import * as React from "react";
import { Info, Plus, Trash2, X } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
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
import { formatMoney } from "@/lib/home";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";
import { AISLES, guessAisle, itemTotal, type GroceryItem } from "./logic";

const EMPTY: GroceryItem[] = [];

export default function GroceryListTool() {
  const [items, setItems, clear] = useLocalStorage<GroceryItem[]>("swiftknife:grocery-list", EMPTY);
  const [draft, setDraft] = React.useState("");

  const total = items.reduce((sum, item) => sum + itemTotal(item), 0);
  const remaining = items.filter((item) => !item.done);
  const remainingTotal = remaining.reduce((sum, item) => sum + itemTotal(item), 0);

  function add(event: React.FormEvent) {
    event.preventDefault();
    const name = draft.trim();
    if (!name) return;

    setItems((current) => [
      ...current,
      {
        id: `item-${Date.now()}-${current.length}`,
        name,
        quantity: "1",
        price: "",
        aisle: guessAisle(name),
        done: false,
      },
    ]);
    setDraft("");
  }

  function update(id: string, patch: Partial<GroceryItem>) {
    setItems((current) => current.map((item) => (item.id === id ? { ...item, ...patch } : item)));
  }

  const byAisle = AISLES.map((aisle) => ({
    aisle,
    items: items.filter((item) => item.aisle === aisle),
  })).filter((group) => group.items.length > 0);

  const plainText = byAisle
    .map(
      (group) =>
        `${group.aisle}\n${group.items
          .map((item) => `  [${item.done ? "x" : " "}] ${item.quantity} × ${item.name}`)
          .join("\n")}`,
    )
    .join("\n\n");

  return (
    <div className="space-y-5">
      <form onSubmit={add} className="surface-card flex flex-wrap items-end gap-3 p-5">
        <div className="min-w-56 flex-1 space-y-2">
          <Label htmlFor="grocery-add">Add an item</Label>
          <Input
            id="grocery-add"
            value={draft}
            onChange={(event) => setDraft(event.target.value)}
            placeholder="Milk, bread, chicken thighs…"
            autoComplete="off"
          />
        </div>
        <Button type="submit">
          <Plus className="size-4" strokeWidth={1.75} />
          Add
        </Button>
      </form>

      {items.length > 0 ? (
        <>
          <div className="surface-card flex flex-wrap items-center justify-between gap-4 p-5">
            <div className="flex flex-wrap gap-6">
              <div>
                <p className="text-xs text-muted-foreground">Still to get</p>
                <p className="font-mono text-lg text-foreground" data-numeric>
                  {remaining.length} of {items.length}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Basket total</p>
                <p className="font-mono text-lg text-foreground" data-numeric>
                  {formatMoney(total)}
                </p>
              </div>
              <div>
                <p className="text-xs text-muted-foreground">Left to buy</p>
                <p className="font-mono text-lg text-foreground" data-numeric>
                  {formatMoney(remainingTotal)}
                </p>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <CopyButton value={plainText} label="Copy list" />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setItems((current) => current.filter((item) => !item.done))}
                disabled={items.every((item) => !item.done)}
              >
                <Trash2 className="size-4" strokeWidth={1.75} />
                Clear ticked
              </Button>
              <Button variant="ghost" size="sm" onClick={clear}>
                Clear all
              </Button>
            </div>
          </div>

          <div className="space-y-4">
            {byAisle.map((group) => (
              <section key={group.aisle} className="surface-card overflow-hidden">
                <h2 className="border-b border-border px-5 py-3 text-sm font-medium text-foreground">
                  {group.aisle}
                  <span className="ml-2 text-xs text-subtle-foreground">
                    {group.items.length}
                  </span>
                </h2>
                <ul className="divide-y divide-border">
                  {group.items.map((item) => (
                    <li key={item.id} className="flex flex-wrap items-center gap-3 px-5 py-2.5">
                      <input
                        type="checkbox"
                        id={item.id}
                        checked={item.done}
                        onChange={() => update(item.id, { done: !item.done })}
                        className="size-4 shrink-0 cursor-pointer accent-[var(--accent-home)]"
                      />
                      <label
                        htmlFor={item.id}
                        className={cn(
                          "min-w-32 flex-1 cursor-pointer text-sm",
                          item.done ? "text-subtle-foreground line-through" : "text-foreground",
                        )}
                      >
                        {item.name}
                      </label>

                      <Input
                        value={item.quantity}
                        onChange={(event) => update(item.id, { quantity: event.target.value })}
                        aria-label={`Quantity of ${item.name}`}
                        className="h-8 w-16 text-center"
                        inputMode="decimal"
                      />
                      <Input
                        value={item.price}
                        onChange={(event) => update(item.id, { price: event.target.value })}
                        placeholder="Price"
                        aria-label={`Price of ${item.name}`}
                        className="h-8 w-20"
                        inputMode="decimal"
                      />
                      <Select
                        value={item.aisle}
                        onValueChange={(value) => update(item.id, { aisle: value })}
                      >
                        <SelectTrigger
                          className="h-8 w-36"
                          aria-label={`Aisle for ${item.name}`}
                        >
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {AISLES.map((aisle) => (
                            <SelectItem key={aisle} value={aisle}>
                              {aisle}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>

                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Remove ${item.name}`}
                        onClick={() =>
                          setItems((current) => current.filter((entry) => entry.id !== item.id))
                        }
                      >
                        <X className="size-3.5" strokeWidth={1.75} />
                      </Button>
                    </li>
                  ))}
                </ul>
              </section>
            ))}
          </div>
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Nothing on the list yet. Add an item above.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Items are sorted into aisles automatically from their name, so a list
          typed in any order comes out in the order you walk the shop. The guess
          is editable on every row. The list lives in this browser only — no
          account, nothing uploaded, and it will not appear on your phone.
        </span>
      </p>
    </div>
  );
}
