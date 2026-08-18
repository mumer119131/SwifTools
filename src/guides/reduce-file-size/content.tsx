import Link from "next/link";

export default function ReduceFileSizeGuide() {
  return (
    <>
      <p>
        Almost everyone arrives at this problem the same way: something has
        rejected a file for being too large, and there is a number to get under.
        The fastest route there depends entirely on what kind of file it is, and
        the single most effective lever is usually not the one labelled
        &ldquo;compress&rdquo;.
      </p>

      <h2>For an image, resize before you compress</h2>
      <p>
        This is the one that surprises people. A photo straight off a modern
        phone is around 4000 pixels wide. If it is going into a document, an
        email or a web page, it will be displayed at perhaps 1200 — and the file
        carries roughly eleven times more pixels than anything will ever show.
      </p>
      <p>
        Halving both dimensions quarters the pixel count, and the file size falls
        by roughly the same proportion. Nothing visible is lost, because those
        pixels were never being displayed. Compression, by contrast, buys you a
        smaller file by degrading the pixels you <em>are</em> looking at.
      </p>
      <p>So the order is:</p>
      <ol>
        <li>
          <strong><Link href="/image/resize-image">Resize</Link> to the largest
          size it will actually be shown at.</strong> This is free quality.
        </li>
        <li>
          <strong><Link href="/image/compress-image">Compress</Link> what is
          left.</strong> Around 80% quality is the usual sweet spot — visually
          indistinguishable from the original for most photographs, and often
          less than half the size.
        </li>
        <li>
          <strong>Change format if it is still too big.</strong> A photograph
          saved as PNG will shrink dramatically as a{" "}
          <Link href="/image/png-to-jpg">JPG</Link>. See{" "}
          <Link href="/guides/image-formats">choosing an image format</Link> for
          which to pick.
        </li>
      </ol>

      <h3>Rough guide to quality settings</h3>
      <ul>
        <li><strong>90–100%</strong> — hard to distinguish from the original, and barely smaller. Rarely worth it.</li>
        <li><strong>75–85%</strong> — the useful range. Most people cannot tell at normal viewing size.</li>
        <li><strong>60–75%</strong> — visible softening in detailed areas, acceptable for thumbnails.</li>
        <li><strong>Below 60%</strong> — obvious artefacts around edges and text.</li>
      </ul>

      <h2>For a PDF, find out what is making it big</h2>
      <p>
        A PDF is a container, and its size is almost always dominated by one of
        three things. Which one decides what to do:
      </p>
      <ul>
        <li>
          <strong>Scanned pages.</strong> Each page is a full-resolution image,
          often 300 DPI or more. This is the usual cause of a 40MB document and
          the one that compresses best.
        </li>
        <li>
          <strong>Embedded photographs.</strong> Same problem as any image, just
          wrapped in a document.
        </li>
        <li>
          <strong>Embedded fonts.</strong> A few hundred kilobytes at most —
          irrelevant unless the document is otherwise tiny.
        </li>
      </ul>
      <p>
        A text-only PDF exported from a word processor is already small, and
        compressing it will do close to nothing. If your 30-page report is 200KB,
        there is nothing to win.
      </p>
      <p>
        <Link href="/pdf/compress-pdf">Compressing a PDF</Link> works on the
        images inside it. If that is still not enough, the honest next step is to{" "}
        <Link href="/pdf/split-pdf">split it</Link> — sending three files of 4MB
        succeeds where one of 12MB does not, and neither loses anything.
      </p>

      <h2>Common limits worth knowing</h2>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[26rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2 pr-4 font-medium text-foreground">Where</th>
              <th className="py-2 font-medium text-foreground">Limit</th>
            </tr>
          </thead>
          <tbody className="[&_td]:py-2 [&_td]:pr-4 [&_td]:text-muted-foreground [&_tr]:border-b [&_tr]:border-border">
            <tr><td className="text-foreground">Gmail attachment</td><td>25 MB</td></tr>
            <tr><td className="text-foreground">Outlook attachment</td><td>20 MB</td></tr>
            <tr><td className="text-foreground">WhatsApp document</td><td>2 GB</td></tr>
            <tr><td className="text-foreground">Most job application forms</td><td>2–5 MB</td></tr>
            <tr><td className="text-foreground">Government upload forms</td><td>Often 2 MB</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        Note that email limits apply to the <em>encoded</em> attachment, which is
        about a third larger than the file on disk. A 24MB file will not go
        through a 25MB limit.
      </p>

      <h2>What not to do</h2>
      <ul>
        <li>
          <strong>Don&rsquo;t zip a JPG or a PDF.</strong> Both are already
          compressed. Zipping typically saves one or two percent and adds a step
          for whoever receives it.
        </li>
        <li>
          <strong>Don&rsquo;t compress the same image twice.</strong> Each pass
          discards more detail. If the result is too big, go back to the original
          and use a lower quality once, rather than compressing the compressed
          version.
        </li>
        <li>
          <strong>Don&rsquo;t screenshot a document to shrink it.</strong> You
          turn selectable text into an image, which is larger, unsearchable and
          unreadable to a screen reader.
        </li>
        <li>
          <strong>Don&rsquo;t resize up.</strong> Enlarging cannot add detail; it
          only adds pixels and file size.
        </li>
      </ul>

      <h2>A note on privacy</h2>
      <p>
        Most sites that compress a file for you upload it to a server to do it.
        For a holiday photo that may not matter. For a signed contract, a
        passport scan or a medical letter — which is a great deal of what gets
        compressed to fit an upload form — it very much does.
      </p>
      <p>
        Every tool linked here runs in your browser: the file is read from disk
        by the page, processed on your own device, and written back out without
        ever being transmitted. You can watch the network tab and confirm it.
      </p>
    </>
  );
}
