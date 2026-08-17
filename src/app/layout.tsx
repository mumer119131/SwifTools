import type { Metadata, Viewport } from "next";
import Script from "next/script";
import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import { Toaster } from "sonner";

import "@/styles/globals.css";

import { pageTitle, siteConfig, siteUrl } from "@/config/site";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { SearchCommandProvider } from "@/components/layout/SearchCommand";
import { JsonLdScript } from "@/components/shared/JsonLd";
import { websiteLd } from "@/lib/seo";
import { adsConfig } from "@/config/ads";
import { Analytics } from "@/components/layout/Analytics";
import { analyticsConfig, gtagBootstrap } from "@/config/analytics";

export const metadata: Metadata = {
  metadataBase: siteUrl,
  title: {
    default: pageTitle(),
    // Nested pages supply only their own segment.
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  authors: [{ name: siteConfig.author }],
  creator: siteConfig.author,
  publisher: siteConfig.author,
  formatDetection: { telephone: false },
  openGraph: {
    type: "website",
    url: siteConfig.url,
    siteName: siteConfig.name,
    title: pageTitle(),
    description: siteConfig.description,
  },
  twitter: { card: "summary_large_image" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
  /*
   * Search Console and Bing ownership tokens, from the environment.
   *
   * Needed before a sitemap can be submitted, and Search Console is also how
   * you find out that a page stopped being indexed. Omitted entirely when
   * unset, so no empty meta tag ships. DNS TXT verification works just as well
   * and avoids this — the meta tag is the easier route on a host where you do
   * not control DNS records.
   */
  verification: {
    ...(process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
      ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
      : {}),
    ...(process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION
      ? { other: { "msvalidate.01": process.env.NEXT_PUBLIC_BING_SITE_VERIFICATION } }
      : {}),
  },
  /*
   * AdSense site verification.
   *
   * Derived from the same publisher ID that drives the ad script and ads.txt,
   * rather than pasted separately — three copies of one identifier is three
   * chances for them to disagree, and a mismatched verification tag fails
   * review without saying why.
   */
  ...(adsConfig.enabled
    ? { other: { "google-adsense-account": adsConfig.clientId } }
    : {}),
};

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  // Zoom is never disabled.
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#08090a" },
  ],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      // next-themes sets the class on the client; this keeps hydration quiet.
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="min-h-dvh">
        {/*
          The analytics bootstrap, rendered as a plain inline script from this
          server component so it lands literally in the HTML and executes
          before the async library. That ordering is the whole point: the
          Consent Mode defaults must reach the dataLayer before gtag.js
          processes its first config, or the library initialises with no
          consent state. next/script's beforeInteractive only hoists from the
          root layout, and even there a raw tag is the predictable option.
        */}
        {analyticsConfig.enabled ? (
          <script
            id="ga-init"
            dangerouslySetInnerHTML={{
              __html: gtagBootstrap(analyticsConfig.measurementId),
            }}
          />
        ) : null}

        <ThemeProvider>
          <SearchCommandProvider>
            <a
              href="#main"
              className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-50 focus:rounded-md focus:bg-primary focus:px-4 focus:py-2 focus:text-sm focus:text-primary-foreground"
            >
              Skip to main content
            </a>
            <div className="flex min-h-dvh flex-col">
              <Header />
              <main id="main" className="flex-1">
                {children}
              </main>
              <Footer />
            </div>
            <Toaster
              position="bottom-right"
              // Toasts read the app tokens rather than sonner's own palette.
              toastOptions={{
                classNames: {
                  toast:
                    "!bg-[var(--surface-elevated)] !border-[var(--border)] !text-[var(--foreground)] !rounded-lg",
                  description: "!text-[var(--muted-foreground)]",
                },
              }}
            />
          </SearchCommandProvider>
        </ThemeProvider>
        <JsonLdScript data={websiteLd()} />

        {analyticsConfig.enabled ? (
          <Script
            id="ga-src"
            async
            strategy="afterInteractive"
            src={`https://www.googletagmanager.com/gtag/js?id=${analyticsConfig.measurementId}`}
          />
        ) : null}
        <Analytics />

        {/*
          Loaded only when a publisher ID is configured, so a default build
          makes no third-party request at all. `afterInteractive` keeps it off
          the critical path — an ad script blocking first paint would undo the
          performance work everywhere else.
        */}
        {adsConfig.enabled ? (
          <Script
            id="adsense"
            async
            strategy="afterInteractive"
            crossOrigin="anonymous"
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${adsConfig.clientId}`}
          />
        ) : null}
      </body>
    </html>
  );
}
