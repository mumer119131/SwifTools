import type { MDXComponents } from "mdx/types";
import Link from "next/link";

/**
 * Global MDX components. Required by `@next/mdx` in the App Router — it will
 * not build without this file existing at the root of `src`.
 *
 * Typography is applied by the shell that renders a post rather than here, so
 * these overrides only cover the things markdown cannot express on its own.
 *
 * Note the signature: as of Next 16 `useMDXComponents` takes no arguments.
 * Earlier versions received the inherited components and were expected to
 * spread them.
 */
const components: MDXComponents = {
  // Internal links go through next/link so navigation stays client-side;
  // external ones keep the plain anchor and gain the usual rel attributes.
  a: ({ href, children, ...props }) => {
    const target = String(href ?? "");
    if (target.startsWith("/")) {
      return (
        <Link href={target} {...props}>
          {children}
        </Link>
      );
    }
    return (
      <a href={target} target="_blank" rel="noreferrer noopener" {...props}>
        {children}
      </a>
    );
  },
  // Wide tables must scroll inside their own box rather than the page.
  table: (props) => (
    <div className="mt-6 overflow-x-auto">
      <table className="w-full min-w-[32rem] border-collapse text-sm" {...props} />
    </div>
  ),
  th: (props) => (
    <th className="border-b border-border py-2.5 pr-4 text-left font-medium text-foreground" {...props} />
  ),
  td: (props) => (
    <td className="border-b border-border py-2.5 pr-4 align-top text-muted-foreground" {...props} />
  ),
};

export function useMDXComponents(): MDXComponents {
  return components;
}
