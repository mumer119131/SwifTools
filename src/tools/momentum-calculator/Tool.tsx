"use client";

import { SolveForCalculator } from "@/components/shared/SolveForCalculator";
import { derive, formulas, solve, variables } from "./logic";

export default function MomentumCalculatorTool() {
  return (
    <SolveForCalculator
      variables={variables}
      formulas={formulas}
      solve={solve}
      derive={derive}
      defaults={{ p: "1500", m: "1000", v: "1.5" }}
      footnote={
        <>
          Momentum scales with velocity and kinetic energy with its square,
          which is why a heavy slow object and a light fast one can carry the
          same momentum while differing enormously in energy. Momentum is what
          is conserved in a collision; energy generally is not, because some of
          it goes into deformation and heat.
        </>
      }
    />
  );
}
