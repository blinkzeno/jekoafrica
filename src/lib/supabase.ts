import 'react-native-url-polyfill/auto';

import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    'Missing EXPO_PUBLIC_SUPABASE_URL / EXPO_PUBLIC_SUPABASE_ANON_KEY. Add your Supabase project values to .env.local, then restart the dev server.',
  );
}

/**
 * Client Supabase côté application.
 * Seule la clé publique (anon / publishable) est utilisée ici.
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  realtime: {
    params: {
      // Le partage de position est peu bavard : inutile de garder un gros buffer.
      eventsPerSecond: 5,
    },
  },
});
