/**
 * HTTP status codes, with what they actually mean in practice.
 *
 * A reference rather than a calculator. The value is in the notes: the
 * difference between 301 and 302 costs people their rankings, 401 and 403 are
 * routinely swapped, and a 200 carrying an error message in the body is one of
 * the commonest API design mistakes there is.
 */

export interface StatusCode {
  code: number;
  name: string;
  /** One line: what the server is saying. */
  meaning: string;
  /** When to use it, and what people get wrong. */
  detail?: string;
  common?: boolean;
}

export interface StatusClass {
  range: string;
  name: string;
  summary: string;
  codes: StatusCode[];
}

export const STATUS_CLASSES: StatusClass[] = [
  {
    range: "1xx",
    name: "Informational",
    summary: "The request was received and the process is continuing. Rarely seen directly.",
    codes: [
      { code: 100, name: "Continue", meaning: "Carry on sending the body." },
      { code: 101, name: "Switching Protocols", meaning: "Changing protocol, usually to a WebSocket." },
      { code: 103, name: "Early Hints", meaning: "Preload these resources while the real response is prepared." },
    ],
  },
  {
    range: "2xx",
    name: "Success",
    summary: "The request was received, understood and accepted.",
    codes: [
      { code: 200, name: "OK", meaning: "It worked.", common: true,
        detail: "Returning 200 with an error message in the body is a common and genuinely harmful mistake — clients, caches and monitoring all treat it as success." },
      { code: 201, name: "Created", meaning: "Something new exists now.",
        detail: "The correct response to a POST that created a resource. Include a Location header pointing at it." },
      { code: 202, name: "Accepted", meaning: "Queued, not finished.",
        detail: "For work handed to a background job. It says nothing about whether the work will succeed." },
      { code: 204, name: "No Content", meaning: "It worked, and there is nothing to send back.",
        detail: "The right answer to a DELETE, and to a PUT that returns nothing. The body must be empty." },
      { code: 206, name: "Partial Content", meaning: "Here is the byte range you asked for.",
        detail: "Underpins video seeking and resumable downloads." },
    ],
  },
  {
    range: "3xx",
    name: "Redirection",
    summary: "The thing you want is somewhere else.",
    codes: [
      { code: 301, name: "Moved Permanently", meaning: "It has moved, for good.", common: true,
        detail: "Passes ranking signals to the new URL and is cached hard by browsers — often indefinitely. Getting a 301 wrong is difficult to undo, because visitors stop asking your server." },
      { code: 302, name: "Found", meaning: "It is temporarily elsewhere.", common: true,
        detail: "Keeps the original URL indexed. Using 302 for a permanent move is the classic SEO error — the ranking stays on a URL you have abandoned." },
      { code: 304, name: "Not Modified", meaning: "Your cached copy is still current.",
        detail: "The response to a conditional request. Sends no body, which is the point." },
      { code: 307, name: "Temporary Redirect", meaning: "Temporary, and keep the method.",
        detail: "Unlike 302, a POST stays a POST. Prefer it where the method matters." },
      { code: 308, name: "Permanent Redirect", meaning: "Permanent, and keep the method.",
        detail: "301 for POSTs. Many clients turn a redirected POST into a GET on 301; 308 forbids that." },
    ],
  },
  {
    range: "4xx",
    name: "Client error",
    summary: "The request was wrong. Sending it again unchanged will not help.",
    codes: [
      { code: 400, name: "Bad Request", meaning: "The request itself is malformed.",
        detail: "For syntax the server cannot parse. A well-formed request that fails validation is better served by 422." },
      { code: 401, name: "Unauthorized", meaning: "We do not know who you are.", common: true,
        detail: "Misnamed: it means unauthenticated. Use it when credentials are missing or invalid, and include a WWW-Authenticate header." },
      { code: 403, name: "Forbidden", meaning: "We know who you are, and no.", common: true,
        detail: "Authenticated but not permitted. Logging in again will not help, which is precisely what distinguishes it from 401." },
      { code: 404, name: "Not Found", meaning: "There is nothing here.", common: true,
        detail: "Also the polite way to hide something's existence from someone not allowed to know about it — 403 confirms it exists." },
      { code: 405, name: "Method Not Allowed", meaning: "That verb is not supported here.",
        detail: "Must include an Allow header listing what is." },
      { code: 409, name: "Conflict", meaning: "This clashes with the current state.",
        detail: "Edit collisions, duplicate creation, version mismatches." },
      { code: 410, name: "Gone", meaning: "It existed, and has been deliberately removed.",
        detail: "Stronger than 404 and useful for search engines: it means stop asking, rather than try again later." },
      { code: 413, name: "Payload Too Large", meaning: "That upload is too big." },
      { code: 418, name: "I'm a Teapot", meaning: "It cannot brew coffee.",
        detail: "An April Fools' joke from 1998 that has survived every attempt to remove it from the standard." },
      { code: 422, name: "Unprocessable Content", meaning: "Understood, but the contents are invalid.",
        detail: "The right code for validation failures — the JSON parsed, the values were wrong." },
      { code: 429, name: "Too Many Requests", meaning: "Slow down.", common: true,
        detail: "Include a Retry-After header. Without it, clients guess, and they guess badly." },
    ],
  },
  {
    range: "5xx",
    name: "Server error",
    summary: "The request was fine. Something on this end failed.",
    codes: [
      { code: 500, name: "Internal Server Error", meaning: "Something broke and we are not saying what.", common: true,
        detail: "The catch-all. If you are returning it deliberately, there is usually a more specific code." },
      { code: 501, name: "Not Implemented", meaning: "This server does not support that at all." },
      { code: 502, name: "Bad Gateway", meaning: "A server upstream gave us nonsense.", common: true,
        detail: "Usually a proxy or load balancer reporting that the application behind it is not responding properly." },
      { code: 503, name: "Service Unavailable", meaning: "Temporarily down or overloaded.", common: true,
        detail: "The correct code for planned maintenance, and it takes a Retry-After header. Search engines treat it as temporary and come back." },
      { code: 504, name: "Gateway Timeout", meaning: "An upstream server took too long." },
      { code: 507, name: "Insufficient Storage", meaning: "The server is out of space." },
    ],
  },
];

export const ALL_CODES: StatusCode[] = STATUS_CLASSES.flatMap((group) => group.codes);

export function findCode(code: number): { status: StatusCode; group: StatusClass } | null {
  for (const group of STATUS_CLASSES) {
    const status = group.codes.find((entry) => entry.code === code);
    if (status) return { status, group };
  }
  return null;
}

/** Which class a code belongs to, even when the code itself is not listed. */
export function classOf(code: number): StatusClass | null {
  if (!Number.isInteger(code) || code < 100 || code > 599) return null;
  const first = Math.floor(code / 100);
  return STATUS_CLASSES[first - 1] ?? null;
}

/** Matches on the number, the name and the description. */
export function search(query: string): StatusCode[] {
  const text = query.trim().toLowerCase();
  if (text === "") return ALL_CODES.filter((entry) => entry.common);

  return ALL_CODES.filter(
    (entry) =>
      String(entry.code).includes(text) ||
      entry.name.toLowerCase().includes(text) ||
      entry.meaning.toLowerCase().includes(text) ||
      (entry.detail?.toLowerCase().includes(text) ?? false),
  );
}

/** The pairs people confuse, worth surfacing rather than burying. */
export const CONFUSIONS = [
  { pair: "301 vs 302", detail: "Permanent versus temporary. 301 moves your rankings to the new URL and is cached hard; 302 keeps them on the old one. Using 302 for a permanent move is the classic mistake." },
  { pair: "401 vs 403", detail: "401 means we do not know who you are — log in. 403 means we do, and you still cannot. Logging in again fixes one and not the other." },
  { pair: "400 vs 422", detail: "400 is malformed syntax the server could not parse. 422 is well-formed content that failed validation." },
  { pair: "404 vs 410", detail: "404 means not found, possibly temporarily. 410 means deliberately removed — search engines drop a 410 much faster." },
  { pair: "302 vs 307", detail: "Both temporary, but 307 preserves the request method. A POST redirected with 302 is commonly turned into a GET." },
];
