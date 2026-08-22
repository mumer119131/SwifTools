"use client";

import { SolveForCalculator } from "@/components/shared/SolveForCalculator";
import { derive, formulas, solve, variables } from "./logic";

export default function HookesLawCalculatorTool() {
  return (
    <SolveForCalculator
      variables={variables}
      formulas={formulas}
      solve={solve}
      derive={derive}
      defaults={{ F: "20", k: "100", x: "0.2" }}
      footnote={
        <>
          The energy stored is ½kx², not force times extension — the force rises
          linearly as the spring stretches, so the average force over the
          stretch is half the final one. Hooke&rsquo;s law also only holds up to
          the elastic limit; past it a spring deforms permanently and the
          relationship stops being linear.
        </>
      }
    />
  );
}
