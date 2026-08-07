"use client";

import { SolveForCalculator } from "@/components/shared/SolveForCalculator";
import { formatNumeric } from "@/lib/science";
import { MATERIALS, derive, formulas, solve, variables } from "./logic";

export default function DensityCalculatorTool() {
  return (
    <div className="space-y-5">
      <SolveForCalculator
        variables={variables}
        formulas={formulas}
        solve={solve}
        derive={derive}
        defaults={{ d: "1000", m: "2", v: "0.002" }}
        footnote={
          <>
            The units only have to be consistent — kg and m³ give kg/m³, g and
            cm³ give g/cm³, and the two differ by exactly 1000. Density varies
            with temperature and pressure, most noticeably for gases.
          </>
        }
      />

      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
          Common materials
        </h2>
        <dl className="divide-y divide-border">
          {MATERIALS.map((material) => (
            <div key={material.name} className="flex items-center gap-4 px-5 py-2.5 text-sm">
              <dt className="min-w-0 flex-1 truncate text-muted-foreground">{material.name}</dt>
              <dd className="shrink-0 font-mono text-foreground" data-numeric>
                {formatNumeric(material.density)}{" "}
                <span className="text-subtle-foreground">kg/m³</span>
              </dd>
            </div>
          ))}
        </dl>
      </section>
    </div>
  );
}
