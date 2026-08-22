"use client";

import { SolveForCalculator } from "@/components/shared/SolveForCalculator";
import { derive, formulas, solve, variables } from "./logic";

export default function TorqueCalculatorTool() {
  return (
    <SolveForCalculator
      variables={variables}
      formulas={formulas}
      solve={solve}
      derive={derive}
      defaults={{ T: "50", F: "200", r: "0.25" }}
      footnote={
        <>
          This assumes the force is perpendicular to the lever arm, which is the
          usual case and the maximum. At any other angle the effective torque is
          F × r × sin θ, so a force pulled along the arm rather than across it
          produces none at all — which is why a spanner is pushed sideways and
          not outward.
        </>
      }
    />
  );
}
