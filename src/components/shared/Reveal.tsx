"use client";

import * as React from "react";

import { cn } from "@/lib/utils";

interface RevealProps {
  children: React.ReactNode;
  /** Milliseconds of stagger. The design system caps a group at six items. */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li" | "article";
}

/**
 * Fades and lifts its children in as they enter the viewport.
 *
 * Content is visible by default and only hidden once JavaScript has confirmed
 * it is below the fold. That ordering matters: starting hidden in CSS would
 * leave the page blank for anyone with JS disabled or still loading, and would
 * flash on anything already on screen. Nothing here can prevent content from
 * being read — the worst case is that it simply appears without animating.
 *
 * Transform and opacity only, so it never triggers layout. Under
 * `prefers-reduced-motion` the global rule in globals.css collapses the
 * transition to 0.01ms, which leaves the element visible without movement.
 */
export function Reveal({ children, delay = 0, className, as = "div" }: RevealProps) {
  const ref = React.useRef<HTMLElement>(null);
  const Tag = as;

  React.useEffect(() => {
    const element = ref.current;
    if (!element) return;

    // No observer, no animation — the content is already visible, which is the
    // correct fallback rather than something to work around.
    if (typeof IntersectionObserver === "undefined") return;

    const rect = element.getBoundingClientRect();
    const alreadyVisible = rect.top < window.innerHeight;

    // Anything on screen at mount stays as it is. Hiding it now only to fade
    // it back in is a flash, not an animation.
    if (alreadyVisible) return;

    element.dataset.reveal = "pending";

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry.isIntersecting) return;
        entry.target.setAttribute("data-reveal", "shown");
        observer.disconnect();
      },
      // A small negative bottom margin means the reveal fires just after the
      // element enters, rather than while it is still clipped by the edge.
      { rootMargin: "0px 0px -8% 0px", threshold: 0.05 },
    );

    observer.observe(element);
    return () => observer.disconnect();
  }, []);

  return (
    <Tag
      ref={ref as React.Ref<never>}
      className={cn("reveal-target", className)}
      style={delay ? ({ "--reveal-delay": `${delay}ms` } as React.CSSProperties) : undefined}
    >
      {children}
    </Tag>
  );
}
