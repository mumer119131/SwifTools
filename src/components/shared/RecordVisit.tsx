"use client";

import * as React from "react";

import { useRecentTools } from "@/lib/recent-tools";

/**
 * Records that this tool was opened, then renders nothing.
 *
 * Exists as its own component because `ToolShell` is a server component and
 * must stay one — it renders the tool's prose, and making it a client component
 * would ship all of that as JavaScript. This is the smallest possible client
 * island: one string in, nothing out.
 */
export function RecordVisit({ slug }: { slug: string }) {
  const [, record] = useRecentTools();

  React.useEffect(() => {
    record(slug);
  }, [record, slug]);

  return null;
}
