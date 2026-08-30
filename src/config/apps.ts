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
    packageName: "com.umerlabs.currencyconverter",
    name: "Currency Converter Offline",
    tagline: "Convert currencies with no connection at all.",
    description:
      "Rates are stored on the device, so conversions keep working on a plane, on a foreign SIM, or anywhere the signal has gone. The web version on this site fetches live rates and needs a connection to do it, which is exactly the gap this fills.",
    relatedTools: ["currency-converter"],
    crossLink:
      "This tool needs a connection to fetch today's rates. If you want conversions that keep working without one, there is an offline Android version.",
  },
  {
    packageName: "com.umerlabs.spinthewheel",
    name: "Spin The Wheel — Random Picker",
    tagline: "A spinning wheel for decisions and draws.",
    description:
      "Put in the options, spin, and let it choose. Useful for picking a winner, settling an argument, or deciding what to eat, with your lists saved between spins rather than retyped each time.",
    relatedTools: ["wheel-spinner", "decision-maker", "random-name-picker", "list-randomizer"],
    crossLink: "There is an Android version of this that keeps your lists between spins.",
  },
  {
    packageName: "com.umerlabs.watersort",
    name: "Water Sort — Color Puzzle",
    tagline: "Pour the colours until each tube holds one.",
    description:
      "A colour-sorting puzzle: pour between tubes until every tube holds a single colour. Plays offline, one level at a time, with no timer to rush you.",
    relatedTools: ["memory-game", "sudoku-generator"],
  },
  {
    packageName: "com.umerlabs.fakecall",
    name: "Fake Call — Prank Call Dialer",
    tagline: "Schedule a convincing incoming call.",
    description:
      "Sets up a realistic incoming call on a delay, so your phone rings when you want it to. Handy for stepping out of a conversation that has run long, and for the prank it is named after.",
    relatedTools: [],
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
