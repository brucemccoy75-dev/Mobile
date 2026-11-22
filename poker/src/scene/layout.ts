// Where everything sits on and around the table. Angles in degrees: 90 is the bottom (the human's
// side, toward the camera), 270 is the top.
import * as THREE from 'three';

export const FELT_RX = 4.2;
export const FELT_RZ = 2.7;
export const SEAT_COUNT = 6;

/** Seat 0 is the human at the bottom; the rest run clockwise around the table. */
export const SEAT_ANGLES = [90, 150, 215, 270, 325, 30];
export const DEALER_ANGLE = 243;

export function ellipse(angleDeg: number, k: number, y = 0): THREE.Vector3 {
  const a = (angleDeg * Math.PI) / 180;
  return new THREE.Vector3(FELT_RX * k * Math.cos(a), y, FELT_RZ * k * Math.sin(a));
}

export const seatAngle = (seat: number) => SEAT_ANGLES[seat];
/** The two seats beside you sit a touch closer in so they stay in frame. */
export const figurePos = (seat: number) => ellipse(seatAngle(seat), seat === 1 || seat === 5 ? 1.24 : 1.34, 0);
export const holePos = (seat: number) => ellipse(seatAngle(seat), 0.72, 0.012);
export const betPos = (seat: number) => ellipse(seatAngle(seat), 0.46, 0);
export const buttonPos = (seat: number) => ellipse(seatAngle(seat) - 16, 0.62, 0.01);
/** Plates sit on each player's chest (seen from your seat, the felt is at the bottom of the frame). Neighbours' ride higher to clear the HUD. */
export const platePos = (seat: number) => {
  const p = figurePos(seat);
  p.y = seat === 1 || seat === 5 ? 1.05 : 0.62;
  return p;
};

export const POT_POS = new THREE.Vector3(0, 0, -0.95);
export const POT_LABEL_POS = new THREE.Vector3(0, 0, -0.42);
export const BOARD_Z = 0.3;
export const BOARD_SPACING = 0.72;
export const DEALER_POS = ellipse(DEALER_ANGLE, 1.42, 0);
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
