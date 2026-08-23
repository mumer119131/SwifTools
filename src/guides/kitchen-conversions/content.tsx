import Link from "next/link";

export default function KitchenConversionsGuide() {
  return (
    <>
      <p>
        Most recipe disasters are conversion problems wearing a chef&rsquo;s hat.
        A cup is not a unit of weight, a fan oven is not the temperature on the
        dial, and doubling a recipe does not double the cooking time. Each of
        those catches people who can cook perfectly well.
      </p>

      <h2>Cups measure space, not substance</h2>
      <p>
        This is the one that ruins baking. A cup is a <strong>volume</strong> —
        about 240&nbsp;ml. What that weighs depends entirely on what you put in
        it, and on how you put it there.
      </p>
      <p>
        A cup of water is 240&nbsp;g. A cup of granulated sugar is around
        200&nbsp;g. A cup of plain flour is somewhere between 120 and 150&nbsp;g
        depending on whether it was scooped, spooned or sifted — and that spread
        is up to 25% of the flour in the recipe. In bread or cake, where the ratio
        of flour to liquid decides the entire result, that is the difference
        between a good loaf and a brick.
      </p>
      <p>
        <strong>For baking, weigh things.</strong> Kitchen scales remove the
        problem completely, which is why nearly every professional and European
        recipe is written by weight. For cooking, where a bit more onion harms
        nothing, cups are fine. The{" "}
        <Link href="/home/cooking-measurement-converter">cooking measurement
        converter</Link> handles the per-ingredient densities rather than
        pretending one number fits all.
      </p>
      <p>
        Two smaller traps live here too. American and British tablespoons differ —
        15&nbsp;ml against 17.7&nbsp;ml for the old imperial one — and Australian
        tablespoons are 20&nbsp;ml, a full third larger. And a US pint is
        473&nbsp;ml where an imperial pint is 568&nbsp;ml, so a recipe calling for
        a pint of stock means noticeably different amounts either side of the
        Atlantic.
      </p>

      <h2>Oven temperatures, and the fan adjustment</h2>
      <p>
        The common conversions are worth knowing by heart: 180&nbsp;&deg;C is
        350&nbsp;&deg;F is gas mark 4, and that is the default for most baking.
        200&nbsp;&deg;C is 400&nbsp;&deg;F is gas mark 6. 160&nbsp;&deg;C is
        325&nbsp;&deg;F is gas mark 3.
      </p>
      <p>
        <strong>A fan oven runs hotter than the number suggests.</strong> Moving
        air transfers heat faster, so the standard adjustment is to set a fan oven
        about 20&nbsp;&deg;C below a conventional recipe — 180&nbsp;&deg;C
        conventional becomes 160&nbsp;&deg;C fan. Ignoring this is why things
        brown too fast on the outside while staying raw in the middle.
      </p>
      <p>
        Gas marks are their own scale, not linear with either Celsius or
        Fahrenheit, so they have to be looked up rather than calculated. The{" "}
        <Link href="/home/oven-temperature-converter">oven temperature
        converter</Link> covers all four, including the fan adjustment.
      </p>
      <p>
        Worth knowing regardless: most domestic ovens are out by 10 to
        20&nbsp;degrees, and many drift further with age. An oven thermometer
        costs very little and is the only way to find out what your oven actually
        does.
      </p>

      <h2>Scaling a recipe: what changes and what does not</h2>
      <p>
        Ingredients scale linearly. Double everything and you have twice the
        mixture. The{" "}
        <Link href="/home/recipe-scaler">recipe scaler</Link> does the arithmetic
        including the awkward fractions.
      </p>
      <p>
        Three things do <strong>not</strong> scale, and this is where doubled
        recipes go wrong.
      </p>
      <p>
        <strong>Cooking time.</strong> A cake twice the size does not take twice
        as long; it takes somewhat longer, because heat has to travel further
        inward while the surface is already cooking. Doubling the time burns the
        outside. Add a modest amount and test for doneness rather than trusting
        the clock.
      </p>
      <p>
        <strong>Pan size.</strong> Tins scale by <em>area</em>, not by width. A
        20&nbsp;cm round tin has roughly 314&nbsp;cm² of base; a 25&nbsp;cm one has
        491&nbsp;cm² — a 25% wider tin holds about 56% more. Doubling a recipe
        needs a tin with double the area, which is only about 40% wider.
      </p>
      <p>
        <strong>Strong seasonings.</strong> Salt scales, but chilli, spices and
        raising agents often do not scale cleanly, and a doubled quantity of
        baking powder can leave a metallic taste. Scale them, then taste.
      </p>

      <h2>Roasting times and the only reliable test</h2>
      <p>
        Roasting times are usually quoted per unit of weight, plus a fixed extra —
        something like 20 minutes per 500&nbsp;g plus 20 minutes. That gets you
        into the right region, and no further.
      </p>
      <p>
        <strong>Internal temperature is the only thing that actually tells you
        when meat is done.</strong> Weight-based timings assume a shape, a
        starting temperature and an accurate oven, and all three vary. A thermometer
        in the thickest part, away from bone, settles it — and resting matters too,
        since a large roast keeps rising several degrees after it leaves the oven.
      </p>
      <p>
        The <Link href="/home/cooking-time-calculator">cooking time
        calculator</Link> gives both the estimate and the target internal
        temperatures. Use the first to plan the meal and the second to decide when
        it is ready.
      </p>
    </>
  );
}
