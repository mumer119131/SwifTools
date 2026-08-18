import Link from "next/link";

export default function MetricImperialGuide() {
  return (
    <>
      <p>
        Almost every country measures in metric. Three do not, and one of them
        publishes most of the internet — so anyone reading a recipe, buying
        timber or following instructions online ends up converting between the
        two whether they meant to or not.
      </p>

      <h2>The conversions worth memorising</h2>
      <p>
        There are only about eight. Everything else is either rare or close
        enough to estimate.
      </p>
      <div className="mt-6 overflow-x-auto">
        <table className="w-full min-w-[34rem] border-collapse text-sm">
          <thead>
            <tr className="border-b border-border text-left">
              <th className="py-2.5 pr-4 font-medium text-foreground">From</th>
              <th className="py-2.5 pr-4 font-medium text-foreground">Multiply by</th>
              <th className="py-2.5 font-medium text-foreground">In your head</th>
            </tr>
          </thead>
          <tbody className="[&_td]:py-2.5 [&_td]:pr-4 [&_td]:text-muted-foreground [&_tr]:border-b [&_tr]:border-border">
            <tr><td className="text-foreground">Inches → cm</td><td data-numeric>2.54</td><td>Two and a half</td></tr>
            <tr><td className="text-foreground">Feet → metres</td><td data-numeric>0.3048</td><td>Divide by three, take off a bit</td></tr>
            <tr><td className="text-foreground">Miles → km</td><td data-numeric>1.609</td><td>Add 60%</td></tr>
            <tr><td className="text-foreground">Pounds → kg</td><td data-numeric>0.4536</td><td>Halve it, add back 10%</td></tr>
            <tr><td className="text-foreground">Ounces → grams</td><td data-numeric>28.35</td><td>Thirty, near enough</td></tr>
            <tr><td className="text-foreground">US cups → ml</td><td data-numeric>236.6</td><td>About 240</td></tr>
            <tr><td className="text-foreground">Sq feet → sq metres</td><td data-numeric>0.0929</td><td>Divide by eleven</td></tr>
            <tr><td className="text-foreground">°F → °C</td><td>−32, × 5/9</td><td>Subtract 30, halve</td></tr>
          </tbody>
        </table>
      </div>
      <p>
        The mile rule is the neat one: kilometres and miles sit almost exactly
        at the golden ratio, so consecutive Fibonacci numbers convert. 5 miles is
        about 8 km, 8 miles about 13, 13 about 21. Accurate to under 1%.
      </p>

      <h2>Three that catch people out</h2>

      <h3>A US gallon is not a UK gallon</h3>
      <p>
        This is the big one. A US gallon is 3.79 litres; an imperial gallon is
        4.55 — about 20% larger. The same split runs through every volume unit
        derived from them: pints, quarts and fluid ounces all differ.
      </p>
      <ul>
        <li><strong>US pint</strong> — 473 ml. <strong>UK pint</strong> — 568 ml.</li>
        <li><strong>US fluid ounce</strong> — 29.6 ml. <strong>UK fluid ounce</strong> — 28.4 ml.</li>
      </ul>
      <p>
        Note the fluid ounces run the other way round: the US one is
        <em> larger</em> even though the US pint is smaller, because a US pint is
        16 fl oz and a UK pint is 20. Miles per gallon figures are not comparable
        between the two countries for the same reason.
      </p>

      <h3>Weight ounces and fluid ounces are unrelated</h3>
      <p>
        An ounce is a mass; a fluid ounce is a volume. They share a name for
        historical reasons and converting between them requires knowing what the
        substance is. For water they happen to be close, which is why the
        confusion survives — for flour or oil they are not.
      </p>

      <h3>A US cup is a defined volume, not a cup</h3>
      <p>
        236.6 ml, and it measures volume even when the recipe is listing flour.
        That is the root of most baking failures across the divide: a cup of
        flour is anywhere between 120g and 150g depending on how it was packed,
        while 130g is 130g. Where a recipe gives weights, use them.{" "}
        <Link href="/home/cooking-measurement-converter">Converting cups to grams</Link>{" "}
        has to be done per ingredient, which is why a single conversion factor
        does not exist.
      </p>

      <h2>Temperature is the one with an offset</h2>
      <p>
        Every other conversion here is a multiplication. Temperature is not,
        because the scales do not share a zero — so you cannot convert a
        temperature <em>difference</em> the same way you convert a temperature.
        A rise of 10°C is a rise of 18°F, not 50°F.
      </p>
      <p>
        Worth knowing: −40 is the same in both, and 16°C is about 61°F while
        61°C is about 142°F — the digits swapping at 16/61 is a coincidence that
        has misled more than one person into thinking there is a trick.
      </p>

      <h2>Why two systems still exist</h2>
      <p>
        Metric won on merit: everything scales by ten, the units are defined
        against physical constants rather than a king&rsquo;s body, and there is
        one of each. The imperial units persist because changing them is
        expensive in ways that are not obvious — road signs, machine tooling,
        pipe fittings, timber sizes, and an enormous quantity of technical
        documentation that would all have to move together.
      </p>
      <p>
        The UK sits in the middle and stayed there: road distances in miles,
        beer in pints, milk in pints, but fuel in litres, food in grams and
        weather in Celsius. Anyone finding that inconsistent is right.
      </p>

      <h2>The unit that has caused an actual disaster</h2>
      <p>
        In 1999 the Mars Climate Orbiter was lost because one team supplied
        thrust figures in pound-force seconds and the receiving software expected
        newton-seconds. The spacecraft came in about 170 km too low and broke up.
        It cost roughly $327 million, and the fix would have been a single
        multiplication.
      </p>
      <p>
        The lesson is not that imperial is bad. It is that a number without its
        unit attached is not information, and every conversion is a place for an
        assumption to go unstated.
      </p>

      <h2>Converting</h2>
      <p>
        The <Link href="/units/unit-converter">unit converter</Link> handles
        everything here, and there are direct pages for the conversions people
        look up most — <Link href="/units/lb-to-kg">pounds to kilograms</Link>,{" "}
        <Link href="/units/kg-to-lb">kilograms to pounds</Link>,{" "}
        <Link href="/units/cm-to-inches">centimetres to inches</Link>,{" "}
        <Link href="/units/celsius-to-fahrenheit">Celsius to Fahrenheit</Link> —
        each showing the formula rather than only the answer, so you can check
        the arithmetic instead of trusting it.
      </p>
      <p>
        For a specific dimension there are dedicated converters for{" "}
        <Link href="/units/length-converter">length</Link>,{" "}
        <Link href="/units/weight-converter">weight</Link>,{" "}
        <Link href="/units/volume-converter">volume</Link>,{" "}
        <Link href="/units/area-converter">area</Link>,{" "}
        <Link href="/units/temperature-converter">temperature</Link> and{" "}
        <Link href="/units/speed-converter">speed</Link>.
      </p>
    </>
  );
}
