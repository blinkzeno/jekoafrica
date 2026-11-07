import { Image as ExpoImage } from 'expo-image';
import { LinearGradient } from 'expo-linear-gradient';
import { StyleSheet, useWindowDimensions, View } from 'react-native';

import { Courier } from './Courier';
import { ParallaxLayer } from './ParallaxLayer';
import { Sparkles } from './Sparkles';

/** Distance entre le bas de l'écran et le bas de la scène (laisse la place aux boutons). */
export const SCENE_BOTTOM_OFFSET = 190;

/**
 * Décor animé du Welcome. Empilement (du fond vers l'avant) :
 * dégradé de secours → ciel → étoiles → skyline lointaine → bâtiments proches → route → livreur.
 * Les vitesses croissantes (dp/s) créent la profondeur.
 */
export function WelcomeScene({ bottomInset }: { bottomInset: number }) {
  const { height } = useWindowDimensions();
  const base = SCENE_BOTTOM_OFFSET + bottomInset;
  // Remonte le ciel pour placer la lune au-dessus de la skyline et laisser
  // le dégradé de marque respirer sous la route (zone des boutons).
  const skyShift = -Math.round(height * 0.27);

  return (
    <View style={StyleSheet.absoluteFill} pointerEvents="none">
      <LinearGradient colors={['#0B3D36', '#0E7C66']} style={StyleSheet.absoluteFill} />
      <ExpoImage
        source={require('@/assets/illustrations/welcome/sky.png')}
        style={[StyleSheet.absoluteFill, { transform: [{ translateY: skyShift }] }]}
        contentFit="cover"
      />
      <Sparkles />

      <ParallaxLayer
        source={require('@/assets/illustrations/welcome/skyline-far.png')}
        height={170}
        speed={14}
        bottom={base + 70}
      />
      <ParallaxLayer
        source={require('@/assets/illustrations/welcome/buildings-near.png')}
        height={150}
        speed={45}
        bottom={base + 30}
      />
      <ParallaxLayer
        source={require('@/assets/illustrations/welcome/road.png')}
        height={50}
        speed={110}
        bottom={base}
      />
      <Courier bottom={base + 6} />
    </View>
  );
}
