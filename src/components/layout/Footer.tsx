import Link from "next/link";
import { categories } from "@/config/categories";
import { siteConfig } from "@/config/site";
import { browsableTools, toolHref } from "@/config/tools";
import { Logo } from "@/components/layout/Logo";
import { GitHubIcon, XIcon } from "@/components/layout/BrandIcons";

const legalLinks = [
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export function Footer() {
  return (
    <footer className="mt-24 border-t border-border">
      <div className="mx-auto max-w-6xl px-5 py-14 sm:px-6 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,18rem)_1fr]">
          <div className="space-y-4">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {siteConfig.description}
            </p>
            {siteConfig.links.twitter || siteConfig.links.github ? (
              <div className="flex items-center gap-2">
                {siteConfig.links.twitter ? (
                  <a
                    href={siteConfig.links.twitter}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${siteConfig.name} on X`}
                    className="grid size-9 place-items-center rounded-md text-muted-foreground transition-colors duration-[120ms] hover:bg-surface-hover hover:text-foreground"
                  >
                    <XIcon className="size-4" />
                  </a>
                ) : null}
                {siteConfig.links.github ? (
                  <a
                    href={siteConfig.links.github}
                    target="_blank"
                    rel="noreferrer noopener"
                    aria-label={`${siteConfig.name} on GitHub`}
                    className="grid size-9 place-items-center rounded-md text-muted-foreground transition-colors duration-[120ms] hover:bg-surface-hover hover:text-foreground"
                  >
                    <GitHubIcon className="size-4" />
                  </a>
                ) : null}
              </div>
            ) : null}
          </div>

          {/* Every browsable tool is linked here — cheap, permanent crawl paths.
              Search-only pages reach the crawler through the sitemap and their
              own parent converter instead of bloating this list. */}
          <nav aria-label="All tools" className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {categories.map((category) => {
              const categoryTools = browsableTools.filter((tool) => tool.category === category.slug);
              return (
                <div key={category.slug} className="space-y-3">
                  <h2 className="text-xs font-medium tracking-[0.02em] text-foreground">
                    <Link
                      href={`/${category.slug}`}
                      className="rounded-sm transition-opacity duration-[120ms] hover:opacity-70"
                    >
                      {category.label}
                    </Link>
                  </h2>
                  <ul className="space-y-2">
                    {categoryTools.map((tool) => (
                      <li key={tool.slug}>
                        <Link
                          href={toolHref(tool)}
                          className="rounded-sm text-[0.8125rem] leading-relaxed text-muted-foreground transition-colors duration-[120ms] hover:text-foreground"
                        >
                          {tool.name}
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </nav>
        </div>

        <div className="mt-12 flex flex-col-reverse items-start justify-between gap-4 border-t border-border pt-6 sm:flex-row sm:items-center">
          <p className="text-xs text-subtle-foreground">
            © {new Date().getFullYear()} {siteConfig.name}. Built by {siteConfig.author}.
          </p>
          <ul className="flex items-center gap-5">
            {legalLinks.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  className="rounded-sm text-xs text-muted-foreground transition-colors duration-[120ms] hover:text-foreground"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </footer>
  );
}
