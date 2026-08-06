"use client";

import * as React from "react";
import { Plus, X } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useClientValue } from "@/lib/use-client-value";
import { currencies } from "@/tools/loan-calculator/logic";
import {
  blankItem,
  buildInvoicePdf,
  calculateTotals,
  formatMoney,
  type Invoice,
  type LineItem,
} from "./logic";

function todayInput(offsetDays = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + offsetDays);
  const pad = (value: number) => String(value).padStart(2, "0");
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
}

/** Issue and due dates, read on the client so SSR output stays deterministic. */
const readDates = () => ({ issueDate: todayInput(), dueDate: todayInput(30) });
const SERVER_DATES = { issueDate: "", dueDate: "" };

export default function InvoiceGeneratorTool() {
  const dates = useClientValue(readDates, SERVER_DATES);
  const [draft, setDraft] = React.useState<Omit<Invoice, "issueDate" | "dueDate"> & {
    issueDate: string | null;
    dueDate: string | null;
  }>(() => ({
    number: "0001",
    issueDate: null,
    dueDate: null,
    currency: "USD",
    fromName: "",
    fromDetails: "",
    toName: "",
    toDetails: "",
    items: [blankItem()],
    taxPercent: 0,
    discountPercent: 0,
    notes: "",
  }));

  // Today's dates fill in until the user picks their own.
  const invoice: Invoice = {
    ...draft,
    issueDate: draft.issueDate ?? dates.issueDate,
    dueDate: draft.dueDate ?? dates.dueDate,
  };

  const totals = calculateTotals(invoice);

  const update = <K extends keyof Invoice>(key: K, value: Invoice[K]) =>
    setDraft((current) => ({ ...current, [key]: value }));

  const updateItem = (id: string, patch: Partial<LineItem>) =>
    setDraft((current) => ({
      ...current,
      items: current.items.map((item) => (item.id === id ? { ...item, ...patch } : item)),
    }));

  const money = (value: number) => formatMoney(value, invoice.currency);
  const canExport = invoice.fromName.trim() !== "" && invoice.toName.trim() !== "" && totals.total > 0;

  return (
    <div className="space-y-5">
      <section className="surface-card grid gap-4 p-5 sm:grid-cols-2 lg:grid-cols-4">
        <div className="space-y-2">
          <Label htmlFor="inv-number">Invoice number</Label>
          <Input
            id="inv-number"
            value={invoice.number}
            onChange={(event) => update("number", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inv-issue">Issue date</Label>
          <Input
            id="inv-issue"
            type="date"
            value={invoice.issueDate}
            onChange={(event) => update("issueDate", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inv-due">Due date</Label>
          <Input
            id="inv-due"
            type="date"
            value={invoice.dueDate}
            onChange={(event) => update("dueDate", event.target.value)}
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="inv-currency">Currency</Label>
          <Select value={invoice.currency} onValueChange={(value) => update("currency", value)}>
            <SelectTrigger id="inv-currency">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map((code) => (
                <SelectItem key={code} value={code}>
                  {code}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        <section className="surface-card space-y-4 p-5">
          <h2 className="text-sm font-medium text-foreground">From</h2>
          <div className="space-y-2">
            <Label htmlFor="inv-from-name" required>
              Your name or business
            </Label>
            <Input
              id="inv-from-name"
              value={invoice.fromName}
              onChange={(event) => update("fromName", event.target.value)}
              placeholder="Acme Studio"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv-from-details">Address and contact</Label>
            <Textarea
              id="inv-from-details"
              value={invoice.fromDetails}
              onChange={(event) => update("fromDetails", event.target.value)}
              placeholder={"12 Example Street\nLondon, EC1A 1BB\nhello@example.com\nVAT: GB123456789"}
              className="min-h-28 text-sm"
            />
          </div>
        </section>

        <section className="surface-card space-y-4 p-5">
          <h2 className="text-sm font-medium text-foreground">Bill to</h2>
          <div className="space-y-2">
            <Label htmlFor="inv-to-name" required>
              Client name
            </Label>
            <Input
              id="inv-to-name"
              value={invoice.toName}
              onChange={(event) => update("toName", event.target.value)}
              placeholder="Client Ltd"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv-to-details">Address and contact</Label>
            <Textarea
              id="inv-to-details"
              value={invoice.toDetails}
              onChange={(event) => update("toDetails", event.target.value)}
              placeholder={"5 Client Road\nManchester, M1 2AB\naccounts@client.com"}
              className="min-h-28 text-sm"
            />
          </div>
        </section>
      </div>

      <section className="surface-card overflow-hidden">
        <h2 className="border-b border-border px-5 py-3.5 text-sm font-medium text-foreground">
          Line items
        </h2>

        <ul className="divide-y divide-border">
          {invoice.items.map((item, index) => (
            <li key={item.id} className="grid gap-3 p-5 sm:grid-cols-[minmax(0,1fr)_6rem_8rem_auto]">
              <div className="space-y-1">
                <Label
                  htmlFor={`item-desc-${item.id}`}
                  className="text-xs font-normal text-muted-foreground"
                >
                  Description
                </Label>
                <Input
                  id={`item-desc-${item.id}`}
                  value={item.description}
                  onChange={(event) => updateItem(item.id, { description: event.target.value })}
                  placeholder="Design work — homepage"
                />
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor={`item-qty-${item.id}`}
                  className="text-xs font-normal text-muted-foreground"
                >
                  Qty
                </Label>
                <Input
                  id={`item-qty-${item.id}`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  value={item.quantity}
                  onChange={(event) =>
                    updateItem(item.id, { quantity: Number(event.target.value) || 0 })
                  }
                />
              </div>

              <div className="space-y-1">
                <Label
                  htmlFor={`item-price-${item.id}`}
                  className="text-xs font-normal text-muted-foreground"
                >
                  Unit price
                </Label>
                <Input
                  id={`item-price-${item.id}`}
                  type="number"
                  inputMode="decimal"
                  min={0}
                  step="0.01"
                  value={item.unitPrice}
                  onChange={(event) =>
                    updateItem(item.id, { unitPrice: Number(event.target.value) || 0 })
                  }
                />
              </div>

              <div className="flex items-end justify-between gap-2 sm:justify-end">
                <span className="font-mono text-sm text-foreground sm:mb-2.5" data-numeric>
                  {money(item.quantity * item.unitPrice)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="size-10 shrink-0"
                  onClick={() =>
                    setDraft((current) => ({
                      ...current,
                      items: current.items.filter((entry) => entry.id !== item.id),
                    }))
                  }
                  disabled={invoice.items.length <= 1}
                  aria-label={`Remove line item ${index + 1}`}
                >
                  <X strokeWidth={1.75} />
                </Button>
              </div>
            </li>
          ))}
        </ul>

        <div className="border-t border-border p-5">
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              setDraft((current) => ({ ...current, items: [...current.items, blankItem()] }))
            }
          >
            <Plus strokeWidth={1.75} />
            Add line
          </Button>
        </div>
      </section>

      <div className="grid gap-5 sm:grid-cols-2">
        <section className="surface-card space-y-4 p-5">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="inv-discount">Discount (%)</Label>
              <Input
                id="inv-discount"
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                value={invoice.discountPercent}
                onChange={(event) =>
                  update("discountPercent", Number(event.target.value) || 0)
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="inv-tax">Tax (%)</Label>
              <Input
                id="inv-tax"
                type="number"
                inputMode="decimal"
                min={0}
                max={100}
                value={invoice.taxPercent}
                onChange={(event) => update("taxPercent", Number(event.target.value) || 0)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="inv-notes">Notes</Label>
            <Textarea
              id="inv-notes"
              value={invoice.notes}
              onChange={(event) => update("notes", event.target.value)}
              placeholder="Payment within 30 days. Bank details: …"
              className="min-h-24 text-sm"
            />
          </div>
        </section>

        <section className="surface-card p-5">
          <h2 className="text-sm font-medium text-foreground">Totals</h2>
          <dl className="mt-4 space-y-2.5 text-sm">
            <div className="flex justify-between">
              <dt className="text-muted-foreground">Subtotal</dt>
              <dd className="font-mono text-foreground" data-numeric>
                {money(totals.subtotal)}
              </dd>
            </div>
            {invoice.discountPercent > 0 ? (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Discount ({invoice.discountPercent}%)</dt>
                <dd className="font-mono text-foreground" data-numeric>
                  −{money(totals.discount)}
                </dd>
              </div>
            ) : null}
            {invoice.taxPercent > 0 ? (
              <div className="flex justify-between">
                <dt className="text-muted-foreground">Tax ({invoice.taxPercent}%)</dt>
                <dd className="font-mono text-foreground" data-numeric>
                  {money(totals.tax)}
                </dd>
              </div>
            ) : null}
            <div className="flex justify-between border-t border-border pt-2.5">
              <dt className="font-medium text-foreground">Total due</dt>
              <dd className="font-mono text-lg text-foreground" data-numeric>
                {money(totals.total)}
              </dd>
            </div>
          </dl>

          <div className="mt-5">
            <DownloadButton
              blob={() => buildInvoicePdf(invoice)}
              fileName={`invoice-${invoice.number || "draft"}.pdf`}
              label="Download PDF"
              disabled={!canExport}
              className="w-full"
            />
            {!canExport ? (
              <p className="mt-2 text-xs text-muted-foreground">
                Add your name, the client&rsquo;s name and at least one priced line item.
              </p>
            ) : null}
          </div>
        </section>
      </div>

      <p className="text-sm text-muted-foreground">
        Tax is applied after the discount, which is the standard order — charging tax on an amount
        nobody pays would overstate the bill. Nothing you type is uploaded; the PDF is typeset in
        your browser.
      </p>
    </div>
  );
}
