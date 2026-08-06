"use client";

import * as React from "react";
import { Cake } from "lucide-react";

import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { formatNumber } from "@/lib/utils";
import { useClientValue } from "@/lib/use-client-value";
import { calculateAge, formatDate, todayInputValue } from "./logic";

export default function AgeCalculatorTool() {
  const [birth, setBirth] = React.useState("");
  // "Today" is read on the client so a statically-rendered page never ships a
  // stale date; an explicit choice overrides it.
  const today = useClientValue(todayInputValue, "");
  const [asOfOverride, setAsOfOverride] = React.useState<string | null>(null);
  const asOf = asOfOverride ?? today;
  const setAsOf = setAsOfOverride;

  const result = React.useMemo(() => calculateAge(birth, asOf), [birth, asOf]);
  const invalid = birth !== "" && asOf !== "" && result === null;

  return (
    <div className="space-y-5">
      <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
        <div className="space-y-2">
          <Label htmlFor="age-birth" required>
            Date of birth
          </Label>
          <Input
            id="age-birth"
            type="date"
            value={birth}
            max={asOf}
            onChange={(event) => setBirth(event.target.value)}
            aria-invalid={invalid}
          />
        </div>

        <div className="space-y-2">
          <Label htmlFor="age-asof">Age at date</Label>
          <Input
            id="age-asof"
            type="date"
            value={asOf}
            onChange={(event) => setAsOf(event.target.value)}
          />
          <FieldHint>Defaults to today. Change it to work out an age on any date.</FieldHint>
        </div>
      </div>

      {invalid ? (
        <p role="alert" className="text-sm text-destructive">
          The date of birth has to come before the date you&rsquo;re measuring to, and both need to
          be real calendar dates.
        </p>
      ) : null}

      {result ? (
        <>
          <div className="surface-card p-6 text-center">
            <p className="text-xs text-muted-foreground">Exact age</p>
            <p className="mt-2 flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1" aria-live="polite">
              <span className="font-mono text-5xl tracking-[-0.03em] text-foreground" data-numeric>
                {result.years}
              </span>
              <span className="text-sm text-muted-foreground">
                {result.years === 1 ? "year" : "years"}
              </span>
              <span className="font-mono text-3xl tracking-[-0.02em] text-foreground" data-numeric>
                {result.months}
              </span>
              <span className="text-sm text-muted-foreground">
                {result.months === 1 ? "month" : "months"}
              </span>
              <span className="font-mono text-3xl tracking-[-0.02em] text-foreground" data-numeric>
                {result.days}
              </span>
              <span className="text-sm text-muted-foreground">
                {result.days === 1 ? "day" : "days"}
              </span>
            </p>
          </div>

          <dl className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {[
              { label: "In months", value: formatNumber(result.totalMonths) },
              { label: "In weeks", value: formatNumber(result.totalWeeks) },
              { label: "In days", value: formatNumber(result.totalDays) },
              { label: "In hours", value: formatNumber(result.totalHours) },
            ].map((card) => (
              <div key={card.label} className="surface-card p-4">
                <dt className="text-xs text-muted-foreground">{card.label}</dt>
                <dd className="mt-1 font-mono text-xl text-foreground" data-numeric>
                  {card.value}
                </dd>
              </div>
            ))}
          </dl>

          <section className="surface-card flex flex-wrap items-center gap-4 p-5">
            <span className="grid size-11 shrink-0 place-items-center rounded-full border border-border bg-background">
              <Cake className="size-5 text-muted-foreground" strokeWidth={1.75} />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm text-foreground">
                Next birthday: {formatDate(result.nextBirthday)}, a{" "}
                {result.nextBirthdayWeekday}
              </p>
              <p className="text-sm text-muted-foreground">
                <span data-numeric>{formatNumber(result.daysToNextBirthday)}</span>{" "}
                {result.daysToNextBirthday === 1 ? "day" : "days"} away — turning{" "}
                <span data-numeric>{result.turningAge}</span>. Born on a {result.birthWeekday}.
              </p>
            </div>
          </section>
        </>
      ) : !invalid ? (
        <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
          Enter a date of birth to calculate.
        </p>
      ) : null}
    </div>
  );
}
