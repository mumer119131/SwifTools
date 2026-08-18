import { format, type SqlLanguage } from "sql-formatter";

export const dialects: { value: SqlLanguage; label: string }[] = [
  { value: "sql", label: "Standard SQL" },
  { value: "postgresql", label: "PostgreSQL" },
  { value: "mysql", label: "MySQL" },
  { value: "sqlite", label: "SQLite" },
  { value: "mariadb", label: "MariaDB" },
  { value: "bigquery", label: "BigQuery" },
  { value: "snowflake", label: "Snowflake" },
  { value: "redshift", label: "Redshift" },
  { value: "spark", label: "Spark SQL" },
  { value: "transactsql", label: "SQL Server (T-SQL)" },
  { value: "plsql", label: "Oracle PL/SQL" },
];

export type KeywordCase = "upper" | "lower" | "preserve";

export interface Options {
  dialect: SqlLanguage;
  indent: number;
  keywordCase: KeywordCase;
  /** Put each item in a comma list on its own line. */
  expandLists: boolean;
}

/**
 * Formats SQL.
 *
 * This only ever reshapes whitespace, casing and line breaks. It does not
 * rewrite the query, reorder clauses or touch anything inside a string literal,
 * which matters for a tool people paste production queries into: a formatter
 * that changed meaning would be worse than no formatter at all.
 */
export function formatSql(sql: string, options: Options): { output: string } | { error: string } {
  if (sql.trim() === "") return { output: "" };

  try {
    return {
      output: format(sql, {
        language: options.dialect,
        tabWidth: options.indent,
        keywordCase: options.keywordCase,
        expressionWidth: options.expandLists ? 1 : 50,
      }),
    };
  } catch (cause) {
    const message = cause instanceof Error ? cause.message : String(cause);
    return { error: message.split("\n")[0] };
  }
}

/** Strips formatting back to a single line, for pasting into code. */
export function minifySql(sql: string, dialect: SqlLanguage): { output: string } | { error: string } {
  const formatted = formatSql(sql, { dialect, indent: 2, keywordCase: "preserve", expandLists: false });
  if ("error" in formatted) return formatted;
  return { output: formatted.output.replace(/\s+/g, " ").trim() };
}
