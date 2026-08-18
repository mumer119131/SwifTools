import type { Metadata } from "next";
import Link from "next/link";
import { WifiOff } from "lucide-react";

import { browsableTools, toolHref } from "@/config/tools";
import { absoluteUrl } from "@/config/site";

export const metadata: Metadata = {
  title: "Offline",
  description: "You are offline. Most tools here still work.",
  alternates: { canonical: absoluteUrl("/offline") },
  // Nothing to index: it is a fallback, not a page anyone should arrive at
  // from search.
  robots: { index: false, follow: false },
};

/**
 * Shown by the service worker when a page is requested with no connection.
 *
 * It exists to make a real point rather than to apologise: almost every tool
 * on this site runs entirely in the browser, so being offline stops navigation
 * and stops very little else. A visitor who discovers that is a visitor who
 * understands what the site actually is.
 */
export default function OfflinePage() {
  const offlineCapable = browsableTools.filter((tool) => tool.processing === "client");

  const highlights = ["timer", "online-notepad", "to-do-list", "password-generator", "qr-code-generator", "word-counter"]
    .map((slug) => offlineCapable.find((tool) => tool.slug === slug))
    .filter((tool): tool is (typeof offlineCapable)[number] => Boolean(tool));

  return (
    <div className="mx-auto w-full max-w-2xl px-5 py-20 text-center sm:px-6 lg:px-8">
      <span className="mx-auto grid size-14 place-items-center rounded-full border border-border bg-surface">
        <WifiOff className="size-6 text-muted-foreground" strokeWidth={1.5} />
      </span>

      <h1 className="font-display mt-6 text-3xl text-foreground sm:text-4xl">
        You&rsquo;re offline
      </h1>

      <p className="mx-auto mt-4 max-w-lg text-pretty leading-relaxed text-muted-foreground">
        That page hasn&rsquo;t been loaded on this device before, so there is
        nothing stored to show you. Almost everything else still works —{" "}
        <span className="text-foreground">
          {offlineCapable.length} of the {browsableTools.length} tools here run
          entirely in your browser
        </span>
        , so they never needed the network in the first place.
      </p>

      {highlights.length > 0 ? (
        <>
          <h2 className="mt-10 text-sm font-medium text-foreground">
            Anything you have opened before is still available
          </h2>
          <ul className="mt-4 flex flex-wrap justify-center gap-2">
            {highlights.map((tool) => (
              <li key={tool.slug}>
                <Link
                  href={toolHref(tool)}
                  className="inline-flex h-9 items-center rounded-full border border-border bg-surface px-4 text-sm text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
                >
                  {tool.name}
                </Link>
              </li>
            ))}
          </ul>
        </>
      ) : null}

      <p className="mt-10 text-sm text-subtle-foreground">
        Reconnect and this page will load normally.
      </p>
    </div>
  );
}
