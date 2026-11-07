import { useEffect } from 'react';
import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, useWindowDimensions, View } from 'react-native';
import Animated, {
  Extrapolation,
  FadeInDown,
  FadeInUp,
  interpolate,
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
import { JekoColors, JekoFonts, JekoRadius } from '@/constants/jeko';

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

  return <Animated.View style={[styles.liveDot, animatedStyle]} />;
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

  return <Animated.View style={[styles.dot, style]} />;
}

export default function WelcomeScreen() {
  const { width } = useWindowDimensions();
  const insets = useSafeAreaInsets();
  const contentWidth = Math.min(width, MAX_CONTENT_WIDTH);
  const scrollX = useSharedValue(0);

  const onScroll = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  return (
    <View style={styles.root}>
      <WelcomeScene bottomInset={insets.bottom} />

      <View style={[styles.top, { paddingTop: insets.top + 16 }]}>
        <Animated.View
          entering={FadeInDown.duration(600)}
          style={[styles.header, { width: contentWidth }]}>
          <View style={styles.brandRow}>
            <View style={styles.logoBadge}>
              <BrandPin />
            </View>
            <Text style={styles.logoText}>Jeko</Text>
          </View>

          <View style={styles.locationPill}>
            <LiveDot />
            <Text style={styles.locationText}>Lomé • Togo</Text>
          </View>
        </Animated.View>

        <Animated.ScrollView
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onScroll={onScroll}
          scrollEventThrottle={16}
          style={[styles.carousel, { width: contentWidth }]}>
          {SLIDES.map((slide, index) => (
            <Animated.View
              key={index}
              entering={FadeInDown.delay(250).duration(700)}
              style={[styles.slide, { width: contentWidth }]}>
              <Text style={styles.title}>{slide.title}</Text>
              <Text style={styles.subtitle}>{slide.subtitle}</Text>
            </Animated.View>
          ))}
        </Animated.ScrollView>

        <Animated.View
          entering={FadeInUp.delay(500)}
          accessibilityRole="tablist"
          accessibilityLabel="Étapes d'introduction"
          style={[styles.dotsRow, { width: contentWidth }]}>
          {SLIDES.map((_, index) => (
            <Dot key={index} index={index} scrollX={scrollX} width={contentWidth} />
          ))}
        </Animated.View>
      </View>

      <Animated.View
        entering={FadeInUp.delay(700).duration(600)}
        style={[
          styles.footer,
          {
            width: contentWidth,
            paddingBottom: Math.max(insets.bottom, 16) + 8,
          },
        ]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel="Commencer"
          style={({ pressed }) => [styles.primaryButton, pressed && styles.primaryButtonPressed]}
          onPress={() => router.push('/signup')}>
          <Text style={styles.primaryButtonLabel}>Commencer</Text>
          <ArrowRight />
        </Pressable>

        <Pressable
          accessibilityRole="button"
          accessibilityLabel="J'ai déjà un compte"
          style={({ pressed }) => [styles.linkButton, pressed && styles.linkButtonPressed]}
          onPress={() => {
            // TODO: navigate to sign in once it exists.
          }}>
          <Text style={styles.linkLabel}>J&apos;ai déjà un compte</Text>
        </Pressable>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: JekoColors.gradientFrom,
  },
  top: {
    alignItems: 'stretch',
  },
  header: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 8,
  },
  brandRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  logoBadge: {
    width: 40,
    height: 40,
    borderRadius: 12,
    backgroundColor: JekoColors.surface10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoText: {
    fontFamily: JekoFonts.bold,
    fontSize: 22,
    lineHeight: 28,
    letterSpacing: -0.4,
    color: JekoColors.white,
  },
  locationPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: JekoRadius.pill,
    backgroundColor: JekoColors.surface15,
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: JekoColors.accent,
  },
  locationText: {
    fontFamily: JekoFonts.semibold,
    fontSize: 11,
    lineHeight: 14,
    letterSpacing: 0.5,
    color: JekoColors.white,
  },
  carousel: {
    alignSelf: 'center',
    flexGrow: 0,
    marginTop: 32,
  },
  slide: {
    paddingHorizontal: 20,
  },
  title: {
    fontFamily: JekoFonts.bold,
    fontSize: 26,
    lineHeight: 34,
    letterSpacing: -0.4,
    color: JekoColors.white,
  },
  subtitle: {
    fontFamily: JekoFonts.regular,
    fontSize: 16,
    lineHeight: 24,
    color: JekoColors.textSoft,
    marginTop: 12,
  },
  dotsRow: {
    alignSelf: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 24,
  },
  dot: {
    height: DOT_INACTIVE,
    borderRadius: DOT_INACTIVE / 2,
    backgroundColor: JekoColors.white,
  },
  footer: {
    position: 'absolute',
    bottom: 0,
    alignSelf: 'center',
    paddingHorizontal: 20,
    gap: 12,
    alignItems: 'center',
  },
  primaryButton: {
    width: '100%',
    height: 52,
    borderRadius: JekoRadius.button,
    backgroundColor: JekoColors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    shadowColor: '#000000',
    shadowOpacity: 0.18,
    shadowRadius: 12,
    shadowOffset: { width: 0, height: 6 },
    elevation: 4,
  },
  primaryButtonPressed: {
    opacity: 0.92,
    transform: [{ scale: 0.98 }],
  },
  primaryButtonLabel: {
    fontFamily: JekoFonts.semibold,
    fontSize: 15,
    lineHeight: 20,
    color: JekoColors.emerald,
  },
  linkButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  linkButtonPressed: {
    opacity: 0.6,
  },
  linkLabel: {
    fontFamily: JekoFonts.semibold,
    fontSize: 13,
    lineHeight: 18,
    color: JekoColors.textMuted,
  },
});
