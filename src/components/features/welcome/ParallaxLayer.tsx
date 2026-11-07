import { Image as ExpoImage } from 'expo-image';
import { useEffect } from 'react';
import { Image, useWindowDimensions, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

interface Props {
  /** Bande PNG « seamless » (le bord gauche se raccorde au bord droit). */
  source: number;
  /** Hauteur d'affichage en dp ; la largeur suit le ratio de l'image. */
  height: number;
  /** Vitesse de défilement en dp/seconde. */
  speed: number;
  /** Distance depuis le bas du conteneur parent. */
  bottom: number;
  opacity?: number;
}

/** Ratio de secours si les dimensions de l'asset sont indisponibles. */
const FALLBACK_RATIO = 2.5;

interface AssetModule {
  width?: number;
  height?: number;
}

/**
 * Dimensions de l'asset, sur natif comme sur web.
 * - Natif : `require()` renvoie un id numérique → `Image.resolveAssetSource`.
 * - Web : Metro renvoie directement `{ uri, width, height, scale }`, et
 *   `Image.resolveAssetSource` n'existe pas (d'où le garde-fou).
 */
function getSourceSize(source: number): { width: number; height: number } | undefined {
  const asset = source as unknown as AssetModule | number;

  if (typeof asset === 'object' && asset !== null) {
    return asset.width && asset.height ? { width: asset.width, height: asset.height } : undefined;
  }

  if (typeof Image.resolveAssetSource === 'function') {
    const resolved = Image.resolveAssetSource(asset);
    return resolved?.width && resolved.height
      ? { width: resolved.width, height: resolved.height }
      : undefined;
  }

  return undefined;
}

/**
 * Bande horizontale qui défile à l'infini vers la gauche (effet parallaxe).
 * On duplique la bande pour couvrir l'écran + 1 tuile, puis on translate d'une tuile exacte :
 * au moment où la boucle redémarre, l'image est identique → aucun saut visible.
 */
export function ParallaxLayer({ source, height, speed, bottom, opacity = 1 }: Props) {
  const { width: screenW } = useWindowDimensions();
  const reduceMotion = useReducedMotion();

  const size = getSourceSize(source);
  const ratio = size ? size.width / size.height : FALLBACK_RATIO;
  const tileW = Math.round(height * ratio);
  const copies = Math.ceil(screenW / tileW) + 1;

  const x = useSharedValue(0);

  useEffect(() => {
    if (reduceMotion) {
      x.value = 0;
      return;
    }
    x.value = 0;
    x.value = withRepeat(
      withTiming(-tileW, { duration: (tileW / speed) * 1000, easing: Easing.linear }),
      -1,
      false
    );
    return () => cancelAnimation(x);
  }, [tileW, speed, reduceMotion, x]);

  const style = useAnimatedStyle(() => ({ transform: [{ translateX: x.value }] }));

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        { position: 'absolute', left: 0, bottom, flexDirection: 'row', opacity },
        style,
      ]}>
      {Array.from({ length: copies }).map((_, i) => (
        <View key={i} style={{ width: tileW, height }}>
          <ExpoImage source={source} style={{ width: tileW, height }} contentFit="fill" />
        </View>
      ))}
    </Animated.View>
  );
}
