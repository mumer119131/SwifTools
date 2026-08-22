"use client";

import * as React from "react";

import { SolveForCalculator } from "@/components/shared/SolveForCalculator";
import { MATERIALS, derive, formulas, solve, variables } from "./logic";

export default function SpecificHeatCalculatorTool() {
  return (
    <div className="space-y-5">
      <SolveForCalculator
        variables={variables}
        formulas={formulas}
        solve={solve}
        derive={derive}
        defaults={{ Q: "41810", m: "1", c: "4181", dT: "10" }}
        footnote={
          <>
            A change of one kelvin is a change of one degree Celsius, so ΔT can
            be entered in either — it is a difference rather than a temperature,
            and the offset between the scales cancels. Water&rsquo;s unusually
            high capacity is why it is used as a coolant, why coastal climates
            are milder, and why a kettle takes as long as it does.
          </>
        }
      />

      <section>
        <h2 className="text-sm font-medium text-foreground">Common specific heat capacities</h2>
        <ul className="mt-3 divide-y divide-border rounded-md border border-border">
          {MATERIALS.map((material) => (
            <li key={material.name} className="flex items-baseline justify-between gap-3 px-4 py-2 text-sm">
              <span className="text-muted-foreground">{material.name}</span>
              <span className="font-mono text-foreground" data-numeric>
                {material.c.toLocaleString()} J/kg·K
              </span>
            </li>
          ))}
        </ul>
        <p className="mt-2 text-xs text-muted-foreground">
          Water is the outlier, at roughly ten times copper. Heating a kilogram
          of water by one degree takes as much energy as heating ten kilograms
          of copper by the same amount.
        </p>
      </section>
    </div>
  );
}
