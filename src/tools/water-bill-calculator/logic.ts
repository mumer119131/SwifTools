export interface UsageLine {
  id: string;
  label: string;
  gallons: number;
  perDay: number;
  share: number;
}

export interface WaterEstimate {
  lines: UsageLine[];
  gallonsPerDay: number;
  gallonsPerMonth: number;
  perPersonPerDay: number;
  billPerMonth: number;
  billPerYear: number;
  litresPerDay: number;
}

/**
 * Typical fixture volumes in US gallons.
 *
 * A post-1994 US toilet is 1.6 gallons per flush by law; older ones are 3.5 or
 * more, which is why an old bathroom can double this estimate.
 */
export const FIXTURES = {
  showerPerMinute: 2.1,
  bathFill: 36,
  toiletFlush: 1.6,
  toiletFlushOld: 3.5,
  dishwasherCycle: 4,
  handWashDishes: 8,
  laundryLoad: 25,
  laundryLoadHE: 14,
  faucetPerMinute: 1.5,
  outdoorPerMinute: 10,
} as const;

/** A tap dripping once a second wastes roughly this much per day. */
export const DRIP_GALLONS_PER_DAY = 5;

export interface WaterInputs {
  people: number;
  showerMinutes: number;
  showersPerDay: number;
  toiletFlushes: number;
  oldToilets: boolean;
  laundryPerWeek: number;
  highEfficiencyWasher: boolean;
  dishwasherPerWeek: number;
  faucetMinutes: number;
  outdoorMinutesPerWeek: number;
  drippingTaps: number;
  ratePer1000Gal: number;
}

/**
 * Household water use, broken down by fixture.
 *
 * Weekly figures are divided by 7 rather than modelled per day, because nobody
 * does exactly one seventh of a load of laundry — the average is what the bill
 * sees.
 */
export function estimate(inputs: WaterInputs): WaterEstimate {
  const people = Math.max(1, inputs.people);

  const raw: { id: string; label: string; gallons: number }[] = [
    {
      id: "shower",
      label: "Showers",
      gallons:
        Math.max(0, inputs.showerMinutes) *
        FIXTURES.showerPerMinute *
        Math.max(0, inputs.showersPerDay) *
        people,
    },
    {
      id: "toilet",
      label: "Toilet",
      gallons:
        Math.max(0, inputs.toiletFlushes) *
        (inputs.oldToilets ? FIXTURES.toiletFlushOld : FIXTURES.toiletFlush) *
        people,
    },
    {
      id: "laundry",
      label: "Laundry",
      gallons:
        (Math.max(0, inputs.laundryPerWeek) *
          (inputs.highEfficiencyWasher ? FIXTURES.laundryLoadHE : FIXTURES.laundryLoad)) /
        7,
    },
    {
      id: "dishes",
      label: "Dishwasher",
      gallons: (Math.max(0, inputs.dishwasherPerWeek) * FIXTURES.dishwasherCycle) / 7,
    },
    {
      id: "faucet",
      label: "Taps and sinks",
      gallons: Math.max(0, inputs.faucetMinutes) * FIXTURES.faucetPerMinute * people,
    },
    {
      id: "outdoor",
      label: "Outdoor and garden",
      gallons:
        (Math.max(0, inputs.outdoorMinutesPerWeek) * FIXTURES.outdoorPerMinute) / 7,
    },
    {
      id: "leaks",
      label: "Dripping taps",
      gallons: Math.max(0, inputs.drippingTaps) * DRIP_GALLONS_PER_DAY,
    },
  ];

  const gallonsPerDay = raw.reduce((sum, line) => sum + line.gallons, 0);
  const gallonsPerMonth = gallonsPerDay * 30.436875;

  const lines: UsageLine[] = raw
    .map((line) => ({
      ...line,
      perDay: line.gallons,
      share: gallonsPerDay > 0 ? (line.gallons / gallonsPerDay) * 100 : 0,
    }))
    .sort((a, b) => b.gallons - a.gallons);

  const rate = Math.max(0, inputs.ratePer1000Gal);

  return {
    lines,
    gallonsPerDay,
    gallonsPerMonth,
    perPersonPerDay: gallonsPerDay / people,
    billPerMonth: (gallonsPerMonth / 1000) * rate,
    billPerYear: ((gallonsPerDay * 365.2425) / 1000) * rate,
    litresPerDay: gallonsPerDay * 3.785411784,
  };
}
