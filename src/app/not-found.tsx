import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { categories } from "@/config/categories";
import { Button } from "@/components/ui/button";

export default function NotFound() {
  return (
    <div className="relative">
      <div className="ambient-wash" aria-hidden="true" />
      <div className="relative mx-auto flex max-w-2xl flex-col items-center px-5 py-24 text-center sm:px-6 lg:py-32">
        <p className="font-mono text-sm text-subtle-foreground" data-numeric>
          404
        </p>
        <h1 className="mt-4 text-3xl font-semibold tracking-[-0.03em] text-foreground sm:text-4xl">
          That page doesn&rsquo;t exist
        </h1>
        <p className="mt-4 text-muted-foreground">
          The tool you were looking for may have moved, or the address may have a typo. Press{" "}
          <kbd className="inline-flex h-5 items-center rounded border border-border bg-surface px-1.5 font-mono text-[0.6875rem] text-muted-foreground">
            ⌘K
          </kbd>{" "}
          to search everything, or start from a category.
        </p>

        <Button asChild size="lg" className="mt-8">
          <Link href="/">
            <ArrowLeft strokeWidth={1.75} />
            Back to all tools
          </Link>
        </Button>

        <nav aria-label="Categories" className="mt-10 flex flex-wrap justify-center gap-2">
          {categories.map((category) => (
            <Link
              key={category.slug}
              href={`/${category.slug}`}
              className="inline-flex h-9 items-center rounded-full border border-border bg-surface px-3.5 text-sm text-muted-foreground transition-colors duration-[180ms] hover:border-border-strong hover:text-foreground"
            >
              {category.label}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  );
}
