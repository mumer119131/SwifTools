import Link from "next/link";

/** Sizes, grouped by platform. Kept in one place so the tables cannot disagree. */
const PLATFORMS: { name: string; rows: [string, string, string][] }[] = [
  {
    name: "Instagram",
    rows: [
      ["Square post", "1080 × 1080", "1:1"],
      ["Portrait post", "1080 × 1350", "4:5"],
      ["Landscape post", "1080 × 566", "1.91:1"],
      ["Story and Reels", "1080 × 1920", "9:16"],
      ["Profile picture", "320 × 320", "1:1"],
    ],
  },
  {
    name: "X",
    rows: [
      ["Post image", "1600 × 900", "16:9"],
      ["Profile header", "1500 × 500", "3:1"],
      ["Profile picture", "400 × 400", "1:1"],
    ],
  },
  {
    name: "LinkedIn",
    rows: [
      ["Post image", "1200 × 627", "1.91:1"],
      ["Profile banner", "1584 × 396", "4:1"],
      ["Company logo", "300 × 300", "1:1"],
    ],
  },
  {
    name: "Facebook",
    rows: [
      ["Shared link preview", "1200 × 630", "1.91:1"],
      ["Page cover", "1640 × 624", "2.63:1"],
      ["Profile picture", "320 × 320", "1:1"],
    ],
  },
  {
    name: "YouTube",
    rows: [
      ["Thumbnail", "1280 × 720", "16:9"],
      ["Channel art", "2560 × 1440", "16:9"],
      ["Shorts cover", "1080 × 1920", "9:16"],
    ],
  },
  {
    name: "TikTok and Pinterest",
    rows: [
      ["TikTok video cover", "1080 × 1920", "9:16"],
      ["Pinterest standard pin", "1000 × 1500", "2:3"],
      ["Pinterest square pin", "1000 × 1000", "1:1"],
    ],
  },
];

export default function SocialSizesGuide() {
  return (
    <>
      <p>
        Every table of social media sizes on the internet is slightly out of
        date, including this one, because the platforms change them without
        announcing it. What does not change is the reasoning — and if you
        understand that, a stale number costs you nothing.
      </p>

      <h2>Upload bigger than the display size</h2>
      <p>
        The dimensions below are each platform&rsquo;s <em>recommended upload
        size</em>, not the size your image is shown at. Those are different
        numbers, and the gap is deliberate: platforms downscale your upload to
        fit whatever layout and screen density the viewer has.
      </p>
      <p>
        Downscaling looks good. Upscaling does not. So uploading at the
        recommended size and letting the platform shrink it gives a sharper
        result than uploading at the display size and letting it stretch — which
        is why an image that looked crisp on your screen can arrive soft in the
        feed.
      </p>

      <h2>Aspect ratio matters more than pixels</h2>
      <p>
        If you get one thing right, make it the shape. A platform that receives
        an image of the wrong aspect ratio will either crop it — usually from the
        centre, usually through somebody&rsquo;s face — or letterbox it with
        bars. Neither is recoverable after the fact.
      </p>
      <p>
        Pixel dimensions are more forgiving. An image at the right ratio but half
        the recommended size will look slightly soft; an image at the right size
        but the wrong ratio will be visibly wrong.
      </p>

      <h2>The sizes</h2>

      {PLATFORMS.map((platform) => (
        <div key={platform.name} className="mt-8">
          <h3>{platform.name}</h3>
          <div className="mt-3 overflow-x-auto">
            <table className="w-full min-w-[28rem] border-collapse text-sm">
              <thead>
                <tr className="border-b border-border text-left">
                  <th className="py-2 pr-4 font-medium text-foreground">Placement</th>
                  <th className="py-2 pr-4 font-medium text-foreground">Upload at</th>
                  <th className="py-2 font-medium text-foreground">Ratio</th>
                </tr>
              </thead>
              <tbody className="[&_td]:py-2 [&_td]:pr-4 [&_td]:text-muted-foreground [&_tr]:border-b [&_tr]:border-border">
                {platform.rows.map(([placement, size, ratio]) => (
                  <tr key={placement}>
                    <td className="text-foreground">{placement}</td>
                    <td className="font-mono" data-numeric>
                      {size}
                    </td>
                    <td data-numeric>{ratio}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ))}

      <h2>The one that is not a social network</h2>
      <p>
        <strong>1200 × 630</strong> is the Open Graph size — the image that
        appears when your page is shared anywhere at all: Slack, WhatsApp,
        iMessage, Discord, Facebook, LinkedIn. It is the single most valuable
        image size on this list, because it is the one that renders in places you
        have no other presence.
      </p>
      <p>
        If you set only one image on a web page, set that one.
      </p>

      <h2>Cropping without ruining the picture</h2>
      <p>
        The hard part is never the resize, it is the crop. Going from a landscape
        photograph to a 9:16 story means discarding about two thirds of the
        frame, and a centre crop — the default everywhere — routinely takes the
        top off the subject&rsquo;s head.
      </p>
      <ol>
        <li>
          <strong>Start from the largest original you have.</strong> Every crop
          throws pixels away; starting small means finishing smaller.
        </li>
        <li>
          <strong>Shoot or choose with the crop in mind.</strong> Leaving space
          around the subject is what makes one image work in three shapes.
        </li>
        <li>
          <strong>Anchor the crop deliberately.</strong> For anything with a
          person in it, anchoring to the top almost always beats the centre.
        </li>
        <li>
          <strong>Check what survives.</strong> If a crop keeps less than half
          the frame, it is usually the wrong source image rather than the wrong
          crop.
        </li>
      </ol>
      <p>
        The <Link href="/image/social-media-resizer">social media resizer</Link>{" "}
        does all of these at once — every size you tick, cropped to fill rather
        than stretched, with an anchor control and a warning when a crop is
        discarding most of the picture. It runs in your browser, which for
        campaign artwork that has not launched is the only sensible arrangement.
      </p>

      <h2>When these numbers go stale</h2>
      <p>
        They will. Treat the ratios as durable and the pixel counts as a good
        default, and when a platform hands you an exact spec, use theirs. The
        resizer takes custom dimensions for exactly that reason.
      </p>
    </>
  );
}
