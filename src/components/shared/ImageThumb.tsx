"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

/**
 * Thumbnail for a locally-selected image.
 *
 * The source is an object URL created in the browser, so `next/image` cannot
 * optimise it and a plain `<img>` is the correct element here. The URL is
 * revoked on unmount so repeated selections don't leak memory.
 */
export function ImageThumb({ file, className }: { file: File; className?: string }) {
  const url = React.useMemo(() => URL.createObjectURL(file), [file]);

  React.useEffect(() => () => URL.revokeObjectURL(url), [url]);

  return (
    <span
      className={cn(
        "block size-9 overflow-hidden rounded border border-border bg-surface-hover",
        className,
      )}
    >
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={url} alt="" aria-hidden="true" className="size-full object-cover" />
    </span>
  );
}
