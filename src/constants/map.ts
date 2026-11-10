import type { LngLat } from '@maplibre/maplibre-react-native';

/** Style vectoriel gratuit, sans clé API (OpenFreeMap, données OpenStreetMap). */
export const MAP_STYLE = 'https://tiles.openfreemap.org/styles/liberty';

/** Lomé, Togo — format [longitude, latitude]. */
export const LOME: LngLat = [1.2255, 6.1725];

/** Cadence d'envoi du partage de position : 1 message toutes les 5 s. */
export const SEND_EVERY_MS = 5000;
