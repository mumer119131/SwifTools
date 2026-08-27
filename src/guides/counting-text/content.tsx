import Link from "next/link";

export default function CountingTextGuide() {
  return (
    <>
      <p>
        Counting text sounds like it should have one right answer. It does not.
        Two tools can look at the same paragraph and disagree about how many
        words and characters it contains, and both can be correct — because
        &ldquo;word&rdquo; and &ldquo;character&rdquo; are less precise than they
        appear.
      </p>

      <h2>What counts as a word</h2>
      <p>
        Almost every counter splits on whitespace, which handles ordinary prose
        well and then meets the edge cases.
      </p>
      <p>
        Is <em>mother-in-law</em> one word or three? Is <em>don&rsquo;t</em> one
        or two? What about a URL, an email address, or a number like{" "}
        <em>1,250,000</em>? Split on whitespace and each is one word. Split on
        punctuation and the answers change completely.
      </p>
      <p>
        The convention most tools follow — whitespace-separated runs of
        characters — is the same one word processors use, which is why a{" "}
        <Link href="/text/word-counter">word counter</Link> should agree with
        Word or Docs on normal prose and may diverge on text full of hyphens,
        code or addresses.
      </p>
      <p>
        For anything with a limit attached, the useful move is to check against
        the counter that will actually judge you. A university that says 2,000
        words means whatever its own system counts.
      </p>

      <h2>Characters are stranger than words</h2>
      <p>
        A character count can mean at least three different things, and the
        difference is not academic.
      </p>
      <p>
        Take the emoji 👨‍👩‍👧. A person sees one character. It is three people
        joined by invisible connectors — <strong>five</strong> Unicode code
        points. JavaScript&rsquo;s <code>.length</code>, which a great many
        counters are built on, reports <strong>eight</strong>, because it counts
        UTF-16 units and each of those emoji needs two. Encoded as UTF-8 it
        occupies <strong>18</strong> bytes. One symbol, four defensible answers,
        and a counter can legitimately hand you any of them.
      </p>
      <p>
        Accented letters do the same thing more quietly. <em>é</em> can be a
        single code point, or <em>e</em> followed by a combining accent — two
        code points that display identically. Copy text between applications and
        it can silently switch forms, changing your character count without
        changing a visible thing.
      </p>
      <p>
        This is why a <Link href="/text/character-counter">character counter</Link>{" "}
        matters most where a hard limit exists — a meta description, an SMS, a
        database column. And when a specific character is behaving oddly,{" "}
        <Link href="/text/unicode-lookup">looking up its code point</Link> is
        usually how you find out it was never the character you thought.
      </p>

      <h3>The invisible characters that break things</h3>
      <p>
        Text pasted from a web page or a PDF often carries passengers.{" "}
        <strong>Non-breaking spaces</strong> look exactly like ordinary spaces
        and are a different character, so a search for two words separated by one
        will not match. <strong>Zero-width characters</strong> have no appearance
        at all yet still count and still break comparisons.
      </p>
      <p>
        And <strong>smart quotes</strong> — the curly ones a word processor
        substitutes automatically — are different characters from the straight
        ones code expects. Pasting a snippet from a document into a terminal and
        getting a syntax error is nearly always this.
      </p>

      <h2>Line endings, the invisible incompatibility</h2>
      <p>
        A line ending is a character too, and there are two conventions. Windows
        ends lines with a carriage return and a newline; everything else uses
        just a newline. So the same file can differ by one byte per line
        depending on where it was written.
      </p>
      <p>
        This is why a file can look identical in two editors and still show as
        entirely changed in a diff. It is also why{" "}
        <Link href="/text/remove-line-breaks">removing line breaks</Link> matters
        when text has been copied out of a PDF: the wrapping is baked in as real
        line endings, so the paragraph arrives broken into fragments that will
        not reflow.
      </p>

      <h2>The cleaning jobs that come up constantly</h2>
      <p>
        A few operations account for most day-to-day text work, and each is
        fiddly enough by hand to be worth a tool.
      </p>
      <p>
        <strong>Comparing two versions.</strong> A{" "}
        <Link href="/text/text-diff">text diff</Link> shows what actually changed
        between two blocks, which is far more reliable than reading both and
        trusting your eyes — particularly for the single-character changes that
        are easiest to miss.
      </p>
      <p>
        <strong>Removing repeats.</strong>{" "}
        <Link href="/text/remove-duplicate-lines">Deduplicating lines</Link>{" "}
        cleans up a list built from several sources. Watch for trailing spaces:
        two lines that look identical but differ by one invisible space are two
        different lines to any tool.
      </p>
      <p>
        <strong>Changing case.</strong>{" "}
        <Link href="/text/case-converter">Case conversion</Link> covers upper,
        lower, title and the programming conventions. Title case is the one with
        real disagreement — style guides differ on which small words stay
        lowercase, so the result is a convention rather than a rule.
      </p>
      <p>
        <strong>Getting plain text out of markup.</strong>{" "}
        <Link href="/text/strip-html">Stripping HTML tags</Link> gets the
        readable content out of a page source or an email, which is the usual
        first step before counting anything at all.
      </p>

      <h2>A short checklist for a count you can trust</h2>
      <p>
        Strip any markup first, so tags are not counted as content. Decide
        whether the limit means characters or bytes, since they differ the moment
        anything is not plain English. Check for invisible passengers if a count
        looks wrong by a few. And where a specific system enforces the limit,
        trust its counter over any other — including this one.
      </p>
    </>
  );
}
