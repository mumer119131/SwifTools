"use client";

import * as React from "react";
import { Check, Copy } from "lucide-react";

import { Button, type ButtonProps } from "@/components/ui/button";
import { cn } from "@/lib/utils";

// `value` is redefined here: the native button attribute of that name is
// irrelevant, and this one may be a lazy producer for expensive strings.
interface CopyButtonProps extends Omit<ButtonProps, "onClick" | "children" | "value"> {
  value: string | (() => string);
  label?: string;
  /** Hide the text label and render an icon-only button. */
  iconOnly?: boolean;
}

/**
 * Copies to the clipboard and confirms inline for 2s. The confirmation is
 * announced politely rather than fired as a toast — it belongs next to the
 * thing that was copied.
 */
export function CopyButton({
  value,
  label = "Copy",
  iconOnly = false,
  variant = "outline",
  size = iconOnly ? "icon" : "sm",
  className,
  ...props
}: CopyButtonProps) {
  const [copied, setCopied] = React.useState(false);
  const timeout = React.useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  React.useEffect(() => () => clearTimeout(timeout.current), []);

  async function handleCopy() {
    const text = typeof value === "function" ? value() : value;
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      // Clipboard API is unavailable over http:// and in some embedded views.
      const area = document.createElement("textarea");
      area.value = text;
      area.setAttribute("readonly", "");
      area.style.position = "fixed";
      area.style.opacity = "0";
      document.body.appendChild(area);
      area.select();
      document.execCommand("copy");
      area.remove();
    }
    setCopied(true);
    clearTimeout(timeout.current);
    timeout.current = setTimeout(() => setCopied(false), 2000);
  }

  return (
    <Button
      type="button"
      variant={variant}
      size={size}
      onClick={handleCopy}
      aria-label={iconOnly ? (copied ? "Copied" : label) : undefined}
      className={cn(className)}
      {...props}
    >
      {copied ? (
        <Check className="text-success" strokeWidth={2} />
      ) : (
        <Copy strokeWidth={1.75} />
      )}
      {!iconOnly ? <span>{copied ? "Copied" : label}</span> : null}
      <span aria-live="polite" className="sr-only">
        {copied ? "Copied to clipboard" : ""}
      </span>
    </Button>
  );
}
