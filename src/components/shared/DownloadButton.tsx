"use client";

import * as React from "react";
import { Download } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { Spinner } from "@/components/shared/Progress";
import { downloadBlob } from "@/lib/utils";

interface DownloadButtonProps extends Omit<ButtonProps, "onClick" | "children"> {
  /** The blob itself, or a producer for blobs that are expensive to build. */
  blob: Blob | (() => Blob | Promise<Blob>);
  fileName: string;
  label?: string;
}

export function DownloadButton({
  blob,
  fileName,
  label = "Download",
  size = "lg",
  ...props
}: DownloadButtonProps) {
  const [busy, setBusy] = React.useState(false);

  async function handleDownload() {
    setBusy(true);
    try {
      const resolved = typeof blob === "function" ? await blob() : blob;
      downloadBlob(resolved, fileName);
    } finally {
      setBusy(false);
    }
  }

  return (
    <Button type="button" size={size} onClick={handleDownload} disabled={busy} {...props}>
      {busy ? <Spinner className="text-primary-foreground" /> : <Download strokeWidth={1.75} />}
      {busy ? "Preparing…" : label}
    </Button>
  );
}
