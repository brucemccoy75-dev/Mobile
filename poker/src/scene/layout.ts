// Where everything sits on and around the table. Angles in degrees: 90 is the bottom (the human's
// side, toward the camera), 270 is the top.
import * as THREE from 'three';

export const FELT_RX = 4.2;
export const FELT_RZ = 2.7;
export const SEAT_COUNT = 6;

/**
 * Eight slots at 45 degrees around the table: you at the bottom (90), the dealer at the top (270),
 * five men, and a snack table in the lower-right slot (45) so the spacing stays uniform.
 * Seat 0 is the human; the rest run clockwise.
 */
export const SEAT_ANGLES = [90, 135, 180, 225, 315, 0];
export const SNACK_ANGLE = 45;
export const DEALER_ANGLE = 270;

export function ellipse(angleDeg: number, k: number, y = 0): THREE.Vector3 {
  const a = (angleDeg * Math.PI) / 180;
  return new THREE.Vector3(FELT_RX * k * Math.cos(a), y, FELT_RZ * k * Math.sin(a));
}

export const seatAngle = (seat: number) => SEAT_ANGLES[seat];
/** Busts sit right on the rail line and overlap it, like frames propped against the table. */
export const figurePos = (seat: number) => ellipse(seatAngle(seat), 1.14, 0);
/** Your cards sit well onto the felt; the other men's small cards tuck in by the rail. */
export const holePos = (seat: number, tucked = false) => ellipse(seatAngle(seat), tucked ? 0.86 : 0.72, 0.012);
export const betPos = (seat: number) => ellipse(seatAngle(seat), 0.46, 0);
export const buttonPos = (seat: number) => ellipse(seatAngle(seat) - 16, 0.62, 0.01);
/** Plates hang from the base of the bust (the screen offset puts them just under the rail line). */
export const platePos = (seat: number) => ellipse(seatAngle(seat), 1.14, -0.1);

/** The board is the centre of the felt, large; the pot sits above it (further from you). */
export const POT_POS = new THREE.Vector3(0, 0, -1.55);
export const POT_LABEL_POS = new THREE.Vector3(0, 0, -0.98);
export const BOARD_Z = 0.05;
export const BOARD_SPACING = 0.98;
export const BOARD_SCALE = 1.45;
export const DEALER_POS = ellipse(DEALER_ANGLE, 1.14, 0);
export const SNACK_POS = ellipse(SNACK_ANGLE, 1.22, 0);
export const DEALER_PLATE_POS = ellipse(DEALER_ANGLE, 1.14, -0.1);
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
