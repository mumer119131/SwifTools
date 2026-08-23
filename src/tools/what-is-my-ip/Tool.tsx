"use client";

import * as React from "react";
import { Globe, ShieldCheck, TriangleAlert } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Spinner } from "@/components/shared/Progress";
import { useClientValue, useHydrated } from "@/lib/use-client-value";
import { describeBrowser, describeOs, fetchIp } from "./logic";

interface Fact {
  label: string;
  value: string;
}

export default function WhatIsMyIpTool() {
  const [state, setState] = React.useState<{
    ip: string | null;
    version: 4 | 6 | null;
    error: string | null;
  } | null>(null);

  React.useEffect(() => {
    let cancelled = false;

    fetchIp()
      .then((result) => {
        if (!cancelled) setState({ ...result, error: null });
      })
      .catch(() => {
        if (!cancelled) {
          setState({ ip: null, version: null, error: "Could not read your IP address." });
        }
      });

    return () => {
      cancelled = true;
    };
  }, []);

  const hydrated = useHydrated();

  // Read one at a time as primitives: useClientValue compares snapshots with
  // Object.is, so returning a fresh object here would never settle.
  const ua = useClientValue(() => navigator.userAgent, "");
  const language = useClientValue(() => navigator.language, "");
  const timezone = useClientValue(
    () => Intl.DateTimeFormat().resolvedOptions().timeZone,
    "",
  );
  const screenSize = useClientValue(() => `${screen.width} × ${screen.height}`, "");
  const viewport = useClientValue(() => `${innerWidth} × ${innerHeight}`, "");
  const pixelRatio = useClientValue(() => devicePixelRatio, 1);
  const cookiesEnabled = useClientValue(() => navigator.cookieEnabled, true);

  const facts: Fact[] = hydrated
    ? [
        { label: "Browser", value: describeBrowser(ua) ?? "Not reported" },
        { label: "Operating system", value: describeOs(ua) ?? "Not reported" },
        { label: "Time zone", value: timezone || "Not reported" },
        { label: "Language", value: language || "Not reported" },
        { label: "Screen", value: screenSize },
        { label: "Browser window", value: viewport },
        { label: "Device pixel ratio", value: `${pixelRatio}×` },
        { label: "Cookies", value: cookiesEnabled ? "Enabled" : "Blocked" },
      ]
    : [];

  return (
    <div className="space-y-6">
      <div className="rounded-lg border border-border bg-surface p-6 text-center">
        <p className="text-sm text-muted-foreground">Your public IP address</p>

        {state === null ? (
          <p className="mt-3 flex items-center justify-center gap-2 text-muted-foreground">
            <Spinner /> Looking it up…
          </p>
        ) : state.error !== null ? (
          <p className="mt-3 flex items-center justify-center gap-2 text-sm text-muted-foreground">
            <TriangleAlert className="size-4" strokeWidth={1.75} /> {state.error}
          </p>
        ) : state.ip === null ? (
          <p className="mt-3 text-sm text-muted-foreground">
            No address was forwarded — you may be on a local development server.
          </p>
        ) : (
          <>
            <p
              className="font-display mt-2 break-all text-3xl text-foreground sm:text-4xl"
              data-numeric
            >
              {state.ip}
            </p>
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1 text-xs text-muted-foreground">
                <Globe className="size-3.5" strokeWidth={1.75} />
                IPv{state.version}
              </span>
              <CopyButton value={state.ip} label="Copy address" />
            </div>
          </>
        )}
      </div>

      <div>
        <h2 className="text-[0.9375rem] font-medium text-foreground">What your browser reveals</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Read from your own browser. None of it is sent anywhere.
        </p>

        <dl className="mt-4 grid gap-px overflow-hidden rounded-lg border border-border bg-border sm:grid-cols-2">
          {facts.map((fact) => (
            <div key={fact.label} className="bg-surface px-4 py-3">
              <dt className="text-xs text-subtle-foreground">{fact.label}</dt>
              <dd className="mt-0.5 break-words text-sm text-foreground">{fact.value}</dd>
            </div>
          ))}
          {facts.length === 0 ? (
            <div className="bg-surface px-4 py-3 text-sm text-muted-foreground">Reading…</div>
          ) : null}
        </dl>
      </div>

      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-subtle-foreground" strokeWidth={1.75} />
        Your address is read by this site&rsquo;s own endpoint, not a third-party lookup service, and
        is not logged or stored.
      </p>
    </div>
  );
}
