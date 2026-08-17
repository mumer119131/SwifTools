import type { Metadata } from "next";
import Link from "next/link";

import { absoluteUrl, siteConfig } from "@/config/site";

export const metadata: Metadata = {
  title: "Contact",
  description: `How to reach ${siteConfig.name} — report a bug, correct a calculation, or ask about advertising.`,
  alternates: { canonical: absoluteUrl("/contact") },
};

/**
 * The address is assembled from parts rather than written as one literal.
 *
 * It is a token gesture against scrapers rather than real protection, but it
 * costs nothing and filters the least sophisticated ones. Anyone reading the
 * page sees an ordinary address.
 */
const CONTACT = ["hello", "pockettoolz.com"].join("@");

export default function ContactPage() {
  return (
    <>
      <h1>Contact</h1>
      <p>
        {siteConfig.name} has no support desk and no ticket system — it is a small operation. Email
        reaches a person, and it is the only channel.
      </p>

      <h2>Email</h2>
      <p>
        <a href={`mailto:${CONTACT}`}>{CONTACT}</a>
      </p>

      <h2>What is worth writing about</h2>
      <ul>
        <li>
          <strong>A wrong answer.</strong> The most valuable message you can send. If a calculator
          disagrees with a figure you trust, tell us which tool, what you entered and what you
          expected — those get fixed first, and the fix comes with a test so it cannot come back.
        </li>
        <li>
          <strong>A bug.</strong> Which tool, which browser, and what happened. A file that breaks a
          tool is useful, but please do not send anything confidential — a description of its shape
          is usually enough.
        </li>
        <li>
          <strong>A missing tool.</strong> Suggestions are read. The ones that get built are usually
          those where the existing tools nearly do the job but not quite.
        </li>
        <li>
          <strong>Advertising and partnerships.</strong> Same address.
        </li>
        <li>
          <strong>Privacy questions.</strong> Anything the{" "}
          <Link href="/privacy">privacy policy</Link> does not answer clearly enough.
        </li>
      </ul>

      <h2>Response time</h2>
      <p>
        Usually within a few days. A report of a wrong calculation will be looked at sooner, because
        it means someone may be relying on a number that is not right.
      </p>

      <h2>What we cannot help with</h2>
      <p>
        We cannot recover anything you processed. Nothing is uploaded and nothing is stored, so
        there is no copy of your file on any server of ours to retrieve — if you closed the tab
        before downloading the result, it is genuinely gone. The same applies to anything a tool
        saved in your browser: clearing site data deletes it, and we never had a copy.
      </p>
    </>
  );
}
