"use client";

import { SolveForCalculator } from "@/components/shared/SolveForCalculator";
import { derive, formulas, solve, variables } from "./logic";

export default function ForceCalculatorTool() {
  return (
    <SolveForCalculator
      variables={variables}
      formulas={formulas}
      solve={solve}
      derive={derive}
      defaults={{ f: "98.1", m: "10", a: "9.81" }}
      footnote={
        <>
          F = ma is Newton&rsquo;s second law for constant mass. It is the{" "}
          <em>net</em> force that matters: if something sits still on a table,
          gravity and the normal force cancel and the net force is zero, however
          heavy it is.
        </>
      }
    />
  );
}
