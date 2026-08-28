// MeshBuilder -> three.js, with no glTF in between.
//
// The Node path serialises to a .glb because an engine has to read it off
// disk. In a browser both ends are in the same process, so packing 15MB of
// geometry into a binary container and immediately parsing it back is pure
// overhead. We hand the typed arrays straight to BufferGeometry instead.
//
// `writeGlb` is still used, but only when someone asks for a download.

/**
 * @param {import('three')} THREE
 * @param {import('../mesh.js').MeshBuilder} builder
 * @param {Record<string, object>} materials
 * @returns {{root: object, ground: object[], stats: {meshes: number, triangles: number}}}
 */
export function buildThreeScene(THREE, builder, materials, opts = {}) {
  const groundPattern = opts.groundPattern ?? /.^/;
  const root = new THREE.Group();
  root.name = 'map';
  const ground = [];
  let triangles = 0;

  for (const [name, group] of builder.groups) {
    if (!group.indices.length) continue;

    const geometry = new THREE.BufferGeometry();
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(group.positions, 3));
    geometry.setAttribute('normal', new THREE.Float32BufferAttribute(group.normals, 3));
    if (group.needsUvs) {
      geometry.setAttribute('uv', new THREE.Float32BufferAttribute(group.uvs, 2));
    }
    // Uint16 runs out at 65535 vertices; most of these groups are far bigger.
    const IndexArray = group.vertexCount > 65535 ? Uint32Array : Uint16Array;
    geometry.setIndex(new THREE.BufferAttribute(IndexArray.from(group.indices), 1));
    geometry.computeBoundingSphere();

    const spec = materials[name] ?? materials.ground;
    const material = new THREE.MeshStandardMaterial({
      // The palette is authored in sRGB; three.js converts on assignment.
      color: new THREE.Color().setRGB(...spec.color, THREE.SRGBColorSpace),
      roughness: spec.roughness ?? 1,
      metalness: spec.metallic ?? 0,
    });

    if (group.texture) {
      material.map = textureFrom(THREE, group.texture);
      material.color.setRGB(1, 1, 1);
    }

    const mesh = new THREE.Mesh(geometry, material);
    mesh.name = name;
    mesh.receiveShadow = true;
    mesh.castShadow = !groundPattern.test(name);
    if (groundPattern.test(name)) ground.push(mesh);

    root.add(mesh);
    triangles += group.triangleCount;
  }

  return { root, ground, stats: { meshes: root.children.length, triangles } };
}

function textureFrom(THREE, { data, mime }) {
  const url = URL.createObjectURL(new Blob([data], { type: mime }));
  const texture = new THREE.TextureLoader().load(url, () => URL.revokeObjectURL(url));
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.ClampToEdgeWrapping;
  texture.wrapT = THREE.ClampToEdgeWrapping;
  texture.anisotropy = 4;
  return texture;
}

/** Frees GPU memory when leaving a world; browsers do not do this for you. */
export function disposeScene(root) {
  root.traverse((o) => {
    if (!o.isMesh) return;
    o.geometry.dispose();
    for (const m of Array.isArray(o.material) ? o.material : [o.material]) {
      m.map?.dispose();
      m.dispose();
    }
  });
}
