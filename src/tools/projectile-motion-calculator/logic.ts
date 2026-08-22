/**
 * Projectile motion, ignoring air resistance.
 *
 * That omission is the whole caveat and it is not small. Without drag the
 * maximum range is always at 45 degrees and the path is a perfect parabola;
 * with it, a real thrown or fired object falls well short and the optimal angle
 * drops — for a golf ball or a bullet, considerably. The formulas here are the
 * textbook ones and they describe a vacuum.
 */

/** Standard gravity, in m/s². */
export const G = 9.80665;

export interface Launch {
  /** Initial speed, m/s. */
  speed: number;
  /** Launch angle above the horizontal, degrees. */
  angle: number;
  /** Height of the launch point above the landing plane, metres. */
  height: number;
  /** Gravity, so the Moon and Mars can be tried. */
  gravity: number;
}

export interface Trajectory {
  /** Horizontal and vertical components of the launch velocity. */
  vx: number;
  vy: number;
  /** Time to the highest point. */
  timeToApex: number;
  /** Highest point above the landing plane. */
  maxHeight: number;
  /** Total time in the air. */
  flightTime: number;
  /** Horizontal distance travelled. */
  range: number;
  /** Speed at the moment of landing. */
  impactSpeed: number;
  /** Angle below horizontal at landing, degrees. */
  impactAngle: number;
  /** Points along the path, for drawing it. */
  path: { x: number; y: number }[];
}

export function calculate(launch: Launch): Trajectory | null {
  const { speed, angle, height, gravity } = launch;

  if (!Number.isFinite(speed) || speed <= 0) return null;
  if (!Number.isFinite(angle) || angle < -90 || angle > 90) return null;
  if (!Number.isFinite(height) || height < 0) return null;
  if (!Number.isFinite(gravity) || gravity <= 0) return null;

  const radians = (angle * Math.PI) / 180;
  const vx = speed * Math.cos(radians);
  const vy = speed * Math.sin(radians);

  const timeToApex = vy / gravity;
  // Apex is above the launch point, which is itself above the ground.
  const maxHeight = height + (vy * vy) / (2 * gravity);

  /*
   * Flight time solves ½gt² − v_y·t − h = 0 for the positive root. The launch
   * height is what makes this a quadratic rather than the symmetric 2v_y/g
   * that only holds when you land at the height you started.
   */
  const discriminant = vy * vy + 2 * gravity * height;
  if (discriminant < 0) return null;
  const flightTime = (vy + Math.sqrt(discriminant)) / gravity;

  const range = vx * flightTime;

  const landingVy = vy - gravity * flightTime;
  const impactSpeed = Math.hypot(vx, landingVy);
  const impactAngle = Math.abs((Math.atan2(landingVy, vx) * 180) / Math.PI);

  const steps = 60;
  const path = Array.from({ length: steps + 1 }, (_, i) => {
    const t = (flightTime * i) / steps;
    return {
      x: vx * t,
      y: Math.max(0, height + vy * t - 0.5 * gravity * t * t),
    };
  });

  return { vx, vy, timeToApex, maxHeight, flightTime, range, impactSpeed, impactAngle, path };
}

/**
 * The angle giving the greatest range.
 *
 * 45 degrees only when launching and landing at the same height. From a raised
 * position the optimum is lower, because the extra fall time rewards a flatter,
 * faster horizontal component.
 */
export function optimalAngle(speed: number, height: number, gravity = G): number {
  if (height <= 0) return 45;
  const ratio = 1 / Math.sqrt(2 + (2 * gravity * height) / (speed * speed));
  return (Math.asin(ratio) * 180) / Math.PI;
}

export const GRAVITIES = [
  { name: "Earth", value: 9.80665 },
  { name: "Moon", value: 1.62 },
  { name: "Mars", value: 3.72 },
  { name: "Jupiter", value: 24.79 },
];
