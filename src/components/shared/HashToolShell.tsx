"use client";

import * as React from "react";
import { Info, ShieldAlert, TriangleAlert } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { FileDropzone } from "@/components/shared/FileDropzone";
import { Spinner } from "@/components/shared/Progress";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/misc";
import { algorithms, hashFile, hashText, hmac, type HashAlgorithm } from "@/lib/hash";
import { cn, formatBytes } from "@/lib/utils";

type Source = "text" | "file" | "hmac";

/**
 * The shared body for all six hash tools.
 *
 * One implementation, six thin pages — each targets its own search term while
 * the behaviour stays identical, so a fix lands everywhere at once.
 */
export function HashToolShell({ algorithm }: { algorithm: HashAlgorithm }) {
  const info = algorithms[algorithm];
  const supportsHmac = algorithm !== "MD5" && algorithm !== "SHA-224";

  const [source, setSource] = React.useState<Source>("text");
  const [text, setText] = React.useState("");
  const [secret, setSecret] = React.useState("");
  const [files, setFiles] = React.useState<File[]>([]);
  const [digest, setDigest] = React.useState("");
  const [busy, setBusy] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [compareTo, setCompareTo] = React.useState("");

  const file = files[0];

  React.useEffect(() => {
    let cancelled = false;

    const run = async () => {
      try {
        if (source === "file") {
          if (!file) return "";
          return await hashFile(file, algorithm);
        }
        if (source === "hmac") {
          if (!text || !secret || !supportsHmac) return "";
          return await hmac(text, secret, algorithm as "SHA-1" | "SHA-256" | "SHA-384" | "SHA-512");
        }
        return text ? await hashText(text, algorithm) : "";
      } catch {
        throw new Error("That input could not be hashed.");
      }
    };

    run()
      .then((result) => {
        if (cancelled) return;
        setDigest(result);
        setError(null);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        setDigest("");
        setError(cause instanceof Error ? cause.message : "That input could not be hashed.");
      })
      .finally(() => {
        if (!cancelled) setBusy(false);
      });

    return () => {
      cancelled = true;
    };
  }, [source, text, secret, file, algorithm, supportsHmac]);

  const comparison =
    compareTo.trim() && digest
      ? compareTo.trim().toLowerCase() === digest.toLowerCase()
      : null;

  return (
    <div className="space-y-5">
      <div className="flex flex-wrap items-center gap-3">
        <Tabs value={source} onValueChange={(value) => setSource(value as Source)}>
          <TabsList>
            <TabsTrigger value="text">Text</TabsTrigger>
            <TabsTrigger value="file">File</TabsTrigger>
            {supportsHmac ? <TabsTrigger value="hmac">HMAC</TabsTrigger> : null}
          </TabsList>
        </Tabs>

        <Badge variant="outline">
          <span data-numeric>{info.bits}</span>-bit digest
        </Badge>
        {info.security === "broken" ? (
          <Badge className="border-[color-mix(in_oklab,var(--destructive)_35%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_10%,transparent)] text-destructive">
            <ShieldAlert className="size-3" strokeWidth={2} aria-hidden="true" />
            Cryptographically broken
          </Badge>
        ) : null}
      </div>

      {source === "file" ? (
        <FileDropzone
          accept="*/*"
          acceptLabel="any file"
          maxSizeMb={200}
          files={files}
          onFilesChange={(next) => {
            setFiles(next);
            setBusy(next.length > 0);
            setError(null);
          }}
        />
      ) : (
        <>
          <div className="space-y-2">
            <div className="flex items-center justify-between gap-3">
              <Label htmlFor="hash-input">
                {source === "hmac" ? "Message" : "Text to hash"}
              </Label>
              <Button variant="ghost" size="sm" onClick={() => setText("")} disabled={!text}>
                Clear
              </Button>
            </div>
            <Textarea
              id="hash-input"
              value={text}
              onChange={(event) => setText(event.target.value)}
              placeholder="Type or paste anything…"
              className="min-h-32 font-mono text-sm"
              spellCheck={false}
            />
            <FieldHint>
              Input is encoded as UTF-8 before hashing, so accented characters and emoji produce
              the same digest as any other correct implementation.
            </FieldHint>
          </div>

          {source === "hmac" ? (
            <div className="space-y-2">
              <Label htmlFor="hash-secret" required>
                Shared secret
              </Label>
              <Input
                id="hash-secret"
                value={secret}
                onChange={(event) => setSecret(event.target.value)}
                placeholder="your-signing-key"
                className="font-mono"
                spellCheck={false}
                autoCapitalize="off"
              />
              <FieldHint>
                HMAC is the right way to verify a message came from someone holding this key.
                Hashing <code className="font-mono">key + message</code> yourself is vulnerable to
                length-extension; HMAC is not.
              </FieldHint>
            </div>
          ) : null}
        </>
      )}

      {error ? (
        <p role="alert" className="text-sm text-destructive">
          {error}
        </p>
      ) : null}

      <section className="space-y-2">
        <div className="flex items-center justify-between gap-2">
          <h2 className="flex items-center gap-2 text-sm font-medium text-foreground">
            {info.label} digest
            {busy ? <Spinner className="size-3.5" /> : null}
          </h2>
          <CopyButton value={digest} label="Copy" disabled={!digest} />
        </div>
        <output
          className="block min-h-14 break-all rounded-lg border border-border bg-surface p-4 font-mono text-sm text-foreground"
          aria-live="polite"
        >
          {digest || (
            <span className="text-subtle-foreground">
              {source === "file"
                ? "Drop a file to hash it."
                : source === "hmac"
                  ? "Enter a message and a secret."
                  : "Type something above."}
            </span>
          )}
        </output>
        {file && source === "file" && digest ? (
          <p className="text-xs text-muted-foreground">
            {file.name} · <span data-numeric>{formatBytes(file.size)}</span> — hashed in your
            browser, never uploaded.
          </p>
        ) : null}
      </section>

      <div className="space-y-2">
        <Label htmlFor="hash-compare">Compare against a known digest</Label>
        <Input
          id="hash-compare"
          value={compareTo}
          onChange={(event) => setCompareTo(event.target.value)}
          placeholder="Paste a checksum to verify a download"
          className="font-mono"
          spellCheck={false}
          autoCapitalize="off"
        />
        {comparison !== null ? (
          <p
            className={cn(
              "flex items-center gap-2 text-sm",
              comparison ? "text-success" : "text-destructive",
            )}
            role="status"
          >
            {comparison ? (
              <>
                <span aria-hidden="true">✓</span> Match — the file is byte-for-byte what the
                publisher hashed.
              </>
            ) : (
              <>
                <TriangleAlert className="size-4 shrink-0" strokeWidth={2} aria-hidden="true" />
                No match. The file differs from the one that produced that checksum.
              </>
            )}
          </p>
        ) : null}
      </div>

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          <strong className="text-foreground">
            A hash cannot be decrypted — there is no inverse.
          </strong>{" "}
          {info.label} maps any input to a fixed {info.bits}-bit value, discarding information as it
          goes, so the original cannot be recovered. Sites offering to
          &ldquo;decrypt&rdquo; a hash are looking it up in a table of already-cracked common
          passwords; that only works for inputs someone has already guessed.
        </span>
      </p>

      <p className="flex items-start gap-2 text-sm text-muted-foreground">
        {info.security === "broken" ? (
          <ShieldAlert className="mt-0.5 size-4 shrink-0 text-destructive" strokeWidth={1.75} />
        ) : (
          <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        )}
        <span>{info.note}</span>
      </p>

      <p className="text-sm text-muted-foreground">
        Storing passwords? Don&rsquo;t use a plain hash of any kind — they are built to be fast,
        which is exactly wrong for a password. Use a deliberately slow, salted algorithm like{" "}
        <strong className="text-foreground">argon2id</strong>, <strong className="text-foreground">scrypt</strong>{" "}
        or <strong className="text-foreground">bcrypt</strong>.
      </p>
    </div>
  );
}
