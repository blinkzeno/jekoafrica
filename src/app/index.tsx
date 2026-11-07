import { useEffect } from 'react';
import { router } from 'expo-router';
import { Pressable, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  FadeInDown,
  FadeInUp,
  interpolate,
  scrollTo,
  useAnimatedReaction,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
  type SharedValue,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Circle, Path } from 'react-native-svg';

import { WelcomeScene } from '@/components/features/welcome/WelcomeScene';
import { JekoColors } from '@/constants/jeko';

const SLIDES = [
  {
    title: 'Vos courses, livrées par des livreurs de confiance',
    subtitle: 'Trouvez un livreur près de vous, décrivez votre course, contactez-le sur WhatsApp.',
  },
  {
    title: 'Décrivez votre course en quelques secondes',
    subtitle: 'Point de récupération, point de livraison, votre tarif : c’est tout.',
  },
  {
    title: 'Discutez directement sur WhatsApp',
    subtitle: 'Mettez-vous d’accord avec le livreur, puis suivez votre course et notez-le.',
  },
];

const MAX_CONTENT_WIDTH = 480;
const DOT_INACTIVE = 8;
const DOT_ACTIVE = 24;
const SLIDE_INTERVAL_MS = 4500;
const SLIDE_TRANSITION_MS = 1100;

function BrandPin() {
  return (
    <Svg width={22} height={22} viewBox="0 0 24 24" fill="none">
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
        fill="#E6F7F2"
        fillOpacity={0.2}
      />
      <Path
        d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5a2.5 2.5 0 1 1 0-5 2.5 2.5 0 0 1 0 5z"
        fill="#E6F7F2"
      />
      <Circle cx={17.5} cy={18.5} r={2.5} fill={JekoColors.accent} />
    </Svg>
  );
}

function ArrowRight() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none">
      <Path
        d="M5 12h14M13 6l6 6-6 6"
        stroke={JekoColors.emerald}
        strokeWidth={2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function LiveDot() {
  const opacity = useSharedValue(1);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0.35, { duration: 900, easing: Easing.inOut(Easing.ease) }),
      -1,
      true
    );
    return () => {
      opacity.value = 1;
    };
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({ opacity: opacity.value }));

  return <Animated.View className="h-1.5 w-1.5 rounded-full bg-jeko-accent" style={animatedStyle} />;
}

function Dot({
  index,
  scrollX,
  width,
}: {
  index: number;
  scrollX: SharedValue<number>;
  width: number;
}) {
  const style = useAnimatedStyle(() => {
    const input = [(index - 1) * width, index * width, (index + 1) * width];
    return {
      width: interpolate(scrollX.value, input, [DOT_INACTIVE, DOT_ACTIVE, DOT_INACTIVE], Extrapolation.CLAMP),
      opacity: interpolate(scrollX.value, input, [0.4, 1, 0.4], Extrapolation.CLAMP),
    };
  });

  return <Animated.View className="h-2 rounded bg-white" style={style} />;
}

export default function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH);
  const scrollX = useSharedValue(0);
  const autoX = useSharedValue(0);
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const slideIndex = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  useAnimatedReaction(
    () => autoX.value,
    (x) => {
      scrollTo(scrollRef, x, 0, false);
    }
  );

  const onScrollEnd = (event: { nativeEvent: { contentOffset: { x: number } } }) => {
    if (contentWidth <= 0) return;
    const nextIndex = Math.round(event.nativeEvent.contentOffset.x / contentWidth);
    const clamped = Math.max(0, Math.min(nextIndex, SLIDES.length - 1));
    slideIndex.value = clamped;
    autoX.value = clamped * contentWidth;
  };

  useEffect(() => {
    if (contentWidth <= 0) return;

    const id = setInterval(() => {
      slideIndex.value = (slideIndex.value + 1) % SLIDES.length;
      autoX.value = withTiming(slideIndex.value * contentWidth, {
        duration: SLIDE_TRANSITION_MS,
        easing: Easing.inOut(Easing.cubic),
      });
    }, SLIDE_INTERVAL_MS);

    return () => clearInterval(id);
  }, [autoX, contentWidth, slideIndex]);

  return (
    <View className="flex-1 bg-jeko-gradient-from">
      <WelcomeScene bottomInset={insets.bottom} />

      <View className="items-stretch" style={{ paddingTop: insets.top + 16 }}>
        <Animated.View
          entering={FadeInDown.duration(600)}
          className="flex-row items-center justify-between self-center px-5 pb-2 pt-3"
          style={{ width: contentWidth }}>
          <View className="flex-row items-center gap-2">
            <View className="h-10 w-10 items-center justify-center rounded-xl bg-white/10">
              <BrandPin />
            </View>
            <Text className="font-jeko-bold text-[22px] leading-7 tracking-[-0.4px] text-white">Jeko</Text>
          </View>

          <View className="flex-row items-center gap-1.5 rounded-full bg-white/15 px-3 py-1">
            <LiveDot />
            <Text className="font-jeko-semibold text-[11px] leading-[14px] tracking-[0.5px] text-white">
              Lomé • Togo
            </Text>
          </View>
        </Animated.View>

        <Animated.ScrollView
          ref={scrollRef}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          onMomentumScrollEnd={onScrollEnd}
          onScrollEndDrag={onScrollEnd}
          scrollEventThrottle={16}
          className="mt-8 grow-0 self-center"
          style={{ width: contentWidth }}>
          {SLIDES.map((slide, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(250).duration(700)}
              className="px-5"
              style={{ width: contentWidth }}>
              <Text className="font-jeko-bold text-[26px] leading-[34px] tracking-[-0.4px] text-white">
                {slide.title}
              </Text>
              <Text className="mt-3 font-jeko text-base leading-6 text-[#bcffe9d9]">{slide.subtitle}</Text>
            </Animated.View>
          ))}
        </Animated.ScrollView>

        <Animated.View
          entering={FadeInUp.delay(500)}
          accessibilityRole="tablist"
          accessibilityLabel="Étapes d'introduction"
          className="mt-6 flex-row items-center gap-2 self-center px-5"
          style={{ width: contentWidth }}>
          {SLIDES.map((_, index) => (
            <Dot key={index} index={index} scrollX={scrollX} width={contentWidth} />
          ))}
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInUp.delay(700).duration(600)}
        className="absolute bottom-0 items-center gap-3 self-center px-5"
        style={{
          width: contentWidth,
          paddingBottom: Math.max(insets.bottom, 16) + 8,
        }}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Commencer"
          className="h-[52px] w-full flex-row items-center justify-center gap-2 rounded-[14px] bg-white"
          style={({ pressed }) => [
            {
              shadowColor: '#000000',
              shadowOpacity: 0.18,
              shadowRadius: 12,
              shadowOffset: { width: 0, height: 6 },
              elevation: 4,
            },
            pressed && { opacity: 0.92, transform: [{ scale: 0.98 }] },
          ]}
          onPress={() => router.push('/signup')}>
          <Text className="font-jeko-semibold text-[15px] leading-5 text-jeko-emerald">Commencer</Text>
          <ArrowRight />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="J'ai déjà un compte"
          className="px-4 py-2"
          style={({ pressed }) => pressed && { opacity: 0.6 }}
          onPress={() => router.push('/login')}>
          <Text className="font-jeko-semibold text-[13px] leading-[18px] text-white/90">
            J&apos;ai déjà un compte
          </Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}
