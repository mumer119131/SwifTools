"use client";

import * as React from "react";
import { Check, ShieldAlert, ShieldCheck } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import {
  encode,
  encodingLabels,
  hashes,
  hmac,
  keyFormatLabels,
  timingSafeEqual,
  type Encoding,
  type HashName,
  type KeyFormat,
} from "./logic";

export default function HmacGeneratorTool() {
  const [message, setMessage] = React.useState("");
  const [key, setKey] = React.useState("");
  const [hash, setHash] = React.useState<HashName>("SHA-256");
  const [encoding, setEncoding] = React.useState<Encoding>("hex");
  const [keyFormat, setKeyFormat] = React.useState<KeyFormat>("text");
  const [expected, setExpected] = React.useState("");
  const [signature, setSignature] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (message === "" || key === "") {
      return;
    }

    let cancelled = false;
    hmac(message, key, hash, keyFormat)
      .then((bytes) => {
        if (cancelled) return;
        setSignature(encode(bytes, encoding));
        setError(null);
      })
      .catch((cause: unknown) => {
        if (cancelled) return;
        setSignature("");
        setError(cause instanceof Error ? cause.message : "That could not be signed.");
      });

    return () => {
      cancelled = true;
    };
  }, [message, key, hash, encoding, keyFormat]);

  const ready = message !== "" && key !== "" && signature !== "";
  const matches = ready && expected.trim() !== "" ? timingSafeEqual(signature, expected) : null;

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="hmac-message">Message</Label>
        <Textarea
          id="hmac-message"
          value={message}
          onChange={(event) => {
            setMessage(event.target.value);
            if (event.target.value === "") setSignature("");
          }}
          placeholder="The exact bytes you want to sign — for a webhook, the raw request body"
          rows={5}
          spellCheck={false}
          className="font-mono text-sm"
        />
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div className="space-y-1.5">
          <Label htmlFor="hmac-key">Secret key</Label>
          <Input
            id="hmac-key"
            type="password"
            value={key}
            onChange={(event) => {
              setKey(event.target.value);
              if (event.target.value === "") setSignature("");
            }}
            placeholder="Your signing secret"
            spellCheck={false}
            autoComplete="off"
            className="font-mono"
          />
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="hmac-key-format">Key is written as</Label>
          <Select value={keyFormat} onValueChange={(value) => setKeyFormat(value as KeyFormat)}>
            <SelectTrigger id="hmac-key-format">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(keyFormatLabels) as KeyFormat[]).map((value) => (
                <SelectItem key={value} value={value}>
                  {keyFormatLabels[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="hmac-hash">Hash</Label>
          <Select value={hash} onValueChange={(value) => setHash(value as HashName)}>
            <SelectTrigger id="hmac-hash">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {hashes.map((value) => (
                <SelectItem key={value} value={value}>
                  {value}
                  {value === "SHA-1" ? " — legacy APIs only" : ""}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-1.5">
          <Label htmlFor="hmac-encoding">Output as</Label>
          <Select value={encoding} onValueChange={(value) => setEncoding(value as Encoding)}>
            <SelectTrigger id="hmac-encoding">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {(Object.keys(encodingLabels) as Encoding[]).map((value) => (
                <SelectItem key={value} value={value}>
                  {encodingLabels[value]}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {error ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          {error}
        </p>
      ) : null}

      {ready ? (
        <div className="surface-card overflow-hidden">
          <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-2.5">
            <span className="text-sm text-muted-foreground">
              HMAC-{hash.replace("-", "")} · {encodingLabels[encoding]}
            </span>
            <CopyButton value={signature} />
          </div>
          <p className="break-all px-4 py-3 font-mono text-sm text-foreground">{signature}</p>
        </div>
      ) : null}

      <div className="space-y-1.5">
        <Label htmlFor="hmac-expected">Verify a signature you were sent</Label>
        <Input
          id="hmac-expected"
          value={expected}
          onChange={(event) => setExpected(event.target.value)}
          placeholder="Paste the signature header value"
          spellCheck={false}
          className="font-mono"
        />
        {matches === true ? (
          <p className="flex items-center gap-2 pt-1 text-sm text-[var(--success)]">
            <ShieldCheck className="size-4 shrink-0" strokeWidth={1.75} />
            Signatures match. This message was signed with that key and has not been altered.
          </p>
        ) : matches === false ? (
          <p className="flex items-start gap-2 pt-1 text-sm text-destructive">
            <ShieldAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
            <span>
              They do not match. Before assuming tampering, check that you signed the raw
              request body byte for byte — parsing the JSON and re-serialising it changes the
              bytes — and that the encoding above matches what the provider sends.
            </span>
          </p>
        ) : null}
        <p className="flex items-start gap-2 pt-2 text-xs text-muted-foreground">
          <Check className="mt-0.5 size-3.5 shrink-0" strokeWidth={2} />
          <span>
            This comparison is constant-time. Use one in your own code too —{" "}
            <code className="font-mono">===</code> returns at the first differing character, and
            how long that takes leaks how much of a guess was correct.
          </span>
        </p>
      </div>
    </div>
  );
}
