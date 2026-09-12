// Lore: what the place is, beyond its shapes.
//
// The geometry says where the buildings are. This says what the town is called
// in full, when it was founded, how many people live there, what county it is
// in, what Wikipedia says about it, and what it says about the landmarks that
// happen to be on the map. All of it goes into manifest.place and onto the
// landmark props, for the game to put on signs, plaques and the radio.
//
// Sources, all free, all cached:
//   Nominatim  - the town's own entry (extratags carries wikidata/wikipedia)
//   Wikidata   - inception (P571), population (P1082), county (P131)
//   Wikipedia  - the summary paragraph and the History section, plain text
//
// Nothing here is fatal: a place with no article just gets less.

import { requestJson, throttle, cacheKey, readCache, writeCache } from './net.js';
import { NOMINATIM_ENDPOINT } from './config.js';

const WIKIDATA = 'https://www.wikidata.org/wiki/Special:EntityData/';
const WIKIPEDIA_API = 'https://en.wikipedia.org/w/api.php';

/**
 * @param {{address: {city?: string, county?: string, state?: string, stateCode?: string, country?: string, countryCode?: string}}} place from geocode()
 * @param {object} [opts]  { log }
 * @returns {Promise<object|null>} manifest.place
 */
export async function fetchPlaceFacts(place, opts = {}) {
  const log = opts.log ?? (() => {});
  const a = place.address ?? {};
  const city = a.city;
  if (!city) return null;
  const out = {
    name: city,
    county: a.county,
    state: a.state,
    stateCode: a.stateCode,
    country: a.country,
    countryCode: a.countryCode,
  };

  try {
    const town = await townEntry(city, a.state ?? a.country);
    if (town) {
      out.osmName = town.name;
      out.wikidata = town.wikidata;
      out.wikipedia = town.wikipedia;
      if (town.population) out.population = town.population;
    }
  } catch (err) {
    log(`  lore: town lookup failed (${err.message})`);
  }

  if (out.wikidata) {
    try {
      const wd = await wikidataEntity(out.wikidata);
      if (wd.founded) out.founded = wd.founded;
      if (wd.population && !out.population) out.population = wd.population;
      if (wd.countyId && !out.county) out.county = await wikidataLabel(wd.countyId);
    } catch (err) {
      log(`  lore: wikidata failed (${err.message})`);
    }
  }

  const title = out.wikipedia ?? (out.state ? `${city}, ${out.state}` : city);
  try {
    const article = await wikipediaExtract(title);
    if (article) {
      out.wikipediaTitle = article.title;
      if (article.summary) out.summary = article.summary;
      if (article.history.length) out.history = article.history;
    }
  } catch (err) {
    log(`  lore: wikipedia failed (${err.message})`);
  }

  const bits = [out.name, out.county, out.founded ? `est. ${out.founded}` : null, out.population ? `pop. ${out.population}` : null].filter(Boolean);
  log(`  lore: ${bits.join(', ')}${out.history ? `; ${out.history.length} lines of history` : ''}`);
  return out;
}

/**
 * Wikipedia's first paragraph for each landmark that carries a wikipedia or
 * wikidata tag, at most `limit` of them (nearest the address first).
 * @param {Array<object>} props manifest.props; landmarks get `.blurb`
 */
export async function fetchLandmarkBlurbs(props, opts = {}) {
  const log = opts.log ?? (() => {});
  const limit = opts.limit ?? 8;
  const candidates = props
    .filter((p) => p.kind === 'landmark' && (p.wikipedia || p.wikidata))
    .sort((p, q) => Math.hypot(p.x, p.z) - Math.hypot(q.x, q.z))
    .slice(0, limit);
  let n = 0;
  for (const p of candidates) {
    try {
      let title = p.wikipedia ? p.wikipedia.replace(/^en:/, '') : null;
      if (!title && p.wikidata) title = await wikidataSitelink(p.wikidata);
      if (!title) continue;
      const article = await wikipediaExtract(title);
      if (article?.summary) { p.blurb = article.summary; n++; }
    } catch (err) {
      log(`  lore: ${p.name ?? p.prop}: ${err.message}`);
    }
  }
  if (n) log(`  lore: ${n} landmark blurbs`);
  return n;
}

/* ------------------------------- nominatim -------------------------------- */

async function townEntry(city, region) {
  const q = region ? `${city}, ${region}` : city;
  const key = cacheKey('lore-town', q);
  let json = await readCache(key);
  if (!json) {
    await throttle('nominatim', 1100);
    const url = new URL(NOMINATIM_ENDPOINT);
    url.searchParams.set('q', q);
    url.searchParams.set('format', 'jsonv2');
    url.searchParams.set('limit', '3');
    url.searchParams.set('extratags', '1');
    json = await requestJson(url, { headers: { accept: 'application/json' } });
    await writeCache(key, json);
  }
  if (!Array.isArray(json)) return null;
  // The town itself, not a road or a shop that shares the name.
  const hit = json.find((h) => /^(city|town|village|hamlet|municipality|borough|suburb|neighbourhood|administrative)$/.test(h.addresstype ?? h.type)) ?? json[0];
  if (!hit) return null;
  const x = hit.extratags ?? {};
  return {
    name: hit.name ?? hit.display_name?.split(',')[0],
    wikidata: x.wikidata,
    wikipedia: x.wikipedia ? x.wikipedia.replace(/^en:/, '') : undefined,
    population: x.population ? parseInt(String(x.population).replace(/[^0-9]/g, ''), 10) || undefined : undefined,
  };
}

/* -------------------------------- wikidata -------------------------------- */

async function wikidataJson(id) {
  const key = cacheKey('lore-wd', id);
  let json = await readCache(key);
  if (!json) {
    await throttle('wikidata', 300);
    json = await requestJson(`${WIKIDATA}${id}.json`, { headers: { accept: 'application/json' } });
    await writeCache(key, json);
  }
  return json?.entities?.[id] ?? null;
}

async function wikidataEntity(id) {
  const e = await wikidataJson(id);
  const out = {};
  if (!e) return out;
  const claim = (p) => e.claims?.[p]?.[0]?.mainsnak?.datavalue?.value;
  const inception = claim('P571');
  if (inception?.time) {
    const m = String(inception.time).match(/^\+?(-?\d{1,4})/);
    if (m) out.founded = parseInt(m[1], 10);
  }
  // Population: the most recent of the statements, not the first.
  const pops = (e.claims?.P1082 ?? [])
    .map((c) => ({ n: parseInt(c.mainsnak?.datavalue?.value?.amount, 10), t: c.qualifiers?.P585?.[0]?.datavalue?.value?.time ?? '' }))
    .filter((p) => Number.isFinite(p.n))
    .sort((p, q) => (p.t < q.t ? 1 : -1));
  if (pops.length) out.population = pops[0].n;
  const county = claim('P131');
  if (county?.id) out.countyId = county.id;
  return out;
}

async function wikidataLabel(id) {
  const e = await wikidataJson(id);
  return e?.labels?.en?.value;
}

async function wikidataSitelink(id) {
  const e = await wikidataJson(id);
  return e?.sitelinks?.enwiki?.title;
}

/* -------------------------------- wikipedia ------------------------------- */

/**
 * Plain-text extract of an article: the first paragraph, and the sentences of
 * its History section (up to a dozen). Follows redirects.
 */
async function wikipediaExtract(title) {
  const key = cacheKey('lore-wp', title);
  let json = await readCache(key);
  if (!json) {
    await throttle('wikipedia', 300);
    const url = new URL(WIKIPEDIA_API);
    url.searchParams.set('action', 'query');
    url.searchParams.set('prop', 'extracts');
    url.searchParams.set('explaintext', '1');
    url.searchParams.set('redirects', '1');
    url.searchParams.set('format', 'json');
    url.searchParams.set('titles', title);
    json = await requestJson(url, { headers: { accept: 'application/json' } });
    await writeCache(key, json);
  }
  const pages = json?.query?.pages ?? {};
  const page = Object.values(pages)[0];
  if (!page || page.missing !== undefined || !page.extract) return null;
  const text = String(page.extract);
  const summary = firstSentences(text.split(/\n==/)[0], 2);
  const history = [];
  const m = text.match(/\n==\s*History\s*==\n([\s\S]*?)(?:\n==[^=]|$)/);
  if (m) {
    for (const s of sentences(m[1].replace(/\n===[^\n]*===\n/g, '\n'))) {
      if (s.length < 40 || s.length > 260) continue;
      history.push(s);
      if (history.length >= 12) break;
    }
  }
  return { title: page.title, summary, history };
}

function sentences(text) {
  return text
    .replace(/\s+/g, ' ')
    .split(/(?<=[.!?])\s+(?=[A-Z"])/)
    .map((s) => s.trim())
    .filter(Boolean);
}

function firstSentences(text, n) {
  const s = sentences(text).slice(0, n).join(' ');
  return s.length > 420 ? s.slice(0, 417).replace(/\s+\S*$/, '') + '...' : s;
}
