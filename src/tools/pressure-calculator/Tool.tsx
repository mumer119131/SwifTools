"use client";

import { UnitConverterShell } from "@/components/shared/UnitConverterShell";
import { formatNumeric } from "@/lib/science";
import { REFERENCES, categoryId, defaultFrom, defaultTo } from "./logic";

export default function PressureCalculatorTool() {
  return (
    <div className="space-y-5">
      <UnitConverterShell
        categoryId={categoryId}
        defaultFrom={defaultFrom}
        defaultTo={defaultTo}
      />

      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
          Reference pressures
        </h2>
        <dl className="divide-y divide-border">
          {REFERENCES.map((entry) => (
            <div key={entry.name} className="flex items-center gap-4 px-5 py-2.5 text-sm">
              <dt className="min-w-0 flex-1 truncate text-muted-foreground">{entry.name}</dt>
              <dd className="shrink-0 font-mono text-foreground" data-numeric>
                {formatNumeric(entry.pascals / 1000)}{" "}
                <span className="text-subtle-foreground">kPa</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>

      <p className="text-sm text-muted-foreground">
        Tyre and boiler gauges usually read <strong className="text-foreground">gauge
        pressure</strong> — the amount above atmospheric — while these units are
        absolute. A tyre at &ldquo;32 psi&rdquo; is about 46.7 psi absolute once
        you add the 14.7 psi the atmosphere is already pushing with.
      </p>
    </div>
  );
}
