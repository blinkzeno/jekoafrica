import type { LngLat } from '@maplibre/maplibre-react-native';

const METERS_PER_DEGREE_LAT = 111_320;

/**
 * Décale une coordonnée d'un nombre de mètres (est = dx, nord = dy).
 * Utilisé pour placer des éléments fictifs autour d'une position réelle.
 */
export function offsetLngLat(base: LngLat, dxMeters: number, dyMeters: number): LngLat {
  const latitude = base[1] + dyMeters / METERS_PER_DEGREE_LAT;
  const lngPerMeter = 1 / (METERS_PER_DEGREE_LAT * Math.max(Math.cos((base[1] * Math.PI) / 180), 0.01));
  return [base[0] + dxMeters * lngPerMeter, latitude];
}
