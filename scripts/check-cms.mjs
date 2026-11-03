#!/usr/bin/env bun
/**
 * Directus health check for the site's data collections.
 *
 * Usage:
 *   BASE_API_URL=https://... DIRECTUS_TOKEN=... bun run cms:check
 *   bun run cms:check -- --json
 *
 * Reads `.env` automatically (Bun does this) and reports, per collection:
 *   - OK            read access works
 *   - FORBIDDEN     the public/token role cannot read it (needs a policy fix)
 *   - MISSING       the collection does not exist
 *   - EMPTY         readable but has no rows
 *   - ERROR         network / server failure
 *
 * Exits with code 1 when any collection is not OK, so CI can use it.
 */

const BASE = String(
  process.env.BASE_API_URL || "",
).trim().replace(/\/+$/, "").replace(/\/items$/, "");

const TOKEN = String(process.env.DIRECTUS_TOKEN || "").trim();

const COLLECTIONS = [
  { name: "berita", required: true, note: "News articles (translations relation)" },
  { name: "dosen_tif", required: true, note: "Lecturer directory" },
  { name: "agenda", required: true, note: "Events" },
  { name: "hero_slider", required: true, note: "Homepage hero" },
  { name: "kurikulum", required: true, note: "Curriculum" },
  { name: "prestasi", required: true, note: "Achievements" },
  { name: "information", required: false, note: "Information Technology research unit" },
  { name: "software", required: false, note: "Software Engineering research unit" },
  { name: "aiorc_fields", required: false, note: "AIORC researchers" },
  { name: "aiorc_info", required: false, note: "AIORC profile copy" },
  { name: "beasiswa", required: true, note: "Scholarships" },
  { name: "tugas_akhir", required: true, note: "Thesis announcements" },
  { name: "kerja_praktik", required: true, note: "Internship announcements" },
];

const jsonOutput = process.argv.includes("--json");

function headers() {
  return TOKEN ? { Authorization: `Bearer ${TOKEN}` } : {};
}

async function probe(collection) {
  const url = `${BASE}/items/${collection}?limit=1&fields=id`;

  try {
    const res = await fetch(url, {
      headers: headers(),
      signal: AbortSignal.timeout(10000),
    });

    let body = null;
    try {
      body = await res.json();
    } catch {
      body = null;
    }

    const code = body?.errors?.[0]?.extensions?.code;
    const message =
      body?.errors?.[0]?.message || res.statusText || `HTTP ${res.status}`;

    if (!res.ok) {
      let status = "ERROR";
      if (res.status === 401) status = "UNAUTHORIZED";
      else if (res.status === 403 || code === "FORBIDDEN") status = "FORBIDDEN";
      else if (res.status === 404) status = "MISSING";
      return { status, http: res.status, message };
    }

    const rows = Array.isArray(body?.data) ? body.data.length : 0;
    if (rows === 0) {
      return { status: "EMPTY", http: res.status, message: "readable but no rows" };
    }

    return { status: "OK", http: res.status, message: "readable" };
  } catch (error) {
    return {
      status: "ERROR",
      http: 0,
      message: error instanceof Error ? error.message : String(error),
    };
  }
}

if (!BASE) {
  console.error("BASE_API_URL is not set. Add it to .env or export it first.");
  process.exit(1);
}

const results = [];
let failed = false;

for (const collection of COLLECTIONS) {
  const result = await probe(collection.name);
  const ok = result.status === "OK" || (!collection.required && result.status === "EMPTY");

  if (!ok && collection.required) failed = true;
  if (result.status === "FORBIDDEN" || result.status === "UNAUTHORIZED") failed = true;

  results.push({ ...collection, ...result, pass: ok });
}

if (jsonOutput) {
  console.log(JSON.stringify({ base: BASE, authenticated: Boolean(TOKEN), results }, null, 2));
} else {
  console.log(`\nDirectus health check`);
  console.log(`  endpoint : ${BASE}`);
  console.log(`  token    : ${TOKEN ? "set (server-side)" : "NOT SET (public role only)"}\n`);

  const width = Math.max(...COLLECTIONS.map((c) => c.name.length));
  for (const row of results) {
    const label = row.pass ? "ok  " : "FAIL";
    console.log(
      `  [${label}] ${row.name.padEnd(width)}  ${row.status.padEnd(12)} ${row.note}`,
    );
    if (!row.pass && row.message) {
      console.log(`         ${" ".repeat(width)}  → ${row.message}`);
    }
  }

  const problems = results.filter((r) => !r.pass);
  console.log(
    `\n${results.length - problems.length}/${results.length} collections usable.` +
      (problems.length ? ` ${problems.length} need attention.` : ""),
  );
}

process.exit(failed ? 1 : 0);
