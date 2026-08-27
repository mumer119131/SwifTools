import Link from "next/link";

export default function DataSizesGuide() {
  return (
    <>
      <p>
        Buy a 1&nbsp;TB drive, plug it in, and your computer reports 931&nbsp;GB.
        Nothing is missing and nobody is cheating. Two industries settled on two
        different meanings for the same prefix, and almost every confusion about
        file sizes traces back to that one disagreement — or to the other one,
        between bits and bytes.
      </p>

      <h2>Bits and bytes are not the same, and the difference is eight</h2>
      <p>
        A <strong>bit</strong> is a single 1 or 0. A <strong>byte</strong> is
        eight of them, and it is the unit files are measured in.
      </p>
      <p>
        The notation is unforgiving: a lowercase <code>b</code> means bits, an
        uppercase <code>B</code> means bytes. So <code>Mb</code> and{" "}
        <code>MB</code> differ by a factor of eight, and they look almost
        identical on a page.
      </p>
      <p>
        <strong>This is why your internet feels slower than advertised.</strong>{" "}
        Broadband is sold in megabits per second, but downloads are shown in
        megabytes per second. A 100&nbsp;Mbps connection delivers at best about
        12.5&nbsp;MB/s. The connection is doing exactly what was promised; the
        units changed underneath you.
      </p>

      <h2>The 1000 versus 1024 problem</h2>
      <p>
        Computers count in binary, so 1024 (2<sup>10</sup>) is a natural round
        number to them. Humans count in tens, so 1000 is a natural round number
        to us. Both got used, and both got called &ldquo;kilo&rdquo;.
      </p>
      <p>
        The gap compounds at every step. It is 2.4% at kilobytes, 4.9% at
        megabytes, 7.4% at gigabytes and <strong>10% at terabytes</strong> —
        which is exactly the missing 69&nbsp;GB on that 1&nbsp;TB drive.
      </p>
      <p>
        The drive genuinely holds 1,000,000,000,000 bytes, which is a terabyte by
        the decimal definition the manufacturer used. Your operating system
        divides by 1024 four times and reports 931. Same bytes, different
        arithmetic. The{" "}
        <Link href="/units/data-converter">data size converter</Link> handles
        both conventions rather than picking one and hoping.
      </p>

      <h3>KiB, MiB and GiB</h3>
      <p>
        The standards bodies did solve this, in 1998. Binary units got their own
        prefixes — <strong>kibi, mebi, gibi</strong>, written KiB, MiB and GiB —
        leaving kB, MB and GB to mean powers of 1000 unambiguously.
      </p>
      <p>
        Adoption has been patchy, which is the polite description. Linux and
        macOS largely comply. Windows still reports GiB while writing
        &ldquo;GB&rdquo;. RAM is universally sold in binary units regardless of
        how it is labelled. So the prefixes exist, they are correct, and you
        still cannot trust a label to be using them.
      </p>

      <h2>Which convention applies where</h2>
      <p>
        There is a pattern, and knowing it resolves most cases without looking
        anything up.
      </p>
      <p>
        <strong>Storage sold to you is decimal.</strong> Drives, SSDs, memory
        cards and phone capacities are quoted in powers of 1000 — which makes the
        number larger, so there is little commercial pressure to change.
      </p>
      <p>
        <strong>Memory is binary.</strong> RAM comes in 8&nbsp;GB and 16&nbsp;GB
        sticks that are really 8 and 16 GiB, because memory addressing is
        physically binary. Nobody makes a 10&nbsp;GB stick.
      </p>
      <p>
        <strong>Networks are decimal, and in bits.</strong> Both conversions
        against you at once: 100&nbsp;Mbps is 100,000,000 bits per second, which
        is about 11.9&nbsp;MiB/s as your download manager would count it.
      </p>

      <h2>What things actually weigh</h2>
      <p>
        A rough sense of scale is more useful than any conversion table. A page
        of plain text is a few kilobytes. A photo from a modern phone is 2 to
        5&nbsp;MB. A minute of music is around 1&nbsp;MB compressed. A minute of
        1080p video is roughly 60&nbsp;to&nbsp;100&nbsp;MB, and 4K several times
        that.
      </p>
      <p>
        The pattern worth internalising: <strong>text is nearly free, images
        cost, and video dominates everything.</strong> Any time a folder is
        unexpectedly large, video or uncompressed images are almost always the
        reason.
      </p>
      <p>
        When something needs to fit under a limit — an email attachment, an
        upload cap — compressing{" "}
        <Link href="/image/compress-image">an image</Link> or{" "}
        <Link href="/pdf/compress-pdf">a PDF</Link> usually gets there without
        visible loss, because both formats leave a great deal of room by default.
      </p>

      <h2>The hidden 33%: Base64</h2>
      <p>
        One size change catches people out because it happens invisibly. Base64
        encoding represents binary data using only text characters, which is what
        lets an image be embedded directly in HTML, CSS or a JSON payload.
      </p>
      <p>
        It costs about <strong>33% extra size</strong>, because every three bytes
        become four characters. A 90&nbsp;KB image becomes roughly 120&nbsp;KB
        once{" "}
        <Link href="/image/image-to-base64">converted to a data URI</Link>, and
        that inflated version is what ships to every visitor.
      </p>
      <p>
        The trade is a saved HTTP request against a larger, uncacheable payload.
        For a tiny icon that is usually worth it; for a photograph it rarely is.
        The same arithmetic applies whenever you{" "}
        <Link href="/developer/base64-encode-decode">encode anything to
        Base64</Link>, which is also why Base64-encoded email attachments are
        larger than the files they carry.
      </p>

      <h2>Reading a size without being misled</h2>
      <p>
        Three habits cover nearly everything. Check the case of the{" "}
        <code>b</code> — bits or bytes changes the answer eightfold. Assume
        storage is decimal and memory is binary unless told otherwise. And when a
        number is 7% or 10% off what you expected, suspect the 1000-versus-1024
        gap before suspecting a fault, because that is almost always what it is.
      </p>
    </>
  );
}
