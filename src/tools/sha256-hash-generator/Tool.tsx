"use client";

import { HashToolShell } from "@/components/shared/HashToolShell";
import { algorithm } from "./logic";

export default function Sha256HashGeneratorTool() {
  return <HashToolShell algorithm={algorithm} />;
}
