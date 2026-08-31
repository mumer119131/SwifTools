/**
 * Prose styling for long-form legal and policy pages.
 *
 * Extracted from the legal layout because that layout applied these rules to
 * every descendant, and the apps page — which lived in the same route group —
 * inherited them. Its cards each contain an h2, which quietly picked up a 3rem
 * top margin and dropped every app name below its own icon.
 *
 * Applying prose styling by wrapping the prose, rather than by owning a whole
 * route group, keeps it away from pages that merely happen to sit nearby.
 */
export function Prose({ children }: { children: React.ReactNode }) {
  return (
    <article
      className="
        [&_h1]:text-3xl [&_h1]:font-semibold [&_h1]:tracking-[-0.025em] [&_h1]:text-foreground sm:[&_h1]:text-4xl
        [&_h2]:mt-12 [&_h2]:text-xl [&_h2]:font-semibold [&_h2]:tracking-[-0.02em] [&_h2]:text-foreground
        [&_p]:mt-4 [&_p]:max-w-[68ch] [&_p]:leading-relaxed [&_p]:text-muted-foreground
        [&_ul]:mt-4 [&_ul]:max-w-[68ch] [&_ul]:list-disc [&_ul]:space-y-2 [&_ul]:pl-5
        [&_li]:leading-relaxed [&_li]:text-muted-foreground
        [&_strong]:font-medium [&_strong]:text-foreground
        [&_a]:text-foreground [&_a]:underline [&_a]:underline-offset-4
      "
    >
      {children}
    </article>
  );
}
