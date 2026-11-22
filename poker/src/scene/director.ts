// Camera shots: the fixed table view, plus the close-up poses the speaker panel uses.
import * as THREE from 'three';
import { figurePos } from './layout';

export interface Pose {
  pos: THREE.Vector3;
  look: THREE.Vector3;
}

/** The one and only table view: from your side of the table, a little above the rail. */
export const TABLE_VIEW: Pose = { pos: new THREE.Vector3(0, 4.7, 6.2), look: new THREE.Vector3(0, 0.35, -1.1) };

/** A close-up of a seat: a little in front of the figure, at head height. */
export function seatPose(seat: number): Pose {
  const f = figurePos(seat);
  return closeUpOf(f);
}

export function closeUpOf(point: THREE.Vector3): Pose {
  const toCentre = new THREE.Vector3(-point.x, 0, -point.z).normalize();
  const pos = point.clone().add(toCentre.multiplyScalar(2.4));
  pos.y = 1.55;
  return { pos, look: new THREE.Vector3(point.x, 1.25, point.z) };
}

export class Director {
  readonly camera: THREE.PerspectiveCamera;

  constructor(camera: THREE.PerspectiveCamera) {
    this.camera = camera;
    this.camera.position.copy(TABLE_VIEW.pos);
    this.camera.lookAt(TABLE_VIEW.look);
  }
}
