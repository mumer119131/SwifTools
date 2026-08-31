import { Prose } from "@/components/shared/Prose";

/**
 * Shared frame for the legal pages. The prose rules live in `Prose` so a page
 * that only shares this URL space does not inherit typography meant for
 * long-form text.
 */
export default function LegalLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
      <Prose>{children}</Prose>
    </div>
  );
}
