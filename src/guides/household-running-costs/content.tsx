import Link from "next/link";

export default function HouseholdRunningCostsGuide() {
  return (
    <>
      <p>
        Working out what something costs to run is nearly always the same
        calculation: find the rate, find the quantity, multiply. The difficulty is
        that utilities quote rates in units nobody uses conversationally, and hide
        a fixed charge underneath that has nothing to do with how much you use.
      </p>

      <h2>Electricity: one equation, two charges</h2>
      <p>
        Electricity is billed in <strong>kilowatt-hours</strong>. A kWh is a
        kilowatt sustained for an hour, so a 2&nbsp;kW heater running for three
        hours uses 6&nbsp;kWh, whatever it achieves in the room.
      </p>
      <p>
        The formula is just <code>kWh = watts &divide; 1000 &times; hours</code>,
        then multiply by your unit rate. A 60&nbsp;W bulb left on all day uses
        1.44&nbsp;kWh; a 3&nbsp;kW kettle boiling for three minutes uses
        0.15&nbsp;kWh. The <Link href="/home/electricity-cost-calculator">electricity
        cost calculator</Link> does this per appliance, per day or per year.
      </p>
      <p>
        <strong>The standing charge is separate.</strong> Most tariffs add a fixed
        daily amount regardless of usage, which is why a bill is never zero even
        for an empty house — and why comparing tariffs on unit rate alone is
        misleading. A low unit rate with a high standing charge can cost more if
        you use little.
      </p>

      <h3>What the label on the appliance actually means</h3>
      <p>
        The wattage printed on a device is normally its <em>maximum</em> draw, not
        its average. This matters most for anything that cycles. A fridge rated at
        150&nbsp;W does not draw 150&nbsp;W continuously — its compressor runs
        perhaps a third of the time, so the real figure is far lower than
        multiplying by 24 suggests.
      </p>
      <p>
        Heating elements are the honest ones: kettles, toasters, immersion heaters
        and electric heaters draw close to their rating whenever they are on. As a
        rule, <strong>anything that makes heat is expensive to run and anything
        with a chip in it is not</strong>. Standby power is real but small — worth
        tidying up, not worth agonising over.
      </p>
      <p>
        If you are comparing figures quoted in different units — joules,
        BTU, kilowatt-hours — the{" "}
        <Link href="/units/energy-converter">energy converter</Link> and{" "}
        <Link href="/units/power-converter">power converter</Link> handle the
        translation.
      </p>

      <h2>Water, where the pricing model matters more than the usage</h2>
      <p>
        Water is billed one of two ways, and which one you are on changes what is
        worth doing.
      </p>
      <p>
        <strong>Metered</strong> billing charges for what you use, usually per
        cubic metre — 1,000 litres, which is more than it sounds. There is often a
        separate charge for wastewater on top, calculated from the same reading,
        so a litre saved can save twice.
      </p>
      <p>
        <strong>Unmetered</strong> billing charges a fixed amount based on the
        property rather than usage. On an unmetered bill, using less water saves
        nothing at all — the case for saving it is environmental rather than
        financial.
      </p>
      <p>
        For scale: a typical shower uses somewhere around 10&nbsp;litres a minute,
        a bath 80&nbsp;litres or so, and a dripping tap can waste several thousand
        litres a year without ever looking dramatic. The{" "}
        <Link href="/home/water-bill-calculator">water bill calculator</Link>{" "}
        works from household habits rather than asking you to guess a total.
      </p>

      <h2>Solar: payback is about what you use, not what you generate</h2>
      <p>
        Solar payback is system cost divided by annual saving, and the saving is
        where the reasoning usually goes wrong.
      </p>
      <p>
        Electricity you generate and use yourself saves you the full retail rate.
        Electricity you export is bought back at a much lower one — often a
        fraction of what you pay to buy it. So{" "}
        <strong>the same panels save very different amounts depending on when you
        use power</strong>. A household that is out all day and cooks at night
        exports most of what it makes; one that runs the washing machine at
        midday keeps far more of the value.
      </p>
      <p>
        That is also the real argument for a battery: it shifts generation into
        the evening, converting cheap exports into avoided expensive imports. The{" "}
        <Link href="/home/solar-savings-calculator">solar savings
        calculator</Link> works through payback from system cost, generation and
        the share you actually consume.
      </p>

      <h2>The costs that are easy to miss</h2>
      <p>
        Subscriptions are the clearest example of a bill that grows without any
        single decision to make it grow. Each one is individually small and
        monthly, which is exactly why the total surprises people — the right unit
        to think in is the annual one. The{" "}
        <Link href="/home/subscription-tracker">subscription tracker</Link>{" "}
        normalises monthly and yearly plans onto the same basis.
      </p>
      <p>
        Driving has the same shape. Fuel cost for a journey is distance divided by
        efficiency times price, and the{" "}
        <Link href="/calculator/fuel-cost-calculator">fuel cost
        calculator</Link> handles both mpg and litres per 100&nbsp;km so you can
        compare a route, or a car, without converting first.
      </p>
      <p>
        And in a shop, the only honest comparison between two sizes is price per
        unit — packaging is designed to make that hard, and the larger box is not
        reliably cheaper per gram. The{" "}
        <Link href="/home/unit-price-calculator">unit price calculator</Link>{" "}
        settles it in a couple of taps.
      </p>

      <h2>Where the money actually is</h2>
      <p>
        If you only do one thing: <strong>heating, hot water and anything else
        that turns electricity into heat dominate a household bill.</strong>{" "}
        Lighting and electronics are usually a rounding error beside them. Time
        spent on the thermostat, the hot water schedule and insulation is worth
        more than time spent unplugging chargers — and it is worth measuring
        rather than guessing, because intuition about which appliances are
        expensive is reliably wrong.
      </p>
    </>
  );
}
