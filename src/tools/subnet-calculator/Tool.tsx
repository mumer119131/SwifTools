"use client";

import * as React from "react";
import { Info, Lock } from "lucide-react";

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
import { calculate, divide, divisionCount } from "./logic";

const EXAMPLES = ["192.168.1.130/26", "10.0.0.0/8", "172.16.5.1/20", "203.0.113.7/31"];

export default function SubnetCalculatorTool() {
  const [input, setInput] = React.useState("192.168.1.130/26");
  const [splitTo, setSplitTo] = React.useState<string>("");

  const subnet = React.useMemo(() => calculate(input), [input]);

  const splitOptions = React.useMemo(() => {
    if (!subnet) return [];
    const out: number[] = [];
    for (let prefix = subnet.prefix + 1; prefix <= 32; prefix += 1) out.push(prefix);
    return out;
  }, [subnet]);

  const parts = React.useMemo(
    () => (splitTo ? divide(input, Number(splitTo)) : []),
    [input, splitTo],
  );
  const totalParts = splitTo ? divisionCount(input, Number(splitTo)) : 0;

  const rows = subnet
    ? [
        ["Network address", subnet.network],
        ["Broadcast address", subnet.broadcast],
        ["Netmask", subnet.netmask],
        ["Wildcard mask", subnet.wildcard],
        ["First usable host", subnet.firstHost ?? "—"],
        ["Last usable host", subnet.lastHost ?? "—"],
        ["Total addresses", subnet.totalAddresses.toLocaleString()],
        ["Usable hosts", subnet.usableHosts.toLocaleString()],
      ]
    : [];

  return (
    <div className="space-y-5">
      <div className="space-y-1.5">
        <Label htmlFor="cidr">Address and prefix</Label>
        <Input
          id="cidr"
          value={input}
          onChange={(event) => {
            setInput(event.target.value);
            setSplitTo("");
          }}
          placeholder="10.0.0.1/24"
          spellCheck={false}
          className="font-mono"
          aria-invalid={input.trim() !== "" && !subnet}
        />
        <div className="flex flex-wrap items-center gap-2 pt-1">
          {EXAMPLES.map((example) => (
            <button
              key={example}
              type="button"
              onClick={() => {
                setInput(example);
                setSplitTo("");
              }}
              className="rounded-full border border-border px-3 py-1 font-mono text-xs text-muted-foreground transition-colors hover:border-border-strong hover:text-foreground"
            >
              {example}
            </button>
          ))}
        </div>
      </div>

      {input.trim() !== "" && !subnet ? (
        <p className="rounded-md border border-destructive bg-[color-mix(in_oklab,var(--destructive)_8%,transparent)] px-4 py-3 text-sm text-foreground">
          That is not a valid address. Try <code className="font-mono">10.0.0.1/24</code> or{" "}
          <code className="font-mono">10.0.0.1 255.255.255.0</code>. Leading zeros are rejected —
          some resolvers read <code className="font-mono">010</code> as octal, so the address would
          be ambiguous.
        </p>
      ) : null}

      {subnet ? (
        <>
          <div className="flex flex-wrap items-center gap-3">
            <span className="rounded-md border border-border bg-surface px-3 py-1.5 font-mono text-sm text-foreground">
              {subnet.network}/{subnet.prefix}
            </span>
            {subnet.isPrivate ? (
              <span className="inline-flex items-center gap-1.5 rounded-md border border-border bg-surface px-3 py-1.5 text-xs text-muted-foreground">
                <Lock className="size-3.5" strokeWidth={1.75} />
                Private range
              </span>
            ) : null}
            <CopyButton value={`${subnet.network}/${subnet.prefix}`} label="Copy CIDR" />
          </div>

          {subnet.note ? (
            <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
              <Info className="mt-0.5 size-4 shrink-0" strokeWidth={1.75} />
              {subnet.note}
            </p>
          ) : null}

          <dl className="surface-card divide-y divide-border overflow-hidden">
            {rows.map(([label, value]) => (
              <div key={label} className="flex items-center gap-4 px-5 py-2.5 text-sm">
                <dt className="w-44 shrink-0 text-muted-foreground">{label}</dt>
                <dd className="min-w-0 flex-1 font-mono text-foreground" data-numeric>
                  {value}
                </dd>
                <CopyButton value={value} iconOnly />
              </div>
            ))}
          </dl>

          {splitOptions.length > 0 ? (
            <div className="space-y-3">
              <div className="flex flex-wrap items-end gap-3">
                <div className="space-y-1.5">
                  <Label htmlFor="split">Divide into smaller subnets</Label>
                  <Select value={splitTo} onValueChange={setSplitTo}>
                    <SelectTrigger id="split" className="w-56">
                      <SelectValue placeholder="Choose a prefix" />
                    </SelectTrigger>
                    <SelectContent>
                      {splitOptions.map((prefix) => (
                        <SelectItem key={prefix} value={String(prefix)}>
                          /{prefix} — {(2 ** (prefix - subnet.prefix)).toLocaleString()} subnets
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {parts.length > 0 ? (
                <div className="surface-card overflow-hidden">
                  <div className="flex items-center justify-between gap-3 border-b border-border px-5 py-2.5 text-sm">
                    <span className="text-muted-foreground">
                      {totalParts > parts.length
                        ? `First ${parts.length} of ${totalParts.toLocaleString()} subnets`
                        : `${parts.length} subnets`}
                    </span>
                    <CopyButton
                      value={parts.map((part) => `${part.network}/${part.prefix}`).join("\n")}
                      label="Copy list"
                    />
                  </div>
                  <div className="max-h-80 overflow-auto">
                    <table className="w-full text-sm">
                      <thead className="sticky top-0 bg-surface text-left text-xs text-muted-foreground">
                        <tr>
                          <th className="px-5 py-2 font-medium">Subnet</th>
                          <th className="px-5 py-2 font-medium">Host range</th>
                          <th className="px-5 py-2 text-right font-medium">Hosts</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-border">
                        {parts.map((part) => (
                          <tr key={part.network}>
                            <td className="px-5 py-2 font-mono text-foreground">
                              {part.network}/{part.prefix}
                            </td>
                            <td className="px-5 py-2 font-mono text-muted-foreground">
                              {part.firstHost} – {part.lastHost}
                            </td>
                            <td className="px-5 py-2 text-right text-muted-foreground" data-numeric>
                              {part.usableHosts.toLocaleString()}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              ) : null}
            </div>
          ) : null}
        </>
      ) : null}
    </div>
  );
}
