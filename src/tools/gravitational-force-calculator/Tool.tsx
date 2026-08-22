"use client";

import { SolveForCalculator } from "@/components/shared/SolveForCalculator";
import { derive, formulas, solve, variables } from "./logic";

export default function GravitationalForceCalculatorTool() {
  return (
    <SolveForCalculator
      variables={variables}
      formulas={formulas}
      solve={solve}
      derive={derive}
      defaults={{ F: "1.982e20", m1: "5.972e24", m2: "7.348e22", r: "3.844e8" }}
      footnote={
        <>
          Distance is measured between centres of mass, not between surfaces —
          using the gap between two planets rather than their separation is a
          common and large error. The inverse square is the part worth
          internalising: doubling the distance leaves a quarter of the force,
          and ten times the distance leaves a hundredth. Scientific notation
          like <code className="font-mono">5.972e24</code> is accepted.
        </>
      }
    />
  );
}
