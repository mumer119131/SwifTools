import type { Metadata } from "next";

import { adsConfig } from "@/config/ads";
import { analyticsConfig } from "@/config/analytics";
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
          <strong>Nothing we set ourselves.</strong> Your theme preference and anything a tool
          saves — a to-do list, a habit grid, a vault — are kept in your browser&rsquo;s local
          storage and never sent to us. We set no cookies of our own.
          {analyticsConfig.enabled || adsConfig.enabled
            ? " Google does set cookies, for the analytics and advertising described below."
            : " We run no analytics."}
        </li>
      </ul>

      <h2>Analytics</h2>
      {analyticsConfig.enabled ? (
        <>
          <p>
            {siteConfig.name} uses <strong>Google Analytics</strong> to count visits and see which
            tools get used. It records the page you are on, roughly where in the world you are, and
            what kind of device and browser you have. It sets a cookie to tell a returning visitor
            from a new one.
          </p>
          <p>
            It does <strong>not</strong> see anything you put into a tool. The files you process,
            the text you paste, the passwords you generate and the notes you save never leave your
            browser, so there is nothing there for analytics to collect even in principle. Your IP
            address is truncated before it is stored.
          </p>
          <p>
            In the UK, the EEA and Switzerland nothing is stored until you agree to it — the default
            is off, and you are asked first. Everywhere else it is on by default. You can opt out in
            any browser with{" "}
            <a
              href="https://tools.google.com/dlpage/gaoptout"
              rel="noopener noreferrer"
              target="_blank"
            >
              Google&rsquo;s opt-out add-on
            </a>
            .
          </p>
          <p>
            Why have it at all, on a site that makes a point of not tracking you: without some
            measure of which tools are used, the ones nobody opens get maintained forever and the
            ones people rely on get no attention. That is the trade, and it seemed more honest to
            name it than to pretend the site runs on instinct.
          </p>
        </>
      ) : (
        <p>
          {siteConfig.name} runs no analytics. There is no measurement script of any kind, and no
          record is kept of which pages you visit.
        </p>
      )}

      <h2>Advertising</h2>
      {adsConfig.enabled ? (
        <>
          <p>
            {siteConfig.name} shows ads supplied by <strong>Google AdSense</strong>. Google is a
            third-party vendor and uses cookies and similar identifiers to serve ads and to measure
            whether they were seen. Depending on your settings and where you are, those ads may be
            personalised using data Google has already collected about you elsewhere.
          </p>
          <p>
            You can review and change what Google uses at{" "}
            <a href="https://myadcenter.google.com/" rel="noopener noreferrer" target="_blank">
              My Ad Center
            </a>
            , and opt out of personalised advertising from participating vendors at{" "}
            <a href="https://optout.aboutads.info/" rel="noopener noreferrer" target="_blank">
              aboutads.info
            </a>
            . In the UK and EEA you are asked for consent before any of this happens, and you can
            change that answer at any time from the link in the footer.
          </p>
          <p>
            This is worth being blunt about, because it is the one exception to everything else on
            this page. The tools themselves still upload nothing — your files are read and processed
            by your own browser. The advertising is a separate matter, and it does involve a third
            party watching which pages you visit on this site.
          </p>
        </>
      ) : (
        <p>
          {siteConfig.name} does not currently show ads and runs no advertising scripts. If that
          changes, this page will be updated before any ad code ships, and the provider and its data
          practices will be named here.
        </p>
      )}

      <h2>Third parties</h2>
      <p>
        The site is served as static files and loads no tag managers, no external fonts and no
        session recording.{" "}
        {analyticsConfig.enabled || adsConfig.enabled
          ? "The only third party involved is Google, for the analytics and advertising described above. Every tool page otherwise talks to our origin and nothing else."
          : "It loads no third-party scripts at all. Your browser talks to our origin and nothing else."}
      </p>
      <p>
        Three tools are the exception and say so on their own pages: the currency converter fetches
        exchange rates, and the two thumbnail grabbers ask a video host for a public image. Those
        requests carry the address you typed and nothing about you.
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
