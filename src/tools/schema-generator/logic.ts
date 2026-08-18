export type SchemaType = "Article" | "FAQPage" | "Product" | "LocalBusiness" | "Organization" | "Event" | "Recipe" | "BreadcrumbList";

export interface Field {
  key: string;
  label: string;
  required: boolean;
  hint?: string;
  placeholder?: string;
  multiline?: boolean;
  /** Repeating fields collect a list, one entry per line. */
  list?: boolean;
  /** Paired fields, for FAQ questions and answers. */
  pairs?: boolean;
}

export const SCHEMAS: { id: SchemaType; label: string; note: string; fields: Field[] }[] = [
  {
    id: "Article",
    label: "Article",
    note: "Blog posts and news. Powers the headline and date shown beside a result.",
    fields: [
      { key: "headline", label: "Headline", required: true, hint: "Under 110 characters, or Google truncates it." },
      { key: "description", label: "Description", required: false, multiline: true },
      { key: "author", label: "Author name", required: true },
      { key: "datePublished", label: "Published", required: true, placeholder: "2026-08-18" },
      { key: "dateModified", label: "Last modified", required: false, placeholder: "2026-08-18" },
      { key: "image", label: "Image URL", required: false, hint: "At least 1200px wide for a large result thumbnail." },
      { key: "publisher", label: "Publisher", required: false },
    ],
  },
  {
    id: "FAQPage",
    label: "FAQ",
    note: "Questions and answers. Only mark up content actually visible on the page.",
    fields: [
      { key: "faq", label: "Questions and answers", required: true, pairs: true, hint: "One per block: the question, then the answer." },
    ],
  },
  {
    id: "Product",
    label: "Product",
    note: "Price, availability and rating in the result.",
    fields: [
      { key: "name", label: "Product name", required: true },
      { key: "description", label: "Description", required: false, multiline: true },
      { key: "image", label: "Image URL", required: false },
      { key: "brand", label: "Brand", required: false },
      { key: "sku", label: "SKU", required: false },
      { key: "price", label: "Price", required: true, placeholder: "29.99" },
      { key: "currency", label: "Currency", required: true, placeholder: "GBP" },
      { key: "availability", label: "Availability", required: false, placeholder: "InStock" },
      { key: "ratingValue", label: "Rating", required: false, placeholder: "4.6", hint: "Only if the rating is real and shown on the page." },
      { key: "reviewCount", label: "Review count", required: false, placeholder: "128" },
    ],
  },
  {
    id: "LocalBusiness",
    label: "Local business",
    note: "Address, hours and phone for a physical location.",
    fields: [
      { key: "name", label: "Business name", required: true },
      { key: "description", label: "Description", required: false, multiline: true },
      { key: "street", label: "Street address", required: true },
      { key: "city", label: "City", required: true },
      { key: "region", label: "Region or county", required: false },
      { key: "postcode", label: "Postcode", required: true },
      { key: "country", label: "Country code", required: true, placeholder: "GB" },
      { key: "telephone", label: "Telephone", required: false },
      { key: "url", label: "Website", required: false },
      { key: "priceRange", label: "Price range", required: false, placeholder: "££" },
      { key: "hours", label: "Opening hours", required: false, list: true, placeholder: "Mo-Fr 09:00-17:30", hint: "One per line, in schema.org format." },
    ],
  },
  {
    id: "Organization",
    label: "Organization",
    note: "Company identity. Feeds the knowledge panel.",
    fields: [
      { key: "name", label: "Name", required: true },
      { key: "url", label: "Website", required: true },
      { key: "logo", label: "Logo URL", required: false },
      { key: "description", label: "Description", required: false, multiline: true },
      { key: "email", label: "Contact email", required: false },
      { key: "sameAs", label: "Social profiles", required: false, list: true, hint: "One URL per line — this is how Google links the profiles to you." },
    ],
  },
  {
    id: "Event",
    label: "Event",
    note: "Dates, venue and tickets.",
    fields: [
      { key: "name", label: "Event name", required: true },
      { key: "startDate", label: "Starts", required: true, placeholder: "2026-09-12T19:00" },
      { key: "endDate", label: "Ends", required: false, placeholder: "2026-09-12T22:00" },
      { key: "venue", label: "Venue name", required: true },
      { key: "street", label: "Street address", required: false },
      { key: "city", label: "City", required: false },
      { key: "url", label: "Ticket URL", required: false },
      { key: "price", label: "Ticket price", required: false },
      { key: "currency", label: "Currency", required: false, placeholder: "GBP" },
    ],
  },
  {
    id: "Recipe",
    label: "Recipe",
    note: "Ingredients, time and rating.",
    fields: [
      { key: "name", label: "Recipe name", required: true },
      { key: "description", label: "Description", required: false, multiline: true },
      { key: "image", label: "Image URL", required: false },
      { key: "author", label: "Author", required: false },
      { key: "prepTime", label: "Prep minutes", required: false, placeholder: "15" },
      { key: "cookTime", label: "Cook minutes", required: false, placeholder: "40" },
      { key: "yield", label: "Servings", required: false, placeholder: "4 servings" },
      { key: "ingredients", label: "Ingredients", required: true, list: true, hint: "One per line." },
      { key: "instructions", label: "Steps", required: true, list: true, hint: "One per line." },
    ],
  },
  {
    id: "BreadcrumbList",
    label: "Breadcrumbs",
    note: "Replaces the URL in a result with a readable path.",
    fields: [
      { key: "crumbs", label: "Trail", required: true, pairs: true, hint: "One per block: the label, then its URL." },
    ],
  },
];

export type Values = Record<string, string>;

/** ISO 8601 duration, which is what schema.org wants for times. */
function minutesToDuration(minutes: string): string | undefined {
  const value = Number(minutes);
  if (!Number.isFinite(value) || value <= 0) return undefined;
  return `PT${value}M`;
}

function lines(value: string | undefined): string[] {
  return (value ?? "")
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

/** Pairs are entered as alternating lines: question, answer, question, answer. */
function pairsFrom(value: string | undefined): [string, string][] {
  const entries = lines(value);
  const result: [string, string][] = [];
  for (let index = 0; index + 1 < entries.length; index += 2) {
    result.push([entries[index], entries[index + 1]]);
  }
  return result;
}

/** Drops keys whose value is empty, so no null or "" reaches the output. */
function clean<T extends Record<string, unknown>>(object: T): T {
  for (const key of Object.keys(object)) {
    const value = object[key];
    if (
      value === undefined ||
      value === "" ||
      (Array.isArray(value) && value.length === 0) ||
      (typeof value === "object" && value !== null && Object.keys(value).length === 0)
    ) {
      delete object[key];
    }
  }
  return object;
}

export function build(type: SchemaType, values: Values): Record<string, unknown> {
  const base = { "@context": "https://schema.org", "@type": type as string };

  switch (type) {
    case "Article":
      return clean({
        ...base,
        headline: values.headline,
        description: values.description,
        image: values.image ? [values.image] : undefined,
        author: values.author ? { "@type": "Person", name: values.author } : undefined,
        publisher: values.publisher
          ? { "@type": "Organization", name: values.publisher }
          : undefined,
        datePublished: values.datePublished,
        dateModified: values.dateModified || values.datePublished,
      });

    case "FAQPage":
      return clean({
        ...base,
        mainEntity: pairsFrom(values.faq).map(([question, answer]) => ({
          "@type": "Question",
          name: question,
          acceptedAnswer: { "@type": "Answer", text: answer },
        })),
      });

    case "Product":
      return clean({
        ...base,
        name: values.name,
        description: values.description,
        image: values.image ? [values.image] : undefined,
        brand: values.brand ? { "@type": "Brand", name: values.brand } : undefined,
        sku: values.sku,
        offers: clean({
          "@type": "Offer",
          price: values.price,
          priceCurrency: values.currency,
          availability: values.availability
            ? `https://schema.org/${values.availability}`
            : undefined,
        }),
        aggregateRating:
          values.ratingValue && values.reviewCount
            ? {
                "@type": "AggregateRating",
                ratingValue: values.ratingValue,
                reviewCount: values.reviewCount,
              }
            : undefined,
      });

    case "LocalBusiness":
      return clean({
        ...base,
        name: values.name,
        description: values.description,
        address: clean({
          "@type": "PostalAddress",
          streetAddress: values.street,
          addressLocality: values.city,
          addressRegion: values.region,
          postalCode: values.postcode,
          addressCountry: values.country,
        }),
        telephone: values.telephone,
        url: values.url,
        priceRange: values.priceRange,
        openingHours: lines(values.hours),
      });

    case "Organization":
      return clean({
        ...base,
        name: values.name,
        url: values.url,
        logo: values.logo,
        description: values.description,
        email: values.email,
        sameAs: lines(values.sameAs),
      });

    case "Event":
      return clean({
        ...base,
        name: values.name,
        startDate: values.startDate,
        endDate: values.endDate,
        location: clean({
          "@type": "Place",
          name: values.venue,
          address: clean({
            "@type": "PostalAddress",
            streetAddress: values.street,
            addressLocality: values.city,
          }),
        }),
        offers:
          values.price || values.url
            ? clean({
                "@type": "Offer",
                price: values.price,
                priceCurrency: values.currency,
                url: values.url,
              })
            : undefined,
      });

    case "Recipe":
      return clean({
        ...base,
        name: values.name,
        description: values.description,
        image: values.image ? [values.image] : undefined,
        author: values.author ? { "@type": "Person", name: values.author } : undefined,
        prepTime: minutesToDuration(values.prepTime),
        cookTime: minutesToDuration(values.cookTime),
        recipeYield: values.yield,
        recipeIngredient: lines(values.ingredients),
        recipeInstructions: lines(values.instructions).map((text) => ({
          "@type": "HowToStep",
          text,
        })),
      });

    case "BreadcrumbList":
      return clean({
        ...base,
        itemListElement: pairsFrom(values.crumbs).map(([name, item], index) => ({
          "@type": "ListItem",
          position: index + 1,
          name,
          item,
        })),
      });
  }
}

export function missingRequired(type: SchemaType, values: Values): string[] {
  const schema = SCHEMAS.find((entry) => entry.id === type);
  if (!schema) return [];

  return schema.fields
    .filter((field) => field.required && !(values[field.key] ?? "").trim())
    .map((field) => field.label);
}

export function toScriptTag(json: Record<string, unknown>): string {
  return `<script type="application/ld+json">\n${JSON.stringify(json, null, 2)}\n</script>`;
}
