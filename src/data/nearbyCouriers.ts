export type NearbyCourier = {
  id: string;
  firstName: string;
  initial: string;
  color: string;
  /** Décalage fictif par rapport à la position réelle de l'utilisateur, en mètres. */
  dx: number;
  dy: number;
};

/**
 * Livreurs « disponibles » affichés autour de l'utilisateur.
 * Les identités reprennent `MOCK_COURIERS`; seuls les décalages sont inventés.
 */
export const NEARBY_COURIERS: NearbyCourier[] = [
  { id: 'kossi-amegah', firstName: 'Kossi', initial: 'K', color: '#0E7C66', dx: -230, dy: 130 },
  { id: 'ama-kossi', firstName: 'Ama', initial: 'A', color: '#1E88E5', dx: 270, dy: 80 },
  { id: 'mawuli-sodji', firstName: 'Mawuli', initial: 'M', color: '#FD761A', dx: 130, dy: -190 },
  { id: 'edem-tete', firstName: 'Edem', initial: 'E', color: '#7C3AED', dx: -160, dy: -230 },
];
