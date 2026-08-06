"use client";

import * as React from "react";
import { Check, Info, ShieldAlert, TriangleAlert, X } from "lucide-react";

import { CopyButton } from "@/components/shared/CopyButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/misc";
import { cn } from "@/lib/utils";
import { decodeJwt, readClaims, verifySignature, type VerifyResult } from "./logic";

const SAMPLE =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkFkYSBMb3ZlbGFjZSIsImlhdCI6MTcwMDAwMDAwMCwiZXhwIjoxNzAwMDAzNjAwfQ.KMUFsIDTnFmyG3nMiGM6H9FNFUROf3wh7SmqJp-QV30";

export default function JwtDecoderTool() {
  const [token, setToken] = React.useState("");
  const [secret, setSecret] = React.useState("");
  // Keyed by the exact token+secret pair the result belongs to, so a stale
  // answer from a previous keystroke is ignored rather than briefly shown.
  const [checked, setChecked] = React.useState<{ key: string; outcome: VerifyResult } | null>(null);

  const result = React.useMemo(() => decodeJwt(token), [token]);
  const verifyKey = result.ok && secret ? `${token}\u0000${secret}` : "";

  React.useEffect(() => {
    if (!verifyKey || !result.ok) return;

    let cancelled = false;
    verifySignature(result.parts, secret)
      .then((outcome) => {
        if (!cancelled) setChecked({ key: verifyKey, outcome });
      })
      .catch(() => {
        if (!cancelled) setChecked({ key: verifyKey, outcome: { status: "invalid" } });
      });

    return () => {
      cancelled = true;
    };
  }, [verifyKey, result, secret]);

  const verification: VerifyResult =
    verifyKey && checked?.key === verifyKey ? checked.outcome : { status: "idle" };

  const claims = result.ok ? readClaims(result.parts.payload) : [];
  const algorithm = result.ok ? String(result.parts.header.alg ?? "none") : "";
  const isNoneAlg = algorithm.toLowerCase() === "none";

  return (
    <div className="space-y-5">
      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Label htmlFor="jwt-input">JSON Web Token</Label>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="sm" onClick={() => setToken(SAMPLE)} disabled={!!token}>
              Use sample
            </Button>
            <Button variant="ghost" size="sm" onClick={() => setToken("")} disabled={!token}>
              Clear
            </Button>
          </div>
        </div>
        <Textarea
          id="jwt-input"
          value={token}
          onChange={(event) => setToken(event.target.value)}
          placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.…"
          className="min-h-32 break-all font-mono text-sm"
          spellCheck={false}
          autoCapitalize="off"
          aria-invalid={token.trim() !== "" && !result.ok}
        />
        <FieldHint>
          A <code className="font-mono">Bearer</code> prefix is stripped automatically. Decoding
          happens entirely in your browser — this token is never transmitted.
        </FieldHint>
      </div>

      {token.trim() && !result.ok ? (
        <p
          role="alert"
          className="flex items-start gap-2 rounded-md border border-[color-mix(in_oklab,var(--destructive)_30%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-destructive"
        >
          <TriangleAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
          <span>{result.error}</span>
        </p>
      ) : null}

      {result.ok ? (
        <>
          <div className="flex flex-wrap items-center gap-2">
            <Badge variant="outline">
              alg <span className="font-mono">{algorithm}</span>
            </Badge>
            {result.parts.header.typ ? (
              <Badge variant="outline">
                typ <span className="font-mono">{String(result.parts.header.typ)}</span>
              </Badge>
            ) : null}
            {result.parts.header.kid ? (
              <Badge variant="outline">
                kid <span className="font-mono">{String(result.parts.header.kid)}</span>
              </Badge>
            ) : null}
          </div>

          {isNoneAlg ? (
            <p className="flex items-start gap-2 rounded-md border border-[color-mix(in_oklab,var(--destructive)_30%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-destructive">
              <ShieldAlert className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
              <span>
                This token declares <code className="font-mono">alg: none</code> — it carries no
                signature at all, so anyone can forge one. A server that accepts it is trusting
                whatever the client sends.
              </span>
            </p>
          ) : null}

          <div className="grid gap-5 lg:grid-cols-2">
            <section className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-medium text-foreground">Header</h2>
                <CopyButton value={JSON.stringify(result.parts.header, null, 2)} label="Copy" />
              </div>
              <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-[0.8125rem] text-foreground">
                <code>{JSON.stringify(result.parts.header, null, 2)}</code>
              </pre>
            </section>

            <section className="space-y-2">
              <div className="flex items-center justify-between gap-2">
                <h2 className="text-sm font-medium text-foreground">Payload</h2>
                <CopyButton value={JSON.stringify(result.parts.payload, null, 2)} label="Copy" />
              </div>
              <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-[0.8125rem] text-foreground">
                <code>{JSON.stringify(result.parts.payload, null, 2)}</code>
              </pre>
            </section>
          </div>

          {claims.length > 0 ? (
            <section className="surface-card overflow-hidden">
              <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
                Claims
              </h2>
              <dl className="divide-y divide-border">
                {claims.map((claim) => (
                  <div key={claim.key} className="flex flex-wrap gap-x-4 gap-y-1 px-5 py-2.5 text-sm">
                    <dt className="w-32 shrink-0 text-muted-foreground">
                      {claim.label}
                      <span className="ml-1.5 font-mono text-xs text-subtle-foreground">
                        {claim.key}
                      </span>
                    </dt>
                    <dd className="min-w-0 flex-1 break-all font-mono text-foreground">
                      {typeof claim.raw === "object"
                        ? JSON.stringify(claim.raw)
                        : String(claim.raw)}
                      {claim.detail ? (
                        <span
                          className={cn(
                            "ml-2 font-sans text-xs",
                            claim.state === "error"
                              ? "text-destructive"
                              : claim.state === "warn"
                                ? "text-muted-foreground"
                                : "text-muted-foreground",
                          )}
                        >
                          {claim.detail}
                        </span>
                      ) : null}
                    </dd>
                  </div>
                ))}
              </dl>
            </section>
          ) : null}

          <div className="space-y-2">
            <Label htmlFor="jwt-secret">Verify signature — shared secret</Label>
            <Input
              id="jwt-secret"
              value={secret}
              onChange={(event) => setSecret(event.target.value)}
              placeholder="your-256-bit-secret"
              className="font-mono"
              spellCheck={false}
              autoCapitalize="off"
            />

            {verification.status === "valid" ? (
              <p className="flex items-center gap-2 text-sm text-success" role="status">
                <Check className="size-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                Signature is valid — this token was signed with that secret and has not been altered.
              </p>
            ) : verification.status === "invalid" ? (
              <p className="flex items-center gap-2 text-sm text-destructive" role="status">
                <X className="size-4 shrink-0" strokeWidth={2.5} aria-hidden="true" />
                Signature does not match. Either the secret is wrong or the token was tampered with.
              </p>
            ) : verification.status === "unsupported" ? (
              <p className="flex items-start gap-2 text-sm text-muted-foreground" role="status">
                <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
                <span>
                  <code className="font-mono">{verification.algorithm}</code> is signed with a
                  private key, so a shared secret can&rsquo;t verify it. Only HS256, HS384 and
                  HS512 can be checked here.
                </span>
              </p>
            ) : (
              <FieldHint>
                Optional. Only HMAC tokens (HS256/384/512) can be verified with a secret.
              </FieldHint>
            )}
          </div>
        </>
      ) : null}

      <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
        <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
        <span>
          <strong className="text-foreground">A JWT is encoded, not encrypted.</strong> Anyone
          holding the token can read its payload — that is what this tool does, without any secret.
          Never put passwords or personal data in one. The signature proves the token
          hasn&rsquo;t been altered; it does not hide anything.
        </span>
      </p>
    </div>
  );
}
