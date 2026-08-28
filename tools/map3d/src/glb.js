// glTF 2.0 binary (.glb) writer.
//
// One primitive per material group, non-interleaved attributes, everything in
// a single embedded buffer. That is the layout Unity, Unreal, Godot, Blender
// and three.js all import without complaint.

/** glTF baseColorFactor is linear; the palette is authored in sRGB. */
function srgbToLinear(c) {
  return c <= 0.04045 ? c / 12.92 : ((c + 0.055) / 1.055) ** 2.4;
}

const MAGIC = 0x46546c67; // 'glTF'
const JSON_CHUNK = 0x4e4f534a;
const BIN_CHUNK = 0x004e4942;

const FLOAT = 5126;
const UNSIGNED_SHORT = 5123;
const UNSIGNED_INT = 5125;
const ARRAY_BUFFER = 34962;
const ELEMENT_ARRAY_BUFFER = 34963;

class BufferWriter {
  constructor() {
    this.chunks = [];
    this.length = 0;
  }

  /** Appends `buf`, 4-byte aligned, and returns its offset. */
  push(buf) {
    this.pad(4);
    const offset = this.length;
    this.chunks.push(buf);
    this.length += buf.length;
    return offset;
  }

  pad(alignment, fill = 0) {
    const rem = this.length % alignment;
    if (rem === 0) return;
    const padding = Buffer.alloc(alignment - rem, fill);
    this.chunks.push(padding);
    this.length += padding.length;
  }

  concat() {
    return Buffer.concat(this.chunks, this.length);
  }
}

/**
 * @param {import('./mesh.js').MeshBuilder} builder
 * @param {Record<string, {color: number[], roughness: number, metallic: number}>} materials
 * @param {{generator?: string, extras?: object}} [opts]
 * @returns {Buffer}
 */
export function writeGlb(builder, materials, opts = {}) {
  const bin = new BufferWriter();
  const bufferViews = [];
  const accessors = [];
  const meshes = [];
  const nodes = [];
  const gltfMaterials = [];
  const images = [];
  const textures = [];
  const materialIndex = new Map();

  const addView = (buf, target) => {
    const byteOffset = bin.push(buf);
    bufferViews.push({ buffer: 0, byteOffset, byteLength: buf.length, ...(target ? { target } : {}) });
    return bufferViews.length - 1;
  };

  const addFloatAccessor = (values, componentsPerElement, withBounds) => {
    const arr = Float32Array.from(values);
    const view = addView(Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength), ARRAY_BUFFER);
    const type = { 1: 'SCALAR', 2: 'VEC2', 3: 'VEC3', 4: 'VEC4' }[componentsPerElement];
    const accessor = {
      bufferView: view,
      componentType: FLOAT,
      count: values.length / componentsPerElement,
      type,
    };
    if (withBounds) {
      const min = new Array(componentsPerElement).fill(Infinity);
      const max = new Array(componentsPerElement).fill(-Infinity);
      for (let i = 0; i < values.length; i += componentsPerElement) {
        for (let c = 0; c < componentsPerElement; c++) {
          const v = values[i + c];
          if (v < min[c]) min[c] = v;
          if (v > max[c]) max[c] = v;
        }
      }
      accessor.min = min;
      accessor.max = max;
    }
    accessors.push(accessor);
    return accessors.length - 1;
  };

  const addIndexAccessor = (indices, vertexCount) => {
    const big = vertexCount > 65535;
    const arr = big ? Uint32Array.from(indices) : Uint16Array.from(indices);
    const view = addView(
      Buffer.from(arr.buffer, arr.byteOffset, arr.byteLength),
      ELEMENT_ARRAY_BUFFER,
    );
    accessors.push({
      bufferView: view,
      componentType: big ? UNSIGNED_INT : UNSIGNED_SHORT,
      count: indices.length,
      type: 'SCALAR',
    });
    return accessors.length - 1;
  };

  const addMaterial = (name, group) => {
    if (materialIndex.has(name)) return materialIndex.get(name);
    const spec = materials[name] ?? materials.ground ?? { color: [0.7, 0.7, 0.7], roughness: 1, metallic: 0 };

    const pbr = {
      baseColorFactor: [...spec.color.map(srgbToLinear), 1],
      metallicFactor: spec.metallic ?? 0,
      roughnessFactor: spec.roughness ?? 1,
    };

    if (group?.texture) {
      const view = addView(group.texture.data);
      images.push({ bufferView: view, mimeType: group.texture.mime });
      textures.push({ source: images.length - 1, sampler: 0 });
      pbr.baseColorTexture = { index: textures.length - 1 };
      pbr.baseColorFactor = [1, 1, 1, 1];
    }

    gltfMaterials.push({
      name,
      pbrMetallicRoughness: pbr,
      doubleSided: false,
      ...(spec.alpha != null && spec.alpha < 1
        ? { alphaMode: 'BLEND' }
        : {}),
    });
    materialIndex.set(name, gltfMaterials.length - 1);
    return gltfMaterials.length - 1;
  };

  for (const [name, group] of builder.groups) {
    if (!group.indices.length) continue;

    const position = addFloatAccessor(group.positions, 3, true);
    const normal = addFloatAccessor(group.normals, 3, false);
    const texcoord =
      group.needsUvs || group.texture ? addFloatAccessor(group.uvs, 2, false) : null;
    const indices = addIndexAccessor(group.indices, group.vertexCount);

    meshes.push({
      name,
      primitives: [
        {
          attributes: {
            POSITION: position,
            NORMAL: normal,
            ...(texcoord === null ? {} : { TEXCOORD_0: texcoord }),
          },
          indices,
          material: addMaterial(name, group),
          mode: 4,
        },
      ],
    });
    nodes.push({ name, mesh: meshes.length - 1 });
  }

  const buffer = bin.concat();

  const gltf = {
    asset: {
      version: '2.0',
      generator: opts.generator ?? 'map3d',
      ...(opts.extras ? { extras: opts.extras } : {}),
    },
    scene: 0,
    scenes: [{ name: 'map', nodes: nodes.map((_, i) => i) }],
    nodes,
    meshes,
    materials: gltfMaterials,
    accessors,
    bufferViews,
    buffers: [{ byteLength: buffer.length }],
  };

  if (images.length) {
    gltf.images = images;
    gltf.textures = textures;
    // CLAMP_TO_EDGE stops neighbouring imagery tiles bleeding into each other.
    gltf.samplers = [{ magFilter: 9729, minFilter: 9987, wrapS: 33071, wrapT: 33071 }];
  }

  return assemble(gltf, buffer);
}

function assemble(gltf, binary) {
  const jsonBuf = padTo(Buffer.from(JSON.stringify(gltf), 'utf8'), 4, 0x20);
  const binBuf = padTo(binary, 4, 0x00);

  const total = 12 + 8 + jsonBuf.length + (binBuf.length ? 8 + binBuf.length : 0);
  const out = Buffer.alloc(total);
  let o = 0;

  out.writeUInt32LE(MAGIC, o); o += 4;
  out.writeUInt32LE(2, o); o += 4;
  out.writeUInt32LE(total, o); o += 4;

  out.writeUInt32LE(jsonBuf.length, o); o += 4;
  out.writeUInt32LE(JSON_CHUNK, o); o += 4;
  jsonBuf.copy(out, o); o += jsonBuf.length;

  if (binBuf.length) {
    out.writeUInt32LE(binBuf.length, o); o += 4;
    out.writeUInt32LE(BIN_CHUNK, o); o += 4;
    binBuf.copy(out, o);
  }

  return out;
}

function padTo(buf, alignment, fill) {
  const rem = buf.length % alignment;
  if (rem === 0) return buf;
  return Buffer.concat([buf, Buffer.alloc(alignment - rem, fill)]);
}
