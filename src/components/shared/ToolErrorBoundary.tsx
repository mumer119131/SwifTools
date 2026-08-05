"use client";

import * as React from "react";
import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

interface Props {
  toolName: string;
  children: React.ReactNode;
}

interface State {
  error: Error | null;
}

/**
 * Isolates a crash to the tool that caused it. A malformed PDF should not take
 * the header, footer and ⌘K palette down with it — the rest of the page keeps
 * working and the user gets a way back.
 */
export class ToolErrorBoundary extends React.Component<Props, State> {
  state: State = { error: null };

  static getDerivedStateFromError(error: Error): State {
    return { error };
  }

  componentDidCatch(error: Error) {
    // Surfaced in the browser console; no telemetry is collected.
    console.error("Tool crashed:", error);
  }

  private reset = () => this.setState({ error: null });

  render() {
    const { error } = this.state;
    if (!error) return this.props.children;

    return (
      <div
        role="alert"
        className="flex flex-col items-center gap-4 rounded-lg border border-[color-mix(in_oklab,var(--destructive)_30%,transparent)] bg-[color-mix(in_oklab,var(--destructive)_6%,transparent)] px-6 py-12 text-center"
      >
        <span className="grid size-11 place-items-center rounded-full bg-[color-mix(in_oklab,var(--destructive)_14%,transparent)]">
          <AlertTriangle className="size-5 text-destructive" strokeWidth={1.75} />
        </span>
        <div className="space-y-1">
          <p className="text-sm font-medium text-foreground">
            {this.props.toolName} hit an unexpected error
          </p>
          <p className="mx-auto max-w-md text-sm text-muted-foreground">
            {error.message || "Something went wrong while processing your file."} Try again with a
            different file, or reload the page.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={this.reset}>
          Try again
        </Button>
      </div>
    );
  }
}
