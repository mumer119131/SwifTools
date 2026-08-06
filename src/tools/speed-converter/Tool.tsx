"use client";

import { UnitConverterShell } from "@/components/shared/UnitConverterShell";
import { categoryId, defaultFrom, defaultTo } from "./logic";

export default function SpeedConverterTool() {
  return (
    <UnitConverterShell
      categoryId={categoryId}
      defaultFrom={defaultFrom}
      defaultTo={defaultTo}
    />
  );
}
