/**
 * The Android apps published under the same name as this site.
 *
 * They are here for two reasons. One is that a couple of them do a job a web
 * page genuinely cannot — the currency converter works with no connection at
 * all, which the browser version cannot promise because it fetches live rates.
 * The other is that a site and a set of published apps under one publisher
 * corroborate each other: the Organization schema names Umer Labs, and the
 * store listings say the same thing from the other side.
 *
 * `relatedTools` is what makes the link useful rather than an advert. A plug on
 * a page about something else is noise; a note about an offline version on the
 * converter that needs a network is an answer to the problem in front of you.
 */
export interface PlayApp {
  /** Play Store package name, which is also its store URL. */
  packageName: string;
  /** Store icon, saved under public/apps rather than hotlinked from Google. */
  icon: string;
  name: string;
  /** One line, shown under the name. */
  tagline: string;
  /** What it does and who it is for. */
  description: string;
  /** Tool slugs where a mention genuinely helps, most relevant first. */
  relatedTools: string[];
  /** The single line shown on those tool pages. */
  crossLink?: string;
}

export const playApps: PlayApp[] = [
  {
    packageName: "com.umerlabs.compressor",
    icon: "/apps/compressor.png",
    name: "Compressor: Video, Image & PDF",
    tagline: "Shrink videos, photos and PDFs without uploading them.",
    description:
      "Pick a file, choose a size, and get a smaller version back. Compression runs on the phone itself, so nothing is uploaded and it works with no connection — the same principle this site is built on, applied to video, which a browser cannot realistically do.",
    relatedTools: ["compress-image", "compress-pdf"],
    crossLink:
      "This handles images and PDFs. For video — which a browser cannot compress at any sensible speed — there is an Android app that does all three on-device, with nothing uploaded.",
  },
  {
    packageName: "com.umerlabs.currencyconverter",
    icon: "/apps/currencyconverter.png",
    name: "Currency Converter Offline",
    tagline: "Convert currencies with no connection at all.",
    description:
      "Rates are downloaded once and kept on the device, so conversions keep working at a foreign ATM, at a border, or anywhere the signal has gone. The web version fetches live rates and needs a network to be accurate, which is exactly the gap this fills.",
    relatedTools: ["currency-converter"],
    crossLink:
      "This tool fetches today's rates, so it needs a connection. If you want conversions that keep working without one, there is an offline Android version.",
  },
  {
    packageName: "com.umerlabs.spinthewheel",
    icon: "/apps/spinthewheel.png",
    name: "Spin The Wheel — Random Picker",
    tagline: "Build a wheel, spin it, let it decide.",
    description:
      "Customisable wheels for whatever needs deciding — a restaurant, a name drawn at random, a class lottery, an argument settled. Wheels are saved, so a list you use often is not retyped every time.",
    relatedTools: ["wheel-spinner", "decision-maker", "random-name-picker", "list-randomizer"],
    crossLink: "There is an Android version that saves your wheels between spins.",
  },
  {
    packageName: "com.umerlabs.fakecall",
    icon: "/apps/fakecall.png",
    name: "Fake Call — Prank Call Dialer",
    tagline: "Make your phone ring exactly when you need it to.",
    description:
      "Schedules a realistic incoming call on a delay, so there is a way out of a meeting that will not end or a conversation that has run long. Also, as the name admits, a decent prank.",
    relatedTools: [],
  },
  {
    packageName: "com.umerlabs.watersort",
    icon: "/apps/watersort.png",
    name: "Water Sort — Color Puzzle",
    tagline: "Pour the colours until each tube holds one.",
    description:
      "Pour coloured water between tubes until every tube holds a single colour. Easy to learn and quietly absorbing, with no timer hurrying you along — the colours stack up fast enough on their own.",
    relatedTools: ["memory-game", "sudoku-generator"],
  },
];

/** The store listing for an app. */
export function playStoreUrl(app: Pick<PlayApp, "packageName">): string {
  return `https://play.google.com/store/apps/details?id=${app.packageName}`;
}

/** The app worth mentioning on a given tool page, if any. */
export function appForTool(slug: string): PlayApp | undefined {
  return playApps.find((app) => app.crossLink && app.relatedTools.includes(slug));
}
