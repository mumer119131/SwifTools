"use client";

import * as React from "react";
import { Download, Share, SquarePlus, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";

/**
 * The event Chromium fires when a site meets the installability criteria.
 * Not in the DOM lib, because it is not a standard.
 */
interface InstallEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
}

const DISMISSED_KEY = "pockettoolz:install-dismissed";

/**
 * Offers to install the site, once, quietly.
 *
 * Two paths, because the platforms differ. Chromium fires
 * `beforeinstallprompt` and lets a page trigger the native dialogue; iOS
 * Safari fires nothing at all and requires the user to find Share → Add to
 * Home Screen themselves, so the only useful thing to do there is say so.
 *
 * Shown after a delay rather than immediately. An install prompt in the first
 * seconds of a first visit is an interruption before the site has demonstrated
 * it is worth keeping; after half a minute of use it is an offer.
 */
export function InstallPrompt() {
  const [dismissed, setDismissed] = useLocalStorage(DISMISSED_KEY, false);
  const [event, setEvent] = React.useState<InstallEvent | null>(null);
  const [showIos, setShowIos] = React.useState(false);
  const [ready, setReady] = React.useState(false);

  React.useEffect(() => {
    // Already installed — nothing to offer.
    const standalone =
      window.matchMedia?.("(display-mode: standalone)").matches ||
      // Safari's non-standard equivalent.
      (navigator as { standalone?: boolean }).standalone === true;
    if (standalone) return;

    const onPrompt = (incoming: Event) => {
      // Keep the event so the dialogue can be raised from a real click later;
      // browsers reject `prompt()` outside a user gesture.
      incoming.preventDefault();
      setEvent(incoming as InstallEvent);
    };

    window.addEventListener("beforeinstallprompt", onPrompt);

    const isIos = /iphone|ipad|ipod/i.test(navigator.userAgent);
    const isSafari = /^((?!chrome|android|crios|fxios).)*safari/i.test(navigator.userAgent);

    const timer = window.setTimeout(() => {
      setReady(true);
      if (isIos && isSafari) setShowIos(true);
    }, 30_000);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.clearTimeout(timer);
    };
  }, []);

  const visible = !dismissed && ready && (event !== null || showIos);
  if (!visible) return null;

  async function install() {
    if (!event) return;
    await event.prompt();
    await event.userChoice;
    // Either way the offer is spent: the event cannot be reused.
    setEvent(null);
    setDismissed(true);
  }

  return (
    <div
      className={cn(
        "fixed inset-x-4 bottom-4 z-50 mx-auto max-w-md rounded-lg border border-border bg-background p-4 shadow-lg",
        "animate-reveal sm:inset-x-auto sm:right-6",
      )}
      role="dialog"
      aria-label="Install PocketToolz"
    >
      <div className="flex items-start gap-3">
        <span className="grid size-9 shrink-0 place-items-center rounded-md border border-border bg-surface">
          <Download className="size-4 text-foreground" strokeWidth={1.75} />
        </span>

        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">Keep it to hand</p>

          {showIos ? (
            <p className="mt-1 flex flex-wrap items-center gap-x-1 text-sm leading-relaxed text-muted-foreground">
              Tap
              <Share className="inline size-3.5" strokeWidth={1.75} aria-label="the Share button" />
              then
              <SquarePlus className="inline size-3.5" strokeWidth={1.75} aria-hidden="true" />
              <span className="text-foreground">Add to Home Screen</span> — it
              opens like an app and works without a connection.
            </p>
          ) : (
            <p className="mt-1 text-sm leading-relaxed text-muted-foreground">
              Add it to your home screen. It opens like an app and works
              offline, because the tools never needed a server anyway.
            </p>
          )}

          {!showIos ? (
            <Button size="sm" className="mt-3" onClick={() => void install()}>
              Install
            </Button>
          ) : null}
        </div>

        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0"
          onClick={() => setDismissed(true)}
          aria-label="Not now"
        >
          <X className="size-3.5" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}
