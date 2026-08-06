"use client";

import * as React from "react";
import { TriangleAlert } from "lucide-react";

import { DownloadButton } from "@/components/shared/DownloadButton";
import { Input } from "@/components/ui/input";
import { FieldHint, Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import {
  buildPayload,
  contrastRatio,
  errorLevels,
  renderToCanvas,
  renderToPngBlob,
  renderToSvg,
  type ContentKind,
  type ErrorLevel,
  type VcardFields,
  type WifiFields,
} from "./logic";

const kinds: { value: ContentKind; label: string }[] = [
  { value: "url", label: "Website URL" },
  { value: "text", label: "Plain text" },
  { value: "wifi", label: "Wi-Fi network" },
  { value: "vcard", label: "Contact card" },
  { value: "email", label: "Email address" },
  { value: "sms", label: "Phone number" },
];

export default function QrCodeGeneratorTool() {
  const [kind, setKind] = React.useState<ContentKind>("url");
  const [text, setText] = React.useState("https://example.com");
  const [wifi, setWifi] = React.useState<WifiFields>({
    ssid: "",
    password: "",
    encryption: "WPA",
    hidden: false,
  });
  const [vcard, setVcard] = React.useState<VcardFields>({
    firstName: "",
    lastName: "",
    organisation: "",
    title: "",
    phone: "",
    email: "",
    url: "",
  });

  const [size, setSize] = React.useState(320);
  const [margin, setMargin] = React.useState(2);
  const [darkColor, setDarkColor] = React.useState("#000000");
  const [lightColor, setLightColor] = React.useState("#ffffff");
  const [errorLevel, setErrorLevel] = React.useState<ErrorLevel>("M");
  const [error, setError] = React.useState<string | null>(null);

  const canvasRef = React.useRef<HTMLCanvasElement>(null);

  const payload = React.useMemo(
    () => buildPayload(kind, text, wifi, vcard),
    [kind, text, wifi, vcard],
  );

  const options = React.useMemo(
    () => ({ size, margin, darkColor, lightColor, errorLevel }),
    [size, margin, darkColor, lightColor, errorLevel],
  );

  React.useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas || !payload) return;

    let cancelled = false;
    renderToCanvas(canvas, payload, options)
      .then(() => {
        if (!cancelled) setError(null);
      })
      .catch(() => {
        if (!cancelled) {
          setError(
            "That content is too long to fit in a QR code. Shorten it, or lower the error-correction level.",
          );
        }
      });

    return () => {
      cancelled = true;
    };
  }, [payload, options]);

  const contrast = contrastRatio(darkColor, lightColor);
  const lowContrast = contrast < 4;

  return (
    <div className="space-y-5">
      <div className="grid gap-5 lg:grid-cols-[minmax(0,1fr)_22rem]">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="qr-kind">Content type</Label>
            <Select value={kind} onValueChange={(value) => setKind(value as ContentKind)}>
              <SelectTrigger id="qr-kind">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {kinds.map((entry) => (
                  <SelectItem key={entry.value} value={entry.value}>
                    {entry.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {kind === "wifi" ? (
            <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="wifi-ssid" required>
                  Network name (SSID)
                </Label>
                <Input
                  id="wifi-ssid"
                  value={wifi.ssid}
                  onChange={(event) => setWifi({ ...wifi, ssid: event.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wifi-password">Password</Label>
                <Input
                  id="wifi-password"
                  value={wifi.password}
                  onChange={(event) => setWifi({ ...wifi, password: event.target.value })}
                  disabled={wifi.encryption === "nopass"}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="wifi-encryption">Security</Label>
                <Select
                  value={wifi.encryption}
                  onValueChange={(value) =>
                    setWifi({ ...wifi, encryption: value as WifiFields["encryption"] })
                  }
                >
                  <SelectTrigger id="wifi-encryption">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="WPA">WPA / WPA2 / WPA3</SelectItem>
                    <SelectItem value="WEP">WEP (legacy)</SelectItem>
                    <SelectItem value="nopass">Open — no password</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-3 pt-7">
                <Switch
                  id="wifi-hidden"
                  checked={wifi.hidden}
                  onCheckedChange={(value) => setWifi({ ...wifi, hidden: value })}
                />
                <Label htmlFor="wifi-hidden">Hidden network</Label>
              </div>
              <FieldHint className="sm:col-span-2">
                Anyone who can photograph this code gets the password in plain text. Print it for
                guests, don&rsquo;t post it publicly.
              </FieldHint>
            </div>
          ) : kind === "vcard" ? (
            <div className="surface-card grid gap-4 p-5 sm:grid-cols-2">
              {(
                [
                  ["firstName", "First name", true],
                  ["lastName", "Last name", false],
                  ["organisation", "Organisation", false],
                  ["title", "Job title", false],
                  ["phone", "Phone", false],
                  ["email", "Email", false],
                  ["url", "Website", false],
                ] as [keyof VcardFields, string, boolean][]
              ).map(([field, label, required]) => (
                <div key={field} className="space-y-2">
                  <Label htmlFor={`vcard-${field}`} required={required}>
                    {label}
                  </Label>
                  <Input
                    id={`vcard-${field}`}
                    value={vcard[field]}
                    onChange={(event) => setVcard({ ...vcard, [field]: event.target.value })}
                    type={field === "email" ? "email" : field === "phone" ? "tel" : "text"}
                  />
                </div>
              ))}
            </div>
          ) : (
            <div className="space-y-2">
              <Label htmlFor="qr-text">
                {kind === "url"
                  ? "URL"
                  : kind === "email"
                    ? "Email address"
                    : kind === "sms"
                      ? "Phone number"
                      : "Text"}
              </Label>
              {kind === "text" ? (
                <Textarea
                  id="qr-text"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  className="min-h-32"
                />
              ) : (
                <Input
                  id="qr-text"
                  value={text}
                  onChange={(event) => setText(event.target.value)}
                  type={kind === "email" ? "email" : kind === "sms" ? "tel" : "url"}
                  inputMode={kind === "sms" ? "tel" : "text"}
                />
              )}
            </div>
          )}

          <div className="surface-card grid gap-5 p-5 sm:grid-cols-2">
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="qr-size">Size</Label>
                <span className="font-mono text-sm text-muted-foreground" data-numeric>
                  {size} px
                </span>
              </div>
              <Slider
                id="qr-size"
                min={128}
                max={1024}
                step={32}
                value={[size]}
                onValueChange={([value]) => setSize(value)}
                aria-label="QR code size"
              />
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <Label htmlFor="qr-margin">Quiet zone</Label>
                <span className="font-mono text-sm text-muted-foreground" data-numeric>
                  {margin}
                </span>
              </div>
              <Slider
                id="qr-margin"
                min={0}
                max={8}
                step={1}
                value={[margin]}
                onValueChange={([value]) => setMargin(value)}
                aria-label="Quiet zone width"
              />
              <FieldHint>Scanners need blank space around the code. Below 2 gets unreliable.</FieldHint>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qr-dark">Foreground</Label>
              <div className="flex items-center gap-2">
                <input
                  id="qr-dark"
                  type="color"
                  value={darkColor}
                  onChange={(event) => setDarkColor(event.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-md border border-border bg-surface p-1"
                />
                <Input
                  value={darkColor}
                  onChange={(event) => setDarkColor(event.target.value)}
                  className="font-mono"
                  aria-label="Foreground colour hex"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="qr-light">Background</Label>
              <div className="flex items-center gap-2">
                <input
                  id="qr-light"
                  type="color"
                  value={lightColor}
                  onChange={(event) => setLightColor(event.target.value)}
                  className="h-10 w-14 cursor-pointer rounded-md border border-border bg-surface p-1"
                />
                <Input
                  value={lightColor}
                  onChange={(event) => setLightColor(event.target.value)}
                  className="font-mono"
                  aria-label="Background colour hex"
                />
              </div>
            </div>

            <div className="space-y-2 sm:col-span-2">
              <Label htmlFor="qr-error">Error correction</Label>
              <Select
                value={errorLevel}
                onValueChange={(value) => setErrorLevel(value as ErrorLevel)}
              >
                <SelectTrigger id="qr-error">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {errorLevels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FieldHint>
                Higher levels survive scuffs, printing defects and a logo placed over the centre —
                at the cost of a denser code.
              </FieldHint>
            </div>
          </div>
        </div>

        <div className="space-y-4">
          <div className="surface-card grid place-items-center p-6">
            <canvas
              ref={canvasRef}
              role="img"
              aria-label={payload ? "Generated QR code" : "No content yet"}
              className={cn("h-auto w-full max-w-72 rounded", !payload && "hidden")}
            />
            {!payload ? (
              <p className="py-16 text-center text-sm text-muted-foreground">
                Fill in the fields to generate a code.
              </p>
            ) : null}
          </div>

          {error ? (
            <p role="alert" className="text-sm text-destructive">
              {error}
            </p>
          ) : null}

          {lowContrast ? (
            <p className="flex items-start gap-2 rounded-md border border-border bg-surface px-4 py-3 text-sm text-muted-foreground">
              <TriangleAlert className="mt-0.5 size-4 shrink-0 text-destructive" strokeWidth={1.75} />
              <span>
                Contrast between those colours is{" "}
                <span className="font-mono" data-numeric>
                  {contrast.toFixed(1)}:1
                </span>
                . Many scanners fail below about 4:1 — and inverted codes (light on dark) are
                rejected outright by some readers.
              </span>
            </p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <DownloadButton
              blob={() => renderToPngBlob(payload, options)}
              fileName="qr-code.png"
              label="PNG"
              disabled={!payload}
              size="default"
            />
            <DownloadButton
              blob={async () =>
                new Blob([await renderToSvg(payload, options)], { type: "image/svg+xml" })
              }
              fileName="qr-code.svg"
              label="SVG"
              variant="outline"
              disabled={!payload}
              size="default"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
