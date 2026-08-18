"use client";

import * as React from "react";
import { Download, X } from "lucide-react";

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

/**
 * When the offer was last dismissed, as a timestamp.
 *
 * Originally a boolean, which hid the offer for good — someone who tapped away
 * on their first visit could never find it again, and there is no other route
 * to installing. A timestamp lets it return, occasionally.
 */
const DISMISSED_KEY = "pockettoolz:install-dismissed-at";

/** Long enough not to nag, short enough that a change of mind is possible. */
const SNOOZE_MS = 60 * 24 * 60 * 60 * 1000;

/**
 * The iOS Share button, drawn to match.
 *
 * Inline rather than from the icon set: this has to be recognisable as the
 * exact glyph on the device — a rounded tray with an arrow lifting out of it —
 * and a generic "share" icon that looks slightly different is worse than none,
 * because it sends people looking for the wrong shape.
 */
function IosShareGlyph() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.9}
      strokeLinecap="round"
      strokeLinejoin="round"
      className="mx-1 inline-block size-4 -translate-y-px text-foreground"
      aria-label="the Share button"
      role="img"
    >
      <path d="M12 3v12" />
      <path d="m8 7 4-4 4 4" />
      <path d="M7 11H6a2 2 0 0 0-2 2v6a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-6a2 2 0 0 0-2-2h-1" />
    </svg>
  );
}

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
  const [dismissedAt, setDismissedAt] = useLocalStorage<number>(DISMISSED_KEY, 0);
  const [event, setEvent] = React.useState<InstallEvent | null>(null);
  const [showIos, setShowIos] = React.useState(false);
  const [ready, setReady] = React.useState(false);
  const [readyAt, setReadyAt] = React.useState(0);

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
      setReadyAt(Date.now());
      if (isIos && isSafari) setShowIos(true);
    }, 30_000);

    return () => {
      window.removeEventListener("beforeinstallprompt", onPrompt);
      window.clearTimeout(timer);
    };
  }, []);

  // `Date.now()` is not read during render — the snooze is compared against the
  // moment the component decided it was ready, which is stable.
  const snoozed = dismissedAt > 0 && readyAt > 0 && readyAt - dismissedAt < SNOOZE_MS;
  const visible = !snoozed && ready && (event !== null || showIos);
  if (!visible) return null;

  async function install() {
    if (!event) return;
    await event.prompt();
    await event.userChoice;
    // Either way the offer is spent: the event cannot be reused.
    setEvent(null);
    setDismissedAt(Date.now());
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
            <div className="mt-1 space-y-2 text-sm leading-relaxed text-muted-foreground">
              <p>Opens like an app, and works without a connection.</p>
              {/*
                Numbered and located, because the previous version showed the
                icon without saying where it is — and on iOS it is genuinely
                hard to find. The bar hides on scroll, and the menu item sits
                below the fold of the share sheet.
              */}
              <ol className="space-y-1.5">
                <li className="flex gap-2">
                  <span className="text-subtle-foreground">1.</span>
                  <span>
                    Tap
                    <IosShareGlyph />
                    in the bar at the{" "}
                    <span className="text-foreground">bottom of the screen</span>.
                    If you cannot see it, tap the very bottom or scroll up — the
                    bar hides itself as you read.
                  </span>
                </li>
                <li className="flex gap-2">
                  <span className="text-subtle-foreground">2.</span>
                  <span>
                    Scroll down the menu that appears — past the row of apps —
                    and choose{" "}
                    <span className="text-foreground">Add to Home Screen</span>.
                  </span>
                </li>
              </ol>
              <p className="text-xs text-subtle-foreground">
                No Add to Home Screen in that list? You are probably in another
                app&rsquo;s browser rather than Safari. Choose{" "}
                <span className="text-muted-foreground">Open in Safari</span>{" "}
                first.
              </p>
            </div>
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
          onClick={() => setDismissedAt(Date.now())}
          aria-label="Not now"
        >
          <X className="size-3.5" strokeWidth={2} />
        </Button>
      </div>
    </div>
  );
}
