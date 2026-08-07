"use client";

import { SolveForCalculator } from "@/components/shared/SolveForCalculator";
import { derive, formulas, solve, variables } from "./logic";

export default function VoltageDividerCalculatorTool() {
  return (
    <SolveForCalculator
      variables={variables}
      formulas={formulas}
      solve={solve}
      derive={derive}
      defaults={{ vout: "3.3", vin: "5", r1: "1700", r2: "3300" }}
      footnote={
        <>
          This assumes nothing is drawing current from the output. Connect a
          load and it sits in parallel with R2, pulling the output lower — which
          is why a divider is fine for a reference or an ADC input, and wrong as
          a power supply. Keep the divider current well above whatever the load
          draws, or buffer it with an op-amp.
        </>
      }
    />
  );
}
