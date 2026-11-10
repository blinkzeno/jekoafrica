import { router, type Href } from 'expo-router';
import { Pressable, Text } from 'react-native';

import { JekoColors, JekoFonts } from '@/constants/jeko';

/**
 * Contrôle d'en-tête des écrans carte : revient en arrière si possible,
 * sinon retombe sur l'accueil (cas d'un écran ouvert par lien direct).
 */
export default function MapBackButton() {
  const goHome = () => {
    if (router.canGoBack()) {
      router.back();
      return;
    }
    router.replace('/(client)/(home)' as Href);
  };

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityLabel="Retour à l'accueil"
      onPress={goHome}
      style={({ pressed }) => [{ paddingVertical: 6, paddingRight: 12 }, pressed && { opacity: 0.6 }]}>
      <Text style={{ fontFamily: JekoFonts.semibold, fontSize: 15, color: JekoColors.emerald }}>Accueil</Text>
    </Pressable>
  );
}
