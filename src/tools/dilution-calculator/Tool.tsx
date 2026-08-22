"use client";

import { SolveForCalculator } from "@/components/shared/SolveForCalculator";
import { derive, formulas, solve, variables } from "./logic";

export default function DilutionCalculatorTool() {
  return (
    <SolveForCalculator
      variables={variables}
      formulas={formulas}
      solve={solve}
      derive={derive}
      defaults={{ C1: "2", V1: "25", C2: "0.5", V2: "100" }}
      footnote={
        <>
          C₁V₁ = C₂V₂ works in any units provided you are consistent — molarity
          and millilitres, or percent and litres — because the units cancel. The
          final volume is the <em>total</em> after dilution, not the solvent
          added: to make 100 mL from 25 mL of stock you add 75 mL, and the tool
          gives that figure separately because it is the one you actually
          measure out.
        </>
      }
    />
  );
}
