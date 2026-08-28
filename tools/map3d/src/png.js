// Minimal PNG decoder.
//
// Two of our data sources are rasters: Mapzen terrarium tiles encode elevation
// in the RGB channels, and NLCD land cover comes back as a paletted image.
// Both need real pixels, and Node already ships the hard part (zlib), so a
// decoder is about a hundred lines rather than a dependency.
//
// Supports 8- and 16-bit samples, all five colour types, and no interlacing
// (Adam7 is not used by any tile service worth the name). Always returns RGBA8.

import { inflateSync } from 'node:zlib';

const SIGNATURE = Buffer.from([137, 80, 78, 71, 13, 10, 26, 10]);

const CHANNELS = { 0: 1, 2: 3, 3: 1, 4: 2, 6: 4 };

/**
 * @param {Buffer} buf
 * @returns {{width: number, height: number, data: Uint8Array}} RGBA, 4 bytes per pixel
 */
export function decodePng(buf) {
  if (buf.length < 8 || !buf.subarray(0, 8).equals(SIGNATURE)) {
    throw new Error('not a PNG (bad signature)');
  }

  let width = 0;
  let height = 0;
  let bitDepth = 8;
  let colorType = 6;
  let interlace = 0;
  let palette = null;
  let transparency = null;
  const idat = [];

  let off = 8;
  while (off + 8 <= buf.length) {
    const length = buf.readUInt32BE(off);
    const type = buf.toString('ascii', off + 4, off + 8);
    const start = off + 8;
    const end = start + length;
    if (end > buf.length) break;

    switch (type) {
      case 'IHDR':
        width = buf.readUInt32BE(start);
        height = buf.readUInt32BE(start + 4);
        bitDepth = buf[start + 8];
        colorType = buf[start + 9];
        interlace = buf[start + 12];
        break;
      case 'PLTE':
        palette = buf.subarray(start, end);
        break;
      case 'tRNS':
        transparency = buf.subarray(start, end);
        break;
      case 'IDAT':
        idat.push(buf.subarray(start, end));
        break;
      default:
        break;
    }

    if (type === 'IEND') break;
    off = end + 4; // skip the CRC
  }

  if (!width || !height) throw new Error('PNG has no IHDR');
  if (interlace !== 0) throw new Error('interlaced PNG is not supported');
  if (bitDepth !== 8 && bitDepth !== 16) {
    throw new Error(`unsupported PNG bit depth ${bitDepth}`);
  }
  if (colorType === 3 && !palette) throw new Error('paletted PNG has no PLTE');

  const channels = CHANNELS[colorType];
  if (!channels) throw new Error(`unsupported PNG colour type ${colorType}`);

  const bytesPerSample = bitDepth / 8;
  const bpp = channels * bytesPerSample; // bytes per pixel, for the filters
  const stride = width * bpp;

  const raw = inflateSync(Buffer.concat(idat));
  if (raw.length < (stride + 1) * height) {
    throw new Error('PNG data is shorter than its header claims');
  }

  const pixels = unfilter(raw, width, height, bpp, stride);

  // Normalise everything to RGBA8.
  const out = new Uint8Array(width * height * 4);
  for (let i = 0, p = 0; i < width * height; i++) {
    const s = i * bpp;
    let r, g, b, a = 255;

    switch (colorType) {
      case 0: // greyscale
        r = g = b = pixels[s];
        break;
      case 2: // truecolour
        r = pixels[s];
        g = pixels[s + bytesPerSample];
        b = pixels[s + 2 * bytesPerSample];
        break;
      case 3: { // indexed
        const idx = pixels[s];
        r = palette[idx * 3] ?? 0;
        g = palette[idx * 3 + 1] ?? 0;
        b = palette[idx * 3 + 2] ?? 0;
        if (transparency && idx < transparency.length) a = transparency[idx];
        break;
      }
      case 4: // greyscale + alpha
        r = g = b = pixels[s];
        a = pixels[s + bytesPerSample];
        break;
      default: // 6, truecolour + alpha
        r = pixels[s];
        g = pixels[s + bytesPerSample];
        b = pixels[s + 2 * bytesPerSample];
        a = pixels[s + 3 * bytesPerSample];
        break;
    }

    out[p++] = r;
    out[p++] = g;
    out[p++] = b;
    out[p++] = a;
  }

  return { width, height, data: out };
}

/**
 * Reverses the per-scanline filters. Each row is prefixed with a filter byte;
 * `a` is the pixel to the left, `b` above, `c` above-left.
 */
function unfilter(raw, width, height, bpp, stride) {
  const out = Buffer.alloc(height * stride);
  let pos = 0;

  for (let y = 0; y < height; y++) {
    const filter = raw[pos++];
    const row = y * stride;
    const prev = row - stride;

    for (let x = 0; x < stride; x++) {
      const value = raw[pos + x];
      const a = x >= bpp ? out[row + x - bpp] : 0;
      const b = y > 0 ? out[prev + x] : 0;
      const c = y > 0 && x >= bpp ? out[prev + x - bpp] : 0;

      let recon;
      switch (filter) {
        case 0: recon = value; break;
        case 1: recon = value + a; break;
        case 2: recon = value + b; break;
        case 3: recon = value + ((a + b) >> 1); break;
        case 4: recon = value + paeth(a, b, c); break;
        default: throw new Error(`unknown PNG filter ${filter} on row ${y}`);
      }
      out[row + x] = recon & 0xff;
    }
    pos += stride;
  }

  return out;
}

function paeth(a, b, c) {
  const p = a + b - c;
  const pa = Math.abs(p - a);
  const pb = Math.abs(p - b);
  const pc = Math.abs(p - c);
  if (pa <= pb && pa <= pc) return a;
  return pb <= pc ? b : c;
}
