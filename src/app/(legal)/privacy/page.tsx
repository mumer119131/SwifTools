import type { Metadata } from "next";

import { absoluteUrl, siteConfig } from "@/config/site";
import { publishedTools } from "@/config/tools";

export const metadata: Metadata = {
  title: "Privacy",
  description: `How ${siteConfig.name} handles your files and data. Most tools run entirely in your browser and upload nothing.`,
  alternates: { canonical: absoluteUrl("/privacy") },
};

export default function PrivacyPage() {
  const clientSideCount = publishedTools.filter((tool) => tool.processing === "client").length;

  return (
    <>
      <h1>Privacy</h1>
      <p>
        The short version: <strong>{clientSideCount} of our {publishedTools.length} live tools
        never send your file anywhere.</strong> They read it with your browser&rsquo;s own File API,
        process it on your device, and hand the result back. Closing the tab erases everything.
      </p>

      <h2>Your files</h2>
      <p>
        Tools marked <strong>&ldquo;Runs in your browser&rdquo;</strong> do all their work locally.
        Your file is never uploaded, never stored, and never seen by us. You can confirm this
        yourself: open your browser&rsquo;s network inspector and watch — nothing leaves.
      </p>
      <p>
        A small number of tools genuinely need a server, and each one says so on its own page. Those
        endpoints are stateless: the file is processed in memory and streamed straight back. Nothing
        is written to disk and nothing is retained once the response is sent.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <strong>No accounts.</strong> There is no sign-up, so there is no name, email or password
          to store.
        </li>
        <li>
          <strong>No file contents.</strong> Neither the files you process nor the text you paste is
          logged.
        </li>
        <li>
          <strong>No tracking cookies.</strong> Your theme preference is kept in your
          browser&rsquo;s local storage and never sent to us.
        </li>
      </ul>

      <h2>Advertising</h2>
      <p>
        {siteConfig.name} does not currently show ads and runs no advertising scripts. If that
        changes, this page will be updated before any ad code ships, and the provider and its data
        practices will be named here.
      </p>

      <h2>Third parties</h2>
      <p>
        The site is served as static files. It loads no analytics, no tag managers, no external
        fonts and no third-party scripts. Your browser talks to our origin and nothing else.
      </p>

      <h2>Changes</h2>
      <p>
        Material changes to this policy will be reflected here. Because there are no accounts, we
        have no way to notify you individually — checking this page is the reliable route.
      </p>
      <p>
        Questions about any of this can go to {siteConfig.author}.
      </p>
    </>
  );
}
