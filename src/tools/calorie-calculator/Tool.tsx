"use client";

import * as React from "react";
import { Info, TriangleAlert } from "lucide-react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  activityLevels,
  calculateCalories,
  formatCalories,
  goals,
  type ActivityId,
  type GoalId,
  type Sex,
} from "./logic";

export default function CalorieCalculatorTool() {
  const [sex, setSex] = React.useState<Sex>("female");
  const [age, setAge] = React.useState("32");
  const [height, setHeight] = React.useState("168");
  const [weight, setWeight] = React.useState("65");
  const [activity, setActivity] = React.useState<ActivityId>("moderate");
  const [goal, setGoal] = React.useState<GoalId>("maintain");

  const result = React.useMemo(
    () =>
      calculateCalories({
        sex,
        age: Number(age),
        heightCm: Number(height),
        weightKg: Number(weight),
        activity,
        goal,
      }),
    [sex, age, height, weight, activity, goal],
  );

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
        <div className="space-y-2 sm:col-span-2">
          <span className="text-sm font-medium text-foreground">Sex</span>
          <Tabs value={sex} onValueChange={(value) => setSex(value as Sex)}>
            <TabsList>
              <TabsTrigger value="female">Female</TabsTrigger>
              <TabsTrigger value="male">Male</TabsTrigger>
            </TabsList>
          </Tabs>
          <p className="text-xs text-muted-foreground">
            The equation uses a different constant for each — it is modelling average body
            composition, not identity.
          </p>
        </div>

        <div className="space-y-2">
          <Label htmlFor="cal-age">Age</Label>
          <Input
            id="cal-age"
            type="number"
            inputMode="numeric"
            min={1}
            max={120}
            value={age}
            onChange={(event) => setAge(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cal-height">Height (cm)</Label>
          <Input
            id="cal-height"
            type="number"
            inputMode="decimal"
            min={50}
            max={260}
            value={height}
            onChange={(event) => setHeight(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cal-weight">Weight (kg)</Label>
          <Input
            id="cal-weight"
            type="number"
            inputMode="decimal"
            min={20}
            max={400}
            value={weight}
            onChange={(event) => setWeight(event.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="cal-goal">Goal</Label>
          <Select value={goal} onValueChange={(value) => setGoal(value as GoalId)}>
            <SelectTrigger id="cal-goal">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {goals.map((entry) => (
                <SelectItem key={entry.id} value={entry.id}>
                  {entry.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2 sm:col-span-2">
          <Label htmlFor="cal-activity">Activity level</Label>
          <Select value={activity} onValueChange={(value) => setActivity(value as ActivityId)}>
            <SelectTrigger id="cal-activity">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {activityLevels.map((level) => (
                <SelectItem key={level.id} value={level.id}>
                  {level.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {result ? (
        <>
          <dl className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {[
              { label: "BMR — at complete rest", value: formatCalories(result.bmr) },
              { label: "TDEE — to maintain", value: formatCalories(result.tdee) },
              { label: "Your daily target", value: formatCalories(result.target) },
            ].map((card, index) => (
              <div key={card.label} className="surface-card p-4">
                <dt className="text-xs text-muted-foreground">{card.label}</dt>
                <dd
                  className={`mt-1 font-mono tracking-[-0.02em] text-foreground ${index === 2 ? "text-3xl" : "text-xl"}`}
                  data-numeric
                >
                  {card.value}
                  <span className="ml-1 text-sm text-muted-foreground">kcal</span>
                </dd>
              </div>
            ))}
          </dl>

          {result.belowSafeFloor ? (
            <p
              role="alert"
              className="flex items-start gap-2 rounded-md border border-[color-mix(in_oklab,var(--destructive)_30%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-destructive"
            >
              <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
              <span>
                That target is below the level generally considered safe without medical
                supervision. Very low intakes make it hard to meet nutrient needs. Consider a
                smaller deficit, or speak to a doctor or dietitian first.
              </span>
            </p>
          ) : null}

          <section className="surface-card overflow-hidden">
            <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
              Macro splits at {formatCalories(result.target)} kcal
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full border-collapse text-sm">
                <caption className="sr-only">
                  Suggested daily protein, carbohydrate and fat in grams for three approaches.
                </caption>
                <thead>
                  <tr className="border-b border-border text-xs text-muted-foreground">
                    <th scope="col" className="px-5 py-2.5 text-left font-medium">Approach</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Protein</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Carbs</th>
                    <th scope="col" className="px-5 py-2.5 text-right font-medium">Fat</th>
                  </tr>
                </thead>
                <tbody>
                  {result.macros.map((macro) => (
                    <tr key={macro.label} className="border-b border-border last:border-0">
                      <td className="px-5 py-2.5 text-foreground">{macro.label}</td>
                      <td className="px-5 py-2.5 text-right font-mono text-foreground" data-numeric>
                        {macro.proteinG} g
                      </td>
                      <td className="px-5 py-2.5 text-right font-mono text-foreground" data-numeric>
                        {macro.carbsG} g
                      </td>
                      <td className="px-5 py-2.5 text-right font-mono text-foreground" data-numeric>
                        {macro.fatG} g
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>
        </>
      ) : (
        <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Fill in your details to see the estimate.
        </p>
      )}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          <strong className="text-foreground">This is an estimate, not medical advice.</strong>{" "}
          Mifflin–St Jeor predicts resting metabolism within about 10% for most people, but
          individual metabolism, medication and medical conditions all shift the real number. Track
          your actual weight over a few weeks and adjust — that feedback beats any equation.
        </span>
      </p>
    </div>
  );
}
