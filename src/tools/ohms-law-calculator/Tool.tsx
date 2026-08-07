"use client";

import { SolveForCalculator } from "@/components/shared/SolveForCalculator";
import { formulas, solve, variables } from "./logic";

export default function OhmsLawCalculatorTool() {
  return (
    <SolveForCalculator
      variables={variables}
      formulas={formulas}
      solve={solve}
      defaults={{ v: "5", i: "0.02", r: "250", p: "0.1" }}
      footnote={
        <>
          Ohm&rsquo;s law holds for ohmic components — resistors, wire, most
          loads at a fixed temperature. It does not describe diodes, LEDs or
          transistors, whose resistance changes with the voltage across them.
          For an LED, use the LED resistor calculator instead.
        </>
      }
    />
  );
}
