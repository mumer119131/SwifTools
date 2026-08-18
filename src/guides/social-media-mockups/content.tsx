import Link from "next/link";

/**
 * The mockup guide.
 *
 * Written carefully. The tools it covers produce convincing images of posts
 * that were never made, and a guide about them that ignored the misuse would be
 * a guide about making misinformation. The legitimate uses are real and worth
 * serving well; the line is drawn plainly rather than hinted at.
 */
export default function SocialMediaMockupsGuide() {
  return (
    <>
      <p>
        Designers and marketers fake social posts constantly, and almost always
        for dull, legitimate reasons: showing what a campaign will look like
        before it runs, filling a portfolio page with something other than
        placeholder grey, illustrating a support article, building a slide that
        needs a recognisable shape rather than a wall of text.
      </p>
      <p>
        A mockup is a <strong>drawing of an interface</strong>, in the same way
        an architect&rsquo;s render is a drawing of a building. It is a useful
        thing to be able to make, and there is a line — a clear one — where it
        stops being that.
      </p>

      <h2>The line</h2>
      <p>
        A mockup becomes something else the moment it is presented as a record of
        something that happened. Putting words in a named person&rsquo;s mouth
        and circulating it as real is not a design exercise; depending on where
        you are and who you targeted, it is defamation, harassment, or fraud, and
        it is treated as such by platforms and by courts.
      </p>
      <p>The practical test is simple and worth applying honestly:</p>
      <ul>
        <li>
          <strong>Fine:</strong> invented names and handles, your own brand, a
          fictional user, obviously fictional content, anything clearly labelled
          as an illustration.
        </li>
        <li>
          <strong>Not fine:</strong> a real person&rsquo;s name and photograph
          attached to words they did not say, presented without qualification —
          especially a public figure, a competitor, or someone you are in a
          dispute with.
        </li>
      </ul>
      <p>
        &ldquo;It was obviously a joke&rdquo; is not a defence that survives a
        screenshot being reshared without the context that made it obvious. If
        the image would mislead someone who saw it alone, assume it will.
      </p>

      <h2>What makes a mockup read as real</h2>
      <p>
        For legitimate work the goal is <em>plausibility</em> — a viewer should
        recognise the format instantly and not be distracted by details that are
        wrong. Most mockups fail on the same handful of things.
      </p>

      <h3>Numbers that do not hang together</h3>
      <p>
        This is the one people notice without knowing why. Engagement follows
        rough proportions: on most platforms likes far exceed replies, replies
        exceed reposts, and view counts dwarf all of them. A post with 40 likes
        and 900 replies looks wrong immediately, even to someone who has never
        thought about it.
      </p>
      <p>
        Round numbers are the other tell. Real counts are 1,247 and 38.2K, not
        1,000 and 50K.
      </p>

      <h3>Timestamps that contradict the content</h3>
      <p>
        A post about an evening event timestamped 4am, or replies dated before
        the post they answer. If the mockup shows a thread, keep the ordering
        sane.
      </p>

      <h3>Text that is too clean</h3>
      <p>
        Real posts have inconsistent capitalisation, the occasional missing
        apostrophe, and line breaks in awkward places. Perfectly punctuated copy
        set in the exact centre of the frame reads as marketing, which is
        precisely what a mockup is usually trying not to look like.
      </p>

      <h3>The wrong crop</h3>
      <p>
        Every platform has a shape. A square Instagram post in a 16:9 frame with
        white bars either side undermines the illusion before anyone reads a
        word. <Link href="/guides/social-media-image-sizes">The size guide</Link>{" "}
        has the current dimensions.
      </p>

      <h2>Making them</h2>
      <p>
        For a post,{" "}
        <Link href="/social/tweet-generator">the tweet generator</Link> and{" "}
        <Link href="/social/instagram-post-generator">the Instagram post
        generator</Link> render the layout with the counts and timestamps you
        set. <Link href="/social/tweet-to-image">Turning a real post into an
        image</Link> is a different job and often the better one — if the quote
        is genuine, screenshot the genuine thing.
      </p>
      <p>
        For conversations,{" "}
        <Link href="/social/whatsapp-chat-generator">WhatsApp</Link> and{" "}
        <Link href="/social/imessage-chat-generator">iMessage</Link> mockups are
        the standard way to illustrate a support flow or a tutorial without
        exposing a real thread — which is worth doing even when you have one,
        because real screenshots leak names, avatars and phone numbers that are
        tedious to redact properly.
      </p>

      <h2>Two practical notes</h2>
      <ul>
        <li>
          <strong>Label it in the surrounding copy, not in the image.</strong> A
          watermark can be cropped off; a caption in your article travels with
          the context. For anything public-facing, both.
        </li>
        <li>
          <strong>Interfaces change.</strong> A mockup of last year&rsquo;s
          layout dates a deck faster than the content does. If it is going in
          something long-lived, check it against the app.
        </li>
      </ul>

      <p>
        All of these render in your browser, so drafts of unlaunched campaigns
        stay on your machine.
      </p>
    </>
  );
}
