// Where everything sits on and around the table. Angles in degrees: 90 is the bottom (the human's
// side, toward the camera), 270 is the top.
import * as THREE from 'three';

export const FELT_RX = 4.2;
export const FELT_RZ = 2.7;
export const SEAT_COUNT = 6;

/**
 * Seat 0 is the human at the bottom; the rest run clockwise around the table. The dealer stands at
 * the top centre like a seventh chair: three seats spread evenly up the left side, two down the
 * right, so the ring reads as uniform.
 */
export const SEAT_ANGLES = [90, 140, 183, 226, 328, 25];
export const DEALER_ANGLE = 270;

export function ellipse(angleDeg: number, k: number, y = 0): THREE.Vector3 {
  const a = (angleDeg * Math.PI) / 180;
  return new THREE.Vector3(FELT_RX * k * Math.cos(a), y, FELT_RZ * k * Math.sin(a));
}

export const seatAngle = (seat: number) => SEAT_ANGLES[seat];
export const figurePos = (seat: number) => ellipse(seatAngle(seat), 1.34, 0);
/** Your cards sit well onto the felt; the other men's small cards tuck in by the rail. */
export const holePos = (seat: number, tucked = false) => ellipse(seatAngle(seat), tucked ? 0.86 : 0.72, 0.012);
export const betPos = (seat: number) => ellipse(seatAngle(seat), 0.46, 0);
export const buttonPos = (seat: number) => ellipse(seatAngle(seat) - 16, 0.62, 0.01);
/** Plates hang from the base of the bust (the screen offset puts them just under the rail line). */
export const platePos = (seat: number) => ellipse(seatAngle(seat), 1.3, -0.1);

export const POT_POS = new THREE.Vector3(0, 0, -0.95);
export const POT_LABEL_POS = new THREE.Vector3(0, 0, -0.42);
export const BOARD_Z = 0.3;
export const BOARD_SPACING = 0.72;
export const DEALER_POS = ellipse(DEALER_ANGLE, 1.36, 0);
export const DEALER_PLATE_POS = ellipse(DEALER_ANGLE, 1.32, -0.1);
export const DEAL_ORIGIN = ellipse(DEALER_ANGLE, 0.92, 0.6);
export const MUCK_POS = ellipse(DEALER_ANGLE, 0.7, 0.01);

/** Yaw so that a figure's front (+z) looks at the table centre. */
export function faceCentre(p: THREE.Vector3): number {
  return Math.atan2(-p.x, -p.z);
}

/** Yaw so that a card's top edge points away from the seat, toward the centre. */
export function cardYaw(p: THREE.Vector3): number {
  return Math.atan2(p.x, p.z);
}

export function boardPos(i: number): THREE.Vector3 {
  return new THREE.Vector3((i - 2) * BOARD_SPACING, 0.012, BOARD_Z);
}
