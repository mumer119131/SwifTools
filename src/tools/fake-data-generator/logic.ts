export type FieldId =
  | "id"
  | "uuid"
  | "firstName"
  | "lastName"
  | "fullName"
  | "email"
  | "username"
  | "phone"
  | "company"
  | "jobTitle"
  | "street"
  | "city"
  | "country"
  | "postcode"
  | "date"
  | "price"
  | "quantity"
  | "boolean"
  | "sentence"
  | "url";

export interface FieldDefinition {
  id: FieldId;
  label: string;
  group: string;
}

export const fieldDefinitions: readonly FieldDefinition[] = [
  { id: "id", label: "Sequential ID", group: "Identifiers" },
  { id: "uuid", label: "UUID", group: "Identifiers" },
  { id: "firstName", label: "First name", group: "People" },
  { id: "lastName", label: "Last name", group: "People" },
  { id: "fullName", label: "Full name", group: "People" },
  { id: "email", label: "Email", group: "People" },
  { id: "username", label: "Username", group: "People" },
  { id: "phone", label: "Phone", group: "People" },
  { id: "company", label: "Company", group: "Work" },
  { id: "jobTitle", label: "Job title", group: "Work" },
  { id: "street", label: "Street address", group: "Location" },
  { id: "city", label: "City", group: "Location" },
  { id: "country", label: "Country", group: "Location" },
  { id: "postcode", label: "Postcode", group: "Location" },
  { id: "date", label: "Date", group: "Values" },
  { id: "price", label: "Price", group: "Values" },
  { id: "quantity", label: "Quantity", group: "Values" },
  { id: "boolean", label: "True / false", group: "Values" },
  { id: "sentence", label: "Sentence", group: "Values" },
  { id: "url", label: "URL", group: "Values" },
];

const FIRST_NAMES = [
  "Ada", "Alan", "Amara", "Ana", "Aziz", "Bea", "Caleb", "Chen", "Dara", "Elif", "Emil", "Farah",
  "Grace", "Hana", "Ibrahim", "Ines", "Jonas", "Kai", "Lena", "Liam", "Maya", "Nadia", "Noor",
  "Omar", "Priya", "Quinn", "Rafael", "Rosa", "Sami", "Sofia", "Tomas", "Uma", "Viktor", "Wren",
  "Yusuf", "Zara",
];

const LAST_NAMES = [
  "Abara", "Ahmed", "Bauer", "Chen", "Costa", "Dahl", "Duarte", "Eze", "Fischer", "Garcia",
  "Haddad", "Hansen", "Ibrahim", "Iversen", "Jensen", "Kaur", "Khan", "Kim", "Larsen", "Lopez",
  "Mensah", "Meyer", "Nakamura", "Novak", "Okafor", "Petrov", "Quintero", "Reyes", "Rossi",
  "Silva", "Tanaka", "Ueda", "Vargas", "Weber", "Yilmaz", "Zhang",
];

const COMPANIES = [
  "Northwind", "Blue Harbor", "Ridgeline", "Cobalt Works", "Fernwood", "Lantern Labs", "Quarry",
  "Silverpine", "Tidewater", "Vantage", "Wayfare", "Bright Anvil", "Copperleaf", "Driftwood",
];

const COMPANY_SUFFIX = ["Ltd", "Group", "Studio", "Systems", "Partners", "Co", "Labs"];

const JOB_TITLES = [
  "Product Designer", "Software Engineer", "Data Analyst", "Operations Manager",
  "Account Executive", "Technical Writer", "QA Engineer", "Support Specialist",
  "Marketing Lead", "Finance Manager", "Research Scientist", "Site Reliability Engineer",
];

const STREETS = [
  "Alder Lane", "Bridge Street", "Cedar Avenue", "Dockside Road", "Elm Court", "Foundry Way",
  "Granary Street", "Harbour Road", "Ivy Close", "Juniper Walk", "Kiln Lane", "Linden Grove",
];

const CITIES = [
  "Auckland", "Bristol", "Cape Town", "Dublin", "Edinburgh", "Freiburg", "Ghent", "Helsinki",
  "Istanbul", "Jaipur", "Kyoto", "Lisbon", "Malmo", "Nairobi", "Oslo", "Porto", "Quebec",
  "Rotterdam", "Seville", "Tallinn", "Uppsala", "Valencia",
];

const COUNTRIES = [
  "Australia", "Brazil", "Canada", "Denmark", "Estonia", "Finland", "Germany", "India", "Ireland",
  "Japan", "Kenya", "Netherlands", "New Zealand", "Norway", "Portugal", "South Africa", "Spain",
  "Sweden", "Turkey", "United Kingdom", "United States",
];

const WORDS = `system record value entry order item report client session request batch export
sample archive draft summary detail segment channel account project ticket invoice`.split(/\s+/);

/**
 * Values are drawn from `crypto.getRandomValues` rather than `Math.random`.
 *
 * Not for security — this is throwaway test data — but because `Math.random`
 * in some engines produces visible short-period patterns across thousands of
 * rows, which shows up as suspiciously repetitive fixtures.
 */
function randomInt(max: number): number {
  const buffer = new Uint32Array(1);
  crypto.getRandomValues(buffer);
  return buffer[0] % max;
}

const choose = <T,>(list: readonly T[]): T => list[randomInt(list.length)];

function generateValue(field: FieldId, row: number, seedIndex: number): string | number | boolean {
  const first = choose(FIRST_NAMES);
  const last = choose(LAST_NAMES);

  switch (field) {
    case "id":
      return row + 1;
    case "uuid":
      return crypto.randomUUID();
    case "firstName":
      return first;
    case "lastName":
      return last;
    case "fullName":
      return `${first} ${last}`;
    case "email":
      // example.com is reserved by RFC 2606 precisely so test data can't reach
      // a real inbox.
      return `${first.toLowerCase()}.${last.toLowerCase()}${randomInt(90) + 10}@example.com`;
    case "username":
      return `${first.toLowerCase()}_${last.toLowerCase()}${randomInt(900) + 100}`;
    case "phone":
      // +1-555-01xx is the reserved fictional range for the same reason.
      return `+1-555-01${String(randomInt(100)).padStart(2, "0")}`;
    case "company":
      return `${choose(COMPANIES)} ${choose(COMPANY_SUFFIX)}`;
    case "jobTitle":
      return choose(JOB_TITLES);
    case "street":
      return `${randomInt(200) + 1} ${choose(STREETS)}`;
    case "city":
      return choose(CITIES);
    case "country":
      return choose(COUNTRIES);
    case "postcode":
      return `${String.fromCharCode(65 + randomInt(26))}${String.fromCharCode(65 + randomInt(26))}${randomInt(9) + 1} ${randomInt(9)}${String.fromCharCode(65 + randomInt(26))}${String.fromCharCode(65 + randomInt(26))}`;
    case "date": {
      const start = Date.UTC(2020, 0, 1);
      const span = Date.UTC(2026, 0, 1) - start;
      return new Date(start + randomInt(Math.floor(span / 86_400_000)) * 86_400_000)
        .toISOString()
        .slice(0, 10);
    }
    case "price":
      return Number(((randomInt(50_000) + 99) / 100).toFixed(2));
    case "quantity":
      return randomInt(100) + 1;
    case "boolean":
      return randomInt(2) === 1;
    case "sentence": {
      const length = 5 + (seedIndex % 5);
      const sentence = Array.from({ length }, () => choose(WORDS)).join(" ");
      return sentence.charAt(0).toUpperCase() + sentence.slice(1) + ".";
    }
    case "url":
      return `https://example.com/${choose(WORDS)}/${randomInt(9000) + 1000}`;
    default:
      return "";
  }
}

export type Row = Record<string, string | number | boolean>;

export function generateRows(fields: FieldId[], count: number): Row[] {
  const total = Math.max(1, Math.min(1000, Math.floor(count)));

  return Array.from({ length: total }, (_, row) => {
    const record: Row = {};
    for (const [index, field] of fields.entries()) {
      record[field] = generateValue(field, row, index + row);
    }
    return record;
  });
}

export type Format = "json" | "csv" | "sql";

export function serialise(rows: Row[], format: Format, tableName: string): string {
  if (rows.length === 0) return "";

  if (format === "json") return JSON.stringify(rows, null, 2);

  const columns = Object.keys(rows[0]);

  if (format === "csv") {
    const escapeCell = (value: string | number | boolean) => {
      const text = String(value);
      // RFC 4180: quote when the value contains a comma, quote or newline.
      return /[",\n]/.test(text) ? `"${text.replace(/"/g, '""')}"` : text;
    };
    return [
      columns.join(","),
      ...rows.map((row) => columns.map((column) => escapeCell(row[column])).join(",")),
    ].join("\n");
  }

  const table = tableName.replace(/[^\w]/g, "") || "records";
  const escapeSql = (value: string | number | boolean) => {
    if (typeof value === "number") return String(value);
    if (typeof value === "boolean") return value ? "TRUE" : "FALSE";
    // Doubling the quote is the portable SQL escape.
    return `'${value.replace(/'/g, "''")}'`;
  };

  return rows
    .map(
      (row) =>
        `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${columns
          .map((column) => escapeSql(row[column]))
          .join(", ")});`,
    )
    .join("\n");
}
