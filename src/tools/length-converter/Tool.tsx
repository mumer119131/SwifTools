"use client";

import { UnitConverterShell } from "@/components/shared/UnitConverterShell";
import { categoryId, defaultFrom, defaultTo } from "./logic";

export default function LengthConverterTool() {
  return (
    <UnitConverterShell
      categoryId={categoryId}
      defaultFrom={defaultFrom}
      defaultTo={defaultTo}
    />
  );
}
