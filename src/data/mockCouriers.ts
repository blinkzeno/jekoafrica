export type CourierReview = {
  firstName: string;
  rating: number;
  comment: string;
  date: string;
};

export type CourierProfile = {
  id: string;
  firstName: string;
  lastName: string;
  initial: string;
  rating: string;
  reviewsCount: string;
  verified: boolean;
  stats: {
    courses: string;
    seniority: string;
    punctuality: string;
  };
  vehicle: string;
  zones: string[];
  reviews: CourierReview[];
  whatsappPhone: string;
  available: boolean;
};

export const MOCK_COURIERS: CourierProfile[] = [
  {
    id: 'kossi-amegah',
    firstName: 'Kossi',
    lastName: 'Amegah',
    initial: 'K',
    rating: '4,8',
    reviewsCount: '124 avis',
    verified: true,
    stats: {
      courses: '312 courses',
      seniority: "2 ans d'ancienneté",
      punctuality: '98 % ponctualité',
    },
    vehicle: 'Moto Yamaha YBR 125 · Rouge',
    zones: ['Bè', 'Tokoin', 'Kodjoviakopé', 'Nyékonakpoè'],
    reviews: [
      { firstName: 'Afi', rating: 5, comment: 'Très ponctuel, colis bien protégé', date: '12 avr.' },
      { firstName: 'Komlan', rating: 5, comment: 'Communication claire et livraison rapide', date: '3 avr.' },
      { firstName: 'Mawunyo', rating: 4, comment: 'Service sérieux, je recommande', date: '28 mars' },
    ],
    whatsappPhone: '22890123456',
    available: true,
  },
  {
    id: 'ama-kossi',
    firstName: 'Ama',
    lastName: 'Kossi',
    initial: 'A',
    rating: '4,9',
    reviewsCount: '98 avis',
    verified: true,
    stats: {
      courses: '204 courses',
      seniority: "1 an d'ancienneté",
      punctuality: '99 % ponctualité',
    },
    vehicle: 'Moto TVS HLX 125 · Bleu',
    zones: ['Tokoin', 'Adidogomé', 'Agoè'],
    reviews: [
      { firstName: 'Sena', rating: 5, comment: 'Très professionnelle et rapide', date: '10 avr.' },
      { firstName: 'Kodjo', rating: 5, comment: 'Course effectuée sans problème', date: '1 avr.' },
      { firstName: 'Esi', rating: 5, comment: 'Ponctuelle et très aimable', date: '25 mars' },
    ],
    whatsappPhone: '22891234567',
    available: true,
  },
  {
    id: 'yao-dossou',
    firstName: 'Yao',
    lastName: 'Dossou',
    initial: 'Y',
    rating: '4,6',
    reviewsCount: '76 avis',
    verified: true,
    stats: {
      courses: '156 courses',
      seniority: "1 an d'ancienneté",
      punctuality: '95 % ponctualité',
    },
    vehicle: 'Tricycle Bajaj · Jaune',
    zones: ['Bè', 'Hédzranawoé', 'Tokoin'],
    reviews: [
      { firstName: 'Akouvi', rating: 5, comment: 'Idéal pour les colis volumineux', date: '8 avr.' },
      { firstName: 'Koffi', rating: 4, comment: 'Un peu de retard mais très courtois', date: '30 mars' },
      { firstName: 'Adjovi', rating: 5, comment: 'Colis arrivé en parfait état', date: '22 mars' },
    ],
    whatsappPhone: '22892345678',
    available: false,
  },
  {
    id: 'mawuli-sodji',
    firstName: 'Mawuli',
    lastName: 'Sodji',
    initial: 'M',
    rating: '4,8',
    reviewsCount: '143 avis',
    verified: true,
    stats: {
      courses: '289 courses',
      seniority: "2 ans d'ancienneté",
      punctuality: '97 % ponctualité',
    },
    vehicle: 'Moto Yamaha YBR 125 · Noir',
    zones: ['Bè', 'Agoè', 'Adidogomé'],
    reviews: [
      { firstName: 'Dela', rating: 5, comment: 'Très ponctuel, colis bien protégé', date: '11 avr.' },
      { firstName: 'Yawa', rating: 4, comment: 'Bonne expérience dans l’ensemble', date: '4 avr.' },
      { firstName: 'Selom', rating: 5, comment: 'Rapide et efficace', date: '27 mars' },
    ],
    whatsappPhone: '22893456789',
    available: true,
  },
  {
    id: 'edem-tete',
    firstName: 'Edem',
    lastName: 'Tété',
    initial: 'E',
    rating: '4,7',
    reviewsCount: '61 avis',
    verified: true,
    stats: {
      courses: '118 courses',
      seniority: "8 mois d'ancienneté",
      punctuality: '96 % ponctualité',
    },
    vehicle: 'Vélo cargo · Vert',
    zones: ['Tokoin', 'Nyékonakpoè', 'Kodjoviakopé'],
    reviews: [
      { firstName: 'Ablavi', rating: 5, comment: 'Parfait pour les petits colis du quartier', date: '9 avr.' },
      { firstName: 'Foli', rating: 5, comment: 'Ponctuel et très soigneux', date: '2 avr.' },
      { firstName: 'Kossi', rating: 4, comment: 'Service fiable, bonne communication', date: '24 mars' },
    ],
    whatsappPhone: '22894567890',
    available: true,
  },
];

export function getCourierById(id?: string) {
  return MOCK_COURIERS.find((c) => c.id === id);
}
