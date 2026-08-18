import Link from "next/link";

/**
 * The image format guide.
 *
 * Written as a decision rather than a specification. Anyone searching "png vs
 * jpg" has a file in front of them and wants to know what to do with it, not a
 * history of the formats — so every section ends in an answer, and the table
 * near the top exists to be read instead of the article.
 */
export default function ImageFormatsGuide() {
  return (
    <>
      <p>
        There are only really four choices for a photograph or a graphic on the
        web, and the right one is usually obvious once you know which question
        to ask. It is not &ldquo;which is best&rdquo; — it is{" "}
        <strong>does this image have large areas of flat colour, and does it
        need transparency</strong>.
      </p>

      <h2>The short answer</h2>

      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[36rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2.5 pr-4 font-medium text-foreground">If it is…</th>
              <th className="py-2.5 pr-4 font-medium text-foreground">Use</th>
              <th className="py-2.5 font-medium text-foreground">Because</th>
            </tr>
          </thead>
          <tbody className="[&_td]:py-2.5 [&_td]:pr-4 [&_td]:align-top [&_td]:text-muted-foreground [&_tr]:border-b [&_tr]:border-border">
            <tr>
              <td className="text-foreground">A photograph</td>
              <td className="font-medium text-foreground">JPG</td>
              <td>Universally supported and far smaller than PNG for continuous tone.</td>
            </tr>
            <tr>
              <td className="text-foreground">A photograph, web only</td>
              <td className="font-medium text-foreground">WebP</td>
              <td>Roughly 25–35% smaller than JPG at the same quality.</td>
            </tr>
            <tr>
              <td className="text-foreground">A logo or icon</td>
              <td className="font-medium text-foreground">SVG</td>
              <td>Vector — sharp at any size, usually a few kilobytes.</td>
            </tr>
            <tr>
              <td className="text-foreground">A screenshot or diagram</td>
              <td className="font-medium text-foreground">PNG</td>
              <td>Lossless, so text and lines stay crisp instead of smearing.</td>
            </tr>
            <tr>
              <td className="text-foreground">Anything needing transparency</td>
              <td className="font-medium text-foreground">PNG or WebP</td>
              <td>JPG has no alpha channel at all.</td>
            </tr>
            <tr>
              <td className="text-foreground">A photo from an iPhone</td>
              <td className="font-medium text-foreground">Convert to JPG</td>
              <td>HEIC is efficient but half the web cannot open it.</td>
            </tr>
          </tbody>
        </table>
      </div>

      <h2>Lossy and lossless is the whole distinction</h2>
      <p>
        Every format here falls on one side of a single line. <strong>Lossy</strong>{" "}
        formats — JPG, and WebP and AVIF in their usual modes — throw information
        away to get smaller, choosing detail your eye is bad at noticing.{" "}
        <strong>Lossless</strong> formats — PNG, and WebP in its lossless mode —
        keep every pixel exactly and compress by finding repetition.
      </p>
      <p>
        That is why a photograph saved as PNG is enormous. A photograph has
        almost no exact repetition: every patch of sky is a slightly different
        blue, so there is nothing for lossless compression to collapse. And it is
        why a screenshot saved as JPG looks dirty — the sharp black-to-white edge
        of a letter is exactly the high-frequency detail JPG discards first, so
        text picks up a grey halo.
      </p>
      <p>
        Get those two the wrong way round and you pay for it twice: a bigger file
        <em> and</em> a worse image.
      </p>

      <h3>Lossy compression only goes one way</h3>
      <p>
        Converting a JPG to PNG does not restore anything. The detail was
        discarded when the JPG was written; a PNG of it is a perfect, much larger
        copy of the damaged version. Similarly, every time you open a JPG, edit
        it and save it again, it is re-compressed and loses a little more —
        generation loss. Keep an original if you expect to edit repeatedly.
      </p>

      <h2>The formats, one at a time</h2>

      <h3>JPG</h3>
      <p>
        Thirty years old and still the right answer for a photograph you need
        anyone to be able to open. It has no transparency, no animation, and it
        is lossy — but support is genuinely universal, which no newer format can
        claim. <code>.jpg</code> and <code>.jpeg</code> are the same format; the
        three-letter version is a leftover from when file extensions could not be
        longer.
      </p>

      <h3>PNG</h3>
      <p>
        Lossless, with a proper alpha channel. The correct choice for
        screenshots, diagrams, anything with text in it, and anything that needs
        to sit on a background that is not white. The wrong choice for
        photographs, where it will produce a file several times the size of the
        equivalent JPG for no visible benefit.
      </p>

      <h3>WebP</h3>
      <p>
        Does both jobs — lossy like JPG, lossless like PNG, with transparency in
        either mode — and is meaningfully smaller than both. Support is
        effectively universal in browsers now. The catch is outside the browser:
        plenty of desktop software, older phones and some print workflows still
        refuse it, which is why it is the right format for a website and the
        wrong one for a file you are emailing to someone.
      </p>

      <h3>AVIF</h3>
      <p>
        Smaller again than WebP, sometimes dramatically so at low quality
        settings. Browser support is good but not complete, encoding is slow, and
        tool support outside browsers is thin. Worth using with a fallback, not
        on its own.
      </p>

      <h3>SVG</h3>
      <p>
        Not a picture at all but a set of drawing instructions, so it is perfectly
        sharp at every size and usually tiny. Right for logos, icons and simple
        illustrations; useless for photographs. It is also text, which means it
        can be styled with CSS — and that it can carry scripts, so treat an SVG
        from an untrusted source the way you would treat an HTML file.
      </p>

      <h3>HEIC</h3>
      <p>
        What iPhones shoot by default. Roughly half the size of JPG at the same
        quality, which is a real advantage on a phone and a real nuisance
        everywhere else: browsers cannot display it without Apple&rsquo;s
        libraries, and a great many websites reject it outright.{" "}
        <Link href="/image/heic-to-jpg">Convert it to JPG</Link> before sending
        it anywhere.
      </p>

      <h2>What about GIF?</h2>
      <p>
        Use it only for animation, and preferably not even then. A GIF is limited
        to 256 colours, which makes photographs look banded, and animated GIFs
        are enormous compared with the same clip as a video. For a still image
        there is no situation in which GIF beats PNG.
      </p>

      <h2>Practical rules</h2>
      <ul>
        <li>
          <strong>Photograph going on a website:</strong> WebP, with a JPG
          fallback if you can be bothered.
        </li>
        <li>
          <strong>Photograph going to a person:</strong> JPG. It always opens.
        </li>
        <li>
          <strong>Screenshot:</strong> PNG. Always.
        </li>
        <li>
          <strong>Logo:</strong> SVG if you have the vector, PNG if you only have
          a raster.
        </li>
        <li>
          <strong>Anything with transparency:</strong> not JPG, under any
          circumstances — it will be flattened onto white.
        </li>
        <li>
          <strong>Don&rsquo;t convert lossy to lossy twice.</strong> JPG to WebP
          to JPG compresses the same image three times.
        </li>
      </ul>

      <h2>Converting between them</h2>
      <p>
        All the conversions below happen in your browser — the file is read from
        disk by the page, decoded and re-encoded on your own machine, and never
        uploaded. That matters more than it sounds for images, which are
        routinely unreleased artwork, screenshots of private systems or
        photographs of people.
      </p>
      <p>
        One thing to expect: converting <em>to</em> JPG flattens transparency
        onto a white background, because JPG has nowhere to store it. If your
        image has a transparent background and you need to keep it, convert to{" "}
        <Link href="/image/png-to-webp">WebP</Link> instead.
      </p>
    </>
  );
}
