import Link from "next/link";

export default function TechnicalSeoGuide() {
  return (
    <>
      <p>
        Technical SEO is a small subject wearing a large hat. There are perhaps
        six things that genuinely matter, most of them are one line of markup,
        and the difficulty is almost entirely in knowing which instruction does
        what — because several of them look interchangeable and are not.
      </p>

      <h2>Crawling and indexing are different</h2>
      <p>
        This distinction explains most technical SEO confusion.
        <strong> Crawling</strong> is a search engine fetching your page.{" "}
        <strong>Indexing</strong> is deciding to store it and show it in results.
        A page can be crawled and not indexed, and — importantly — indexed
        without ever being crawled.
      </p>

      <h3>robots.txt controls crawling, not indexing</h3>
      <p>
        A <code>Disallow</code> rule says &ldquo;do not fetch this&rdquo;. It
        does not say &ldquo;do not list this&rdquo;. If other sites link to a
        blocked page, Google can still index the URL — showing it in results with
        no description, because it was never allowed to look.
      </p>
      <p>
        <strong>To keep a page out of results, use <code>noindex</code>, and do
        not block it in robots.txt.</strong> The crawler has to fetch the page to
        see the noindex instruction; blocking it means the instruction is never
        read. Doing both is the single most common way people fail to hide a
        page.
      </p>
      <p>
        <Link href="/seo/robots-txt-generator">Generate a robots.txt</Link> and{" "}
        <Link href="/seo/robots-txt-tester">test a URL against one</Link> before
        deploying it — a stray <code>Disallow: /</code> has taken entire sites out
        of search.
      </p>

      <h2>Canonical tags</h2>
      <p>
        The same content is often reachable at several URLs — with and without
        tracking parameters, with and without a trailing slash, HTTP and HTTPS. A
        canonical tag names which one is the real one:
      </p>
      <p>
        <code>&lt;link rel=&quot;canonical&quot; href=&quot;https://example.com/page&quot;&gt;</code>
      </p>
      <p>
        Rankings then consolidate on that URL instead of splitting between
        duplicates. Three rules worth following: make it absolute, make every
        page canonical to itself unless it genuinely is a duplicate, and never
        point every page at your homepage — which is a surprisingly common
        mistake and tells Google the rest of your site is worthless.
      </p>
      <p>
        It is a hint rather than a command. Google can ignore it if the pages
        differ enough.
      </p>

      <h2>Titles and descriptions</h2>
      <p>
        The title tag is still one of the strongest on-page signals and the main
        thing a person reads in results. Put the distinguishing words first —
        &ldquo;Subnet Calculator&rdquo; before your brand name, not after.
      </p>
      <p>
        The meta description is <em>not</em> a ranking factor, and has not been
        for years. It is advertising copy: it affects whether someone clicks.
        Google rewrites it more often than not, usually picking text from the
        page that matches the query, so writing a good page matters more than
        writing a good description.
      </p>
      <p>
        <Link href="/seo/meta-tag-generator">The meta tag generator</Link> covers
        those plus the Open Graph tags that decide how a link looks when shared.
      </p>

      <h2>Structured data</h2>
      <p>
        JSON-LD in a script tag, telling search engines what a page{" "}
        <em>is</em> rather than what it says — this is a recipe, this is a
        product, these are its FAQs. It does not improve rankings directly. It
        makes a page eligible for rich results: star ratings, FAQ dropdowns,
        recipe cards.
      </p>
      <p>Two things stop it working:</p>
      <ul>
        <li>
          <strong>Marking up things that are not on the page.</strong> The
          structured data must describe visible content. FAQ markup for questions
          a visitor cannot see is a policy violation, not a shortcut.
        </li>
        <li>
          <strong>Missing required properties.</strong> A type with a required
          field absent is simply ignored, silently, which is why so much markup
          does nothing.
        </li>
      </ul>
      <p>
        Eligibility is not a promise. Google shows rich results when it feels
        like it. <Link href="/seo/schema-generator">Generate valid JSON-LD</Link>{" "}
        for the common types rather than writing it by hand.
      </p>

      <h2>Sitemaps</h2>
      <p>
        An XML sitemap is a list of URLs you would like crawled. It helps most on
        large sites and on pages with few internal links; it will not rescue a
        page nothing links to and nobody wants.
      </p>
      <ul>
        <li>Only include URLs you actually want indexed — no redirects, no noindex pages, no 404s.</li>
        <li>
          Give honest <code>lastmod</code> dates. Stamping every URL with the
          build time claims the whole site changed on every deploy, which is
          false and a signal crawlers learn to ignore.
        </li>
        <li>Reference it from robots.txt and submit it in Search Console.</li>
      </ul>
      <p>
        <Link href="/seo/sitemap-generator">Build one here</Link> if your
        platform does not generate it for you.
      </p>

      <h2>Multiple languages</h2>
      <p>
        <code>hreflang</code> tells Google which version of a page suits which
        language or region. It has three rules that trip everyone:
      </p>
      <ol>
        <li>
          <strong>It must be reciprocal.</strong> If A points to B, B must point
          back to A. One-directional hreflang is ignored entirely.
        </li>
        <li><strong>Every version must reference itself</strong> as well as the others.</li>
        <li>
          <strong>Include an <code>x-default</code></strong> for anyone who
          matches none of them.
        </li>
      </ol>
      <p>
        <Link href="/seo/hreflang-generator">The hreflang generator</Link>{" "}
        produces a reciprocal set, which is most of the difficulty.
      </p>

      <h2>Why a page is not indexed</h2>
      <p>In rough order of likelihood:</p>
      <ol>
        <li><strong>It is too new.</strong> Days to weeks is normal for a new site.</li>
        <li><strong>Nothing links to it</strong> — internally or externally.</li>
        <li><strong>It is blocked</strong> by robots.txt or carries a noindex.</li>
        <li><strong>It canonicalises elsewhere</strong>, so Google indexed that instead.</li>
        <li>
          <strong>It is judged not worth indexing.</strong> Thin, duplicated, or
          near-identical to a page already indexed. This is the real reason more
          often than people would like.
        </li>
      </ol>
      <p>
        Search Console&rsquo;s Page Indexing report tells you which. It is worth
        reading before changing anything, because four of those five need
        completely different fixes.
      </p>

      <h2>Measuring what arrives</h2>
      <p>
        <Link href="/seo/utm-builder">UTM parameters</Link> tag a link so
        analytics can attribute the visit. Keep them consistent —{" "}
        <code>Facebook</code> and <code>facebook</code> are two different sources
        in most tools — and never put them on internal links, which resets the
        original attribution and rewrites your own traffic as coming from
        yourself.
      </p>

      <h2>What to ignore</h2>
      <ul>
        <li><strong>Keyword meta tags.</strong> Ignored by every major search engine for well over a decade.</li>
        <li><strong>Keyword density.</strong> Not a thing. Write for the reader.</li>
        <li><strong>Submitting to search engines.</strong> Unnecessary. A link is enough.</li>
        <li>
          <strong>Chasing a perfect performance score.</strong> Core Web Vitals
          are a real but small signal. A page that loads in 2 seconds and answers
          the question beats one that loads in 0.8 and does not.
        </li>
      </ul>
    </>
  );
}
