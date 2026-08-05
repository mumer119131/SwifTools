/**
 * Shared frame for the legal pages. Prose styling lives here rather than being
 * repeated per page, and the measure is capped at a readable line length.
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
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
    </div>
  );
}
