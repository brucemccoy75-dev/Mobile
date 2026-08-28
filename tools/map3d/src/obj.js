// Wavefront OBJ + MTL writer, for pipelines that would rather not deal with
// glTF. One `o`/`usemtl` group per material.
//
// OBJ is Y-up and right-handed like our scene, so no axis juggling is needed.

/**
 * @param {import('./mesh.js').MeshBuilder} builder
 * @param {Record<string, object>} materials
 * @param {{mtlName?: string, name?: string}} [opts]
 * @returns {{obj: string, mtl: string}}
 */
export function writeObj(builder, materials, opts = {}) {
  const mtlName = opts.mtlName ?? 'map.mtl';
  const obj = [`# ${opts.name ?? 'map3d export'}`, `mtllib ${mtlName}`, ''];
  let vertexBase = 1; // OBJ indices are 1-based and global

  for (const [name, g] of builder.groups) {
    if (!g.indices.length) continue;
    obj.push(`o ${name}`);

    for (let i = 0; i < g.positions.length; i += 3) {
      obj.push(`v ${f(g.positions[i])} ${f(g.positions[i + 1])} ${f(g.positions[i + 2])}`);
    }
    for (let i = 0; i < g.uvs.length; i += 2) {
      obj.push(`vt ${f(g.uvs[i])} ${f(g.uvs[i + 1])}`);
    }
    for (let i = 0; i < g.normals.length; i += 3) {
      obj.push(`vn ${f(g.normals[i])} ${f(g.normals[i + 1])} ${f(g.normals[i + 2])}`);
    }

    obj.push(`usemtl ${name}`);
    for (let i = 0; i < g.indices.length; i += 3) {
      const a = g.indices[i] + vertexBase;
      const b = g.indices[i + 1] + vertexBase;
      const c = g.indices[i + 2] + vertexBase;
      obj.push(`f ${a}/${a}/${a} ${b}/${b}/${b} ${c}/${c}/${c}`);
    }
    obj.push('');
    vertexBase += g.vertexCount;
  }

  const mtl = ['# map3d materials', ''];
  for (const name of builder.groups.keys()) {
    const spec = materials[name] ?? materials.ground ?? { color: [0.7, 0.7, 0.7] };
    const [r, gg, b] = spec.color;
    mtl.push(`newmtl ${name}`);
    mtl.push(`Kd ${f(r)} ${f(gg)} ${f(b)}`);
    mtl.push(`Ka ${f(r * 0.2)} ${f(gg * 0.2)} ${f(b * 0.2)}`);
    mtl.push('Ks 0.0 0.0 0.0');
    // OBJ has no roughness, so approximate with shininess.
    mtl.push(`Ns ${f((1 - (spec.roughness ?? 1)) * 200)}`);
    mtl.push('illum 2');
    mtl.push('');
  }

  return { obj: obj.join('\n'), mtl: mtl.join('\n') };
}

function f(n) {
  return Number.isFinite(n) ? Number(n.toFixed(4)).toString() : '0';
}
