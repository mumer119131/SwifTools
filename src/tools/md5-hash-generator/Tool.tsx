"use client";

import { HashToolShell } from "@/components/shared/HashToolShell";
import { algorithm } from "./logic";

export default function Md5HashGeneratorTool() {
  return <HashToolShell algorithm={algorithm} />;
}
