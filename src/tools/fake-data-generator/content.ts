import type { ToolContent } from "@/config/tool-content";

export const fakeDataGeneratorContent: ToolContent = {
  steps: [
    "Choose the fields you need — names, emails, addresses, dates, IDs and more.",
    "Set how many rows to generate and pick JSON, CSV or SQL output.",
    "Copy or download the result and load it straight into your test database.",
  ],
  notes: [
    "Generates realistic but entirely fictional records — names, emails, addresses, phone numbers, companies, dates — for populating a development database, testing a form, or filling a demo. Everything is invented locally in your browser; no real person's details are involved at any point.",
    "Using real data in a test environment is one of the most common causes of accidental data exposure. Test databases get copied to laptops, shared with contractors and restored into staging environments with weaker access controls, and every copy carries the same obligations under GDPR or equivalent as production does.",
    "Realistic data also finds bugs that lorem ipsum never will: names with apostrophes and accents, addresses that run to four lines, phone numbers in several formats, and email addresses long enough to overflow a column. A form tested only with 'test test' is a form that has not been tested.",
  ],
  faq: [
    {
      question: "Is this data based on real people?",
      answer: "No. Names, addresses and details are assembled from lists of components, so any resemblance to a real person is coincidence. Nothing is looked up and nothing is transmitted.",
    },
    {
      question: "Why not use production data for testing?",
      answer: "Because test databases spread — to laptops, contractors and staging environments with weaker controls — and every copy carries the same legal obligations as production. Using synthetic data removes the risk entirely.",
    },
    {
      question: "What formats can I export?",
      answer: "JSON, CSV and SQL insert statements, which covers seeding a database, importing into a spreadsheet or dropping straight into a test fixture.",
    },
    {
      question: "Can I generate data in different locales?",
      answer: "Yes. Names, addresses and phone number formats vary by region, which is worth testing — a form that assumes a five-digit postcode breaks on a UK address, and one assuming ASCII breaks on most of the world.",
    },
    {
      question: "How much data can I generate at once?",
      answer: "Thousands of records comfortably. Generation runs in your browser, so the practical limit is memory rather than a server-side cap.",
    },
  ],
};
