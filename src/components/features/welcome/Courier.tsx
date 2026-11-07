import { Image as ExpoImage } from 'expo-image';
import { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

const SIZE = 150;

/**
 * Livreur : entre par la gauche et se positionne vers 40 % de la largeur,
 * puis « roule sur place » avec un léger rebond vertical et un petit tangage.
 */
export function Courier({ bottom }: { bottom: number }) {
  const { width: screenW } = useWindowDimensions();
  const reduceMotion = useReducedMotion();
  const x = useSharedValue(-SIZE);
  const y = useSharedValue(0);
  const tilt = useSharedValue(0);

  useEffect(() => {
    const target = screenW * 0.4 - SIZE / 2;
    if (reduceMotion) {
      x.value = target;
      return;
    }
    x.value = withDelay(
      300,
      withTiming(target, { duration: 1400, easing: Easing.out(Easing.cubic) })
    );
    y.value = withRepeat(
      withSequence(
        withTiming(-3, { duration: 280, easing: Easing.inOut(Easing.quad) }),
        withTiming(0, { duration: 280, easing: Easing.inOut(Easing.quad) })
      ),
      -1,
      false
    );
    tilt.value = withRepeat(
      withSequence(
        withTiming(-0.8, { duration: 700, easing: Easing.inOut(Easing.sin) }),
        withTiming(0.8, { duration: 700, easing: Easing.inOut(Easing.sin) })
      ),
      -1,
      true
    );
    return () => {
      cancelAnimation(x);
      cancelAnimation(y);
      cancelAnimation(tilt);
    };
  }, [screenW, reduceMotion, x, y, tilt]);

  const style = useAnimatedStyle(() => ({
    transform: [{ translateX: x.value }, { translateY: y.value }, { rotate: `${tilt.value}deg` }],
  }));

  return (
    <Animated.View
      pointerEvents="none"
      className="absolute left-0"
      style={[{ bottom, width: SIZE, height: SIZE }, style]}>
      <ExpoImage
        source={require('@/assets/illustrations/welcome/courier.png')}
        style={{ width: SIZE, height: SIZE }}
        contentFit="contain"
      />
    </Animated.View>
  );
}
