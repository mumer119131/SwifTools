import Link from "next/link";

export default function PdfBasicsGuide() {
  return (
    <>
      <p>
        PDFs are frustrating in a specific and consistent way: the text will not
        copy, the file is inexplicably enormous, and editing one means fighting
        it. All three come from the same design decision, made in 1993 and still
        holding.
      </p>

      <h2>A PDF describes a page, not a document</h2>
      <p>
        A word processor file stores meaning — this is a heading, this is a
        paragraph, this list has four items — and works out the appearance when
        it opens. A PDF stores the opposite: the finished appearance, with the
        meaning discarded. Put this glyph at this coordinate, in this font, at
        this size.
      </p>
      <p>
        That is why it looks identical everywhere, which was the entire point.
        Before PDFs, a document mailed to a client routinely arrived
        reflowed. A PDF has no reflowing to do, because there is no structure
        left to reflow.
      </p>
      <p>Everything awkward about PDFs follows from that.</p>

      <h2>Why the text will not copy</h2>
      <p>There are two different causes, and they need different fixes.</p>

      <h3>It is a scan</h3>
      <p>
        If the PDF came from a scanner or a phone camera, each page is a
        photograph. There is no text in the file at all — only an image that
        looks like text. Selecting does nothing because there is nothing to
        select.
      </p>
      <p>
        The fix is OCR, which reads the picture and guesses the characters. It is
        never perfect, and it is a genuinely different operation from anything
        else here.
      </p>

      <h3>It has text, but no words</h3>
      <p>
        More often the text is there and comes out mangled — missing spaces, or
        letters in the wrong order. That is the coordinate model showing through:
        the file says where each glyph sits, and nothing says where one word ends
        and the next begins. A space is often just a gap. Copying has to infer
        word boundaries from distances, and it gets it wrong on justified text,
        multiple columns and tables especially.
      </p>
      <p>
        <Link href="/pdf/pdf-to-word">Converting to Word</Link> does the same
        inference more carefully, and gets you something editable. Expect layout
        to shift — it is reconstructing structure that was thrown away.
      </p>

      <h2>Why the file is 40MB</h2>
      <p>
        Almost always images, and almost always scans. A scanner producing 300
        DPI colour generates roughly 25 million pixels per A4 page. Twenty pages
        of that is a very large file, whatever it contains.
      </p>
      <p>Rough expectations:</p>
      <ul>
        <li><strong>Text-only, from a word processor</strong> — tens of kilobytes per page.</li>
        <li><strong>With a few images</strong> — a few hundred kilobytes per page.</li>
        <li><strong>Scanned</strong> — 1 to 5MB per page.</li>
      </ul>
      <p>
        So a 40MB text document is unusual and probably has something embedded;
        a 40MB scan of twenty pages is entirely normal.{" "}
        <Link href="/pdf/compress-pdf">Compressing</Link> works on the images
        inside, which is why it transforms a scan and does nothing measurable to
        a text document.
      </p>

      <h2>Why editing is awkward</h2>
      <p>
        Because there are no paragraphs. Changing a sentence in the middle of one
        does not push the rest along — every glyph after it has a fixed
        coordinate, and something has to recompute all of them. Editors do
        attempt this, with mixed results, especially where the original font is
        not installed.
      </p>
      <p>
        The realistic approach: if you own the source document, edit that and
        export again. If you do not,{" "}
        <Link href="/pdf/pdf-to-word">convert to Word</Link>, accept that layout
        will move, and fix it there.
      </p>

      <h2>Things that are easy, despite all this</h2>
      <p>
        Operations that treat pages as whole units are simple and lossless,
        because they do not touch page contents at all:
      </p>
      <ul>
        <li>
          <Link href="/pdf/merge-pdf">Merging</Link> — pages are copied across
          untouched. Nothing is re-encoded and nothing degrades.
        </li>
        <li>
          <Link href="/pdf/split-pdf">Splitting</Link> — the same in reverse, and
          the right answer when a file is too large to email.
        </li>
        <li>Reordering, rotating and deleting pages — all page-level.</li>
      </ul>
      <p>
        Worth knowing: merging and splitting lose nothing at all. Compressing
        does, because it re-encodes the images. Reach for the lossless ones first.
      </p>

      <h2>Two things that are not what they seem</h2>
      <h3>Redaction is not a black rectangle</h3>
      <p>
        Drawing a black box over text in most PDF tools adds a shape on top. The
        text is still underneath, still selectable, still recoverable by anyone
        who copies the page. This has embarrassed governments and law firms
        repeatedly. Proper redaction removes the underlying content, and if your
        tool does not say explicitly that it does so, assume it does not.
      </p>

      <h3>Password protection comes in two kinds</h3>
      <p>
        A password to <em>open</em> the file means real encryption. A password
        restricting printing or copying is a flag that the file politely asks
        readers to honour, and most tools will ignore it. Do not treat the second
        kind as protection.
      </p>

      <h2>A note on where this happens</h2>
      <p>
        PDFs are disproportionately the documents that matter — contracts, bank
        statements, medical letters, identity scans — which makes it worth
        knowing whether a tool uploads them. Everything linked above runs in your
        browser; the file is read from disk by the page and never transmitted.
        See <Link href="/guides/online-tool-privacy">are online tools safe</Link>{" "}
        for how to check that for yourself, on any site.
      </p>
    </>
  );
}
