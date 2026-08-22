"use client";

import { SolveForCalculator } from "@/components/shared/SolveForCalculator";
import { derive, formulas, solve, variables } from "./logic";

export default function WorkDoneCalculatorTool() {
  return (
    <SolveForCalculator
      variables={variables}
      formulas={formulas}
      solve={solve}
      derive={derive}
      defaults={{ W: "500", F: "100", d: "5" }}
      footnote={
        <>
          Only motion along the force counts. Carrying a heavy box across a
          level floor does no work in the physics sense at all — the force is
          upward and the motion horizontal — however tired it makes you, because
          the effort goes into holding the box rather than moving it against
          anything. At an angle the work is F × d × cos θ.
        </>
      }
    />
  );
}
