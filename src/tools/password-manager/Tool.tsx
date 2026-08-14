"use client";

import * as React from "react";
import Link from "next/link";
import { AlertTriangle, Eye, EyeOff, Lock, LockOpen, Plus, Trash2, X } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useLocalStorage } from "@/lib/use-local-storage";
import { cn } from "@/lib/utils";
import {
  assessMaster,
  decryptVault,
  encryptVault,
  ITERATIONS,
  type Entry,
  type StoredVault,
} from "./logic";

/** Minutes of inactivity before the vault locks itself. */
const AUTO_LOCK_SECONDS = 300;

const BLANK: Entry = { id: "", site: "", username: "", password: "", notes: "" };

export default function PasswordManagerTool() {
  const [stored, setStored, clearStored] = useLocalStorage<StoredVault | null>(
    "swiftknife:vault",
    null,
  );

  const [master, setMaster] = React.useState("");
  const [confirmMaster, setConfirmMaster] = React.useState("");
  const [entries, setEntries] = React.useState<Entry[] | null>(null);
  const [error, setError] = React.useState<string | null>(null);
  const [busy, setBusy] = React.useState(false);
  const [visible, setVisible] = React.useState<Set<string>>(new Set());
  const [idle, setIdle] = React.useState(0);
  const [draft, setDraft] = React.useState(BLANK);

  const unlocked = entries !== null;
  const strength = assessMaster(master);

  /*
   * Auto-lock. The countdown and the lock both happen inside the interval
   * callback rather than in a second effect watching the counter — locking from
   * an effect body would fire during render, which React Compiler rejects and
   * which would also drop the key at an unpredictable moment.
   */
  React.useEffect(() => {
    if (!unlocked) return;

    const timer = window.setInterval(() => {
      setIdle((seconds) => {
        if (seconds + 1 < AUTO_LOCK_SECONDS) return seconds + 1;

        setEntries(null);
        setMaster("");
        setVisible(new Set());
        return 0;
      });
    }, 1000);

    return () => window.clearInterval(timer);
  }, [unlocked]);

  function touch() {
    setIdle(0);
  }

  async function create() {
    if (master !== confirmMaster) {
      setError("The two master passwords do not match.");
      return;
    }
    if (master.length < 8) {
      setError("Use at least eight characters — twelve or more is much better.");
      return;
    }

    setBusy(true);
    setStored(await encryptVault([], master));
    setEntries([]);
    setConfirmMaster("");
    setError(null);
    setBusy(false);
  }

  async function unlock() {
    if (!stored) return;

    setBusy(true);
    const result = await decryptVault(stored, master);
    setBusy(false);

    if (result === null) {
      setError("That master password does not open this vault.");
      return;
    }

    setEntries(result);
    setError(null);
    setIdle(0);
  }

  async function persist(next: Entry[]) {
    setEntries(next);
    setBusy(true);
    setStored(await encryptVault(next, master));
    setBusy(false);
    touch();
  }

  return (
    <div className="space-y-5">
      <div className="flex items-start gap-3 rounded-lg border border-[var(--warning)] bg-[color-mix(in_oklab,var(--warning)_10%,transparent)] px-4 py-3.5">
        <AlertTriangle className="mt-0.5 size-5 shrink-0 text-[var(--warning)]" strokeWidth={1.75} />
        <div className="space-y-1.5 text-sm text-foreground">
          <p className="font-medium">Read this before you put a real password in.</p>
          <p className="text-muted-foreground">
            This vault is a web page. Any script that runs on this page while it
            is unlocked can read every entry, and a web page cannot fully defend
            against that. A dedicated password manager runs as a browser
            extension or a native app for exactly this reason, and one of those is
            the right tool for the passwords that matter — your email, your bank,
            anything with money or identity behind it.
          </p>
          <p className="text-muted-foreground">
            What this is good for: keeping a handful of low-stakes credentials off
            a plain text file, on a machine where you cannot install anything.
            Encryption here is real — AES-GCM with a PBKDF2 key at{" "}
            {ITERATIONS.toLocaleString("en-US")} iterations, and nothing but
            ciphertext is stored — but strong encryption around a weak boundary
            is still a weak boundary.
          </p>
        </div>
      </div>

      {!unlocked ? (
        <div className="surface-card mx-auto max-w-md space-y-4 p-6">
          <h2 className="text-lg text-foreground">
            {stored ? "Unlock your vault" : "Create a vault"}
          </h2>

          <div className="space-y-2">
            <Label htmlFor="pm-master">Master password</Label>
            <Input
              id="pm-master"
              type="password"
              value={master}
              onChange={(event) => setMaster(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter" && stored) void unlock();
              }}
              autoComplete={stored ? "current-password" : "new-password"}
              placeholder="Four unrelated words works well"
            />
            {!stored && strength.label ? (
              <>
                <div className="flex gap-1">
                  {[1, 2, 3, 4].map((step) => (
                    <span
                      key={step}
                      className={cn(
                        "h-1 flex-1 rounded-full",
                        step <= strength.score
                          ? strength.score <= 2
                            ? "bg-destructive"
                            : strength.score === 3
                              ? "bg-[var(--warning)]"
                              : "bg-[var(--success)]"
                          : "bg-surface-hover",
                      )}
                    />
                  ))}
                </div>
                <FieldHint>
                  {strength.label} — {strength.hint}
                </FieldHint>
              </>
            ) : null}
          </div>

          {!stored ? (
            <div className="space-y-2">
              <Label htmlFor="pm-confirm">Confirm it</Label>
              <Input
                id="pm-confirm"
                type="password"
                value={confirmMaster}
                onChange={(event) => setConfirmMaster(event.target.value)}
                autoComplete="new-password"
              />
              <FieldHint>
                There is no recovery. Forget this and the vault is gone for good —
                that is what makes it secure and what makes it unforgiving.
              </FieldHint>
            </div>
          ) : null}

          {error ? <p className="text-sm text-destructive">{error}</p> : null}

          <div className="flex flex-wrap gap-2">
            <Button
              onClick={() => (stored ? void unlock() : void create())}
              disabled={busy || master.length === 0}
            >
              <LockOpen className="size-4" strokeWidth={1.75} />
              {busy ? "Deriving key…" : stored ? "Unlock" : "Create vault"}
            </Button>
            {stored ? (
              <Button
                variant="ghost"
                onClick={() => {
                  clearStored();
                  setMaster("");
                  setError(null);
                }}
              >
                <Trash2 className="size-4" strokeWidth={1.75} />
                Delete this vault
              </Button>
            ) : null}
          </div>

          {busy ? (
            <FieldHint>
              {ITERATIONS.toLocaleString("en-US")} PBKDF2 iterations take a moment
              on purpose — that delay is what makes guessing the master password
              expensive.
            </FieldHint>
          ) : null}
        </div>
      ) : (
        <div className="space-y-4" onPointerDown={touch} onKeyDown={touch}>
          <div className="surface-card flex flex-wrap items-center justify-between gap-3 p-4">
            <p className="text-sm text-muted-foreground">
              <span className="font-mono text-foreground">{entries.length}</span>{" "}
              {entries.length === 1 ? "entry" : "entries"} · locks in{" "}
              <span className="font-mono text-foreground" data-numeric>
                {Math.max(0, AUTO_LOCK_SECONDS - idle)}s
              </span>{" "}
              of inactivity
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setEntries(null);
                setMaster("");
                setVisible(new Set());
              }}
            >
              <Lock className="size-4" strokeWidth={1.75} />
              Lock now
            </Button>
          </div>

          <form
            className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-5"
            onSubmit={(event) => {
              event.preventDefault();
              if (!draft.site.trim()) return;
              void persist([...entries, { ...draft, id: `entry-${Date.now()}` }]);
              setDraft(BLANK);
            }}
          >
            {[
              { key: "site" as const, label: "Site or app", type: "text" },
              { key: "username" as const, label: "Username", type: "text" },
              { key: "password" as const, label: "Password", type: "password" },
            ].map((field) => (
              <div key={field.key} className="space-y-2">
                <Label htmlFor={`pm-${field.key}`}>{field.label}</Label>
                <Input
                  id={`pm-${field.key}`}
                  type={field.type}
                  value={draft[field.key]}
                  onChange={(event) =>
                    setDraft((current) => ({ ...current, [field.key]: event.target.value }))
                  }
                  autoComplete="off"
                />
              </div>
            ))}
            <div className="space-y-2">
              <Label htmlFor="pm-notes">Notes</Label>
              <Textarea
                id="pm-notes"
                value={draft.notes}
                onChange={(event) => setDraft((current) => ({ ...current, notes: event.target.value }))}
                rows={1}
              />
            </div>
            <div className="flex items-end pb-1">
              <Button type="submit" disabled={busy}>
                <Plus className="size-4" strokeWidth={1.75} />
                Add
              </Button>
            </div>
          </form>

          {entries.length > 0 ? (
            <ul className="surface-card divide-y divide-border overflow-hidden">
              {entries.map((entry) => {
                const shown = visible.has(entry.id);

                return (
                  <li key={entry.id} className="flex flex-wrap items-center gap-4 px-5 py-3">
                    <div className="min-w-32 flex-1">
                      <p className="text-sm text-foreground">{entry.site}</p>
                      <p className="text-xs text-muted-foreground">{entry.username}</p>
                    </div>

                    <p className="font-mono text-sm text-foreground">
                      {shown ? entry.password : "••••••••••"}
                    </p>

                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={shown ? "Hide password" : "Show password"}
                        onClick={() => {
                          touch();
                          setVisible((current) => {
                            const next = new Set(current);
                            if (next.has(entry.id)) next.delete(entry.id);
                            else next.add(entry.id);
                            return next;
                          });
                        }}
                      >
                        {shown ? (
                          <EyeOff className="size-4" strokeWidth={1.75} />
                        ) : (
                          <Eye className="size-4" strokeWidth={1.75} />
                        )}
                      </Button>
                      <CopyButton value={entry.password} iconOnly label="Copy password" />
                      <Button
                        variant="ghost"
                        size="icon"
                        aria-label={`Delete ${entry.site}`}
                        onClick={() =>
                          void persist(entries.filter((item) => item.id !== entry.id))
                        }
                      >
                        <X className="size-4" strokeWidth={1.75} />
                      </Button>
                    </div>

                    {entry.notes ? (
                      <p className="w-full text-xs text-subtle-foreground">{entry.notes}</p>
                    ) : null}
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="rounded-lg border border-dashed border-border px-6 py-12 text-center text-sm text-muted-foreground">
              The vault is empty. Add an entry above.
            </p>
          )}
        </div>
      )}

      <p className="rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        A fresh random salt and IV are generated on every save, so no two saves of
        the same vault produce the same ciphertext. AES-GCM checks its
        authentication tag before decrypting, which means a wrong master password
        or a tampered vault fails outright rather than returning plausible
        rubbish. Need strong passwords to put in here? The{" "}
        <Link
          href="/generator/password-generator"
          className="underline underline-offset-2 hover:text-foreground"
        >
          password generator
        </Link>{" "}
        makes them.
      </p>
    </div>
  );
}
