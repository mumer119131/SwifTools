import type { Metadata } from "next";
import Link from "next/link";

import { analyticsConfig } from "@/config/analytics";
import { absoluteUrl, siteConfig } from "@/config/site";
import { browsableTools, populatedCategories } from "@/config/tools";

export const metadata: Metadata = {
  title: "About",
  description: `Who makes ${siteConfig.name}, how the tools work, and why almost none of them upload your files.`,
  alternates: { canonical: absoluteUrl("/about") },
};

const clientSide = browsableTools.filter((tool) => tool.processing === "client").length;
const serverSide = browsableTools.length - clientSide;

export default function AboutPage() {
  return (
    <>
      <h1>About {siteConfig.name}</h1>
      <p>
        {siteConfig.name} is a collection of {browsableTools.length} free tools across{" "}
        {populatedCategories.length} categories — PDF and image work, text and code utilities,
        converters, calculators, and a good deal that is simply useful. There is no account, no
        upload queue and no paywall.
      </p>

      <h2>How it works</h2>
      <p>
        {clientSide} of the {browsableTools.length} tools run entirely inside your browser. Your
        file is read from disk by the page itself using the File API, processed on your own device
        with Canvas, WebAssembly or Web Workers, and written back out — it is never transmitted.
        That is not a policy we promise to keep; it is how the code is built, and you can watch the
        network tab to confirm it.
      </p>
      <p>
        {serverSide === 0
          ? "Nothing at all is processed on a server."
          : `The remaining ${serverSide} need something a browser cannot do alone — a currency rate, a video host's public thumbnail. Those pages say so plainly at the top, and the request carries what you typed and nothing about you.`}
      </p>

      <h2>Why it is free</h2>
      <p>
        Because it costs very little to run. The tools do their work on your machine rather than
        ours, so there are no processing servers to pay for — the site is static files and a handful
        of small endpoints. Advertising covers the hosting. There is no premium tier, no export
        limit and no watermark, and there is no plan to add any.
      </p>

      <h2>What we do not do</h2>
      <ul>
        <li>No accounts, so there is nothing to sign up for and no password to lose.</li>
        <li>
          {analyticsConfig.enabled
            ? "No session recording, no heatmaps, no profiling. We count page visits so we know which tools to maintain — see the privacy policy for exactly what that involves."
            : "No analytics, no tag managers, no session recording."}
        </li>
        <li>No storing of your files, your text or your results.</li>
        <li>
          No dark patterns — no fake progress bars, no &ldquo;processing&rdquo; delays designed to
          sell you a faster tier, no download that turns out to need an email address.
        </li>
      </ul>

      <h2>Accuracy</h2>
      <p>
        A calculator that returns the wrong number is worse than no calculator, because the output
        looks equally authoritative either way. The maths behind the tools is checked against known
        values in an automated test suite that runs on every change — unit conversions against their
        exact legal definitions, hash functions against published test vectors, the chemistry
        against IUPAC atomic weights, and the random generators against statistical tests for
        uniformity. Where a tool relies on an estimate or a rule of thumb, its page says so.
      </p>

      <h2>Who makes it</h2>
      <p>
        {siteConfig.name} is built and maintained by {siteConfig.author}. If something is broken,
        wrong, or missing, the <Link href="/contact">contact page</Link> is the fastest route — corrections
        to the calculations are especially welcome.
      </p>
    </>
  );
}
