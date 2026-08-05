import type { Metadata } from "next";

import { absoluteUrl, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Terms",
  description: `The terms covering your use of ${siteConfig.name}. Free to use, no account required, provided as-is.`,
  alternates: { canonical: absoluteUrl("/terms") },
};

export default function TermsPage() {
  return (
    <>
      <h1>Terms of use</h1>
      <p>
        By using {siteConfig.name} you agree to what follows. It is short, because the service is
        simple: free tools, no account, nothing stored.
      </p>

      <h2>Using the service</h2>
      <ul>
        <li>
          Every tool is free to use, for personal and commercial work alike. There are no usage
          caps and no watermarks on anything you produce.
        </li>
        <li>
          You keep all rights to the files you process and to the output. We claim nothing.
        </li>
        <li>
          Don&rsquo;t use the tools to process material you have no right to, or for anything
          unlawful.
        </li>
        <li>
          Don&rsquo;t attempt to disrupt the service for others — automated scraping at volume,
          or deliberately overloading the server-side endpoints.
        </li>
      </ul>

      <h2>No warranty</h2>
      <p>
        The tools are provided <strong>as-is</strong>, without warranty of any kind. They are
        tested, but file formats are messy and edge cases exist.{" "}
        <strong>Always keep your original files.</strong> We are not liable for lost data, corrupted
        output, or any loss arising from using the service.
      </p>

      <h2>Accuracy</h2>
      <p>
        Converters and calculators produce results to the best of their implementation, but they are
        not professional advice. Do not rely on a financial, tax or health calculator here for a
        decision that matters without checking it against a qualified source.
      </p>

      <h2>Availability</h2>
      <p>
        We aim to keep the site up but promise no particular uptime. Tools may be changed, replaced
        or removed at any time.
      </p>

      <h2>Changes to these terms</h2>
      <p>
        These terms may be updated. Continuing to use the site after a change means you accept the
        revised terms.
      </p>
      <p>
        {siteConfig.name} is operated by {siteConfig.author}.
      </p>
    </>
  );
}
