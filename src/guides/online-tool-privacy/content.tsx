import Link from "next/link";

import { browsableTools } from "@/config/tools";

/**
 * The privacy guide.
 *
 * The one piece of writing on the site that is genuinely about the site. It
 * avoids "trust us" entirely — every claim here is one the reader can verify
 * from their own browser in under a minute, which is the only kind of privacy
 * claim worth making.
 */
export default function OnlineToolPrivacyGuide() {
  const clientSide = browsableTools.filter((tool) => tool.processing === "client").length;

  return (
    <>
      <p>
        You have a contract to sign, a passport scan to shrink, a bank statement
        to convert. You search for a free tool, drag the file in, and get your
        result back a few seconds later. The question nobody asks at that moment
        is the one that matters: <strong>where did the file just go?</strong>
      </p>

      <h2>Two completely different architectures</h2>
      <p>
        Online tools split into two kinds, and they are not distinguishable from
        the outside. The interface looks identical either way.
      </p>

      <h3>Server-side: your file is uploaded</h3>
      <p>
        The page sends your file over the network to a machine you know nothing
        about. It is processed there and the result is sent back. From the moment
        the upload completes, the file exists on hardware you do not control, run
        by a company you have not checked, in a country you did not choose.
      </p>
      <p>What happens to it next depends entirely on the operator&rsquo;s honesty:</p>
      <ul>
        <li>It sits in a temporary directory until some cleanup job runs — hours, or never.</li>
        <li>It is backed up, because production servers usually are.</li>
        <li>It passes through a CDN or proxy that logs and caches.</li>
        <li>It is retained deliberately — for &ldquo;quality improvement&rdquo;, or as training data.</li>
      </ul>
      <p>
        A privacy policy saying &ldquo;files are deleted after one hour&rdquo; is
        a promise, not a mechanism. You cannot verify it, and it does not survive
        a breach, an acquisition, or a subpoena.
      </p>

      <h3>Client-side: the file never leaves</h3>
      <p>
        The page loads a program into your browser, and that program does the
        work on your own machine. The file is read from disk by the page itself,
        processed in memory, and written back out. Nothing is transmitted, so
        there is nothing to retain, log, cache or leak.
      </p>
      <p>
        This is not a policy. It is an absence of the capability, and that is a
        much stronger guarantee than any promise.
      </p>

      <h2>Why doesn&rsquo;t everyone do it this way?</h2>
      <p>
        Partly history — browsers only became capable enough fairly recently, and
        a lot of these sites are older than that. Partly economics: if the file
        is on your server you can build a business around it, meter it, require
        an account for it.
      </p>
      <p>
        And partly because some things genuinely cannot be done in a browser. A
        live currency rate has to come from somewhere. A video platform&rsquo;s
        thumbnail lives on their servers, not yours. Those are honest exceptions.
        Converting a PDF to images is not one of them.
      </p>

      <h2>How to tell which you are using</h2>
      <p>
        You do not have to take anyone&rsquo;s word for it, including ours. Open
        your browser&rsquo;s developer tools — <code>F12</code>, or Cmd+Option+I
        on a Mac — and click the Network tab. Then use the tool.
      </p>
      <ol>
        <li>
          <strong>Watch for a large upload.</strong> A request carrying your
          file&rsquo;s worth of data is unmistakable: sort by size and it will be
          at the top. If your 8MB PDF produced an 8MB request, it was uploaded.
        </li>
        <li>
          <strong>Try it offline.</strong> Load the page, disconnect from the
          internet, then use the tool. If it still works, the work is happening
          on your machine — it cannot be anywhere else.
        </li>
      </ol>
      <p>
        The offline test is the definitive one. It cannot be faked, and it takes
        about fifteen seconds.
      </p>

      <h2>Other signals worth noticing</h2>
      <ul>
        <li>
          <strong>A progress bar that scales with your connection</strong> rather
          than your file size means uploading.
        </li>
        <li>
          <strong>&ldquo;We&rsquo;ll email you the file&rdquo;</strong> means it
          is on a server, and now so is your address.
        </li>
        <li>
          <strong>An account requirement to download your own result</strong> is
          a business model, not a technical need.
        </li>
        <li>
          <strong>A file size limit</strong> usually means server-side —
          in-browser processing is limited by your own memory, not their disk
          quota.
        </li>
      </ul>

      <h2>Where this actually matters</h2>
      <p>
        For a holiday photo, honestly, it does not. The reason to care is what
        people actually put through these tools:
      </p>
      <ul>
        <li>Signed contracts and NDAs</li>
        <li>Passport and identity scans, for visa and job applications</li>
        <li>Bank statements, for mortgage and rental applications</li>
        <li>Medical letters and test results</li>
        <li>Unreleased designs, screenshots of internal systems, draft filings</li>
      </ul>
      <p>
        If your employer has a policy about where company documents may be sent,
        an online converter is squarely covered by it — and it is the kind of
        thing that is only noticed afterwards.
      </p>
      <p>
        Photographs deserve a specific mention, because they carry more than they
        appear to. A photo from a phone usually records the exact coordinates
        where it was taken. You can{" "}
        <Link href="/image/exif-viewer">see what yours contain and strip it</Link>{" "}
        — and note that a tool asking you to upload a photo in order to remove
        its location data has already done the thing you were trying to prevent.
      </p>

      <h2>How this site is built</h2>
      <p>
        {clientSide} of the {browsableTools.length} tools here run entirely in
        your browser. The remaining {browsableTools.length - clientSide} need
        something a browser genuinely cannot do alone, and those pages say so at
        the top rather than in a policy.
      </p>
      <p>
        Please do not take that on trust. Open the Network tab, or pull the
        cable. That is the point of building it this way.
      </p>
    </>
  );
}
