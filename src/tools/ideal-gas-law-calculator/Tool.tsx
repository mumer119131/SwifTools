"use client";

import { SolveForCalculator } from "@/components/shared/SolveForCalculator";
import { derive, formulas, solve, variables } from "./logic";

export default function IdealGasLawCalculatorTool() {
  return (
    <SolveForCalculator
      variables={variables}
      formulas={formulas}
      solve={solve}
      derive={derive}
      defaults={{ P: "101325", V: "0.0224", n: "1", T: "273.15" }}
      footnote={
        <>
          Temperature must be absolute — kelvin, not Celsius — because the
          equation is a proportionality and Celsius has an arbitrary zero.
          Using 20 rather than 293.15 is the single commonest mistake here and
          produces an answer that is wrong by a factor of about fifteen. Boyle&rsquo;s
          and Charles&rsquo;s laws are both special cases of this equation with
          one variable held fixed.
        </>
      }
    />
  );
}
