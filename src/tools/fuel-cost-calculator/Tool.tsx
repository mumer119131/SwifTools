"use client";

import * as React from "react";
import { Info, Users } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ECONOMY_LABELS,
  calculate,
  fromL100km,
  toL100km,
  type Distance,
  type Economy,
  type Volume,
} from "./logic";

const VOLUME_LABELS: Record<Volume, string> = {
  litre: "per litre",
  "gallon-uk": "per imperial gallon",
  "gallon-us": "per US gallon",
};

export default function FuelCostCalculatorTool() {
  const [distance, setDistance] = React.useState("250");
  const [distanceUnit, setDistanceUnit] = React.useState<Distance>("mi");
  const [economy, setEconomy] = React.useState("45");
  const [economyUnit, setEconomyUnit] = React.useState<Economy>("mpg-uk");
  const [price, setPrice] = React.useState("1.45");
  const [priceUnit, setPriceUnit] = React.useState<Volume>("litre");
  const [people, setPeople] = React.useState("1");

  const result = calculate({
    distance: Number(distance),
    distanceUnit,
    economy: Number(economy),
    economyUnit,
    price: Number(price),
    priceUnit,
    people: Number(people) || 1,
  });

  const l100km = toL100km(Number(economy), economyUnit);
  const money = (value: number) =>
    value.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 });

  return (
    <div className="space-y-5">
      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="distance">Distance</Label>
          <div className="flex gap-2">
            <Input
              id="distance"
              inputMode="decimal"
              value={distance}
              onChange={(event) => setDistance(event.target.value)}
              className="font-mono"
            />
            <Select value={distanceUnit} onValueChange={(v) => setDistanceUnit(v as Distance)}>
              <SelectTrigger className="w-28">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="mi">miles</SelectItem>
                <SelectItem value="km">km</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="economy">Fuel economy</Label>
          <div className="flex gap-2">
            <Input
              id="economy"
              inputMode="decimal"
              value={economy}
              onChange={(event) => setEconomy(event.target.value)}
              className="font-mono"
              aria-invalid={l100km === null}
            />
            <Select value={economyUnit} onValueChange={(v) => setEconomyUnit(v as Economy)}>
              <SelectTrigger className="w-44">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(ECONOMY_LABELS) as Economy[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {ECONOMY_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="price">Fuel price</Label>
          <div className="flex gap-2">
            <Input
              id="price"
              inputMode="decimal"
              value={price}
              onChange={(event) => setPrice(event.target.value)}
              className="font-mono"
            />
            <Select value={priceUnit} onValueChange={(v) => setPriceUnit(v as Volume)}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {(Object.keys(VOLUME_LABELS) as Volume[]).map((key) => (
                  <SelectItem key={key} value={key}>
                    {VOLUME_LABELS[key]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="people">Splitting between</Label>
          <Input
            id="people"
            inputMode="numeric"
            value={people}
            onChange={(event) => setPeople(event.target.value)}
            className="w-28 font-mono"
          />
        </div>
      </div>

      {result ? (
        <>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
            {[
              ["This trip", money(result.cost), true],
              ["There and back", money(result.returnCost), false],
              ["Fuel used", `${result.litres.toFixed(1)} L`, false],
              [
                Number(people) > 1 ? "Each person" : "Per mile",
                Number(people) > 1 ? money(result.perPerson) : money(result.costPerMile),
                Number(people) > 1,
              ],
            ].map(([label, value, highlight]) => (
              <div key={label as string} className="surface-card px-4 py-3">
                <dt className="flex items-center gap-1.5 text-xs text-muted-foreground">
                  {label === "Each person" ? <Users className="size-3" strokeWidth={1.75} /> : null}
                  {label}
                </dt>
                <dd
                  className={`mt-0.5 font-mono text-xl ${highlight ? "text-[var(--accent-calculator)]" : "text-foreground"}`}
                  data-numeric
                >
                  {value}
                </dd>
              </div>
            ))}
          </div>

          {l100km !== null ? (
            <p className="text-sm text-muted-foreground">
              {economy} {ECONOMY_LABELS[economyUnit]} is{" "}
              <span className="font-mono text-foreground">{l100km.toFixed(2)} L/100km</span>
              {economyUnit !== "mpg-uk" && economyUnit !== "mpg-us" ? (
                <>
                  , or{" "}
                  <span className="font-mono text-foreground">
                    {fromL100km(l100km, "mpg-uk").toFixed(1)} mpg
                  </span>{" "}
                  imperial
                </>
              ) : (
                <>
                  , or{" "}
                  <span className="font-mono text-foreground">
                    {fromL100km(l100km, economyUnit === "mpg-uk" ? "mpg-us" : "mpg-uk").toFixed(1)} mpg
                  </span>{" "}
                  {economyUnit === "mpg-uk" ? "US" : "imperial"}
                </>
              )}
              .
            </p>
          ) : null}
        </>
      ) : (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          Check the figures — distance and fuel economy both need to be above zero.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          Watch which gallon your MPG figure uses — an imperial gallon is 4.55
          litres and a US one 3.79, so the same &ldquo;40 mpg&rdquo; means two
          things about 20% apart. If the figure came from a UK source it is
          almost certainly imperial.
        </span>
      </p>
    </div>
  );
}
