// Address -> lat/lon.
//
// Two providers:
//   nominatim (default) - free, no key, 1 request/second, OSM data.
//   google              - needs GOOGLE_MAPS_API_KEY; better at messy US
//                         addresses, apartment numbers and vanity names.
//
// Note the geocoder only decides *where* the map is centred. The 3D geometry
// always comes from OpenStreetMap (see README for why).

import { NOMINATIM_ENDPOINT, GOOGLE_GEOCODE_ENDPOINT } from './config.js';
import { requestJson, throttle, cacheKey, readCache, writeCache } from './net.js';

/**
 * @param {string} address
 * @param {{provider?: 'nominatim'|'google', apiKey?: string, cacheDir?: string}} opts
 * @returns {Promise<{lat: number, lon: number, label: string, provider: string}>}
 */
export async function geocode(address, opts = {}) {
  const provider = opts.provider ?? 'nominatim';

  // "37.4224,-122.0841" is accepted directly, so you can skip geocoding.
  const literal = parseLatLon(address);
  if (literal) {
    return { ...literal, label: `${literal.lat}, ${literal.lon}`, provider: 'literal' };
  }

  const key = cacheKey('geocode', provider, address);
  const cached = await readCache(opts.cacheDir, key);
  if (cached) return { ...cached, cached: true };

  const result =
    provider === 'google'
      ? await geocodeGoogle(address, opts.apiKey)
      : await geocodeNominatim(address);

  await writeCache(opts.cacheDir, key, result);
  return result;
}

export function parseLatLon(text) {
  const m = String(text).trim().match(/^(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)$/);
  if (!m) return null;
  const lat = parseFloat(m[1]);
  const lon = parseFloat(m[2]);
  if (Math.abs(lat) > 90 || Math.abs(lon) > 180) return null;
  return { lat, lon };
}

async function geocodeNominatim(address) {
  // Nominatim's usage policy: max 1 request per second, identify yourself.
  await throttle('nominatim', 1100);

  const url = new URL(NOMINATIM_ENDPOINT);
  url.searchParams.set('q', address);
  url.searchParams.set('format', 'jsonv2');
  url.searchParams.set('limit', '1');
  url.searchParams.set('addressdetails', '1');

  const json = await requestJson(url, { headers: { accept: 'application/json' } });
  if (!Array.isArray(json) || json.length === 0) {
    throw new Error(
      `Nominatim could not find "${address}". Try a more complete address, ` +
        `or pass coordinates directly as "lat,lon".`,
    );
  }
  const hit = json[0];
  return {
    lat: parseFloat(hit.lat),
    lon: parseFloat(hit.lon),
    label: hit.display_name,
    provider: 'nominatim',
  };
}

async function geocodeGoogle(address, apiKey) {
  const key = apiKey ?? process.env.GOOGLE_MAPS_API_KEY;
  if (!key) {
    throw new Error(
      'Google geocoding needs an API key. Pass --google-key or set GOOGLE_MAPS_API_KEY.',
    );
  }
  const url = new URL(GOOGLE_GEOCODE_ENDPOINT);
  url.searchParams.set('address', address);
  url.searchParams.set('key', key);

  const json = await requestJson(url);
  if (json.status !== 'OK' || !json.results?.length) {
    throw new Error(
      `Google geocoding failed for "${address}": ${json.status}` +
        (json.error_message ? ` - ${json.error_message}` : ''),
    );
  }
  const hit = json.results[0];
  return {
    lat: hit.geometry.location.lat,
    lon: hit.geometry.location.lng,
    label: hit.formatted_address,
    provider: 'google',
  };
}
