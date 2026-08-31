import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";

import { Prose } from "@/components/shared/Prose";
import { playApps, playStoreUrl } from "@/config/apps";
import { absoluteUrl, siteConfig } from "@/config/site";

/** One page per app, built at compile time from the registry. */
export function generateStaticParams() {
  return playApps.map((app) => ({ app: app.packageName }));
}

function find(packageName: string) {
  return playApps.find((app) => app.packageName === packageName);
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ app: string }>;
}): Promise<Metadata> {
  const app = find((await params).app);
  if (!app) return {};

  return {
    title: `Privacy Policy — ${app.name}`,
    description: `How ${app.name} handles your data.`,
    alternates: { canonical: absoluteUrl(`/apps/${app.packageName}/privacy`) },
    /*
     * Reachable but not indexed. These five policies share most of their
     * wording by design, and a set of near-identical pages is the duplicate
     * content that got the unit pair pages held back. Google Play needs the URL
     * to load; nobody needs it in search results.
     */
    robots: { index: false, follow: true },
  };
}

export default async function AppPrivacyPage({
  params,
}: {
  params: Promise<{ app: string }>;
}) {
  const app = find((await params).app);
  if (!app) notFound();

  const { privacy } = app;

  return (
    <div className="mx-auto w-full max-w-3xl px-5 py-14 sm:px-6 lg:px-8 lg:py-20">
      <Prose>
      <h1>Privacy Policy &mdash; {app.name}</h1>
      <p>
        <strong>Last updated:</strong> {privacy.updated}
      </p>

      <h2>Overview</h2>
      <p>
        {app.name} (&ldquo;the app&rdquo;, &ldquo;we&rdquo;) is {privacy.summary}. It is published
        by {siteConfig.author}.
      </p>

      <h2>What we collect</h2>
      <p>
        <strong>We do not collect personal information.</strong> There is no account to create, no
        sign-in, and no backend server of ours that your activity is sent to.
      </p>
      {privacy.storedOnDevice.length > 0 ? (
        <>
          <p>The app stores the following, and stores it only on your device:</p>
          <ul>
            {privacy.storedOnDevice.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <p>
            Uninstalling the app removes it. We never receive a copy, and we cannot see it at any
            point.
          </p>
        </>
      ) : null}

      <h2>Network use</h2>
      {privacy.network.length > 0 ? (
        privacy.network.map((line) => <p key={line}>{line}</p>)
      ) : (
        <p>
          The app makes no network requests of its own. It works with no connection at all, and
          nothing you do in it is transmitted anywhere.
        </p>
      )}

      <h2>Permissions</h2>
      {privacy.permissions.length > 0 ? (
        <>
          <p>The app asks for the following, and only for the stated reason:</p>
          <ul>
            {privacy.permissions.map((permission) => (
              <li key={permission.name}>
                <strong>{permission.name}</strong> &mdash; {permission.why}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>The app requests no special device permissions.</p>
      )}

      <h2>Advertising</h2>
      {privacy.showsAds ? (
        <p>
          This app shows ads through Google AdMob. AdMob may collect and use data as described in
          Google&rsquo;s own privacy policy, including an advertising identifier. You can reset or
          delete that identifier in your device settings under Google &rsquo;{" "}
          <em>Ads</em>, which also lets you opt out of personalised advertising.
        </p>
      ) : (
        <p>This app does not show ads and contains no advertising SDK.</p>
      )}

      <h2>Children</h2>
      <p>
        The app is not directed at children under 13 and we do not knowingly collect information
        from them. Since the app collects no personal information from anyone, there is nothing
        held about a child to delete &mdash; but if you believe otherwise, contact us and we will
        look into it.
      </p>

      <h2>Your choices</h2>
      <p>
        Everything the app keeps is on your device and under your control. Clearing the app&rsquo;s
        storage or uninstalling it removes all of it. There is no account to close and no data of
        ours to request, because we hold none.
      </p>

      <h2>Changes</h2>
      <p>
        If this policy changes, the date at the top changes with it. Material changes will be
        described in the app&rsquo;s release notes rather than made quietly.
      </p>

      <h2>Contact</h2>
      <p>
        Questions about this policy: <a href={`mailto:${siteConfig.email}`}>{siteConfig.email}</a>.
      </p>
      <p>
        <Link href="/apps">All {siteConfig.author} apps</Link> &middot;{" "}
        <a href={playStoreUrl(app)} target="_blank" rel="noopener">
          {app.name} on Google Play
        </a>
      </p>
      </Prose>
    </div>
  );
}
