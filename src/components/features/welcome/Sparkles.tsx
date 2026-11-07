import { useEffect } from 'react';
import { View } from 'react-native';
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

interface StarProps {
  x: `${number}%`;
  y: number;
  size: number;
  delay: number;
  color: string;
}

function Star({ x, y, size, delay, color }: StarProps) {
  const reduceMotion = useReducedMotion();
  const o = useSharedValue(0.25);

  useEffect(() => {
    if (reduceMotion) return;
    o.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(1, { duration: 1200, easing: Easing.inOut(Easing.sin) }),
          withTiming(0.2, { duration: 1200, easing: Easing.inOut(Easing.sin) })
        ),
        -1,
        false
      )
    );
    return () => cancelAnimation(o);
  }, [delay, reduceMotion, o]);

  const style = useAnimatedStyle(() => ({ opacity: o.value }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          left: x,
          top: y,
          width: size,
          height: size,
          borderRadius: size,
          backgroundColor: color,
        },
        style,
      ]}
    />
  );
}

const STARS: StarProps[] = [
  { x: '12%', y: 70, size: 3, delay: 0, color: '#F6F8F7' },
  { x: '78%', y: 110, size: 4, delay: 400, color: '#F6F8F7' },
  { x: '45%', y: 40, size: 3, delay: 900, color: '#F6F8F7' },
  { x: '90%', y: 60, size: 2, delay: 1300, color: '#F6F8F7' },
  { x: '28%', y: 150, size: 2, delay: 600, color: '#F6F8F7' },
  { x: '63%', y: 190, size: 3, delay: 1700, color: '#F6F8F7' },
];

/** Étoiles qui scintillent dans le ciel (formes en code, pas d'image). */
export function Sparkles() {
  return (
    <View pointerEvents="none" style={{ position: 'absolute', top: 0, left: 0, right: 0, height: 260 }}>
      {STARS.map((star, i) => (
        <Star key={i} {...star} />
      ))}
    </View>
  );
}
