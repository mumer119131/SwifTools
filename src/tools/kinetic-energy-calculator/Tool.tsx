"use client";

import { SolveForCalculator } from "@/components/shared/SolveForCalculator";
import { derive, formulas, solve, variables } from "./logic";

export default function KineticEnergyCalculatorTool() {
  return (
    <SolveForCalculator
      variables={variables}
      formulas={formulas}
      solve={solve}
      derive={derive}
      defaults={{ ke: "500", m: "1000", v: "1" }}
      footnote={
        <>
          Energy scales with the <em>square</em> of velocity, which is why
          doubling your speed quadruples the energy a crash has to dissipate.
          This is the classical formula; it drifts from the relativistic value
          above roughly a tenth of the speed of light.
        </>
      }
    />
  );
}
