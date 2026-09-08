/**
 * A sentence or two about each unit: where it comes from, who uses it, and
 * what it is worth knowing about.
 *
 * Written per unit rather than per pair because 110 pair pages built from one
 * template shared 86% of their vocabulary, which is what "near-duplicate" means
 * to a search engine. Composed from two units plus that pair's own formula and
 * worked example, a page now shares wording with another only where they share
 * a unit — and no two pairs share both.
 *
 * Facts, not filler. A sentence that could sit on any of these pages is worse
 * than no sentence, because it adds words without adding a reason to be here.
 */
export const UNIT_NOTES: Record<string, string> = {
  /* ------------------------------------------------------------- length */
  mm: "A millimetre is a thousandth of a metre, and the resolution most engineering drawings and manufacturing tolerances are quoted in — fine enough to matter, coarse enough to measure with a ruler.",
  cm: "The centimetre has no role in engineering, where millimetres and metres do the work, but it is how most of the world states body measurements, paper sizes and furniture.",
  m: "The metre is the SI base unit of length, defined since 1983 by the distance light travels in 1/299,792,458 of a second — a definition that made it reproducible in any laboratory rather than dependent on a bar of metal in Paris.",
  km: "A kilometre is a thousand metres, and the unit road distances and speeds are quoted in almost everywhere except the United States and the United Kingdom.",
  in: "The inch has been exactly 25.4 millimetres since 1959, when the English-speaking countries agreed to stop each defining it slightly differently. Screens, pipes and tyres are still sized in it worldwide.",
  ft: "A foot is twelve inches, or exactly 0.3048 metres. It survives in aviation altitude, US construction and human height, long after the countries around it went metric.",
  yd: "A yard is three feet, kept alive mainly by sport — American football, cricket pitches — and by fabric and garden materials sold by the yard.",
  mi: "The statute mile is 5,280 feet, an awkward number inherited from the Roman thousand paces being reconciled with the English furlong. It is the road unit of the US and UK.",
  nmi: "A nautical mile is 1,852 metres, chosen because it is one minute of latitude — so a chart distance can be read straight off the latitude scale at the side. Ships and aircraft use it, which is also why their speeds are in knots.",

  /* ------------------------------------------------------------- weight */
  mg: "A milligram is a thousandth of a gram, the scale medicine doses and nutritional trace elements are quoted at.",
  g: "The gram is where the metric system began — originally the mass of a cubic centimetre of water — and it is the unit food labels and recipes outside the US are written in.",
  kg: "The kilogram is the SI base unit of mass and the only one that was still defined by a physical object until 2019, when a platinum cylinder near Paris was finally replaced by a definition built on the Planck constant.",
  t: "A tonne is a thousand kilograms, used for vehicles, freight and bulk materials. It is deliberately close to the imperial ton but not equal to it, which is a recurring source of confusion in shipping.",
  oz: "An ounce is a sixteenth of a pound, about 28.35 grams. Note it measures weight — the fluid ounce is a volume and an entirely different quantity that happens to share the name.",
  lb: "The pound is exactly 0.45359237 kilograms by international agreement. It remains the everyday unit of body weight and groceries in the US, and of body weight in the UK.",
  st: "A stone is fourteen pounds, and is essentially only used in Britain and Ireland, for body weight. It is why a British person quotes their weight as two numbers.",

  /* ------------------------------------------------------------- volume */
  ml: "A millilitre is exactly one cubic centimetre, which makes it the unit medicine doses, recipes and small containers are measured in almost everywhere.",
  l: "The litre is a thousand cubic centimetres. It is not an SI unit — the cubic metre is — but it is accepted alongside them because a cubic metre is far too large for everyday liquids.",
  m3: "A cubic metre is a thousand litres, and the unit water is billed in, concrete is ordered in, and shipping volume is quoted in.",
  tsp: "A US teaspoon is 4.93 millilitres, near enough 5 for cooking. Measuring spoons vary between countries, which matters for baking powder and salt far more than for anything measured by the cup.",
  tbsp: "A US tablespoon is three teaspoons, about 14.8 millilitres. The British imperial tablespoon is 17.7 and the Australian is 20 — a full third larger — which is enough to spoil a recipe that leans on it.",
  flozus: "A US fluid ounce is 29.57 millilitres. The imperial fluid ounce is 28.41, so a US pint and a British pint differ by more than the ounce count alone suggests.",
  cup: "A US cup is 240 millilitres, and it measures volume rather than weight — which is why a cup of flour can be anywhere from 120 to 150 grams depending on how it was filled.",
  ptus: "A US pint is 16 US fluid ounces, 473 millilitres. A British pint is 568, which is why the same recipe or the same round of drinks differs noticeably either side of the Atlantic.",
  galus: "A US gallon is 3.785 litres, defined from the old English wine gallon. It is what American fuel economy and fuel prices are quoted against.",
  galuk: "An imperial gallon is 4.546 litres, about 20% larger than the US one. That difference is why miles per gallon figures are not comparable between the two countries without converting.",

  /* --------------------------------------------------------------- area */
  cm2: "A square centimetre is the unit small cross-sections and screen areas are quoted in — a tenth of a millimetre out on each side changes it noticeably, because area goes with the square.",
  m2: "The square metre is how floor area, land and materials are sold nearly everywhere. Doubling a room's width quadruples its area, which is the arithmetic most people get wrong when estimating paint or flooring.",
  ha: "A hectare is 10,000 square metres — a square 100 metres on a side. It is the standard unit of land area outside the English-speaking world, and roughly two and a half acres.",
  km2: "A square kilometre is a hundred hectares, used for regions, cities and countries rather than plots.",
  ft2: "The square foot is how US and UK property is advertised. It is small enough that the numbers get large, which is part of why listings quote it — 2,000 sounds more than 186 square metres.",
  yd2: "A square yard is nine square feet, kept mainly by carpet and turf, which are still sold by the yard in Britain and the US.",
  acre: "An acre was originally the land one man and one ox could plough in a day, which is why it is an odd 4,047 square metres. It survives in farmland and property across the English-speaking world.",
  mi2: "A square mile is 640 acres, the unit US counties and land surveys are measured in.",

  /* -------------------------------------------------------------- speed */
  mps: "Metres per second is the SI unit of speed and the one physics is done in. Multiply by 3.6 to reach kilometres per hour — there are 3,600 seconds in an hour and 1,000 metres in a kilometre.",
  kph: "Kilometres per hour is the road speed unit nearly everywhere, and the one most speedometers show most prominently outside the US and UK.",
  mph: "Miles per hour is the road speed unit of the United States and the United Kingdom, which is why hire cars and imported vehicles often show both scales on the dial.",
  kn: "A knot is one nautical mile per hour. Because a nautical mile is a minute of latitude, a vessel making ten knots covers ten minutes of latitude an hour — a figure readable straight off a chart.",
  fps: "Feet per second appears in ballistics, some engineering and American sport, where the distances involved are short enough that per-hour figures would be unwieldy.",

  /* --------------------------------------------------------------- data */
  b: "A bit is a single one or zero. The lowercase b matters: network speeds are quoted in bits and file sizes in bytes, and the two differ by a factor of eight.",
  B: "A byte is eight bits, and the unit files are measured in. Almost every confusion about download speeds comes from a connection sold in megabits being compared against a download shown in megabytes.",
  KB: "A kilobyte is 1,000 bytes by the decimal definition, though older software and Windows still report 1,024 under the same name — a 2.4% difference that compounds at every step up the scale.",
  KiB: "A kibibyte is exactly 1,024 bytes. The binary prefixes were standardised in 1998 precisely to end the ambiguity, and adoption has been patchy ever since.",
  MB: "A megabyte is a million bytes decimally. Storage is sold this way, which is why a drive always reports less capacity than the box claims once the operating system divides by 1,024 instead.",
  MiB: "A mebibyte is 1,048,576 bytes — 4.9% more than a megabyte. Memory is sized this way regardless of how it is labelled, because addressing is physically binary.",
  GB: "A gigabyte is a billion bytes as sold, which is why a 1 TB drive shows as roughly 931 GB: same bytes, different arithmetic.",
  GiB: "A gibibyte is 1,073,741,824 bytes, 7.4% larger than a gigabyte. Linux and macOS largely report honestly in these; Windows shows gibibytes while writing GB.",
  TB: "A terabyte is a trillion bytes decimally. The gap against the binary equivalent reaches 10% at this scale — the missing 69 GB people notice on a new drive.",
  TiB: "A tebibyte is 1,099,511,627,776 bytes. Storage arrays and filesystems generally work in these even where the marketing does not.",

  /* ----------------------------------------------------------- pressure */
  pa: "The pascal is the SI unit of pressure — one newton per square metre — and it is tiny, roughly the pressure of a sheet of paper resting on a table. Practical figures use kilopascals or larger.",
  kpa: "The kilopascal is the SI working unit for pressure, used for tyre pressures, weather and engineering nearly everywhere outside the United States.",
  mpa: "A megapascal is a million pascals, the scale material strengths and hydraulic systems are quoted at. One megapascal is about 145 psi.",
  bar: "A bar is 100 kilopascals, chosen because it is very close to average atmospheric pressure at sea level. That convenience is why diving, brewing and much of European industry kept it.",
  mbar: "A millibar is a hectopascal by another name, and it is what atmospheric pressure is reported in on weather charts — around 1,013 at sea level.",
  psi: "Pounds per square inch is the everyday pressure unit of the United States, and the one tyre gauges and compressors are marked in even in countries that otherwise went metric.",
  atm: "A standard atmosphere is 101,325 pascals exactly — a defined value rather than a measurement, fixed as a reference point for chemistry and physics.",
  torr: "A torr is one millimetre of mercury, near enough. It survives in vacuum work, where the numbers are small and the historical mercury column is still the intuitive picture.",
  mmhg: "Millimetres of mercury is how blood pressure is reported worldwide, a rare case of a pre-metric unit surviving in medicine because every clinician already reads it fluently.",
  inhg: "Inches of mercury is used for atmospheric pressure in US aviation and weather reporting, where an altimeter setting is quoted as something like 29.92.",

  /* --------------------------------------------------------------- time */
  ms: "A millisecond is a thousandth of a second. Human reaction time is around 200 of them, and a network round trip under 100 feels immediate.",
  s: "The second is the SI base unit of time, defined by 9,192,631,770 oscillations of a caesium-133 atom — which is what makes atomic clocks the reference every other clock is set against.",
  min: "The minute is sixty seconds, an inheritance from Babylonian base-60 arithmetic that survived every attempt at decimal time.",
  h: "An hour is 3,600 seconds. It is not an SI unit but is accepted alongside them, because no amount of standardisation was going to change how people schedule a day.",
  d: "A day is 86,400 seconds by definition, though the Earth's actual rotation drifts slightly — which is why leap seconds are occasionally inserted to keep clocks in step with the planet.",
  wk: "A week is seven days, and unusually among time units it has no astronomical basis at all. It is a convention that happens to be nearly universal.",
  yr: "A year here is 365 days. The actual orbital period is about 365.2422, which is what the leap year rule exists to absorb.",

  /* -------------------------------------------------------------- power */
  mw: "A milliwatt is a thousandth of a watt, the scale of radio transmitters, laser pointers and the standby draw of small electronics.",
  w: "The watt is the SI unit of power — one joule per second. It measures a rate, which is what separates it from the energy units it is often confused with.",
  kw: "A kilowatt is a thousand watts, the unit appliances, motors and electric vehicle charging are rated in. Multiply by hours to get the kilowatt-hours a bill counts.",
  mgw: "A megawatt is a million watts, the scale power stations, wind farms and grid demand are discussed at. A large wind turbine is a few megawatts.",
  hp: "Mechanical horsepower is 745.7 watts, defined by James Watt from the rate a horse could raise a weight — a marketing figure that outlived the machines it was invented to sell against.",
  ps: "Metric horsepower, written PS in Germany and CV in France, is 735.5 watts — about 1.4% smaller than mechanical horsepower. A car quoted at 200 PS is roughly 197 hp.",
  btuh: "BTU per hour is how heating and air conditioning are sized in North America. A 12,000 BTU/h unit is about 3.5 kilowatts, and is often called a one-ton unit from the rate that would melt a ton of ice in a day.",

  /* ------------------------------------------------------------- energy */
  j: "The joule is the SI unit of energy — one watt for one second. Everything else on this scale is defined against it.",
  kj: "A kilojoule is a thousand joules, and the unit food energy is labelled in across Europe and Australia. The numbers look alarming next to Calories only because the unit is smaller.",
  mj: "A megajoule is a million joules. A kilowatt-hour is 3.6 of them, which is a useful anchor when comparing electricity against fuel.",
  cal: "The scientific calorie is 4.184 joules — the energy to warm one gram of water by one degree. It is a thousand times smaller than the Calorie on a food label.",
  kcal: "A kilocalorie is what every nutrition label means by a capital-C Calorie. A 250 Calorie snack is 250 kcal, or about 1,046 kilojoules.",
  wh: "A watt-hour is one watt sustained for an hour, 3,600 joules. Battery capacities are quoted in these, which is why airlines set limits in watt-hours rather than milliamp-hours.",
  kwh: "The kilowatt-hour is the unit your electricity meter counts and your bill is calculated from. A 2 kW heater run for three hours uses 6 of them.",
  btu: "A British thermal unit is the energy to raise a pound of water by one degree Fahrenheit — about 1,055 joules. It survives in heating, gas supply and air conditioning.",

  /* -------------------------------------------------------------- angle */
  rad: "A radian is the angle where the arc length equals the radius. It comes from the circle itself rather than from a decision, which is why calculus formulas for sine and cosine only work cleanly in radians.",
  deg: "The degree divides a circle into 360, a number generally traced to Babylonian base-60 arithmetic and kept because it divides evenly by so much: 2, 3, 4, 5, 6, 8, 9, 10 and 12 among others.",
  grad: "A gradian divides the circle into 400, making a right angle exactly 100. Tidy for surveying, where it originated, and almost unused anywhere else.",
  turn: "A turn is one full revolution. It is the most intuitive unit of all and almost never written down, except in rotational mechanics where revolutions per minute is the everyday measure.",
  arcmin: "An arcminute is a sixtieth of a degree. One minute of latitude is a nautical mile, which is the link between angle and distance that made marine navigation workable.",
  arcsec: "An arcsecond is a sixtieth of an arcminute, and the resolution astronomy works at — the apparent size of a coin seen from several kilometres away.",

  /* -------------------------------------------------------- temperature */
  c: "Celsius sets zero at the freezing point of water and 100 at its boiling point under standard pressure, which is what makes it intuitive for weather and cooking.",
  f: "Fahrenheit puts water's freezing point at 32 and boiling at 212, giving finer gradations without decimals — the reason often given for its persistence in US weather reporting.",
  k: "The kelvin starts at absolute zero, so it has no negative values and no degree symbol. It is the SI base unit, and the one physics and chemistry calculations must use.",
};

/** Whether every unit in a list has a note written for it. */
export function missingNotes(unitIds: string[]): string[] {
  return unitIds.filter((id) => !UNIT_NOTES[id]);
}
