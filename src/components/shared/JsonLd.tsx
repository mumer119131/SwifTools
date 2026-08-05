import type { JsonLd } from "@/lib/seo";

/**
 * Renders structured data. `<` is escaped in the serialised output so a tool
 * description containing `</script>` can never break out of the tag.
 */
export function JsonLdScript({ data }: { data: JsonLd | (JsonLd | null)[] }) {
  const entries = (Array.isArray(data) ? data : [data]).filter(Boolean) as JsonLd[];

  return (
    <>
      {entries.map((entry, index) => (
        <script
          key={index}
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(entry).replace(/</g, "\\u003c") }}
        />
      ))}
    </>
  );
}
